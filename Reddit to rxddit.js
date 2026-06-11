// ==UserScript==
// @name         Reddit Share URL Converter
// @namespace    https://cannizzoow.github.io/
// @version      2026-06-11
// @description  Converts Reddit share/copy links to rxddit.com.
// @author       Cannizzo
// @match        https://www.reddit.com/*
// @icon         https://www.reddit.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function makeRxdditUrl(permalink) {
        const url = `https://rxddit.com${permalink}`;
        new URL(url);
        return url;
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('[Reddit Share URL Converter] Copied:', text);
        } catch (err) {
            console.warn('[Reddit Share URL Converter] Clipboard failed:', err);
        }
    }

    function findPostFromEvent(event) {
        const target = event.target;
        if (!target?.closest) return null;

        return target.closest('shreddit-post');
    }

    function isShareButton(path) {
        return path.some((element) =>
            element.tagName === 'BUTTON' &&
            element.textContent?.toLowerCase().includes('share')
        ) && !path.some((element) => element.tagName === 'PDP-BACK-BUTTON');
    }

    function isCopyLinkButton(path) {
        return path.some((element) => {
            const text = element.textContent?.trim().toLowerCase() || '';
            const label = element.getAttribute?.('aria-label')?.toLowerCase() || '';

            return (
                text.includes('copy link') ||
                text.includes('copy') ||
                label.includes('copy link') ||
                label.includes('copy')
            );
        });
    }

    addEventListener(
        'click',
        async (event) => {
            const path = event.composedPath();

            const shareClicked = isShareButton(path);
            const copyLinkClicked = isCopyLinkButton(path);

            if (!shareClicked && !copyLinkClicked) return;

            const shredditPost = findPostFromEvent(event);
            if (!shredditPost?.permalink) return;

            let rxdditUrl;

            try {
                rxdditUrl = makeRxdditUrl(shredditPost.permalink);
            } catch {
                return;
            }

            event.stopImmediatePropagation();
            event.preventDefault();

            await copyToClipboard(rxdditUrl);

            try {
                shredditPost.closeShareMenu?.();
            } catch { }
        },
        true
    );
})();