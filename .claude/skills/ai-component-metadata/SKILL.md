---
name: ai-component-metadata
version: 2.1.0
description: Author and maintain <name>.metadata.json files for @big-wylly-style/ui components. Use when adding a new component, changing a component's TS signature (variants/sizes/props), or fixing drift surfaced by audit-governance MD-* / --check-drift. Documents the real metadata schema, the maintainer-only authoring flow, and the consumer drift-report flow for cases where the metadata is wrong.
---

# Component Metadata Author

Hand-author the `.metadata.json` files that document each `@big-wylly-style/ui` component. These files are the contract that [[ai-ds-composer]] reads when picking components and that [[governance-auditor]]'s MD-* rules enforce against consumer code.

Metadata is hand-written JSON (not generated, not TS). Every component in `packages/ui/src/components/<name>/` has a sibling `<name>.metadata.json`.

## When to use this skill

Trigger for any of these:

1. **Adding a new component** to `packages/ui/src/components/` — needs a metadata file alongside the TSX or `--check-drift` will fail.
2. **Changing a component's TS signature** — adding/removing a variant, narrowing a size scale, changing a prop type. Metadata can drift silently from the signature; this is the most common source of MD-001 / MD-002 noise downstream.
3. **Triaging MD-001 / MD-002** in the design system repo when the violation traces to stale metadata (not bad consumer code). See [[governance-auditor]]'s maintainer-mode triage.
4. **Reacting to a drift report** filed by a consumer via `npx audit-governance --print-issue`.

## Mode applies here too

- **Maintainer mode** (this repo, `@big-wylly-style/ui`): edit metadata directly. This skill is mostly for you.
- **Consumer mode** (Portal, Wyllolabs, an app importing `@big-wylly-style/ui`): you **cannot** author metadata. Files in `node_modules/@big-wylly-style/ui/` are read-only. If metadata is wrong from a consumer's perspective, file a drift report (see "Drift triage" below) — don't hand-edit the vendored file.

The CLI auto-detects mode via `package.json.name`. See [[governance-auditor]] for details.

## The schema

A complete metadata file has the following top-level keys. The canonical example is [packages/ui/src/components/button/button.metadata.json](../../../packages/ui/src/components/button/button.metadata.json).

```json
{
  "component":     { "name", "category", "description", "type" },
  "props":         [{ "name", "type", "required", "description" }],
  "usage":         { "useCases[]", "commonPatterns[]", "antiPatterns[]" },
  "variants":      { "visual", "size", "content", "iconOnly", ... },
  "composition":   { "slots", "nestedComponents[]", "commonPartners[]", "parentConstraints[]" },
  "behavior":      { "states[]", "interactions{}", "responsive{}" },
  "accessibility": { "role", "keyboardSupport", "screenReader", "focusManagement", "wcag" },
  "rules":         ["…"],
  "alternatives":  ["…"],
  "aiHints":       { "keywords[]", "context" }
}
```

### What's enforced vs. consumed

| Field | Auditor reads? | Composer reads? | Notes |
|---|:---:|:---:|---|
| `component.name` | ✓ | ✓ | Required. Loader keys the rule index by it. |
| `variants.visual.allowed` / `.forbidden` | ✓ | ✓ | Enforced via MD-001. |
| `variants.size.options` / `.forbidden` | ✓ | ✓ | Enforced via MD-002. Drift checker reads both. |
| `props[]` | — | ✓ | Consumer-skill-consumed (see [[ai-ds-composer]]). Auditor doesn't enforce it today. |
| `usage.commonPatterns[]` | — | ✓ | Composer copies the `composition` snippets verbatim. |
| `usage.antiPatterns[]` | — | ✓ | Composer cites them in "why this choice." |
| `composition.*` | — | ✓ | Structural neighbor info. |
| `rules[]`, `alternatives[]` | — | ✓ | Composer reads when selecting and explaining. |
| `aiHints.{keywords, context}` | — | ✓ | Synonyms + defaults cheat-sheet. |
| `behavior.*`, `accessibility.*` | — | ✓ (context only) | Descriptive surface for the composer. |

> **Known schema-vs-CVA mismatch**: the metadata key is `variants.visual` but the CVA/TS prop is `variant`. Same for `variants.size.options` vs the user-facing concept "allowed sizes." Both are slated for rename in the schema migration tracked in [MIGRATION.md](../../../MIGRATION.md) — don't fix them ad-hoc in individual files.

### Field reference

**`component`**
- `name`: PascalCase, must match the exported component (`Button`, `BreadcrumbItem`).
- `category`: one of the six-category enum below. Reflects functional role, not composition complexity or visual prominence.
- `description`: one sentence, plain English. The "what is this for" line a junior reads first.
- `type`: `"interactive" | "display" | "container" | "input" | "navigation"`.

#### `component.category` enum

Pick the one that best describes the component's primary functional role:

| Category | Criteria |
|---|---|
| **primitives** | Base interactive elements — Button, Input, Checkbox, Switch, Radio, atomic controls that other components build on. |
| **forms** | Composed form patterns and form-control wrappers — Field, FieldGroup, FieldSet, FormControl, anything that orchestrates one or more primitives into a labelled, validated input unit. |
| **display** | Non-interactive presentation surfaces — Card, Badge, Avatar, Alert, Skeleton. Renders information; doesn't change state. |
| **navigation** | Wayfinding — Breadcrumb, Pagination, Header, Sheet, Sidebar, Tabs. Helps the user move between views or sections. |
| **data** | Data-dense components — Table, DataTable, Timeline, KPI surfaces. Designed to render rows/series/structured data. |
| **patterns** | Full composed sections — Hero, Footer, PageLayout. Multi-region templates rather than single-purpose units. |

If a component genuinely spans two categories, pick the one that drives the user's task at hand. Don't invent new categories.

**`props[]`** — array of `{ name, type, required, description }`, one entry per public prop.
- The composer ([[ai-ds-composer]]) reads this and requires that any suggested composition sets every prop where `required: true`.
- Type strings are TS-style (`string`, `number`, `boolean`, `"a" | "b"`, `React.ReactNode`, etc.) — they're documentation, not parsed.
- Variant-style props (variant, size) belong in `variants.*` AND `props[]` — `props[]` documents the prop surface, `variants.*` documents the allowed values.
- Loader does not parse this field. If you find yourself wanting auditor enforcement of required-prop coverage, that's a future loader extension, not a content fix.

**`usage`**
- `useCases[]`: concrete scenarios ("Completing or confirming an action"). Not marketing copy.
- `commonPatterns[]`: `{ name, description, composition }`. The `composition` string is a JSX snippet — [[ai-ds-composer]] copies these verbatim. Keep them runnable. **Set every required prop** (per `props[]`).
- `antiPatterns[]`: `{ scenario, reason, alternative }`. **Load-bearing**: governance-auditor MD-* rules reference these. State the alternative explicitly so the violator knows the fix.

**`variants`**
- `visual.allowed[]`, `visual.forbidden[]`, `visual.semanticMeaning{}`. `forbidden` is enforced; list every value the TS signature accepts but the DS forbids (e.g. Button forbids `"secondary"`).
- `size.options[]`, `size.forbidden[]`, `size.default`, `size.semanticMeaning{}`. Same pattern.
- Component-specific variant blocks (`iconOnly`, `content`, etc.) are free-form.

**`composition`**
- `slots{}`: named child components and what they hold (Breadcrumb's `BreadcrumbList` etc.).
- `nestedComponents[]`: required structural children, in order if relevant.
- `commonPartners[]`: components frequently composed alongside this one.
- `parentConstraints[]`: components this one must live inside.
- `asChild` support is no longer a top-level field. Document it in `props[]` like any other prop (typically `{ name: "asChild", type: "boolean", required: false, description: "..." }`).

**`behavior`** / **`accessibility`** — descriptive, not enforced by the auditor today, but read by [[ai-ds-composer]] for context.

**`rules[]`** — plain-language list of hard rules. Should restate everything important from `antiPatterns` and `variants.forbidden` in one flat list. This is the "things that will get you flagged" list. The composer reads it when explaining a choice.

**`alternatives[]`** — sibling components for "use this instead" suggestions when the picker reaches for the wrong one. The composer reads it.

**`aiHints`**
- `keywords[]`: synonyms a user might say ("trash", "delete", "remove" → all aim at the same Button + destructive variant).
- `context`: 1–3 sentences for an LLM about defaults and gotchas.

(Note: a `priority` field appears in some legacy metadata files. It has no current consumer — neither the auditor nor the composer reads it. New files should omit it. Future cleanup tracked in [MIGRATION.md](../../../MIGRATION.md).)

## Authoring flow (maintainer)

Recommended order when adding or revising a metadata file:

1. **Open the TSX first.** Read the prop types, CVA blocks, and any narrowing imposed by hard rules in the component body. The TS signature is your source of truth for `variants.*.allowed` and the `props[]` array.
2. **Fill `props[]`** with one entry per public prop. Mark `required: true` for props with no default and no acceptable fallback. The composer relies on this to set required props in every composition it suggests.
3. **Decide forbidden values.** If the CVA accepts a variant the DS team has decided to disallow, list it under `forbidden` and add an `antiPatterns` entry. Forbidden ≠ rare; forbidden = will be flagged.
4. **Write `commonPatterns`** for the 3–7 most common compositions. These get copied verbatim by [[ai-ds-composer]] — make sure they compile and set every required prop.
5. **Write `antiPatterns`** with a real `alternative` for each. "Don't do X, do Y" — not "Don't do X" alone.
6. **Fill `aiHints.context`** with the defaults cheat-sheet: which variant is default, which size is default, the one or two rules an LLM most often gets wrong.
7. **Rebuild and audit.** `npm run build --workspace=packages/ui` (the CLI runs from `dist/`), then `npx audit-governance --check-drift` to confirm the metadata matches the signature.
8. **Re-index if the component is new.** A brand-new component (not just an edit) means [[ai-ds-composer]] won't see it until the relationship map regenerates — trigger that per [[codebase-index]]'s "When to (re-)run" guidance. Metadata-only edits to existing components don't shift the index and can skip this step.

## Drift triage

When `--check-drift` (maintainer) or MD-001 / MD-002 (consumer) fires, the question is *which side is wrong*.

| Symptom | Likely cause | Fix |
|---|---|---|
| Metadata lists a value the TSX rejects | Metadata is stale (TSX narrowed) | Remove the value from metadata. |
| TSX accepts a value the metadata omits, and the DS intends to forbid it | Missing `forbidden` entry | Add the value to `variants.*.forbidden` and an `antiPatterns` entry. |
| TSX accepts a value the metadata omits, and the DS intends to allow it | Metadata under-documents | Add the value to `variants.*.allowed`. |
| Consumer using a value not in `allowed`, value would compile, DS intends to allow it | Metadata under-documents | Update metadata; in the meantime advise the consumer to suppress with a justification comment. |
| Consumer using a value not in `allowed`, value would compile, DS intends to forbid it | Real consumer bug | No metadata change; consumer must use an allowed value. |

The `--check-drift` flag walks `packages/ui/src/components/` and reports the first two rows automatically. Run it after every signature change.

## What not to include

- **Don't restate Tailwind classes** in metadata. Visual specifics belong in the TSX + tokens, not in JSON.
- **Don't invent fields** the schema doesn't have. [[ai-ds-composer]] and the auditor only read the keys above; extras are dead weight.
- **Don't write speculative use cases.** If no one is using the component that way today, it's not a use case yet.
- **Don't omit `forbidden`** just because the TSX already enforces it. The list is also a doc surface — readers learn the rule from the metadata, not from CVA internals.

## Starting a new file

Copy [assets/metadata-template.json](assets/metadata-template.json) and fill it in section by section. Compare against [button.metadata.json](../../../packages/ui/src/components/button/button.metadata.json) (the most-populated real example) when a field's expected shape isn't obvious.
