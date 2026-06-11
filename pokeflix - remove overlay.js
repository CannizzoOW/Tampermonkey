// ==UserScript==
// @name         Pokéflix - remove overlay etc
// @description  Removes cookie banners, overlays etc on pokeflix.tv to allow fullscreen and better viewing experience. Also tries to unlock scroll if it gets locked by an overlay.
// @namespace    https://cannizzoow.github.io/
// @author       Cannizzo
// @version      1.0
// @match        https://www.pokeflix.tv/*
// @run-at       document-start
// @grant        none
// @icon         https://www.pokeflix.tv/favicon.ico
// ==/UserScript==

(function () {
    'use strict';

    function unlockScroll() {
        const b = document.body;
        const h = document.documentElement;

        if (b) {
            b.style.overflow = "";
            b.style.removeProperty("overflow");
            b.classList.remove("modal-open", "no-scroll", "noscroll", "scroll-lock", "overflow-hidden");
        }
        if (h) {
            h.style.overflow = "";
            h.style.removeProperty("overflow");
            h.classList.remove("modal-open", "no-scroll", "noscroll", "scroll-lock", "overflow-hidden");
        }
    }

    function fixIframesForFullscreen() {
        document.querySelectorAll("iframe").forEach((f) => {
            // Noen players trenger allowfullscreen + allow
            if (!f.hasAttribute("allowfullscreen")) f.setAttribute("allowfullscreen", "");
            const allow = f.getAttribute("allow") || "";
            const needed = [
                "fullscreen",
                "autoplay",
                "encrypted-media",
                "picture-in-picture",
            ];

            const parts = allow.split(";").map(s => s.trim()).filter(Boolean);
            for (const n of needed) {
                if (!parts.includes(n)) parts.push(n);
            }
            f.setAttribute("allow", parts.join("; "));
        });
    }

    function isPlayerRelated(el) {
        if (!el || el.nodeType !== 1) return false;

        const tag = el.tagName.toLowerCase();
        if (tag === "video" || tag === "iframe") return true;

        // Hvis elementet inneholder video/iframe, rør det ikke
        if (el.querySelector && el.querySelector("video, iframe")) return true;

        // Beskytt typiske “player wrapper” navn
        const idClass = ((el.id || "") + " " + (el.className || "")).toLowerCase();
        if (/(player|jwplayer|video\-js|vjs|plyr|shaka|hls|embed)/.test(idClass)) return true;

        return false;
    }

    function removeOverlaysSafely() {
        // Kjent-ish overlay-navn (kun hvis det IKKE er player-relatert)
        const selectors = [
            "#overlay", ".overlay",
            "#modal", ".modal",
            ".modal-backdrop", ".backdrop",
            ".popup", "#popup",
            ".lightbox",
            "#cookie", ".cookie", ".cookie-banner",
            "#consent", ".consent"
        ];

        for (const sel of selectors) {
            document.querySelectorAll(sel).forEach(el => {
                if (!isPlayerRelated(el)) el.remove();
            });
        }

        // Heuristikk: store fixed/sticky overlays med høy z-index
        document.querySelectorAll("div,section,aside").forEach(el => {
            if (isPlayerRelated(el)) return;

            const cs = window.getComputedStyle(el);
            if (!cs) return;

            const z = parseInt(cs.zIndex, 10);
            const zOk = Number.isFinite(z) && z >= 1000;

            const isCovering =
                (cs.position === "fixed" || cs.position === "sticky") &&
                zOk &&
                (el.offsetWidth >= window.innerWidth * 0.8) &&
                (el.offsetHeight >= window.innerHeight * 0.6);

            const looksLikeOverlay =
                /overlay|modal|popup|backdrop|consent|cookie|adblock|advert|ads/i
                    .test((el.className || "") + " " + (el.id || ""));

            // VIKTIG: fjern bare hvis begge stemmer
            if (isCovering && looksLikeOverlay) {
                el.remove();
            }
        });
    }

    function tick() {
        // Kjører “trygt” hver gang noe endrer seg
        fixIframesForFullscreen();
        removeOverlaysSafely();
        unlockScroll();
    }

    function start() {
        tick();

        const obs = new MutationObserver(() => tick());
        obs.observe(document.documentElement, { childList: true, subtree: true });

        // Litt “anti re-lock” uten å være altfor aggressiv (fullscreen tåler dette bedre)
        setInterval(() => {
            fixIframesForFullscreen();
            unlockScroll();
        }, 1000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
