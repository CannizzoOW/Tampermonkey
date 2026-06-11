// ==UserScript==
// @name         Twitter Share URL Converter
// @namespace    https://cannizzoow.github.io/
// @author       Cannizzo
// @version      2026-02-11
// @description  Converts the Twitter URL when sharing a post to vxtwitter.com.
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.x.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const twitterMatchRegex = /(x\.com|twitter\.com)/i;

    addEventListener('copy', (/** @type {ClipboardEvent} */ event) => {
        const selection = (getSelection() ?? '').toString();
        if (!selection) return;

        try {
            const shareUrl = new URL(selection);
            if (!shareUrl.hostname.match(twitterMatchRegex)) return;
            event.preventDefault();
        } catch {
            return;
        }

        // Convert twitter share URL to BetterTwitFix hostname
        const betterTwitFix = selection.replace(twitterMatchRegex, 'vxtwitter.com');

        // If present, remove search parameters
        const searchParamsIdx = betterTwitFix.indexOf('?');
        const trimmedEndIdx = searchParamsIdx != -1 ? searchParamsIdx : betterTwitFix.length - 1;
        const trimmedUrl = betterTwitFix.substring(0, trimmedEndIdx);

        // Copy share URL back into clipboard
        event.clipboardData.setData('text/plain', trimmedUrl);
    });
})();