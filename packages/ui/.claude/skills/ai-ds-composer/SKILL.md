---
name: ai-ds-composer
version: 2.1.0
description: Pick and compose @big-wylly-style/ui components from existing metadata instead of hand-writing JSX. Use when generating or modifying any UI in this monorepo or in a consumer app (Portal, Wyllolabs, gallery). Walks the .ai/index.toon → component .metadata.json flow, applies allowed/forbidden variant rules, consults props[] for required-prop coverage when present, flags anti-patterns, and hands off to governance-auditor for post-verification. Mode-aware: maintainer (this repo) and consumer (apps that install @big-wylly-style/ui) have different defaults.
---

# Design System Composer

Compose UI from existing `@big-wylly-style/ui` components. Treat the design system as authoritative — don't invent new components, don't hand-roll equivalents, don't suggest "raw HTML when it would work" as a shortcut. If a component exists for the job, use it.

This skill pairs with two others:

- [[ai-component-metadata]] — defines the shape of the `.metadata.json` files you read here.
- [[governance-auditor]] — runs after the code is written and catches token/variant/composition violations you missed.

## When to use this skill

Trigger any time you're about to write or change JSX that renders UI in:

- `packages/ui/src/components/**` (maintainer mode — building the DS itself).
- `apps/gallery/app/**`, or any consumer repo's `app/**`, `src/**`, `components/**` (consumer mode — using the DS).

Skip when the change is purely text/markdown/config — no JSX.

## Detect the mode first

The composer's "what can I edit" answer differs by mode. Detect before suggesting changes.

- **Maintainer mode** — current repo is the design system. Detect by either: `packages/ui/` exists at the workspace root, or the nearest `package.json` reports `name === "@big-wylly-style/ui"`. You can edit component source, metadata, and add new components.
- **Consumer mode** — current repo installs `@big-wylly-style/ui` as a dependency. The DS source lives in `node_modules/@big-wylly-style/ui/` and is read-only. You can only edit consumer code; gaps go back as drift reports (see [[governance-auditor]]'s `--print-issue`).

The mode shapes step 5 ("Flag gaps") — maintainers can fix gaps in place; consumers file them.

## Composition flow

```
1. Read .ai/index.toon           → know what exists
2. Open <name>.metadata.json     → check allowed variants, anti-patterns
3. Match intent → component+variant+props
4. Compose with required slots and partners
5. Flag gaps (don't auto-invent)
6. Hand off to governance-auditor
```

### 1. Start from the index

[packages/ui/src/components/.ai/index.toon](../../../packages/ui/src/components/.ai/index.toon) lists every indexed component with its path and relationships. One canonical index for the whole monorepo — consumer apps read this same file. Read it first — it's cheaper than grepping for components by name and catches synonyms (you might think "Sidebar"; the DS has `Sheet`).

If the index is stale (component added since last index), regenerate it via [[codebase-index]].

### 2. Read the component's metadata

Path:
- Maintainer: `packages/ui/src/components/<name>/<name>.metadata.json`
- Consumer: `node_modules/@big-wylly-style/ui/src/components/<name>/<name>.metadata.json`

The fields you'll consult most:

| Field | What it tells you |
|---|---|
| `props[]` | Public prop surface — `{ name, type, required, description }`. Every prop with `required: true` must appear in any composition you suggest. See "Reading `props[]`" below for graceful-fallback behavior on files that don't have it yet. |
| `variants.visual.allowed` / `.forbidden` | Which variant strings are legal. `forbidden` lists are load-bearing — e.g. `Button.variant="secondary"` is forbidden even though CVA might accept it. |
| `variants.size.options` / `.forbidden` / `.default` | Same idea for size. Use `default` when in doubt. |
| `usage.commonPatterns[].composition` | Drop-in JSX snippets — prefer copying these over generating from scratch. |
| `usage.antiPatterns[]` | Hard "no" cases with the right alternative. Cite the matching anti-pattern when explaining a decision. |
| `composition.nestedComponents` / `.parentConstraints` | Required structural neighbors (e.g. `BreadcrumbItem` must live inside `BreadcrumbList`). |
| `rules[]` | Plain-language hard rules. Read them. |
| `alternatives[]` | Sibling components to consider when the candidate doesn't fit. |
| `aiHints.context` | Quick "when to use" summary, often with a defaults cheat-sheet. |

### 2a. Reading `props[]`

When the metadata file has a `props[]` array, use it before reaching for `commonPatterns`. For each `prop` with `required: true`:

- The composition you suggest **must** set that prop. If you can't supply a sensible value from the user's intent, ask the user — don't omit it silently.
- The `type` field is documentation, not parsed — use it to pick an appropriate literal/value (e.g. `boolean` → `true`/`false`, `string` → quoted value, `"a" | "b"` → one of the listed literals).
- The `description` tells you what the prop controls. Cite it in "Why this choice" when a non-obvious value is set.

**Graceful fallback:** the 72 existing metadata files don't all carry `props[]` yet (the field is new this branch). When `props[]` is absent or empty:

- Don't error, don't warn the user, don't ask "should this have props?" — that's noise.
- Fall back to the previous behavior: read `usage.commonPatterns[].composition` and treat the snippet as your source of truth for which props to set.
- The composer remains fully functional on legacy metadata; `props[]` is an *additional* signal when present.

Cite `props[]` content in "Why this choice" when the required-prop value is non-obvious:

> "Set `onPageChange` because `props[]` lists it as required (`type: (page: number) => void`, description: 'Callback fired when the user navigates to a different page')."

### 3. Match intent → variant

Anti-patterns are not suggestions. They're enforced by [[governance-auditor]] via MD-001 / MD-002. A request for "a large primary button" doesn't translate to `<Button variant="primary" size="lg">` if the metadata forbids `lg` — translate the intent (`lg` here means "most prominent") to an allowed value (`size="md"`, reserved for the hero action).

Cite the metadata when explaining the choice:

> "Used `variant="outline"` because `usage.commonPatterns.default-action` says outline is the standard action variant, and the metadata forbids `secondary`."

### 4. Compose with required structure

When a metadata file lists `nestedComponents`, those aren't optional — they're the required structural children. `Breadcrumb` without `BreadcrumbList` is a CO-* violation. Copy `commonPatterns[].composition` whenever one matches the intent; it has the structure baked in.

`asChild` is the standard escape hatch when you need a different element (e.g. Next.js `Link` inside `BreadcrumbLink`).

### 5. Flag gaps — don't invent

If the user's request doesn't map to an existing component, **say so explicitly**. Don't hand-roll a substitute.

- **Maintainer:** propose adding a new component. Note that new components need a TSX, a `<name>.metadata.json`, governance rules wiring, and a gallery page. Don't ship UI in `packages/ui` without metadata — [[governance-auditor]]'s `--check-drift` will catch it.
- **Consumer:** raise the gap. Either:
  - Compose existing components in an unusual way (cite which) and flag the awkwardness.
  - File a drift issue via `npx audit-governance --scope . --print-issue` so the DS team sees the request.

**Never** patch `node_modules/@big-wylly-style/ui/...` to add a missing variant or component; the next install wipes it.

### 6. Verify before declaring done

After writing the JSX, run [[governance-auditor]]:

```bash
# From consumer or maintainer scope
npx audit-governance --scope . --changed-only --base-ref origin/main
```

A 0-violation run is necessary (not sufficient) for "done". The auditor catches what the composer can miss — token leakage, surface/elevation mismatches, page-layout violations, icon naming.

## Hard rules

These override convenience:

1. **Never hardcode UI** that the DS provides. If `Button` exists, don't write a styled `<button>`. If `Sheet` exists, don't write a styled `<aside>`. The DS exists so this never has to be a judgment call.
2. **Forbidden variants are forbidden** even when CVA/TypeScript would let them compile. `variants.*.forbidden` is the canonical list.
3. **Required props are required.** When the metadata's `props[]` lists a prop with `required: true`, every composition you suggest must set that prop with a sensible value. If you can't infer the value from the user's intent, ask — don't omit it.
4. **Defaults beat inventiveness.** When unsure which variant/size to pick, use `default`. Reserve emphatic variants (`primary`, `md`) for the moments the design system actually highlights — usually one per page/section.
5. **One `variant="primary"` per page.** Anti-pattern in Button metadata. The hero action gets it; everything else uses `outline` or `ghost`.
6. **Compose, then audit.** No "good enough, ship it" — run the auditor.

## Working example — "Add a Save button to the settings page"

1. Read `packages/ui/src/components/.ai/index.toon` → confirms `Button` is present at `packages/ui/src/components/button/`.
2. Read `button.metadata.json`:
   - `variants.visual.allowed: ["primary", "destructive", "outline", "ghost", "link"]`, `forbidden: ["secondary"]`.
   - `variants.size.options: ["xs", "sm", "md"]`, `default: "sm"`, `forbidden: ["lg"]`.
   - `usage.commonPatterns.primary-action: "<Button variant=\"primary\">Save Changes</Button>"`.
3. "Save" is a confirmatory primary action on a settings page → use the `primary-action` pattern verbatim.
4. Check: is there another `variant="primary"` already on the page? If yes, downgrade this one to `outline` (anti-pattern: "Multiple primary buttons on one page").
5. Verify: `npx audit-governance --scope . --changed-only`.

Output:

```tsx
import { Button } from "@big-wylly-style/ui";

<Button variant="primary">Save Changes</Button>
```

Justification cited: `commonPatterns.primary-action`; size omitted because `sm` is the default.

## When the metadata is wrong (rare)

Real possibility — metadata can drift from the TS signature. If the variant value you need is in the TS signature but missing from `variants.*.allowed`:

- **Maintainer:** fix the metadata and rebuild. See `--check-drift` in [[governance-auditor]].
- **Consumer:** don't silently use the un-listed value. Either pick an allowed value, or add a justified suppression and file a drift report (`--print-issue`). The MD-* violation is the DS team's signal.

## When in doubt, read the real metadata

This skill body covers the flow. For any concrete question about a specific component — "what variants does Sheet allow?", "what's the right partner for ButtonGroup?" — the answer lives in that component's `.metadata.json`, not in a reference page. Read the file.
