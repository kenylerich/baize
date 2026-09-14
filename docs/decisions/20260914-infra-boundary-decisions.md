# Decision Record: Infrastructure Boundaries (local git / remote / gates / sandbox / DR)
> status: Active — authoritative English version. Chinese translation: [20260914-infra-boundary-decisions.zh.md](./20260914-infra-boundary-decisions.zh.md)

- Date: 2026-09-14
- Status: Accepted
- Background: the team is in Phase 0-1 (single person + AI agent pilot; docs repo baize). This discussion clarified the capability boundaries of local git and how to handle the four scenarios where local git falls short. Related: the deferred-blueprints register.

## D1 Local git for state management at the current stage

- **Decision**: in the solo stage, all state management (progress persistence, session recovery, rollback, worktree isolation) uses local git, with no additional infrastructure.
- **Rationale**: every role git plays in the plan (history, progress anchors, rollback points) is a local capability; worktree creation and history reading verified to work without network.
- **Change condition**: a second committing subject appears (second machine / second person), see B1.

## D2 Cross-machine / multi-person sync requires a remote

- **Decision**: use a remote repository whenever cross-subject sync is needed; an authoritative remote simultaneously serves as backup.
- **Rationale**: git history exists only on the disk of the machine that made the commits; sharing across subjects must pass through a common mailbox ("public postbox") — a physical constraint, not a missing feature.

## D3 Review gates: self-hosted Docker Gitea (deferred until triggered)

- **Decision**: the gate stack is Gitea (Docker self-hosted) + act_runner CI; do not deploy until the trigger condition occurs.
- **Rationale**: intranet-private, zero license cost, lightweight (a few hundred MB of RAM); natively supports branch protection / PR / N required approvals / status checks, fully covering the L2 gate design. Rejected alternatives: GitHub native gates (simpler if cloud is acceptable), GitLab (too heavy).
- **Deployment package**: `infra/gitea/`
- **Trigger**: B1 — a second committing subject appears.
- **Addendum 2026-09-15**: gates upgraded to a cross-platform invariant contract (GitHub / GitLab / Gitea consistent), see D10 (`20260915-multi-platform-quality-gates.md`) and `docs/solution/quality-gates.md`. Gitea remains the self-host default but is no longer the only option.

## D4 Agent sandbox & credential-proxy push: enable on demand

- **Decision**: in the local stage the agent commits directly to the on-machine repo — no sandbox/proxy; any scenario where the agent touches a remote uses a fine-grained least-privilege token (single repo, write-only), never the primary account credential.
- **Rationale**: "sandbox push" is a derivative need of "agent isolated + authoritative repo outside the boundary"; in the local stage that need doesn't exist.
- **Trigger**: B3 — the agent moves into an isolated container, or multiple parallel agents are needed.

## D5 DR is covered by the remote; no separate build-out

- **Decision**: no standalone backup system; the backup window = push frequency — `git push` is attached to the closing step of the single-feature loop (per feature / daily).
- **Rationale**: the GitHub remote (baize) is already a full off-site copy; all current content lives inside git. The only state outside git (the Gitea data volume: review records, issues, accounts) doesn't exist yet.
- **Change condition**: once B1 is enabled, the `gitea-data` volume enters backup scope (B4).
