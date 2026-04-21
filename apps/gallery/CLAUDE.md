# Big Wylly Style — Design System Guide for Claude

**Next.js 16.1.6 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (new-york)**

Consult the knowledge sources below before writing any component code.

---

## Knowledge Sources — Consult in This Order

### 1. Component Metadata — `packages/wyllo-ui/src/components/*.metadata.json`
66 files, one per component. **Always read the relevant metadata file before choosing a component, variant, or sub-component.** Key fields: `usage.useCases`, `usage.antiPatterns`, `variants.visual.allowed`, `variants.visual.forbidden`, `variants.size`, `composition.slots`, `aiHints.context`.

### 2. Codebase Index — `packages/wyllo-ui/src/components/.ai/`
Auto-generated relationship maps. Read before composing components, adding dependencies, or building data-connected UI.

- `index.toon` — component summary
- `relationships/component-usage.toon` — import graph; check here before composing to avoid reinventing existing patterns
- `relationships/dependencies.toon` — npm packages per component; check before adding a new dependency
- `relationships/data-flow.toon` — API/query patterns; follow these when building data-connected components

### 3. Governance Rules — `packages/wyllo-ui/governance-rules.json`
Defines correct token usage — not just that a token exists, but that it's used with the right intent. **Read before writing or modifying any component. Apply proactively — don't wait for the auditor to catch violations.**

Seven categories enforced:
1. `muted-foreground` never on h1/h2
2. `accent` only for hover states
3. `ring` only in focus states
4. Heavy shadows only on large components
5. Never use `text-destructive` for text — use `text-destructive-foreground`
6. Numeric font weights only: 420/520/620/660 — no `font-bold` or `font-medium`
7. No raw palette classes (`gray-55`, `violet-58`), no hardcoded colors

### 4. Agentic Skills — `.claude/skills/`
Three skills are committed to the repo. **Do not reinstall from the package** (`npx giorris-claude-skills install`) — the committed versions contain patches for monorepo import detection that the upstream package does not have.

- `codebase-index` — generates the relationship graph
- `ai-component-metadata` — generates `.metadata.json` files
- `ai-ds-composer` — guides component selection, enforces anti-patterns

### 5. Governance Auditor — `packages/wyllo-ui/scripts/audit_governance.py`
Validates component source files against the governance rules. Run after writing or modifying components.

```
python3 packages/wyllo-ui/scripts/audit_governance.py
```

---

## Hard Rules — Never Violate These

### Variants
- **`Button variant="secondary"` is FORBIDDEN** — use `variant="outline"` instead
- **`Button size="lg"` is FORBIDDEN** — only `xs`, `sm`, `md` are allowed
- `size="sm"` is the **default** — use when unsure
- `size="md"` is **reserved for the most important action(s)** on the screen (header / top of page)
- `size="xs"` is for **compact spaces** (tables, small cards, lists)
- `variant="primary"` — one per page max; `"outline"` — default action; `"ghost"` — low emphasis; `"destructive"` — irreversible
- **Icon-only buttons must be square** — always use the `iconOnly` prop
- **`Tabs variant="line"` is the default** — never use pill unless explicitly requested

### Forms
- **Always wrap** Input, Textarea, Select, Combobox, RadioGroup, Checkbox, Switch in `<Field>`
- Use `<Field orientation="horizontal">` for inline label-input pairs
- Use `<FieldGroup>` to group related inputs; `<FieldSet>` + `<FieldLegend>` for semantic groupings
- Use `InputGroup` + `InputGroupInput` (not plain `Input`) when adding inline icons or buttons

### Navigation vs. Actions
- `Button` triggers an action — `Link` navigates — **never swap them**

### Cards and Surfaces
- Use the `level` prop on `Card` to signal nesting depth (0 = canvas, 1 = card, 2 = secondary)
- Use `tone="ghost"` for transparent grouping containers on the canvas — do not manually set `bg-transparent` on a Card
- Do not nest `ChoiceCard` inside `Card`

### Context Menus
- `ContextMenu` = right-click only — never trigger from a button
- Use `DropdownMenu` for button-activated action lists

### Icons
- See the `iconography` section in `governance-rules.json` for icon roles, sizing, and violations
- **Icon-only buttons** must use the `iconOnly` prop and an `aria-label`

### General
- Always use `cn()` from `@chebert-pd/ui` for className merging
- Always import from `@chebert-pd/ui`
- **Never hardcode UI that exists as a component in `@chebert-pd/ui`** — this includes gallery demos and examples, not just production code. If a component exists (Tabs, Button, Badge, etc.), use it. No raw `<span>`, `<div>`, or `<a>` stand-ins.
- **Prefer editing existing components over creating new ones**
- **Do not generate new component files** unless explicitly asked

---

## Decision Flow for Generating UI

Run this flow for every page and component, including utility pages like error states, 404s, and empty states. No page is exempt.

1. Identify what's needed (action / input / display / navigation / container / error state)
2. Browse `packages/wyllo-ui/src/components/*.metadata.json` — read `aiHints.context` and `usage.useCases` to identify the right component
3. Read `component-usage.toon` — does a composition already exist? Don't reinvent it
4. Read `variants.visual.allowed` and `variants.visual.forbidden` — pick the correct variant
5. Read `variants.size` — pick the correct size per hierarchy (sm default, md hero, xs compact)
6. Read `composition.slots` — use documented sub-components, not custom wrappers
7. Check `usage.antiPatterns` — don't repeat known mistakes
8. Check `governance-rules.json` — verify token usage follows design intent
9. Apply the hard rules above

---

## Key Composition Patterns

### Form field
```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <FieldContent>
    <Input type="email" placeholder="you@example.com" />
  </FieldContent>
  <FieldError />
</Field>
```

### Input with inline addon
```tsx
<InputGroup>
  <InputGroupAddon align="inline-start"><Search className="size-4" /></InputGroupAddon>
  <InputGroupInput placeholder="Search..." />
</InputGroup>
```

### Primary + cancel pair
```tsx
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button variant="primary">Save Changes</Button>
</div>
```

### Tabs (default)
```tsx
<Tabs defaultValue="overview" variant="line">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
</Tabs>
```

### Choice card group
```tsx
<RadioGroup>
  <ChoiceCard htmlFor="plan-starter" title="Starter" description="For individuals"
    control={<RadioGroupItem value="starter" id="plan-starter" />} />
  <ChoiceCard htmlFor="plan-pro" title="Pro" description="For teams"
    control={<RadioGroupItem value="pro" id="plan-pro" />} />
</RadioGroup>
```

---

## Stack Reference

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Component base | shadcn/ui (new-york style) |
| Variant system | Class Variance Authority (CVA) |
| Primitives | Radix UI (`radix-ui` unified + `@radix-ui/*`) |
| Combobox | `@base-ui/react` |
| Table | `@tanstack/react-table` v8 |
| Charts | Recharts v2 |
| Calendar | `react-day-picker` v9 |
| Drawer | `vaul` v1 |
| Icons | `lucide-react` |
| Date utilities | `date-fns` v4 |

**CSS utilities:** `cn()` from `@chebert-pd/ui` — always use for className merging.

---

## Session Discipline

Context windows fill fast. Follow these rules to avoid overflow and reduce mid-session mistakes:

- **Read metadata files directly** — don't ask for a schema explanation; the files are the source of truth
- **Scope each session around a predictable unit of work** — a full page is fine; unbounded iteration is not. Once a page exists on disk, start a fresh session for revisions — Claude Code will read the current file state, which is more reliable than a bloated chat thread containing multiple prior versions
- **Ask for a plan before generating a full page** — outline which components and patterns you'll use, confirm with the user, then write code. Course-correcting mid-generation costs more context than planning upfront
- **Front-load context** — reference all relevant files in the opening prompt rather than discovering them mid-session through tool calls
- **Name the exit condition** — state explicitly where you'll stop (e.g. "generate the full file, then stop")
- **Narrate decisions, not actions** — explain *why* you made a non-obvious choice (component selection, variant, composition pattern); skip narrating what the code already shows
- **Reference files by path** — don't paste large file contents into chat; use the path and let tools read them
- **Pause and confirm** before refactoring more than 2–3 files in one session
- If context is getting long, say so — the user can `/compact` or `/clear` to reset
