# Decision Record: Fingerprints in Version Management (D11)

- Date: 2026-09-15
- Status: Accepted
- Related: D8 (tamper resistance, 20260915-doc-lifecycle-and-bilingual.md), `scripts/doc-fingerprint.sh`, `MANIFEST.sha256`, `.gitattributes`

## D11 Every version is uniquely identified by a set fingerprint, embedded in its tag

- **Decision**: a version is an annotated git tag created through `doc-fingerprint.sh tag <name>`. The script first verifies manifest↔tree consistency, then embeds the **set fingerprint** (SHA256 of `MANIFEST.sha256`, first 12 hex chars) into the tag message. Supporting commands: `id` (print the current set fingerprint), `changes <ref>` (file-level Added/Modified/Removed between any two versions), `verify-ref <ref>` (re-verify integrity of any historical version from its pinned manifest).
- **The version chain**: `tag → commit → MANIFEST.sha256 → per-file SHA256`. Every layer is independently checkable; the set fingerprint uniquely identifies the entire document-set state — two copies with the same 12-hex value are provably identical, no repo access needed.
- **Rationale**: commit hashes identify commits, not content states humans can compare; per-file hashes alone don't answer "which whole-set version is this". A manifest-derived set fingerprint + tag-embedded value makes versions self-describing, verifiable offline, and gives mechanically generated change lists for release notes.
- **Precondition fixed**: fingerprint portability requires byte-identical files on every machine — added `.gitattributes` (`* text=auto eol=lf`) so checkout is LF on all platforms; without it, Windows CRLF conversion would break hash reproduction.
- **Rejected alternatives**: handwritten version numbers in docs (rejected in D7); relying on commit hash alone (opaque, needs repo access); per-version manifest copies in folders (dual sources of truth).
