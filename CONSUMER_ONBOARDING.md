# Consumer Onboarding — `@big-wylly-style/ui`

First-time integration guide for consumer apps (Portal, Wyllolabs, third-party Next.js apps) adopting `@big-wylly-style/ui` after the package has already been in use elsewhere.

## What to expect on first audit

After installing `@big-wylly-style/ui` and pointing components at it, **run the auditor on your full app early**:

```bash
npx audit-governance --scope . --all
```

Use `--all` (not `--changed-only`) on the first pass so the audit walks every file, not just files touched in the current PR. This surfaces legacy patterns that the auditor would otherwise quietly defer until you touched the file.

You should expect violations. Most fall into the same handful of categories:

### MD-002: legacy shadcn `size="icon"` on Button

The most common first-audit hit. The original shadcn template documented `size="icon"` for icon-only buttons. The design system narrowed that pattern — the canonical form is now an `iconOnly` prop:

```tsx
// ❌ MD-002 violation (size="icon" is in Button's forbidden list)
<Button size="icon" variant="ghost">
  <X className="size-4" />
</Button>

// ✓ Canonical
<Button size="sm" iconOnly variant="ghost" aria-label="Close">
  <X className="size-4" />
</Button>
```

Two things to know:
- `iconOnly` is a separate boolean prop, not a size value. You still pick a size (`xs`, `sm`, or `md`).
- Icon-only buttons must have an `aria-label` (governance rule IC-004 enforces it).

### MD-001 / MD-002: forbidden variant/size values

Each component's `metadata.json` declares values the design system forbids even when CVA accepts them. Common cases:

- `Button variant="secondary"` — use `outline` instead.
- `Button size="lg"` — use `md` (reserved for hero actions) or `sm` (default).
- `Tabs variant="pill"` — use `line` (the default).

The violation message names the allowed values for that prop. Pick one.

### PL-* (primitive leakage): raw palette classes

Direct Tailwind palette classes (`text-blue-500`, `bg-gray-900`, `border-red-200`) are forbidden. Use semantic tokens (`text-primary`, `bg-card`, `border-destructive`).

If you have a one-off case where the palette class is intentional (e.g. a color-picker preview), suppress with a justification:

```tsx
{/* govern:disable-next-line PL-003 -- color picker preview */}
<span className="text-blue-500">Sample</span>
```

### LC-* (layout composition): missing PageLayout wrap

Pages that render the design system's `<Header>` must wrap in `<PageLayout>`. The fix is structural — add the wrapper and use `PageLayout.Body`, `PageLayout.Main`, etc., per the gallery's `/gallery/layouts` examples.

## Recommended migration order

1. **Run `npx audit-governance --scope . --all` and triage by rule family.** Group the violations — most consumer migrations are 80% MD-002 (forbidden values) and PL-* (primitive leakage), 20% everything else.
2. **Fix all MD-001 / MD-002 first.** They're variant/size swaps — mechanical and low-risk. The fix is named in each violation message.
3. **Fix PL-* next.** Map Tailwind palette classes to semantic tokens. The `packages/ui` source is the reference — search for the equivalent semantic token in the existing components.
4. **Fix LC-* / IC-* / CO-* last.** These are structural and may require a small JSX restructure.
5. **Re-run with `--changed-only --base-ref origin/main`** in CI so PRs aren't blocked by tech debt outside their scope.

## Filing drift reports to the DS team

When a violation looks wrong from the consumer's perspective — e.g. the TS signature accepts a value but the metadata's `forbidden` list rejects it, and you think the metadata is stale — file a structured drift report:

```bash
npx audit-governance --scope . --print-issue | gh issue create \
  --repo chebert-pd/big-wylly-style \
  --title "Possible metadata drift in @big-wylly-style/ui" \
  --body-file -
```

The flag emits a markdown body grouped by rule with file/line examples. The DS team triages and updates metadata or component source as appropriate. **Never patch `node_modules/@big-wylly-style/ui/...` directly** — the next install wipes it.

## Background reading

- [.claude/skills/governance-auditor/SKILL.md](packages/ui/.claude/skills/governance-auditor/SKILL.md) — full rule taxonomy and triage flow.
- [.claude/skills/ai-ds-composer/SKILL.md](.claude/skills/ai-ds-composer/SKILL.md) — how to pick + compose components correctly the first time.
- [.claude/skills/ai-component-metadata/SKILL.md](.claude/skills/ai-component-metadata/SKILL.md) — schema reference for `*.metadata.json` files.

These skills are installed automatically by `npx audit-governance install-skill` if you're using Claude Code in the consumer repo.
