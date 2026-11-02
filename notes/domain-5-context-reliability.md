# Domain 5: Context Management & Reliability (15%)

## 5.1 Preserving critical information in long conversations

- **Progressive summarization risk:** condensing numbers, percentages, dates, and customer-stated expectations into vague prose. Fix: pull the transactional details (amounts, dates, order numbers, statuses) out into a persistent **"case facts" block** included in each prompt *outside* the summarized history. Multi-issue sessions → a separate structured layer of issue data (order IDs, amounts, statuses).
- **Lost in the middle:** models reliably process the beginning and end of long inputs, and may drop the middle. Fix: put key-findings summaries **at the beginning** of aggregated inputs, organize details with explicit section headers.
- **Tool-output bloat:** results accumulate disproportionately to relevance (40+ fields per order lookup, 5 relevant). **Trim to relevant fields before results accumulate in context.**
- Pass **complete conversation history** in subsequent API requests for coherence.
- Multi-agent: have subagents attach metadata (dates, source locations, how the information was gathered) to their structured outputs; when downstream agents have tight context budgets, have upstream agents hand back **compact structured data (key facts, citations, relevance scores) rather than lengthy content and reasoning chains**.

## 5.2 Escalation & ambiguity resolution

- **Valid escalation triggers:**
  1. Customer explicitly requests a human — **honor immediately, without first attempting investigation**
  2. Policy exceptions or **policy gaps** (policy is silent/ambiguous on the request, e.g., competitor price matching when policy only covers own-site adjustments)
  3. Inability to make meaningful progress
- Nuance: frustrated customer + straightforward issue → acknowledge frustration, **offer** to resolve; escalate if they reiterate the preference.
- **Unreliable proxies (distractors):** sentiment-based escalation (frustration ≠ complexity) and self-reported confidence scores (poorly calibrated — the agent is confidently wrong on exactly the hard cases).
- Best first fix for bad escalation calibration: **explicit escalation criteria + few-shot examples in the system prompt** — not a trained classifier, not confidence thresholds.
- **Multiple customer matches → ask for additional identifiers.** Never pick heuristically.

## 5.3 Error propagation in multi-agent systems

- Subagent failure should return **structured error context**: failure type, attempted query, partial results, potential alternative approaches → the coordinator can retry with an adjusted query, switch to an alternative, or proceed with partials.
- **Anti-patterns:** generic statuses ("search unavailable") that hide context; silently returning empty results marked successful; terminating the whole workflow on one failure.
- Distinguish **access failures** (timeout — retry decision needed) from **valid empty results** (successful query, no matches).
- Subagents handle **local recovery** for transient failures; propagate only unresolvable errors, with what was attempted + partials.
- Synthesis output should carry **coverage annotations**: which findings are well-supported vs which topic areas have gaps due to unavailable sources.

## 5.4 Context management in large codebase exploration

- **Context degradation symptom:** in extended sessions the model gives inconsistent answers and cites "typical patterns" instead of the specific classes it found earlier.
- Countermeasures:
  - **Scratchpad files** recording key findings; reference them for later questions
  - **Subagent delegation** for verbose investigation ("list the test files", "follow the refund flow's dependencies") while the main agent keeps high-level coordination
  - **Summarize each phase** before spawning the next phase's subagents; inject summaries into their initial context
  - **`/compact`** to reduce context when a session fills with verbose discovery output
- **Crash recovery:** each agent exports structured state (manifest) to a known location; on resume the coordinator loads the manifest and injects it into agent prompts.
- Prompt caching: prefix order is `tools` → `system` → `messages`; a hit needs the prompt identical up to and including the marked block. Rule: put `cache_control` on the **last block identical across requests** — a breakpoint on a varying block (timestamp, user turn) writes every call and never reads. ≤4 breakpoints; min prefix 512 tok (Opus 5 class) / 1,024 (Sonnet 5) / 4,096 (Haiku 4.5), silently no-ops below; TTL 5 min default or 1 h; write ×1.25 (5 m) or ×2 (1 h), read ×0.1. (platform.claude.com/docs/en/build-with-claude/prompt-caching, fetched 2026-09-16)

## 5.5 Human review workflows & confidence calibration

- **Aggregate accuracy hides segment failures:** 97% overall can mask terrible accuracy on one document type or field. **Analyze by document type AND field segment** before reducing human review.
- **Stratified random sampling** of high-confidence extractions → ongoing error-rate measurement + detection of novel error patterns.
- **Field-level confidence scores**, calibrated against **labeled validation sets**, route review attention.
- Route to human review: low model confidence, or ambiguous/contradictory source documents — prioritizing limited reviewer capacity.

## 5.6 Provenance & uncertainty in multi-source synthesis

- Attribution gets lost when findings are compressed without preserving **claim-source mappings**. Require subagents to output structured mappings (source URL, document name, relevant excerpt) that downstream agents **preserve through synthesis**.
- **Conflicting statistics from credible sources:** annotate the conflict **with both values and their sources** — never arbitrarily pick one. Analysis completes with conflicts included and flagged; the **coordinator decides** reconciliation before synthesis.
- **Temporal data:** require publication/collection dates in structured outputs so temporal differences aren't misread as contradictions.
- Reports: explicit sections separating **well-established vs contested findings**, preserving original source characterizations and methodological context.
- Render content types natively — tables for financial figures, prose for news, structured lists for technical findings — don't flatten to one format.

---

## Exam traps for this domain

| Trap | Correct instinct |
|---|---|
| Summarize everything to save tokens | Persistent structured "case facts" outside the summary |
| Escalate on negative sentiment / low self-confidence | Explicit criteria + few-shot; sentiment ≠ complexity |
| Investigate first when customer demands a human | Escalate immediately |
| Pick the most likely customer among multiple matches | Ask for additional identifiers |
| Trust 97% aggregate accuracy | Segment by document type and field first |
| Synthesis picks the "better" of two conflicting stats | Preserve both, annotate with sources; coordinator reconciles |
| Different dates treated as contradiction | Require timestamps in structured output |
| Keep exploring in one giant session | Scratchpads, subagents, phase summaries, `/compact` |
