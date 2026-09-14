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

# Invariants（违反即 CI 失败）
- 边界处必须显式解析数据形状
- 结构化日志；禁止 YOLO 式数据探测
- 文件 < 400 行
