# 单特性主循环标准提示词
> status: Active（生效）

> 用法：每个执行会话完成"开工仪式"（pwd → git log -20 → 读 progress.md → 读 feature-list.json → smoke.sh）后，粘贴以下指令。

```text
读取 tasks/progress.md 与 tasks/feature-list.json，选择优先级最高的未完成特性。
按 docs/plans 与 docs/architecture.md 的约束实现它。
完成标准：scripts/verify-feature.sh <id> 通过。
通过后：更新 feature-list.json 状态、更新 progress.md、提交（说明做了什么与为什么）。
一次只做一个特性。如有歧义，先列出问题等待回答。
```
