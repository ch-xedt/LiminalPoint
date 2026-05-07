// ***********************************************
//  LiminalPoint  -  Bridge (ISOLATED world) - @ch.xedt
// **************************************************

(function () {
  "use strict";

  const MAX_ATTEMPTS = 5;

  // ------ Secure Handshake Initiation ---------------------------------------------------------------
  function startHandshake() {
    // 1. Eine Challenge vom Background anforndern
    chrome.runtime.sendMessage({ type: "GENERATE_HANDSHAKE_CHALLENGE" }, (response) => {
      if (chrome.runtime.lastError || !response || !response.challenge) {
        console.error("[LiminalPoint] Handshake failed: Could not get challenge");
        return;
      }

      const challenge = response.challenge;

      // 2. Warten auf die Antwort von content.js
      function waitForPort(onPort, timeout = 5000) {
        const timer = setTimeout(() => {
          window.removeEventListener("message", handler);
          console.error("[LiminalPoint] Handshake timeout");
        }, timeout);

        function handler(event) {
          if (event.source !== window) return;
          
          if (!event.data || event.data.type !== "HANDSHAKE_ACCEPTED") return;
          if (event.data.challenge !== challenge) return;
          
          const port = event.ports?.[0];
          if (!port) return;
          
          clearTimeout(timer);
          window.removeEventListener("message", handler);
          
          onPort(port);
        }

        window.addEventListener("message", handler, true);
      }

      // 3. Sende die Challenge an content.js und fordere Port an
      // Sichere Variante: Nur an den Origin der aktuellen Seite senden
      const targetOrigin = window.location.origin;
      if (targetOrigin && targetOrigin !== "null") {
        window.postMessage({ type: "HANDSHAKE_CHALLENGE", challenge: challenge }, targetOrigin);
      } else {
        console.warn("[LiminalPoint] Cannot determine safe origin for postMessage, skipping.");
        // Handshake wird nicht initiiert, Extension ist auf dieser Seite inaktiv
      }

      // 4. Warte auf die Antwort (Port)
      waitForPort((port) => {
        // Port erhalten, jetzt Profil anfordern
        requestProfile(port);
      });
    });
  }

  // -------- Fetch profile from background, retry on failure ---------
  function requestProfile(port, attempt = 1) {
    chrome.runtime.sendMessage({ type: "GET_PROFILE" }, (response) => {
      if (chrome.runtime.lastError) {
        if (attempt < MAX_ATTEMPTS) {
          setTimeout(() => requestProfile(port, attempt + 1), attempt * 120);
          return;
        }
        port.postMessage({ enabled: false, profile: null });
        port.close();
        return;
      }

      const enabled = response?.enabled !== false;
      const profile = response?.profile ?? null;

      if (enabled && !profile && attempt < MAX_ATTEMPTS) {
        setTimeout(() => requestProfile(port, attempt + 1), attempt * 120);
        return;
      }

      port.postMessage({ enabled, profile });
      port.close();
    });
  }

  // Starten
  startHandshake();

})();