# Hard-Facts Cheat Sheet

Drill these until instant. These are the memorizable facts; judgment patterns live in the domain notes.

## Exam mechanics
- Scaled score 100–1,000 · **pass = 720** · no guessing penalty → answer everything
- 4 scenarios on your exam, randomly drawn from a pool of 6

## API / Agent SDK
| Item | Fact |
|---|---|
| `stop_reason: "tool_use"` | Execute tool(s), append results, continue the loop |
| `stop_reason: "end_turn"` | Done — terminate the loop |
| `tool_choice: "auto"` | Tool call OR plain text |
| `tool_choice: "any"` | MUST call some tool |
| `tool_choice: {"type":"tool","name":"X"}` | MUST call tool X |
| Subagent spawning | `Task` tool; coordinator's `allowedTools` must include `"Task"` |
| Parallel subagents | Multiple Task calls in ONE response |
| Subagent context | NOT inherited — pass explicitly in the prompt |
| PostToolUse hook | Intercepts tool RESULTS (normalize data before model sees it) |
| Tool-call interception hook | Intercepts OUTGOING calls (enforce policy, e.g., block refunds > $500) |
| Hooks vs prompts | Hooks = deterministic guarantee; prompts = probabilistic |

## Message Batches API
- **50%** cost savings · up to **24-hour** window · **no latency SLA**
- `custom_id` correlates requests/responses; resubmit only failed items
- **No multi-turn tool calling** inside a batch request
- Use: overnight/weekly, latency-tolerant. Never: blocking pre-merge checks

## MCP
- Failure signal: **`isError` flag**
- Error types: transient / validation / business / permission. Return `errorCategory` (transient/validation/permission) + `isRetryable` + a description; no `isRetryable` → wasted retries
- Transient → retry (a subagent recovers locally) · Validation → fix input, retry · Business → no retry, `retriable: false` (guide's spelling here) + customer-friendly explanation · Permission → no retry, escalate
- Valid empty result ("no matches") ≠ failure; a failed search returned as empty success hides the error
- Project servers: **`.mcp.json`** (committed) · Personal: **`~/.claude.json`**
- Secrets: `${ENV_VAR}` expansion in `.mcp.json`
- Mix-ups: `~/.claude.json`, not `~/.claude.md`; no `local.mcp.json` (local scope lives in `~/.claude.json`, filed under the project)
- Check a server works: restart, then `/mcp`
- Teammate missing a shared server's tools → set their own env var + restart; don't copy the server into `~/.claude.json` with the token
- All servers' tools available **simultaneously**, discovered at connection time
- **Resources** = content catalogs (reduce exploratory calls) · **Tools** = actions
- Healthy tool count per agent: **~4–5**, not 18

## Claude Code files & commands
| Path / flag | Purpose |
|---|---|
| `~/.claude/CLAUDE.md` | User-level memory (NOT shared via git) |
| `CLAUDE.md` / `.claude/CLAUDE.md` | Project-level (shared) |
| `subdir/CLAUDE.md` | Directory-level |
| `@import` | Include external files in CLAUDE.md |
| `.claude/rules/*.md` + `paths: ["glob"]` frontmatter | Path-conditional rules (best for scattered files, e.g. `**/*.test.tsx`) |
| `.claude/commands/` | Project slash commands (shared) |
| `~/.claude/commands/` | Personal slash commands |
| `.claude/skills/<name>/SKILL.md` | Skills; frontmatter: `context: fork`, `allowed-tools`, `argument-hint` |
| `context: fork` | Skill runs isolated — output doesn't pollute main context |
| `/memory` | Show which memory files are loaded (debug inconsistent behavior) |
| `/compact` | Compress context in long sessions |
| `--resume <name>` | Resume a named session |
| `fork_session` | Branch from shared baseline to explore alternatives |
| `-p` / `--print` | Non-interactive (CI) mode — fixes hanging pipelines |
| `--output-format json` + `--json-schema` | Structured, machine-parseable CI output; schema result lands in `structured_output` |
| `--output-format text` / `json` / `stream-json` | Readable (default) / one parseable result at the end / live progress AND a parseable final result |

**CLAUDE.md mix-ups:** not `~/.claude.md`, not `.claude.md`, not "local .claude.md" (it's `CLAUDE.local.md`). Personal notes for one repo → `CLAUDE.local.md`; in `~/.claude/CLAUDE.md` they load in every repo. Files add together; nothing overrides.

**Fakes that appear as distractors:** `CLAUDE_HEADLESS=true`, `--batch` flag, `.claude/config.json` with a commands array — none exist.

## Built-in tools
- **Grep** = search file CONTENTS · **Glob** = find files by PATH pattern
- **Edit** = unique-text-match modification; non-unique anchor → fall back to **Read + Write**
- Explore incrementally: Grep entry points → Read to trace — don't bulk-read
- Glob matches the whole path, never contents. No naming pattern → Grep. Question excludes a folder → a too-broad Glob is wrong. Every caller of a function → Grep its name
- Renamed through a wrapper: Grep original name → Read wrapper, list every exported name for it → Grep each name (Grep only the original name misses wrapper callers)

## Structured output
- tool_use + JSON schema → kills **syntax** errors, NOT **semantic** errors
- Possibly-absent fields → **nullable/optional** (required fields cause fabrication)
- Enum patterns: `"unclear"` for ambiguity; `"other"` + detail string for extensibility
- Retry-with-error-feedback fixes format/structure errors; **cannot conjure absent info**

## Escalation (support agent)
- Escalate: explicit human request (immediately) · policy gap/exception · no progress
- Don't escalate on: sentiment, self-reported confidence (both uncalibrated proxies)
- Multiple customer matches → ask for more identifiers, never guess
- Handoff summary: customer ID, root cause, amount, recommended action

## Context management one-liners
- Case-facts block outside summarized history (protect numbers/dates)
- Lost-in-the-middle → key findings first + section headers
- Trim tool outputs to relevant fields before they accumulate
- Claim-source mappings preserved through synthesis; conflicts annotated with both sources; dates required in outputs
- Aggregate accuracy lies — segment by document type and field; stratified sampling of high-confidence extractions

## Distractor smell test (when torn between two answers)
1. Does it fix the root cause the stem's evidence points to?
2. Is it proportionate? (descriptions/criteria/examples before classifiers/routing layers/new infra)
3. Does the scenario demand a guarantee? → programmatic (hook/gate), not prompt
4. Does the mechanism match the latency/scope requirement? (batch vs sync, plan vs direct)
5. Structured beats generic; explicit beats inferred; never silently suppress errors

## 2026-09 changes — drill these (full detail in `notes/2026-09-docs-delta.md`)

- Subdirectory `CLAUDE.md` loads **lazily**; only project-root `CLAUDE.md` survives `/compact`; `~/.claude/rules/` load before project rules → **project wins**; `@import` depth 4; keep < 200 lines.
- Scopes: `CLAUDE.local.md` = me × this project (gitignored); `~/.claude/CLAUDE.md` = me × all projects. CLAUDE.md is advisory → hard limits in permission deny rules. Output styles ≠ CLAUDE.md. MCP resources = application-driven. CODEOWNERS = GitHub/GitLab, not Claude Code.
- Batch API: 50% off · ≤100k requests / 256 MB · ≤24h then `expired` (unbilled) · results 29 days · **unordered → `custom_id`** · no latency SLA · no `stream`.
- Permission chain: hooks → deny → ask → mode → allow → `canUseTool`. Hook `allow` never skips deny/ask. Auto-approved tools **never reach `canUseTool`**. Plan mode routes every write to `canUseTool`. `dontAsk` denies instead of prompting.
- `tool_choice: any/tool` → **400 on Fable 5.1**; use structured outputs `output_config.format: json_schema` (text block, constrained decoding) or `strict: true`. Prefill gone on 4.6+.
- `stop_reason` ∈ end_turn · max_tokens · stop_sequence · tool_use · **pause_turn** · **refusal** · **model_context_window_exceeded**.
- Commands merged into skills; **same-name skill wins**. Hooks: exit 2 = block; only `PreToolUse` blocks + edits input; `PostToolUse` injects only.
- Headless: `-p --output-format json --json-schema` (invalid schema = hard error), `--bare`, `--permission-prompts none`. Resume restores history/model/mode but **not** `--mcp-config`, `--settings`, `--add-dir`.
- MCP: local (default, `~/.claude.json`) → project `.mcp.json` → user; `${VAR:-default}`; stdio default with a command; definitions deferred until used.
