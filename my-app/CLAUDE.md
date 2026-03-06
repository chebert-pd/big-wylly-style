# Big Wylly Style — Design System Guide for Claude

This is a **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4** application built on a custom design system layered over shadcn/ui (new-york style). Read this file fully before generating any UI.

---

## Design System Knowledge Base

Three complementary sources give you everything you need to understand and generate UI correctly. **Always consult them before writing component code.**

### 1. Component Metadata — `./components/ui/*.metadata.json`

39 metadata files, co-located with their component source files in `components/ui/`. Each file describes a component in structured, AI-ready format:

```
./components/ui/button.metadata.json        → When/how to use Button, variants, rules
./components/ui/field.metadata.json         → Form layout, sub-components
./components/ui/select.metadata.json        → Structured choice input
./components/ui/choice-card.metadata.json   → Selectable card molecule for option groups
./components/ui/header.metadata.json        → Page header organism with slots and scroll behavior
./components/ui/metric-panel.metadata.json  → Tabbed metric display organism
./components/ui/stats.metadata.json         → Stat card and grid molecules
... (39 total, one per component)
```

**Schema overview:**
- `component` — name, category (atoms/molecules/organisms), type (interactive/input/container/display/navigation)
- `usage.useCases` — when to reach for this component
- `usage.commonPatterns` — runnable JSX composition examples
- `usage.antiPatterns` — what NOT to do and why
- `variants.visual.allowed` — valid variant names; `forbidden` lists banned variants
- `variants.size` — valid sizes and defaults
- `composition.slots` — sub-components and what they do
- `composition.commonPartners` — components that work well together
- `behavior.states` — interactive states (hover, focus, disabled, aria-invalid…)
- `accessibility` — ARIA role, keyboard support, screen reader behavior
- `rules` — hard rules the design system enforces
- `alternatives` — what to use instead when this component isn't right
- `aiHints.context` — concise decision guidance

**When to read metadata:** Any time you're choosing a component, picking a variant, composing sub-components, or unsure about a rule — check `components/ui/[component-name].metadata.json` first.

---

### 2. Pattern Index — `../index/components.json`

High-level registry of named UI patterns (page-level compositions) and what primitives they're built from. Use this to understand how components combine into full UI patterns like `DataTable`, `SidePanel`, `SettingsForm`, `ChoiceCard`, etc.

---

### 3. Codebase Index — `components/.ai/`

Auto-generated relationship map showing what each component imports and what packages it depends on.

```
components/.ai/index.toon                         → Summary (components, relationships)
components/.ai/relationships/component-usage.toon → Import graph per component
components/.ai/relationships/dependencies.toon    → npm packages and where they're used
components/.ai/relationships/data-flow.toon       → API/data query patterns
```

Use this when you need to understand **what composes what**, which external libraries a component uses, or how complex components are constructed.

---

## Component Library

**37 UI components** live in `components/ui/`. Import paths use the `@/` alias:

```tsx
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"
```

**Atoms (primitive building blocks):**
Badge, Button, Checkbox, GlassFrame, InlineField, Input, Label, Link, Separator, Slider, Switch, Textarea, Toggle

**Molecules (composed from atoms):**
Alert, ButtonGroup, Calendar, Card, ChoiceCard, Combobox, ContextMenu, DateRangePicker, DropdownMenu, Empty, Field, InputGroup, Popover, RadioGroup, Select, Sheet, Stats (StatCard/StatsGrid), Tabs, ToggleGroup

**Organisms (complex, self-contained):**
Accordion, AlertDialog, Chart, DataTable, Header, MetricPanel

---

## Hard Rules — Never Violate These

These are enforced by the design system and must be respected in all generated code:

### Variants
- **Button `secondary` variant is FORBIDDEN** — use `outline` instead
- Button `primary` = one per page only; `outline` = default action; `ghost` = low emphasis; `destructive` = irreversible
- Use `variant="line"` as the default for Tabs (not pill unless explicitly requested)

### Forms
- **Always wrap Input, Textarea, Select, Combobox, RadioGroup, Checkbox, Switch in `<Field>`** for label and error association
- Use `<Field orientation="horizontal">` for inline label-input pairs
- Use `<FieldGroup>` to group related inputs; `<FieldSet>` + `<FieldLegend>` for semantically grouped sections
- Use `InputGroup` + `InputGroupInput` (not plain `Input`) when adding icons or buttons inline

### Navigation vs Actions
- `Button` = triggers an action; `Link` = navigates — never swap them

### Cards and Surfaces
- Use the `level` prop on `Card` to signal nesting depth (level 0 = canvas, level 1 = card surface, level 2 = secondary surface)
- Do not nest ChoiceCards inside Cards

### Context Menus
- `ContextMenu` is right-click only — never trigger it from a button; use `DropdownMenu` for button-activated action lists

---

## Stack Reference

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| Runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Component base | shadcn/ui (new-york style) |
| Variant system | Class Variance Authority (CVA) |
| Primitives | Radix UI (`radix-ui` unified package + `@radix-ui/*`) |
| Combobox | `@base-ui/react` |
| Table | `@tanstack/react-table` v8 |
| Charts | Recharts v2 |
| Calendar | `react-day-picker` v9 |
| Icons | `lucide-react` |
| Date utilities | `date-fns` v4 |

**CSS utilities:** `cn()` from `@/lib/utils` — always use for className merging.

---

## Key Composition Patterns

### Standard form field
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

### Primary + cancel button pair
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

### Choice card group (single select)
```tsx
<RadioGroup>
  <ChoiceCard htmlFor="plan-starter" title="Starter" description="For individuals"
    control={<RadioGroupItem value="starter" id="plan-starter" />} />
  <ChoiceCard htmlFor="plan-pro" title="Pro" description="For teams"
    control={<RadioGroupItem value="pro" id="plan-pro" />} />
</RadioGroup>
```

---

## Decision Flow for Generating UI

1. **Identify what the user needs** (action, input, display, navigation, container)
2. **Check `./components/ui/[component-name].metadata.json`** for the right component — read `aiHints.context` and `usage.useCases`
3. **Read `variants.visual.allowed`** — pick the correct variant; never use a `forbidden` one
4. **Read `composition.slots`** — use the documented sub-components, not custom wrappers
5. **Check `usage.antiPatterns`** — ensure you're not violating a known bad pattern
6. **Apply the hard rules** above
7. **Use `cn()` for className merging**; keep imports clean with `@/` alias
