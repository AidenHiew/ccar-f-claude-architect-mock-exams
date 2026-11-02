# Hands-On Exercises (from the official guide, as trackable checklists)

The exam targets practitioners — these four builds cover most of the tested judgment calls. Check items off as you go.

## Exercise 1: Multi-Tool Agent with Escalation Logic
*Domains 1, 2, 5 · scheduled weeks 1–2*

- [ ] Define 3–4 MCP tools with detailed descriptions (purpose, expected inputs, boundary conditions) — include two deliberately similar tools and write descriptions that prevent selection confusion
- [ ] Implement the agentic loop: continue on `stop_reason == "tool_use"`, terminate on `"end_turn"`
- [ ] Add structured error responses (`errorCategory`: transient/validation/permission, `isRetryable`, human-readable description); verify the agent retries transient errors and *explains* business errors to the user
- [ ] Implement a tool-call interception hook enforcing a business rule (e.g., block operations above a threshold) that redirects to an escalation workflow
- [ ] Test multi-concern messages; verify decomposition, per-concern handling, and a unified synthesized response

**What to notice:** how often prompt-only enforcement fails vs the hook (never); how error metadata changes the agent's recovery behavior.

## Exercise 2: Claude Code for a Team Workflow
*Domains 3, 2 · scheduled week 4*

- [ ] Project-level CLAUDE.md with universal standards; verify it applies for a "fresh clone" (delete/rename your user-level file to simulate a teammate)
- [ ] `.claude/rules/` files with `paths:` glob frontmatter (e.g., `["src/api/**/*"]`, `["**/*.test.*"]`); confirm rules load only when editing matching files
- [ ] Project skill in `.claude/skills/` with `context: fork` and `allowed-tools`; confirm its verbose output stays out of the main conversation
- [ ] MCP server in `.mcp.json` with `${ENV_VAR}` credential expansion + a personal server in `~/.claude.json`; verify both are available simultaneously
- [ ] Compare plan mode vs direct execution on: a single-file bug fix, a multi-file library migration, a feature with multiple valid designs

**What to notice:** where each config layer lives and what git shares; when plan mode actually paid off.

## Exercise 3: Structured Data Extraction Pipeline
*Domains 4, 5 · scheduled week 6*

- [ ] Extraction tool with a JSON schema: required + optional fields, an enum with `"other"` + detail string, nullable fields — verify the model returns null (not fabrications) on documents missing fields
- [ ] Validation-retry loop: on schema/Pydantic failure, resend document + failed extraction + specific error; log which errors retry fixes (format) vs can't (absent info)
- [ ] Few-shot examples covering varied document formats (inline citations vs bibliographies, narrative vs tables); measure the improvement
- [ ] Batch of 100 documents via the Message Batches API; handle failures by `custom_id`, resubmit only failures (chunking oversized docs); compute total time vs an SLA
- [ ] Field-level confidence scores → route low-confidence extractions to human review; analyze accuracy by document type and field

**What to notice:** required fields causing fabrication first-hand; the retry ceiling on absent data.

## Exercise 4: Multi-Agent Research Pipeline
*Domains 1, 2, 5 · scheduled weeks 3 & 5*

- [ ] Coordinator with `allowedTools` including `"Task"`, delegating to ≥2 subagents; pass findings explicitly in each subagent's prompt (no context inheritance)
- [ ] Parallel execution: multiple Task calls in one coordinator response; measure latency vs sequential
- [ ] Structured subagent output separating content from metadata: claim, evidence excerpt, source URL/doc name, publication date; verify synthesis preserves attribution
- [ ] Simulate a subagent timeout; check that the coordinator gets a structured error report (what failed, the query that was tried, any partial results) and can proceed with partials + coverage-gap annotations
- [ ] Feed in two credible sources with conflicting statistics; verify synthesis preserves both values with attribution and separates well-established from contested findings

**What to notice:** what breaks when you *don't* pass context explicitly; how structured errors enable recovery that generic errors can't.
