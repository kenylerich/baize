# deepseek-harness-plug

> Language: **English (authoritative)** ｜ 中文翻译：[README.zh.md](./README.zh.md)
>
> status: Active (authoritative English version)

Research and implementation repository for a Vibe Coding development environment (Agent Harness).

## Quick Entry

| What do you want | Where |
|---|---|
| New here / zero background, understand the whole approach | [Docs map](./docs/README.md) → [Implementation Guide](./docs/solution/vibe-coding-harness-plan.md) |
| Design rationale, sources, failure modes | [Research Summary](./docs/research/harness-best-practices.md) |
| Build a new project | Copy the [templates](./docs/templates/README.md) (zh), fill in an [adapter card](./docs/adapters/README.md) (zh) |
| Why was this decided | [Decision records](./docs/decisions/README.md) (zh) |
| Deferred ("later") solutions | [Deferred blueprints register](./docs/plans/deferred-blueprints.md) (zh, scan monthly) |

## Repository Layout

```
deepseek-harness-plug/
├── AGENTS.md        # Working rules for this repo ("capture discussions" — read first)
├── infra/           # Not-yet-enabled infrastructure packages (gitea gates), triggered via register
├── scripts/         # Doc health check (links / bilingual pairing / freshness), runs on commit
└── docs/
    ├── research/    # Research: per-source digests, consensus, antipatterns, references
    ├── solution/    # Implementation guide: zero-background intro + full plan + roadmap
    ├── templates/   # Copyable project templates (single source of truth)
    ├── adapters/    # Per-domain adapter cards
    ├── decisions/   # Decision records (ADR)
    └── plans/       # Roadmap, progress, deferred blueprints (living docs)
```

## Bilingual Note

**English** (default filenames) is the **authoritative** version; Chinese (`*.zh.md`) is a translation. Core entry docs and the two main documents have Chinese translations; internal living docs (decisions, templates, adapter cards, plans) are Chinese-only by default. Rules: [AGENTS.md](./AGENTS.md). Filename rule: ASCII only — never Chinese.

## The Core Formula

```
Full Harness = Universal core (80%: knowledge base / tasks & progress / verification / environment / security — identical for all domains)
             + Domain adapter (20%: each domain answers 5 fixed questions — build / run / verify / observe / sandbox)
```

Adoption order: T1 pure logic (backend/CLI/data) → T2 with UI (web/desktop/mobile/games) → T3 heavy runtime (OS/protocols) → T4 with hardware (embedded three-tier verification pyramid: host unit tests → board simulation → hardware-in-the-loop).
