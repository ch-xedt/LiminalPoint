// ************************************************
//  LiminalPoint - ch.xedt -  Background Service Worker 
// ************************************************

const DEVICE_PROFILES = [

  // --------------------------- Windows / Chrome 135 ------------------------------------------------
  {
    os: "windows",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    platform: "Win32",
    browser: "Chrome 135",
    brands: [
      { brand: "Not(A:Brand", version: "8" },
      { brand: "Google Chrome", version: "135" },
      { brand: "Chromium", version: "135" },
    ],
    oscpu: "Windows NT 10.0; Win64; x64",
    screens: [
      { width: 1920, height: 1080, dpr: 1 },
      { width: 2560, height: 1440, dpr: 1 },
      { width: 1366, height: 768,  dpr: 1 },
      { width: 1920, height: 1200, dpr: 1.25 },
      { width: 1600, height: 900,  dpr: 1.25 },
      { width: 1536, height: 864,  dpr: 1.5 },
    ],
    gpus: [
      { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)" },
      { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Direct3D11 vs_5_0 ps_5_0)" },
      { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)" },
      { vendor: "Google Inc. (AMD)", renderer: "ANGLE (AMD, Radeon RX 7700 XT Direct3D11 vs_5_0 ps_5_0)"},
      { vendor: "Google Inc. (AMD)", renderer: "ANGLE (AMD, Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0)"},
      { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)"},
      { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) UHD Graphics 770 Direct3D11 vs_5_0 ps_5_0)"},
      { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)"},
    ],
    concurrencyOptions: [4, 6, 8, 12, 16],
    memoryOptions: [8, 16, 32],
    maxTouchPoints: 0,
    weight: 30,
  },

  // ------------- Windows / Chrome 134 ------------------------------------------------
  {
    os: "windows",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    platform: "Win32",
    browser: "Chrome 134",
    brands: [
      { brand: "Not(A:Brand", version: "24" },
      { brand: "Google Chrome", version: "134" },
      { brand: "Chromium", version: "134" },
    ],
    oscpu: "Windows NT 10.0; Win64; x64",
    screens: [
      { width: 1920, height: 1080, dpr: 1},
      { width: 2560, height: 1440, dpr: 1 },
      { width: 1680, height: 1050, dpr: 1 },
      { width: 1920, height: 1080, dpr: 1.5 },
    ],
    gpus: [
      { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0)"},
      { vendor: "Google Inc. (AMD)",renderer: "ANGLE (AMD, Radeon RX 7900 XTX Direct3D11 vs_5_0 ps_5_0)"},
      { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) Arc(TM) A770 Graphics Direct3D11 vs_5_0 ps_5_0)" },
      { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)"},
    ],
    concurrencyOptions: [4, 6, 8, 12],
    memoryOptions: [8, 16],
    maxTouchPoints: 0,
    weight: 15,
  },

  // ------------------------- Windows / Firefox 137 ---------------------------------------------
  {
    os: "windows",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0",
    platform: "Win32",
    browser: "Firefox 137",
    brands: [],
    oscpu: "Windows NT 10.0; Win64; x64",
    screens: [
      { width: 1920, height: 1080, dpr: 1 },
      { width: 2560, height: 1440, dpr: 1 },
      { width: 1366, height: 768,  dpr: 1 },
    ],
    gpus: [
      { vendor: "NVIDIA Corporation", renderer: "GeForce RTX 3060/PCIe/SSE2" },
      { vendor: "ATI Technologies Inc.", renderer: "Radeon RX 6700 XT" },
      { vendor: "Intel", renderer: "Intel(R) UHD Graphics 630" }, 
    ],
    concurrencyOptions: [4, 6, 8],
    memoryOptions: [8, 16],
    maxTouchPoints: 0,
    weight: 10,
  },

  // ----------------------- Windows / Firefox 138 ---------------------------------------------
  {
    os: "windows",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0",
    platform: "Win32",
    browser: "Firefox 138",
    brands: [],
    oscpu: "Windows NT 10.0; Win64; x64",
    screens: [
      { width: 1920, height: 1080, dpr: 1},
      { width: 2560, height: 1440, dpr: 1.25},
      { width: 1680, height: 1050, dpr: 1},
    ],
    gpus: [
        { vendor: "NVIDIA Corporation", renderer: "GeForce RTX 4070/PCIe/SSE2"},
        { vendor: "Intel",renderer: "Intel(R) Iris(R) Xe Graphics"  },
        { vendor: "ATI Technologies Inc.", renderer: "Radeon RX 7700 XT"},
    ],
    concurrencyOptions: [4, 8, 12],
    memoryOptions: [8, 16, 32],
    maxTouchPoints: 0,
    weight: 10,
  },

// ----------- Windows / Edge 135 -------------------------------------------
  {
    os: "windows",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0",
    platform: "Win32",
    browser: "Edge 135",
    brands: [
      { brand: "Not(A:Brand",version: "8"},
      { brand: "Chromium",version: "135" },
      { brand: "Microsoft Edge",version: "135" },
    ],
    oscpu: "Windows NT 10.0; Win64; x64",
    screens: [
      { width: 1920, height: 1080, dpr: 1},
      { width: 2560, height: 1440, dpr: 1},
      { width: 1920, height: 1080, dpr: 1.5  },
    ],
    gpus: [
      { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)" },
      { vendor: "Google Inc. (Intel)",renderer: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)" },
      { vendor: "Google Inc. (AMD)",renderer: "ANGLE (AMD, Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0)" },
    ],
    concurrencyOptions: [4, 6, 8, 12],
    memoryOptions: [8, 16],
    maxTouchPoints: 0,
    weight: 8,
  },


  // --------------------- macOS / Chrome 138 (Apple Silicon era) ------------------
  {
    os: "macos",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    platform: "MacIntel",
    browser: "Chrome 138",
    brands: [
      { brand: "Not(A:Brand", version: "8" },
      { brand: "Google Chrome", version: "138" },
      { brand: "Chromium", version: "138" },
    ],
    oscpu: "Intel Mac OS X 13_6_9",
    screens: [
      { width: 2560, height: 1664, dpr: 2 },
      { width: 2560, height: 1600, dpr: 2 },
      { width: 1440, height: 900,  dpr: 2 },
      { width: 3456, height: 2234, dpr: 2 },  // MBP 16"
    ],
    gpus: [
      { vendor: "Apple Inc.", renderer: "Apple M2"},
      { vendor: "Apple Inc.", renderer: "Apple M2 Pro"},
      { vendor: "Apple Inc.", renderer: "Apple M3"},
      { vendor: "Apple Inc.", renderer: "Apple M1"},
      { vendor: "Apple Inc.", renderer: "Apple M1 Pro"},
    ],
    concurrencyOptions: [8, 10, 12],
    memoryOptions: [8, 16],
    maxTouchPoints: 0,
    weight: 15,
  },

  // ------------- macOS / Chrome 135 (Intel era) ------------------------------
  {
    os: "macos",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    platform: "MacIntel",
    browser: "Chrome 135",
    brands: [
      { brand: "Not(A:Brand", version: "8" },
      { brand: "Google Chrome", version: "135" },
      { brand: "Chromium", version: "135" },
    ],
    oscpu: "Intel Mac OS X 10.15",
    screens: [
      { width: 2560, height: 1600, dpr: 2 },
      { width: 1280, height: 800,  dpr: 2 },
      { width: 2560, height: 1440, dpr: 1 },  // external monitor
    ],
    gpus: [
      { vendor: "Intel Inc.", renderer: "Intel Iris Plus Graphics" },
      { vendor: "Intel Inc.", renderer: "Intel UHD Graphics 617"  },
      { vendor: "Intel Inc.", renderer: "Intel Iris Pro Graphics 580" },
    ],
    concurrencyOptions: [8, 10],
    memoryOptions: [8, 16],
    maxTouchPoints: 0,
    weight: 10,
  },

  // ------------------- macOS / Safari 18 ---------------------------------------------------
  {
    os: "macos",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Safari/605.1.15",
    platform: "MacIntel",
    browser: "Safari 18",
    brands: [],
    oscpu: null,
    screens: [
      { width: 3456, height: 2234, dpr: 2 },
      { width: 2560, height: 1664, dpr: 2 },
      { width: 3024, height: 1964, dpr: 2 },
      { width: 2560, height: 1440, dpr: 1 },
    ],
    gpus: [
      { vendor: "Apple Inc.", renderer: "Apple M3 Pro"},
      { vendor: "Apple Inc.", renderer: "Apple M3"},
      { vendor: "Apple Inc.", renderer: "Apple M2 Pro"},
      { vendor: "Apple Inc.", renderer: "Apple M2"},
    ],
    concurrencyOptions: [10, 12, 16],
    memoryOptions: [16, 32],
    maxTouchPoints: 0,
    weight: 10,
  },


  // ------------------- Linux / Chrome 135 ------------------------------------------------
  {
    os: "linux",
    ua: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    platform: "Linux x86_64",
    browser: "Chrome 135",
    brands: [
      { brand: "Not(A:Brand", version: "8" },
      { brand: "Google Chrome", version: "135" },
      { brand: "Chromium", version: "135" },
    ],
    oscpu: "Linux x86_64",
    architecture: "x86",
    platformVersion: "6.5.0",
    screens: [
      { width: 1920, height: 1080, dpr: 1 },
      { width: 2560, height: 1440, dpr: 1 },
      { width: 1920, height: 1200, dpr: 1 },
      { width: 3840, height: 2160, dpr: 1 },
    ],
    gpus: [
      { vendor: "Mesa/X.org", renderer: "Mesa AMD Radeon RX 6600 XT (RADV NAVI23)"},
      { vendor: "Mesa/X.org", renderer: "Mesa AMD Radeon RX 580 Series (POLARIS10)"},
      { vendor: "Mesa/X.org", renderer: "Mesa Intel(R) UHD Graphics 630 (CFL GT2)"},
      { vendor: "Mesa/X.org", renderer: "Mesa Intel(R) Iris(R) Plus Graphics"},
      { vendor: "Mesa/X.org", renderer: "Mesa Intel(R) Xe Graphics (TGL GT2)"},
    ],
    concurrencyOptions: [4, 6, 8, 12, 16],
    memoryOptions: [8, 16, 32],
    maxTouchPoints: 0,
    weight: 5,
  },

  // ------------------- Linux / Firefox 137 ------------------------------------------------
  {
    os: "linux",
    ua: "Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0",
    platform: "Linux x86_64",
    browser: "Firefox 137",
    brands: [],
    oscpu: "Linux x86_64",
    architecture: "x86",
    platformVersion: "6.5.0",
    screens: [
      { width: 1920, height: 1080, dpr: 1 },
      { width: 2560, height: 1440, dpr: 1 },
      { width: 1280, height: 1024, dpr: 1 },
    ],
    gpus: [
      { vendor: "Mesa/X.org", renderer: "Mesa AMD Radeon RX 6700 XT (RADV NAVI22)"},
      { vendor: "Mesa/X.org", renderer: "Mesa Intel(R) UHD Graphics 630 (CFL GT2)"},
      { vendor: "Mesa/X.org", renderer: "Mesa Intel(R) Iris(R) Plus Graphics"},
    ],
    concurrencyOptions: [4, 6, 8],
    memoryOptions: [8, 16],
    maxTouchPoints: 0,
    weight: 5,
  },

  // ----------- Linux / Firefox 138 ----------------------------
  {
    os: "linux",
    ua: "Mozilla/5.0 (X11; Linux x86_64; rv:138.0) Gecko/20100101 Firefox/138.0",
    platform: "Linux x86_64",
    browser: "Firefox 138",
    brands: [],
    oscpu: "Linux x86_64",
    architecture: "x86",
    platformVersion: "6.8.0",
    screens: [
      { width: 1920, height: 1080, dpr: 1 },
      { width: 2560, height: 1440, dpr: 1 },
      { width: 3440, height: 1440, dpr: 1 },
    ],
    gpus: [
      { vendor: "Mesa/X.org", renderer: "Mesa AMD Radeon RX 7900 XTX (RADV NAVI31)"},
      { vendor: "Mesa/X.org", renderer: "Mesa AMD Radeon RX 6600 XT (RADV NAVI23)"},
      { vendor: "Mesa/X.org", renderer: "Mesa Intel(R) Xe Graphics (TGL GT2)"},
    ],
    concurrencyOptions: [4, 8, 12, 16],
    memoryOptions: [8, 16, 32],
    maxTouchPoints: 0,
    weight: 5,
  },

  // ---------- macOS / Safari 19 ---------------------------------------------------
  {
    os: "macos",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15",
    platform: "MacIntel",
    browser: "Safari 19",
    brands: [],
    oscpu: null,
    screens: [
      { width: 3456, height: 2234, dpr: 2 },
      { width: 2560, height: 1664, dpr: 2 },
    ],
    gpus: [
      { vendor: "Apple Inc.", renderer: "Apple M3 Pro"},
      { vendor: "Apple Inc.", renderer: "Apple M4"},
    ],
    concurrencyOptions: [12, 16],
    memoryOptions: [16, 32],
    maxTouchPoints: 0,
    weight: 5,
  },

  // ------------------------------------- macOS / Firefox 138 -------------------------------------------
  {
    os: "macos",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.7; rv:138.0) Gecko/20100101 Firefox/138.0",
    platform: "MacIntel",
    browser: "Firefox 138",
    brands: [],
    oscpu: "Intel Mac OS X 14.7",
    screens: [
      { width: 2560, height: 1664, dpr: 2 },
      { width: 1440, height: 900,  dpr: 2 },
      { width: 2560, height: 1600, dpr: 2 },
    ],
    gpus: [
      { vendor: "Apple Inc.", renderer: "Apple M2"     },
      { vendor: "Apple Inc.", renderer: "Apple M3"     },
      { vendor: "Apple Inc.", renderer: "Apple M3 Pro" },
    ],
    concurrencyOptions: [8, 10, 12],
    memoryOptions: [8, 16],
    maxTouchPoints: 0,
    weight: 5,
  },

];

// ------------------- Region Profiles -------------------------
const REGION_PROFILES = [
  { timezone: "America/New_York",   language: "en-US", languages: ["en-US", "en"] },
  { timezone: "America/Chicago",    language: "en-US", languages: ["en-US", "en"] },
  { timezone: "America/Denver",     language: "en-US", languages: ["en-US", "en"] },
  { timezone: "America/Los_Angeles",language: "en-US", languages: ["en-US", "en"] },
  { timezone: "America/Sao_Paulo",  language: "pt-BR", languages: ["pt-BR", "pt"] },
  { timezone: "Europe/London",      language: "en-GB", languages: ["en-GB", "en"] },
  { timezone: "Europe/Berlin",      language: "de-DE", languages: ["de-DE", "de"] },
  { timezone: "Europe/Madrid",      language: "es-ES", languages: ["es-ES", "es"] },
  { timezone: "Europe/Paris",       language: "fr-FR", languages: ["fr-FR", "fr"] },
  { timezone: "Europe/Oslo",        language: "nb-NO", languages: ["nb-NO", "nb", "no"] },
  { timezone: "Europe/Warsaw",      language: "pl-PL", languages: ["pl-PL", "pl"] },
  { timezone: "Europe/Amsterdam",   language: "nl-NL", languages: ["nl-NL", "nl"] },
  { timezone: "Asia/Tokyo",         language: "ja-JP", languages: ["ja-JP", "ja"] },
  { timezone: "Asia/Shanghai",      language: "zh-CN", languages: ["zh-CN", "zh"] },
  { timezone: "Asia/Seoul",         language: "ko-KR", languages: ["ko-KR", "ko"] },
  { timezone: "Asia/Dubai",         language: "en-US", languages: ["en-US", "en"] },
  { timezone: "Asia/Bangkok",       language: "th-TH", languages: ["th-TH", "th"] },
  { timezone: "Australia/Sydney",   language: "en-AU", languages: ["en-AU", "en"] },
  { timezone: "Pacific/Auckland",   language: "en-NZ", languages: ["en-NZ", "en"] },
  { timezone: "Pacific/Honolulu",   language: "en-US", languages: ["en-US", "en"] },
];

// --------------- Plugin sets -------------------------------
const PLUGINS_CONFIG = [
  [
    { name: "PDF Viewer", description: "Portable Document Format", filename: "internal-pdf-viewer", mimetypes: [{ type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" }] },
    { name: "Chrome PDF Viewer",description: "Portable Document Format", filename: "internal-pdf-viewer", mimetypes: [{ type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" }] },
    { name: "Chromium PDF Viewer",description: "Portable Document Format", filename: "internal-pdf-viewer", mimetypes: [{ type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" }] },
    { name: "Microsoft Edge PDF Viewer",description: "Portable Document Format", filename: "internal-pdf-viewer", mimetypes: [{ type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" }] },
    { name: "WebKit built-in PDF",description: "Portable Document Format", filename: "internal-pdf-viewer", mimetypes: [{ type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" }] },
  ],
  [
    { name: "PDF Viewer",description: "Portable Document Format", filename: "internal-pdf-viewer", mimetypes: [{ type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" }] },
  ],
];

const BATTERY_LEVELS  = [0.11, 0.44, 0.56, 0.68, 0.72, 0.81, 0.88, 0.94, 0.99];
const BATTERY_CHARGES = [true, true, true, false, false, false];
const COLOR_SCHEMES   = ["light", "dark"];

// --------- Sampling helpers ------------------------------------------------------
function cryptoRandFloat() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}

function rand(arr) {
  return arr[Math.floor(cryptoRandFloat() * arr.length)];
}

function weightedRand(arr) {
  const total = arr.reduce((s, item) => s + (item.weight || 1), 0);
  let r = cryptoRandFloat() * total;
  for (const item of arr) {
    r -= (item.weight || 1);
    if (r <= 0) return item;
  }
  return arr[arr.length - 1];
}

// -------------- Profile validation ---------------------------------------------------
function isProfileComplete(profile) {
  if (!profile || typeof profile !== "object") return false;
  const str = (v) => typeof v === "string" && v.trim().length > 0;
  const num = (v) => typeof v === "number" && Number.isFinite(v);

  return (
    str(profile.userAgent) &&
    str(profile.platform) &&
    str(profile.browser) &&
    str(profile.language) &&
    Array.isArray(profile.languages) && profile.languages.length > 0 &&
    num(profile.hardwareConcurrency) &&
    num(profile.deviceMemory) &&
    num(profile.maxTouchPoints) &&
    num(profile.screenWidth) && num(profile.screenHeight) &&
    num(profile.colorDepth) && num(profile.devicePixelRatio) &&
    str(profile.timezone) && profile.timezone !== "UTC" && num(profile.timezoneOffset) &&
    str(profile.webglVendor) && str(profile.webglRenderer) &&
    num(profile.batteryLevel) && profile.batteryLevel >= 0 && profile.batteryLevel <= 1 &&
    typeof profile.batteryCharging === "boolean" &&
    num(profile.canvasNoiseSeed) &&
    num(profile.audioNoiseSeed) &&
    num(profile.timingNoiseSeed) &&
    num(profile.layoutNoiseSeed) &&
    num(profile.webglNoiseSeed) &&
    num(profile.generatedAt) &&
    ["light", "dark"].includes(profile.prefersColorScheme)
  );
}

// ------ DST-aware UTC offset ------------------------------------------------
function getRealOffset(timezone) {
  try {
    const date = new Date();
    const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tz  = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    return Math.round((utc - tz) / 60000); // Seoul → -540
  } catch(e) {
    return 0;
  }
}


// ------------------ Secure Handshake State ------------------------------------------------
const handshakeState = new Map(); // Map<Challenge, Timestamp>
const HANDSHAKE_TIMEOUT = 5000; // 5 Sekunden Gültigkeit
const MAX_CHALLENGES = 100;       // Maximale Anzahl gespeicherter Challenges (Schutz vor DoS)

function generateHandshakeChallenge() {
  // 1. Aufräumen: Alte, abgelaufene Challenges löschen
  const now = Date.now();
  for (const [challenge, timestamp] of handshakeState.entries()) {
    if (now - timestamp > HANDSHAKE_TIMEOUT) {
      handshakeState.delete(challenge);
    }
  }

  // 2. Limit prüfen: Wenn noch zu viele aktive Challenges existieren,
  if (handshakeState.size >= MAX_CHALLENGES) {
    let oldestTimestamp = Infinity;
    let oldestChallenge = null;

    for (const [challenge, timestamp] of handshakeState.entries()) {
      if (timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
        oldestChallenge = challenge;
      }
    }

    if (oldestChallenge) {
      handshakeState.delete(oldestChallenge);
      console.log(`[LiminalPoint] Challenge-Limit erreicht. Älteste Challenge gelöscht.`);
    }
  }

  // 3. Neue Challenge generieren
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const challenge = Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
  
  handshakeState.set(challenge, now);
  return challenge;
}

function validateHandshakeChallenge(challenge) {
  if (!challenge || typeof challenge !== "string") return false;
  
  if (handshakeState.size > MAX_CHALLENGES * 1.5) {
     const now = Date.now();
     for (const [c, ts] of handshakeState) {
       if (now - ts > HANDSHAKE_TIMEOUT) handshakeState.delete(c);
     }
  }

  const timestamp = handshakeState.get(challenge);
  if (timestamp === undefined) return false;
  
  if (Date.now() - timestamp > HANDSHAKE_TIMEOUT) {
    handshakeState.delete(challenge);
    return false;
  }
  
  handshakeState.delete(challenge);
  return true;
}


// -- Profile generation ----------------------

function generateProfile() {
  const device = weightedRand(DEVICE_PROFILES);
  const region = rand(REGION_PROFILES);
  const screen = rand(device.screens);
  const gpu = rand(device.gpus);

  function generateSecureNoiseSeed() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0];
  }

  return {
    userAgent: device.ua,
    platform: device.platform,
    browser: device.browser,
    brands: device.brands,
    oscpu: device.oscpu,
    architecture: device.architecture  ?? null,
    platformVersion: device.platformVersion ?? null,
    language: region.language,
    languages: region.languages,
    hardwareConcurrency: rand(device.concurrencyOptions),
    deviceMemory: rand(device.memoryOptions),
    screenWidth: screen.width,  
    screenHeight: screen.height,
    colorDepth: 24,
    devicePixelRatio: screen.dpr,
    timezone: region.timezone,
    timezoneOffset: getRealOffset(region.timezone),
    webglVendor: gpu.vendor,
    webglRenderer: gpu.renderer,
    batteryLevel: rand(BATTERY_LEVELS),
    batteryCharging: rand(BATTERY_CHARGES),
    prefersColorScheme: rand(COLOR_SCHEMES),
    plugins: rand(PLUGINS_CONFIG),
    maxTouchPoints: device.maxTouchPoints,

// Noise Seeds mit sicherer Zufallszahl
    canvasNoiseSeed: generateSecureNoiseSeed(),
    webglNoiseSeed: generateSecureNoiseSeed(),
    audioNoiseSeed: generateSecureNoiseSeed(),
    timingNoiseSeed: generateSecureNoiseSeed(),
    layoutNoiseSeed: generateSecureNoiseSeed(),

    screenJitter: true,
    generatedAt: Date.now(),
  };
}
 //Ad und Tracker-Blocker
const RULESET_ADS     = "easylist";
const RULESET_TRACKER = "easyprivacy";
 
async function incrementBlocked(rulesetId) {
  const key = rulesetId === RULESET_ADS ? "blockedAds" : "blockedTrackers";
  const data = await chrome.storage.session.get([key]);
  const current = data[key] || 0;
  await chrome.storage.session.set({ [key]: current + 1 });
}

async function applyRulesets(enabled) {
  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds:  enabled ? [RULESET_ADS, RULESET_TRACKER] : [],
      disableRulesetIds: enabled ? [] : [RULESET_ADS, RULESET_TRACKER],
    });
  } catch (e) {
    console.warn("[LiminalPoint] applyRulesets failed:", e);
  }
}



// ------ Header spoofing via declarativeNetRequest ------------------
const HEADER_RULE_ID = 1;

const ALL_RESOURCE_TYPES = [
  "main_frame","sub_frame","stylesheet","script","image",
  "font","object","xmlhttprequest","ping","csp_report",
  "media","websocket","webtransport","webbundle","other",
];

const cfBypassTabs = new Set();

async function applyHeaderRules(profile, enabled) {
  const removeRuleIds = [HEADER_RULE_ID];
  const addRules = [];

  if (enabled && profile?.userAgent) {
    const requestHeaders = [
      { header: "User-Agent", operation: "set", value: profile.userAgent },
    ];

    if (profile.brands && profile.brands.length > 0) {
      const secChUa = profile.brands.map(b => `"${b.brand}";v="${b.version}"`).join(", ");
      requestHeaders.push({ header: "Sec-CH-UA",operation: "set", value: secChUa });
      requestHeaders.push({ header: "Sec-CH-UA-Mobile",operation: "set", value: "?0"    });
      const plat = profile.platform.includes("Win") ? "Windows": profile.platform.includes("Mac") ? "macOS": "Linux";
      if (profile.architecture) {
        requestHeaders.push({ header: "Sec-CH-UA-Arch",operation: "set", value: `"${profile.architecture}"` });
      }
      if (profile.platformVersion) {
        requestHeaders.push({ header: "Sec-CH-UA-PlatformVersion",operation: "set", value: `"${profile.platformVersion}"` });
      }
      requestHeaders.push({ header: "Sec-CH-UA-Platform",operation: "set", value: `"${plat}"` });
    } else {
      requestHeaders.push({ header: "Sec-CH-UA",operation: "remove" });
      requestHeaders.push({ header: "Sec-CH-UA-Mobile",operation: "remove" });
      requestHeaders.push({ header: "Sec-CH-UA-Platform",operation: "remove" });
    }

    const condition = {
      urlFilter: "|http",
      resourceTypes: ALL_RESOURCE_TYPES,
    };

    addRules.push({
      id:HEADER_RULE_ID,
      priority: 1,
      action:{ type: "modifyHeaders", requestHeaders },
      condition,
    });
  }

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
  }catch (e) {
    console.warn("[LiminalPoint] declarativeNetRequest update failed:", e);
  }
}

// --------- Cloudflare-Challenge Tab-Tracking ------------------------------

const CF_SESSION_RULE_BASE_ID = 1000;
const CF_RULE_ID_MAX = 9999;

function cfRuleId(tabId) {
  return CF_SESSION_RULE_BASE_ID + (tabId % (CF_RULE_ID_MAX - CF_SESSION_RULE_BASE_ID));
}

async function addCFBypassSessionRule(tabId) {
  const ruleId = cfRuleId(tabId);
  try {
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [ruleId],
      addRules: [{
        id:ruleId,
        priority: 10,
        action:{ type: "allow" },
        condition: {
          urlFilter:"|http",
          tabIds:[tabId],
          resourceTypes: ALL_RESOURCE_TYPES,
        },
      }],
    });
    console.log(`[LiminalPoint] CF bypass session rule added for tab ${tabId}`);
  }catch (e) {
    console.warn("[LiminalPoint] Failed to add CF session rule:", e);
  }
}

async function removeCFBypassSessionRule(tabId) {
  const ruleId = cfRuleId(tabId);
  try {
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [ruleId],
      addRules: [],
    });
    console.log(`[LiminalPoint] CF bypass session rule removed for tab ${tabId}`);
  }catch (e){
    console.warn("[LiminalPoint] Failed to remove CF session rule:", e);
  }
}

function isCFChallengeUrl(url) {
  if (!url) return false;
  return url.includes("/cdn-cgi/challenge-platform") || url.includes("/cdn-cgi/l/chk_");
}

// 1. Listener: Tab-Update (Navigation & Status)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!cfBypassTabs.has(tabId)) return;
  if (changeInfo.status !== "complete") return;
  const currentUrl = tab.url || "";
  if (!currentUrl || isCFChallengeUrl(currentUrl)) return;
  cfBypassTabs.delete(tabId);
  await removeCFBypassSessionRule(tabId);
});
 
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const isCF = details.responseHeaders?.some( h => h.name.toLowerCase() === "cf-mitigated" && h.value.toLowerCase() === "challenge");
    if (isCF && details.tabId > 0){
      cfBypassTabs.add(details.tabId);
      addCFBypassSessionRule(details.tabId);
      console.log(`[LiminalPoint] CF-Challenge via Header erkannt für Tab ${details.tabId}`);
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["responseHeaders"]
);

// 2. Listener: Tab-Ersatz (WICHTIG für about:blank -> echte URL)
chrome.tabs.onReplaced.addListener(async (addedTabId, removedTabId) => {
  if (cfBypassTabs.has(removedTabId)) {
    cfBypassTabs.delete(removedTabId);
    await removeCFBypassSessionRule(removedTabId);
    console.log(`[LiminalPoint] CF-Bypass bereinigt (Tab-Ersatz) für alte ID ${removedTabId}. Neue ID: ${addedTabId}`);
  }
});

// 3. Listener: Tab-Schließung (Bereinigung bei Schließen)
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (cfBypassTabs.has(tabId)) {
    cfBypassTabs.delete(tabId);
    await removeCFBypassSessionRule(tabId);
    console.log(`[LiminalPoint] CF-Bypass entfernt (Tab-Schließung) für Tab ${tabId}`);
  }
});


// -------- Dynamic Content Script Management ---------------------------
const CONTENT_SCRIPT_IDS = ["lp-bridge", "lp-content"];

const CONTENT_SCRIPTS_DEF = [
  {
    id: "lp-bridge",
    matches: ["<all_urls>"],
    js: ["bridge.js"],
    runAt: "document_start",
    allFrames: true,
    world: "ISOLATED",
  },
  {
    id: "lp-content",
    matches: ["<all_urls>"],
    js: ["content.js"],
    runAt: "document_start",
    allFrames: true,
    world: "MAIN",
  },
];

async function registerContentScripts() {
  try {

    await chrome.scripting.unregisterContentScripts({ ids: CONTENT_SCRIPT_IDS }).catch(() => {});
    await chrome.scripting.registerContentScripts(CONTENT_SCRIPTS_DEF);
    console.log("[LiminalPoint] Content scripts registered.");
  } catch (e) {
    console.warn("[LiminalPoint] registerContentScripts failed:", e);
  }
}

async function unregisterContentScripts() {
  try {
    await chrome.scripting.unregisterContentScripts({ ids: CONTENT_SCRIPT_IDS });
    console.log("[LiminalPoint] Content scripts unregistered.");
  } catch (e) {
    console.warn("[LiminalPoint] unregisterContentScripts failed:", e);
  }
}

async function reloadAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (!tab.id || !tab.url) continue;
      if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://") || tab.url.startsWith("about:")) continue;
      chrome.tabs.reload(tab.id).catch(() => {});
    }
  } catch (e) {
    console.warn("[LiminalPoint] reloadAllTabs failed:", e);
  }
}


async function loadState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["profile", "enabled"], (data) => {
      resolve({ profile: data.profile || null, enabled: data.enabled !== false });
    });
  });
}

async function initProfile(force = false) {
  const { profile } = await loadState();
  if (!force && isProfileComplete(profile)) return profile;

  const p = generateProfile();
  await chrome.storage.local.set({ profile: p });
  return p;
}

// ------------ Lifecycle hooks -------------------------
chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await loadState();
  const p = await initProfile();
  await applyHeaderRules(p, enabled);
  await applyRulesets(enabled);
  if (enabled) {
    await registerContentScripts();
  } else {
    await unregisterContentScripts();
  }
});
chrome.runtime.onStartup.addListener(async () => {
  const sessionRules = await chrome.declarativeNetRequest.getSessionRules();
  for (const rule of sessionRules) {
    const tabId = rule.condition?.tabIds?.[0];
    if (tabId != null) cfBypassTabs.add(tabId);
  }
  const { enabled } = await loadState();
  const p = await initProfile(true);
  await applyHeaderRules(p, enabled);
  await applyRulesets(enabled);
  if (enabled) {
    await registerContentScripts();
  } else {
    await unregisterContentScripts();
  }
});

// ------ Message handler -------------------------
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "CF_CHALLENGE") {
    const tabId = _sender.tab?.id;
    if (tabId != null && !cfBypassTabs.has(tabId)) {
      cfBypassTabs.add(tabId);

      addCFBypassSessionRule(tabId);
      console.log(`[LiminalPoint] CF-Challenge erkannt, echter UA für Tab ${tabId}`);
    }
    sendResponse({ ok: true });
    return true;
  }

  // -------- Handshake Challenge Generator ----------------------
  if (msg.type === "GENERATE_HANDSHAKE_CHALLENGE") {
    const challenge = generateHandshakeChallenge();
    sendResponse({ challenge });
    return true;
  }

  // --------- Handshake Challenge Validator ----------------------
  if (msg.type === "VALIDATE_HANDSHAKE") {
    const valid = validateHandshakeChallenge(msg.challenge);
    sendResponse({ valid });
    return true;
  }
  
  if (msg.type === "GET_PROFILE") {
    loadState().then(async ({ profile, enabled }) => {
      if (!enabled) {
        sendResponse({ profile: null, enabled: false });
        return;
      }
      const finalProfile = isProfileComplete(profile) ? profile : await initProfile(false);
      sendResponse({ profile: finalProfile, enabled: true });
    });
    return true;
  }

  if (msg.type === "ROTATE_PROFILE") {
    initProfile(true).then(async (profile) => {
      await applyHeaderRules(profile, true);
      chrome.storage.local.set({ enabled: true });
      sendResponse({ profile, enabled: true });
    });
    return true;
  }

  if (msg.type === "SET_ENABLED") {
    const value = Boolean(msg.value);
    chrome.storage.local.set({ enabled: value }, async () => {
      const { profile } = await loadState();
      const finalProfile = value ? (isProfileComplete(profile) ? profile : await initProfile(false)) : profile;
      await applyHeaderRules(finalProfile, value);
      await applyRulesets(value);
      if (value) {
        await registerContentScripts();
      } else {
        await unregisterContentScripts();
      }
      sendResponse({ ok: true, profile: finalProfile, enabled: value });
      reloadAllTabs();
    });
    return true;
  }

  if (msg.type === "GET_BLOCKED_STATS") {
    chrome.storage.session.get(["blockedAds", "blockedTrackers"], (data) => {
      sendResponse({ ads:data.blockedAds || 0, trackers:data.blockedTrackers || 0 });
    });
    return true;
  }

});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  if (info.rule.rulesetId === RULESET_ADS) {
    incrementBlocked(RULESET_ADS);
  } else if (info.rule.rulesetId === RULESET_TRACKER) {
    incrementBlocked(RULESET_TRACKER);
  }
});
