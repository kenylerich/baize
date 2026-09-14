# 双语覆盖登记表（Translation Coverage）
> status: Active（生效；内部活文档——**每新增或更名文档，必须同步更新本表**）
>
> 规则出处：根目录 AGENTS.md「Bilingual Rules」与决策记录 D9（`docs/decisions/20260915-doc-lifecycle-and-bilingual.md`）。
> 要点：英文（默认文件名）= 权威版本；`*.zh.md` = 中文翻译；文件名一律 ASCII；改动权威文档必须同步翻译或标注"落后"。

## 一、双语成对（5 对，权威版 + 中文翻译）

| 权威版本（英文） | 中文翻译 | 同步状态 |
|---|---|---|
| [README.md](../../README.md) | [README.zh.md](../../README.zh.md) | 同步（2026-09-15） |
| [docs/README.md](../README.md) | [docs/README.zh.md](../README.zh.md) | 同步（2026-09-15） |
| [docs/research/harness-best-practices.md](../research/harness-best-practices.md) | [同目录 .zh.md](../research/harness-best-practices.zh.md) | 同步（2026-09-15） |
| [docs/solution/vibe-coding-harness-plan.md](../solution/vibe-coding-harness-plan.md) | [同目录 .zh.md](../solution/vibe-coding-harness-plan.zh.md) | 同步（2026-09-15） |
| [docs/solution/quality-gates.md](../solution/quality-gates.md) | [同目录 .zh.md](../solution/quality-gates.zh.md) | 同步（2026-09-15） |

## 二、仅中文（内部活文档与模板，共 18 份）

按双语规则（AGENTS.md 规则 4），内部文档默认仅中文，**这不是缺陷**；需要英文版时按 B9 启动补译，并从本表迁到上方"双语成对"。

| 文件 | 类型 | 需要英文版？ |
|---|---|---|
| AGENTS.md（根，工作守则） | 守则 | 按需 |
| docs/decisions/README.md | 决策索引 | 按需 |
| docs/decisions/20260914-infra-boundary-decisions.md | 决策记录 | 按需 |
| docs/decisions/20260915-doc-lifecycle-and-bilingual.md | 决策记录 | 按需 |
| docs/decisions/20260915-multi-platform-quality-gates.md | 决策记录 | 按需 |
| docs/decisions/20260915-version-fingerprints.md | 决策记录 | 按需 |
| docs/plans/README.md | 计划 | 按需 |
| docs/plans/deferred-blueprints.md | 终极方案目录 | 按需 |
| docs/plans/agile-gap-analysis.md | 缺口分析 | 按需 |
| docs/plans/roadmap.md | 路线图 | 按需 |
| docs/plans/sprints/README.md | 迭代说明 | 按需 |
| docs/plans/sprints/S2026-01.md | 当前迭代 | 按需 |
| docs/templates/README.md | 模板说明 | 按需 |
| docs/templates/AGENTS.md | 工程模板 | 按需 |
| docs/templates/progress.md | 工程模板 | 按需 |
| docs/templates/main-loop-prompt.md | 工程模板 | 按需 |
| docs/adapters/README.md | 适配卡说明 | 按需 |
| docs/adapters/adapter-card-template.md | 适配卡模板 | 按需 |

## 三、变更记录

| 日期 | 变更 |
|---|---|
| 2026-09-15 | 建表。成对 5 对、仅中文 18 份，与仓库实际一致。 |
