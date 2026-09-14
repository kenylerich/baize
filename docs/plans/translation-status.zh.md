# 双语覆盖登记表（Translation Coverage）
> status: Active（中文翻译版；权威版本为英文 [translation-status.md](./translation-status.md)）
>
> 规则出处：根目录 AGENTS.md「Bilingual Rules」与决策记录 D9。要点：英文（默认文件名）= 权威；`*.zh.md` = 中文翻译；文件名一律 ASCII；改动权威文档必须同步翻译或标注"落后"。

## 一、双语成对（26 对——docs/ 下全部文档）

| 目录 | 权威版本（英文） | 中文翻译（.zh.md） |
|---|---|---|
| 仓库根 | README.md | README.zh.md |
| docs/ | README.md | README.zh.md |
| docs/research/ | harness-best-practices.md | harness-best-practices.zh.md |
| docs/solution/ | vibe-coding-harness-plan.md；quality-gates.md | 同名 .zh.md |
| docs/decisions/ | README.md；20260914-infra-boundary-decisions.md；20260915-doc-lifecycle-and-bilingual.md；20260915-multi-platform-quality-gates.md；20260915-version-fingerprints.md | 同名 .zh.md |
| docs/plans/ | README.md；deferred-blueprints.md；agile-gap-analysis.md；roadmap.md；translation-status.md | 同名 .zh.md |
| docs/plans/sprints/ | README.md；S2026-01.md | 同名 .zh.md |
| docs/templates/ | README.md；AGENTS.md；progress.md；main-loop-prompt.md；architecture.md；quality.md；ci/README.md | 同名 .zh.md |
| docs/adapters/ | README.md；adapter-card-template.md | 同名 .zh.md |

## 二、仅中文（2 份——docs/ 之外，按规则登记）

| 文件 | 原因 |
|---|---|
| AGENTS.md（仓库根，工作守则） | 面向 AI/团队的操作规则，默认中文 |
| infra/gitea/README.md | 部署包操作手册，默认中文 |

## 三、变更记录

| 日期 | 变更 |
|---|---|
| 2026-09-15 | 建表：双语成对 5 对、仅中文 18 份。 |
| 2026-09-15 | 全量双语完成：docs/ 下 24 对全部成对；仅剩根 AGENTS.md 与 infra/gitea/README.md 按规则保留中文。 |
