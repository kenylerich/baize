# Repository Map（本仓库工作守则）

> 本仓库是"Vibe Coding Harness"的方案与知识库。任何人/AI 进入本仓库工作，先读本文件。
> 本文件是"讨论入库机制"的执行规则——聊天记录不算存储，结论不落盘等于没结论。

## Repository Map

- 文档地图：docs/README.md
- 调研篇（设计依据与出处）：docs/research/harness-best-practices.md
- 实施篇（完整方案与路线图）：docs/solution/vibe-coding-harness-plan.md
- **终极方案目录（现在不做、以后可能做）：docs/plans/deferred-blueprints.md**
- 可复制模板：docs/templates/ ｜ 领域适配卡：docs/adapters/ ｜ 决策记录：docs/decisions/

## Working Rules（讨论入库机制）

1. **当场存**：任何讨论一旦产生结论（决定 / 方案 / 边界 / 教训），立即写入仓库对应位置——不等提醒，不留到"以后"。
2. **一个知识一个家**（路由表）：
   - 决定与理由 → `docs/decisions/YYYYMMDD-标题.md`
   - 未启用、以后可能做的方案 → `docs/plans/deferred-blueprints.md` 登记一行（必须含触发信号）
   - 已启用方案的实施细节 → `docs/solution/` 或 `infra/<名称>/`
   - 某领域怎么接入 → `docs/adapters/`（按模板建卡）
   - 可复制的模板 → `docs/templates/`（唯一权威来源）
   - 进度与计划 → `docs/plans/`
3. **结论三件套**：写任何结论必须带齐——①什么时候才需要它（触发信号，大白话）②具体怎么做（步骤/文件）③当初为什么这么定（理由与被否掉的备选）。
4. **收尾自查**：每次会话结束前问一句——"本次讨论的结论都进仓库了吗？"没进的，当场补完再结束。
5. **每月一扫**：打开 deferred-blueprints.md 逐行检查——触发信号到了吗？到了就按"去哪看"启动，状态改为"已启用"；顺带抽查文档链接是否有效。

## Invariants（违反即机制失效）

- 每个知识只有一个家，其他地方只放链接
- 结论没有落盘 = 没有结论
- 移动/重命名文件后，必须同步更新 docs/README.md、本文件及所有交叉链接
