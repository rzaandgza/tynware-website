# Tynware website

Static Cloudflare Pages site for TynRent and Offer Desk. Configuration lives in `assets/site-config.js`; product-specific checkout/download guards are in `assets/site.js`.

## Commercial release

The owner approved both signed 1.0.0 installers and commercial/LGPL distribution on 13 November 2026. That release used Lemon Squeezy. Installers are distributed through downloads.tynware.com / R2, not Git or Pages assets. See [historical release evidence](docs/COMMERCIAL_TRIAL_CHECKOUT_ROLLOUT.md).

The Product Owner authorized publication of the Polar migration on 16 November 2026 and requested exclusive use of Polar. Product pages use €60/€120 prices, exact Polar checkouts and signed 1.0.1 downloads. The owner will perform the test purchase. See [the initial audit](docs/POLAR_MIGRATION.md) and the final publication evidence for the retained verification limits; historical 1.0.0 approval is not reused for new hashes.

## Local checks

```text
python tools/check_site.py
node tools/test-commerce.cjs
node tools/check_release.cjs
node --test tools/test_measurement.cjs
```

Preview with `python tools/preview.py 52181`. Changes reach production through reviewed PRs to main. Preserve the existing SEO, optimized media, consent and measurement behavior. Keep exact per-product download approval and checkout validation when changing releases.
