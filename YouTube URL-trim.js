// ==UserScript==
// @name         YouTube Copy Video URL - Trimmed down
// @author       Cannizzo
// @version      2.1.0
// @description  Intercepts YouTube context menu "Copy video URL" and copies a cleaned URL (no tracking query) + closes menu.
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        GM_setClipboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// ==/UserScript==

(function () {
    "use strict";

    const MENU_TEXT_MATCH = [
        "copy video url",
        "copy video url at current time",
        "copy link",
        "kopier video",
        "kopier video-url",
        "kopier videoadresse",
        "kopier videoens url",
        "kopier nettadressen",
        "kopier url",
        "kopier lenke"
    ];

    function normalizeText(s) {
        return String(s || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }

    function isCopyVideoUrlMenuItem(el) {
        if (!el) return false;
        const text = normalizeText(el.innerText || el.textContent);
        if (!text) return false;
        return MENU_TEXT_MATCH.some((needle) => text.includes(needle));
    }

    function getCleanCurrentYouTubeUrl() {
        const u = new URL(location.href);

        // Shorts: keep only /shorts/ID
        if (u.pathname.startsWith("/shorts/")) {
            return `${u.origin}${u.pathname.replace(/\/+$/, "")}`;
        }

        // Watch: keep only v=
        if (u.pathname === "/watch") {
            const v = u.searchParams.get("v");
            if (v) return `${u.origin}/watch?v=${encodeURIComponent(v)}`;
            return `${u.origin}${u.pathname}`;
        }

        // youtu.be/<id> -> watch?v=<id>
        if (u.hostname.replace(/^www\./, "") === "youtu.be") {
            const id = u.pathname.split("/").filter(Boolean)[0];
            if (id) return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
        }

        // Other: strip query/hash
        return `${u.origin}${u.pathname.replace(/\/+$/, "")}`;
    }

    function closeMenu() {
        // 1) ESC usually closes YouTube overlays/menus
        const escDown = new KeyboardEvent("keydown", { key: "Escape", code: "Escape", keyCode: 27, which: 27, bubbles: true });
        const escUp = new KeyboardEvent("keyup", { key: "Escape", code: "Escape", keyCode: 27, which: 27, bubbles: true });
        document.dispatchEvent(escDown);
        document.dispatchEvent(escUp);

        // 2) Click common overlay/backdrop elements (best-effort)
        const backdrop =
            document.querySelector("tp-yt-iron-overlay-backdrop") ||
            document.querySelector("iron-overlay-backdrop") ||
            document.querySelector("ytd-popup-container tp-yt-iron-overlay-backdrop");

        if (backdrop) {
            backdrop.click();
            return;
        }

        // 3) Last resort: click an empty spot (coordinates near top-left)
        // Some menus close on any document click that isn't inside them.
        const evt = new MouseEvent("mousedown", { bubbles: true, cancelable: true, clientX: 5, clientY: 5 });
        document.dispatchEvent(evt);
        document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, clientX: 5, clientY: 5 }));
        document.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, clientX: 5, clientY: 5 }));
    }

    document.addEventListener(
        "click",
        (e) => {
            const target = e.target;

            const menuItem =
                target?.closest?.(
                    'tp-yt-paper-item, ytd-menu-service-item-renderer, ytd-menu-navigation-item-renderer, [role="menuitem"]'
                ) || target;

            if (!isCopyVideoUrlMenuItem(menuItem)) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            const clean = getCleanCurrentYouTubeUrl();
            GM_setClipboard(clean, "text");

            // Close menu right after copy
            // Small timeout helps when YT builds/draws overlay in the same tick.
            setTimeout(closeMenu, 0);
        },
        true
    );
})();