# CI Quality-Gate Adapters
> status: Active — authoritative English version. Chinese translation: [README.zh.md](./README.zh.md)

Per-platform CI adapters. **The judging logic exists only once**: `scripts/verify.sh` in the target repo (copied from the repo template); platform CI merely invokes it. **The job must be named `verify`** — all three platforms' merge gates reference the check by this name.

| Template | Copy to target repo | Platform |
|---|---|---|
| [verify-github.yml](./verify-github.yml) | `.github/workflows/verify.yml` | GitHub Actions |
| [verify-gitea.yml](./verify-gitea.yml) | `.gitea/workflows/verify.yml` | Gitea Actions (GitHub-compatible syntax, identical content) |
| [verify-gitlab.yml](./verify-gitlab.yml) | `.gitlab-ci.yml` | GitLab CI/CD (different syntax, same script) |

The setup matrix (six gate invariants × three platforms) lives in [docs/solution/quality-gates.md](../../solution/quality-gates.md) (Chinese: quality-gates.zh.md). Once enabled, include it in the monthly scan audit.
