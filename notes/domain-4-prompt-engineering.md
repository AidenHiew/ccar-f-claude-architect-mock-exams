# Domain 4: Prompt Engineering & Structured Output (20%)

## 4.1 Explicit criteria to reduce false positives

- **Specific categorical criteria beat vague instructions.** "Flag comments only when the claimed behavior contradicts actual code behavior" ≫ "check that comments are accurate." And "be conservative" / "only report high-confidence findings" **do not** improve precision — the model's self-assessed confidence isn't calibrated.
- Define **which categories to report** (bugs, security) vs **skip** (minor style, local patterns) — categorical filtering, not confidence filtering.
- High false-positive categories poison developer trust in the *accurate* categories → **temporarily disable** the noisy category while you improve its prompt.
- Severity classification consistency → explicit severity criteria **with concrete code examples per level**.

## 4.2 Few-shot prompting

- The most effective technique when detailed instructions alone produce inconsistently formatted output.
- **2–4 targeted examples for ambiguous cases**, showing the *reasoning* for why one action beats plausible alternatives — this lets the model generalize judgment to novel patterns rather than pattern-match pre-listed cases.
- Uses: demonstrating output format (location, issue, severity, suggested fix); distinguishing acceptable patterns from genuine issues; handling varied document structures (inline citations vs bibliographies); fixing empty/null extraction on unusual formats; reducing extraction hallucination.

## 4.3 Structured output via tool use + JSON schemas

- **tool_use with a JSON schema = the most reliable way to get schema-compliant output.** Eliminates JSON *syntax* errors. Does **NOT** prevent *semantic* errors (line items not summing to total, values in the wrong field).
- **`tool_choice` recap:** `"auto"` may return text; `"any"` guarantees *a* tool call (use when multiple extraction schemas exist and document type is unknown); forced `{"type": "tool", "name": "extract_metadata"}` guarantees a *specific* tool runs (e.g., before enrichment steps).
- **2026-09 caveats (docs-delta §2.3):** on Fable 5.1 / Mythos 5.1, `tool_choice` `any` and `tool` return **HTTP 400** → use `auto` with `strict: true`, or **native structured outputs** (`output_config.format = {type: "json_schema", schema: {…}}` → schema-guaranteed JSON in a text block). **Prefill of the assistant turn is not supported on Claude 4.6+** — use structured outputs. Structured outputs remove schema retries; business-logic validation and retry stay the caller's job.
- **Schema design:**
  - Fields that may be absent from source documents → **optional/nullable**, otherwise the model **fabricates values** to satisfy `required`
  - Enums: add `"unclear"` for ambiguous cases; `"other"` + a detail string field for extensible categories
  - Put **format normalization rules in the prompt** alongside the strict schema to handle inconsistent source formatting

## 4.4 Validation, retry, feedback loops

- **Retry-with-error-feedback:** follow-up request = original document + failed extraction + the specific validation errors → model self-corrects.
- **Retries fix format/structural errors; they CANNOT fix absent information.** If the data only exists in a document you didn't provide, no retry count helps.
- Semantic validation ≠ schema syntax: tool use killed syntax errors; you still need semantic checks (sums, field placement).
- Self-correction patterns: extract `calculated_total` alongside `stated_total` and flag discrepancies; `conflict_detected` booleans for inconsistent source data.
- Feedback loops for review systems: a `detected_pattern` field on each finding lets you analyze which constructs trigger dismissed (false-positive) findings.

## 4.5 Batch processing (Message Batches API)

**Memorize these facts:**
- **50% cost savings**
- Processing window **up to 24 hours**, **no guaranteed latency SLA**
- **`custom_id`** correlates request/response pairs
- **No multi-turn tool calling** within a single batch request (can't execute tools mid-request and return results)

**Judgment:**
- Appropriate: non-blocking, latency-tolerant work — overnight reports, weekly audits, nightly test generation
- Inappropriate: blocking workflows — pre-merge checks where a developer waits
- SLA math: with 24h max batch time and a 30h SLA, submit on a ≤4–6h cadence (e.g., 4-hour windows → 28h worst case < 30h)
- Failures: resubmit **only the failed items** (found via `custom_id`), modified as needed (e.g., chunk documents that blew the context limit)
- Refine the prompt on a **sample set first** to maximize first-pass success before paying for a big batch

## 4.6 Multi-instance & multi-pass review

- **Self-review limitation:** a model that just generated code retains its reasoning context and won't seriously question its own decisions — self-review instructions and extended thinking don't fix this. Use an **independent instance** with no generation context.
- **Multi-pass for large PRs:** per-file passes for local issues + a separate cross-file integration pass. Fixes attention dilution (superficial comments, missed bugs, contradictory feedback on identical code). Bigger context windows do NOT fix attention quality; consensus voting across runs suppresses real intermittent catches.
- Verification passes can have the model report confidence per finding to route review attention — but calibrate before trusting.

---

## Exam traps for this domain

| Trap | Correct instinct |
|---|---|
| "Be conservative / high-confidence only" to cut false positives | Explicit categorical criteria; disable noisy categories temporarily |
| Required schema field for data that may not exist | Nullable/optional — required fields cause fabrication |
| `tool_choice: "auto"` when JSON is mandatory | `"any"` or forced selection (on Fable 5.1 / Mythos 5.1: 400 → `auto` + `strict: true` or native structured outputs) |
| Prefill the assistant turn to force a JSON opening | Not supported on Claude 4.6+ — native structured outputs |
| Retrying extraction when the info isn't in the document | Retry only helps format/structural errors |
| Batch API for pre-merge (blocking) checks | Synchronous API; batch only for latency-tolerant work |
| Believing schema = correct data | Schema kills syntax errors only; add semantic validation |
| Bigger context window to fix inconsistent 14-file review | Multi-pass architecture (per-file + integration) |
| Self-review in the same session | Independent second instance |
