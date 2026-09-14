# Quality Gates: One Contract, Three Platforms (GitHub / GitLab / Gitea)

> status: Active — authoritative English version. Chinese translation: [quality-gates.zh.md](./quality-gates.zh.md).
>
> Date: 2026-09-15. Related: decision D10 (`docs/decisions/20260915-multi-platform-quality-gates.md`), D3, Implementation Guide Part 4, deferred-blueprints B1.

## Principle

Gate consistency across GitHub / GitLab / Gitea **cannot** mean identical setting names — the three platforms differ in terminology, UI, and tiers. Consistency is defined at the **contract level**: every platform enforces the same six invariants, judges with the same script, and references the same CI job name. Each platform gets a thin adapter.

## The gate contract (six invariants)

| # | Invariant |
|---|---|
| G-INV-1 | The default branch (`main`) rejects direct pushes — every change arrives via PR/MR |
| G-INV-2 | Merge is blocked unless the CI job named `verify` passes (it runs `scripts/verify.sh` — the single judge) |
| G-INV-3 | Merge is blocked without at least 1 approval |
| G-INV-4 | A "request changes" review blocks merge; new commits dismiss stale approvals |
| G-INV-5 | Force push and branch deletion are forbidden on `main` |
| G-INV-6 | Review/approval records are retained on the platform (audit trail) |

## Consistency mechanism (how identical behavior is produced)

1. **One judge**: `scripts/verify.sh` — copied from the repo template into every project; it contains all real verification logic. Platform CI only invokes it. Nothing platform-specific may leak into it.
2. **One name**: the CI job MUST be named `verify` on every platform — each platform's merge gate references the check by this name.
3. **Three adapters** (in [`docs/templates/ci/`](../templates/ci/README.md)):

| Template | Copy to target repo as | CI system |
|---|---|---|
| `verify-github.yml` | `.github/workflows/verify.yml` | GitHub Actions |
| `verify-gitea.yml` | `.gitea/workflows/verify.yml` | Gitea Actions (GitHub-compatible syntax; identical content to the GitHub adapter) |
| `verify-gitlab.yml` | `.gitlab-ci.yml` | GitLab CI/CD (different syntax, same script) |

4. **Monthly audit**: during the monthly scan (AGENTS.md rule 5), re-tick the setup matrix below on every platform where a repo is hosted.

## Platform setup matrix (tick every row when enabling; re-tick monthly)

| Invariant | GitHub | GitLab | Gitea |
|---|---|---|---|
| G-INV-1 | Branch protection: require a pull request before merging | Protected branch: "Allowed to push" = No one | Protected branch: push disabled (empty push whitelist) |
| G-INV-2 | Required status check: `verify` | Protected branch: **Pipelines must succeed** | Protected branch: status check `verify` |
| G-INV-3 | Required approvals: 1 | MR approvals: 1 (basic approvals in Free/CE; advanced rules are paid tiers) | Required approvals: 1 |
| G-INV-4 | Dismiss stale approvals; block on requested changes | Approvals reset on new push (verify per version) | Block merge on rejected reviews |
| G-INV-5 | Do not allow force pushes; restrict deletions | Allowed to force push: off; allowed to delete: off | Implied by empty push whitelist (verify per version) |
| G-INV-6 | PR reviews retained | MR history retained | PR reviews retained |

> Toggle names and locations drift between platform versions. The matrix is the contract: tick every row when enabling, re-tick it in the monthly audit. If a platform/tier cannot satisfy an invariant, record the deviation in the decision log — never silently lower the bar.

## Setup entry points

- **GitHub**: repo → Settings → Branches → Add branch protection rule (`main`)
- **GitLab**: repo → Settings → Repository → Protected branches; Settings → Merge requests → Approvals
- **Gitea**: repo → Settings → Branch → Protected branches (self-host deployment package: `infra/gitea/`)

## Which platform hosts the repo

Hosting priority: **Gitea (self-host, first choice) → GitHub → GitLab** (revised 2026-09-15, see D10). The gate contract is identical everywhere — moving a repo between platforms changes only the adapter file, never `verify.sh`.

This repository ships all three CI wirings out of the box: `.gitea/workflows/docs-check.yml`, `.github/workflows/docs-check.yml`, and `.gitlab-ci.yml`. Whichever platform hosts or mirrors the repo runs the file that belongs to it, executing the identical checks (`node scripts/check-docs.mjs` + `npm test`).
