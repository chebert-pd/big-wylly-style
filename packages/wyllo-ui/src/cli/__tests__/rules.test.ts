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
  const expected = ["FG-001","BD-001","EL-001","EL-003","SC-001","SC-002","SC-003","TY-001","TY-002","PL-001","PL-002","PL-003"]
  for (const id of expected) {
    assert.ok(RULE_META[id], `RULE_META is missing ${id}`)
  }
})
