---
name: governance-auditor
version: 1.0.0
description: Run and interpret the @chebert-pd/ui governance auditor (audit-governance CLI) after editing components, metadata, or pages. Use after editing any *.tsx in packages/wyllo-ui/src/components/, any *.metadata.json, governance-rules.json, app/**/page.tsx, or before declaring component work complete. Teaches the rule taxonomy (FG/BD/SC/TY/PL/LC/IC/MD), the metadata-vs-code drift triage, and when a violation is a real bug versus a stale metadata file.
---

# Governance Auditor

Run and interpret the design-system governance auditor. Pairs with the `ai-ds-composer` skill — that one front-loads metadata when *choosing* a component; this one verifies the choice still respects the rules after the code is written.

## When to use this skill

Invoke after any of these:

1. **Editing a component** in `packages/wyllo-ui/src/components/**/*.tsx` — could introduce token-level violations (FG/BD/SC/TY/PL/EL).
2. **Editing component metadata** in `packages/wyllo-ui/src/components/**/*.metadata.json` — changes the contract that MD-001 / MD-002 enforce against consumers.
3. **Editing `governance-rules.json`** — verify the rule still parses and any newly-detected violations are intentional.
4. **Editing a Next.js page** in `apps/**/app/**/page.tsx` — could introduce LC-002 / LC-003 violations.
5. **Editing icon usage** anywhere — could introduce IC-002 / IC-003 / IC-004 / IC-005 violations.
6. **Before declaring component work complete** — same idea as running tests before marking a task done.

Skip when:
- The change is purely a doc/markdown edit.
- The change is in a script, config file, or non-UI code.

## How to run

The CLI is `audit-governance`, shipped with `@chebert-pd/ui`. Two invocation patterns:

**From the design-system package itself**:
```bash
npm run audit --workspace=packages/wyllo-ui
```

**From a consumer app** (or any scope):
```bash
cd apps/gallery
npx audit-governance --scope . --changed-only --base-ref origin/main
```

Useful flags:
- `--scope <path>` — directory to audit (default: cwd)
- `--all` — scan files even if they don't import `@chebert-pd/ui` (rare; skips the DS-import filter)
- `--changed-only --base-ref <ref>` — only audit files changed against `<ref>`. CI uses this so existing tech debt isn't blocking.
- `--mode ds | consumer` — `ds` for the design-system package itself; `consumer` for apps. Default is consumer.
- `--format json` — machine-readable output for scripted analysis.

The CLI exits non-zero on violations.

## Interpretation guide

The full rule catalog is in `packages/wyllo-ui/governance-rules.json`. Read that file when you need the exact pattern, reason, and fix for any rule ID. Below is a triage shortcut for the rules that need extra reasoning beyond their built-in fix hint.

### Rule families

- **FG-** foreground hierarchy (no `text-muted-foreground` on h1/h2)
- **BD-** border hierarchy (no `ring-*` outside focus state)
- **EL-** elevation coherence (no heavy shadows on small components; no raw shadow primitives)
- **SC-** semantic colors (use `-foreground` for text on tinted surfaces; don't mix schemes)
- **TY-** typography (numeric weights only; no arbitrary font sizes; sentence case; preset classes)
- **PL-** primitive leakage (no raw palette tokens, hardcoded colors, or Tailwind palette classes)
- **LC-** layout composition (PageLayout structure rules — page files must wrap Header in PageLayout)
- **IC-** iconography (overflow uses `MoreHorizontal`; `Trash` not `Trash2`; icon-only Buttons need `iconOnly` + `aria-label`; lucide-react only)
- **MD-** metadata consistency (component usage matches its declared variants/sizes)

### Triage: metadata-derived rules (MD-001, MD-002)

When MD-001 or MD-002 fires, **don't immediately edit the consumer**. The metadata might be stale.

```
MD-002: <Card size="xs"> — not in allowed sizes [default, sm]
```

Steps:

1. Read the component's TypeScript signature (`packages/wyllo-ui/src/components/<name>/<name>.tsx`).
2. If the signature accepts the value (e.g. `size?: "default" | "sm" | "xs"`), the metadata is incomplete — fix the metadata, not the consumer.
3. If the signature rejects the value, it's a real consumer bug — fix the JSX.
4. If the signature accepts it but the design system intentionally narrows the documented set (e.g. Button accepts `lg` in CVA but it's forbidden by hard rules), the consumer is wrong — replace with an allowed value.

### Triage: layout-composition rules (LC-002, LC-003)

These fire on `app/**/page.tsx` files. The fix is almost always the same: wrap the page root in `<PageLayout variant="..." size="...">`. Use `PageLayout.Body` for stack content and `PageLayout.Main` + `PageLayout.Aside` for two-column. See the `/gallery/layouts` page for live examples.

### Triage: icon-only Buttons (IC-004)

When IC-004 fires, the missing prop tells you the fix:
- Missing `iconOnly` — add the prop. If you find `size="icon"` instead, that's the deprecated pattern; remove `size="icon"` and add `iconOnly`.
- Missing `aria-label` — add a value. If the Button is wrapped in a `TooltipTrigger`, the tooltip text is usually the right `aria-label` value (the tooltip provides visible labels but the button still needs an accessible name for keyboard users when the tooltip is dismissed).

### Pre-existing violations and `--changed-only`

CI runs the auditor with `--changed-only` so PRs aren't blocked by tech debt in unrelated files. Local dev runs without that flag by default and will surface every existing violation. When you see a violation in a file you didn't edit, ignore it unless the user asked for cleanup — it's not in scope.

## Workflow gating

Don't declare component work complete until one of:

- The auditor returns 0 violations on the changed scope.
- Every remaining violation has a written justification (in a code comment or PR description) explaining why suppressing it is correct.

A passing audit is a **necessary** but not sufficient condition for "done" — the auditor catches token-level and metadata-level issues, not semantic correctness or visual regressions.

## Adding a new rule

When the user asks for a new governance rule:

1. Add the rule entry to `governance-rules.json` (id, pattern, reason, fix). This documents intent for AI consumers regardless of whether the auditor enforces it.
2. Decide if it's enforceable at audit time:
   - **Line-level regex** (most icon, primitive-leakage, and typography rules) — implement directly in `packages/wyllo-ui/src/cli/rules.ts`.
   - **File-level invariant** (LC-002 / LC-003 — "this file uses Header but no PageLayout") — use `ctx.fileContent` for whole-file lookups inside a per-line check.
   - **Metadata-derived** (MD-*) — extend the constraints extracted by `metadata-loader.ts` and add a check that consults the index.
   - **Structural / semantic** (parent-child constraints, role inference) — usually documentation-only; needs an AST and is out of scope for the line-based auditor.
3. Add the rule ID to `RULE_META` in `rules.ts` with the right `appliesTo` and severity.
4. Wire the check into either `CHECKERS` or `IMPORT_CHECKERS` (the latter for rules that need to inspect import lines).
5. Test with a deliberately-violating fixture (a temporary `app/audit-test/page.tsx` that exercises both violation cases and compliant cases).
6. Verify against the real codebase and triage any pre-existing matches.
7. Rebuild: `npm run build --workspace=packages/wyllo-ui`. The CLI runs from `dist/`, so source-only changes don't take effect until rebuild.

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
