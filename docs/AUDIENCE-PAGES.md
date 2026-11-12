# Audience pages and first steps

This content-only change targets two initial customer segments: small event rental operators using TynRent, and independent handymen pricing jobs with Offer Desk. These are positioning hypotheses to evaluate against future Search Console and customer data, not measured keyword-volume claims.

New pages:
- /tynrent/event-rental-software/
- /offerdesk/handyman-quoting-software/
- /resources/tynrent/first-rental-reservation/
- /resources/offerdesk/first-job-quote/

The Resources hub links to all four pages. Each page links to the relevant product, related guides and a customer quote PDF. Sitemap now contains 19 canonical URLs. Dedicated audience.css preserves the existing site styles and release work.

Both PDFs contain only fictional data and explicit demonstration notices. The rental PDF was generated through TynRent's generate_quote_pdf with structured ReservationQuote/QuoteLine data. The handyman PDF was generated through Offer Desk's build_quote_document and QtQuotePdfRenderer, with application fonts explicitly registered for headless rendering. No application database, real customer record or build was used or modified. Files were rendered with Poppler and visually inspected.

The rental example totals EUR 160. The handyman example costs EUR 400 internally and sells at EUR 533.32: customer unit prices are rounded to cents, producing approximately 25% margin. The customer PDF excludes internal costs and margin. These prices are examples, not commercial-rate recommendations.

Validation: 20 HTML pages / 19 canonical sitemap entries pass tools/check_site.py. Both PDFs have one page, expected totals and demonstration notices; the Offer Desk PDF contains no internal cost figures. Browser checks cover desktop, mobile width 375px, worked-example navigation and PDF links; no page horizontal overflow was observed in the mobile landing/guide checks.

Release boundary: no changes to assets/site-config.js, assets/site.js, tynrent/index.html, offerdesk/index.html, installers or checkout URLs. Availability/pricing calls to action point back to the main product pages so the release agent can manage activation there. The worktree is based on the published main commit abd3b11, not the other agent's release branch.
