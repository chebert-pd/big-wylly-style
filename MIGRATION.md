# Component Metadata Schema Migration

Tracks the planned schema migration for `packages/ui/src/components/**/*.metadata.json`. **Not in flight.** This document scopes the work so it can be sequenced and reviewed before a migration branch opens.

The migration was triggered by the `ai-component-metadata` skill rework on branch `rework-skills`, where authoring real metadata exposed several long-standing schema-vs-CVA mismatches. Rather than fix them ad-hoc per file, we batch them into one migration.

## Scope

Six work items. The first three are coordinated renames; the last three are content audits that happen because we'll be touching every file anyway.

### 1. Rename `variants.visual` → `variants.variant`

The metadata key is `visual`, the CVA/TS prop name is `variant`. Every reader of the schema asks why they don't match. Rename the key to match the prop.

Files touched:
- `packages/ui/src/cli/metadata-loader.ts` (parser)
- `packages/ui/src/cli/metadata-drift.ts` (drift checker)
- `packages/ui/src/cli/rules.ts` (uses the loader's index — internal symbol rename only, no external surface change)
- All 72 `packages/ui/src/components/**/*.metadata.json` files
- `.claude/skills/ai-component-metadata/SKILL.md`
- `.claude/skills/ai-ds-composer/SKILL.md`
- `packages/ui/.claude/skills/governance-auditor/SKILL.md`

### 2. Convert `forbidden: ["lg"]` → `narrowedOut: [{ value, reason }]`

Carry the narrowing reason inline with the value. Today the reason lives in a parallel `antiPatterns` entry that has to be cross-referenced manually. After migration, the drift checker and the anti-pattern surface read from one authoritative record.

Files touched: same as item 1 (loader + drift + rules.ts + 72 metadata files + 3 SKILL.md files).

### 3. Rename `variants.size.options` → `variants.size.allowed`

Consistency with `variants.variant.allowed` after item 1.

Files touched: same as item 1.

### 4. Recategorize all 72 components against the six-category enum

Existing files use `"atoms" | "molecules" | "organisms"`. The new enum is functional-role-based:

| Category | Criteria |
|---|---|
| **primitives** | Base interactive elements (Button, Input, Checkbox, Switch, Radio). |
| **forms** | Composed form patterns (Field, FieldGroup, FieldSet, FormControl). |
| **display** | Non-interactive presentation surfaces (Card, Badge, Avatar, Alert). |
| **navigation** | Wayfinding (Breadcrumb, Pagination, Header, Sheet, Sidebar, Tabs). |
| **data** | Data-dense components (Table, DataTable, Timeline, KPI surfaces). |
| **patterns** | Full composed sections (Hero, Footer, PageLayout). |

Files touched: 72 metadata files; example sections in 3 SKILL.md files.

### 5. Drop dead fields surfaced during the audit

While each file is open:
- Remove `aiHints.priority` from every file (no current consumer; documented in `ai-component-metadata` SKILL.md).
- Remove `composition.asChild` string field; if the component supports `asChild`, document it in `props[]` like any other prop.
- Audit for anything else inert.

Files touched: 72 metadata files.

### 6. Run `--check-drift` across the whole package

Since we're already touching every file, validate TSX-vs-metadata alignment everywhere. Resolve any pre-existing drift before the migration PR lands. The drift checker is now `forbidden`-aware (will become `narrowedOut`-aware after item 2), so it's a clean signal.

## Sequencing

Recommended PR breakdown to avoid one giant unreviewable diff:

1. **Loader + drift + rules.ts — backwards-compatible accept-both step.**
   The loader reads either `variants.visual.forbidden` OR `variants.variant.narrowedOut[].value`. The drift checker handles both shapes. This unblocks file-by-file migration without breaking the audit on un-migrated files.
2. **Metadata content migration — all 72 files in one PR.**
   Rename keys, convert `forbidden` arrays to `narrowedOut` objects with reasons, swap categories to the new enum, drop dead fields. Validated by `--check-drift` exit-0 plus the full audit suite.
3. **Loader cleanup.**
   Remove the old-shape parse paths from loader + drift. Only the new shape is accepted going forward.
4. **SKILL.md sync.**
   `ai-component-metadata`, `ai-ds-composer`, and `governance-auditor` SKILL.md bodies updated to reference the new shape; examples in body and reference files use the new keys.

Each PR should be reviewable in isolation.

## Not in scope

- Adding new fields beyond `props[]` (already shipped on `rework-skills`).
- Changing what the auditor enforces — this migration is shape-only. Enforcement semantics stay identical.
- Touching gallery documentation pages — those reference the shape too but should follow the SKILL.md updates as a post-migration sweep.

## Pre-migration follow-ups

These must land before the migration starts, or be explicitly accepted as risks:

- **Drift checker has no test coverage.** `packages/ui/src/cli/metadata-drift.ts` was modified on the `rework-skills` branch to be `forbidden`-aware. Verification was manual (`--check-drift` against Pagination + Button, zero findings). The drift check is the gate that signals stale metadata; it deserves unit tests before the migration starts touching every file. Recommended: add `metadata-drift.test.ts` covering (a) forbidden-aware exclusion, (b) error-vs-warning severity, (c) the new "old-shape OR new-shape" parse paths once PR 1 lands. Test fixtures should mirror the table in [.claude/skills/ai-component-metadata/SKILL.md](.claude/skills/ai-component-metadata/SKILL.md) drift triage.

## Open questions

- Should `narrowedOut[]` entries also carry an `alternative` field (parallel to `antiPatterns[].alternative`), or is the `reason` sufficient? Decide before opening PR 1.
- For the recategorization, do we keep a `legacyCategory` field for one release to ease external tooling that might be reading the old values? Default: no, the metadata schema is internal — but flag for review when PR 2 opens.
