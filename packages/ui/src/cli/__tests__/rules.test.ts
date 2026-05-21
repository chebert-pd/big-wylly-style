import { test } from "node:test"
import { strict as assert } from "node:assert"
import { runChecks, RULE_META, ruleAppliesInMode } from "../rules.js"
import type { Mode } from "../types.js"

function check(line: string, opts: { component?: string; mode?: Mode; fileContent?: string } = {}) {
  return runChecks({
    file: "test.tsx",
    line,
    lineNum: 1,
    componentName: opts.component ?? "page",
    mode: opts.mode ?? "consumer",
    fileContent: opts.fileContent ?? line,
  }).map((v) => v.rule)
}

/** Multi-line check helper: scan every line of `source` and return all
 *  rule IDs that fire. Use when a rule needs to see JSX ancestors that span
 *  multiple lines (CO-001/002/003 walk fileContent to find the wrapping element). */
function checkSource(source: string, opts: { component?: string; mode?: Mode; file?: string } = {}) {
  const lines = source.split("\n")
  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const found = runChecks({
      file: opts.file ?? "test.tsx",
      line: lines[i],
      lineNum: i + 1,
      componentName: opts.component ?? "page",
      mode: opts.mode ?? "consumer",
      fileContent: source,
    })
    out.push(...found.map((v) => v.rule))
  }
  return out
}

test("FG-001 fires on muted-foreground attached to h1", () => {
  assert.ok(check('<h1 className="text-muted-foreground">x</h1>').includes("FG-001"))
})

test("FG-001 does not fire on muted-foreground attached to a paragraph", () => {
  assert.ok(!check('<p className="text-muted-foreground">x</p>').includes("FG-001"))
})

test("BD-001 fires on ring-ring outside focus state", () => {
  assert.ok(check('<div className="ring-ring">').includes("BD-001"))
})

test("BD-001 does not fire on focus-visible:ring-ring", () => {
  assert.ok(!check('<div className="focus-visible:ring-ring">').includes("BD-001"))
})

test("SC-001 fires on text-destructive used as text color", () => {
  assert.ok(check('<span className="text-destructive">x</span>').includes("SC-001"))
})

test("SC-001 does not fire on text-destructive-foreground", () => {
  assert.ok(!check('<span className="text-destructive-foreground">x</span>').includes("SC-001"))
})

test("SC-001 does not fire when bg-current pattern is on the line", () => {
  assert.ok(!check('<span className="text-destructive bg-current">x</span>').includes("SC-001"))
})

test("SC-002 fires on cross-scheme mixing", () => {
  assert.ok(check('<div className="bg-success text-warning-foreground">x</div>').includes("SC-002"))
})

test("TY-001 fires on font-medium", () => {
  assert.ok(check('<p className="font-medium">x</p>').includes("TY-001"))
})

test("TY-001 does not fire on font-[520]", () => {
  assert.ok(!check('<p className="font-[520]">x</p>').includes("TY-001"))
})

test("TY-002 fires on arbitrary font size", () => {
  assert.ok(check('<p className="text-[14px]">x</p>').includes("TY-002"))
})

test("TY-002 accepts text-[10px] as a tiny-UI exception", () => {
  assert.ok(!check('<p className="text-[10px]">x</p>').includes("TY-002"))
})

test("TY-003 fires on uppercase in className", () => {
  assert.ok(check('<p className="text-xs uppercase">LABEL</p>').includes("TY-003"))
})

test("TY-003 fires on uppercase combined with tracking-wider", () => {
  assert.ok(check('<p className="text-xs uppercase tracking-wider">LABEL</p>').includes("TY-003"))
})

test("TY-003 does not fire on solo tracking-widest (legit shortcut-hint usage)", () => {
  assert.ok(!check('<span className="text-xs tracking-widest text-muted-foreground">⌘K</span>').includes("TY-003"))
})

test("TY-003 does not fire on the word 'uppercase' in JSX text content", () => {
  assert.ok(!check('<p>Render this text in uppercase.</p>').includes("TY-003"))
})

test("TY-003 does not fire on the word 'uppercase' in prose alongside className", () => {
  assert.ok(!check('<p className="p-sm text-muted-foreground">Serifs on uppercase I are easy to spot.</p>').includes("TY-003"))
})

test("TY-003 fires on uppercase inside cn() call", () => {
  assert.ok(check('<p className={cn("text-xs", "uppercase")}>LABEL</p>').includes("TY-003"))
})

test("TY-003 fires on textTransform: uppercase style prop", () => {
  assert.ok(check('<p style={{ textTransform: "uppercase" }}>LABEL</p>').includes("TY-003"))
})

test("TY-004 fires on raw text-sm + font-[420] (exact preset match)", () => {
  const rules = check('<p className="text-sm font-[420]">x</p>')
  assert.ok(rules.includes("TY-004"))
})

test("TY-004 fires on raw text-2xl + font-[620] inside an h1 element (regression: JSX name must not satisfy escape hatch)", () => {
  const rules = check('<h1 className="text-2xl font-[620] mt-4">Hello</h1>')
  assert.ok(rules.includes("TY-004"))
})

test("TY-004 fires on raw text-base + font-[660] inside a p element", () => {
  const rules = check('<p className="text-base font-[660]">$1,200</p>')
  assert.ok(rules.includes("TY-004"))
})

test("TY-004 escape hatch: existing preset .h1 with size override does not fire", () => {
  assert.ok(!check('<h2 className="h1 text-3xl font-[620]">x</h2>').includes("TY-004"))
})

test("TY-004 escape hatch: bare .p preset with size override does not fire", () => {
  assert.ok(!check('<p className="p text-3xl font-[420]">x</p>').includes("TY-004"))
})

test("TY-004 escape hatch: .label-md preset with size override does not fire", () => {
  assert.ok(!check('<span className="label-md text-base font-[520]">x</span>').includes("TY-004"))
})

test("TY-004 fires inside cn() call", () => {
  assert.ok(check('<p className={cn("text-sm font-[420]")}>x</p>').includes("TY-004"))
})

test("TY-004 does not fire on size or weight alone", () => {
  assert.ok(!check('<p className="text-sm">x</p>').includes("TY-004"))
  assert.ok(!check('<p className="font-[420]">x</p>').includes("TY-004"))
})

test("TY-004 does not fire on classless prose (no className/cn)", () => {
  assert.ok(!check('<p>Some prose with text-sm in description.</p>').includes("TY-004"))
})

test("TY-004 fires off-scale: text-3xl + font-[620] suggests heading family", () => {
  // No exact preset for text-3xl + 620; should still fire with a heading-family hint.
  assert.ok(check('<h1 className="text-3xl font-[620]">x</h1>').includes("TY-004"))
})

test("TY-004 ignores Wonder weight font-[500] (Labs theme)", () => {
  assert.ok(!check('<h1 className="text-[64px] font-[500]">x</h1>').includes("TY-004"))
})

test("TY-004 ignores p-4 padding utility (negative lookahead for bare p)", () => {
  // p-4 should not match the bare-body escape hatch (lookahead requires not -/word).
  // Result: rule fires because no preset is present.
  assert.ok(check('<div className="p-4 text-sm font-[420]">x</div>').includes("TY-004"))
})

test("PL-001 fires on raw primitive token gray-55", () => {
  assert.ok(check('<span className="text-gray-55">x</span>').includes("PL-001"))
})

test("PL-002 does not fire on HTML numeric character entities", () => {
  assert.ok(!check("<code>&#123;false&#125;</code>").includes("PL-002"))
})

test("PL-002 fires on real hex color value", () => {
  assert.ok(check('<div className="" style={{ color: "#ff0000" }}>').includes("PL-002"))
})

test("PL-003 fires on Tailwind palette class", () => {
  assert.ok(check('<span className="text-blue-500">x</span>').includes("PL-003"))
})

test("EL-001 applies in ds mode but not consumer mode", () => {
  assert.equal(ruleAppliesInMode("EL-001", "ds"), true)
  assert.equal(ruleAppliesInMode("EL-001", "consumer"), false)
})

test("EL-001 fires on small-component file in ds mode", () => {
  const rules = check('<div className="elevation-popover">', { component: "button", mode: "ds" })
  assert.ok(rules.includes("EL-001"))
})

test("EL-001 is suppressed in consumer mode even on a small-component file", () => {
  const rules = check('<div className="elevation-popover">', { component: "button", mode: "consumer" })
  assert.ok(!rules.includes("EL-001"))
})

test("Every rule has metadata defined", () => {
  const expected = ["FG-001","FG-002","BD-001","BD-002","EL-001","EL-002","EL-003","SC-001","SC-002","SC-003","TY-001","TY-002","TY-003","TY-004","PL-001","PL-002","PL-003","SF-001","SF-002","CS-001","CS-002","CO-001","CO-002","CO-003","CO-004","CO-005","LC-001"]
  for (const id of expected) {
    assert.ok(RULE_META[id], `RULE_META is missing ${id}`)
  }
})

test("SF-002 fires on <Card> with bg-transparent in className", () => {
  assert.ok(check('<Card className="bg-transparent p-4">x</Card>').includes("SF-002"))
})

test("SF-002 does not fire on <Card> with tone=\"ghost\"", () => {
  assert.ok(!check('<Card tone="ghost">x</Card>').includes("SF-002"))
})

test("SF-002 does not fire on bg-transparent outside <Card> JSX", () => {
  assert.ok(!check('<div className="bg-transparent">x</div>').includes("SF-002"))
})

test("SF-002 does not fire on lowercase variant key in a CVA (DS source)", () => {
  // CVA definitions inside Card.tsx look like `ghost: "bg-transparent ..."`,
  // which must not be mistaken for a Card JSX usage.
  assert.ok(!check('ghost: "bg-transparent border-transparent shadow-none",').includes("SF-002"))
})

test("CS-001 fires on template-literal className with interpolation", () => {
  assert.ok(check('<div className={`base ${variant}`}>x</div>').includes("CS-001"))
})

test("CS-001 fires on string-concat className", () => {
  assert.ok(check('<div className={"base " + extra}>x</div>').includes("CS-001"))
})

test("CS-001 does not fire when className is wrapped in cn()", () => {
  assert.ok(!check('<div className={cn(`base ${variant}`)}>x</div>').includes("CS-001"))
})

test("CS-001 does not fire on a single-identifier className expression", () => {
  assert.ok(!check('<div className={classes}>x</div>').includes("CS-001"))
})

test("CS-001 does not fire on a plain string className", () => {
  assert.ok(!check('<div className="base">x</div>').includes("CS-001"))
})

test("CS-001 does not fire on a template literal without interpolation", () => {
  assert.ok(!check('<div className={`base only`}>x</div>').includes("CS-001"))
})

test("CS-002 fires on @big-wylly-style/ui subpath import for a component", () => {
  assert.ok(check('import { Button } from "@big-wylly-style/ui/button"').includes("CS-002"))
})

test("CS-002 does not fire on root @big-wylly-style/ui import", () => {
  assert.ok(!check('import { Button } from "@big-wylly-style/ui"').includes("CS-002"))
})

test("CS-002 does not fire on globals.css import", () => {
  assert.ok(!check('import "@big-wylly-style/ui/globals.css"').includes("CS-002"))
})

test("CS-002 does not fire on governance-rules.json import", () => {
  assert.ok(!check('import rules from "@big-wylly-style/ui/governance-rules.json"').includes("CS-002"))
})

test("CS-002 does not fire on metadata/* import", () => {
  assert.ok(!check('import meta from "@big-wylly-style/ui/metadata/button"').includes("CS-002"))
})

// CO-005 — shadow-primitive imports.
// The rule keys on the specifier name (the imported identifier), not on the
// path tail, so it catches barrels and re-exports as well as the obvious
// shadcn-style local copies.
test("CO-005 fires on shadcn-style local import of a DS-named component", () => {
  assert.ok(check('import { Button } from "@/components/ui/button"').includes("CO-005"))
})

test("CO-005 fires on every DS-named specifier in a multi-named import", () => {
  const found = check('import { Card, Badge } from "../../components/ui/index"').filter((r) => r === "CO-005")
  assert.equal(found.length, 2, "expected CO-005 to fire for both Card and Badge")
})

test("CO-005 does not fire on root @big-wylly-style/ui import", () => {
  assert.ok(!check('import { Button } from "@big-wylly-style/ui"').includes("CO-005"))
})

test("CO-005 does not fire on @big-wylly-style/ui subpath (CS-002 handles those)", () => {
  // CS-002 still fires here. CO-005 stays quiet — double-flagging the same
  // import on two rules adds noise without changing the consumer's fix.
  assert.ok(!check('import { Button } from "@big-wylly-style/ui/button"').includes("CO-005"))
})

test("CO-005 does not fire when the imported name is not a DS export", () => {
  assert.ok(!check('import { HeaderPage } from "@/components/header-page"').includes("CO-005"))
})

test("CO-005 fires when a local re-export uses a DS-named specifier", () => {
  // Specifier-name match is the truth source — a local barrel that re-exports
  // Header (even from a file unrelated to header.tsx) collides with the DS
  // Header component and is still shadowing.
  assert.ok(check('import { Header } from "@/components/header-page"').includes("CO-005"))
})

test("CO-005 keys on the imported (left) name in 'A as B' renames", () => {
  // The DS-name collision is `Button`, even if the consumer renames it locally.
  assert.ok(check('import { Button as MyButton } from "@/components/ui/button"').includes("CO-005"))
})

test("CO-005 fires on type-only specifiers that match a DS name", () => {
  // `import type { Button }` is rare but treated the same — the local module
  // still surfaces `Button` to the rest of the codebase.
  assert.ok(check('import { type Button } from "@/components/ui/button"').includes("CO-005"))
})

test("CO-005 does not fire in ds mode", () => {
  // The DS itself imports its own primitives via relative paths and must not
  // be flagged for "shadowing" something it owns.
  assert.ok(!check('import { Button } from "@/components/ui/button"', { mode: "ds" }).includes("CO-005"))
})

test("CO-005 does not fire on bare npm package imports even when the name collides", () => {
  // lucide-react exports a `Table` icon; the DS exports a `Table` component.
  // The collision is incidental — npm packages aren't shadow primitives.
  assert.ok(!check('import { Table } from "lucide-react"').includes("CO-005"))
})

test("CO-005 does not fire on scoped npm package imports", () => {
  // @radix-ui/* and similar npm scopes must not be conflated with the `@/`
  // path-alias prefix used by Next.js / Vite.
  assert.ok(!check('import { Dialog } from "@radix-ui/react-dialog"').includes("CO-005"))
})

test("CO-005 fires on relative sibling imports", () => {
  // `./button` is the common shape inside a /components/ui/ barrel.
  assert.ok(check('import { Button } from "./button"').includes("CO-005"))
})

test("CO-005 fires on tilde-style path aliases", () => {
  assert.ok(check('import { Card } from "~/components/ui/card"').includes("CO-005"))
})

test("CO-001 fires on <ChoiceCard> inside <Card>", () => {
  const src = [
    "<Card>",
    "  <RadioGroup>",
    "    <ChoiceCard title=\"x\" />",
    "  </RadioGroup>",
    "</Card>",
  ].join("\n")
  assert.ok(checkSource(src).includes("CO-001"))
})

test("CO-001 does not fire on <ChoiceCard> outside any <Card>", () => {
  const src = [
    "<RadioGroup>",
    "  <ChoiceCard title=\"a\" />",
    "  <ChoiceCard title=\"b\" />",
    "</RadioGroup>",
  ].join("\n")
  assert.ok(!checkSource(src).includes("CO-001"))
})

test("CO-001 does not fire when prior <Card> is already closed before the <ChoiceCard>", () => {
  const src = [
    "<Card>x</Card>",
    "<RadioGroup>",
    "  <ChoiceCard title=\"a\" />",
    "</RadioGroup>",
  ].join("\n")
  assert.ok(!checkSource(src).includes("CO-001"))
})

test("CO-001 does not confuse <CardHeader> with <Card>", () => {
  // Self-closing-equivalent: CardHeader opens and closes around the ChoiceCard.
  // The (?=[\s>/]) anchor must prevent CardHeader from incrementing Card depth.
  const src = [
    "<CardHeader>",
    "  <ChoiceCard title=\"x\" />",
    "</CardHeader>",
  ].join("\n")
  assert.ok(!checkSource(src).includes("CO-001"))
})

test("CO-002 fires on bare <Input> with no <Field> ancestor", () => {
  assert.ok(check('<Input type="email" />').includes("CO-002"))
})

test("CO-002 fires on bare <Switch>", () => {
  assert.ok(check('<Switch checked={x} />').includes("CO-002"))
})

test("CO-002 does not fire on <RadioGroupItem> (different tag from RadioGroup)", () => {
  assert.ok(!check('<RadioGroupItem value="x" />').includes("CO-002"))
})

test("CO-002 does not fire when <RadioGroup> is inside <FieldSet> (grouped-control path)", () => {
  const src = [
    "<FieldSet>",
    "  <FieldLegend>Plan</FieldLegend>",
    "  <RadioGroup defaultValue=\"a\">",
    "    <RadioGroupItem value=\"a\" />",
    "  </RadioGroup>",
    "</FieldSet>",
  ].join("\n")
  assert.ok(!checkSource(src).includes("CO-002"))
})

test("CO-002 still fires on bare <Input> inside <FieldSet> (single controls need their own Field)", () => {
  const src = [
    "<FieldSet>",
    "  <FieldLegend>Profile</FieldLegend>",
    "  <Input placeholder=\"name\" />",
    "</FieldSet>",
  ].join("\n")
  assert.ok(checkSource(src).includes("CO-002"))
})

test("CO-002 does not fire when <Input> is inside <FormControl> (react-hook-form path)", () => {
  const src = [
    "<Form>",
    "  <FormField",
    "    render={({ field }) => (",
    "      <FormItem>",
    "        <FormLabel>Email</FormLabel>",
    "        <FormControl>",
    "          <Input {...field} />",
    "        </FormControl>",
    "      </FormItem>",
    "    )}",
    "  />",
    "</Form>",
  ].join("\n")
  assert.ok(!checkSource(src).includes("CO-002"))
})

test("CO-002 does not fire when <Input> is inside <Field>", () => {
  const src = [
    "<Field>",
    "  <FieldLabel>Email</FieldLabel>",
    "  <FieldContent>",
    "    <Input type=\"email\" />",
    "  </FieldContent>",
    "</Field>",
  ].join("\n")
  assert.ok(!checkSource(src).includes("CO-002"))
})

test("CO-003 fires on <ContextMenuTrigger> wrapping a <Button>", () => {
  const src = [
    "<ContextMenu>",
    "  <ContextMenuTrigger asChild>",
    "    <Button>Open menu</Button>",
    "  </ContextMenuTrigger>",
    "</ContextMenu>",
  ].join("\n")
  assert.ok(checkSource(src).includes("CO-003"))
})

test("CO-003 does not fire on <ContextMenuTrigger> wrapping a content surface", () => {
  const src = [
    "<ContextMenu>",
    "  <ContextMenuTrigger>",
    "    <div className=\"p-4\">Right-click me</div>",
    "  </ContextMenuTrigger>",
    "</ContextMenu>",
  ].join("\n")
  assert.ok(!checkSource(src).includes("CO-003"))
})

test("CO-004 fires on <Button> with router.push in onClick", () => {
  assert.ok(check('<Button onClick={() => router.push("/foo")}>Go</Button>').includes("CO-004"))
})

test("CO-004 fires on <Button href=...>", () => {
  assert.ok(check('<Button href="/foo">Go</Button>').includes("CO-004"))
})

test("CO-004 fires on <Link> without href", () => {
  assert.ok(check('<Link onClick={doSomething}>Open</Link>').includes("CO-004"))
})

test("CO-004 does not fire on <Button> with non-navigation onClick", () => {
  assert.ok(!check('<Button onClick={() => setOpen(true)}>Open</Button>').includes("CO-004"))
})

test("CO-004 does not fire on <Link href=...>", () => {
  assert.ok(!check('<Link href="/foo">Go</Link>').includes("CO-004"))
})

test("LC-003 fires on hand-rolled max-w + mx-auto at page root", () => {
  const src = [
    "export default function Page() {",
    "  return (",
    "    <div className=\"mx-auto max-w-3xl space-y-8 p-6\">",
    "      <Card>x</Card>",
    "    </div>",
    "  )",
    "}",
  ].join("\n")
  assert.ok(checkSource(src, { file: "app/foo/page.tsx" }).includes("LC-003"))
})

test("LC-003 does not fire when hand-rolled max-w is inside <FullScreenSheet>", () => {
  const src = [
    "<FullScreenSheet open={open} onClose={onClose}>",
    "  <FullScreenSheetBody>",
    "    <div className=\"mx-auto max-w-3xl space-y-8 p-6\">",
    "      <Card>x</Card>",
    "    </div>",
    "  </FullScreenSheetBody>",
    "</FullScreenSheet>",
  ].join("\n")
  assert.ok(!checkSource(src, { file: "app/foo/page.tsx" }).includes("LC-003"))
})

test("LC-003 does not fire when hand-rolled max-w is inside <Dialog>", () => {
  const src = [
    "<Dialog open={open}>",
    "  <DialogContent>",
    "    <div className=\"mx-auto max-w-5xl p-6\">",
    "      <Card>x</Card>",
    "    </div>",
    "  </DialogContent>",
    "</Dialog>",
  ].join("\n")
  assert.ok(!checkSource(src, { file: "app/foo/page.tsx" }).includes("LC-003"))
})

test("LC-003 does not fire on 'container' utility inside a modal surface", () => {
  const src = [
    "<Drawer>",
    "  <DrawerContent>",
    "    <div className=\"container px-6\">",
    "      <Card>x</Card>",
    "    </div>",
    "  </DrawerContent>",
    "</Drawer>",
  ].join("\n")
  assert.ok(!checkSource(src, { file: "app/foo/page.tsx" }).includes("LC-003"))
})

test("LC-003 still fires on 'container' utility at page root (outside modal)", () => {
  const src = [
    "export default function Page() {",
    "  return (",
    "    <div className=\"container px-6\">",
    "      <Card>x</Card>",
    "    </div>",
    "  )",
    "}",
  ].join("\n")
  assert.ok(checkSource(src, { file: "app/foo/page.tsx" }).includes("LC-003"))
})

test("CO-004 does not fire on Button asChild wrapping a Link (allowed pattern)", () => {
  // The Button itself has no href/onClick navigation — the Link inside does.
  const src = [
    "<Button asChild>",
    "  <Link href=\"/foo\">Go</Link>",
    "</Button>",
  ].join("\n")
  assert.ok(!checkSource(src).includes("CO-004"))
})

// LC-001 — PageLayout/PageContainer must not be rendered inside SidePanel content.

test("LC-001 fires on <PageLayout> inside <SidePanel>", () => {
  const src = [
    "<SidePanel>",
    "  <PageLayout variant=\"stack\">",
    "    <Card>x</Card>",
    "  </PageLayout>",
    "</SidePanel>",
  ].join("\n")
  assert.ok(checkSource(src).includes("LC-001"))
})

test("LC-001 fires on <PageContainer> inside <SidePanel>", () => {
  const src = [
    "<SidePanel>",
    "  <PageContainer size=\"md\">",
    "    <Card>x</Card>",
    "  </PageContainer>",
    "</SidePanel>",
  ].join("\n")
  assert.ok(checkSource(src).includes("LC-001"))
})

test("LC-001 does not fire on <PageLayout> at the page root", () => {
  const src = [
    "<PageLayout variant=\"stack\">",
    "  <Card>x</Card>",
    "</PageLayout>",
  ].join("\n")
  assert.ok(!checkSource(src).includes("LC-001"))
})

// BD-002 — hardcoded border color (arbitrary Tailwind value or inline style).

test("BD-002 fires on border-[#hex]", () => {
  assert.ok(check('<div className="border border-[#ff0000]">x</div>').includes("BD-002"))
})

test("BD-002 fires on border-t-[oklch(...)]", () => {
  assert.ok(check('<div className="border-t-[oklch(0.5_0.2_300)]">x</div>').includes("BD-002"))
})

test("BD-002 fires on inline borderColor with hex", () => {
  assert.ok(check('<div style={{ borderColor: "#ff0000" }}>x</div>').includes("BD-002"))
})

test("BD-002 does not fire on semantic border tokens", () => {
  assert.ok(!check('<div className="border-border-subtle">x</div>').includes("BD-002"))
  assert.ok(!check('<div className="border border-input">x</div>').includes("BD-002"))
})

test("PL-002 does not double-fire when BD-002 catches the same hex", () => {
  const rules = check('<div className="border-[#ff0000]">x</div>')
  assert.ok(rules.includes("BD-002"))
  assert.ok(!rules.includes("PL-002"))
})

test("BD-002 + PL-002 both fire when border-[#hex] and bg-[#hex] are on the same line", () => {
  const rules = check('<div className="border-[#ff0000] bg-[#00ff00]">x</div>')
  assert.ok(rules.includes("BD-002"))
  assert.ok(rules.includes("PL-002"))
})

// EL-002 — hardcoded box-shadow value.

test("EL-002 fires on shadow-[raw-value]", () => {
  assert.ok(check('<div className="shadow-[0_2px_8px_rgba(0,0,0,0.1)]">x</div>').includes("EL-002"))
})

test("EL-002 fires on inline boxShadow", () => {
  assert.ok(check('<div style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>x</div>').includes("EL-002"))
})

test("EL-002 does not fire on token-driven shadow var", () => {
  assert.ok(!check('<div className="shadow-[var(--shadow-floating)]">x</div>').includes("EL-002"))
})

test("EL-002 does not fire on semantic elevation token", () => {
  assert.ok(!check('<div className="elevation-surface">x</div>').includes("EL-002"))
})

test("PL-002 does not double-fire when EL-002 catches a shadow with a hardcoded rgba", () => {
  const rules = check('<div className="shadow-[0_2px_8px_rgba(0,0,0,0.1)]">x</div>')
  assert.ok(rules.includes("EL-002"))
  assert.ok(!rules.includes("PL-002"))
})

// FG-002 — text-primary-foreground must be on a primary surface (bg-primary / bg-brand-solid).

test("FG-002 fires on text-primary-foreground without a primary surface", () => {
  assert.ok(check('<span className="text-primary-foreground">x</span>').includes("FG-002"))
})

test("FG-002 fires on text-primary-foreground combined with a non-primary surface", () => {
  assert.ok(check('<div className="bg-card text-primary-foreground">x</div>').includes("FG-002"))
})

test("FG-002 does not fire when bg-primary is on the same className", () => {
  assert.ok(!check('<div className="bg-primary text-primary-foreground">x</div>').includes("FG-002"))
})

test("FG-002 does not fire when bg-brand-solid is on the same className", () => {
  assert.ok(!check('<div className="bg-brand-solid text-primary-foreground">x</div>').includes("FG-002"))
})

test("FG-002 does not fire on prose containing 'primary-foreground' (no className)", () => {
  assert.ok(!check('<p>The token text-primary-foreground is shown here.</p>').includes("FG-002"))
})

// SF-001 — bg-accent is for hover/focus/active states only.

test("SF-001 fires on bare bg-accent", () => {
  assert.ok(check('<div className="bg-accent p-4">x</div>').includes("SF-001"))
})

test("SF-001 does not fire on hover:bg-accent", () => {
  assert.ok(!check('<div className="hover:bg-accent">x</div>').includes("SF-001"))
})

test("SF-001 does not fire on focus:bg-accent / focus-within:bg-accent", () => {
  assert.ok(!check('<div className="focus:bg-accent">x</div>').includes("SF-001"))
  assert.ok(!check('<div className="focus-within:bg-accent">x</div>').includes("SF-001"))
})

test("SF-001 does not fire on group-hover:bg-accent", () => {
  assert.ok(!check('<div className="group-hover:bg-accent">x</div>').includes("SF-001"))
})

test("SF-001 does not fire on data-[state=open]:bg-accent", () => {
  assert.ok(!check('<div className="data-[state=open]:bg-accent">x</div>').includes("SF-001"))
})

test("SF-001 does not fire on bg-accent-foreground (different token)", () => {
  assert.ok(!check('<div className="bg-accent-foreground">x</div>').includes("SF-001"))
})
