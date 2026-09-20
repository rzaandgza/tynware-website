# Tynware Website Starter v0.1

Static, dependency-free launch site for `tynware.com` and TinyRental.

## Why static

- no server/database required;
- very low maintenance;
- easy to deploy to Cloudflare Pages, GitHub Pages or equivalent static hosting;
- checkout stays with Lemon Squeezy;
- downloads can be moved to dedicated object storage/CDN later without rebuilding the site architecture.

## Before publishing

1. Replace the TinyRental screenshot placeholder with real screenshots.
2. Set `checkoutUrl` in `assets/site.js` to the **live** Lemon Squeezy checkout URL.
3. Set `downloadUrl` in `assets/site.js` to the final approved installer URL.
4. Confirm `support@tynware.com` exists or change `supportEmail`.
5. Review `privacy.html` against final analytics/hosting/licensing behavior.
6. Replace the placeholder `terms.html` with reviewed commercial terms before paid launch.
7. Confirm price, trial length, activation limit and platform requirements.
8. Do not publish unsigned/dev installers as customer downloads.

## Local preview

From this folder:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Suggested deployment: Cloudflare Pages

This site has no build step. Deploy the directory as static assets. For `tynware.com` at the apex, Cloudflare Pages requires the domain to be added as a Cloudflare zone and the registrar nameservers changed to the nameservers Cloudflare provides.

Recommended sequence:

1. Create a Cloudflare account and add `tynware.com`.
2. At Porkbun, replace the authoritative nameservers with the two nameservers Cloudflare gives you.
3. Create a Pages project from a Git repository or upload the static site using your preferred Cloudflare workflow.
4. Add `tynware.com` and `www.tynware.com` as custom domains.
5. Verify HTTPS and redirects.
6. Keep the Lemon Squeezy checkout external; do not place payment secrets in this repository.

## Structure

- `/` — Tynware portfolio homepage
- `/tinyrental/` — TinyRental landing page
- `/privacy.html`
- `/terms.html`
- `/support.html`
- `/downloads/` — policy placeholder only; not intended as the final release store
