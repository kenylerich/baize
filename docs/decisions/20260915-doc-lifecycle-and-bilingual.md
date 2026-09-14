# Decision Record: Document Lifecycle & Bilingual Mechanism

- Date: 2026-09-15 (revised same day — see D9 revision note)
- Status: Accepted
- Background: the doc library needs three guarantees — historical versions preserved (archival), fresh/stale marking, tamper resistance — plus bilingual (English/Chinese) documentation. Cross-references: root [AGENTS.md](../../AGENTS.md) (Document Lifecycle / Bilingual Rules), `scripts/check-docs.mjs`.

## D6 Archival uses git tags, not an archive folder

- **Decision**: historical preservation relies entirely on git (every version is permanently kept by nature); a snapshot tag `archive-YYYY-MM` is pushed monthly.
- **Rationale**: moving old docs into an "archive folder" creates two copies of the same document, violating the "one home per knowledge" invariant, and stale copies never follow updates. A tag is a zero-cost snapshot; any old version is one command away.
- **Rejected alternative**: an `archive/` directory with copied old files (dual sources of truth, guaranteed rot).

## D7 Fresh/stale marking uses a status line + git time; handwritten version numbers rejected

- **Decision**: every doc carries a `> status:` header line (`Active` / `Superseded → see xxx` / `Deprecated`); last-modified time is recorded automatically by git.
- **Rationale**: freshness is really "is this still valid" — a validity question, not a time question. Yesterday's doc can be wrong; last year's can be valid; time is a reference only. Hand-maintained version numbers will forget to bump, and a wrong version number is worse than none.
- **Rejected alternative**: hand-written v1.0/v1.2 headers.

## D8 Tamper resistance: three layers — hash chain + remote no-rewrite + automated health check

- **Decision**: layer 1, the git hash chain (automatic; any change leaves a trace); layer 2, remote (GitHub) branch settings **disallow force pushes and history rewrite** (one-time manual configuration); layer 3, `scripts/check-docs.mjs` runs automatically on commits/PRs (link validity, bilingual pairing, translation freshness, stale-doc reminders).
- **Rationale**: the hash chain guarantees "changes are always discoverable"; remote no-rewrite guarantees "locally rewritten history cannot be pushed"; the health check turns "knowledge-base freshness" from a slogan into a mechanical gate (mirrors OpenAI practice: CI validates knowledge-base structure and freshness).
- **Optional enhancements**: SHA256 fingerprint manifest — **enabled 2026-09-15** (`scripts/doc-fingerprint.mjs` + `MANIFEST.sha256`, verified by check-docs.mjs and CI); GPG-signed commits — still deferred (see B8 in the deferred-blueprints register).
- **Execution record (2026-09-15)**: layer 2 is now LIVE — branch protection on `main` enabled via GitHub API (`allow_force_pushes=false`, `allow_deletions=false`, verified via GET). The one-time manual configuration is done; no outstanding human step remains.

## D9 Bilingual: default filenames = authoritative English; `*.zh.md` = Chinese translation

- **Decision**: the default filename (no suffix) is the **authoritative English** document; the Chinese translation carries the `.zh.md` suffix, paired in the same directory. **Filenames are always ASCII — Chinese characters are forbidden.** Chinese is a translation, not the authority; when they conflict, English wins.
- **Scope**: first batch of pairs = root README, docs map, Research Summary, Implementation Guide. Internal living docs (decisions, templates, adapter cards, plans) are Chinese-only by default.
- **Rationale**: user decision (2026-09-15). ASCII filenames keep the repo tooling- and sharing-friendly; English-as-default matches platform conventions (e.g., GitHub renders `README.md`); designating one authority prevents the two language versions drifting apart. Double-writing everything would double maintenance cost, so translation is scoped to docs with actual English readers.
- **Revision note**: an earlier draft of this decision (same day) designated Chinese as authoritative; revised to English-authoritative + ASCII-only filenames before any content depended on the old choice.
- **Rejected alternatives**: `en/`+`zh/` mirror directories (duplicated trees, opaque pairing); Chinese file names; no designated authority.
- **Expansion trigger**: full bilingualization = B9 in the deferred-blueprints register.
