# Roadmap v2 (Milestones & Status)
> status: Active — authoritative English version. Chinese translation: [roadmap.zh.md](./roadmap.zh.md)
>
> Cadence: biweekly sprints ([sprints/](./sprints/README.md)); monthly register scan (AGENTS.md rule 5).
> Registers: gaps G1–G11 ([agile-gap-analysis](./agile-gap-analysis.md)) · deferred blueprints B1–B10 ([deferred-blueprints](./deferred-blueprints.md)) · decisions D1–D11 ([decisions/](../decisions/README.md)) · bilingual coverage ([translation-status](./translation-status.md)).

## Review log

| Date | Reviewer | Conclusion |
|---|---|---|
| 2026-09-15 | Team + agent | v1 directional structure fully consistent with research & design (no gaps in coverage). Executable clarity insufficient: original mission not an explicit milestone, Phase 1 lacked acceptance criteria, Phase 2+ was a pointer only, no metrics/mapping/review log → upgraded to v2 (8 fixes). |

## Milestones

| Milestone | Content | Acceptance criteria (executable) | Depends on | Estimate | Status |
|---|---|---|---|---|---|
| **M0 Governance layer** | doc library, capture-discussions, lifecycle, fingerprints, bilingual, gates contract | `node scripts/check-docs.mjs` passes; `doc-fingerprint.mjs verify` passes; 24 bilingual pairs registered; decisions D1–D11 recorded | — | — | **Done ✓ 2026-09-15** |
| **M1 Agile flow P0** | G1–G5: issue templates, DoD, sprint mechanism, branch protection | Issue templates accept a real requirement; DoD written in both AGENTS files; S2026-01 running; main force-push/deletion disabled on at least one platform | — | Sprint S2026-01 | **In progress (4/6)** |
| **M2 Engineering layer ready** (Phase 1) | repo-template: five scripts (build/run/verify/observe/smoke) + project knowledge skeleton (architecture.md / quality.md) + hooks | From repo-template, a T1 project initializes with one command, passes check-docs + fingerprint + its own verify.sh; G3-layer gap closed | M1 | ~1 week | Not started |
| **M3 First real long task** (original mission) | pilot project completes one full cycle: init → requirement intake → single-feature loop ×≥3 → retrospective | ≥3 features closed through full DoD; retrospective held; improvement items landed in registers; G8/G9 exercised | M2 + **pilot selection (human decision, the only open item)** | 1 sprint | Blocked on pilot selection |
| **M4 First domain adapter** (Phase 2) | first domain card + four scripts validated in a real domain | Card filled + scripts pass on a real project in that domain | M3 | per business | Not started |
| **M5 Platform & scale** (Phase 3–4, trigger-based) | B5 (HIL farm) / B6 (Evaluator + GC) / B8 (GPG) / managed agents | Each B-item's own trigger condition | M3+ | per trigger | Not started |

## Mapping to registers

- M0 closed governance-layer items (decisions D1–D11, bilingual D9, fingerprints D11, gates D10);
- M1 closes **G1–G5** (P0 flow gaps);
- M2 closes the **③④ layer** build gaps (five scripts, project knowledge skeleton) and enables **G8/G9** with the pilot;
- M3 closes **⑦ long-task practice** — the original mission;
- M4 = **B7**; M5 = **B5 / B6 / B8** (trigger-based) plus Phase 3–4 platform items;
- B1–B4 (Gitea authority, mirror, sandbox, DR) run on their own triggers, independent of milestones — currently B1 deployed & merged.

## Metrics (is the roadmap itself succeeding)

- Throughput: ≥3 features closed per sprint through full DoD (pilot phase baseline);
- verify first-pass rate: ≥70% at pilot start, rising each sprint;
- Struggle-point feedback rate: 100% of struggle points landed in registers (no verbal-only fixes);
- Register freshness: monthly scan executed, zero unregistered "later" items in chat only.

## Gap ledger — environment vs. target architecture (assessed 2026-09-15)

Baseline: the full harness environment defined in the Implementation Guide (six layers) plus the original mission (complete one real long task).

| Layer | Target | Current status | Done | Gap nature |
|---|---|---|---|---|
| ① Knowledge base | repo map + docs system of record + bilingual/lifecycle/fingerprints | baize itself largely compliant; project-level skeleton (architecture.md / quality.md templates) missing | ~85% | template gap (small) |
| ② Tasks & progress | feature-list / progress / Issues / sprints / DoD | templates ✓, issue templates ✓, sprint S2026-01 running ✓, DoD ✓; never exercised on real requirements | ~70% | usage gap |
| ③ Verification | five scripts + CI + hooks + linters + Evaluator | this repo's CI ✓ running on Gitea + GitHub; five scripts ✗, hooks ✗, linters ✗, Evaluator ✗ (B6) | ~40% | build gap (medium) |
| ④ Environment | worktree/sandbox + Gitea-first + image matrix + observability | worktree ✓, Gitea + runner deployed ✓, repo migrated ✓; image matrix ✗, observability ✗ | ~50% | on-trigger items |
| ⑤ Security | branch protection / credentials / token rules | GitHub lock ✓; **Gitea lock not configured**; token rules written ✓; vault ✗ (B3) | ~60% | mixed |
| ⑥ Domain adapters | one card per domain | 0 cards (B7) | 0% | business-triggered |
| ⑦ Long-task practice (original mission) | complete one real long task with this environment | never happened | **0%** | **largest gap** |

**Conclusion**: governance ≈85% ready; the executable engineering layer ≈40–50%; end-to-end practice 0%. The gap equals one Phase 1 (five scripts + project template instantiation) plus one pilot sprint — roughly 2–4 weeks — with **no directional misses and no rework risk**. Everything implemented maps to a recorded decision (D1–D11); everything deferred is registered with triggers. The only process defect — "no complete plan to measure against" — is closed by the gap-analysis / roadmap / registers trio. Next: pick the T1 pilot and run the first real long task (closes ⑦).
