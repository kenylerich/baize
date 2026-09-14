# Roadmap（里程碑与状态）
> status: Active（生效；活文档——完成即勾选）
>
> 节奏：双周一个 sprint（[sprints/](./sprints/README.zh.md)）；每月扫表（AGENTS.md 规则 5）。缺口编号见 [agile-gap-analysis.zh.md](./agile-gap-analysis.zh.md)。

## Phase 0 · 治理层（已完成 ✓）
- [x] 文档库 + 知识治理（调研/实施/模板/适配卡/决策/计划）— 2026-09-14
- [x] 讨论入库机制 + 终极方案目录 — 2026-09-14
- [x] 文档生命周期（status 行 / 归档标签 / 指纹清单 / 中英双语）— 2026-09-15
- [x] 敏捷缺口分析建档（G1-G11）— 2026-09-15
- [x] 跨平台质量闸门契约（GitHub / GitLab / Gitea）— 2026-09-15
- [x] 分支保护启用（main 禁 force push / 禁删除）— 2026-09-15

## Sprint S2026-01 · 敏捷流动层 P0（进行中 → [sprints/S2026-01.zh.md](./sprints/S2026-01.zh.md)）
- [ ] G1 issue 模板（.github/ISSUE_TEMPLATE/）
- [ ] G3 DoD 成文（根 AGENTS.md + 仓库模板）
- [ ] G2 sprint 机制运转（本文件 + sprints/）
- [ ] G5 分支保护已启用 ✓（PR 门禁待 B1 触发条件）
- [ ] T1 试点项目选定（人决策：选哪条业务线）

## Phase 1 · 通用核心模板化
- [ ] repo-template 五脚本落地（build/run/verify/observe/smoke）
- [ ] 第二领域（前端）适配卡
- [ ] 每周 harness 例会制度化

## Phase 2+ · 领域适配 / 平台化 / 规模化
- 详见实施篇 Phase 2-4 与[终极方案目录](./deferred-blueprints.zh.md)（B5-B7 关联）

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
