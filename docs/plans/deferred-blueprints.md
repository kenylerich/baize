# Deferred Blueprints Register
> status: Active — authoritative English version. Chinese translation: [deferred-blueprints.zh.md](./deferred-blueprints.zh.md)
>
> Everything "not now, maybe later" is registered here. **Scanned monthly**: when a trigger signal fires, follow "where to look" and flip the status to "enabled".
> Status values: not enabled / enabled / deprecated (with pointer).

| # | Blueprint | Trigger signal (do it only when this appears) | Where to look | Status |
|---|---|---|---|---|
| B1 | Docker Gitea review gates (branch protection + PR + CI + Approve) — **priority of the three platforms** | A second committing subject appears: a second colleague, or agent commit volume exceeds human gating capacity | `infra/gitea/`; decisions D3/D10; `docs/solution/quality-gates.md`; this repo ships all three platform CI configs (.gitea/.github/.gitlab-ci.yml) | Deployed & merged: Gitea runs at localhost:3000, repo kenyle/baize created and synced (main + archive tag); branch protection and push mirror pending |
| B2 | Gitea push mirror to GitHub (off-site backup) | After B1, when Gitea becomes the authoritative repo | `infra/gitea/README.md` section 5 (needs a GitHub fine-grained PAT) | Not enabled |
| B3 | Agent sandbox + credential-proxy push | Agents run inside isolated containers, or multiple non-interfering agents are needed | Decision D4; Implementation Guide 2.2⑤ | Not enabled |
| B4 | Standalone DR build-out (Gitea data-volume backup) | After B1 (git-external state appears: review records, issues) | `infra/gitea/README.md` section 6; decision D5 | Not enabled |
| B5 | Embedded HIL device farm (real boards + relay reset + device locks) | Embedded L1 + L2 passing and a real-hardware release gate is needed | Implementation Guide 3.4, Phase 3 | Not enabled |
| B6 | Evaluator quality scoring + GC agents (entropy governance automation) | Human AI-slop cleanup time clearly exceeds its value | Implementation Guide 4.6, Phase 3 | **Not enabled — note: the Planner/Generator/Evaluator loop is NOT running anywhere in the system today** |
| B7 | Domain adapter cards (desktop/mobile/game/embedded…) | A business line onboards its domain | Implementation Guide Part 3; `docs/adapters/` | Not enabled (flips to enabled per domain in Phase 2) |
| B8 | Tamper-resistance enhancement: GPG-signed commits (SHA256 manifest already landed) | Document integrity & authorship must be provable outside the repo (external delivery, compliance) | Decision 20260915 D8; `scripts/doc-fingerprint.mjs` | Partially enabled (manifest live; GPG not) |
| B9 | Full bilingualization of all docs | Done — landed directly per team decision | Decision 20260915 D9; bilingual rules in root AGENTS.md | Enabled (all docs under docs/ paired, see translation-status) |
| B10 | Unify script language to mjs/Node | Team confirms JS as the primary stack AND all relevant machines (including per-domain CI containers) have Node; until then **each repo's scripts follow its own stack**, only the entry names are unified (build/run/verify/observe/smoke) | Local Node v24 confirmed; conversation conclusion 2026-09-15 | Not enabled (bash + Git Bash covers the current scenario) |

## Scan log

| Date | Conclusion |
|---|---|
| 2026-09-14 | Register created. All not enabled. |
| 2026-09-15 | B8 partially enabled; B9 enabled; B1 deployed & merged. |
