# Decision Records (ADR)
> status: Active — authoritative English version. Chinese translation: [README.zh.md](./README.zh.md)

Records "why it was designed this way": the solution docs describe the what, this directory records the why.

## Conventions

- One decision per file, named `YYYYMMDD-title.md` (ASCII only);
- Fields: **Background / Alternatives / Decision / Consequences / Status** (proposed | accepted | deprecated);
- When a decision is overturned, keep the file and mark it deprecated with a pointer to the replacement — never rewrite history silently.

## Index

| Date | Decision | Record |
|---|---|---|
| 2026-09-14 | Infrastructure boundaries: local git / remote / gates / sandbox / DR (D1–D5) | [20260914-infra-boundary-decisions.md](./20260914-infra-boundary-decisions.md) |
| 2026-09-15 | Document lifecycle & bilingual mechanism (D6–D9) | [20260915-doc-lifecycle-and-bilingual.md](./20260915-doc-lifecycle-and-bilingual.md) |
| 2026-09-15 | Multi-platform quality gates — GitHub / GitLab / Gitea (D10) | [20260915-multi-platform-quality-gates.md](./20260915-multi-platform-quality-gates.md) |
| 2026-09-15 | Fingerprints in version management (D11) | [20260915-version-fingerprints.md](./20260915-version-fingerprints.md) |
