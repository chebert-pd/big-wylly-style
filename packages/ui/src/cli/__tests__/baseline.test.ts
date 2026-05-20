import { test } from "node:test"
import { strict as assert } from "node:assert"
import { mkdtempSync, rmSync, existsSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { loadBaseline, partitionByBaseline, writeBaseline } from "../baseline.js"
import { formatSuggestion } from "../report.js"
import type { AuditResult, Violation } from "../types.js"

function makeViolation(over: Partial<Violation> = {}): Violation {
  return {
    rule: "PL-003",
    severity: "error",
    file: "page.tsx",
    line: 1,
    endLine: 1,
    column: null,
    message: "x",
    snippet: 'className="text-blue-500"',
    ...over,
  }
}

test("partitionByBaseline matches an exact violation and treats the rest as active", () => {
  const baseline = [{ file: "page.tsx", rule: "PL-003", snippet: 'className="text-blue-500"' }]
  const current = [
    makeViolation(),
    makeViolation({ rule: "TY-001", snippet: "font-medium" }),
  ]
  const { active, baselined } = partitionByBaseline(current, baseline)
  assert.equal(active.length, 1)
  assert.equal(active[0].rule, "TY-001")
  assert.equal(baselined.length, 1)
  assert.equal(baselined[0].rule, "PL-003")
})

test("partitionByBaseline tolerates whitespace differences in the snippet", () => {
  const baseline = [{ file: "page.tsx", rule: "PL-003", snippet: 'className="text-blue-500"' }]
  const current = [makeViolation({ snippet: '  className="text-blue-500"  ' })]
  const { active, baselined } = partitionByBaseline(current, baseline)
  assert.equal(active.length, 0)
  assert.equal(baselined.length, 1)
})

test("partitionByBaseline consumes one baseline entry per match (duplicates handled)", () => {
  const baseline = [
    { file: "page.tsx", rule: "PL-003", snippet: 'className="text-blue-500"' },
    { file: "page.tsx", rule: "PL-003", snippet: 'className="text-blue-500"' },
  ]
  const current = [makeViolation(), makeViolation(), makeViolation()]
  const { active, baselined } = partitionByBaseline(current, baseline)
  assert.equal(baselined.length, 2)
  assert.equal(active.length, 1)
})

test("writeBaseline + loadBaseline round-trip", () => {
  const dir = mkdtempSync(join(tmpdir(), "baseline-test-"))
  try {
    const path = join(dir, "baseline.json")
    writeBaseline(path, [makeViolation()], { tool: "test", scope: dir })
    assert.ok(existsSync(path))
    const loaded = loadBaseline(path)
    assert.ok(loaded)
    assert.equal(loaded.length, 1)
    assert.equal(loaded[0].rule, "PL-003")
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("loadBaseline returns null when file does not exist", () => {
  assert.equal(loadBaseline("/tmp/does-not-exist-baseline.json"), null)
})

test("loadBaseline rejects an unsupported schemaVersion", () => {
  const dir = mkdtempSync(join(tmpdir(), "baseline-test-"))
  try {
    const path = join(dir, "bad.json")
    writeFileSync(path, JSON.stringify({ schemaVersion: 99, entries: [] }))
    assert.throws(() => loadBaseline(path), /schema/i)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("formatSuggestion produces a copy-pasteable directive", () => {
  const result: AuditResult = {
    schemaVersion: "1.0",
    tool: { name: "test", version: "0" },
    scope: { root: "/x", filesScanned: 1 },
    summary: { totalViolations: 3, totalSuppressed: 0, totalBaselined: 0, byRule: {}, byFile: {}, bySeverity: { error: 0, warning: 0 } },
    violations: [
      makeViolation({ rule: "PL-001" }),
      makeViolation({ rule: "PL-001" }),
      makeViolation({ rule: "TY-001" }),
    ],
    suppressed: [],
    baselined: [],
  }
  const out = formatSuggestion(result, "page.tsx")
  assert.match(out, /govern:disable-file PL-001,TY-001/)
  assert.match(out, /3 violations across 2 rules/)
  assert.match(out, /PL-001: 2/)
  assert.match(out, /TY-001: 1/)
})

test("formatSuggestion reports nothing to do when the file is clean", () => {
  const result: AuditResult = {
    schemaVersion: "1.0",
    tool: { name: "test", version: "0" },
    scope: { root: "/x", filesScanned: 1 },
    summary: { totalViolations: 0, totalSuppressed: 0, totalBaselined: 0, byRule: {}, byFile: {}, bySeverity: { error: 0, warning: 0 } },
    violations: [],
    suppressed: [],
    baselined: [],
  }
  const out = formatSuggestion(result, "page.tsx")
  assert.match(out, /No violations found/)
})
