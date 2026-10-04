# AGENTS.md — Tynware Website

This file contains always-on repository guidance for coding agents working on tynware.com.

## Source of truth

Before editing, inspect:
- `README.md`
- the affected product page(s);
- shared policy/support pages when relevant;
- `assets/` for shared behavior and configuration.

Use repository-local skills under `.codex/skills/` when their descriptions match the task.

## Site invariants

- The site is intentionally static and dependency-free unless a task explicitly changes that architecture.
- Do not place secrets, payment credentials, licensing secrets, signing material, or private API keys in the repository or client-side code.
- Product claims must match the corresponding product repository and current commercial decision.
- Checkout and download links are release-critical.
- Do not publish unsigned/development installers as customer downloads.
- Do not switch placeholder/test commercial values to live production values unless the release is explicitly approved.

## Change discipline

- Prefer the smallest targeted change.
- Keep shared policy pages consistent with product behavior.
- Avoid duplicating product facts in many places when a shared source/config can safely represent them.
- Remove stale public branding or outdated trial/platform claims when updating a product page.
- Do not alter legal/commercial wording beyond the requested scope without flagging it.

## Validation

For affected pages:
- run a local static preview;
- check navigation and internal links;
- check responsive layout;
- verify checkout/download behavior;
- review privacy/terms/support/refund implications when underlying behavior changes.

When product capabilities, platform support, licensing, trial, or release state are involved, verify them against the product repository rather than guessing.

## Completion report

State:
- pages/files changed;
- product claims or commercial values changed;
- preview/link checks performed;
- any legal/commercial values still pending approval.
