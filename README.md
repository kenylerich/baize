# deepseek-harness-plug

Vibe Coding 开发环境（Agent Harness）的调研与落地方案仓库。

## 快速入口

| 你想做什么 | 去哪里 |
|---|---|
| 新成员/零基础，想理解整套方法 | [docs/ 文档地图](./docs/README.md) → [实施篇](./docs/solution/vibe-coding-harness-plan.md) |
| 查设计依据、出处、失败模式 | [调研篇：业界最佳实践总结](./docs/research/harness-best-practices.md) |
| 动手搭建新项目 | 复制[模板库](./docs/templates/)，按[领域适配卡](./docs/adapters/)接入 |
| 了解"当初为什么这么定" | [决策记录](./docs/decisions/README.md) |

## 目录结构

```
deepseek-harness-plug/
└── docs/
    ├── research/    # 调研篇：业界实践逐篇总结、共识、反模式、出处
    ├── solution/    # 实施篇：零基础思路 + 完整方案（通用核心 + 领域适配器）+ 路线图
    ├── templates/   # 可复制工程模板（唯一权威来源）
    ├── adapters/    # 领域适配卡（每领域一张）
    ├── decisions/   # 决策记录（ADR）
    └── plans/       # 落地计划与进度（Phase 0 启动后为活文档）
```

## 一图看懂核心公式

```
完整 Harness = 通用核心（80%：知识库/任务进度/验证/环境/安全，所有领域相同）
             + 领域适配器（20%：每个领域回答 build/run/verify/observe/sandbox 五问）
```

接入顺序：T1 纯逻辑（后端/CLI/数据）→ T2 有界面（前端/桌面/移动/游戏）→ T3 重运行时（系统/协议）→ T4 有硬件（嵌入式三级验证金字塔：主机单测 → 板级仿真 → 硬件在环）。
