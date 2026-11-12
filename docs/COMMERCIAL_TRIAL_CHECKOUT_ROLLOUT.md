# Commercial release — TynRent and Offer Desk 1.0.0

The Product Owner authorized merge and public distribution on 13 November 2026 and separately approved commercial/LGPL distribution of the exact signed installer hashes. Production deployment is performed by merging PR #18 after its final preview succeeds.

| Product | Public installer | SHA-256 |
| --- | --- | --- |
| TynRent | https://downloads.tynware.com/tynrent/1.0.0/TynRent_Setup_1.0.0.exe | `c57ccb06d9c33d240d784a4f0629087d91b9f24e43a1de88ba917714f0fd47a4` |
| Offer Desk | https://downloads.tynware.com/offerdesk/1.0.0/OfferDesk-1.0.0-Setup.exe | `a65bb81c101fb83d207a3454579f50553853b1f757cc6caefaa28434a7472ea7` |

Both files are public in the existing R2 Standard bucket `tynware-releases`, preserving the downloads domain. Original staging copies remain private in `tynware-downloads`. Independent public downloads match the final sizes/hashes and have Valid Authenticode signatures from TYNWARE SOFT S.R.L. The actual preview download buttons downloaded the expected filenames. HTTP MIME is application/x-msdownload; Content-Disposition is absent.

## Customer journey

Both pages have active Download Free 14-Day Trial and Buy License buttons. The primary action downloads the exact product installer without a Tynware account, payment card or key. The secondary action opens the exact product-specific Lemon Squeezy checkout. Both downloads require explicit approval and exact versioned destinations; swapped products, checkout/cart/query URLs and unexpected hosts fail closed.

One installation supports the first-use 14-day full trial and activation. Trial expiry preserves viewing, backups, exports and business records while blocking mutations/import/restore. Short four-step installation guides cover the signed publisher, Windows 11 x64, correct installation scope, first use and activation in the same installation.

Exact Live checkouts:
- TynRent: https://tynware.lemonsqueezy.com/checkout/buy/d7242365-b524-43a5-a0d8-208abb348a5b — EUR 57 before applicable tax, product/variant 1476404 / 2301780.
- Offer Desk: https://tynware.lemonsqueezy.com/checkout/buy/ce31c7b5-5441-444c-aa6c-4547dd0c6dfd — EUR 113 before applicable tax, product/variant 1476403 / 2301779.

Both use Store 461112, perpetual purchased-version licenses and up to two active devices. The owner reported real-key Live tests for both, explicitly confirming Offer Desk activation. No purchase or secret license key was handled by the agent.

## Verification and coordination

20 HTML pages / 19 sitemap URLs pass structural checks. 62 commerce checks, release-state tests, seven consent/measurement tests and JS syntax checks pass. Desktop 1280px and mobile 390px preview checks show active correct links and no horizontal overflow. The added installation list was corrected after mobile QA found an 18px overflow. Existing SEO guides, WebP previews, static product identity, Analytics consent logic and preload=none videos from merged PR #24 are preserved; its main changes were merged into the release branch before editing.

Public prelaunch notices were removed from product, company, privacy and refund pages; prices and metadata use current availability. Open-source pages describe the actual signed 1.0.0 distributions and retain original source links and third-party replacement rights. Terms, consumer protections and future-version limitations are preserved.

Desktop QA: 230 TynRent / 272 Offer Desk automated tests; actual isolated signed installation/startup/upgrade/uninstall and representative expired-trial GUI/backup/CSV/PDF/restart matrices pass. Real-key edge cases, activation specifically after simulated expiry and the complete Windows 100%/125% manual matrix remain documented limits, not passed tests. Explicit owner approval is separate from these technical results.
