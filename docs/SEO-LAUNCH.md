# English prelaunch SEO — 12 November 2026

This change prepares the existing Cloudflare Pages website. It does not enable sales, add advertising pixels, or collect calculator inputs.

## Implemented

- Search-focused titles, descriptions and H1s for the homepage, products and Resources.
- Product-first homepage and compact responsive product summaries with screenshots.
- Working demo and release-enquiry actions while checkout/download URLs are empty.
- Extensionless canonical URLs, navigation and sitemap entries matching the production host's existing redirects.
- Organization/WebSite and SoftwareApplication structured data; Article/BreadcrumbList on the two new guides. There are no fabricated reviews or active purchase offers in prelaunch schema.
- Responsive lossless WebP screenshot variants, intrinsic dimensions, and original PNGs retained for the lightbox.
- A worked booking example in the Excel template guide, a double-booking guide, and a markup/margin guide with an in-browser calculator.

## Verify locally

No runtime dependencies or build step are required.

```sh
python tools/check_site.py
node --check assets/site.js
node --check assets/margin-calculator.js
node tools/check_pricing.cjs
node tools/check_release.cjs
python tools/preview.py 8766
```

The preview reproduces extensionless HTML routes and the production Content Security Policy. Open http://127.0.0.1:8766/ and check desktop/mobile, screenshot zoom, demo navigation and calculator validation. Stop it with Ctrl+C. Image regeneration is optional and requires Pillow: `python tools/optimize_images.py`.

## When signed releases are ready

1. Put the approved URLs into each product's `downloadUrl` and `checkoutUrl` in `assets/site-config.js`. Leave the other product empty if it is not ready. The UI shows only configured actions; prelaunch actions disappear for a product when it has a download or checkout URL.
2. Confirm the live Lemon Squeezy product/price, tax wording, version and signed installer publisher. Test download, checkout, license delivery and activation through the approved release process.
3. Update static “coming soon”, “planned” and “at launch” wording in product pages, homepage, resource guides and config to match actual availability. The hero status line changes when URLs are configured, but the editorial copy is deliberately not rewritten automatically.
4. Set real URLs in the HTML release buttons as progressive enhancement; keep them consistent with config. Without JavaScript, prelaunch demo and enquiry links remain usable now.
5. Update SoftwareApplication offer/version information only when the product is genuinely available, matching visible content. The lack of real reviews means Google rich-result eligibility is not promised.
6. Update the asset version query in pages when config/scripts change, then deploy through the existing production process.

## Search Console and measurement

The owner confirmed the Search Console property is already verified. Preserve that verification and existing domain settings. After deployment, use the existing property to submit/check `https://tynware.com/sitemap.xml` and inspect the two product pages and two new resource URLs. Do not request indexing of local preview URLs.

Record the baseline and compare after sufficient data accumulates: non-brand queries, impressions, organic clicks and landing pages. The same sitemap URL now includes 15 canonical URLs. Search Console access/reports were not available through the coding tools during implementation.

Purchase attribution is not implemented in this static-only change. At commercial launch, choose the analytics destination and connect verified, deduplicated Lemon Squeezy purchase events. A checkout click is not a sale, and an installer click is not a started trial. Align any future nonessential analytics with the privacy notice and actual consent behavior before enabling it.

## Publishing

The source is prepared on a review branch. Merging to the production branch may trigger the existing Cloudflare Pages deployment. Review and publish through that existing workflow; no new hosting service or domain configuration is needed.
