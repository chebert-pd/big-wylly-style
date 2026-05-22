---
name: governance-auditor
version: 1.2.0
description: Run and interpret the @big-wylly-style/ui governance auditor (audit-governance CLI) after editing components, metadata, or pages. Use after editing any *.tsx in packages/ui/src/components/, any *.metadata.json, governance-rules.json, app/**/page.tsx, or before declaring component work complete. Teaches the 12-family rule taxonomy (FG/BD/SF/EL/SC/TY/PL/LC/IC/MD/CO/CS), the metadata-vs-code drift triage with separate maintainer/consumer flows, when a violation is a real bug versus a stale metadata file, and how to file drift reports via --print-issue.
---

# Governance Auditor

Run and interpret the design-system governance auditor. Pairs with [[ai-ds-composer]] — that one front-loads metadata when *choosing* a component; this one closes the loop by verifying the choice still respects the rules after the code is written. The composer's workflow ends with an invocation of this auditor.

## When to use this skill

Invoke after any of these:

1. **Editing a component** in `packages/ui/src/components/**/*.tsx` — could introduce token-level violations (FG/BD/SC/TY/PL/EL).
2. **Editing component metadata** in `packages/ui/src/components/**/*.metadata.json` — changes the contract that MD-001 / MD-002 enforce against consumers.
3. **Editing `governance-rules.json`** — verify the rule still parses and any newly-detected violations are intentional.
4. **Editing a Next.js page** in `apps/**/app/**/page.tsx` — could introduce LC-002 / LC-003 violations.
5. **Editing icon usage** anywhere — could introduce IC-002 / IC-003 / IC-004 / IC-005 violations.
6. **Before declaring component work complete** — same idea as running tests before marking a task done. If [[ai-ds-composer]] just produced the JSX, this is the post-verification step it hands off to.

Skip when:
- The change is purely a doc/markdown edit.
- The change is in a script, config file, or non-UI code.

## Detect the mode first

Before running the auditor, identify which side of the design-system boundary you're on. The triage flow for `MD-001` / `MD-002` and "the component implementation is wrong" cases differs.

- **Maintainer mode** — current repo *is* the design system. Detect by either: `packages/ui/` exists at the workspace root, or the nearest `package.json` reports `name === "@big-wylly-style/ui"`. Maintainers can edit metadata and component source directly.
- **Consumer mode** — current repo *uses* `@big-wylly-style/ui` as an installed dependency. The DS source lives in `node_modules/@big-wylly-style/ui/` and is effectively read-only. Consumers can edit only their own code and must report drift back to the DS team rather than patching node_modules.

The CLI auto-detects via `package.json.name`, but you can override with `--mode ds` or `--mode consumer`. Output (especially MD fix text) adapts to the mode.

## How to run

The CLI is `audit-governance`, shipped with `@big-wylly-style/ui`. Two invocation patterns:

**From the design-system package itself**:
```bash
npm run audit --workspace=packages/ui
```

**From a consumer app** (or any scope):
```bash
cd apps/gallery
npx audit-governance --scope . --changed-only --base-ref origin/main
```

Useful flags:
- `--scope <path>` — directory to audit (default: cwd)
- `--all` — scan files even if they don't import `@big-wylly-style/ui` (rare; skips the DS-import filter)
- `--changed-only --base-ref <ref>` — only audit files changed against `<ref>`. CI uses this so existing tech debt isn't blocking.
- `--mode ds | consumer` — `ds` for the design-system package itself; `consumer` for apps. Default is consumer.
- `--format json` — machine-readable output for scripted analysis.

The CLI exits non-zero on violations.

## Interpretation guide

The full rule catalog is in `packages/ui/governance-rules.json`. Read that file when you need the exact pattern, reason, and fix for any rule ID. Below is a triage shortcut for the rules that need extra reasoning beyond their built-in fix hint.

### Rule families

12 families enforced. Full pattern/reason/fix for each rule lives in [packages/ui/governance-rules.json](../../../governance-rules.json).

- **FG-** foreground hierarchy — no `text-muted-foreground` on h1/h2.
- **BD-** border hierarchy — no `ring-*` outside focus state.
- **SF-** surface hierarchy — surfaces use the correct background tier; no raw `bg-white` / `bg-black`.
- **EL-** elevation coherence — no heavy shadows on small components; no raw shadow primitives.
- **SC-** semantic colors — use `-foreground` for text on tinted surfaces; don't mix schemes.
- **TY-** typography — numeric weights only; no arbitrary font sizes; sentence case; preset classes.
- **PL-** primitive leakage — no raw palette tokens, hardcoded colors, or Tailwind palette classes.
- **LC-** layout composition — PageLayout structure rules; page files must wrap Header in PageLayout.
- **IC-** iconography — overflow uses `MoreHorizontal`; `Trash` not `Trash2`; icon-only Buttons need `iconOnly` + `aria-label`; lucide-react only.
- **MD-** metadata consistency — component usage matches its declared variants/sizes.
- **CO-** composition — slot/partner/parent constraints from metadata (e.g. BreadcrumbItem must live inside BreadcrumbList).
- **CS-** code style — repo-wide TS/JSX hygiene that cuts across the other families.

### Triage: metadata-derived rules (MD-001, MD-002)

The triage flow depends on whether you're in maintainer or consumer mode (see "Detect the mode first" above). The CLI's mode-aware fix text already nudges in the right direction; this section explains the reasoning so you can extend or override when the auto-detection is wrong.

#### Maintainer mode

When MD-001 or MD-002 fires inside the design-system repo, **don't immediately edit the consumer code**. The metadata might be stale.

```
MD-002: <Card size="xs"> — not in allowed sizes [default, sm]
```

Steps:

1. Read the component's TypeScript signature at `packages/ui/src/components/<name>/<name>.tsx`.
2. If the signature accepts the value (e.g. `size?: "default" | "sm" | "xs"`), the metadata is incomplete — fix the metadata, not the consumer. Metadata regeneration is owned by [[ai-component-metadata]]; consult that skill's drift triage table for which side to update.
3. If the signature rejects the value, it's a real consumer bug — fix the JSX.
4. If the signature accepts it but the design system intentionally narrows the documented set (e.g. Button accepts `lg` in CVA but it's forbidden by hard rules), the consumer is wrong — replace with an allowed value.

#### Consumer mode

When MD-001 or MD-002 fires inside a consumer app, you **cannot** edit the metadata or component source — they live in `node_modules/@big-wylly-style/ui/` and any change there gets blown away on the next install. The triage shifts:

1. Look up the component's metadata in `node_modules/@big-wylly-style/ui/src/components/<name>/<name>.metadata.json` to confirm what's allowed. (You can read it; you can't edit it.)
2. **Default action:** change the consumer prop value to one of the allowed values listed in the violation message. This is correct ~95% of the time.
3. **If you genuinely believe the metadata is wrong** (e.g. the component's TS signature in `node_modules` accepts the value, suggesting the metadata drifted in a release):
   - Add a justified suppression: `// govern:disable-next-line MD-002 -- waiting on @big-wylly-style/ui release; see issue #N`
   - File a drift issue with the design-system team. Use `npx audit-governance --scope . --print-issue` to generate a markdown body that lists the violations and can be pasted directly into a GitHub issue.
4. **Never** patch `node_modules/@big-wylly-style/ui/...` or hand-edit a vendored copy of the metadata to silence the rule. The next `npm install` will undo it and the team will lose the signal.

### Triage: layout-composition rules (LC-002, LC-003)

These fire on `app/**/page.tsx` files. The fix is almost always the same: wrap the page root in `<PageLayout variant="..." size="...">`. Use `PageLayout.Body` for stack content and `PageLayout.Main` + `PageLayout.Aside` for two-column. See the `/gallery/layouts` page for live examples.

### Triage: icon-only Buttons (IC-004)

When IC-004 fires, the missing prop tells you the fix:
- Missing `iconOnly` — add the prop. If you find `size="icon"` instead, that's the deprecated pattern; remove `size="icon"` and add `iconOnly`.
- Missing `aria-label` — add a value. If the Button is wrapped in a `TooltipTrigger`, the tooltip text is usually the right `aria-label` value (the tooltip provides visible labels but the button still needs an accessible name for keyboard users when the tooltip is dismissed).

### Pre-existing violations and `--changed-only`

CI runs the auditor with `--changed-only` so PRs aren't blocked by tech debt in unrelated files. Local dev runs without that flag by default and will surface every existing violation. When you see a violation in a file you didn't edit, ignore it unless the user asked for cleanup — it's not in scope.

## Filing drift reports back to the DS team (consumer mode)

When you decide that a violation indicates real drift (the metadata is stale, or a rule is wrong for this component), the consumer can't fix it directly — but they can file a structured report. Use the `--print-issue` flag:

```bash
npx audit-governance --scope . --print-issue > drift-report.md
# Or pipe straight to gh:
npx audit-governance --scope . --print-issue | gh issue create \
  --repo chebert-pd/big-wylly-style \
  --title "Possible governance/metadata drift in @big-wylly-style/ui" \
  --body-file -
```

The flag emits a markdown body grouped by rule, with file/line examples. Edit before submitting if useful.

## Drift between metadata and TS signature (maintainer-only)

When a maintainer edits a component's TSX (changing the size scale, adding a variant, removing one), the metadata can drift silently — until a consumer trips MD-001 or MD-002. To catch drift proactively, run:

```bash
npx audit-governance --check-drift
```

This:
- Walks every component in `packages/ui/src/components/`.
- Parses each TSX for the size/variant prop type (or, as fallback, the CVA variant keys).
- Compares against the corresponding `*.metadata.json`.
- Reports two finding types:
  - **Error** — metadata declares a value the TS signature doesn't accept (broken metadata; the prop value would never compile).
  - **Warning** — TS signature accepts values the metadata doesn't list (could be intentional narrowing, like Button forbidding `lg`, or accidental drift).

Run after editing a component's prop type or its metadata. The check exits non-zero only on errors, so it's safe to wire into CI alongside the regular audit.

## Workflow gating

Don't declare component work complete until one of:

- The auditor returns 0 violations on the changed scope.
- Every remaining violation has a written justification (in a code comment or PR description) explaining why suppressing it is correct.

A passing audit is a **necessary** but not sufficient condition for "done" — the auditor catches token-level and metadata-level issues, not semantic correctness or visual regressions.

## Adding a new rule

When the user asks for a new governance rule:

1. Add the rule entry to `governance-rules.json` (id, pattern, reason, fix). This documents intent for AI consumers regardless of whether the auditor enforces it.
2. Decide if it's enforceable at audit time:
   - **Line-level regex** (most icon, primitive-leakage, and typography rules) — implement directly in `packages/ui/src/cli/rules.ts`.
   - **File-level invariant** (LC-002 / LC-003 — "this file uses Header but no PageLayout") — use `ctx.fileContent` for whole-file lookups inside a per-line check.
   - **Metadata-derived** (MD-*) — extend the constraints extracted by `metadata-loader.ts` and add a check that consults the index.
   - **Structural / semantic** (parent-child constraints, role inference) — usually documentation-only; needs an AST and is out of scope for the line-based auditor.
3. Add the rule ID to `RULE_META` in `rules.ts` with the right `appliesTo` and severity.
4. Wire the check into either `CHECKERS` or `IMPORT_CHECKERS` (the latter for rules that need to inspect import lines).
5. Test with a deliberately-violating fixture (a temporary `app/audit-test/page.tsx` that exercises both violation cases and compliant cases).
6. Verify against the real codebase and triage any pre-existing matches.
7. Rebuild: `npm run build --workspace=packages/ui`. The CLI runs from `dist/`, so source-only changes don't take effect until rebuild.

If the new rule depends on relationship/structural data (component usage, partner constraints, import-graph queries) rather than a line-level regex, regenerate the index via [[codebase-index]] before testing — the rule's inputs may need to refresh too.

## Performance notes

- Per-line cost is small — most checks pre-filter on cheap substring tests before running regex.
- The metadata index is loaded once at audit startup and cached.
- File-content stitching (used by IC-004 and the LC checks) is bounded — the helpers cap their lookahead.
- CI's `--changed-only` mode keeps audit time proportional to PR size, not codebase size.

## Don't

- Don't bypass the audit by deleting rules or adding broad suppressions to fix tech debt; either fix the code, narrow the rule, or add a justified per-line suppression comment.
- Don't run the auditor with `--all` in CI configurations that test PRs — it'll surface the entire codebase's tech debt and block every PR. Use `--changed-only` for PR gates.
- Don't edit the dist-bundled CLI directly. Always edit `src/cli/*.ts` and rebuild.
- Don't skip the triage step on MD-001 / MD-002 — fixing the consumer when the metadata is wrong creates churn for everyone.
