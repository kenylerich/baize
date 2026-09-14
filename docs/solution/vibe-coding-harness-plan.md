# Vibe Coding Development Environment: Complete Implementation Guide

> status: Active — authoritative English version. Chinese translation: [vibe-coding-harness-plan.zh.md](./vibe-coding-harness-plan.zh.md).
>
> **Positioning**: this is the "complete implementation guide" (the practical volume), written for **readers with zero background** — first it organizes your thinking from zero, then delivers an executable setup plan covering **embedded development and all software domains**.
> **Design rationale and sources**: see the Research Summary [harness-best-practices.md](../research/harness-best-practices.md).
> **Suggested reading**: read Part 1 end-to-end (~30 min to build the mental model) → study Part 2 (the plan's core) → jump straight to your domain in Part 3 → execute via the roadmap in Part 4.

---

# Part 1 · Organizing Your Thinking: Understanding Vibe Coding and Harnesses from Zero

## 1.1 Where AI-assisted development stands today

| Stage | Form | Human role | Suited for |
|---|---|---|---|
| ① Completion era | Copilot-style autocomplete | You write code; AI completes a few words | Everything — AI is just a typing accelerator |
| ② Chat era | ChatGPT/Cursor chat window | Ask, copy-paste code | Point problems, small functions, code explanation |
| ③ **Autonomous Agent era** | Claude Code / Codex CLI / agentic mode | **Give instructions, set acceptance, review results** | **Whole features, bug fixes, cross-file refactors, batch tasks** |
| ④ Orchestration era | Multi-agent collaboration, managed platforms | Set direction and priorities only | Weeks-long tasks, large-scale parallel development |

**Vibe Coding means stages ③④**: you stop reading code line by line — you describe intent in natural language → the agent implements autonomously → quality is guaranteed by **automated verification**. The human's output changes from "code" to "**intent + acceptance criteria + environment design**".

## 1.2 Why "just let the AI build the big project" fails

Throwing an agentic tool straight into a large project almost inevitably produces four problems (validated by every source):

| Obstacle | Symptom (you will see this) | Root cause |
|---|---|---|
| **Amnesia** | Session breaks / context fills → the AI forgets what it did, repeats work or tears things down | The context window is finite; a long task's required state exceeds it |
| **No evidence** | The AI claims "done and tested"; it doesn't actually run | It has no tools or discipline to verify hands-on — it "finished" in imagination |
| **Getting lost** | Drifts off-topic, cuts corners, leaves half-done work | Tasks aren't explicitly decomposed into checkable lists; the AI improvises under fuzzy goals |
| **Entropy** | Copies bad patterns; docs and code contradict each other; rot compounds | No mechanical constraints, no periodic cleanup |

## 1.3 The core solution: a Harness (build the agent a workbench)

**Mental model: the model is a brilliant freelance engineer; the harness is the workbench you prepare for it.**

The freelancer is very capable but "new": every shift (new session) it knows nothing about your company, has limited memory, and cannot see the real world. You provide:

1. **The onboarding pack** (knowledge base): the rules, the layering, where docs live — but a map, not a 1000-page manual;
2. **The task board** (task list + progress file): what to do, what's done, what's blocked — all written down, never trusted to memory;
3. **Acceptance tooling** (verification loop): one command that judges "is it right"; no pass, no checkmark;
4. **Safety fences** (permissions & isolation): it works in its own sandbox, never touches production secrets, and anything broken can be rolled back in one step;
5. **The handover system** (session ritual): every shift starts with 3 minutes reading "where we left off".

With these five in place, the same model performs **orders of magnitude** better — that is "harness engineering", and it is everything this guide helps you build.

> One line: **the model sets the ceiling of AI-written code quality; the harness sets the floor. Whether long tasks succeed depends almost entirely on the harness.**

## 1.4 Glossary (plain-language edition)

| Term | Meaning | Analogy |
|---|---|---|
| Context | Everything the model can "see" in one working session | An engineer's desk — only so big |
| Token | The unit of text the model counts | Square meters of desk |
| Context rot | The fuller and messier the desk, the worse the work | Desk buried in clutter |
| AGENTS.md | The repo's agent-facing readme (de-facto standard) | Page one of the onboarding map |
| MCP | The standard protocol connecting models to external tools (browser, DB…) | The engineer's "power socket" standard |
| Hook | Auto-triggered checks after each save/commit | An editor that compiles on save |
| Sandbox | Isolated execution environment (container/VM), disposable | Disposable gloves / an isolation booth |
| Worktree | Multiple checkouts of one repo, independent | One desk per task |
| E2E test | Verifies the whole chain from the real entry point (browser/serial) | Acceptance staff actually using the product |
| Generator–evaluator | One agent works; another scores against a standard | Author and reviewer |
| Compaction | Compressing a long conversation into a summary | Memory-reduction surgery |
| Ralph loop | Agent self-drives "work → check → fix → repeat" until done | A self-iterating alarm clock |
| GC agent | A scheduled agent that finds bad patterns / doc rot and fixes them | The weekly cleaner |
| HIL (hardware-in-the-loop) | Real hardware boards wired into automated verification | A car's end-of-line test rig |

---

# Part 2 · The Overall Plan: One Skeleton + Domain Adapters

## 2.1 Core design idea

**Problem**: development domains are wildly different (backend, frontend, desktop, mobile, games, embedded…); build/run/verify differ completely — how can one plan support all of them?

**Answer** (the core formula of this plan):

```
Full Harness = Universal core (80%, identical for every domain)
             + Domain adapter (20%, each domain answers 5 fixed questions)
```

- The universal core solves amnesia, getting lost, entropy — domain-independent; build once, reuse everywhere;
- The domain adapter solves "no evidence" (how to judge "right" automatically) — each domain fills one fixed **adapter card**.

## 2.2 The universal core: five subsystems and the standard repo scaffold

Standard repo structure (universal; extend, never restructure):

```
repo/
├── AGENTS.md               # ① Knowledge-base entry: ≤100-line map, points downward
├── docs/
│   ├── architecture.md     # layering rules + dependency direction (iron laws)
│   ├── quality.md          # quality scores and known gaps
│   ├── decisions/          # decision log (why it was designed this way)
│   └── plans/              # execution plans (active/ in progress, done/ archived)
├── tasks/
│   ├── feature-list.json   # ② Task board: feature list, acceptance = executable command
│   └── progress.md         # ② Progress file: last session / blockers / next
├── scripts/                # ③④ Adapter landing spot: four standard scripts + tools
│   ├── build.sh            #   one-command build
│   ├── run.sh              #   one-command run (headless when possible)
│   ├── verify.sh           #   one-command verify (0/non-zero exit = machine-judgeable)
│   ├── observe.sh          #   one-command observe (logs/screenshots/serial…)
│   ├── smoke.sh            #   smoke: service/device healthy
│   └── screenshot.sh etc   #   domain-specific tools
├── .claude/ or equivalent  # ⑤ skills, hooks (auto lint/test after commits)
├── src/ …                  # layered per convention
└── tests/ …                # unit + structural + e2e
```

The five subsystems and the problems they solve:

| Subsystem | Composition | Solves |
|---|---|---|
| ① Knowledge base | AGENTS.md (map) + docs/ (body) + CI freshness checks | Getting lost (agent ignores the rules) |
| ② Tasks & progress | feature-list.json + progress.md + commit discipline | Amnesia, getting lost |
| ③ Verification loop | four standard scripts + hook auto-trigger + scoring rubrics | No evidence (unverifiable quality) |
| ④ Environment & tools | sandbox/containers, the toolchains behind the four scripts, browser/emulators | No evidence (agent can't act) |
| ⑤ Security fences | vault + proxy, branch protection, human merge gates | Security & irreversible risk |

## 2.3 The domain adapter: five questions per domain

Onboarding any new domain = filling one **adapter card**. The five questions are fixed:

| # | Question | Landing spot | Quality bar |
|---|---|---|---|
| Q1 | **How to build?** (build) | `scripts/build.sh` | One command, zero interaction, readable errors (error = fix instruction) |
| Q2 | **How to run?** (run) | `scripts/run.sh` | Headless/automated start; dependencies come up too |
| Q3 | **How to judge "right" automatically?** (verify) | `scripts/verify.sh` | **Most important.** Machine-judgeable 0/non-zero; "looks right" is not right |
| Q4 | **How to see it?** (observe) | `scripts/observe.sh` | The agent's eyes and ears: logs, screenshots, serial, waveforms |
| Q5 | **How to isolate & restore?** (sandbox) | containers/VMs/emulator snapshots/device locks | Independent environment per task; disposable, rebuilt in seconds |

> **This card is the secret of "supporting all domains"**: the universal core is written once; a new domain costs an engineer 1–3 days to fill the card, write the scripts, tune the sensors. Appendix A has the blank template.

## 2.4 Verification-difficulty tiers: they decide the onboarding order

All development domains fall into four tiers by "how hard automated verification is" (**which is also the onboarding order** — each tier's experience feeds the next):

| Tier | Trait | Domains | Verification core |
|---|---|---|---|
| **T1 Pure logic** | No UI, no hardware; judged directly on host | backend/services, CLI/scripts, data engineering, databases, algorithms/scientific, IaC/DevOps, AI·ML·LLM apps, tech docs | test suites + assertions + contract checks |
| **T2 With UI** | The agent must "see" an interface | web frontend, desktop, mobile, browser extensions, games | emulators/headless rendering + screenshots + widget-tree assertions |
| **T3 Heavy runtime** | Depends on low-level system behavior | OS/kernel modules, compilers/DSLs, database engines, network stacks | VM/QEMU + sanitizers + fuzzing |
| **T4 With hardware** | Involves the physical world | embedded (MCU/RTOS/embedded Linux/drivers), FPGA/RTL, integrated IoT devices | **three-tier pyramid**: host unit tests → board simulation → hardware-in-the-loop |

## 2.5 The long-task operating SOP (human–machine workflow, universal across domains)

```
Phase 0 Initialization (once)
  init.sh scaffolds → with the human, write requirements into feature-list.json
  (acceptance = executable commands) → pass one smoke test → first commit

Phase 1 Per-session warm-up ritual (3 minutes)
  pwd → git log -20 → read progress.md → read feature-list.json
  → run smoke.sh to confirm environment health → start working

Phase 2 Single-feature main loop (the core cadence)
  pick 1 feature (never parallel) → clarify ambiguities first → implement
  → verify.sh passes = done → tick the list + update progress.md → descriptive commit

Phase 3 Recovery & escalation
  context full / crash → new session repeats the warm-up ritual, resumes
  stuck 30 minutes → write the blocker into progress.md → skip or escalate; never grind

The human's role
  set priorities, set acceptance criteria, gate irreversible actions (release/real hardware/apply)
  after every agent mistake → feed the lesson back into docs/tools/lint (not verbal correction)
```

---

# Part 3 · The All-Domain Adapter Handbook

## 3.0 Adapter matrix (quick reference)

| Domain | Tier | Build | Run | Auto verification (sensors) | Observe | Isolation |
|---|---|---|---|---|---|---|
| Backend/services | T1 | standard build | local/compose services | unit + contract + integration tests | structured logs + metrics | container + ephemeral deps |
| CLI/scripts | T1 | compile or direct | command line | golden files + property tests | stdout | container |
| Data engineering / DB | T1 | — | small-sample pipeline run | row/checksum reconciliation + migration tests | data-quality report | ephemeral DB containers |
| Algorithms / scientific | T1 | compile | function calls | numeric assertions + property + perf budgets | benchmark reports | container |
| IaC / DevOps | T1 | fmt/validate | plan / kind cluster | policy checks + deploy smoke | plan diff | isolated account / local cluster |
| AI/ML/LLM apps | T1 | — | small-sample training/inference | eval-set thresholds + evals | metrics / token cost | container (GPU optional) |
| Tech docs | T1 | — | — | link/consistency lint | — | — |
| Web frontend | T2 | dev server/build | headless browser | Playwright e2e + visual regression | screenshots + DOM + console | headless browser container |
| Desktop | T2 | build + package | Xvfb / real window | widget-tree assertions + screenshot diff | screenshots + app logs | Xvfb / VM |
| Mobile | T2 | gradle/xcodebuild | emulators | Espresso/XCUITest/Maestro | screenshots + logcat | emulator (KVM/macOS) |
| Browser extension | T2 | package | extension-loaded browser | Playwright extension tests | screenshots + background-page console | headless browser |
| Games | T2 | engine build | headless / real run | PlayMode tests + input replay + perf budgets | framerate + screenshots + watchdog | headless render container |
| Systems / kernel / protocols | T3 | local/cross compile | VM/QEMU | sanitizers + fuzzing + conformance | strace/gdb/serial | VM/QEMU |
| Database engine | T3 | compile | instance | SQL logic tests + crash-recovery tests | perf counters | container/VM |
| Embedded MCU | T4 | cross compile | emulator/real board | **three-tier pyramid** (see 3.4) | serial/RTT/waveforms | toolchain container + emulator + device lock |
| Embedded Linux | T4 | Yocto/Buildroot | QEMU/dev board | unit + boot/driver tests + HIL | serial console | container + QEMU + real board |
| FPGA/RTL | T4 | synthesis (Verilator/Yosys) | simulation | sim assertions + lint + formal + on-board | VCD waveforms | container + simulator + board |

## 3.1 T1 Pure-logic (easiest — onboard these first)

### 3.1.1 Backend / services (APIs, microservices, batch jobs, middleware)

- **Build**: standard tooling (Maven/Gradle, go build, pip/uv, cargo).
- **Run**: `docker compose up` brings up app + DB + queue together; or testcontainers for ephemeral real dependencies per PR.
- **Verify (sensors)**:
  - Contract-first: OpenAPI/protobuf schema validation; consumer-driven contract tests prevent frontend/backend drift;
  - Three test layers: unit → integration (real DB/queue) → e2e (boot the service, assert via curl/HTTP client);
  - Perf budgets: P99 latency thresholds for key endpoints, inside verify.
- **Observe**: mandatory structured logs (agents grep them with extreme precision); `/metrics` endpoint; full stack traces.
- **Isolate**: independent compose project name + ephemeral volumes per task; a port-allocation table avoids conflicts.
- **Pitfall**: ephemeral port/volume collisions are the most common "mystical failure" — manage ports and cleanup centrally in run.sh.

### 3.1.2 CLI tools & scripts

- **Verify**: golden-file tests (fixed input, assert output snapshot); property-based tests (Hypothesis / fast-check / fscheck) generate cases; shellcheck/shellfmt on hooks.
- **Observe**: stdout is everything; complex CLIs should offer `--json` output mode for agent judgment.

### 3.1.3 Data engineering / databases

- **Verify**: per-PR ephemeral databases running migration **up/down idempotency tests**; pipelines use "input snapshot → golden output diff"; reconciliation sensors (row counts / checksums / sampled assertions); schema-diff review; large-table queries via explain + row thresholds.
- **Observe**: data-quality reports (null rates, distribution drift) as part of verify.

### 3.1.4 Algorithms / scientific computing

- **Verify**: numeric assertions (against reference implementations / analytic solutions, with explicit float tolerance); property tests; perf budgets (criterion/pytest-benchmark — failing the budget fails verify).
- **Pitfall**: require the agent to **fix random seeds** inside verify, or results are irreproducible.

### 3.1.5 DevOps / IaC / cloud infrastructure

- **Verify**: `terraform fmt/validate/plan` (parse plan JSON; assert adds/changes/deletes match expectations); OPA/conftest policy checks (no 0.0.0.0/0, mandatory tags…); K8s via kind/k3d local cluster + helm lint/template + kubeconform + deploy smoke probes.
- **⚠️ Security red line**: `apply`, `kubectl apply --context=prod`, resource deletion are **outward, irreversible actions** — always human-approved; write this into AGENTS.md iron laws; never rely on model self-restraint.

### 3.1.6 AI / ML / LLM applications

- **Verify** (the ML world's verify.sh — same shape as this whole guide):
  - Training: small-dataset overfit smoke (loss should → 0); fixed seeds for reproducibility; eval sets + metric thresholds (a drop fails verify);
  - LLM apps: golden Q&A sets + scorers (promptfoo/deepeval/homegrown evals); trajectory evals (are the agent's steps right); cost/latency budgets.
- **Observe**: token usage, latency, failure rate as metrics.
- **Isolate**: API keys via proxy (see 2.2⑤); no plaintext keys in the sandbox.

### 3.1.7 Technical documentation

The easiest pilot domain: link checking, terminology-consistency lint, and runnable-example tests ARE the verify.sh. Ideal as the team's first "results within a week" practice project.

## 3.2 T2 With UI (core: give the agent eyes)

**Universal principles**:
1. **DOM/widget trees over pixel screenshots** (cheaper tokens, precise assertions); screenshots for "looks good / layout" judgments and visual regression;
2. **State injection**: expose test hooks (deep links, launch args, seeded data) so the agent lands in the target state without blind 20-step navigation;
3. **Console errors = failure**: any console error fails verify directly;
4. Visual regression: golden screenshots + tolerance diff; UI changes update the baseline explicitly.

### 3.2.1 Web frontend

- Run: dev server; verify: three Playwright layers (component → page → critical journeys); headless browsers in containers.
- Observe: DOM snapshots, per-page screenshots, console/network errors.

### 3.2.2 Desktop apps

| Stack | Verification |
|---|---|
| Electron | Playwright `_electron.launch` (DOM assertions + screenshots; most mature) |
| Tauri | tauri-driver (WebDriver protocol) |
| Qt (Widgets/QML) | Qt Test / QML Test unit tests; GUI-level via Squish (commercial) or AT-SPI on Linux (pyatspi/dogtail); screenshot diff |
| WPF/WinForms (Windows) | FlaUI / WinAppDriver (needs a Windows runner) |
| GTK (Linux) | AT-SPI accessibility tree |
| Cross-platform (Flutter desktop etc.) | flutter integration_test + screenshots |

- **Run**: Xvfb virtual displays give "headless GUI" on Linux; Windows via a dedicated VM.
- **Packaging verification**: the last verify step installs the produced installer (MSI/deb/AppImage) into a clean environment and smoke-boots it — "installs, launches" is also acceptance.

### 3.2.3 Mobile apps

- **Android**: Gradle Managed Devices / Emulator (CI machines need KVM acceleration); Espresso (code-level UI) + **Maestro** (YAML flows, agent-friendly); observe: `adb exec-out screencap` + logcat.
- **iOS**: macOS runners mandatory; xcodebuild test + XCUITest; simulator screenshots.
- **Cross-platform**: Flutter integration_test; RN via Detox/Maestro.
- **Pitfall**: emulator cold starts are slow — snapshot/preheat, and fix "start the emulator" inside run.sh.

### 3.2.4 Browser extensions

- Playwright persistent context with `--load-extension`; verify popup / options page / content scripts separately; MV3 service-worker console logs go into assertions.

### 3.2.5 Game development

- **Frameworks**: Unity Test Framework (EditMode = logic, PlayMode = integration), Godot: GUT + `--headless`, Unreal: Automation Framework.
- **Sensor combo**:
  - **Input replay**: record a fixed input sequence, replay it, assert character state / level events / no crash — the game world's e2e;
  - golden screenshots (with tolerance) catch render regressions;
  - **perf budgets**: framerate / frame time / load duration over threshold fails;
  - watchdog: detect freezes/black screens.
- **Subjective dimension**: "is it fun" goes to generator–evaluator scoring + sampled human playtesting — don't try to fully automate taste.

## 3.3 T3 Heavy runtime

- **Systems software / kernel modules / drivers**: sanitizer family (ASan/TSan/UBSan) + valgrind in CI; fuzzing (AFL++/libFuzzer, OSS-Fuzz integration); kernel modules smoke-boot in QEMU + initramfs (9p/virtfs shares source without repackaging); observe: serial console + gdb remote.
- **Compilers/DSLs**: differential testing (against a reference implementation), corpus regression, self-hosting tests; fuzz mutated sources.
- **Database engines**: SQL logic suites + crash-recovery tests (kill -9 then restart, assert consistency) + perf-counter budgets.
- **Network stacks**: scapy/packetdrill conformance; captured-packet golden diffs; chaos injection (loss/reorder/delay) as an optional verify tier.

## 3.4 T4 Hardware (focus: embedded) ⭐

### 3.4.1 The embedded harness in one idea: the three-tier verification pyramid

The hard part of embedded: **not every line of code can (or should) be verified on real hardware**. The answer is layering:

```
        ┌──────────────────────┐
        │ L3 Hardware-in-the-loop │ real board + real peripherals: flash, power-cycle, serial asserts
        │ few critical paths, expensive & slow      │ (release gate)
        ├──────────────────────┤
        │ L2 Board simulation       │ QEMU / Renode / Wokwi: firmware actually runs
        │ most integration logic, fast & stable    │ on a simulated board; serial output assertable
        ├──────────────────────┤
        │ L1 Host unit tests        │ business logic decoupled from hardware, runs in seconds on a PC
        │ run on every change (the agent's main battlefield) │ (Ceedling/Unity, GoogleTest+FFF)
        └──────────────────────┘
```

**L1's precondition is one architecture iron law: decouple business logic from hardware access.** HAL interfaces + mocks/fakes isolate registers and peripherals so ~80% of logic (state machines, protocol parsing, control algorithms) is testable on a PC. Write this into `docs/architecture.md` and enforce it with a check script (e.g., business modules must not include chip register headers directly).

### 3.4.2 Per-tier landing points

**L1 Host unit tests (the agent's main battlefield)**
- Tools: Ceedling/Unity/CMock (the C standard), GoogleTest + FFF (fake function framework), CppUTest.
- build.sh = "compile on PC + run unit tests", second-level feedback, run automatically on every change.

**L2 Board simulation**
- **QEMU** (qemu-system-arm etc.): official board models; firmware really runs; good for boot flow, driver frameworks, RTOS ports.
- **Renode**: built for IoT; simulates multi-board networks + sensor/peripheral models; Robot Framework integration — the first choice for multi-node IoT.
- **Wokwi**: official CLI for ESP32/RPi Pico etc., CI-friendly.
- **pytest-embedded** (ESP-IDF official): a unified "build → flash → serial assert" test framework pattern other platforms can copy.
- Assertion means: serial-output regex ("BOOT OK"), simulator state queries, firmware memory/symbol analysis.

**L3 Hardware-in-the-loop (HIL)**
- Flashing: OpenOCD / pyOCD / J-Link scripted;
- **power-cycle via USB relay** (solves "the board is wedged, someone must unplug it" — the ops black hole);
- Observe: serial log capture & assertions, SEGGER RTT, and when needed logic-analyzer/scope captures attached as artifacts;
- **Device locks**: real boards are shared resources; lock per task so two agents never flash one board;
- Multi-board farm, advanced: USB hubs + relay arrays + labeled device management.

**Static sensors (embedded-specific, very high weight)**
- MISRA-C / CERT-C rule sets, cppcheck, clang-tidy; `-Werror` builds;
- **firmware size budgets** (size over limit fails) and static stack-depth analysis — embedded resources are hard constraints; make them sensors.

### 3.4.3 Special requirements for the embedded knowledge base (a stand-in for the chip manual)

The agent can't read chips or run experiments — **docs must do both for it**:
- `docs/hardware/` holds: Datasheet/Reference-manual **digests** (register tables, timing constraints), board hardware-version delta matrix, pin-assignment tables, Flash/memory layout maps;
- **Iron law**: register-level code must cite its docs source; "plausible guesses" without a source are rejected by verify (embedded's easiest crash — the agent confidently invents register behavior).

### 3.4.4 Embedded sub-scenarios

| Scenario | Build | L2 simulation | L3 real hardware | Special sensors |
|---|---|---|---|---|
| MCU bare-metal/RTOS (STM32/ESP32/Zephyr/FreeRTOS) | arm-none-eabi-gcc / idf.py / west build | QEMU, Renode, Wokwi | OpenOCD/J-Link + relay reset | firmware size, stack depth, power sampling |
| Embedded Linux (Yocto/Buildroot) | bitbake (big-disk container) | QEMU booting the rootfs | dev board + serial console | boot-time budget, rootfs diff |
| Kernel / drivers | cross compile | QEMU + initramfs smoke | target machine | crash-log (oops/panic) detection |
| FPGA/RTL (Verilog/VHDL) | Verilator/Yosys synthesis | waveform assertions + lint + formal | bitstream load onto board | waveform (VCD) golden diff |
| Integrated IoT (device↔cloud) | firmware + cloud ends | Renode multi-node + local cloud stack | real device + production canary | end-to-end message reconciliation |

> The outer ring — circuit/PCB design (KiCad etc.) — fits the same framework: `kicad-cli` ERC/DRC checks are a ready verify.sh, but it is a low-priority extension.

---

# Part 4 · Phased Adoption Roadmap

> Principle: **pilot on T1, expand domain by domain; each tier's experience feeds the next.** Do not start with embedded or everything-at-once.

## Phase 0 · Alignment & first pilot (weeks 1–2)

- Pick 1 **T1 project** (ideal: an internal tool/CLI/small service, or a docs repo for practice);
- 1 "harness engineer" (part-time OK) + 1 domain engineer;
- Acceptance criteria:
  - [ ] repo has all of 2.2 (AGENTS.md, tasks/, the four scripts);
  - [ ] the "single-feature main loop" runs at least 10 times;
  - [ ] 5+ "agent struggle points" logged, each fed back once (doc/script).

## Phase 1 · Templatize the universal core (weeks 3–6)

- Extract the Phase 0 repo into a **repo-template** (AGENTS.md skeleton, four-script framework, hook config, CI);
- Add a second domain (suggest web frontend — lowest T2 barrier) to validate "universal core + adapter card";
- Establish the weekly 30-minute **harness meeting**: this week's struggle points → feed back;
- Acceptance criteria:
  - [ ] new project: template → first main loop in under half a day;
  - [ ] frontend adapter card complete (Playwright + screenshots + console listener).

## Phase 2 · Build domain adapters per business line (months 2–3)

Build in business-priority order; each line names 1 Agent Coach (owns that domain's card and knowledge base):

- [ ] Backend/services (compose stack + contract tests);
- [ ] Desktop (per-stack choices in 3.2.2);
- [ ] **Embedded L1+L2** (host unit tests + QEMU/Renode first; HIL deferred to Phase 3);
- [ ] Mobile (Android first; iOS as macOS-runner capacity allows).

## Phase 3 · Platformization & governance (months 4–6)

- [ ] Quality scoring (docs/quality.md): an Evaluator Agent scores artifacts against written rubrics;
- [ ] **scheduled GC agents**: scan doc rot, bad patterns, architecture violations; open small-step fix PRs;
- [ ] embedded L3 device farm (relay reset + device locks);
- [ ] **harness subtraction audit**: after model upgrades, delete outdated scaffolding;
- [ ] quality dashboard: verify pass rates, score trends, slop indicators.

## Phase 4 · Scale (ongoing)

- [ ] managed-agent abstraction (brain/hands/session decoupling; wake/getSession to resume any session);
- [ ] agent-to-agent review + sampled human review; tiered automated merge gates;
- [ ] multi-agent orchestration: plan–generate–evaluate pipelines running weeks-long tasks.

---

# Part 5 · Environment Base: Image Matrix & Runner Requirements

| Image / runner | Serves | Contents | Special hardware |
|---|---|---|---|
| base-agent | universal | git, bash, jq, python/uv, node, text tools | none |
| web | frontend/extensions | node LTS + Playwright + headless Chromium | none |
| backend | services | JVM/Go/Python + Docker + ephemeral PG/Redis | none (or DinD) |
| desktop-linux | desktop | Qt/GTK + **Xvfb** + AT-SPI | none |
| desktop-windows | WPF etc. | Windows + FlaUI/WinAppDriver | Windows machine |
| mobile-android | Android | JDK + Android SDK + emulator + Maestro | **KVM acceleration** |
| mobile-ios | iOS | macOS + Xcode + simulator | **macOS required** |
| embedded-mcu | MCU/RTOS | arm-none-eabi-gcc, cmake, Ceedling, OpenOCD/pyOCD, QEMU, Renode | L3 needs a physical machine + USB passthrough + relays |
| embedded-linux | Yocto etc. | bitbake container (200G+ disk), QEMU, serial passthrough | same |
| fpga | RTL | Verilator/iverilog/Yosys (commercial toolchains need licensed runners) | L3 on-board needs a dedicated machine |
| ml | AI/ML | common frameworks + CUDA runtime | GPU (optional) |

**Runner planning notes**: Android emulators and most embedded simulation need nested virtualization (Linux KVM / macOS HVF) — confirm when choosing machines; the HIL device farm is the only part that must touch physical hardware — defer to Phase 3.

---

# Part 6 · Governance & Evolution (keeping this alive past six months)

1. **Harness engineer** (a new role, part-time at first): maintains the universal template, the image matrix, cross-team feedback.
2. **Weekly feedback meeting** (30 min): each line reviews "this week's agent struggle points" → decide on the spot: doc? script? lint? — **struggle is an environment-defect signal, not a retry signal**.
3. **Scores & dashboard**: docs/quality.md records per-domain quality scores; GC agents keep it fresh.
4. **Subtraction audits** (after every major model upgrade): every harness rule is an assumption of "the model can't do X yet" — delete what expired. **The harness is an asset, but only the minimal sufficient part.**
5. **Security invariants (never relax)**: credentials in vault + proxy, no keys in sandboxes; release/real-hardware/apply irreversible actions always human-approved; protected branches + human merge gates.

---

# Part 7 · FAQ (common beginner doubts)

**Q1: I've never touched this — what's the first step?**
One computer + one agentic CLI tool (Claude Code / Codex CLI / Cursor agent, any) + one T1 pilot project. Build the repo structure per 2.2, run the main loop per 2.5. **One day is enough to run it the first time.**

**Q2: Can AI-generated code be trusted?**
Don't trust the code; trust the verification. Every "done" must be judged by verify.sh (e2e level); subjective dimensions go through Evaluator scoring; humans sample key paths. The harness sets the quality floor — that is this plan's entire point.

**Q3: Could it break the existing project?**
Worktree isolation (independent checkout per task) + commit each step (roll back anytime) + protected branches + human merge gates. Worst case: discard that worktree — zero loss.

**Q4: What about secrets and data safety?**
Credentials in a vault; the agent uses capabilities through an authenticated proxy without seeing plaintext keys; outward actions (release, messaging, apply) always human-approved; sandboxes are per-task disposable.

**Q5: How much investment?**
Start: 1 part-time harness engineer + 1 business line (Phases 0–1). Expansion: +0.5 FTE per line for adapter-card upkeep. Capital-heavy items (device farms) wait for Phase 3.

**Q6: How does this relate to existing CI/CD?**
The verify layer IS CI. The real change: verification moves from "human-triggered, pre-merge" to "agent-triggered, every step" — CI gates don't disappear.

**Q7: A new model / new tool — rewrite everything?**
No. The universal core and domain adapters are model-agnostic (files, scripts, git); a model upgrade only means "run a subtraction audit and delete expired scaffolding".

---

# Appendices

## A. Domain Adapter Card

The blank card template lives at [`docs/adapters/adapter-card-template.md`](../adapters/adapter-card-template.md); per-domain cards will be added there in Phase 2.

## B. Repo Template File List

Canonical copyable templates live in [`docs/templates/`](../templates/): AGENTS.md, feature-list.json, progress.md, main-loop-prompt.md (Phase 1 adds build/run/verify/observe/smoke script skeletons).

## C. Glossary

See Part 1, section 1.4.

## References

Full sources and per-source digests: the Research Summary [harness-best-practices.md](../research/harness-best-practices.md). Main sources: Anthropic (two long-running-harness posts, Managed Agents), OpenAI (Harness engineering), LangChain (Anatomy of an Agent Harness), Martin Fowler/Thoughtworks (Harness engineering memo), Mitchell Hashimoto (My AI adoption journey).
