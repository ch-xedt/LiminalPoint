// LiminalPoint

const $ = id => document.getElementById(id);

function formatUA(ua) {
  if (!ua) return "—";
  const edge    = ua.match(/Edg\/(\d+)/);
  const firefox = ua.match(/Firefox\/(\d+)/);
  const safari  = ua.match(/Version\/(\d+).*Safari/);
  const chrome  = ua.match(/Chrome\/(\d+)/);
  if (edge)    return `Edge ${edge[1]}`;
  if (firefox) return `Firefox ${firefox[1]}`;
  if (safari)  return `Safari ${safari[1]}`;
  if (chrome)  return `Chrome ${chrome[1]}`;
  return ua.slice(0, 22) + "…";
}

function formatTZ(tz, offset) {
  if (!tz) return "—";
  const city = tz.split("/").pop().replace(/_/g, " ");
  const n = parseInt(offset);
  if (isNaN(n)) return city;
  const abs = Math.abs(n);
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  const sign = n <= 0 ? "+" : "-";
  return `${city} UTC${sign}${h}:${m}`;
}

function formatAge(ts) {
  if (!ts) return "";
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function formatBattery(level, charging) {
  if (typeof level !== "number" || !Number.isFinite(level)) {
    if (typeof charging === "boolean") return charging ? "Charging" : "Not charging";
    return "—";
  }
  const safeLevel = Math.max(0, Math.min(1, level));
  return `${Math.round(safeLevel * 100)}%${charging ? " · charging" : ""}`;
}

function fmt(n) {
  if (typeof n !== "number") return String(n);
  return n.toLocaleString("en-US");
}

function resetFields() {
  ["val-ua","val-browser","val-platform","val-lang","val-tz",
   "val-cpu","val-hw","val-screen","val-webgl","val-vendor",
   "val-battery","val-color","val-touch","val-referer"].forEach(id => {
    const el = $(id);
    if (el) el.textContent = "—";
  });
}

// --- Blocked counters ----------------------------------------------------
function renderBlocked() {
  chrome.storage.session.get(["blockedAds", "blockedTrackers"], (data) => {
    if (chrome.runtime.lastError) return;
    const ads = data.blockedAds     || 0;
    const trk = data.blockedTrackers || 0;
    const adsEl = $("val-blocked-ads");
    const trkEl = $("val-blocked-trackers");
    if (adsEl) adsEl.textContent = fmt(ads);
    if (trkEl) trkEl.textContent = fmt(trk);
  });
}

// --- Main render ---------------------------------------------------------
function render(profile, enabled) {
  const toggle = $("main-toggle");
  const stTxt  = $("status-text");
  const stAge  = $("status-time");
  const rotBtn = $("rotate-btn");

  toggle.checked = enabled;
  document.body.classList.toggle("active",   enabled);
  document.body.classList.toggle("disabled", !enabled);

  renderBlocked();

  if (!enabled) {
    stTxt.textContent = "Inactive";
    stAge.textContent = "";
    rotBtn.disabled = true;
    resetFields();
    return;
  }

  rotBtn.disabled = false;

  if (!profile) {
    stTxt.textContent = "No Profile";
    stAge.textContent = "";
    resetFields();
    return;
  }

  stTxt.textContent = "Active";
  stAge.textContent = formatAge(profile.generatedAt);

  const refEl = $("val-referer");
  if (refEl) refEl.textContent = profile.spoofedReferer || "—";

  const ua = $("val-ua");
  if (ua) {
    ua.textContent = (profile.userAgent || "").slice(0, 52) + (profile.userAgent?.length > 52 ? "…" : "");
    ua.title = profile.userAgent || "";
  }

  const br = $("val-browser");
  if (br) br.textContent = profile.browser || formatUA(profile.userAgent);

  const pl = $("val-platform");
  if (pl) pl.textContent = profile.platform || "—";

  const lg = $("val-lang");
  if (lg) lg.textContent = (profile.languages || [profile.language]).filter(Boolean).join(", ") || "—";

  const tz = $("val-tz");
  if (tz) { tz.textContent = formatTZ(profile.timezone, profile.timezoneOffset); tz.title = profile.timezone || ""; }

  const hw = $("val-hw");
  if (hw) hw.textContent = `${profile.hardwareConcurrency} cores · ${profile.deviceMemory}GB`;

  const cpu = $("val-cpu");
  if (cpu) cpu.textContent = profile.oscpu || "—";

  const gl = $("val-webgl");
  if (gl) {
    const raw = typeof profile.webglRenderer === "string" ? profile.webglRenderer.trim() : "";
    const vendorFallback = typeof profile.webglVendor === "string" ? profile.webglVendor.trim() : "";
    if (!raw) {
      gl.textContent = vendorFallback || "—";
      gl.title = vendorFallback || "";
    } else {
      let gpu = raw;
      const angleMatch = raw.match(/ANGLE \([^,]+,\s*(.*?)\s*(?:Direct3D\S*\s*(?:vs_\S+\s*ps_\S+)?)?[,)]/);
      if (angleMatch) {
        gpu = angleMatch[1].trim();
      } else {
        gpu = raw.replace(/\/PCIe\/SSE2$/i, "").replace(/\(.*?\)$/, "").trim();
      }
      gl.textContent = gpu || raw;
      gl.title = raw;
    }
  }

  const vd = $("val-vendor");
  if (vd) {
    const v = profile.webglVendor || "—";
    const parenMatch = v.match(/\(([^)]+)\)/);
    if (parenMatch) {
      vd.textContent = parenMatch[1];
    } else {
      vd.textContent = v.replace(/\s+Corporation$/i, "").replace(/\s+Inc\.?$/i, "").replace(/\/X\.org$/i, "").trim() || v;
    }
  }

  const sc = $("val-screen");
  if (sc) sc.textContent = `${profile.screenWidth}×${profile.screenHeight}`;

  const cd = $("val-color");
  if (cd) cd.textContent = `${profile.colorDepth || 24}-bit · ${profile.devicePixelRatio}x`;

  const bt = $("val-battery");
  if (bt) bt.textContent = formatBattery(profile.batteryLevel, profile.batteryCharging);

  const tp = $("val-touch");
  if (tp) {
    tp.textContent = typeof profile.batteryCharging === "boolean" ? (profile.batteryCharging ? "On AC power" : "On battery"): "—";
  }

  const sq = $("val-storage-quota");
  const su = $("val-storage-usage");
  if (sq && su && profile) {
    const gb = 1024 * 1024 * 1024;
    const quotaMap = { 4: 60*gb, 8: 120*gb, 16: 240*gb, 32: 480*gb };
    const quota = quotaMap[profile.deviceMemory] || 120*gb;

    function mulberry32popup(seed) {
      seed = seed | 0;
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0);
    }
    const rngVal = mulberry32popup(profile.layoutNoiseSeed ^ 0xABCD);
    const usage = Math.floor(quota * (0.05 + (rngVal % 40) / 100));
    sq.textContent = `${Math.round(quota / gb)} GB`;
    su.textContent = `${Math.round(usage / gb)} GB used`;
  } else if (sq && su) {
    sq.textContent = "—";
    su.textContent = "";
  }
}

function init() {
  chrome.runtime.sendMessage({ type: "GET_PROFILE" }, res => {
    if (chrome.runtime.lastError) {
      console.warn("[LiminalPoint] Could not reach background service.");
      $("status-text").textContent = "Error";
      return;
    }
    render(res?.profile ?? null, res?.enabled !== false);
  });
}

init();

$("rotate-btn").addEventListener("click", () => {
  console.log("[LiminalPoint] Generating new identity...");
  const btn = $("rotate-btn");
  btn.textContent = "Generating…";
  btn.disabled = true;
  chrome.runtime.sendMessage({ type: "ROTATE_PROFILE" }, res => {
    console.log("[LiminalPoint] New identity active.");
    btn.innerHTML = `<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:#1d1b20;flex-shrink:0"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>New Identity`;
    btn.disabled = false;
    if (chrome.runtime.lastError) return;
    render(res?.profile ?? null, true);
  });
});

$("main-toggle").addEventListener("change", e => {
  const value = e.target.checked;
  console.log(`[LiminalPoint] Protection ${value ? "enabled" : "disabled"}`);
  chrome.runtime.sendMessage({ type: "SET_ENABLED", value }, res => {
    if (chrome.runtime.lastError) return;
    render(res?.profile ?? null, value);
  });
});

$("test-btn").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://coveryourtracks.eff.org/" });
});