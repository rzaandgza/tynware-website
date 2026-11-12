# Tynware website

Static Cloudflare Pages site for TynRent and Offer Desk. Configuration lives in `assets/site-config.js`; product-specific checkout/download guards are in `assets/site.js`.

## Commercial release

The owner approved both signed 1.0.0 installers and commercial/LGPL distribution on 13 November 2026. Product pages provide free-trial downloads, exact Lemon Squeezy checkouts and short installation guides. Installers are distributed through downloads.tynware.com / R2, not Git or Pages assets. See [release evidence and rollout](docs/COMMERCIAL_TRIAL_CHECKOUT_ROLLOUT.md).

## Local checks

```text
python tools/check_site.py
node tools/test-commerce.cjs
node tools/check_release.cjs
node --test tools/test_measurement.cjs
```

Preview with `python tools/preview.py 52181`. Changes reach production through reviewed PRs to main. Preserve the existing SEO, optimized media, consent and measurement behavior. Keep exact per-product download approval and checkout validation when changing releases.
