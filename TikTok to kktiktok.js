// ==UserScript==
// @name         TikTok to kkTikTok Cleaner
// @namespace    https://tampermonkey.net/
// @version      2.0
// @description  Converts TikTok links to clean kkTikTok links automatically
// @match        https://www.tiktok.com/*
// @match        https://tiktok.com/*
// @grant        GM_setClipboard
// @icon         https://www.tiktok.com/favicon.ico
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    function cleanTikTokUrl(text) {
        try {
            const url = new URL(text.trim());

            const isTikTok =
                url.hostname.includes("tiktok.com");

            if (!isTikTok) return text;

            // Change domain
            url.hostname = "kktiktok.com";

            // Remove tracking/query params
            url.search = "";

            // Remove hash fragments
            url.hash = "";

            return url.toString();
        } catch {
            return text;
        }
    }

    // =========================
    // Intercept clipboard writes
    // =========================

    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);

    navigator.clipboard.writeText = async function (text) {
        const cleaned = cleanTikTokUrl(text);

        console.log("[kkTikTok] Cleaned URL:", cleaned);

        return originalWriteText(cleaned);
    };

    // =========================
    // Backup listener for copy
    // =========================

    document.addEventListener("copy", async () => {
        setTimeout(async () => {
            try {
                const text = await navigator.clipboard.readText();

                if (!text.includes("tiktok.com")) return;

                const cleaned = cleanTikTokUrl(text);

                if (cleaned !== text) {
                    GM_setClipboard(cleaned);
                    console.log("[kkTikTok] Updated clipboard:", cleaned);
                }
            } catch (err) {
                console.error("[kkTikTok] Clipboard error:", err);
            }
        }, 50);
    });

})();