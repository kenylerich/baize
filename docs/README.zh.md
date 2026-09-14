# 文档地图

> 语言：中文（翻译版） ｜ **English（权威 / authoritative）**：[README.md](./README.md)
>
> status: Active（生效；中文翻译版；权威版本为英文 README.md）

本目录遵循两条原则：**每个知识只有一个家**（single source of truth），**地图 + 渐进式披露**（入口短而稳定，细节分层下沉）。本文件只做导航，不承载内容。

## 目录结构

```
docs/
├── research/     # 调研篇：业界实践逐篇总结、八条共识、失败模式、全部出处
├── solution/     # 实施篇：零基础思路整理 + 完整搭建方案 + 分阶段路线图
├── templates/    # 可复制工程模板（AGENTS.md、任务看板、进度文件、主循环提示词…）
├── adapters/     # 领域适配卡：接入新领域时填一张卡（build/run/verify/observe/sandbox 五问）
├── decisions/    # 决策记录（ADR）：为什么这么设计
└── plans/        # 落地计划、进度、终极方案目录（deferred-blueprints.md）：活文档
```

## 阅读路径

1. **新成员/首次接触**：[实施篇](solution/vibe-coding-harness-plan.zh.md) 第一、二部分建立认知 → 跳到第三部分自己所在的领域章节；
2. **想知道"为什么这么设计"**：[调研篇](research/harness-best-practices.zh.md)（含全部参考文章链接与逐篇要点）；
3. **动手搭建**：复制 [templates/](templates/README.md) 到目标仓库 → 按自己领域填写[适配卡](adapters/README.md) → 按[实施篇第四部分](solution/vibe-coding-harness-plan.zh.md)路线图推进。

（英文读者：从 [English docs map](./README.md) 进入；两篇主文档的权威版本即默认文件名，`.zh.md` 是中文翻译。）

## 维护规则

- **唯一权威来源**：模板只改 `templates/`，适配卡只改 `adapters/`；任何文档不得抄一份副本，需要时只放链接；
- **讨论入库**：聊出结论当场落盘，"以后再说"的必须登记进 [plans/deferred-blueprints.md](plans/deferred-blueprints.md)——完整规则见根目录 [AGENTS.md](../AGENTS.md)；
- **双语**：英文（默认文件名）为权威版本；改动权威文档必须同步 `.zh.md` 中文翻译，来不及先标注"落后"；由 `scripts/check-docs.mjs` 机械检查。双语覆盖现状见 [plans/translation-status.md](plans/translation-status.md)；
- **决策留痕**：影响方案走向的决定写入 `decisions/`（一条一文件，命名 `YYYYMMDD-标题.md`，文件名一律 ASCII）；
- **进度与内容分离**：调研篇/实施篇保持稳定，实施进度一律进 `plans/`；
- **链接自检**：移动或重命名文件后，必须更新本文件、根 README 及文内交叉链接（体检脚本会兜底）。
