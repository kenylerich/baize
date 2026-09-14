# Domain Adapter Card: <domain-name>
> status: Active — authoritative English template. Chinese translation: [adapter-card-template.zh.md](./adapter-card-template.zh.md)

- Tier: T1/T2/T3/T4 (criteria in [Implementation Guide 2.4](../solution/vibe-coding-harness-plan.md))

## Q1 Build → scripts/build.sh

- Command: …
- Success check: exit code 0
- Do error messages contain fix instructions: yes/no (should be yes)

## Q2 Run → scripts/run.sh

- Mode: headless / emulator / real device
- Dependent services: …
- Readiness check (smoke): …

## Q3 Verify → scripts/verify.sh

- Layers: unit / integration / e2e / static
- Key assertions: …
- Performance/size budgets: …

## Q4 Observe → scripts/observe.sh

- Eyes (visual evidence): screenshots / DOM / widget tree / serial / waveforms
- Ears (log evidence): log locations and format

## Q5 Isolation

- Environment: container / VM / emulator / device lock
- Restore method & time: …
- Resource conflict points: … (ports / devices / shared files)

## Domain iron laws (mirror into the target repo's docs/architecture.md)

- …

## Known pitfalls (continuously appended)

- …
