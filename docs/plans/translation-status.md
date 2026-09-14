# Bilingual Coverage Register (Translation Coverage)
> status: Active — authoritative English version. Chinese translation: [translation-status.zh.md](./translation-status.zh.md)
>
> Rules: root AGENTS.md "Bilingual Rules" and decision D9. Key points: English (default filename) = authoritative; `*.zh.md` = Chinese translation; filenames are ASCII-only; changes to an authoritative doc must be mirrored in the translation or marked "behind".

## 1. Bilingual pairs (24 pairs — everything under docs/)

| Directory | Authoritative (English) | Chinese translation (.zh.md) |
|---|---|---|
| repo root | README.md | README.zh.md |
| docs/ | README.md | README.zh.md |
| docs/research/ | harness-best-practices.md | harness-best-practices.zh.md |
| docs/solution/ | vibe-coding-harness-plan.md; quality-gates.md | same-name .zh.md |
| docs/decisions/ | README.md; 20260914-infra-boundary-decisions.md; 20260915-doc-lifecycle-and-bilingual.md; 20260915-multi-platform-quality-gates.md; 20260915-version-fingerprints.md | same-name .zh.md |
| docs/plans/ | README.md; deferred-blueprints.md; agile-gap-analysis.md; roadmap.md; translation-status.md | same-name .zh.md |
| docs/plans/sprints/ | README.md; S2026-01.md | same-name .zh.md |
| docs/templates/ | README.md; AGENTS.md; progress.md; main-loop-prompt.md; ci/README.md | same-name .zh.md |
| docs/adapters/ | README.md; adapter-card-template.md | same-name .zh.md |

## 2. Chinese-only (2 files — outside docs/, registered per rules)

| File | Reason |
|---|---|
| AGENTS.md (repo root, working rules) | Operational rules for the AI/team — Chinese by default |
| infra/gitea/README.md | Deployment-package operations manual — Chinese by default |

## 3. Change log

| Date | Change |
|---|---|
| 2026-09-15 | Created: 5 paired + 18 Chinese-only. |
| 2026-09-15 | Full bilingual completion: all 24 pairs under docs/ paired; only root AGENTS.md and infra/gitea/README.md remain Chinese-only (registered per rules). |
