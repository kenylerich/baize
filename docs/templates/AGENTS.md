# Repository Map
> status: Active — authoritative English template. Chinese translation: [AGENTS.zh.md](./AGENTS.zh.md)

- Architecture & layering rules: docs/architecture.md (iron law: UI must not access Repo directly)
- Quality scores: docs/quality.md
- Current plans: docs/plans/active/…; completed: docs/plans/done/
- Feature list: tasks/feature-list.json; progress: tasks/progress.md

# Working Protocol
1. Session start: pwd → git log -20 → read progress.md → read feature-list.json → smoke.sh
2. One feature at a time; mark done only after verify-feature.sh passes
3. After each step: update progress.md + descriptive commit
4. Stuck for 30 minutes: write the blocker into progress.md, skip or ask for help — never grind
5. Ambiguity: ask first
6. New knowledge goes into the matching docs/ file; this file only holds pointers

# Definition of Done (all conditions for one requirement)
1. One feature at a time; write the acceptance verification (verify-feature) before implementing
2. scripts/verify.sh passes (end-to-end level, not just unit tests)
3. tasks/feature-list.json ticked + tasks/progress.md updated
4. Related docs synced (this file only gains pointers, body goes into docs/)
5. commit states "what and why"; PR links the issue (Closes #N)
6. Line-by-line self-check against acceptance criteria passes (becomes 1 Approve once a second committing subject exists)

# Invariants (violations fail CI)
- Data shapes must be parsed explicitly at boundaries
- Structured logging; no YOLO-style data probing
- Files < 400 lines
