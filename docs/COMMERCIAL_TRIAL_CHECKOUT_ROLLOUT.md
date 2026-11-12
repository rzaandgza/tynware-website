# Both products: free trial and direct Live checkout — DRAFT HOLD

No production publication, merge or public installer delivery is authorized.

## Approved journey and configuration

Both products use one signed Windows 11 x64 installer: a free 14-day full trial,
without a Tynware account, purchase, card or key. After expiry the application
stays accessible for viewing, backup and export. Business-data mutations, import
and restore require an active trial or license. Records are retained.

Buy License opens the product-specific Lemon Squeezy Live checkout directly,
including inside the desktop application. Lemon Squeezy supplies the key after
purchase. Activate in the same installation, with no reinstall or data migration.

Owner-confirmed product settings, 2026-11-12:

| Product | Version | Live product / variant | List price before applicable checkout tax | Checkout |
| --- | --- | --- | --- | --- |
| TynRent | 1.0.0 | 1476404 / 2301780 | EUR 57 | https://tynware.lemonsqueezy.com/checkout/buy/d7242365-b524-43a5-a0d8-208abb348a5b |
| Offer Desk | 1.0.0 | 1476403 / 2301779 | EUR 113 | https://tynware.lemonsqueezy.com/checkout/buy/ce31c7b5-5441-444c-aa6c-4547dd0c6dfd |

Store 461112; both have perpetual purchased-version licenses and two activations.
Minor updates within the purchased major version follow the existing terms;
future major versions may be paid. Owner-provided dashboard settings are distinct
from an actual issued Live key activation/validation/deactivation test.

## Website behavior

Both pages show primary **Download Free 14-Day Trial** and secondary **Buy License**.
Each checkoutUrl is configured exactly; cross-product, query/cart and unexpected
checkout destinations fail closed. The trial CTA remains visible and disabled
while downloadUrl is empty or downloadApproved is not true. It never routes to
paid checkout. Prices remain distinct and match the owner-provided dashboard.

`node tools/test-commerce.cjs` checks exact mapping, cross-product rejection,
separate download approval, permitted HTTPS installer paths and both page journeys.
Preview remains local/review-only; pushing this draft does not authorize production.

## R2 staging and launch

An owner-approved Standard bucket `tynware-downloads` is private during staging.
The existing `downloads.tynware.com` domain currently belongs to the public
`tynware-releases` bucket. Its obsolete TinyRental v0.5 demo and empty prefixes
were removed at the owner's explicit request after a verified local backup.
Do not attach the new bucket to that domain before owner distribution GO.

Expected private versioned object keys (actual release evidence controls bytes):

- `tynrent/1.0.0/TynRent_Setup_1.0.0.exe`
- `offerdesk/1.0.0/OfferDesk-1.0.0-Setup.exe`

Do not commit installers to Git or place oversized files in Pages. Cloudflare
Pages limits individual files to 25 MiB. R2 Standard currently includes 10 GB-month,
1 million Class A and 10 million Class B operations monthly, with free egress;
beyond the allowance: USD 0.015/GB-month, USD 4.50/million Class A and USD
0.36/million Class B. Recheck [current R2 pricing](https://developers.cloudflare.com/r2/pricing/)
and [Pages limits](https://developers.cloudflare.com/pages/platform/limits/) at launch.

Before enabling either download:

1. Complete genuine Live issued-key QA separately from stubbed tests.
2. Complete exact-signed-installer technical and separate named legal approval.
3. Obtain explicit owner publication GO.
4. Attach the approved HTTPS download domain to the intended bucket, confirm
   public bytes independently against the final SHA-256 and verify signatures.
5. Set that product's exact HTTPS downloadUrl and downloadApproved=true; preview
   both CTAs, keyboard behavior and responsive layouts before merging/publishing.

PR #18 remains DRAFT. Public download destinations are NOT VERIFIED or enabled.

## Executed final candidate verification — 13 November 2026

Both newly signed installers passed network-disabled Windows Sandbox installed QA.
TynRent: 230 automated tests; final setup SHA
`c57ccb06d9c33d240d784a4f0629087d91b9f24e43a1de88ba917714f0fd47a4`.
Offer Desk: 272 tests; final setup SHA
`a65bb81c101fb83d207a3454579f50553853b1f757cc6caefaa28434a7472ea7`.
All six mandatory signatures/timestamps are Valid for TYNWARE SOFT S.R.L.
Both private R2 uploads were independently downloaded through authenticated access
and matched the final SHA-256. No ETag was used as a substitute.

Website: 54 commerce checks PASS; both pages previewed at 1280px and 390px with no
horizontal overflow. Trial links remain disabled without href; Buy License links
match each product. Both exact checkout pages independently displayed the correct
product and EUR 57 / EUR 113 price without a Test Mode banner. No purchase was made.

Per-product publication may copy only the owner-approved object to the existing
public tynware-releases bucket, keeping downloads.tynware.com routing unchanged.
Alternatively move the domain to the staging bucket only after EVERY stored object
has publication approval. Never expose another unapproved candidate as a side effect.
Final attachment headers and public-byte hash/signature QA remain release actions.
