import { test } from "node:test"
import { strict as assert } from "node:assert"
import { runChecks, RULE_META, ruleAppliesInMode } from "../rules.js"
import type { Mode } from "../types.js"

function check(line: string, opts: { component?: string; mode?: Mode } = {}) {
  return runChecks({
    file: "test.tsx",
    line,
    lineNum: 1,
    componentName: opts.component ?? "page",
    mode: opts.mode ?? "consumer",
  }).map((v) => v.rule)
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
  const expected = ["FG-001","BD-001","EL-001","EL-003","SC-001","SC-002","SC-003","TY-001","TY-002","TY-003","TY-004","PL-001","PL-002","PL-003"]
  for (const id of expected) {
    assert.ok(RULE_META[id], `RULE_META is missing ${id}`)
  }
})
