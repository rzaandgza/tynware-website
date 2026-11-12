# TynRent 1.0.0 trial and checkout rollout (STAGED — NOT LIVE)

Commercial status: HOLD. Do not merge or publish without product-owner approval.

## Intended customer flow

1. A customer downloads the Microsoft-signed TynRent installer publicly from tynware.com/tynrent/. No checkout, license key, account, or payment card is needed for a full-featured 14-day trial.
2. On expiry, the same application remains installed and permits view, backup and export, but blocks modifications.
3. The application Help > Buy a license… action opens the stable tynware.com/tynrent/#pricing page; when the site is released, the Buy button on that page goes to the exact TynRent Live Lemon Squeezy checkout.
4. Lemon Squeezy provides the purchased license key. In the ORIGINAL installation the customer selects Help > License… > Activate and pastes the key. No reinstall or data migration is needed.
5. The installer file can remain attached to the Lemon Squeezy order for buyers who need to reinstall.

## Implemented/staged source behavior

The website already supports separate downloadUrl and checkoutUrl fields in assets/site-config.js, rendered using data-download and data-checkout in assets/site.js. This draft updates TynRent's product copy and version to 1.0.0 but deliberately leaves these URLs EMPTY. No public download/payment action is enabled by this draft.

The last signed 1.0.0 QA candidate, SHA-256 37d8c66355d1ec21ffc3745586bd7d12f6fb44797dbc861fe3b12db18bd30efb, predates the in-app Buy action. To ship the new flow, rebuild, retest, timestamp-sign and verify all three updated binaries. The older verified SHA is not the new final product SHA.

## Launch dependencies

- Exact reusable Live Lemon Squeezy checkout URL from product variant 2301780 via Products > Share with Test Mode OFF. The share URL must contain /checkout/buy/, not the customer-specific /checkout/?cart= URL. Do not invent a store slug.
- Public versioned Windows installer hosted on Cloudflare R2 through an approved custom domain. Cloudflare Pages has a 25 MiB per-asset limit, below the roughly 32 MiB installer. Avoid committing binary installers into this website repository or using production r2.dev download links.
- Review final perpetual/2-activation product, Live checkout, order receipt and file download.
- Test the public download's SHA-256 and publisher signature, first launch/free trial, expiry/read-only, website purchase button, in-app purchase action, Live activation in same installation, persistent data, restart, offline validation and deactivation.
- Finish LGPL/customer notices review for exact FINAL signed installer SHA and obtain owner GO.

## Release operation

1. Upload the updated signed release bytes to a versioned R2 object key and verify an HTTPS download on the chosen official domain.
2. Obtain the real Live Share checkout URL, verify its product, store and variant. No test-mode or cart link.
3. Only after both pass QA, populate the two corresponding configuration fields in assets/site-config.js.
4. Verify the trial and buy buttons are accessible and route to correct destinations.
5. Merge and publish the website only after final owner approval.

No production site changes and no commercial release approval are made by this branch.
