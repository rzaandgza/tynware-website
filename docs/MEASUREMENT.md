# Website and checkout measurement

## Scope

GA4 measures consenting visitors on production only. `assets/measurement-config.js` contains the public stream ID, production hostname allowlist and (once known) the exact Lemon Squeezy store hostname. It contains no secrets. The integration is separate from release/commerce configuration in `assets/site-config.js` and `assets/site.js`.

All HTML pages include the same deferred integration. No Google script, analytics cookie or event queue is created before consent or following rejection. Accept and Reject have equal visual weight. Privacy choices remain available in the footer. Choices expire after 180 days. Withdrawal disables collection, deletes accessible `_ga` cookies and reloads to unload Google listeners; cross-tab preference changes are respected. Unavailable storage defaults to no collection, with an in-memory choice for the current page. Preview deployments and localhost never send production events.

## Events

| Event | Trigger | Parameters | Meaning |
| --- | --- | --- | --- |
| `page_view` | Each page load after consent | Canonical page URL, page title, referrer origin | Consented page view |
| `view_item` | Product landing page after consent | `items` with product ID/name | Product page view |
| `product_click` | Internal link to a product landing page | `product_id` | Interest in a product |
| `download_click` | Enabled installer download link | `product_id` | Download intent; not completion/installation |
| `checkout_click` | Enabled checkout link | `product_id` | Departure toward checkout; not a paid order |
| `resource_download` | Sample PDF or template link | `product_id`, `resource_name` | Resource interest; separate from installer downloads |
| `purchase` | Lemon Squeezy's native GA4 integration | Transaction, item, currency, totals supplied by Lemon Squeezy | Successful payment; never synthesized by this website |

Disabled/hidden links and prevented actions are excluded. The website neither rewrites nor delays commerce links. Browser analytics can be blocked or lost during navigation; do not use its totals as financial records. Middle-click/context-menu downloads are not captured. Nothing measures desktop application use or installation.

Arbitrary URL queries/fragments, full checkout URLs, link text, email, license keys and local application records are excluded from website event payloads. Referrer paths/queries are removed. As a consequence, arbitrary UTM parameters are not forwarded in page URLs; introduce an explicit campaign taxonomy and review its privacy before running tagged campaigns. Google Signals and ad personalization are disabled. No user IDs or customer data are added.

## GA4 settings

Configured account: `416184123`; property: `564147252`; web stream: `16331506796`; measurement ID: `G-7DR0GGKFJV`. Created 13 November 2026. The owner accepted the Google terms in the browser. Account and property creation alone do not mean the website is collecting data; the integration must be deployed and verified.

1. Create/select the Tynware account and property; reporting timezone Romania and currency EUR.
2. Create the HTTPS `tynware.com` Web stream. **Disable Enhanced measurement**; this site sends explicit page views and download events. Automatic outbound/file/form/history events could duplicate counts or collect unreviewed URLs.
3. Keep optional account data sharing and Google Signals off. Do not install a second Google tag or GTM container snippet on the site.
4. Add event-scoped custom dimensions `product_id` and `resource_name`.
5. Mark `download_click` as a key event for trial interest, counted once per session with **no default monetary value**. Event counts still show repeat clicks. `purchase` is the sales key event. Keep `checkout_click` separate; never treat it as a completed sale.
6. Use 2-month user/event retention initially and disable resetting retention on new activity. Aggregated reports have different retention rules.
7. Verify consent acceptance/rejection/withdrawal locally, then verify production hits and Realtime once published. Do not generate fictitious purchases in production.

## Lemon Squeezy connection at commercial release

Use **the same GA4 Measurement ID** under Lemon Squeezy **Design > Analytics > Google Analytics** and enable its integration only after checking its checkout consent behavior. Configure the exact store hostname with `tynware.com` in GA4's **Configure your domains**, and add that exact `*.lemonsqueezy.com` store hostname to `checkoutDomains` in the public config. Never allow the entire multi-tenant Lemon Squeezy domain for cross-domain linking. The site permits linker decoration only after analytics consent. Google tag may append `_gl` for cross-domain attribution.

This site does not claim its consent transfers automatically to the hosted checkout: Lemon Squeezy has its own privacy controls. Confirm both sides in a test checkout. Verify payment-success `purchase`, transaction ID, currency, value and single-event counting. Reconcile refunds and revenue with Lemon Squeezy's actual orders. Ad blocking and declined consent will reduce the measured funnel. If reliable server confirmation is needed later, use signed `order_created` webhooks and idempotent processing; avoid also sending the same purchases from a second integration.

No checkout hostname, products or payment flow is activated by this change. These must come from the commercial release configuration. No API/webhook secret belongs in static JavaScript.

## Initial report

Use **Reports > Acquisition > Traffic acquisition**, pages/landing pages, and Events with the product dimension. Compare qualified product visits, installer download intent and checkout departures per product. Once the checkout is connected, compare these with purchases/revenue in Monetization. In Explore, use an open funnel `page_view` (guide or audience page) → `view_item` → `download_click` / `checkout_click` → `purchase`; downloads are optional before a purchase, so build separate funnels rather than requiring a download. Low counts are directional, not evidence of a statistically meaningful conversion difference.

## Validation

```
node --test tools/test_measurement.cjs
python tools/check_site.py
git diff --check
```

Tests use Node's isolated VM with a simulated DOM, storage and Google command queue: **no requests are sent to GA4**. Browser QA uses a temporary local fixture with production code, a test config and a same-origin CSP that blocks external Google requests. It checks the panel, keyboard focus and mobile layout without polluting production analytics.

## Primary references

- [Google: basic consent mode](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic)
- [Google: page views and duplicate prevention](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Google: configuration fields](https://developers.google.com/analytics/devguides/collection/ga4/reference/config)
- [Google: cross-domain measurement](https://support.google.com/analytics/answer/10071811)
- [Google: CSP directives](https://developers.google.com/tag-platform/security/guides/csp)
- [Lemon Squeezy: native analytics events](https://docs.lemonsqueezy.com/help/online-store/analytics)
- [Lemon Squeezy: signed webhook requests](https://docs.lemonsqueezy.com/help/webhooks/webhook-requests)
