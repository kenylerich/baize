# Standard Vibe Coding Development Environment (Agent Harness): Research Summary

> status: Active — authoritative English version. Chinese translation: [harness-best-practices.zh.md](./harness-best-practices.zh.md).
>
> **Goal**: distill recent industry practice on "agent harnesses for long-running tasks" (Anthropic, OpenAI, LangChain, Thoughtworks/Martin Fowler, Mitchell Hashimoto) into a **standard, universal method for setting up a development environment** that enables Vibe Coding (humans steer, agents row) for long-running tasks with guaranteed quality.
>
> Compiled: 2026-09-14. All conclusions come from the public sources listed at the end.
>
> For the zero-background implementation guide, see the companion **Implementation Guide**: [vibe-coding-harness-plan.md](../solution/vibe-coding-harness-plan.md) (this document is the design rationale and source digest).

---

## 0. TL;DR (One-Page Conclusions)

1. **The model is the engine; the harness is the whole car.** Agent = Model + Harness (system prompt, tools, sandbox, verification loop, memory). The same model with different harnesses performs orders of magnitude apart (LangChain measured large benchmark gains from harness optimization alone).
2. **Every harness component encodes an assumption about "what the model can't do yet"** (Anthropic). When the model upgrades, go back and remove scaffolding — the harness is an asset that keeps getting simpler over time.
3. **Context is the scarcest resource.** Give it a map, not a 1000-page manual (OpenAI); knowledge lives in the repo `docs/` as the system of record, `AGENTS.md` is only the table of contents.
4. **Persist state into the file system and git, not into context.** Progress files + feature lists + descriptive commits let the agent recover losslessly after a crash or session change (Anthropic, Mitchell).
5. **The verification loop is a first-class citizen.** Without machine-checkable "done" criteria there is no quality for long tasks: end-to-end browser tests, hooks that run tests, generator–evaluator, custom linters whose error messages are fix instructions.
6. **One feature at a time, small commits, verify every step** (the #1 antidote to long-task failure modes).
7. **Agent struggle is not "try harder" — it is an environment defect**: missing tool? missing guardrail? missing doc? Feed the answer back into the repo (OpenAI, Thoughtworks).
8. **Constrain architecture boundaries, delegate local implementation** (enforce invariants, not implementations). Layering, structural tests, taste invariants — encode once, holds everywhere.
9. **Entropy must be managed by agents**: background garbage-collection agents, doc-gardening agents, quality scoring — small continuous debt repayment instead of Friday human cleanup of AI slop.
10. **Security boundaries come first**: credentials in a vault + proxy, never visible to the sandbox; environments are cattle, not pets (Anthropic Managed Agents).

---

## 1. What Is a Harness, and Why It Decides Vibe Coding Success

**Definition**: the harness is everything wrapped around the model — system prompts, tools & skills (MCP), sandboxes & run environments, verification & feedback loops, memory & knowledge bases, orchestration & recovery.

**Key insights (cross-validated by all sources):**

| Insight | Source |
|---|---|
| Agent = Model + Harness; the harness is all the engineering that turns "one model call" into "a reliable work engine" | LangChain, *The Anatomy of an Agent Harness* |
| Every harness component encodes an assumption about "what the model cannot do"; as models improve, simplify the harness | Anthropic, *Harness design for long-running apps* |
| The engineer's new job is not writing code but **designing environments, expressing intent, building feedback loops** | OpenAI, *Harness engineering* |
| Slow early progress is not the model failing — it is an **underspecified environment** (missing tools, abstractions, structure) | OpenAI / Thoughtworks, agreeing |
| Harness engineering = templated "golden paths" + computational/inferential **sensors** that continuously measure repo health | Martin Fowler / Thoughtworks memo |

**For the goal of "long tasks + high quality", the harness must solve four problems:**

1. **Limited context**: the total state of a long task exceeds any context window → externalize state.
2. **Subjective task dimensions**: "beautiful, elegant, high quality" cannot be judged from code alone → generator–evaluator with written scoring rubrics.
3. **Runs get interrupted**: crashes, full context, model upgrades → must be crash-only recoverable.
4. **Entropy accumulates**: agents copy existing bad patterns → mechanical constraints + periodic GC.

---

## 2. Sources and Per-Source Digests

### 2.1 Anthropic, *Effective harnesses for long-running agents*
(Scenario: one coding agent runs ~8 hours to implement a 200+ feature app from scratch)

- **Two-agent pattern**:
  - **Initializer Agent**: runs `init.sh` to scaffold; writes **all features into a JSON checklist, every feature initially marked "failed/not done"**; creates `claude-progress.txt`; starts the dev server; passes one end-to-end browser check (Puppeteer MCP); commits. Then it exits — its job was to build a "well-defined world" for the main agent.
  - **Coding Agent**: loops "read progress → take one feature → implement → mark done only after e2e passes → commit + update progress".
- **Core disciplines**:
  - **One feature at a time** (parallel features = piles of half-broken work — failure mode #1).
  - **End-to-end verification before checking done** — unit tests don't catch "looks right, doesn't run".
  - **Progress file + descriptive commits** are cross-session memory: a new session rebuilds all state from `git log` + progress file.
- **Session recovery ritual (warm-up)**: `pwd` → read git log → read progress file → read feature list → start server → run one e2e smoke test → continue. Spend the first 2–3 minutes re-reading the world; never continue on hallucination.
- **Official failure-mode table (internalize this):**

| Failure mode | Symptom | Mitigation |
|---|---|---|
| Not asking clarifying questions | Wrong assumptions baked into implementation | Prompt requires "ask questions and wait before coding" |
| Deviating from specs / cutting corners | Missing or fake features | Force a git commit each step; leave `# TASK: Implement feature X` above stubs — on resume, `grep -r "TASK: Implement"` catches skipped work |
| Starting multiple features simultaneously | Piles of partial features | Explicit instruction: one feature at a time |
| Not documenting progress | Forgetting what's done | Commit each step; progress file; descriptive messages |
| Getting stuck on hard problems | Burned time and tokens | Allow "document the blocker in the progress file → skip or ask for help" — never grind |
| Not managing context | Irrelevant content crowds the token budget | Close unused editor tabs; don't read irrelevant images |

### 2.2 Anthropic, *Harness design for long-running apps*
(Scenario: Claude generates an entire Next.js app where quality includes subjective "design taste")

- **Generator–evaluator architecture** (GAN-inspired):
  - **Planner Agent**: produces the product concept and execution plan (`plan.md`);
  - **Generator Agent**: implements one functional unit per a written **sprint contract**, outputs implementation docs;
  - **Evaluator Agent**: scores the artifact against a **written rubric** — design quality, originality, craftsmanship, functionality; its score seeds the generator's next round.
- **Three key mechanisms**:
  1. **Sprint contracts** bound what "this round delivers" and by which acceptance criteria — preventing scope creep and context overload.
  2. **Context-anxiety management**: prefer **periodic full context resets + handoff documents** over endless compaction — a reset is "a new employee with a handover doc", more reliable than "an old employee with fuzzy memory".
  3. **Agents communicate only through files**: `plan.md`, `implementation.md`, `grading.md`, not messages — files are versionable, recoverable, auditable.
- **Co-evolution with models**: as models got stronger, scaffolding was deleted version by version (e.g., the "sprint" construct was later removed entirely — one agent completes multiple steps in one go). **Keep the harness minimal: only what the model still can't do.**
- Measured: evaluation consumed a considerable share of total time/cost — and was worth it; subjective quality comes mostly from evaluator-driven polishing.

### 2.3 Anthropic, *Managed Agents: decoupling the brain from the hands*
(Scenario: turn agents from pets into cattle; run hundreds of long-task agents at scale)

- **Three-way decoupling**:
  - **Brain**: model + harness (prompts, skills, orchestration);
  - **Hands**: sandbox & toolset (provisioned per task);
  - **Session**: the context state itself, modeled as **positional slices of an event stream**, outliving any single model call.
- **Minimal interface abstraction** (copy directly for a homegrown platform):
  - `execute(name, input) → string`: invoke a tool/skill;
  - `provision({resources})`: supply the environment on demand (VM, network, browser…);
  - `wake(sessionId)` / `getSession(id)`: wake/resume any session;
  - `emitEvent(id, event)` / `getEvents()`: event-sourced record.
- **Engineering payoffs**: large TTFT improvements (warm snapshots + reused environments); a dead sandbox is replaced and the session continues losslessly.
- **Security model (key)**: credentials **never reachable from the sandbox** — tokens live in a vault; in-sandbox tool calls go through an **authenticated proxy**; the agent sees capability, not credentials; outbound ops like git push are executed by the platform layer holding the credentials.
- **Meta-harness**: harnesses described in this abstraction can themselves be orchestrated by another agent — "the agent that manages agents".

### 2.4 Mitchell Hashimoto, *My AI adoption journey*
(Scenario: one developer takes AI from "chat toy" to "full-time teammate" in six stages)

1. **Drop the chatbot; use a real agent** (one that reads/writes files, runs commands, verifies itself).
2. **Reproduce your own work**: have the agent redo a task you just finished and diff the results — the best way to build trust and find harness gaps. Techniques:
   - **Split work into clearly-bounded sessions**, one task per session;
   - **Separate planning sessions from execution sessions**: agent drafts a plan, human reviews, a fresh execution session follows it;
   - **Give the agent verification tools** so it can confirm "done" itself.
3. **End-of-day agents**: fit "fuzzy exploration" tasks (deep research, parallel vague ideas, issue/PR triage) — note you want **reports, not responses**; review them in the morning.
4. **Outsource the slam dunks** (clear patterns, easy verification); at this point you can **turn off notifications and do something else** — the supervisor-to-delegator turning point.
5. **Engineer the harness (the folk version of this guide)**:
   - Every time the agent makes a mistake, **improve AGENTS.md on the spot** — codify the lesson as a rule instead of correcting verbally next time;
   - **Script the common verifications** (e.g., a screenshot script) so the agent runs a tool instead of you pasting screenshots;
   - **Filter test runners**: pass test names/filters so the agent ignores unrelated failures and saves huge debugging time.
6. **Always have an agent running**: the mindset completes — the human is the dispatcher and acceptor.

### 2.5 Martin Fowler / Thoughtworks, *Harness engineering memo*
(Scenario: a consultancy's view of promoting harness engineering into an organizational capability)

- **Two core constructs**:
  - **Guides**: turn "the architecture/taste we expect" into something agents can execute;
  - **Sensors**: mechanisms that continuously measure whether the codebase drifts from expectations. Two kinds:
    - **Computationally evaluated**: compile, unit tests, contract tests, custom linters — deterministic;
    - **Inferentially evaluated**: an LLM judges subjective dimensions (e.g., "does this code match our DDD style") — models judging models.
- **Harness templates = new-service templates / golden paths**: the org bakes the standard harness into service scaffolding (agent instructions, verification scripts, constraint configs) so new projects get it out of the box.
- **Trade autonomy for constrained runtimes**: stronger AI autonomy requires **stricter architectural descriptions, enforced boundaries, standardized structures**. Organizationally, **converge on fewer tech stacks** (fewer exotic choices, more reliable agents).
- **Context engineering triad**: knowledge base (system of record) + observability (logs/metrics readable by agents) + browser (agents can see the UI).
- **Garbage-collection agents**: periodic agents check doc/code inconsistency and architecture violations, and open fix PRs directly.
- **Iteration mantra**: "when the agent struggles, treat it as a signal: identify what's missing — tools, guardrails, documentation — feed it back into the repo."

### 2.6 OpenAI, *Harness engineering: leveraging Codex in an agent-first world* ⭐ (supplementary research)
(Scenario: 3 engineers + Codex ship ~1M lines of code, ~1500 PRs in weeks, **0 hand-written lines**, ~3.5 PRs/person/day)

- **Core philosophy: humans steer, agents execute.** Engineers interact through prompts: describe the task → agent implements → opens a PR → self-review + requests reviews from other agents → iterates until all review agents are satisfied (a Ralph-Wiggum loop) → can be auto-merged. Human review gradually became optional.
- **Repo knowledge = system of record**:
  - **Give Codex a map, not a 1000-page manual**: `AGENTS.md` is ~100 lines, a **table of contents** only; real knowledge lives in structured `docs/` (design docs with indices and validation status, architecture diagrams, per-domain quality docs).
  - Four sins of a giant instruction file: crowds context / everything "important" = nothing is / rots immediately / cannot be mechanically validated.
  - **Progressive disclosure**: small stable entry + pointers to lower layers; **linters and CI jobs mechanically validate** the knowledge base's structure, cross-links and freshness.
  - **Plans are first-class artifacts**: lightweight plans for small changes; execution plans with progress logs and decision logs for complex work — all versioned in the repo.
  - Knowledge outside the repo doesn't exist: if an architectural consensus lives only in Slack, it's equally invisible to the agent and to a new hire three months later.
- **Agent legibility first**: the app boots per **git worktree** (independent instance per change); wired to **Chrome DevTools Protocol** + DOM snapshot/screenshot/navigation skills; **an ephemeral observability stack per worktree** (agents query logs with LogQL and metrics with PromQL; destroyed when the task ends). This makes prompts like "ensure startup <800ms" or "no critical-journey span over 2s" executable.
- **Mechanically enforcing architecture & taste**:
  - Fixed layering `Types → Config → Repo → Service → Runtime → UI`; cross-cutting concerns (auth, telemetry, feature flags) only via Providers as the single entry; dependency direction enforced by **custom linters + structural tests**;
  - Custom lint **error messages embed the fix instructions** (the error is the prompt);
  - "Taste invariants": structured logging, naming conventions, file-size caps, etc.;
  - Principle: **enforce invariants, don't micromanage implementations** (e.g., mandate "parse data shapes at boundaries" without prescribing which library).
- **Tech choices tilt toward agents**: "boring" technologies (composable, stable APIs, abundant training data) are easier for agents to model correctly; when necessary have the agent rewrite small utilities for full in-repo legibility (e.g., skip `p-limit`, write an in-repo concurrency map helper with 100% coverage).
- **Throughput changed merge philosophy**: minimal blocking merge gates; short-lived PRs; flaky tests are retried rather than blocking forever — **fixes are cheap; waiting is expensive** (don't copy this in low-throughput environments).
- **Entropy governance = GC**: they once spent ~20% of weekly capacity cleaning "AI slop" — unsustainable. Fix: encode **golden principles** into the repo (prefer the shared toolkit over hand-rolled helpers; no YOLO-style data probing, etc.) + **background Codex tasks that periodically scan for deviations, update quality scores, open targeted refactor PRs** (most reviewable in a minute, auto-mergeable). Tech debt is a high-interest loan — repay in small continuous steps.
- **Fully autonomous loops exist**: a single prompt drives the agent through "verify current state → reproduce the bug → record a failure video → fix → drive the app to verify → record the fix video → open a PR → respond to reviews → fix the build → escalate only when human judgment is needed → merge".
- **Meta-methodology**: on failure, almost never "try again" — ask "**what capability is missing? How do we make it legible and enforceable for the agent?**", and **have Codex itself write the fix**.

### 2.7 LangChain, *The Anatomy of an Agent Harness*
(Scenario: a systematic taxonomy of harness components)

- **Harness component checklist** (use for self-audit):
  1. **System prompt**: role, rules, output conventions;
  2. **Tools / skills / MCP**: the controlled capability surface; skills = procedural knowledge loaded on demand (progressive disclosure);
  3. **Bundled infrastructure**: file system (durable storage — the home of cross-session state), **sandbox** (isolation, snapshots, and good default tooling: runtimes, git, testing, browsers), **bash** (the universal tool: curl/jq and every shim), browser (see the UI, e2e);
  4. **Orchestration**: sub-agents (context-isolated parallel exploration), handoffs, model routing (expensive model decides / cheap model executes);
  5. **Hooks & middleware**: insert logic around tool calls — **the self-verification loop (auto-run tests/format/lint after changes) hangs here**.
- **Memory**: `AGENTS.md` is the minimal viable memory; advanced = file system + layered retrieval.
- **Long-horizon techniques**: Ralph loops (self-driven iteration to completion), plan-then-execute, hooks that run test suites for self-verification, **file system as durable state**.
- **Context-rot countermeasures**: compaction, offloading tool results to files, skills loaded on demand.
- **Conclusion**: models and harnesses **co-evolve**; harness optimization is a huge lever (same model, better harness, substantially higher benchmark scores).

---

## 3. Cross-Source Consensus: Eight Design Principles

Stacking the six practices together, nearly every principle is independently confirmed by at least two sources:

1. **Externalize state**: task state, progress, decisions, knowledge all live in repo files + git; context is only a cache. *"Files are memory; git is history."* (Anthropic progress files, OpenAI execution plans, LangChain file systems)
2. **Map-style context**: short stable entry instructions, layered knowledge with progressive disclosure, mechanical freshness checks. (OpenAI, LangChain, Thoughtworks)
3. **Machine-checkable "done"**: every task needs a verification script / e2e / scoring rubric; not passing = not done. (Anthropic, Mitchell, OpenAI, Thoughtworks)
4. **Single-feature cadence**: one feature → verify → commit → update progress; the fundamental heartbeat that keeps long tasks from collapsing. (Anthropic, OpenAI short-lived PRs)
5. **Struggle = environment defect**: the right response to repeated agent failure is adding tools/guardrails/docs, not rewording and retrying. (OpenAI, Mitchell, Thoughtworks)
6. **Constrain boundaries, free implementations**: layering + dependency direction + taste invariants enforced mechanically; details belong to the agent. (OpenAI, Thoughtworks, Anthropic)
7. **Agents govern entropy**: doc gardening, GC, quality scoring — all agentified, periodic, small-step. (OpenAI, Thoughtworks)
8. **Simplify the harness as models improve**: audit the harness regularly and delete scaffolding for "things the model now does"; harness management is liability management — less is more. (Anthropic, LangChain)

---

## 4. The Standard Universal Environment Blueprint

### 4.1 Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│ HUMAN (steering): priorities, acceptance criteria,       │
│                   report reviews, critical-PR approval   │
├─────────────────────────────────────────────────────────┤
│ ORCHESTRATION: planner / coder / evaluator, sub-agents,  │
│                model routing, Ralph loop, wake/resume    │
├─────────────────────────────────────────────────────────┤
│ KNOWLEDGE: AGENTS.md (map) + docs/ (system of record),   │
│            feature list / execution plans / progress /   │
│            decision logs                                 │
├─────────────────────────────────────────────────────────┤
│ VERIFICATION: e2e browser tests / unit + filtered runner │
│               / custom linters / structural tests /      │
│               hook-driven self-verification / rubrics    │
├─────────────────────────────────────────────────────────┤
│ ENVIRONMENT: sandbox (container/worktree) + runtimes +   │
│              git + bash + browser automation (CDP/MCP)   │
│              + ephemeral observability stack             │
├─────────────────────────────────────────────────────────┤
│ SECURITY: vault credentials + authenticated proxy /      │
│           no tokens in sandbox / audited event streams   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Standard Repo Scaffold (template)

```
repo/
├── AGENTS.md                  # ≤100 lines: the map & table of contents, not an encyclopedia
├── init.sh                    # one-command init: deps, server, seed data, smoke test
├── scripts/                   # all verification actions scripted (the agent's "hands")
│   ├── test.sh                # test runner (supports filter args)
│   ├── verify-feature.sh      # per-feature e2e verification
│   ├── screenshot.sh          # UI screenshots
│   ├── smoke.sh               # smoke: server boots, front page reachable
│   └── check-docs.sh          # knowledge-base freshness / cross-link validation
├── docs/
│   ├── architecture.md        # layering + dependency direction rules
│   ├── quality.md             # quality scores and gaps by domain/layer
│   ├── decisions/             # decision log (ADRs)
│   └── plans/                 # execution plans (active/ done/ debt.md)
├── tasks/
│   ├── feature-list.json      # feature checklist: all initially false/failed
│   └── progress.md            # progress file: done / in-progress / blocked / next
├── .claude/ (or equivalent)   # skills, hooks (auto lint/test after commits)
├── src/…                      # fixed layering: types→config→repo→service→runtime→ui
└── tests/…                    # unit + structural + e2e
```

**Per-file responsibilities:**

- **AGENTS.md**: only "what other docs exist, where to find them, repo iron laws (≤10)". Lessons land in the matching `docs/` file; AGENTS.md gains one pointer line — preventing it from bloating into an unmaintained tome.
- **feature-list.json**: the "work contract" for long tasks. Each item: id, name, acceptance criteria (an executable command), status. **All false at initialization** — leveraging the model's goal-drive to "turn red items green".
- **progress.md**: fixed structure: `what the last session did / current blockers / next steps / known pitfalls`. Must be updated after every feature.
- **plans/**: lightweight plans for small tasks; execution plans (goals, milestones, progress log, decision log) for large ones — all versioned.

### 4.3 Long-Task Operating Protocol (SOP)

**Phase 0 · Initialization (Initializer Agent / once)**
1. Run `init.sh` to scaffold (CI, formatting, package management, framework, even AGENTS.md can be agent-generated);
2. With the human, write requirements into feature-list.json (**acceptance criteria must be executable commands**);
3. Start the dev server, pass one e2e smoke test, proving "the world is intact";
4. First commit. Then exit.

**Phase 1 · Per-session warm-up ritual (2–3 minutes)**
```
pwd → git log --oneline -20 → read progress.md → read feature-list.json
→ run smoke.sh to confirm health → grep -r "TASK: " for historical corner-cutting → work
```
Goal: rebuild the worldview from facts, not hallucination.

**Phase 2 · Single-feature loop (main loop)**
```
pick 1 unfinished feature (by priority, never parallel)
→ clarify: ask first if ambiguous (or log to "Blocked" in progress.md)
→ implement → verify-feature.sh passes (e2e, not just unit tests)
→ check feature-list + update progress.md
→ commit (descriptive message: what and why)
```

**Phase 3 · Recovery & escalation**
- Context full / crashed → new session repeats the warm-up ritual, resumes from the progress file;
- Stuck → record the blocker in progress.md → skip the feature or escalate to a human — **never grind**;
- Model/version change → re-audit the harness, delete scaffolding for "things the model now does".

### 4.4 Quality Assurance System

1. **Objective dimension — sensors (mechanical)**
   - Commit/push hooks auto-run lint + unit tests (the self-verification loop lives in hooks/middleware);
   - Custom linters enforce layering, dependency direction, naming, logging conventions — **error text embeds fix instructions**;
   - Structural tests guard layer boundaries; test runners accept filters (relevant test names only — avoid unrelated failures).
2. **Subjective dimension — evaluators (inferential)**
   - An Evaluator Agent scores artifacts against a written rubric (e.g., design quality / originality / craftsmanship / functionality) and outputs improvement suggestions as the Generator's next input;
   - Rubrics are human-defined initially and tuned against false positives ("the error the evaluator flagged doesn't actually exist");
   - For UI acceptance: browser automation screenshots + DOM snapshots make "beautiful" visible and comparable.
3. **Review network**
   - Short-lived PRs; agent self-review + agent-to-agent review; humans review only high-risk/critical decisions; flaky = rerun, never "humans wait".
4. **Knowledge-base governance**
   - CI validates docs structure and cross-links; a doc-gardening agent periodically scans "docs vs code" drift and opens fix PRs.

### 4.5 Environment & Tooling Standard (the agent's "body")

- **One bootable app instance per git worktree** + **an ephemeral observability stack** (LogQL for logs, PromQL for metrics, destroyed with the task);
- Browser automation (CDP or MCP) + screenshot scripts so agents can reproduce bugs and verify fixes;
- Sandboxes ship with full default tooling: runtimes, git, test frameworks, bash, common shims (jq/curl) — **missing tooling is the #1 cause of slow progress**;
- Credentials via vault + authenticated proxy, invisible to the sandbox; outbound ops (git push etc.) proxied by the platform layer.

### 4.6 Entropy Governance (GC loop)

- Write "golden principles" into docs (e.g., prefer the shared toolkit; no YOLO-style data probing — always validate at boundaries);
- A background GC agent runs periodically: scan bad-pattern drift → update quality scores in quality.md → open small-step refactor PRs (most auto-mergeable);
- The only destination for human taste feedback: **docs or tooling**. If docs aren't enough, escalate to a lint — "capture once, enforce everywhere".

---

## 5. Human–Machine Division (How Vibe Coding Works)

| Human (steering) | Agent (rowing) |
|---|---|
| Set priorities, acceptance criteria, scoring rubrics | Plan details, implement, test, fix |
| Translate user feedback into acceptance criteria | Self-review, cross-review, respond to reviews, open/merge PRs |
| Review critical judgment points (escalate only when judgment is needed) | Doc gardening, GC, quality scoring |
| After every agent mistake → feed the harness (docs/tools/lint) | Reproduce, verify, record videos — everything mechanizable |

**Working rhythm** (Mitchell's stage model, team edition):
- **Separate planning from execution sessions**: plan first, human approves, then an execution session follows it;
- Delegate "slam dunks" during the day, **notifications off, do your own work**; hang "fuzzy exploration" tasks overnight, collect **reports** in the morning;
- **Always have an agent running**;
- Once throughput rises, simplify merge gates: **fixes are cheap; waiting is expensive** — but only in repos with sound verification loops.

---

## 6. Evolution: The Harness Is a Depreciating Asset

- Every harness rule/tool/scaffold = one assumption of "the model currently can't do X";
- After each model upgrade, run a **subtraction audit**: which scaffolding can go? (Anthropic's example: from three-agent sprints to a single agent straight through; OpenAI's example: from human Friday slop-cleaning to GC agents to fully autonomous loops)
- The reverse holds too: **discover a new failure mode → immediately materialize it as a tool/doc/lint**. One subtraction, one addition — the harness stays minimal and sufficient.

---

## 7. Antipattern Checklist (Aggregated Pitfalls)

1. ❌ Giant AGENTS.md encyclopedia → bloat, rot, unverifiable. ✅ Map + layered docs.
2. ❌ Multiple features in parallel → piles of half-broken features. ✅ Single-feature cadence.
3. ❌ Marking done after unit tests only → "looks right, doesn't run". ✅ e2e or it isn't done.
4. ❌ Endless compaction to stretch a session → an old employee with fuzzy memory. ✅ Periodic resets + handover docs.
5. ❌ Rewording and retrying after failures → burning tokens. ✅ Ask "what tool/guardrail/doc is missing" and feed it back.
6. ❌ Micromanaging implementations (prescribed libraries/styles) → erases model advantages. ✅ Enforce invariants and boundaries only.
7. ❌ Human Friday slop-cleaning (20% capacity) → unsustainable. ✅ Golden principles + GC agents.
8. ❌ Knowledge scattered in Slack/people's heads → invisible to agents. ✅ Everything lands in the repo.
9. ❌ Credentials in sandbox env vars → leak surface. ✅ Vault + proxy.
10. ❌ Progress only in context → crash = amnesia. ✅ Files + git.
11. ❌ Human review pipelines gating agent throughput → humans become the bottleneck. ✅ Agent-to-agent review + sampled human review.
12. ❌ One-time harness, never reclaimed → stale scaffolding fights the upgraded model. ✅ Regular subtraction audits.

---

## 8. From-Zero Adoption Checklist

**Day 1 (half a day):**
- [ ] Empty git repo + `init.sh` (framework, packaging, formatting, CI skeleton)
- [ ] ≤100-line AGENTS.md (map only)
- [ ] `docs/architecture.md` (layering + dependency direction)
- [ ] `scripts/smoke.sh` + `scripts/test.sh` (with filters)
- [ ] Browser automation wired + `scripts/screenshot.sh`
- [ ] First commit

**Week 1:**
- [ ] Requirements → feature-list.json (acceptance = executable commands, all initially false)
- [ ] progress.md established and in the SOP
- [ ] Hooks: lint + test on commit/PR; custom linters with fix instructions in error text
- [ ] Worktree-bootable app + ephemeral log/metrics stack
- [ ] Credentials in vault + proxy (no tokens in the sandbox)

**Month 1:**
- [ ] Written Evaluator rubric, tuned against false positives
- [ ] docs/quality.md scoring + CI validation of knowledge-base freshness
- [ ] Doc-gardening / GC agents on a schedule
- [ ] Warm-up ritual codified in AGENTS.md; planning/execution session split becomes habit
- [ ] First harness subtraction audit

---

## Appendix A · Templates (migrated)

The canonical copyable templates live in [`docs/templates/`](../templates/) (Chinese):

| Template | Purpose |
|---|---|
| [AGENTS.md](../templates/AGENTS.md) | Repo knowledge-base entry skeleton (≤100-line map) |
| [feature-list.json](../templates/feature-list.json) | Task board: feature checklist, acceptance = executable commands |
| [progress.md](../templates/progress.md) | Progress file: last session / blockers / next / pitfalls |
| [main-loop-prompt.md](../templates/main-loop-prompt.md) | Single-feature main-loop prompt |

---

## References

1. Anthropic — [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
2. Anthropic — [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
3. Mitchell Hashimoto — [My AI adoption journey](https://mitchellh.com/writing/my-ai-adoption-journey)
4. Martin Fowler / Thoughtworks — [Harness engineering – first thoughts](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html)
5. LangChain — [The Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness)
6. Anthropic — [Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)
7. OpenAI — [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) (supplementary research)
