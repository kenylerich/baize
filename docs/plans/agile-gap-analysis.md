# Agile Gap Analysis
> status: Active — authoritative English version. Chinese translation: [agile-gap-analysis.zh.md](./agile-gap-analysis.zh.md)
>
> Date: 2026-09-15. Basis: this discussion + Implementation Guide (solution/) + the six research sources.
> Goal: extend the baize repo from a "knowledge & quality governance layer" into a full agile development system — the **requirements → iteration → tasks → increments → feedback** loop.

## Gap table

| # | Gap | Current state | Action | Priority |
|---|---|---|---|---|
| G1 | Requirements pool & intake rules | No live requirements pool | GitHub Issues as the single entry; issue template with fixed fields: background / user story / **acceptance criteria = executable commands** / priority; intake check (independent, small, valuable; acceptance that can't be written as a command = sent back) | P0 |
| G2 | Iteration cadence | roadmap is a placeholder only | Biweekly sprints; `roadmap.md` for milestones; `sprints/SXX.md` for goal/scope/result | P0 |
| G3 | Definition of Done (DoD) | verify is the technical judgment; DoD not written down | DoD into AGENTS.md: implementation + verify passed + review passed + docs synced + checklist ticked + progress updated | P0 |
| G4 | Retrospective mechanism | feedback/scan mechanisms exist, no cadence | Retrospective at each sprint end; improvement items land immediately via the capture-discussions mechanism | P0 |
| G5 | Code review & integration gates | docs-check CI running; branch protection off | Enable GitHub branch protection on main directly (no direct push, PR required, CI green) — zero cost; Gitea still per B1 trigger | P0 |
| G6 | Requirements clarification flow | "ask before coding" exists in the SOP, no requirements-side anchor | "Clarification Q&A" section inside issues; agent asks first | P1 |
| G7 | Tech spike process | none | Time-boxed spikes (≤2 days) for uncertain tech → runnable demo + one ADR into decisions/; a failed spike is also an outcome | P1 |
| G8 | Requirements traceability & change control | none | Full-chain traceability: issue ↔ feature-list ↔ branch/commit (`Closes #N`) ↔ PR ↔ verify; PR template forces line-by-line self-check against acceptance criteria; requirement changes = edit the issue with reasons; no new requirements mid-sprint (bugs excepted); the agent must not "do extra on the side" | P1 |
| G9 | Branch strategy & commit conventions | not written down | trunk-based short-lived branches + PR; conventional commits (enables CHANGELOG generation) | P1 |
| G10 | Delivery & release | no version/CHANGELOG concept | Release tag per sprint + CHANGELOG.md (generated from commits); shares the cadence with monthly archive tags | P2 |
| G11 | Metrics | none | Throughput (stories per sprint), cycle time (issue open→close); use GitHub insights first, no custom build | P2 |

## Technical-reserve view (three layers supporting the gaps)

- **Platform layer** (built once, reused by all, Phase 1): repo template, five scripts, image matrix, CI templates — ready in the Implementation Guide;
- **Domain layer** (one per domain): domain adapter cards — registered as B7;
- **Project layer** (before each project starts): selection spike → ADR — that is G7.

## Research conclusion

Intake / reserves / drift-prevention / engineering management are all mature engineering practices; the six research sources already cover most of them (acceptance = executable commands, one feature at a time, plans as artifacts, sensors & gates). **No new large-scale external research is needed.** Land P0/P1 first; an external calibration can follow at the end of Phase 0.

## Execution order

- Day 1: G1 issue templates + G3 DoD written down;
- Day 2: G2 roadmap.md + first sprint plan;
- Days 3–10: first sprint (pick a T1 pilot; G8/G9 enabled with the project);
- Sprint end: G4 first retrospective + G10 first release tag.

## Scan log

| Date | Conclusion |
|---|---|
| 2026-09-15 | Created. G1–G5 = P0, G6–G9 = P1, G10–G11 = P2. |
