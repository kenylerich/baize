# Docs Map

> Language: **English (authoritative)** ｜ 中文翻译：[README.zh.md](./README.zh.md)
>
> status: Active (authoritative English version)

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

1. **New members / first contact**: [Implementation Guide](solution/vibe-coding-harness-plan.md) Parts 1–2 → jump to Part 3 for your domain;
2. **Why it was designed this way**: [Research Summary](research/harness-best-practices.md) (all source links and digests);
3. **Hands-on setup**: copy [templates/](templates/README.md) (zh) into the target repo → fill the [adapter card](adapters/README.md) (zh) for your domain → follow Part 4 of the guide.

(Chinese readers: start from [中文文档地图](./README.zh.md); the two main documents have `.zh.md` translations; internal living docs are Chinese-only by default.)

## Maintenance Rules

- **Single source of truth**: templates only change in `templates/`, adapter cards only in `adapters/`; never copy content elsewhere, link instead;
- **Capture discussions**: conclusions land in the repo immediately; "later" items must be registered in [plans/deferred-blueprints.md](plans/deferred-blueprints.md) — full rules in root [AGENTS.md](../AGENTS.md);
- **Bilingual**: English (default filenames) is authoritative; every change to an authoritative doc must be mirrored in the `.zh.md` translation, or the translation marked "behind"; mechanically checked by `scripts/check-docs.mjs`. Coverage status (paired / zh-only) is tracked in [plans/translation-status.md](plans/translation-status.md);
- **Record decisions**: write them into `decisions/` (one file each, named `YYYYMMDD-title.md`, ASCII only);
- **Separate progress from content**: research/solution docs stay stable; progress goes into `plans/`;
- **Link hygiene**: after moving/renaming files, update this map, the root README and all cross-links (the check script backstops this).
