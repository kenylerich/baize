# CI 质量闸门适配模板
> status: Active（生效）

三个平台各自的 CI 适配层。**真正的判定逻辑只有一份**：目标仓库里的 `scripts/verify.sh`（从仓库模板复制）；平台 CI 只负责调用它。**任务名必须叫 `verify`**——三个平台的合并门禁都按这个名字引用检查结果。

| 模板 | 复制到目标仓库 | 平台 |
|---|---|---|
| [verify-github.yml](./verify-github.yml) | `.github/workflows/verify.yml` | GitHub Actions |
| [verify-gitea.yml](./verify-gitea.yml) | `.gitea/workflows/verify.yml` | Gitea Actions（与 GitHub 语法兼容，内容相同） |
| [verify-gitlab.yml](./verify-gitlab.yml) | `.gitlab-ci.yml` | GitLab CI/CD（语法不同，调用同一脚本） |

六条闸门不变量 × 三个平台的设置对照表见 [docs/solution/quality-gates.md](../../solution/quality-gates.md)（中文版：quality-gates.zh.md）。启用后纳入每月扫表核对。
