---
name: tynware-safe-code-change
description: Make a minimal, regression-resistant code change in a Tynware product repository.
---

Use this skill for bug fixes, features, refactors, migrations, and behavior changes.

1. Establish current repository context first.
2. Reproduce or characterize the current behavior before editing whenever feasible.
3. Find the narrowest root cause. Avoid drive-by refactors, formatting sweeps, unrelated renames, or dependency upgrades unless required by the task.
4. Preserve Tynware product invariants:
   - local-first behavior remains intact unless the task explicitly changes it;
   - existing customer/business data must not be deleted, silently reset, or migrated ambiguously;
   - licensing, backup/restore, installer, and release behavior are high-risk surfaces and must not be changed incidentally;
   - public product identity and internal compatibility identifiers must remain intentionally separated where the repository documents that distinction.
5. Add or update a regression test for behavior that can be automated.
6. Run the narrowest relevant tests first. If they pass, run the repository's broader test command when feasible.
7. Review `git diff --check` and `git diff` before declaring completion.
8. Never claim manual Windows/UI/install/upgrade validation unless it was actually performed.
9. Final report must state:
   - root cause or implementation intent;
   - files changed;
   - automated tests run and results;
   - manual validation still required;
   - any deliberate non-changes.

If validation fails, report FAIL or BLOCKED rather than weakening the test or hiding the failure.
