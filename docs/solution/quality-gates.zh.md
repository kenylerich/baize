# 质量闸门：一套契约，三个平台（GitHub / GitLab / Gitea）

> status: Active（生效；中文翻译版；英文为权威版本 [quality-gates.md](./quality-gates.md)）
>
> 日期：2026-09-15。关联：决策 D10（`docs/decisions/20260915-multi-platform-quality-gates.md`）、D3、实施篇第四部分、终极方案目录 B1。

## 原则

三个平台之间的闸门一致性，**不可能**是设置项名称逐字相同——三家的术语、界面、付费档位都不同。一致性定义在**契约层面**：每个平台执行同样的六条不变量、用同一个脚本判定、引用同一个 CI 任务名。每个平台只做一层薄适配。

## 闸门契约（六条不变量）

| # | 不变量 |
|---|---|
| G-INV-1 | 默认分支（`main`）拒绝直接 push——一切变更必须走 PR/MR |
| G-INV-2 | CI 任务 `verify` 不通过则禁止合并（它运行 `scripts/verify.sh`——唯一裁判） |
| G-INV-3 | 没有 ≥1 个 Approve 禁止合并 |
| G-INV-4 | 有"请求修改"（request changes）评审则禁止合并；新提交会撤销过期 Approve |
| G-INV-5 | `main` 上禁止 force push、禁止删除分支 |
| G-INV-6 | 评审/审批记录在平台上留痕（可审计） |

## 一致性机制（如何保证三个平台行为一致）

1. **一个裁判**：`scripts/verify.sh`——从仓库模板复制进每个项目，包含全部真正的判定逻辑；平台 CI 只负责调用它。任何平台特有逻辑不得混入。
2. **一个名字**：CI 任务在所有平台上**必须叫 `verify`**——三个平台的合并门禁都按这个名字引用检查结果。
3. **三份适配层**（在 [`docs/templates/ci/`](../templates/ci/README.md)）：

| 模板 | 复制到目标仓库 | CI 系统 |
|---|---|---|
| `verify-github.yml` | `.github/workflows/verify.yml` | GitHub Actions |
| `verify-gitea.yml` | `.gitea/workflows/verify.yml` | Gitea Actions（与 GitHub 语法兼容，内容与 GitHub 适配层相同） |
| `verify-gitlab.yml` | `.gitlab-ci.yml` | GitLab CI/CD（语法不同，调用同一脚本） |

4. **每月审计**：月度扫表时（AGENTS.md 规则 5），对仓库所在的每个平台重新核对一遍下面的设置矩阵。

## 平台设置矩阵（启用时逐行勾选；每月复核）

| 不变量 | GitHub | GitLab | Gitea |
|---|---|---|---|
| G-INV-1 | 分支保护：合并前必须 PR | 受保护分支："Allowed to push" = No one | 受保护分支：禁用 push（推送白名单留空） |
| G-INV-2 | 必须通过的状态检查：`verify` | 受保护分支：**Pipelines must succeed** | 受保护分支：状态检查 `verify` |
| G-INV-3 | 要求 Approve：1 | MR approvals：1（Free/CE 支持基础 approvals；高级规则为付费档） | 要求 Approve：1 |
| G-INV-4 | 撤销过期 Approve；有 request changes 阻止合并 | 新提交重置 Approve（按版本核对） | 有驳回评审阻止合并 |
| G-INV-5 | 禁止 force push；禁止删除分支 | Allowed to force push：关；允许删除：关 | 推送白名单为空即隐含（按版本核对） |
| G-INV-6 | PR 评审记录保留 | MR 历史保留 | PR 评审记录保留 |

> 各平台版本的开关名称和位置会漂移。本矩阵就是契约：启用时逐行勾选，每月审计时重新勾选。如果某个平台/档位无法满足某条不变量，把偏差记入决策日志——**不允许默默降低标准**。

## 设置入口

- **GitHub**：仓库 → Settings → Branches → Add branch protection rule（`main`）
- **GitLab**：仓库 → Settings → Repository → Protected branches；Settings → Merge requests → Approvals
- **Gitea**：仓库 → 设置 → 分支 → 受保护分支（自建部署包：`infra/gitea/`）

## 仓库托管在哪

仓库在哪里，闸门就在哪里生效。默认：云端 = GitHub；自建 = Gitea（D3）；组织标准要求时 = GitLab。闸门契约在任何平台完全一致——仓库在平台之间迁移，只换适配层文件，`verify.sh` 永远不变。
