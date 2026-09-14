# 决策记录（ADR）
> status: Active（生效）

记录"为什么这么设计"，与方案文档分离：方案写"是什么"，这里写"为什么"。

## 约定

- 一条决策一个文件，命名：`YYYYMMDD-短标题.md`；
- 字段：**背景 / 备选方案 / 决策 / 后果 / 状态**（提议 | 已接受 | 已废弃）；
- 决策被推翻时不删文件，改状态为"已废弃"并注明替代决策。

## 示例待写条目

- 为什么通用核心采用五个标准脚本（build/run/verify/observe/smoke）而非自由命名
- 为什么文档目录按 research/solution/templates/adapters 分层
