# Docs Map

> Language / 语言：English ｜ **中文（权威版本 / authoritative）**：[README.md](./README.md)
>
> status: Active — English translation of README.md

This directory follows two principles: **single source of truth** (every piece of knowledge has exactly one home) and **map + progressive disclosure** (short stable entries, details layered below). This file is navigation only.

## Layout

```
docs/
├── research/     # Research: per-source digests, 8 consensus principles, failure modes, references
├── solution/     # Implementation guide: zero-background intro + full plan + phased roadmap
├── templates/    # Copyable templates (AGENTS.md, task board, progress file, main-loop prompt…)
├── adapters/     # Domain adapter cards: one card per domain (build/run/verify/observe/sandbox)
├── decisions/    # Decision records (ADR): why it was designed this way
└── plans/        # Roadmap, progress, deferred blueprints (deferred-blueprints.md): living docs
```

## Reading Paths

1. **New members / first contact**: [Implementation Guide (EN)](solution/vibe-coding-harness-plan.en.md) Parts 1–2 → jump to Part 3 for your domain;
2. **Why it was designed this way**: [Research Summary (EN)](research/harness-best-practices.en.md) (all source links and digests);
3. **Hands-on setup**: copy [templates/](templates/README.md) (zh) into the target repo → fill the [adapter card](adapters/README.md) (zh) for your domain → follow Part 4 of the guide.

(Chinese readers: start from [中文文档地图](./README.md); internal living docs are Chinese-only by default.)

## Maintenance Rules

- **Single source of truth**: templates only change in `templates/`, adapter cards only in `adapters/`; never copy content elsewhere, link instead;
- **Capture discussions**: conclusions land in the repo immediately; "later" items must be registered in [plans/deferred-blueprints.md](plans/deferred-blueprints.md) — full rules in root [AGENTS.md](../AGENTS.md);
- **Bilingual**: Chinese is authoritative; every change to a Chinese source doc must be mirrored in the English version, or the EN doc marked "behind"; mechanically checked by `scripts/check-docs.sh`;
- **Record decisions**: write them into `decisions/` (one file each, named `YYYYMMDD-title.md`);
- **Separate progress from content**: research/solution docs stay stable; progress goes into `plans/`;
- **Link hygiene**: after moving/renaming files, update this map, the root README and all cross-links (the check script backstops this).
