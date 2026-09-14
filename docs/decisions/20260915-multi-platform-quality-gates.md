# Decision Record: Multi-Platform Quality Gates (GitHub / GitLab / Gitea)

- Date: 2026-09-15
- Status: Accepted
- Related: D3 (Gitea self-host selection, 20260914-infra-boundary-decisions.md), `docs/solution/quality-gates.md`, `docs/templates/ci/`
- Background: the quality gate must work on all three major git platforms with consistent functionality.

## D10 Gate consistency is defined as "invariant contract + platform adapters"

- **Decision**: the gate is specified as six platform-agnostic invariants (default branch rejects direct push; merge blocked unless CI job `verify` passes; ≥1 approval; rejected review blocks; no force push/deletion on main; audit trail retained). Every platform enforces the same six; each gets a thin CI adapter (`verify-github.yml` / `verify-gitea.yml` / `verify-gitlab.yml` in `docs/templates/ci/`) that invokes the same `scripts/verify.sh`. The job name `verify` is mandatory everywhere.
- **Rationale**: identical setting names across the three platforms are impossible (terminology, UI and tiers differ); the only stable guarantee is the invariant contract + a single judge script + a single check name. Gitea Actions reuses GitHub Actions syntax, so the GitHub/Gitea adapters are identical content in different directories; GitLab uses its own syntax but calls the same script.
- **Rejected alternatives**: pinning gates to one platform only (fails the multi-platform requirement); rewriting verification logic per platform (three sources of truth — guaranteed drift).
- **Governance**: the setup matrix (6 invariants × 3 platforms) is ticked when enabling and re-checked in the monthly scan; deviations (e.g., a capability missing on a free tier) must be recorded in the decision log — never silently accepted.
- **Relation to D3/B1**: D3 remains valid — Gitea is still the self-host default with its deployment package; this decision removes "Gitea-only" from the gate design and makes GitHub/GitLab first-class equivalents.
