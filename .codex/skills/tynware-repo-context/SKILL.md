---
name: tynware-repo-context
description: Establish verified current context before resuming, planning, debugging, or modifying a Tynware repository.
---

Use this skill at the start of work on a Tynware repository when the task depends on current project state.

1. Inspect the repository before relying on chat history or assumptions:
   - current branch and `git status --short`;
   - recent commits relevant to the task;
   - root `README.md`, `pyproject.toml`, and `AGENTS.md` if present;
   - relevant files under `docs/`, `installer/`, `tools/`, and `tests/` when they exist.
2. Identify the current product version, supported runtime/platform, canonical test command, build/release command, and any explicit release blockers documented in the repository.
3. Prefer repository evidence over stale notes. If repository state and prior context disagree, call out the conflict instead of silently choosing one.
4. Do not read the whole repository by default. Start with the minimum authoritative files, then follow references that are relevant to the task.
5. Before editing, summarize internally:
   - task scope;
   - files likely involved;
   - invariants that must not regress;
   - validation needed.
6. When reporting context to the user, distinguish confirmed repository facts from assumptions or items that still require verification.

This skill establishes context only. Use the appropriate implementation/testing skill for actual changes.
