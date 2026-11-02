# Docs delta — direct-fetch facts, 2026-09-05

Facts below were read directly from the live docs on 2026-09-05 (URL once per section). This file is the durable home of that research and, with the Exam Guide and `notes/domain-*.md`, the **only** permitted source of facts for mock-exam questions (spec §3.6). Items the fetch could not confirm are listed at the end and are never used. Grouped by the task statement they most affect.

## 1.1 Agentic loop / `stop_reason`
Source: https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons
- Values: `end_turn` (natural completion), `max_tokens` (hit the limit — raise or continue), `stop_sequence` (custom stop hit; check `.stop_sequence`), `tool_use` (run the tool, return `tool_result`), `pause_turn` (a server-tool loop such as web search hit its iteration limit — send the assistant content back to continue), `refusal` (read `stop_details`; retry on a fallback model), `model_context_window_exceeded` (response filled the window — treat as truncated).
- Streaming: `stop_reason` is `null` in `message_start` and populated in `message_delta`.
- Exam trap: loops that only branch on `end_turn` vs `tool_use` mishandle `max_tokens`, `pause_turn`, `refusal`.

## 1.2 Coordinator–subagent orchestration
Source: https://www.anthropic.com/engineering/multi-agent-research-system
- The lead agent analyses the query, plans, and spawns subagents in parallel. Each subagent brief carries an **objective**, an **output format**, **which tools/sources to use**, and **explicit task boundaries**; without boundaries subagents duplicated work.
- Citations are attached by a separate **CitationAgent** pass over the synthesised findings and the sources — post hoc, not inline by each subagent.
- Cost: agents use ≈4× the tokens of chat; multi-agent systems ≈15×. Token usage explained 80% of performance variance in browsing evals; upgrading the model beat doubling the token budget.
- Scaling rule taught to the lead: simple query → 1 agent, 3–10 tool calls; complex query → 10+ subagents.
- Observed failure modes: 50+ subagents for simple queries, endless search for non-existent information, duplicated work, over-verbose queries, wrong tool choice, stopping early, preferring SEO content farms over authoritative sources.
- Parallel tool calls + parallel subagents cut research time by up to 90%.

## 1.3 Subagent invocation, context passing
Source: https://code.claude.com/docs/en/sub-agents · https://code.claude.com/docs/en/agent-sdk/permissions
- Definition file `.claude/agents/<name>.md`; frontmatter body is the system prompt. Fields: `name`, `description`, `tools` (allowlist), `disallowedTools`, `model` (`sonnet|opus|haiku|fable|inherit`), `permissionMode`, `skills`, `memory` (`user|project|local`), `maxTurns`, `mcpServers`, `hooks`, `isolation: worktree`, `background`, `effort`.
- A non-fork subagent **starts fresh**: system prompt + task message + CLAUDE.md + git status + preloaded skills — no parent conversation, no prior tool outputs. `context: fork` inherits the **entire** parent conversation.
- Model resolution: per-invocation param → frontmatter → `CLAUDE_CODE_SUBAGENT_MODEL` env → parent model.
- Subagents inherit the parent's permission mode; `permissionMode` in the definition can override it **except** when the parent runs `bypassPermissions`, `acceptEdits` or `auto` — those propagate and cannot be narrowed per-subagent.
- The Task tool delegates exploration so only findings return to the main context.

## 1.4 / 1.5 Enforcement, hooks, permission chain
Source: https://code.claude.com/docs/en/hooks · https://code.claude.com/docs/en/agent-sdk/permissions · https://code.claude.com/docs/en/memory
- Hook events — session: `SessionStart`, `SessionEnd`, `Setup`; per-turn: `UserPromptSubmit`, `UserPromptExpansion`, `Stop`, `StopFailure`; tool loop: `PreToolUse`, `PermissionRequest`, `PermissionDenied`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch`; subagent/task: `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `TeammateIdle`; config/files: `InstructionsLoaded`, `ConfigChange`, `CwdChanged`, `DirectoryAdded`, `FileChanged`, `WorktreeCreate`, `WorktreeRemove`; model/context: `PreModelSwitch`, `PostModelSwitch`, `PreCompact`, `PostCompact`; MCP: `Elicitation`, `ElicitationResult`; display: `Notification`, `MessageDisplay`.
- Contract: **exit code 2 always blocks** on blockable events regardless of JSON; exit 0 + valid JSON → decision honoured; other codes → non-blocking error. JSON fields live under `hookSpecificOutput` (`permissionDecision`, `additionalContext`, `updatedInput`, `updatedPrompt`, `decision`, `retry`).
- Only `PreToolUse` can both block **and** modify input; `PostToolUse` cannot block or undo the call (the tool already ran) but can transform what the model sees: the exam guide §1.5 teaches PostToolUse hooks that intercept tool results to normalize/transform them before the model processes them (the exam answer). Live docs, fetched 2026-10-21 (code.claude.com/docs/en/hooks): `updatedToolOutput` replaces the tool's output for all tools; `updatedMCPToolOutput` is the older MCP-only field; `additionalContext` only adds context; `PostToolBatch` can stop the loop; `PreModelSwitch` can block.
- Handler types: `command`, `http`, `mcp_tool`, `prompt` (model evaluates), `agent` (experimental).
- **SDK permission evaluation order:** (1) hooks → (2) deny rules → (3) ask rules → (4) permission mode → (5) allow rules → (6) `canUseTool`. A hook returning `allow` does **not** skip the deny/ask checks; a `PreToolUse` deny applies even under `bypassPermissions`.
- `canUseTool` fires only when nothing earlier resolved the call. Tools auto-approved by mode or allow rule **never reach `canUseTool`** (SDK emits `CLAUDE_SDK_CAN_USE_TOOL_SHADOWED`).
- Always-escalate exceptions regardless of mode/allow: `AskUserQuestion`, MCP tools flagged `_meta["anthropic/requiresUserInteraction"]`, org-flagged connector tools, `rm`/`rmdir` on critical paths — in `dontAsk` mode these are **denied** instead of prompted. `dontAsk` never calls `canUseTool`.
- CLAUDE.md is delivered as a **user message after the system prompt**, so compliance is not guaranteed; a hook enforces regardless of what the model decides.

## 1.7 Sessions
Source: https://code.claude.com/docs/en/sessions
- `claude --continue` = most recent session in cwd (errors `No conversation found to continue` if none); `claude --resume` = picker; `--resume <name|id>` direct (id search across all projects since v2.1.223); `/resume` in-session; `/branch [name]` copies the transcript into a new session id, original untouched; `--fork-session` with `--continue`/`--resume` forks into a separate process (no prior grants); `--from-pr <n>` filters the picker.
- Restored on resume: conversation history (tool calls + results), model (if valid), agent, permission mode (conditional), active goal, scheduled tasks. **Not restored:** `--mcp-config`, `--settings`, `--plugin-dir`, `--fallback-model`, `--add-dir` — pass them again.
- Transcripts: `~/.claude/projects/<project>/<session-id>.jsonl`, internal format; use `/export` or `--output-format json|stream-json` instead of parsing.
- On Pro/Max, resuming a large session after a long break offers resume-from-summary.

## 2.1 Tool definitions
Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
- `name` 1–64 chars (alphanumeric, `_`, `-`); `description` should be detailed — "3–4 sentences minimum"; `input_schema` JSON Schema with `required`; optional `input_examples` (schema-valid examples for complex tools), `strict: true` (input schema enforced), `defer_loading: true` (excluded from the initial prompt, loaded via tool search), `cache_control`, `allowed_callers`.
- Best practices named: detailed descriptions, `input_examples`, consolidate overlapping tools, namespace names, high-signal tool results.

## 2.3 `tool_choice` and structured outputs
Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools · https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- `tool_choice`: `auto` (default with tools), `any` (must call some tool), `tool` + `name` (force a specific tool), `none` (default without tools). `disable_parallel_tool_use: true` limits to one tool call per turn.
- On **Claude Fable 5.1 and Mythos 5.1, `any` and `tool` return HTTP 400** — use `auto` with strict tool use or native structured outputs. Forced tool use is also unsupported with manual extended thinking (`thinking: {type:"enabled"}`); adaptive thinking supports it.
- **Native structured outputs exist**: `output_config.format = {type:"json_schema", schema:{…}}` returns a **text block** of schema-guaranteed JSON via constrained decoding (no parse errors, no missing required fields). Separate mechanism from `strict: true` on tools (which guarantees tool-call *inputs*). Supported on Opus 5/4.8/4.7/4.6, Sonnet 5/4.6/4.5, Haiku 4.5, Fable 5/5.1, Mythos.
- Structured outputs remove *schema* retries; **business-logic validation and retry remain the caller's job** — the documented pattern is a follow-up user message carrying the validation failure. Nullable/optional fields handle absent data.
- Prefill of the assistant turn is **not supported on Claude 4.6+** — use structured outputs.

## 2.4 MCP in Claude Code
Source: https://code.claude.com/docs/en/mcp · https://code.claude.com/docs/en/costs · https://modelcontextprotocol.io/specification (server utilities / resources)
- Scopes and precedence: **local** (default; `~/.claude.json`, per project, not shared) → **project** (`.mcp.json` at repo root, git-shared) → **user** (`~/.claude.json`, all projects) → plugin-provided → claude.ai connectors.
- Env expansion `${VAR}` and `${VAR:-default}` in `command`, `args`, `env`, `url`, `headers`.
- `claude mcp add [--transport http|sse|stdio] [--scope local|project|user] [--header] [--env] <name> <url | -- command>`; **stdio is the default when a command is given**, and the `--` separator is required before the command. Also `list/get/remove/login/logout/add-json/add-from-claude-desktop/serve`.
- Resources referenced as `@server:resource` (e.g. `@github:repo/org/repo`); MCP prompts appear automatically as `/server-prompt-name`; `/mcp` lists servers.
- Env: `MCP_TIMEOUT` (per-server; `-p` waits for pending servers up to it, 30s default, since v2.1.221), `MAX_MCP_OUTPUT_TOKENS` (default 25,000), idle timeouts (5 min HTTP/SSE, 30 min stdio), `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` (2 min).
- MCP tool definitions are **deferred by default** — only names + server instructions enter context until a tool is used. Docs recommend CLI tools (`gh`, `aws`, `gcloud`) over MCP servers where possible for context efficiency.
- MCP spec: Resources are **application-driven** (the host decides how to incorporate them), Prompts are user-controlled, Tools are model-controlled. Servers may declare a `completions` capability (`completion/complete` for `ref/prompt` and `ref/resource` arguments).
- **Not a Claude Code feature:** CODEOWNERS-style reviewer gating is a GitHub/GitLab platform feature.

## 2.5 Built-in tools and permissions
Source: https://code.claude.com/docs/en/permissions · https://code.claude.com/docs/en/tools-reference · https://code.claude.com/docs/en/headless
- Core tools: `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, `WebFetch`, `WebSearch`, `Agent`/`Task` (spawn subagent), `NotebookEdit`, `AskUserQuestion`, `TodoWrite` (legacy, off by default), `Skill`, plus plan/worktree/task-management tools.
- **Read-only tools (Read, Grep, Glob, …) never prompt inside the working directory; Bash prompts except for a built-in read-only allowlist.**
- A permission rule `Edit(path)` also governs `Write` and `NotebookEdit`; a `Write(path)` rule does **not** match file-write checks.
- `AskUserQuestion` is blocked in `auto`/`dontAsk` modes and under `-p --permission-prompts none`.

## 3.1 / 3.3 CLAUDE.md hierarchy, imports, rules
Source: https://code.claude.com/docs/en/memory
- Load order (broadest → narrowest, later = read last): managed policy (`/Library/Application Support/ClaudeCode/CLAUDE.md` macOS, `/etc/claude-code/CLAUDE.md` Linux, `C:\Program Files\ClaudeCode\CLAUDE.md` Windows; cannot be excluded) → user `~/.claude/CLAUDE.md` → project `./CLAUDE.md` **or** `./.claude/CLAUDE.md` → local `./CLAUDE.local.md` (personal, gitignored, loaded after CLAUDE.md at that level).
- At launch Claude Code loads CLAUDE.md/CLAUDE.local.md from **cwd and every ancestor**. Files in **subdirectories load lazily**, only when Claude reads files there. Contents are **concatenated**, not overridden.
- Imports: `@path/to/file`, relative paths resolve against the **importing file**; absolute allowed; max depth **4 hops**; imports inside code spans/fences are ignored; imports resolving outside the working directory trigger a one-time approval (declining disables them for that project).
- `AGENTS.md` is **not read** — use `@AGENTS.md` in CLAUDE.md or a symlink.
- `.claude/rules/*.md`: discovered recursively; rules **without** `paths:` frontmatter load at launch with the same priority as `.claude/CLAUDE.md`; rules **with** `paths:` globs load lazily when a matching file is read; brace expansion `{ts,tsx}`; symlinks allowed; cap 1,000 expanded patterns / 4 MiB per rule. `~/.claude/rules/` load **before** project rules → **project rules win**.
- Size: keep CLAUDE.md **under 200 lines**; files over **4 MiB are skipped**; `/doctor` proposes trims; `/init` suggests improvements when a file already exists.
- Compaction: **project-root CLAUDE.md survives `/compact`** (re-read from disk); nested CLAUDE.md and path-scoped rules reload only when matching files are read again; instructions given only in chat are lost.
- Output styles (separate from CLAUDE.md): modify the system prompt; `outputStyle` in `.claude/settings.local.json` or files in `.claude/output-styles/`. https://code.claude.com/docs/en/output-styles

## 3.2 Skills and slash commands
Source: https://code.claude.com/docs/en/skills · https://code.claude.com/docs/en/slash-commands
- **Custom commands have been merged into skills.** `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both produce `/deploy`; old command files still work; **the skill wins on a name conflict**.
- Locations: personal `~/.claude/skills/<name>/SKILL.md`; project `.claude/skills/<name>/SKILL.md`; enterprise managed dir; plugin-namespaced.
- Frontmatter: `name`, `description`, `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context: fork`, `agent`, `background`, `paths`, `shell`, `hooks`, `metadata`. Command files ignore `name` and `paths`.
- Arguments: `$ARGUMENTS`, `$0`/`$1`/`$N`, `$name` (per `arguments:`), `${CLAUDE_SESSION_ID}`, `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_SKILL_DIR}`.
- Skills load on demand (invoked or judged relevant), keeping base context smaller than CLAUDE.md text. Bundled skills exist (`/run`, `/verify`, `/debug`, `/code-review`); `disableBundledSkills` turns them off.

## 3.4 Plan mode and permission modes
Source: https://code.claude.com/docs/en/common-workflows · https://code.claude.com/docs/en/agent-sdk/permissions
- Enter via Shift+Tab cycling, `--permission-mode plan`, or SDK `permissionMode: "plan"`; status shows `⏸ plan mode on`. Claude explores and proposes a plan; **no edits until approved**.
- In plan mode, file-edit and shell-write tools **always route to `canUseTool`** regardless of allow rules (since v2.1.212 this includes shell commands like `touch`/`rm` that modify files).
- Recommended for complex tasks (avoids expensive rework) and for review flows where changes must be approved before touching disk.
- Other modes: `default` (prompts), `acceptEdits` (auto-approves edits + `mkdir/touch/rm/rmdir/mv/cp/sed` in the working dir), `bypassPermissions` ("extreme caution"), `dontAsk` (denies instead of prompting), `auto` (classifier decides).

## 3.6 Headless / CI
Source: https://code.claude.com/docs/en/headless
- `-p`/`--print` non-interactive; `--bare` skips auto-discovery of hooks, skills, commands, subagents, plugins, MCP, auto-memory and CLAUDE.md (recommended for scripted calls; slated to become the `-p` default).
- `--output-format text|json|stream-json`; `--json-schema '<schema>'` with `json` puts the result in `structured_output` — an **invalid schema is a hard error since v2.1.205** (previously ignored).
- `--allowedTools "Read,Edit,Bash"`, `--disallowedTools`; `--permission-mode …`; `--permission-prompts none` (v2.1.259+: deny anything unresolved rather than wait); `--append-system-prompt`/`--append-system-prompt-file`/`--system-prompt`; `--settings`; `--mcp-config`; `--agents <json>`; `--continue`/`--resume`/`--fork-session`; `--no-session-persistence`; `--verbose` (required for streaming) + `--include-partial-messages`; `--forward-subagent-text` (v2.1.211+).
- Exit codes: 0 success, non-zero failure; SIGTERM → 143 with the turn unfinished; SIGINT ends the turn cleanly. Piped stdin capped at 10 MB.

## 4.5 Message Batches API
Source: https://platform.claude.com/docs/en/build-with-claude/batch-processing
- Flat **50% discount** on input and output tokens, all active models.
- Limits: **100,000 requests or 256 MB** per batch, whichever first.
- Most batches finish **within 1 hour**; results available when all requests finish **or after 24 hours**, whichever first. **No latency guarantee**; under load more requests may expire.
- A batch **expires at 24 hours**; unprocessed requests are marked `expired` and not billed. Results downloadable for **29 days**.
- **Result order is not guaranteed** — always match on `custom_id`. Result types: `succeeded`, `errored`, `canceled`, `expired` (only `succeeded` billed).
- `max_tokens` must be ≥1 per request; `stream: true` and `speed` are rejected in batches. Prompt-cache hits stack with the discount but are best-effort (30–98% observed). Batches can be cancelled mid-flight (`canceling` → `ended`, partial results kept). Scoped to a Workspace.

## 5.1 / 5.4 Context management in Claude Code
Source: https://code.claude.com/docs/en/costs · https://code.claude.com/docs/en/memory
- `/compact` summarises older history; accepts focus instructions (`/compact Focus on the schema decisions`) and a CLAUDE.md "Compact instructions" section; compaction is itself a large request. `/clear` starts a fresh session at no cost (session-cost totals reset since v2.1.211).
- After `/compact`, only project-root CLAUDE.md is re-injected automatically (see §3.1).
- Auto memory lives in `~/.claude/projects/<project>/memory/`, indexed by `MEMORY.md`; only the first **200 lines or 25 KB** of `MEMORY.md` load each session; machine-local, shared across worktrees, not across machines.

## Extended thinking (background)
Source: https://code.claude.com/docs/en/costs · https://platform.claude.com/docs/en/build-with-claude/thinking
- On by default; thinking tokens are billed as output and count toward `max_tokens`. Adjust with `/effort` or `MAX_THINKING_TOKENS` (fixed-budget models only). Cannot be disabled on Fable models. Manual thinking blocks forced `tool_choice`; adaptive thinking allows it.

## Excluded — not confirmed on 2026-09-05, never used in a question
- Exact `canUseTool` callback signature and field names.
- Whether `MultiEdit` exists as a distinct current tool.
- `--max-turns` semantics and default.
- MCP argument-completion as surfaced in Claude Code's own client UX (protocol-level only).
- A dedicated "extraction quality" guide beyond the tool-definition best practices.
