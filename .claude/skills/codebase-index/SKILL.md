---
name: codebase-index
version: 2.1.0
description: Generate and read the .ai/index.toon relationship map used by ai-ds-composer to know what's in @big-wylly-style/ui. Use when adding/renaming/removing components or when relationships look stale (composer picks a non-existent component). Pinned to React/Next.js. Single index lives at packages/ui/src/components/.ai/.
---

# Codebase Index

Generate the `.ai/` relationship map that [[ai-ds-composer]] reads to discover components and their usage. The map is auto-generated TOON files; never hand-edit them.

## What gets indexed

**`packages/ui/src/components/.ai/`** — the design system's component graph. One canonical index for the whole monorepo; consumer apps (gallery, Portal, Wyllolabs) read this same file rather than maintaining their own. Contents:

```
.ai/
├── index.toon                       # Entry point + summary
└── relationships/
    ├── component-usage.toon         # uses / usedBy graph
    ├── dependencies.toon            # npm + utilities + CSS
    └── data-flow.toon               # fetch / query patterns
```

## When to (re-)run

Trigger a regeneration after:

- Adding a new component (`packages/ui/src/components/<name>/<name>.tsx` + metadata).
- Renaming or deleting a component.
- Adding a new app under `apps/`.
- [[ai-ds-composer]] reaches for a component that doesn't exist, or misses one that does — the index is the most likely culprit.

Skip when the change is only a `.metadata.json` body edit, a doc, or a tweak inside an existing component file — the relationship graph doesn't shift.

## How to run

The indexer is a Python script bundled with this skill:

```bash
python .claude/skills/codebase-index/scripts/index_codebase.py packages/ui
```

It auto-detects React from `package.json` and writes TOON output to `packages/ui/src/components/.ai/`. No flags needed for normal use.

If regeneration was triggered by component-file changes (not just metadata edits), follow up with [[governance-auditor]] — token/composition/structural violations need a separate pass.

## How the composer uses it

Reading order at the start of a UI task:

1. **`index.toon`** — overview: total components, what `.metadata.{ts,tsx,json}` files exist, where relationships live.
2. **`relationships/component-usage.toon`** — answer "is there already a Sheet?" or "what consumes Card?" without grepping.
3. **`<name>.metadata.json`** — only when you've narrowed to a candidate (loaded on demand, per [[ai-component-metadata]]).

This load order is documented in the generated `index.toon` under `usage`.

## TOON in this repo

TOON (tabular JSON shorthand) is the output format because it's ~40–60% fewer tokens than equivalent JSON for uniform component arrays — important when the index is in-context for every UI task.

You don't need to write TOON. The indexer generates it. Read it the same way you'd skim a YAML file — fields, lists, nested blocks. The `index.toon` header documents the dialect when you need it.

```toon
components[3]{name,path,type,uses,usedBy}:
Button,packages/ui/src/components/button/button.tsx,atom,[0]:,[2]: Card,Page
Card,packages/ui/src/components/card/card.tsx,molecule,[1]: Button,[1]: Page
...
```

If a downstream tool genuinely needs JSON, re-run with `--format json` — but TOON is the default and what the composer expects.

## What the indexer does NOT do

- Doesn't parse runtime usage — only static imports.
- Doesn't follow dynamic imports.
- Doesn't resolve path aliases beyond the basic ones in `tsconfig.json`.
- Doesn't replace `.metadata.json` files — relationships are auto, metadata is hand-written by [[ai-component-metadata]].

If the composer hits a gap because of one of these, file it and skip the index.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| New component missing from `index.toon` | Index is stale | Re-run the script. |
| Component shows in `index.toon` but composer can't find it | Wrong scope passed to indexer | Pass `packages/ui` (not the repo root) when indexing the DS. |
| `usedBy` is empty for a component you know is used | Consumer uses a path alias the indexer didn't resolve | Verify the import isn't using a deep alias; consider opening an issue against the script. |
| TOON file looks garbled in your editor | Editor doesn't know the format | It's plain text — open as `.txt` or `.yaml` for syntax-ish highlighting. |

## Don't

- Don't commit hand-edits to `.toon` files — they'll be overwritten on the next index and the diff will be confusing in PRs.
- Don't index `node_modules` or build output.
- Don't ship a PR that adds a component without re-running the index for the package — [[ai-ds-composer]] will silently miss it in the next session.
