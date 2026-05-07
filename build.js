// LiminalPoint - EasyList + EasyPrivacy -> separate DNR rules converter
// Nicht löschen um rule-sets neu generieren zu können
// Ausführen: node build.js

const https = require("https");
const fs = require("fs");

const LISTS = [
  {
    url:   "https://easylist.to/easylist/easylist.txt",
    out:   "rules_ads.json",
    label: "EasyList (Ads)",
  },
  {
    url:   "https://easylist.to/easylist/easyprivacy.txt",
    out:   "rules_tracker.json",
    label: "EasyPrivacy (Trackers)",
  },
];

const MAX_RULES = 29600;

const RESOURCE_MAP = {
  script:         "script",
  image:          "image",
  stylesheet:     "stylesheet",
  xmlhttprequest: "xmlhttprequest",
  document:       "main_frame",
  subdocument:    "sub_frame",
  media:          "media",
  font:           "font",
  websocket:      "websocket",
  ping:           "ping",
  beacon:         "ping",
  object:         "object",
  other:          "other",
};

const DEFAULT_TYPES = [
  "script", "image", "stylesheet", "xmlhttprequest",
  "sub_frame", "font", "media", "websocket", "ping", "object", "other"
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      res.on("error", reject);
    });
    req.on("error", reject);
  });
}

function parseOptions(optStr) {
  if (!optStr) return { types: null, thirdParty: null, skip: false };

  const opts = optStr.split(",");
  const types = [];
  let thirdParty = null;
  let skip = false;

  for (let opt of opts) {
    opt = opt.trim();

    if (["popup", "csp", "rewrite", "wasm", "webrtc"].includes(opt)) {
      skip = true;
      break;
    }

    if (opt === "third-party" || opt === "~first-party") {
      thirdParty = true;
    } else if (opt === "~third-party" || opt === "first-party") {
      thirdParty = false;
    } else {
      const neg = opt.startsWith("~");
      const name = neg ? opt.slice(1) : opt;
      if (RESOURCE_MAP[name] && !neg) {
        types.push(RESOURCE_MAP[name]);
      }
    }
  }

  return {
    types: types.length > 0 ? [...new Set(types)] : null,
    thirdParty,
    skip,
  };
}

function convert(lines) {
  const rules = [];
  let id = 1;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (
      !line ||
      line.startsWith("!") ||
      line.startsWith("[") ||
      line.includes("##") ||
      line.includes("#@#") ||
      line.includes("#?#") ||
      line.includes("#$#")
    ) continue;

    const isAllow = line.startsWith("@@");
    const raw = isAllow ? line.slice(2) : line;

    const dollarIdx = raw.lastIndexOf("$");
    let pattern = raw;
    let optStr = null;

    if (dollarIdx !== -1) {
      const after = raw.slice(dollarIdx + 1);
      if (/^[a-z~,=\-!]+$/i.test(after)) {
        pattern = raw.slice(0, dollarIdx);
        optStr = after;
      }
    }

    if (pattern.startsWith("/") && pattern.endsWith("/")) continue;
    if (!pattern || pattern === "*") continue;
    if (pattern.length < 4 && !pattern.startsWith("||")) continue;

    const { types, thirdParty, skip } = parseOptions(optStr);
    if (skip) continue;

    const condition = {
      urlFilter: pattern,
    };

    if (types) {
      condition.resourceTypes = types;
    } else if (!isAllow) {
      condition.resourceTypes = DEFAULT_TYPES;
    }

    if (thirdParty === true) {
      condition.domainType = "thirdParty";
    } else if (thirdParty === false) {
      condition.domainType = "firstParty";
    }

    const rule = {
      id: id++,
      priority: isAllow ? 2 : 1,
      action: {
        type: isAllow ? "allow" : "block",
      },
      condition,
    };

    rules.push(rule);

    if (rules.length >= MAX_RULES) break;
  }

  return rules;
}

async function main() {
  const summary = [];

  for (const list of LISTS) {
    console.log(`\nDownloading ${list.label}…`);
    console.log(`   -> ${list.url}`);

    const text = await fetch(list.url);
    const lines = text.split(/\r?\n/);
    console.log(`${lines.length} Zeilen geladen, konvertiere…`);

    const rules = convert(lines);

    const json = JSON.stringify(rules, null, 2);

    fs.writeFileSync(list.out, json);

    const sizeMB = (fs.statSync(list.out).size / 1024 / 1024).toFixed(1);

    console.log(`${rules.length} DNR-Regeln -> ${list.out} (${sizeMB} MB)`);

    summary.push({
      label: list.label,
      out: list.out,
      count: rules.length,
    });
  }

  const total = summary.reduce((s, l) => s + l.count, 0);

  console.log("\n____________________________");
  console.log("  Build Summary");
  console.log("_____________________________");

  for (const s of summary) {
    console.log(
      `  ${s.label.padEnd(24)} ${String(s.count).padStart(6)} Regeln  ->  ${s.out}`
    );
  }

  console.log(
    `  ${"TOTAL".padEnd(24)} ${String(total).padStart(6)} Regeln`
  );

  console.log("_____________________________________");
  console.log("\nFertig! Lade die Extension in Chrome neu (chrome://extensions ->).");
}

main().catch(err => {
  console.error("Fehler:", err);
  process.exit(1);
});