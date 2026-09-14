# deepseek-harness-plug

> 语言 / Language：**中文（权威版）** ｜ [English](./README.en.md)
>
> status: 生效

Vibe Coding 开发环境（Agent Harness）的调研与落地方案仓库。

## 快速入口

| 你想做什么 | 去哪里 |
|---|---|
| 新成员/零基础，想理解整套方法 | [docs/ 文档地图](./docs/README.md) → [实施篇](./docs/solution/vibe-coding-harness-plan.zh.md) |
| 查设计依据、出处、失败模式 | [调研篇：业界最佳实践总结](./docs/research/harness-best-practices.zh.md) |
| 动手搭建新项目 | 复制[模板库](./docs/templates/)，按[领域适配卡](./docs/adapters/)接入 |
| 了解"当初为什么这么定" | [决策记录](./docs/decisions/README.md) |
| 翻"以后再说"的方案 | [终极方案目录](./docs/plans/deferred-blueprints.md)（每月扫一次） |

## 目录结构

```
deepseek-harness-plug/
├── AGENTS.md        # 本仓库工作守则："讨论入库机制"（人和 AI 进门先读）
├── infra/           # 未启用的基础设施部署包（gitea 门禁等），按终极方案目录触发
├── scripts/         # 文档体检脚本（链接/双语配对/新鲜度），提交时自动运行
└── docs/
    ├── research/    # 调研篇：业界实践逐篇总结、共识、反模式、出处
    ├── solution/    # 实施篇：零基础思路 + 完整方案（通用核心 + 领域适配器）+ 路线图
    ├── templates/   # 可复制工程模板（唯一权威来源）
    ├── adapters/    # 领域适配卡（每领域一张）
    ├── decisions/   # 决策记录（ADR）
    └── plans/       # 落地计划、进度、终极方案目录（活文档）
```

## 双语说明

中文为权威版本（`*.zh.md`），英文为翻译（`*.en.md`）。核心入口与两篇主文档提供英文版；内部活文档（决策记录、模板、适配卡、计划）默认仅中文。规则见根目录 [AGENTS.md](./AGENTS.md)。

## 一图看懂核心公式

```
完整 Harness = 通用核心（80%：知识库/任务进度/验证/环境/安全，所有领域相同）
             + 领域适配器（20%：每个领域回答 build/run/verify/observe/sandbox 五问）
```

接入顺序：T1 纯逻辑（后端/CLI/数据）→ T2 有界面（前端/桌面/移动/游戏）→ T3 重运行时（系统/协议）→ T4 有硬件（嵌入式三级验证金字塔：主机单测 → 板级仿真 → 硬件在环）。
