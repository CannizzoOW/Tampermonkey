// ==UserScript==
// @name         VG / VG Live - hide cookie overlay + unlock scroll
// @author       Cannizzo
// @namespace    https://cannizzoow.github.io/
// @version      1.1-css-only
// @match        https://*.vg.no/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.vg.no/favicon.ico
// ==/UserScript==

(function () {
  'use strict';

  function injectCSS() {
    if (document.getElementById('vg-hide-cookie-css')) return;

    const style = document.createElement('style');
    style.id = 'vg-hide-cookie-css';

    style.textContent = `
      html,
      body {
        overflow: auto !important;
        overflow-y: auto !important;
        height: auto !important;
        max-height: none !important;
        position: static !important;
      }

      [id*="cookie" i],
      [class*="cookie" i],
      [id*="consent" i],
      [class*="consent" i],
      [id*="cmp" i],
      [class*="cmp" i],
      [id*="gdpr" i],
      [class*="gdpr" i],
      [id*="privacy" i],
      [class*="privacy" i],
      [id*="didomi" i],
      [class*="didomi" i],
      [id*="onetrust" i],
      [class*="onetrust" i],
      [id*="quantcast" i],
      [class*="quantcast" i],
      [id*="sourcepoint" i],
      [class*="sourcepoint" i],
      [id*="sp_message" i],
      [class*="sp_message" i],
      [id*="backdrop" i],
      [class*="backdrop" i] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;

    document.documentElement.appendChild(style);
  }

  function unlockScroll() {
    for (const el of [document.documentElement, document.body]) {
      if (!el) continue;

      el.style.setProperty('overflow', 'auto', 'important');
      el.style.setProperty('overflow-y', 'auto', 'important');
      el.style.setProperty('height', 'auto', 'important');
      el.style.setProperty('max-height', 'none', 'important');
      el.style.setProperty('position', 'static', 'important');

      el.classList.remove(
        'modal-open',
        'no-scroll',
        'noscroll',
        'scroll-lock',
        'overflow-hidden'
      );
    }
  }

  function start() {
    injectCSS();
    unlockScroll();

    setInterval(unlockScroll, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();