---
name: tynware-site-release
description: Validate changes to tynware.com before publication, especially checkout, downloads, policies, product claims, and static deployment.
---

Use this skill for website release work, product-page changes, checkout/download changes, or publication readiness.

1. Read the root `README.md` and the affected product/policy pages before editing.
2. Keep the site static and dependency-free unless the task explicitly changes that architecture.
3. Do not place payment, licensing, signing, API, or other secrets in the repository or client-side JavaScript.
4. Before publication, verify affected public claims against the corresponding product repository: current product name/version-independent capabilities, supported platform, trial/license terms, and any release blockers.
5. Treat checkout and download links as release-critical:
   - do not point public download buttons at unsigned/development installers;
   - do not switch to live checkout/download values unless the intended commercial release is approved.
6. Review affected privacy/terms/support/refund language when the underlying product, analytics, hosting, licensing, or checkout behavior changes.
7. Validate internal links, product navigation, responsive layout, and a local static preview.
8. Keep product pages and shared policy pages consistent; avoid stale references to old product names or superseded trial/pricing language.
9. Report files changed, preview/validation performed, and any commercial or legal values still awaiting final approval.
