# 路线图 v2（里程碑与状态）
> status: Active（中文翻译版；权威版本为英文 [roadmap.md](./roadmap.md)）
>
> 节奏：双周一个 sprint（[sprints/](./sprints/README.md)）；每月扫表（AGENTS.md 规则 5）。
> 登记表：缺口 G1–G11（[agile-gap-analysis](./agile-gap-analysis.zh.md)）· 终极方案 B1–B10（[deferred-blueprints](./deferred-blueprints.zh.md)）· 决策 D1–D11（[decisions/](../decisions/README.zh.md)）· 双语覆盖（[translation-status](./translation-status.zh.md)）。

## 评审记录

| 日期 | 评审人 | 结论 |
|---|---|---|
| 2026-09-15 | 团队 + Agent | v1 的方向结构与调研、设计完全一致（覆盖无遗漏）；但可执行明确度不足：原始使命不是显式里程碑、Phase 1 缺验收标准、Phase 2+ 仅为指针、缺指标/映射/评审记录 → 升级为 v2（8 项修复）。 |

## 里程碑

| 里程碑 | 内容 | 验收标准（可执行） | 依赖 | 预估 | 状态 |
|---|---|---|---|---|---|
| **M0 治理层** | 文档库、讨论入库、生命周期、指纹、双语、闸门契约 | `node scripts/check-docs.mjs` 通过；`doc-fingerprint.mjs verify` 通过；24 对双语已登记；决策 D1–D11 已记录 | — | — | **完成 ✓ 2026-09-15** |
| **M1 敏捷流动层 P0** | G1–G5：issue 模板、DoD、sprint 机制、分支保护 | issue 模板能录入一条真实需求；DoD 写入两份 AGENTS；S2026-01 运行中；至少一个平台 main 禁 force push/删除 | — | Sprint S2026-01 | **进行中（4/6）** |
| **M2 工程层就绪**（Phase 1） | repo-template：五脚本（build/run/verify/observe/smoke）+ 项目知识骨架（architecture.md / quality.md）+ hooks | 从 repo-template 一条命令初始化 T1 项目，通过 check-docs + 指纹 + 自身 verify.sh；③④层缺口关闭 | M1 | ~1 周 | 未开始 |
| **M3 首个真实长任务**（原始使命） | 试点项目完成一次完整闭环：初始化 → 需求录入 → 单特性循环 ×≥3 → 回顾 | ≥3 个特性走完完整 DoD；回顾会已开；改进项已入库；G8/G9 已实际执行 | M2 + **试点选定（人类决策，唯一开口）** | 1 个 sprint | 等待试点选定 |
| **M4 首个领域适配卡**（Phase 2） | 首个领域适配卡 + 四脚本在真实领域验证 | 卡片填写完成 + 脚本在该领域真实项目通过 | M3 | 按业务 | 未开始 |
| **M5 平台与规模**（Phase 3–4，按触发） | B5（HIL 设备农场）/ B6（Evaluator + GC）/ B8（GPG）/ 托管 Agent | 各 B 项自身的触发条件 | M3+ | 按触发 | 未开始 |

## 待办明细清单（具体缺口逐项化）

勾选 = 完成。编号对应登记表（[G](./agile-gap-analysis.zh.md) / [B](./deferred-blueprints.zh.md) / 里程碑）。

### M1 · 敏捷流动 P0
- [ ] 在 GitHub Issues 录入第一条真实需求（G1 实用化）
- [ ] 下次提交起采用 conventional commits 规范（G9，写入 AGENTS）

### M2 · 工程层（脚本与骨架）
- [ ] build 脚本骨架（repo-template）
- [ ] run 脚本骨架
- [ ] verify + verify-feature 脚本骨架
- [ ] observe + smoke 脚本骨架
- [ ] 本仓库 pre-push hook：自动 check-docs + 指纹（可立即做）
- [ ] 项目知识骨架：architecture.md / quality.md 模板
- [ ] 自定义 linter 规则集（Phase 3）
- [ ] Evaluator + GC Agent（B6，触发制）

### ④ 环境
- [x] Gitea main 分支保护（直推限白名单 kenyle）——2026-09-15 经 API 启用
- [ ] push mirror 到 GitHub（B2，需细粒度 PAT——人工步骤）
- [ ] 镜像矩阵构建（base/web/backend/…）
- [ ] 每 worktree 临时可观测性栈（Phase 3）

### ⑤ 安全
- [ ] GitHub 细粒度 PAT 签发（人工步骤，B2 用）
- [ ] vault + 代理（B3，触发制）

### ⑥⑦ 领域与实战
- [ ] 选定 T1 试点业务线（唯一开口）
- [ ] 首张领域适配卡（M4）
- [ ] 首个真实长任务 sprint（M3）

## 与登记表的映射

- M0 关闭治理层（决策 D1–D11、双语 D9、指纹 D11、闸门 D10）；
- M1 关闭 **G1–G5**（P0 流动缺口）；
- M2 关闭 **③④层** 实现缺口（五脚本、项目知识骨架），并随试点启用 **G8/G9**；
- M3 关闭 **⑦ 长任务实战**——原始使命；
- M4 = **B7**；M5 = **B5 / B6 / B8**（按触发）及 Phase 3–4 平台项；
- B1–B4（Gitea 权威、镜像、沙箱、容灾）按自身触发推进，与里程碑独立——当前 B1 已部署并合入。

## 指标（roadmap 本身是否成功的度量）

- 吞吐：试点期每个 sprint 经完整 DoD 关闭的特性 ≥3 个；
- verify 一次通过率：试点起步 ≥70%，逐 sprint 提升；
- 挣扎点回灌率：100% 的挣扎点落入登记表（不允许只有口头修正）；
- 登记表新鲜度：每月扫表执行，聊天中不允许存在未登记的"以后再做"。

## 差距总账——环境 vs 目标架构（2026-09-15 盘点）

基准：实施篇定义的完整 harness 环境（六层）+ 原始使命（完成一次真实长任务）。

| 层 | 目标 | 当前状态 | 完成度 | 差距性质 |
|---|---|---|---|---|
| ① 知识库 | 仓库地图 + docs 系统记录 + 双语/生命周期/指纹 | baize 自身基本达标；项目级骨架（architecture.md / quality.md 模板）未产出 | ~85% | 模板缺口（小） |
| ② 任务与进度 | feature-list / progress / Issues / sprint / DoD | 模板 ✓、issue 模板 ✓、S2026-01 运行中 ✓、DoD ✓；未在真实需求上运转 | ~70% | 使用缺口 |
| ③ 验证 | 五脚本 + CI + hooks + linter + Evaluator | 本仓库 CI ✓（Gitea+GitHub 实跑）；五脚本 ✗、hooks ✗、linter ✗、Evaluator ✗（B6） | ~40% | 实现缺口（中） |
| ④ 环境 | worktree/沙箱 + Gitea 优先 + 镜像矩阵 + 可观测 | worktree ✓、Gitea+runner 已部署 ✓、仓库已迁移 ✓；镜像矩阵 ✗、可观测 ✗ | ~50% | 按触发推进 |
| ⑤ 安全 | 分支保护 / 凭据 / token 规则 | GitHub 锁 ✓；**Gitea 锁未配置**；token 规则已成文 ✓；vault ✗（B3） | ~60% | 混合 |
| ⑥ 领域适配 | 每领域一张卡 | 0 张（B7） | 0% | 业务触发 |
| ⑦ 长任务实战（原始使命） | 用该环境完成一次真实长任务 | 从未发生 | **0%** | **最大缺口** |

**结论**：治理层 ≈85% 就绪；可执行的工程层 ≈40–50%；端到端实战 0%。差距 = 一个 Phase 1（五脚本 + 项目模板实例化）+ 一个试点 sprint，约 2–4 周——**无方向性缺失、无返工风险**。所有已实现的都对应在案的决策（D1–D11），所有推迟的都带触发条件登记。唯一的流程缺陷——"没有完整地图可度量"——已由缺口分析 / 路线图 / 登记表三件套关闭。下一步：选定 T1 试点并跑第一个真实长任务（关闭⑦）。
