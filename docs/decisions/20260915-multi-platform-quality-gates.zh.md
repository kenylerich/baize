# 决策记录：多平台质量闸门（GitHub / GitLab / Gitea）
> status: Active（中文翻译版；权威版本为英文 [20260915-multi-platform-quality-gates.md](./20260915-multi-platform-quality-gates.md)）

- 日期：2026-09-15
- 状态：已接受
- 关联：D3（Gitea 自建选型，20260914-infra-boundary-decisions.md）、`docs/solution/quality-gates.md`、`docs/templates/ci/`
- 背景：质量闸门必须在三个主流 git 平台上以一致的功能运行。

## D10 闸门一致性定义为"不变量契约 + 平台适配层"

- **决定**：闸门以六条平台无关的不变量定义（默认分支拒绝直接 push；CI 任务 `verify` 不通过禁止合并；至少 1 个 Approve；有驳回评审阻止合并；main 禁止 force push/删除分支；审计记录留痕）。每个平台执行同样的六条，各自只做一层薄 CI 适配（`docs/templates/ci/` 中的 `verify-github.yml` / `verify-gitea.yml` / `verify-gitlab.yml`），调用同一个 `scripts/verify.sh`。任务名 `verify` 在所有平台强制统一。
- **理由**：三个平台的设置项名称不可能逐字相同（术语、界面、档位都不同）；唯一稳定的保证是不变量契约 + 单一裁判脚本 + 单一检查名。Gitea Actions 复用 GitHub Actions 语法，因此 GitHub/Gitea 适配层内容相同、目录不同；GitLab 语法不同但调用同一脚本。
- **否决的备选**：只锁定一个平台（不满足多平台要求）；每个平台重写一套判定逻辑（三个真相源，必然漂移）。
- **治理**：启用时的设置矩阵（6 不变量 × 3 平台）逐行勾选，月度扫表复核；偏差（如某免费档缺少某能力）必须记入决策日志——不允许默默接受。
- **与 D3/B1 的关系**：D3 仍然有效——Gitea 仍是自建默认并保有部署包；本决策把"Gitea 唯一"从闸门设计中移除，GitHub/GitLab 成为同等的一等选项。
- **修订（2026-09-15 同日）**：托管优先级确定为 **Gitea → GitHub → GitLab**（Gitea 优先，团队要求）。本仓库已内置全部三份 CI 配置（`.gitea/workflows/docs-check.yml`、`.github/workflows/docs-check.yml`、`.gitlab-ci.yml`），仓库被哪个平台托管或镜像，文档门禁都以相同方式运行。Gitea 的部署本身仍由 B1 管控。
