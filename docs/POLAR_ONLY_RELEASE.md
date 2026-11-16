# Polar-only 1.0.1 release — 16 November 2026

The Product Owner explicitly authorized publishing the website, prices and new installers on 16 November 2026, then requested exclusive Polar use and removal of the old Lemon Squeezy installers from Cloudflare. This supersedes the initial dual-provider migration strategy in POLAR_MIGRATION.md. The owner will perform the Polar test purchase personally; no agent purchase or real license activation is claimed.

Both applications now instantiate PolarLicenseProvider directly. There is no migration router or automatic fallback to Lemon Squeezy. Existing Lemon files, user databases and trial history remain intact, but old license files no longer grant rights in 1.0.1. Existing paid users need a valid Polar key; no license is converted automatically. Historical Lemon source remains available for audit; the active provider does not call it.

The website uses version 1.0.1, exact approved download filenames and new R2 paths, €60/€120 one-time prices and the supplied Polar checkouts. Consent controls remain unchanged. Checkout clicks do not imply paid orders. Earlier transaction terms are retained as historical legal context.

The initial signed dual-provider candidates were archived locally and were never published. Final Polar-only files have different hashes and are the only 1.0.1 artifacts selected for publication. All app, uninstaller and setup signatures are Valid, with publisher TYNWARE SOFT S.R.L. and Microsoft timestamps. The signed PYZ was inspected read-only to confirm the direct Polar entrypoint, exact benefit IDs and exact checkouts.

Automated suites: 270 TynRent tests and 312 Offer Desk tests passed in the final build pipelines. API tests use simulated responses; DPAPI roundtrips are real Windows tests on generated files. Website: 62 commerce checks, release guards, 7 measurement/consent tests and 20 HTML pages/19 sitemap entries, zero errors. Polar Sandbox integration remains untested. Production checkout purchase and genuine activation are owner-run follow-up checks.

Windows Sandbox installation results and public download integrity are recorded separately once observed. Publication does not assert completion of the genuine license device-limit/revocation matrix or the full manual DPI/language matrix. Remaining API-version maintenance and offline-revocation limitations from the original audit still apply.

Rollback now preserves the Polar licensing path and customer data. Retained local original artifacts support forensic recovery; public Lemon downloads are to be removed under the owner's instruction. Do not route customers who have Polar keys to a Lemon-only executable.

## Final signed setup hashes

- `TynRent_Setup_1.0.1.exe`: `d8c51302a48aeedd2849c01c59f9b33dba4b6c453b1d56e39de22c028b438fa7` (32651304 bytes).
- `OfferDesk-1.0.1-Setup.exe`: `42da7132a29a6b3ea7be940276c53d916182e2e45e9323773d6dec01f2b4760b` (38070256 bytes).

Final Windows Sandbox QA passed for both exact hashes: fresh 1.0.1 install/startup, upgrade from the original 1.0.0 installer, preserved files and trial start, exact signed embedded uninstaller, data-preserving uninstall and reinstall/restart. All table rows in the generated business databases are unchanged after upgrade. The VM network was disabled; this does not certify real Polar API activation.
