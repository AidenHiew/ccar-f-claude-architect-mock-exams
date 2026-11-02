# Domain 3: Claude Code Configuration & Workflows (20%)

## 3.1 CLAUDE.md hierarchy & organization

- **Hierarchy:**
  - User-level: `~/.claude/CLAUDE.md` — applies only to *that user*, NOT shared via version control
  - Project-level: `.claude/CLAUDE.md` or root `CLAUDE.md` — shared with the team through git
  - Directory-level: `CLAUDE.md` in subdirectories — scoped to that directory
  - **Local: `CLAUDE.local.md`** at the project root — **personal + this project only**, gitignored, loaded after CLAUDE.md at that level (docs-delta §3.1)
  - Managed policy file (org-wide, OS-level path) loads first and cannot be excluded
- **Two scope axes — who × where:** user-level = me × all projects; project = team × this project; `CLAUDE.local.md` = me × this project.
- **Classic diagnosis question:** a new team member doesn't get the team's instructions → they were put in someone's user-level file instead of project-level.
- **`@import` syntax** references external files to keep CLAUDE.md modular (e.g., each package's CLAUDE.md imports just the standards files relevant to it).
- **`.claude/rules/`** — split a monolithic CLAUDE.md into topic files (`testing.md`, `api-conventions.md`, `deployment.md`).
- **`/memory`** — verify which memory files are actually loaded; the go-to diagnostic for inconsistent behavior across sessions.
- **Load behavior (docs-delta §3.1):** CLAUDE.md files in cwd and every ancestor load at launch; subdirectory files load **lazily** when Claude reads files there; contents **concatenate**, not override; only project-root CLAUDE.md survives `/compact`.
- **CLAUDE.md is guidance, not enforcement:** it is delivered as a user message after the system prompt, so compliance is not guaranteed; a hook enforces regardless (docs-delta §1.4). Permission **deny rules** are also evaluated deterministically in the permission chain (hooks → deny → ask → mode → allow → `canUseTool`, same section).
- **Output styles are separate from CLAUDE.md:** they modify the system prompt; configured via files in `.claude/output-styles/` or `outputStyle` in `.claude/settings.local.json`.
- Mandatory reviewer on specific paths = **CODEOWNERS**, a GitHub/GitLab platform feature — not a Claude Code feature (docs-delta §2.4).

## 3.2 Custom slash commands & skills

- **Commands:**
  - `.claude/commands/` — project-scoped, version-controlled, available to everyone who clones/pulls
  - `~/.claude/commands/` — user-scoped, personal
- **Skills:** `.claude/skills/` with `SKILL.md` files. Frontmatter options:
  - `context: fork` — run the skill in an isolated sub-agent context so verbose output (codebase analysis) or exploratory content (brainstorming) doesn't pollute the main conversation
  - `allowed-tools` — restrict tool access during skill execution (e.g., only file writes, preventing destructive actions)
  - `argument-hint` — prompts the developer for required parameters when invoked without arguments
- Personal variants of team skills → `~/.claude/skills/` **with different names** to avoid affecting teammates.
- **Skills vs CLAUDE.md:** skills = on-demand invocation for task-specific workflows; CLAUDE.md = always-loaded universal standards.

## 3.3 Path-specific rules

- `.claude/rules/` files with **YAML frontmatter `paths:` fields** containing glob patterns → rule loads only when editing matching files. Saves tokens, avoids irrelevant context.
- Example: `paths: ["terraform/**/*"]` or `paths: ["**/*.test.tsx"]`.
- **Glob rules vs directory CLAUDE.md:** glob rules win when conventions apply to files *spread across many directories* (test files living next to their code everywhere). Directory CLAUDE.md is directory-bound and can't follow scattered files.
- vs consolidating in root CLAUDE.md with section headers: that relies on the model *inferring* which section applies — unreliable versus deterministic path matching.

## 3.4 Plan mode vs direct execution

- **Plan mode:** large-scale changes, multiple valid approaches, architectural decisions, multi-file modifications (monolith→microservices, library migration touching 45+ files, choosing between integration approaches). Explore + design *before* committing to changes — prevents costly rework.
- **Direct execution:** simple, well-scoped changes — single-file bug fix with a clear stack trace, adding one validation check.
- If complexity is **already evident in the requirements**, start in plan mode — don't "switch if it gets complex."
- Hybrid: plan mode for investigation, direct execution for the planned implementation.
- **Explore subagent:** isolates verbose discovery output, returns summaries — preserves main-conversation context during multi-phase work.
- Permission modes: `default` (prompts), `acceptEdits`, `plan` (no edits until approved), `bypassPermissions`, `dontAsk`, `auto`. Varying autonomy by phase = switch modes, not a confirmation hook. (code.claude.com/docs/en/common-workflows)

## 3.5 Iterative refinement techniques

- **Concrete input/output examples (2–3)** are the most effective way to specify transformations when prose is interpreted inconsistently.
- **Test-driven iteration:** write test suites first (expected behavior, edge cases, performance), then iterate by sharing test failures.
- **Interview pattern:** have Claude ask *you* questions to surface considerations you hadn't anticipated (cache invalidation, failure modes) before implementing in unfamiliar domains.
- Edge-case bugs (e.g., nulls in a migration script) → give a specific test case with example input and expected output.
- **Batch vs sequential fixes:** interacting problems → one detailed message covering all of them; independent problems → fix sequentially.

## 3.6 CI/CD integration

- **`-p` / `--print`** — non-interactive (headless) mode; without it, CI jobs hang waiting for input. (`CLAUDE_HEADLESS=true` and `--batch` don't exist — classic distractors.)
- **`--output-format json` + `--json-schema`** — machine-parseable structured findings (e.g., for posting inline PR comments).
- **CLAUDE.md provides CI context:** testing standards, fixture conventions, review criteria → better generated tests, less low-value output.
- **Independent review instance:** a session that generated code retains its reasoning context and won't question its own decisions — spin up a separate instance to review.
- **Avoiding duplicate comments on re-review:** include prior findings in context and instruct Claude to report only new or still-unaddressed issues.
- **Avoiding duplicate test suggestions:** provide existing test files in context.

---
- `--output-format stream-json`: streams structured events live AND yields a parseable final result read from the terminal event — the answer whenever CI needs progress in the log *and* machine-readable output. Plain text = progress only; single `json` = result only.

## Exam traps for this domain

| Trap | Correct instinct |
|---|---|
| Team command in `~/.claude/commands/` | `.claude/commands/` in the repo (version-controlled) |
| Commands defined in CLAUDE.md or a `config.json` "commands array" | Those mechanisms don't exist for commands |
| Directory CLAUDE.md for conventions spanning scattered files | `.claude/rules/` with `paths:` glob frontmatter |
| Direct execution for an architectural restructuring | Plan mode — complexity is already stated |
| Plan mode for a one-line validation fix | Direct execution — proportionality |
| CI hangs → env vars / stdin redirects / `--batch` | `-p` flag |
| Same session reviews the code it wrote | Independent instance without generation context |
| Inconsistent instructions across sessions | `/memory` to check what's loaded |
| Personal notes for one project in `~/.claude/CLAUDE.md` | `CLAUDE.local.md` — user-level applies to every project |
| Security boundary written as a CLAUDE.md instruction | Permission deny rules in settings — CLAUDE.md is advisory |
| Repo-scoped response style written into CLAUDE.md | Output style — separate from CLAUDE.md |
| Hook / CI failure / CLAUDE.md note to require a specific reviewer | CODEOWNERS on the platform |
