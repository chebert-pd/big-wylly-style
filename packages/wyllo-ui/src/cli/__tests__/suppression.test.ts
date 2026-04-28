import { test } from "node:test"
import { strict as assert } from "node:assert"
import { isSuppressed, parseSuppressions } from "../suppression.js"

test("// govern:disable-next-line PL-003 silences only PL-003 on the next line", () => {
  const content = [
    "const a = 1",
    "// govern:disable-next-line PL-003",
    'className="text-blue-500"',
  ].join("\n")
  const sup = parseSuppressions(content)
  assert.equal(isSuppressed(sup, "PL-003", 3).suppressed, true)
  assert.equal(isSuppressed(sup, "PL-001", 3).suppressed, false)
  assert.equal(isSuppressed(sup, "PL-003", 2).suppressed, false)
})

test("comma-separated rule list silences each rule listed", () => {
  const content = "// govern:disable-next-line PL-001,SC-002\nx"
  const sup = parseSuppressions(content)
  assert.equal(isSuppressed(sup, "PL-001", 2).suppressed, true)
  assert.equal(isSuppressed(sup, "SC-002", 2).suppressed, true)
  assert.equal(isSuppressed(sup, "TY-001", 2).suppressed, false)
})

test("disable-next-line with no rule list silences every rule", () => {
  const content = "// govern:disable-next-line\nx"
  const sup = parseSuppressions(content)
  assert.equal(isSuppressed(sup, "PL-003", 2).suppressed, true)
  assert.equal(isSuppressed(sup, "TY-001", 2).suppressed, true)
})

test("JSX comment style {/* govern:disable-next-line PL-003 */} works", () => {
  const content = "{/* govern:disable-next-line PL-003 */}\nx"
  const sup = parseSuppressions(content)
  assert.equal(isSuppressed(sup, "PL-003", 2).suppressed, true)
})

test("govern:disable-file at top of file applies to all lines", () => {
  const content = "// govern:disable-file PL-003\n\n\nx\nx\nx\nx"
  const sup = parseSuppressions(content)
  assert.equal(isSuppressed(sup, "PL-003", 4).suppressed, true)
  assert.equal(isSuppressed(sup, "PL-003", 7).suppressed, true)
})

test("govern:disable-file is ignored if it appears past line 10", () => {
  const head = Array(12).fill("// some other line").join("\n")
  const content = head + "\n// govern:disable-file PL-003\nx"
  const sup = parseSuppressions(content)
  assert.equal(isSuppressed(sup, "PL-003", 14).suppressed, false)
})

test("justification after `-- ` is captured as the suppression reason", () => {
  const content = "// govern:disable-next-line PL-003 -- vendor widget\nx"
  const sup = parseSuppressions(content)
  const result = isSuppressed(sup, "PL-003", 2)
  assert.equal(result.suppressed, true)
  assert.equal(result.reason, "vendor widget")
})

test("justification works inside a JSX comment with closing markers", () => {
  const content = "{/* govern:disable-next-line SC-002 -- ternary picks one scheme */}\nx"
  const sup = parseSuppressions(content)
  const result = isSuppressed(sup, "SC-002", 2)
  assert.equal(result.suppressed, true)
  assert.equal(result.reason, "ternary picks one scheme")
})

test("suppression with no justification falls back to the comment line as reason", () => {
  const content = "// govern:disable-next-line PL-003\nx"
  const sup = parseSuppressions(content)
  const result = isSuppressed(sup, "PL-003", 2)
  assert.equal(result.reason, "// govern:disable-next-line PL-003")
})

test("em-dash prose after rule list is preserved as the reason (no justification)", () => {
  // legacy comment style — em dash, not `-- `
  const content = "{/* govern:disable-next-line SC-002 — ternary picks one scheme */}\nx"
  const sup = parseSuppressions(content)
  const result = isSuppressed(sup, "SC-002", 2)
  assert.equal(result.suppressed, true)
})
