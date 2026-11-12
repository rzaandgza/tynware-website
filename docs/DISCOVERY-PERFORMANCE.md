# Discovery and mobile performance — 13 November 2026

## Search Console

The existing domain property is `sc-domain:tynware.com`. Resubmitting `https://tynware.com/sitemap.xml` succeeded; Search Console now reports **19 discovered pages**, last read 13 November 2026 (previously 15). Discovery is not confirmation of indexing.

Inspected the four newly published audience/first-step pages. The two audience pages and TynRent first-step guide initially reported **URL is unknown to Google**; the Offer Desk first-step guide reported **Discovered - currently not indexed**, associated with the sitemap. All four individual indexing requests were acknowledged as **Indexing requested** on 13 November 2026. This queues crawling and does not guarantee indexing or rankings.

The earlier `http://www.tynware.com/` 5xx issue still shows **Validation started**, started 12 November 2026; its coverage report is last updated 9 November, with the historical crawl on 6 November. Google has not completed validation. No new validation was started.

## Internal links

The two product pages now directly link to their audience example, first-step guide and existing supporting resources. TynRent includes the double-booking guide and spreadsheet; Offer Desk includes the margin calculator. Links are normal HTML anchors with descriptive labels and work without JavaScript.

## Initial mobile lab results

Measured in PageSpeed Insights, emulated Moto G Power / Slow 4G / Lighthouse 13.6.0, before code changes. There is insufficient Chrome UX Report field data; these are single lab measurements, not real-user Core Web Vitals or ranking scores.

| Page | Performance | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: |
| Home | 100 | 1.8 s | 0 ms | 0 |
| TynRent | 86 | 3.9 s | 0 ms | 0.095 |
| Offer Desk | 99 | 1.8 s | 0 ms | 0.052 |

All three initial runs reported 100 for Accessibility, Best Practices and SEO. Automated accessibility checks do not replace a manual review. Reports:

- [Home](https://pagespeed.web.dev/analysis/https-tynware-com/ig84ivhgb3?form_factor=mobile)
- [TynRent](https://pagespeed.web.dev/analysis/https-tynware-com-tynrent/zkcrimpsik?form_factor=mobile)
- [Offer Desk](https://pagespeed.web.dev/analysis/https-tynware-com-offerdesk/ry4j6wy0tc?form_factor=mobile)

TynRent transferred approximately 7,510 KiB, including 6,348 KiB of MP4 before any play interaction. The hero and first inventory screenshot together cost approximately 1,100 KiB. Lighthouse attributed 0.095 CLS to movement in the hero and highlights below it.

## Changes

- Both product videos use `preload="none"` instead of `metadata`, leaving playback user initiated. Native controls and fallback text remain.
- 48 responsive WebP display previews at 640/960/1280 px use quality 88. New filenames avoid stale browser copies. Source PNGs, lossless copies, lightbox targets, PDFs and MP4 files are unchanged. Regenerate with `python tools/optimize_previews.py` (Pillow).
- TynRent hero 1280 px: 576,624 → 46,486 bytes, **91.9% reduction**. Offer Desk editor: 147,232 → 51,910 bytes, **64.7% reduction**. New previews total about 1.21 MB across all 48 files; these are not all loaded on a single page.
- Product identity is present in initial HTML with fixed image dimensions and a small stylesheet. Existing JS sees the identity and does not insert it a second time. This removes a script-driven source of hero movement without modifying release scripts.
- Preview image cache is one week; runtime configuration/scripts retain revalidation. When replacing cached assets, use a new asset name/version.

## Cloudflare correction (applied separately)

The zone's **Caching > Configuration > Browser Cache TTL** was set to **4 hours**, overriding the repository's `no-cache` intent. Changed it to **Respect Existing Headers**. Confirmed public `/assets/measurement.js?v=20261113-analytics2` now returns `cache-control: no-cache` rather than `max-age=14400`. This does not clear copies already stored in visitors' browsers; existing versioned URLs remain important.

Reference: [Cloudflare Browser Cache TTL](https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/set-browser-ttl/).

## Validation

- `python tools/check_site.py`: all 20 HTML pages / 19 sitemap entries pass.
- `node --test tools/test_measurement.cjs`: all 7 consent/measurement tests pass.
- `node tools/check_release.cjs`: prelaunch and independent/partial product availability pass.
- `git diff --check`: pass.
- Browser desktop/mobile 375 px: related guides render without horizontal overflow; Offer Desk guide link navigates correctly; product identity appears once.
- TynRent video remains `readyState: 0` until Play and becomes `paused: false`, `readyState: 4` after the native Play control. No autoplay added.
- Visually inspected compressed TynRent preview: interface and text remain legible. Original PNG zoom is retained for detail.

Do not enable installers, checkout URLs or purchase analytics as part of this change. Commercial release configuration remains with the release workstream.

## Preview follow-up

[TynRent mobile preview](https://pagespeed.web.dev/analysis/https-691c3f41-tynware-website-pages-dev-tynrent/hi3ltn841h?form_factor=mobile): **100 performance**, FCP 0.9 s, LCP **1.4 s**, TBT 0 ms, CLS **0**, Speed Index 2.3 s. Accessibility and Best Practices remain 100. The preview SEO score is lower because Cloudflare intentionally sends `X-Robots-Tag: noindex` on preview deployments; never remove this protection to increase a preview score.

These are separate single lab runs on production and a Cloudflare preview hostname. Preview hosts do not enable the production analytics integration. Reconfirm on tynware.com after publication; do not interpret the difference as a guaranteed field-data improvement.

[Offer Desk mobile preview](https://pagespeed.web.dev/analysis/https-691c3f41-tynware-website-pages-dev-offerdesk/b82e17u6v9?form_factor=mobile): **100 performance**, FCP/LCP 0.9 s, TBT 0 ms, CLS 0.009, Speed Index 0.9 s. Same preview-host and single-run limitations apply.

The historical 5xx URL was also checked directly on 13 November: `http://www.tynware.com/` → one redirect → `https://tynware.com/`, HTTP 200. This live check does not imply Google has completed validation.
