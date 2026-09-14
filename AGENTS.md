# Repository Map（本仓库工作守则）
> status: Active（生效；本文件为工作守则，随机制演进）

> 本仓库是"Vibe Coding Harness"的方案与知识库。任何人/AI 进入本仓库工作，先读本文件。
> 本文件是"讨论入库机制"的执行规则——聊天记录不算存储，结论不落盘等于没结论。

## Repository Map

- 文档地图：docs/README.md（中文翻译：docs/README.zh.md）
- 调研篇（设计依据与出处）：docs/research/harness-best-practices.md（中文翻译：同目录 .zh.md）
- 实施篇（完整方案与路线图）：docs/solution/vibe-coding-harness-plan.md（中文翻译：同目录 .zh.md）
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

## Document Lifecycle（文档生命周期）

1. **状态行**：每份文档头部必须有 `> status:` 行，取值：`Active（生效）` / `Superseded（已过时 → 看xxx，附链接）` / `Deprecated（已废弃，注明原因）`。文档被新版本取代时，旧文档**原地保留**、状态改"已过时"并加指向链接——**禁止搬进归档文件夹**（一个知识一个家）。
2. **归档 = 打版本标签**：每月用 `bash scripts/doc-fingerprint.sh tag archive-YYYY-MM` 打标签——脚本先校验清单一致性，再把**版本指纹**（集合 SHA256 前 12 位）写入标签信息；版本间变更用 `doc-fingerprint.sh changes <旧标签>` 查看，任意历史版本用 `verify-ref <标签>` 复核完整性。git 本身已永久保存每个历史版本。
3. **新鲜度**：最后修改时间由 git 自动记录，**禁止手写版本号**；标"生效"但超过 6 个月未更新的文档，由体检脚本提示人工确认。
4. **防篡改**：git 哈希链（自动留痕）+ 远端禁止改写历史（一次性设置）+ `scripts/check-docs.sh` 提交时自动体检（链接 / 双语配对 / 新鲜度 / 指纹）。
5. **指纹清单**：`MANIFEST.sha256` 记录全部受管文件（文档、脚本、workflow、infra 配置）的 SHA256。文件变更的**同一提交**内必须重新生成清单（`bash scripts/doc-fingerprint.sh generate`）；体检与 CI 自动校验，对不上即失败。

## Bilingual Rules（双语规则）

1. 命名：**默认文件名（无后缀）= 英文权威版**；中文翻译加后缀 `*.zh.md`，成对存放于同一目录。**文件名一律 ASCII，禁止中文。**
2. **英文为权威版本**：冲突时以英文为准，中文是翻译。
3. 改动英文权威文档时，必须同步更新中文翻译；来不及就先在中文版头部标注 `> sync: 落后于英文（截至日期）`，并尽快补齐。
4. 内部活文档（决策记录、模板、适配卡、计划）默认仅中文，无需英文版；需要时按需补译并登记配对。全量双语化见终极方案目录 B9。
5. `scripts/check-docs.sh` 会检查配对完整性与翻译新鲜度。

## Definition of Done（完成定义——本仓库）

一条工作算"完成"，必须同时满足：
1. 内容落在唯一权威位置，他处只放链接；
2. `status` 行与双语配对合规（权威文档改动同步 `.zh.md`）；
3. `bash scripts/check-docs.sh` 五项体检通过（本地或 CI）；
4. 指纹清单已重新生成并与变更同一提交；
5. 结论登记到位（decisions / deferred-blueprints / gap 文档）——**聊天里不留未落盘的结论，也不留未登记的"以后再做"**。

## Invariants（违反即机制失效）

- 每个知识只有一个家，其他地方只放链接
- 结论没有落盘 = 没有结论
- **文件名一律 ASCII，禁止中文**
- 移动/重命名文件后，必须同步更新 docs/README.md、本文件及所有交叉链接
