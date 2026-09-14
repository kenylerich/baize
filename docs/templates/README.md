# Engineering Templates
> status: Active — authoritative English version. Chinese translation: [README.zh.md](./README.zh.md)

This directory is the **single source of truth** for all copyable templates: when initializing a new project, copy from here into the target repo and adjust the placeholders. Templates only change in this directory; notify downstream projects after changes.

| File | Copy to target repo | Purpose |
|---|---|---|
| [AGENTS.md](./AGENTS.md) | repo root | Agent entry "map" (≤100 lines, table of contents + iron laws only) |
| [feature-list.json](./feature-list.json) | `tasks/` | Task board: feature checklist, all initially `false`, acceptance = executable command |
| [progress.md](./progress.md) | `tasks/` | Progress file: last session / blockers / next / known pitfalls |
| [main-loop-prompt.md](./main-loop-prompt.md) | session prompt | Single-feature main-loop standard instruction |
| [ci/](./ci/README.md) | target repo CI config | Quality-gate adapters: GitHub / Gitea / GitLab (job name must be `verify`) |

Chinese versions of these templates live beside them as `*.zh.md`.

## Pending (Phase 1 deliverables)

- `scripts/` skeletons: `build`, `run`, `verify`, `observe`, `smoke` — per B10, shipped as bash by default; target repos may reimplement in their own stack (Node/Python/…) keeping the same entry names;
- `docs/` skeleton: `architecture.md`, `quality.md`.

## Usage discipline

- Lessons learned in a project that generalize to all projects must be fed back into this directory's templates;
- Project-specific rules stay in the project — don't push them into these templates.
