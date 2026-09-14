# Repository Map
> status: Active（生效）
- 架构与分层规则: docs/architecture.md（铁律：UI 不得直接访问 Repo）
- 质量评分: docs/quality.md
- 当前计划: docs/plans/active/…；已完成: docs/plans/done/
- 特性清单: tasks/feature-list.json；进度: tasks/progress.md

# Working Protocol
1. 每个会话开始：pwd → git log -20 → progress.md → feature-list.json → smoke.sh
2. 一次只做一个特性；verify-feature.sh 通过后才可标记完成
3. 每完成一步：更新 progress.md + 描述性 commit
4. 卡住 30 分钟：写清卡点入 progress.md，跳过或求助，不要死磕
5. 有歧义：先提问
6. 新知识写 docs/ 对应文件，本文件只加指针

# Definition of Done（一条需求算完成的全部条件）
1. 一次只做一个特性；实现前先写验收验证（verify-feature）
2. scripts/verify.sh 通过（端到端级，非仅单测）
3. tasks/feature-list.json 勾选 + tasks/progress.md 更新
4. 相关文档同步（本文件只加指针，正文进 docs/）
5. commit 写清"做了什么、为什么"；PR 关联 issue（Closes #N）
6. 逐条对照验收标准自检通过（第二个提交主体出现后改为 1 个 Approve）

# Invariants（违反即 CI 失败）
- 边界处必须显式解析数据形状
- 结构化日志；禁止 YOLO 式数据探测
- 文件 < 400 行
