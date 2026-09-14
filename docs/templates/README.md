# 工程模板库

这里是所有可复制模板的**唯一权威来源**：新项目初始化时从这里复制到目标仓库对应位置，按占位符修改。模板本身只能在本目录修改，改完通知各项目同步。

| 文件 | 复制到目标仓库 | 用途 |
|---|---|---|
| [AGENTS.md](./AGENTS.md) | 仓库根 | Agent 入口"地图"（≤100 行，只做目录与铁律） |
| [feature-list.json](./feature-list.json) | `tasks/` | 任务看板：特性清单，全部初始 `false`，验收标准=可执行命令 |
| [progress.md](./progress.md) | `tasks/` | 进度文件：上次会话 / 卡点 / 下一步 / 已知坑 |
| [main-loop-prompt.md](./main-loop-prompt.md) | 会话提示词 | 单特性主循环标准指令 |

## 待补充（Phase 1 交付物）

- `scripts/` 骨架：`build.sh`、`run.sh`、`verify.sh`、`observe.sh`、`smoke.sh`（职责定义见[实施篇 2.2/2.3](../solution/vibe-coding-harness-plan.md)）；
- `docs/` 骨架：`architecture.md`、`quality.md`。

## 使用纪律

- 项目本地的"教训回灌"若具有通用性（所有项目都适用的规则），应反哺回本目录的模板；
- 项目特有的规则留在项目本地，不要塞进模板。
