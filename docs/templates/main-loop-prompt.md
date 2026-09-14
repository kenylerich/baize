# Single-Feature Main-Loop Standard Prompt
> status: Active — authoritative English template. Chinese translation: [main-loop-prompt.zh.md](./main-loop-prompt.zh.md)

> Usage: paste into each execution session after the warm-up ritual (pwd → git log -20 → read progress.md → read feature-list.json → smoke.sh).

```text
Read tasks/progress.md and tasks/feature-list.json, and pick the highest-priority unfinished feature.
Implement it under the constraints of docs/plans and docs/architecture.md.
Done criteria: scripts/verify-feature.sh <id> passes.
After it passes: update feature-list.json status, update progress.md, and commit (state what and why).
One feature at a time. If anything is ambiguous, list the questions and wait for answers.
```
