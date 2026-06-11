# Tampermonkey Userscripts

A small collection of userscripts that clean shared links, remove intrusive
overlays, and improve browsing on a few specific websites.

## Scripts

| Script | What it does | Install |
| --- | --- | --- |
| Reddit Share URL Converter | Replaces Reddit share and copy-link URLs with `rxddit.com` URLs. | [Install](https://raw.githubusercontent.com/CannizzoOW/Tampermonkey/main/Reddit%20to%20rxddit.js) |
| TikTok to kkTikTok Cleaner | Converts copied TikTok links to `kktiktok.com` and removes query parameters and fragments. | [Install](https://raw.githubusercontent.com/CannizzoOW/Tampermonkey/main/TikTok%20to%20kktiktok.js) |
| Twitter Share URL Converter | Converts copied X/Twitter post links to `vxtwitter.com` and removes query parameters. | [Install](https://raw.githubusercontent.com/CannizzoOW/Tampermonkey/main/Twitter%20to%20vxtwitter.js) |
| YouTube Copy Video URL - Trimmed down | Intercepts YouTube's copy-video-URL menu items and copies a clean URL without tracking parameters. | [Install](https://raw.githubusercontent.com/CannizzoOW/Tampermonkey/main/YouTube%20URL-trim.js) |
| Pokeflix - remove overlay etc | Removes common overlays, restores scrolling, and enables fullscreen permissions on embedded players. | [Install](https://raw.githubusercontent.com/CannizzoOW/Tampermonkey/main/pokeflix%20-%20remove%20overlay.js) |
| VG / VG Live - hide cookie overlay | Hides cookie and consent overlays on `vg.no` and restores page scrolling. | [Install](https://raw.githubusercontent.com/CannizzoOW/Tampermonkey/main/VG-hide%20cookies.js) |

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) or another compatible
   userscript manager.
2. Click an **Install** link in the table above.
3. Review the script and confirm the installation in your userscript manager.

You can also open a `.js` file from this repository and install it from its
**Raw** view.

## Permissions

Most scripts use no privileged userscript APIs. Scripts that need to replace
copied URLs use Tampermonkey's `GM_setClipboard` permission. Each script only
runs on the websites listed in its metadata header.

## Notes

- Website markup changes can occasionally break userscripts. Reinstall or
  update a script after fixes are published.
- Link-conversion scripts use third-party alternative frontends. Their
  availability and behavior are outside this repository's control.
- Overlay-removal scripts may hide consent interfaces rather than submitting a
  consent choice.

