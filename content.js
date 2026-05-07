// ************************************************
//  LiminalPoint - @ch.xedt - Content Script (MAIN world)
// ************************************************

(function () {
  "use strict";



  // ----------------------------- State -----------------------------------
  let activeProfile = null;
  let profileLoaded = false;

  const DEFAULT_PROFILE = {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    platform: null,
    oscpu: "Windows NT 10.0; Win64; x64",
    language: "en-US",
    languages: ["en-US", "en"],
    hardwareConcurrency: 8,
    deviceMemory: 8,
    screenWidth: 1920,
    screenHeight: 1080,
    colorDepth: 24,
    devicePixelRatio: 1,
    timezone: "America/New_York",
    timezoneOffset: 300,
    prefersColorScheme: "dark",
    webglVendor: "Google Inc. (NVIDIA)",
    webglRenderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)",
    batteryLevel: 0.88,
    batteryCharging: true,
    maxTouchPoints: 0,
    canvasNoiseSeed: 12345,
    layoutNoiseSeed: 67890,
    audioNoiseSeed: 13579,
    timingNoiseSeed: 24680,
    webglNoiseSeed: 99999,
    brands: [
      { brand: "Not(A:Brand", version: "99" },
      { brand: "Google Chrome", version: "135" },
      { brand: "Chromium", version: "135" }
    ]
  };


function getP() {
  if (activeProfile) return activeProfile;
  if (!profileLoaded) return DEFAULT_PROFILE;
  return null;
}
  // ------ Helpers -----------------------------------
  function mulberry32(seed) {
    seed = seed | 0;
    return function () {
      seed |= 0;
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0);
    };
  }

  function clamp(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

  function getNavigatorVendor(profile) {
    const ua = String(profile?.userAgent || "");
    const browser = String(profile?.browser || "").toLowerCase();
    if (browser.includes("firefox") || /Firefox\//i.test(ua)) return "";
    if (browser.includes("safari") && !/(?:Chrome|Chromium|Edg)\//i.test(ua)) return "Apple Computer, Inc.";
    if (browser.includes("chrome") || browser.includes("edge") || /(?:Chrome|Chromium|Edg)\//i.test(ua)) return "Google Inc.";
    return "";
  }

  // ---------------------------- Native-code spoofing ------------------------------------------------
  const _nativeToString = Function.prototype.toString;
  const _nativeSet = new WeakSet();

  function markNative(fn) {
    if (typeof fn === "function") {
      try { _nativeSet.add(fn); } catch (_) {}
    }
    return fn;
  }

  Function.prototype.toString = markNative(function toString() {
    if (_nativeSet.has(this)) {
      return `function ${this.name || ""}() { [native code] }`;
    }
    return _nativeToString.call(this);
  });

  const _origGOPD = Object.getOwnPropertyDescriptor;
  Object.getOwnPropertyDescriptor = markNative(function getOwnPropertyDescriptor(obj, prop) {
    const desc = _origGOPD.call(Object, obj, prop);
    if (desc && desc.configurable && typeof desc.get === "function" && _nativeSet.has(desc.get)) {
      const wrappedGet = desc.get;
      return {
        ...desc,
        get: markNative(function get() {
          return wrappedGet.call(this);
        })
      };
    }
    return desc;
  });

  // ----------------------------- Font Protection -----------------------------------------------------

  // OS-Font-Whitelists
  const FONT_WHITELIST = {
    Win32: new Set([
      "Arial","Arial Black","Arial Narrow","Bahnschrift","Calibri","Calibri Light",
      "Cambria","Cambria Math","Candara","Comic Sans MS","Consolas","Constantia",
      "Corbel","Courier New","Ebrima","Franklin Gothic Medium","Gabriola","Gadugi",
      "Georgia","Impact","Leelawadee UI","Lucida Console","Lucida Sans Unicode",
      "Malgun Gothic","Microsoft Sans Serif","MS Gothic","MS PGothic","MV Boli",
      "Nirmala UI","Palatino Linotype","Segoe MDL2 Assets","Segoe Print",
      "Segoe Script","Segoe UI","Segoe UI Black","Segoe UI Emoji","Segoe UI Historic",
      "Segoe UI Light","Segoe UI Semibold","Segoe UI Symbol","SimSun","Sylfaen",
      "Symbol","Tahoma","Times New Roman","Trebuchet MS","Verdana","Webdings",
      "Wingdings","Yu Gothic",
    ]),
    MacIntel: new Set([
      "American Typewriter","Andale Mono","Arial","Arial Black","Arial Narrow",
      "Arial Rounded MT Bold","Arial Unicode MS","Avenir","Avenir Next",
      "Avenir Next Condensed","Baskerville","Big Caslon","Bodoni 72",
      "Bradley Hand","Brush Script MT","Chalkboard","Chalkboard SE","Chalkduster",
      "Charter","Cochin","Comic Sans MS","Copperplate","Courier","Courier New",
      "Didact Gothic","Futura","Geneva","Georgia","Gill Sans","Helvetica",
      "Helvetica Neue","Herculanum","Hoefler Text","Impact","Lucida Grande",
      "Luminari","Marker Felt","Menlo","Microsoft Sans Serif","Monaco",
      "Noteworthy","Optima","Palatino","Papyrus","Rockwell","Skia",
      "Snell Roundhand","Tahoma","Times New Roman","Trebuchet MS","Verdana","Zapfino",
    ]),
    Linux: new Set([
      "Bitstream Vera Sans","Bitstream Vera Serif","Cantarell","DejaVu Sans",
      "DejaVu Sans Mono","DejaVu Serif","FreeMono","FreeSans","FreeSerif",
      "Liberation Mono","Liberation Sans","Liberation Serif","Noto Sans",
      "Noto Serif","Open Sans","Oxygen","Roboto","Ubuntu","Ubuntu Mono",
    ]),
  };

  function getFontWhitelist(platform) {
    if (!platform) return null;
    if (platform === "Win32" || platform === "Win64") return FONT_WHITELIST.Win32;
    if (/Mac/.test(platform)) return FONT_WHITELIST.MacIntel;
    return FONT_WHITELIST.Linux;
  }

  function extractFirstFont(fontString) {
    if (!fontString) return "";
    return (fontString || "")
      .replace(/^\s*(?:[\w-]+\s+)*[\d.]+\w*\s+/, "") // size+weight prefix
      .replace(/['"]/g, "")
      .split(",")[0].trim();
  }

  function fontAllowed(fontString) {
    const profile = getP();
    if (!profile) return true;
    
    const whitelist = getFontWhitelist(profile.platform);
    if (!whitelist) return false; 
    const name = extractFirstFont(fontString);
    if (!name) return true; 
    return whitelist.has(name);
  }

  const _origStyleFontFamilyDesc = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, "fontFamily");
  const _origOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth").get;
  const _origOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight").get;

  function measureWithMonospace(el) {
    const style = el.style;
    const orig = _origStyleFontFamilyDesc.get.call(style);
    _origStyleFontFamilyDesc.set.call(style, "monospace");
    const w = _origOffsetWidth.call(el);
    const h = _origOffsetHeight.call(el);
    _origStyleFontFamilyDesc.set.call(style, orig);
    return { w, h };
  }

  // 1. offsetWidth -> beim LESEN den aktuellen inline-Font prüfen (kein _element nötig)
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    get: markNative(function () {
      const font = this.style?.fontFamily;
      if (font && !fontAllowed(font)) return measureWithMonospace(this).w;
      return _origOffsetWidth.call(this);
    }),
    configurable: true, enumerable: true,
  });

  // 2. offsetHeight -> gleiche Logik
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    get: markNative(function () {
      const font = this.style?.fontFamily;
      if (font && !fontAllowed(font)) return measureWithMonospace(this).h;
      return _origOffsetHeight.call(this);
    }),
    configurable: true, enumerable: true,
  });

  // 3. getBoundingClientRect -> gleiche Logik, ersetzt den originalen Patch vollständig
  const _origGBCR = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = markNative(function getBoundingClientRect() {
    const font = this.style?.fontFamily;
    if (font && !fontAllowed(font)) {
      const { w, h } = measureWithMonospace(this);
      const orig = _origGBCR.call(this);
      return new DOMRect(orig.x, orig.y, w, h);
    }
    return _origGBCR.call(this);
  });

  // 4. document.fonts.check() -> direkte Boolean-Abfrage
  if (document.fonts?.check) {
    const _origCheck = document.fonts.check.bind(document.fonts);
    document.fonts.check = markNative(function check(font, text) {
      if (!fontAllowed(font)) return false;
      return _origCheck(font, text);
    });
  }

  // 5. document.fonts.load() -> async Font-Laden blockieren
  if (document.fonts?.load) {
    const _origLoad = document.fonts.load.bind(document.fonts);
    document.fonts.load = markNative(function load(font, text) {
      if (!fontAllowed(font)) return Promise.resolve([]);
      return _origLoad(font, text);
    });
  }

  // 6. FontFace-Konstruktor -> direkte FontFace-Objekte abfangen
  const _OrigFontFace = window.FontFace;
  if (_OrigFontFace) {
    function PatchedFontFace(family, source, descriptors) {
      const ff = new _OrigFontFace(family, source, descriptors);
      const _origFFLoad = ff.load.bind(ff);
      ff.load = markNative(function load() {
        if (!fontAllowed(family)) return Promise.resolve(ff);
        return _origFFLoad();
      });
      return ff;
    }

    PatchedFontFace.prototype = _OrigFontFace.prototype;
    Object.defineProperty(PatchedFontFace, "prototype", { writable: false });

    Object.defineProperty(PatchedFontFace, Symbol.hasInstance, {
      value: markNative(function(instance) {
        return instance instanceof _OrigFontFace;
      }),
      configurable: true,
    });
    window.FontFace = markNative(PatchedFontFace);
  }

  // ------ Screen Resolution Jitter --------------------------------------------------------------------------
  function addJitter(val, seed) {
    const profile = getP();
    if (!profile || !profile.screenJitter) return val;
    const rng = mulberry32((seed ^ (val * 1337)) >>> 0);
    return val + (rng() % 3) - 1;
  }

  // ----------- Plugin & MimeType Masking ------------------------------------------------------------------------
  function patchPlugins() {
    const profile = getP();
    if (!profile || !profile.plugins) return;

    // -------- Build mock PluginArray ------------------------------------------------------------------------------
    const mockPlugins = profile.plugins.map(pluginData => {
      const plugin = Object.create(Plugin.prototype);
      Object.defineProperties(plugin, {
        name: { get: () => pluginData.name },
        description: { get: () => pluginData.description },
        filename: { get: () => pluginData.filename },
        length: { get: () => pluginData.mimetypes.length },
      });

      const mimes = pluginData.mimetypes.map(m => {
        const mime = Object.create(MimeType.prototype);
        Object.defineProperties(mime, {
          type: { get: () => m.type },
          description: { get: () => m.description },
          suffixes: { get: () => m.suffixes },
          enabledPlugin: { get: () => plugin },
        });
        return mime;
      });

      mimes.forEach((m, i) => {
        Object.defineProperty(plugin, i, { get: () => m, configurable: true });
        Object.defineProperty(plugin, m.type, { get: () => m, configurable: true });
      });

      return plugin;
    });

    const pluginArray = Object.create(PluginArray.prototype);
    Object.defineProperties(pluginArray, {
      length: { get: () => mockPlugins.length },
      item: { value: markNative((i)    => mockPlugins[i] || null) },
      namedItem: { value: markNative((name) => mockPlugins.find(p => p.name === name) || null) },
      refresh: { value: markNative(() => {}) },
    });
    mockPlugins.forEach((p, i) => {
      Object.defineProperty(pluginArray, i, { get: () => p, configurable: true });
      Object.defineProperty(pluginArray, p.name, { get: () => p, configurable: true });
    });

    // ------- Build mock MimeTypeArray ------------------------------------------------------------------------
    const mimeTypes = mockPlugins.flatMap(p => {
      const list = [];
      for (let i = 0; i < p.length; i++) list.push(p[i]);
      return list;
    });

    const mimeTypeArray = Object.create(MimeTypeArray.prototype);
    Object.defineProperties(mimeTypeArray, {
      length: { get: () => mimeTypes.length },
      item: { value: markNative((i) => mimeTypes[i] || null) },
      namedItem: { value: markNative((name) => mimeTypes.find(m => m.type === name) || null) },
    });
    mimeTypes.forEach((m, i) => {
      Object.defineProperty(mimeTypeArray, i, { get: () => m, configurable: true });
      Object.defineProperty(mimeTypeArray, m.type, { get: () => m, configurable: true });
    });

    // -------- Inject: instance -> prototype -> Proxy fallback ----------

    function injectProp(prop, value) {
      const getter = markNative(function() { return value; });
      const desc = { get: getter, set: () => {}, configurable: true, enumerable: true };

      // 1. Instance
      try {
        Object.defineProperty(navigator, prop, desc);
        if (navigator[prop] === value) return true;
      } catch (_) {}

      // 2. Prototype
      try {
        Object.defineProperty(Navigator.prototype, prop, desc);
        if (navigator[prop] === value) return true;
      } catch (_) {}

      return false;
    }

    const pluginsOk = injectProp("plugins", pluginArray);
    const mimeTypesOk = injectProp("mimeTypes", mimeTypeArray);

    // 3. Proxy fallback -> only if at least one property failed
    if (!pluginsOk || !mimeTypesOk) {
      try {
        const navigatorProxy = new Proxy(navigator, {
          get(target, prop, receiver) {
            if (prop === "plugins") return pluginArray;
            if (prop === "mimeTypes") return mimeTypeArray;
            const val = Reflect.get(target, prop, receiver);
            return typeof val === "function" ? val.bind(target) : val;
          }
        });

        Object.defineProperty(window, "navigator", {
          get: markNative(() => navigatorProxy),
          configurable: true,
        });
      } catch (_) {
        console.warn("[LiminalPoint] patchPlugins: all injection strategies failed");
      }
    }
  }

  // ------ Timing Noise ------------------------------------------------------------------------------------------------------------
  const _origNow = performance.now.bind(performance);
  performance.now = markNative(function now() {
    const profile = getP();
    if (!profile) return _origNow();
    
    const val = _origNow();
    const noise = (mulberry32(profile.timingNoiseSeed + Math.floor(val))() % 100) / 1000;
    return val + noise;
  });

  // ------ Lazy Property Definer --------------------------------------------------------------------------------
  function defineLazyProp(obj, prop, getFn) {
    const origDesc = Object.getOwnPropertyDescriptor(obj, prop);
    try {
      Object.defineProperty(obj, prop, {
        get: markNative(function() {
          const p = getP();
          if (!p) {
            // Toggle is off -> return the real browser value
            if (origDesc) {
              if (typeof origDesc.get === "function") return origDesc.get.call(this);
              return origDesc.value;
            }
            return undefined;
          }
          return getFn(p);
        }),
        set: () => {},
        configurable: true,
        enumerable: true,
      });
    } catch (_) {}
  }

  // ------ Initial Patching (Synchronous) ------------------------------------------------------
  
  // 1. Navigator
  defineLazyProp(Navigator.prototype, "userAgent", p => p.userAgent);
  defineLazyProp(Navigator.prototype, "appVersion", p => p.userAgent.replace("Mozilla/", ""));
  defineLazyProp(Navigator.prototype, "platform", p => p.platform);
  defineLazyProp(Navigator.prototype, "oscpu", p => p.oscpu);
  defineLazyProp(Navigator.prototype, "language", p => p.language);
  defineLazyProp(Navigator.prototype, "languages", p => Object.freeze([...p.languages]));
  defineLazyProp(Navigator.prototype, "hardwareConcurrency", p => p.hardwareConcurrency);
  defineLazyProp(Navigator.prototype, "deviceMemory", p => p.deviceMemory);
  defineLazyProp(Navigator.prototype, "webdriver", p => false);
  defineLazyProp(Navigator.prototype, "maxTouchPoints", p => p.maxTouchPoints || 0);
  defineLazyProp(Navigator.prototype, "doNotTrack", p => null);
  defineLazyProp(Navigator.prototype, "vendor", p => getNavigatorVendor(p));

  defineLazyProp(Navigator.prototype, "pdfViewerEnabled", p => {
    const ua = String(p.userAgent || "");
    const isChromium = /Chrome\/|Chromium\//i.test(ua) && !/Firefox\//i.test(ua);
    const isEdge = /Edg\//i.test(ua);
    if (isChromium || isEdge) return true;
    return undefined;
  });

  function uaPlatformString(p) {
    const pl = p.platform || "";
    return pl.includes("Win") ? "Windows" : pl.includes("Mac") ? "macOS" : "Linux";
  }

  function isChromiumProfile(p) {
    const ua = String(p.userAgent || "");
    return /Chrome\/|Chromium\//i.test(ua) && !/Firefox\//i.test(ua);
  }

  const uaDataProxy = new Proxy({}, {
    get: (target, prop) => {
      const p = getP();
      if (prop === "brands") return Object.freeze(p.brands);
      if (prop === "mobile") return false;
      if (prop === "platform") return uaPlatformString(p);
      if (prop === "getHighEntropyValues") {
        return markNative(function(hints) {
          const currentP = getP();
          const res = { brands: Object.freeze(currentP.brands), mobile: false, platform: uaPlatformString(currentP) };
          const isAppleSilicon = typeof currentP.webglRenderer === "string" && /Apple M\d/i.test(currentP.webglRenderer);
          if (hints.includes("architecture")) res.architecture = isAppleSilicon ? "arm" : "x86";
          if (hints.includes("bitness"))res.bitness = "64";
          if (hints.includes("model")) res.model = "";
          if (hints.includes("platformVersion")) {
            const oscpu = String(currentP.oscpu || "");
            const macMatch = oscpu.match(/Mac OS X (\d+[_\.]\d+[_\.]?\d*)/);
            if (macMatch) {
              res.platformVersion = macMatch[1].replace(/_/g, ".");
            } else {
              const winMatch = oscpu.match(/Windows NT (\d+\.\d+)/);
              if (winMatch) {
                res.platformVersion = winMatch[1] + ".0";
              } else if (oscpu.includes("Linux")) {
                res.platformVersion = currentP.platformVersion || "6.5.0";
              } else {
                res.platformVersion = "10.0.0";
              }
            }
          }
          return Promise.resolve(res);
        });
      }
      return target[prop];
    }
  });

  // Only expose userAgentData for Chromium profiles -> Firefox/Safari don't have it
  defineLazyProp(Navigator.prototype, "userAgentData", p => isChromiumProfile(p) ? uaDataProxy : undefined);

  // 2. Screen & Window
  const s = Screen.prototype;
  defineLazyProp(s, "width", p => addJitter(p.screenWidth, p.layoutNoiseSeed));
  defineLazyProp(s, "height", p => addJitter(p.screenHeight, p.layoutNoiseSeed + 1));
  defineLazyProp(s, "availWidth", p => addJitter(p.screenWidth, p.layoutNoiseSeed + 2));
  defineLazyProp(s, "availHeight", p => addJitter(p.screenHeight - 40, p.layoutNoiseSeed + 3));
  defineLazyProp(s, "colorDepth", p => p.colorDepth);
  defineLazyProp(s, "pixelDepth", p => p.colorDepth);
  
  if (window.screen.orientation && window.ScreenOrientation) {
    defineLazyProp(ScreenOrientation.prototype, "type", p => p.screenWidth > p.screenHeight ? "landscape-primary" : "portrait-primary");
    defineLazyProp(ScreenOrientation.prototype, "angle", p => 0);
  }

  try {
    const _origDPRDesc = Object.getOwnPropertyDescriptor(Window.prototype, "devicePixelRatio");
    Object.defineProperty(Window.prototype, "devicePixelRatio", {
      get: markNative(function() {
        const p = getP();
        if (!p) return _origDPRDesc ? _origDPRDesc.get.call(this) : window.devicePixelRatio;
        return p.devicePixelRatio;
      }),
      configurable: true,
    });
  } catch (_) {
    defineLazyProp(window, "devicePixelRatio", p => p.devicePixelRatio);
  }

  try {
    const _origOWDesc = Object.getOwnPropertyDescriptor(Window.prototype, "outerWidth");
    const _origOHDesc = Object.getOwnPropertyDescriptor(Window.prototype, "outerHeight");
    Object.defineProperty(Window.prototype, "outerWidth", { get: markNative(function() { const p = getP(); if (!p) return _origOWDesc ? _origOWDesc.get.call(this) : 0; return addJitter(p.screenWidth,  p.layoutNoiseSeed + 4); }), configurable: true });
    Object.defineProperty(Window.prototype, "outerHeight", { get: markNative(function() { const p = getP(); if (!p) return _origOHDesc ? _origOHDesc.get.call(this) : 0; return addJitter(p.screenHeight, p.layoutNoiseSeed + 5); }), configurable: true });
  } catch (_) {
    defineLazyProp(window, "outerWidth",  p => addJitter(p.screenWidth,  p.layoutNoiseSeed + 4));
    defineLazyProp(window, "outerHeight", p => addJitter(p.screenHeight, p.layoutNoiseSeed + 5));
  }

  try {
    const _origIWDesc = Object.getOwnPropertyDescriptor(Window.prototype, "innerWidth");
    const _origIHDesc = Object.getOwnPropertyDescriptor(Window.prototype, "innerHeight");
    Object.defineProperty(Window.prototype, "innerWidth", {
      get: markNative(function() { const p = getP(); if (!p) return _origIWDesc ? _origIWDesc.get.call(this) : 0; return addJitter(p.screenWidth, p.layoutNoiseSeed + 6); }),
      configurable: true,
    });
    Object.defineProperty(Window.prototype, "innerHeight", {
      get: markNative(function() { const p = getP(); if (!p) return _origIHDesc ? _origIHDesc.get.call(this) : 0; return addJitter(p.screenHeight, p.layoutNoiseSeed + 7); }),
      configurable: true,
    });
  } catch (e) {
    console.warn("[LiminalPoint] innerWidth/Height patch failed:", e);
    defineLazyProp(window, "innerWidth",  p => addJitter(p.screenWidth,  p.layoutNoiseSeed + 6));
    defineLazyProp(window, "innerHeight", p => addJitter(p.screenHeight, p.layoutNoiseSeed + 7));
  }

  // 3. Timezone & Intl
  const _OrigDTF = Intl.DateTimeFormat;
  const _origResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;

  try {
    Object.defineProperty(Intl.DateTimeFormat.prototype, "resolvedOptions", {
      value: markNative(function resolvedOptions() {
        const res = _origResolvedOptions.call(this);
        const p = getP();
        if (p) res.timeZone = p.timezone;
        return res;
      }),
      writable: true,
      configurable: true,
    });
  } catch (_) {}


  const PatchedDTF = new Proxy(_OrigDTF, {
    construct(target, args) {
      const [locales, options] = args;
      const opts = Object.assign({}, options);
      const p = getP();
      if (!opts.timeZone && p) opts.timeZone = p.timezone;
      return new target(locales, opts);
    },
    apply(target, thisArg, args) {
      const [locales, options] = args;
      const opts = Object.assign({}, options);
      const p = getP();
      if (!opts.timeZone && p) opts.timeZone = p.timezone;
      return new target(locales, opts);
    },
  });
  try { Intl.DateTimeFormat = PatchedDTF; } catch (_) {}

  const _origGetTimezoneOffset = Date.prototype.getTimezoneOffset;
  Date.prototype.getTimezoneOffset = markNative(function getTimezoneOffset() {
    const p = getP();
    if (!p) return _origGetTimezoneOffset.call(this);
    return p.timezoneOffset;
  });

  // 4. Canvas Noise
  const origGID = CanvasRenderingContext2D.prototype.getImageData;
  const origMeasureText = CanvasRenderingContext2D.prototype.measureText;
  const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
  const origToBlob = HTMLCanvasElement.prototype.toBlob;

  function noiseImageData(data, seed) {
    const rng = mulberry32(seed);
    for (let i = 0; i < data.length; i += 4) {
      const n = (rng() % 3) - 1;
      data[i] = clamp(data[i] + n);
      data[i + 1] = clamp(data[i + 1] + n);
      data[i + 2] = clamp(data[i + 2] + n);
    }
  }

  // Helper: draw noise onto a canvas by reading, noising, writing back via offscreen
  function noiseCanvas(canvas) {
    const p = getP();
    if (!p) return;
    const seed = p.canvasNoiseSeed;
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const id = origGID.call(ctx, 0, 0, canvas.width, canvas.height);
      const copy = new Uint8ClampedArray(id.data);
      noiseImageData(copy, seed);
      ctx.putImageData(new ImageData(copy, id.width, id.height), 0, 0);
    } catch (_) {}
  }

  CanvasRenderingContext2D.prototype.getImageData = markNative(function getImageData(...args) {
    const profile = getP();
    if (!profile) return origGID.apply(this, args);
    
    const id = origGID.apply(this, args);
    const copy = new Uint8ClampedArray(id.data);
    noiseImageData(copy, profile.canvasNoiseSeed);
    return new ImageData(copy, id.width, id.height);
  });

  HTMLCanvasElement.prototype.toDataURL = markNative(function toDataURL(...args) {

    try {
      const off = document.createElement("canvas");
      off.width = this.width;
      off.height = this.height;
      const offCtx = off.getContext("2d");
      if (offCtx) {
        offCtx.drawImage(this, 0, 0);

        noiseCanvas(off);
        return origToDataURL.apply(off, args);
      }
    } catch (_) {}
    // Last resort: no noise but no crash either
    return origToDataURL.apply(this, args);
  });

  HTMLCanvasElement.prototype.toBlob = markNative(function toBlob(callback, ...args) {
    try {
      const off = document.createElement("canvas");
      off.width = this.width;
      off.height = this.height;
      const offCtx = off.getContext("2d");
      if (offCtx) {
        offCtx.drawImage(this, 0, 0);
        noiseCanvas(off);
        return origToBlob.call(off, callback, ...args);
      }
    } catch (_) {}
    return origToBlob.call(this, callback, ...args);
  });

  CanvasRenderingContext2D.prototype.measureText = markNative(function measureText(...args) {
    const metrics = origMeasureText.apply(this, args);
    const p = getP();
    const noise = (mulberry32(p.canvasNoiseSeed + (args[0]?.length || 0))() % 100) / 500;
    return new Proxy(metrics, {
      get(target, prop) {
        const val = target[prop];
        return (prop === "width" && typeof val === "number") ? val + noise : val;
      }
    });
  });

  // 5. WebGL
  function patchWebGL(proto) {
    const origGetParam = proto.getParameter;
    const origGetExt = proto.getExtension;
    const origGetShaderPrecisionFormat = proto.getShaderPrecisionFormat;

    proto.getParameter = markNative(function getParameter(pname) {
      const profile = getP();
      if (!profile) return origGetParam.call(this, pname);
      
      if (pname === 0x1F00 || pname === 0x9245) return profile.webglVendor;
      if (pname === 0x1F01 || pname === 0x9246) return profile.webglRenderer;
      return origGetParam.call(this, pname);
    });

    proto.getShaderPrecisionFormat = markNative(function getShaderPrecisionFormat(shaderType, precisionType) {
      const res = origGetShaderPrecisionFormat.call(this, shaderType, precisionType);
      if (res) {

        const p = getP();
        const rng = mulberry32(p.webglNoiseSeed + shaderType + precisionType);
        const nudge = rng() % 2;
        return new Proxy(res, {
          get: (t, prop) => {
            if (prop === "precision") return typeof t.precision === "number" ? t.precision - nudge : t.precision;
            if (prop === "rangeMin") return typeof t.rangeMin === "number" ? t.rangeMin : t.rangeMin;
            if (prop === "rangeMax") return typeof t.rangeMax === "number" ? t.rangeMax : t.rangeMax;
            return t[prop];
          }
        });
      }
      return res;
    });

    proto.getExtension = markNative(function getExtension(name) {
      if (name === "WEBGL_debug_renderer_info") return null;
      return origGetExt.call(this, name);
    });
  }
  if (window.WebGLRenderingContext) patchWebGL(WebGLRenderingContext.prototype);
  if (window.WebGL2RenderingContext) patchWebGL(WebGL2RenderingContext.prototype);

  //Canvas Noise
 function patchWebGLReadPixels(proto) { 
    const origReadPixels = proto.readPixels;
    if (!origReadPixels) return;
    
    proto.readPixels = markNative(function readPixels(x, y, width, height, format, type, dst) {
      const result = origReadPixels.call(this, x, y, width, height, format, type, dst);
      
      if (dst && (dst instanceof Uint8Array || dst instanceof Uint16Array || dst instanceof Int32Array)) {
        const p = getP();
        if (!p) return result;
        const rng = mulberry32((p.webglNoiseSeed + this.canvas.width * this.canvas.height + x + y) >>> 0);
        
        const step = 4;
        const noiseScale = 25500;
        
        for (let i = 0; i < dst.length; i += step) {
          const noise = ((rng() % 200) - 100) / noiseScale;
          dst[i] = Math.max(0, Math.min(255, dst[i] + noise * 255));
        }
      }
      
      return result;
    });
  }
  
  if (window.WebGLRenderingContext) patchWebGLReadPixels(WebGLRenderingContext.prototype);
  if (window.WebGL2RenderingContext) patchWebGLReadPixels(WebGL2RenderingContext.prototype);


  // 6. Layout Noise (ClientRects) - Font-Schutz bereits oben, hier nur Layout-Jitter
  const origGCRs = Element.prototype.getClientRects;
  Element.prototype.getClientRects = markNative(function getClientRects() {
    const rects = origGCRs.call(this);
    const p = getP();
    if (!p.layoutNoiseSeed) return rects;
    const rng = mulberry32((p.layoutNoiseSeed ^ (rects.length * 31)) >>> 0);
    const nudge = ((rng() % 3) - 1) / 10;
    return new Proxy(rects, {
      get(target, prop) {
        const val = target[prop];
        if (typeof prop === "string" && /^\d+$/.test(prop) && val instanceof DOMRect) {
          return new DOMRect(val.x, val.y, val.width + nudge, val.height + nudge);
        }
        if (prop === "item") {
          return markNative(function item(i) {
            const r = target.item(i);
            return r ? new DOMRect(r.x, r.y, r.width + nudge, r.height + nudge) : r;
          });
        }
        return (typeof val === "function") ? val.bind(target) : val;
      }
    });
  });

  // 7. Audio Protection
  const origGetChannelData = AudioBuffer.prototype.getChannelData;
  AudioBuffer.prototype.getChannelData = markNative(function getChannelData(channel) {
    const data = origGetChannelData.call(this, channel);
    const p = getP();

    const copy = new Float32Array(data);
    const rng = mulberry32((p.audioNoiseSeed + channel) >>> 0);
    for (let i = 0; i < copy.length; i += 4) {
      copy[i] += ((rng() % 200) - 100) / 10000;
    }
    return copy;
  });

// 8. WebRTC (IP Leak Protection)

// ------ WeakMaps vor dem if-Block deklarieren ------------------------------------------------------
const pcListenersMap = new WeakMap();
const onIceMap = new WeakMap();

// --------------------- Cleanup-Funktion ----------------------------------------------------

function cleanupPCListeners(pc) {
  const listenersSet = pcListenersMap.get(pc);
  if (listenersSet) {
    pcListenersMap.delete(pc);
  }
  
  const iceEntry = onIceMap.get(pc);
  if (iceEntry) {
    onIceMap.delete(pc);
  }
}

if (window.RTCPeerConnection) {
  const pcProto = RTCPeerConnection.prototype;
  const IPV4_RE  = /((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g;
  const IPV6_RE  = /\b(?:[a-f0-9]{1,4}:){2,7}[a-f0-9]{1,4}\b/gi;
  const IPV4_TEST = /((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
  const IPV6_TEST = /\b(?:[a-f0-9]{1,4}:){2,7}[a-f0-9]{1,4}\b/i;

  // --------------------- SANITIZE FUNKTIONEN -------------
  function sanitizeCandidateString(candidate) {
    if (typeof candidate !== "string" || !candidate) return candidate;
    const parts = candidate.trim().split(/\s+/);
    if (parts[0] && parts[0].startsWith("candidate:") && parts.length >= 6) {
      const addr = parts[4];
      if (addr && (IPV4_TEST.test(addr) || IPV6_TEST.test(addr) || addr.endsWith(".local"))) {
        parts[4] = "0.0.0.0";
      }
      const raddrIndex = parts.indexOf("raddr");
      if (raddrIndex !== -1 && parts[raddrIndex + 1]) {
        const raddr = parts[raddrIndex + 1];
        if (raddr.endsWith(".local") || IPV4_TEST.test(raddr) || IPV6_TEST.test(raddr)) {
          parts[raddrIndex + 1] = "0.0.0.0";
        }
      }
      return parts.join(" ");
    }
    return candidate
      .replace(/[\w-]+\.local\b/g, "0.0.0.0")
      .replace(IPV4_RE, "0.0.0.0")
      .replace(IPV6_RE, "::");
  }

  function sanitizeSDP(sdp) {
    if (typeof sdp !== "string" || !sdp) return sdp;
    const trailingCRLF = sdp.endsWith("\r\n") ? "\r\n" : (sdp.endsWith("\n") ? "\n" : "");
    const result = sdp
      .split(/\r?\n/)
      .map((line) => {
        if (!line) return line;
        if (line.startsWith("a=candidate:")) {
          return `a=${sanitizeCandidateString(line.slice(2))}`;
        }
        if (line.startsWith("c=IN IP4 ")) return "c=IN IP4 0.0.0.0";
        if (line.startsWith("c=IN IP6 ")) return "c=IN IP6 ::";
        return line.replace(IPV4_RE, "0.0.0.0").replace(IPV6_RE, "::");
      })
      .join("\r\n");
    return trailingCRLF ? result + trailingCRLF : result;
  }

  function sanitizeDescription(desc) {
    if (!desc || typeof desc !== "object" || typeof desc.sdp !== "string") return desc;
    const cleanSdp = sanitizeSDP(desc.sdp);
    if (cleanSdp === desc.sdp) return desc;
    return { type: desc.type, sdp: cleanSdp };
  }

  function sanitizeIceCandidateObject(candidate) {
    if (!candidate || typeof candidate.candidate !== "string") return candidate;
    const clean = sanitizeCandidateString(candidate.candidate);
    if (clean === candidate.candidate) return candidate;
    try {
      return new RTCIceCandidate({ ...candidate.toJSON(), candidate: clean });
    } catch (_) {
      return new Proxy(candidate, {
        get: (t, p) => (p === "candidate" ? clean : t[p])
      });
    }
  }

  function wrapIceCandidateEvent(event) {
    if (!event || !event.candidate) return event;
    const safeCandidate = sanitizeIceCandidateObject(event.candidate);
    if (safeCandidate === event.candidate) return event;
    return new Proxy(event, {
      get: (t, p) => (p === "candidate" ? safeCandidate : t[p])
    });
  }
  // ------------------- Original Methods speichern ------------------------------------------------
  const origCreateOffer = pcProto.createOffer;
  const origCreateAnswer = pcProto.createAnswer;
  const origSetLocalDescription = pcProto.setLocalDescription;
  const origAddEventListener = pcProto.addEventListener;
  const origRemoveEventListener = pcProto.removeEventListener;
  const origClose = pcProto.close;

  if (typeof origAddEventListener === "function" && typeof origRemoveEventListener === "function") {
    pcProto.addEventListener = markNative(function addEventListener(type, listener, options) {
      // ICE Candidate Handler
      if (type === "icecandidate" && listener) {
        let listenersSet = pcListenersMap.get(this);
        if (!listenersSet) {
          listenersSet = new Set();
          pcListenersMap.set(this, listenersSet);
        }

        let wrapped = null;
        for (const w of listenersSet) {
          if (w._originalListener === listener) {
            wrapped = w;
            break;
          }
        }

        if (!wrapped) {
          if (typeof listener === "function") {
            wrapped = function wrappedIceListener(event) {
              return listener.call(this, wrapIceCandidateEvent(event));
            };
          } else if (typeof listener.handleEvent === "function") {
            wrapped = {
              handleEvent(event) {
                return listener.handleEvent.call(listener, wrapIceCandidateEvent(event));
              }
            };
          }
          if (wrapped) {
            wrapped._originalListener = listener;
            listenersSet.add(wrapped);
          }
        }

        return origAddEventListener.call(this, type, wrapped, options);
      }

      // Connection State Change Handler
      if ((type === "connectionstatechange" || type === "iceconnectionstatechange") && listener) {
        const wrapped = function wrappedStateListener(event) {
          const state = this.connectionState || this.iceConnectionState;
          if (state === "closed" || state === "failed" || state === "disconnected") {
            setTimeout(() => cleanupPCListeners(this), 100);
          }
          return listener.call(this, event);
        };
        wrapped._originalListener = listener;
        wrapped._isStateListener = true;
        return origAddEventListener.call(this, type, wrapped, options);
      }

      return origAddEventListener.call(this, type, listener, options);
    });

    // ------------- removeEventListener Patch ----------------------------------------------
    pcProto.removeEventListener = markNative(function removeEventListener(type, listener, options) {
      if (type !== "icecandidate" || !listener) {
        return origRemoveEventListener.call(this, type, listener, options);
      }

      const listenersSet = pcListenersMap.get(this);
      if (listenersSet) {
        for (const wrapped of listenersSet) {
          if (wrapped._originalListener === listener) {
            listenersSet.delete(wrapped);
            return origRemoveEventListener.call(this, type, wrapped, options);
          }
        }
      }
      return origRemoveEventListener.call(this, type, listener, options);
    });
  }

  // ----------------------------- onicecandidate Property Patch ----------------------------------
  const onIceDesc = Object.getOwnPropertyDescriptor(pcProto, "onicecandidate");
  if (onIceDesc && typeof onIceDesc.get === "function" && typeof onIceDesc.set === "function") {
    Object.defineProperty(pcProto, "onicecandidate", {
      get: markNative(function onicecandidateGet() {
        const entry = onIceMap.get(this);
        return entry ? entry.original : onIceDesc.get.call(this);
      }),
      set: markNative(function onicecandidateSet(handler) {
        if (typeof handler !== "function") {
          onIceMap.delete(this);
          return onIceDesc.set.call(this, handler);
        }
        const wrapped = function wrappedOnIce(event) {
          return handler.call(this, wrapIceCandidateEvent(event));
        };
        onIceMap.set(this, { original: handler, wrapped });
        return onIceDesc.set.call(this, wrapped);
      }),
      configurable: true,
      enumerable: onIceDesc.enumerable,
    });
  }

  // ------------- close() Patch für automatisches Cleanup -----------------
  if (typeof origClose === "function") {
    pcProto.close = markNative(function close() {
      cleanupPCListeners(this);
      return origClose.call(this);
    });
  }

  // --------------------- createOffer/createAnswer/setLocalDescription --------------------
  if (typeof origCreateOffer === "function") {
    pcProto.createOffer = markNative(function createOffer(...args) {
      return origCreateOffer.apply(this, args).then((offer) => sanitizeDescription(offer));
    });
  }

  if (typeof origCreateAnswer === "function") {
    pcProto.createAnswer = markNative(function createAnswer(...args) {
      return origCreateAnswer.apply(this, args).then((answer) => sanitizeDescription(answer));
    });
  }

  if (typeof origSetLocalDescription === "function") {
    pcProto.setLocalDescription = markNative(function setLocalDescription(desc, ...args) {
      return origSetLocalDescription.call(this, sanitizeDescription(desc), ...args);
    });
  }

  // ------------------- Properties für lokale Beschreibung -------------------------------------------
  ["localDescription", "currentLocalDescription", "pendingLocalDescription"].forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(pcProto, prop);
    if (!desc || typeof desc.get !== "function") return;
    Object.defineProperty(pcProto, prop, {
      get: markNative(function() {
        return sanitizeDescription(desc.get.call(this));
      }),
      configurable: true,
      enumerable: desc.enumerable,
    });
  });
}

  // 9. Battery Protection
  if (navigator.getBattery) {
    const origGetBattery = navigator.getBattery;
    navigator.getBattery = markNative(function getBattery() {
      const profile = getP();
      if (!profile) return origGetBattery.call(this);
      const level = typeof profile.batteryLevel === "number" && Number.isFinite(profile.batteryLevel) ? profile.batteryLevel : 1;
      const charging = typeof profile.batteryCharging === "boolean" ? profile.batteryCharging : true;

      const chargingTime = charging ? Math.round((1 - level) * 7200) : Infinity;
      const dischargingTime = charging ? Infinity : Math.round(level * 21600);
      return Promise.resolve({
        level,
        charging,
        chargingTime,
        dischargingTime,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
        onchargingchange: null,
        onchargingtimechange: null,
        ondischargingtimechange: null,
        onlevelchange: null,
      });
    });
  }

  // 10. Media Queries & Permissions
  if (window.matchMedia) {
    const origMM = window.matchMedia;
    window.matchMedia = markNative(function(q) {
      const mql = origMM.call(window, q);
      if (q.includes("prefers-color-scheme")) {
        defineLazyProp(mql, "matches", (p) => {
          const query = String(q).toLowerCase();
          const scheme = p.prefersColorScheme === "light" ? "light" : "dark";
          const wantsDark = /prefers-color-scheme\s*:\s*dark/.test(query);
          const wantsLight = /prefers-color-scheme\s*:\s*light/.test(query);
          if (wantsDark) return scheme === "dark";
          if (wantsLight) return scheme === "light";
          return scheme === "dark";
        });
      }
      return mql;
    });
  }

  // 11. Speech Synthesis -> voice list is OS/language specific
  if (window.speechSynthesis) {
    const VOICE_SETS = {
      windows: (lang) => [
        { name: "Microsoft David - English (United States)", lang: "en-US", localService: true, default: true },
        { name: "Microsoft Zira - English (United States)", lang: "en-US", localService: true, default: false },
        { name: "Microsoft Mark - English (United States)",lang: "en-US", localService: true, default: false },
      ],
      macos: (lang) => [
        { name: "Alex", lang: "en-US", localService: true,  default: true },
        { name: "Samantha",lang: "en-US",localService: true,  default: false },
        { name: "Victoria", lang: "en-US",localService: true,  default: false },
        { name: "Karen", lang: "en-AU", localService: true,  default: false },
        { name: "Daniel", lang: "en-GB", localService: true,  default: false },
      ],
      linux: (lang) => [
        { name: "espeak", lang: "en",    localService: true,  default: true },
        { name: "espeak-ng", lang: "en-US", localService: true,  default: false },
      ],
    };

    function makeSpeechVoice(data) {
      return new Proxy({}, {
        get(_, prop) {
          if (prop === "voiceURI") return data.name;
          if (prop === "name") return data.name;
          if (prop === "lang") return data.lang;
          if (prop === "localService") return data.localService;
          if (prop === "default") return data.default;
          return undefined;
        }
      });
    }

    const origGetVoices = speechSynthesis.getVoices.bind(speechSynthesis);
    speechSynthesis.getVoices = markNative(function getVoices() {
      const p = getP();
      if (!p) return origGetVoices();
      const os = (p.platform || "").includes("Win") ? "windows" : (p.platform || "").includes("Mac") ? "macos" : "linux";
      const voiceData = VOICE_SETS[os](p.language);
      return voiceData.map(makeSpeechVoice);
    });

    const origAddEL = speechSynthesis.addEventListener?.bind(speechSynthesis);
    if (origAddEL) {
      speechSynthesis.addEventListener = markNative(function addEventListener(type, cb, opts) {
        if (type === "voiceschanged") {
          const wrapped = (e) => cb && cb.call(this, e);
          return origAddEL(type, wrapped, opts);
        }
        return origAddEL(type, cb, opts);
      });
    }
  }

  // 12. navigator.connection - hide real network type
  (function patchConnection() {
    const CONNECTION_PROFILES = [
      { effectiveType: "4g", downlink: 45,  rtt: 15, saveData: false },
      { effectiveType: "4g", downlink: 20,  rtt: 24, saveData: false },
      { effectiveType: "4g", downlink: 15,  rtt: 30, saveData: false },
      { effectiveType: "4g", downlink: 12,  rtt: 45, saveData: false },
      { effectiveType: "4g", downlink: 10,  rtt: 50, saveData: false }, 
      { effectiveType: "4g", downlink: 8.5, rtt: 65, saveData: false },
      { effectiveType: "4g", downlink: 7.4, rtt: 77, saveData: false },
      { effectiveType: "4g", downlink: 5,   rtt: 80, saveData: false },
      { effectiveType: "3g", downlink: 1.5, rtt: 200, saveData: false },
    ];

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return;

    const proto = Object.getPrototypeOf(conn);
    const override = (prop, getFn) => {
      try {
        Object.defineProperty(proto, prop, {
          get: markNative(function() { return getFn(); }),
          configurable: true,
        });
      } catch (_) {}
    };
  
  function getCp() {
    const profile = getP();
    if (!profile) return null;
      const baseIndex = profile.layoutNoiseSeed % CONNECTION_PROFILES.length;
      
      const timeSlot = Math.floor(Date.now() / 30000);
      const variation = (timeSlot * 7 + profile.layoutNoiseSeed) % 3;
      
      let index = (baseIndex + variation) % CONNECTION_PROFILES.length;
      if (index < 0) index += CONNECTION_PROFILES.length;
      
      return CONNECTION_PROFILES[index];
    }

    override("effectiveType", () => {
      const cp = getCp();
      return cp ? cp.effectiveType : navigator.connection.effectiveType;
    });

    override("downlink", () => {
      const cp = getCp();
      return cp ? cp.downlink : navigator.connection.downlink;
    });

    override("rtt", () => {
      const cp = getCp();
      return cp ? cp.rtt : navigator.connection.rtt;
    });

    override("saveData", () => {
      const cp = getCp();
      return cp ? cp.saveData : navigator.connection.saveData;
    });

    override("type", () => {
      return "wifi";
    });

  })();

  // 13. navigator.keyboard -> hide real keyboard layout
  if (navigator.keyboard && typeof navigator.keyboard.getLayoutMap === "function") {
    const origGetLayoutMap = navigator.keyboard.getLayoutMap.bind(navigator.keyboard);
    const LAYOUT_MAPS = {
      "en-US": { KeyQ:"q", KeyW:"w", KeyE:"e", KeyR:"r", KeyT:"t", KeyY:"y", KeyU:"u", KeyI:"i", KeyO:"o", KeyP:"p" },
      "de-DE": { KeyQ:"q", KeyW:"w", KeyE:"e", KeyR:"r", KeyT:"t", KeyZ:"z", KeyU:"u", KeyI:"i", KeyO:"o", KeyP:"p" },
      "fr-FR": { KeyQ:"a", KeyW:"z", KeyE:"e", KeyR:"r", KeyT:"t", KeyY:"y", KeyU:"u", KeyI:"i", KeyO:"o", KeyP:"p" },
    };

    navigator.keyboard.getLayoutMap = markNative(function getLayoutMap() {
      const p = getP();
      if (!p) return origGetLayoutMap ? origGetLayoutMap() : Promise.resolve(new Map());
      const map = LAYOUT_MAPS[p.language] || LAYOUT_MAPS["en-US"];

      const fakeMap = new Map(Object.entries(map));
      fakeMap.entries = fakeMap.entries.bind(fakeMap);
      fakeMap.get = fakeMap.get.bind(fakeMap);
      fakeMap.has = fakeMap.has.bind(fakeMap);
      fakeMap.keys = fakeMap.keys.bind(fakeMap);
      fakeMap.values = fakeMap.values.bind(fakeMap);
      fakeMap.forEach = fakeMap.forEach.bind(fakeMap);
      return Promise.resolve(fakeMap);
    });
  }

  // 14. navigator.mediaCapabilities -> normalize codec responses
  if (navigator.mediaCapabilities) {
    const origDecodingInfo = navigator.mediaCapabilities.decodingInfo.bind(navigator.mediaCapabilities);

    navigator.mediaCapabilities.decodingInfo = markNative(function decodingInfo(config) {
      return origDecodingInfo(config).then(result => {

        const video = config?.video?.contentType || "";
        const isCommon = /avc1|vp8|vp9|av01|hevc/i.test(video);
        if (isCommon && result.supported) {
          return new Proxy(result, {
            get(t, p) {
              if (p === "smooth")           return true;
              if (p === "powerEfficient")   return true;
              return t[p];
            }
          });
        }
        return result;
      });
    });
  }

  // 15. Storage Spoofing (komplett)
  if (navigator.storage) {

    if (navigator.storage.estimate) {
      const origEstimate = navigator.storage.estimate.bind(navigator.storage);
      navigator.storage.estimate = markNative(function estimate() {
        const p = getP();
        if (!p) return origEstimate();
        const gb = 1024 * 1024 * 1024;
        const quotaMap = { 4: 60*gb, 8: 120*gb, 16: 240*gb, 32: 480*gb };
        const quota = quotaMap[p.deviceMemory] || 120*gb;
        const rng = mulberry32(p.layoutNoiseSeed ^ 0xABCD);
        const usage = Math.floor(quota * (0.05 + (rng() % 40) / 100));
        return Promise.resolve({ quota, usage });
      });
    }

    if (navigator.storage.persisted) {
      const origPersisted = navigator.storage.persisted.bind(navigator.storage);
      navigator.storage.persisted = markNative(function persisted() {
        const p = getP();
        if (!p) return origPersisted();
        return Promise.resolve(false);
      });
    }


    if (navigator.storage.persist) {
      const origPersist = navigator.storage.persist.bind(navigator.storage);
      navigator.storage.persist = markNative(function persist() {
        const p = getP();
        if (!p) return origPersist();
        return Promise.resolve(false);
      });
    }
  }

  // ------ Profile Loader (MessageChannel Handshake) ------------------

    // ------------ Secure Profile Loader (MessageChannel Handshake) ------------------
  const HANDSHAKE_TIMEOUT_MS = 5000;

  const handshakeTimer = setTimeout(() => {
    if (!profileLoaded) {
      console.warn("[LiminalPoint] Handshake timeout - profile not loaded");
      // Optional: Fallback-Verhalten hier
    }
  }, HANDSHAKE_TIMEOUT_MS);


  window.addEventListener("message", function onHandshake(event) {
    if (event.source !== window) return;
    if (event.origin !== window.location.origin) return;
    if (!event.data || typeof event.data !== "object") return;
    if (event.data.type !== "HANDSHAKE_CHALLENGE") return;

    const challenge = event.data.challenge;
    if (typeof challenge !== "string" || challenge.length !== 32) return;

    // Einmalig entfernen
    window.removeEventListener("message", onHandshake);
    clearTimeout(handshakeTimer);


    const { port1, port2 } = new MessageChannel();

    port1.onmessage = function (e) {
      port1.close();
      const { enabled, profile } = e.data || {};
      
      profileLoaded = true;
      if (!enabled || !profile) {
        activeProfile = null;
        console.log("[LiminalPoint] Protection disabled - real browser values active.");
        return;
      }
      activeProfile = profile;
      patchPlugins();
      console.log("[LiminalPoint] Profile loaded:", {
        browser: profile.browser,
        platform: profile.platform,
        timezone: profile.timezone,
        screen: `${profile.screenWidth}x${profile.screenHeight}`,
      });
    };

    const targetOrigin = window.location.origin;
    if (targetOrigin && targetOrigin !== "null") {
      window.postMessage(
        { type: "HANDSHAKE_ACCEPTED", challenge: challenge },
        targetOrigin,
        [port2]
      );
    }
  },true);})();
