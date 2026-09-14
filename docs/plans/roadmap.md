# Roadmap (Milestones & Status)
> status: Active — authoritative English version. Chinese translation: [roadmap.zh.md](./roadmap.zh.md)
>
> Cadence: biweekly sprints ([sprints/](./sprints/README.md)); monthly register scan (AGENTS.md rule 5). Gap IDs per [agile-gap-analysis.md](./agile-gap-analysis.md).

## Phase 0 · Governance layer (done ✓)
- [x] Doc library + knowledge governance (research/solution/templates/adapters/decisions/plans) — 2026-09-14
- [x] Capture-discussions mechanism + deferred blueprints register — 2026-09-14
- [x] Document lifecycle (status lines / archive tags / fingerprints / bilingual) — 2026-09-15
- [x] Agile gap analysis registered (G1–G11) — 2026-09-15
- [x] Cross-platform quality gate contract (GitHub / GitLab / Gitea) — 2026-09-15
- [x] Branch protection enabled (main: no force push / no deletion) — 2026-09-15

## Sprint S2026-01 · Agile flow layer P0 (in progress → [sprints/S2026-01.md](./sprints/S2026-01.md))
- [ ] G1 issue templates (.github/ISSUE_TEMPLATE/)
- [ ] G3 DoD written down (root AGENTS.md + repo template)
- [ ] G2 sprint mechanism running (this file + sprints/)
- [ ] G5 branch protection ✓ force push/deletion disabled (PR gate waits for B1)
- [ ] T1 pilot project selected (human decision: which business line)

## Phase 1 · Templatize the universal core
- [ ] repo-template with the five scripts (build/run/verify/observe/smoke)
- [ ] Second-domain (frontend) adapter card
- [ ] Weekly harness meeting institutionalized

## Phase 2+ · Domain adapters / platformization / scale
- See Implementation Guide Phases 2–4 and the [deferred blueprints register](./deferred-blueprints.md) (B5–B7)

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
