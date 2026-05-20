import { test } from "node:test"
import { strict as assert } from "node:assert"
import { formatIssueReport, formatReport } from "../report.js"
import type { IssueReportJSON } from "../report.js"
import type { AuditResult, Violation } from "../types.js"

function makeResult(violations: Violation[]): AuditResult {
  return {
    schemaVersion: "1.0",
    tool: { name: "audit-governance", version: "1.2.3" },
    scope: { root: "/x", filesScanned: 1 },
    summary: {
      totalViolations: violations.length,
      totalSuppressed: 0,
      totalBaselined: 0,
      byRule: {},
      byFile: {},
      bySeverity: { error: violations.length, warning: 0 },
    },
    violations,
    suppressed: [],
    baselined: [],
  }
}

function makeViolation(over: Partial<Violation> = {}): Violation {
  return {
    rule: "PL-003",
    severity: "error",
    file: "src/page.tsx",
    line: 42,
    endLine: 42,
    column: null,
    message: "Tailwind palette class bypasses design system",
    snippet: 'className="text-blue-500"',
    fix: "Use semantic tokens",
    ...over,
  }
}

test("SARIF format produces a valid structure with required fields", () => {
  const out = formatReport(makeResult([makeViolation()]), "sarif")
  const parsed = JSON.parse(out)
  assert.equal(parsed.version, "2.1.0")
  assert.ok(parsed.runs[0].tool.driver.name === "audit-governance")
  assert.equal(parsed.runs[0].tool.driver.version, "1.2.3")
  assert.equal(parsed.runs[0].results.length, 1)
})

test("SARIF result entries contain ruleId, level, message, and a physical location", () => {
  const out = formatReport(makeResult([makeViolation()]), "sarif")
  const result = JSON.parse(out).runs[0].results[0]
  assert.equal(result.ruleId, "PL-003")
  assert.equal(result.level, "error")
  assert.match(result.message.text, /Tailwind palette/)
  const loc = result.locations[0].physicalLocation
  assert.equal(loc.artifactLocation.uri, "src/page.tsx")
  assert.equal(loc.region.startLine, 42)
  assert.equal(loc.region.endLine, 42)
})

test("SARIF declares each unique rule once in tool.driver.rules", () => {
  const out = formatReport(makeResult([
    makeViolation({ rule: "PL-003" }),
    makeViolation({ rule: "PL-003", line: 50 }),
    makeViolation({ rule: "TY-001" }),
  ]), "sarif")
  const rules = JSON.parse(out).runs[0].tool.driver.rules
  assert.equal(rules.length, 2)
  assert.deepEqual(rules.map((r: { id: string }) => r.id).sort(), ["PL-003", "TY-001"])
})

test("SARIF empty result still produces a valid structure", () => {
  const out = formatReport(makeResult([]), "sarif")
  const parsed = JSON.parse(out)
  assert.equal(parsed.runs[0].results.length, 0)
  assert.equal(parsed.runs[0].tool.driver.rules.length, 0)
})

test("warning severity is mapped to SARIF level 'warning'", () => {
  const out = formatReport(makeResult([makeViolation({ severity: "warning" })]), "sarif")
  assert.equal(JSON.parse(out).runs[0].results[0].level, "warning")
})

// formatIssueReport — JSON output for --print-issue

test("formatIssueReport JSON groups violations by rule and includes top-level metadata", () => {
  const result = makeResult([
    makeViolation({ rule: "PL-003", file: "src/a.tsx", line: 10 }),
    makeViolation({ rule: "PL-003", file: "src/b.tsx", line: 20 }),
    makeViolation({ rule: "TY-001", file: "src/c.tsx", line: 30, message: "Named weight" }),
  ])
  const parsed = JSON.parse(formatIssueReport(result, "json")) as IssueReportJSON
  assert.equal(parsed.empty, false)
  assert.equal(parsed.tool.name, "audit-governance")
  assert.equal(parsed.tool.version, "1.2.3")
  assert.equal(parsed.scope.root, "/x")
  assert.equal(parsed.summary.totalViolations, 3)
  assert.equal(parsed.rules.length, 2)
  // Sorted alphabetically by id.
  assert.equal(parsed.rules[0].id, "PL-003")
  assert.equal(parsed.rules[0].count, 2)
  assert.equal(parsed.rules[0].examples.length, 2)
  assert.equal(parsed.rules[1].id, "TY-001")
})

test("formatIssueReport JSON caps examples at 10 per rule", () => {
  const many = Array.from({ length: 15 }, (_, i) =>
    makeViolation({ rule: "PL-003", line: i + 1 }),
  )
  const parsed = JSON.parse(formatIssueReport(makeResult(many), "json")) as IssueReportJSON
  assert.equal(parsed.rules[0].count, 15)
  assert.equal(parsed.rules[0].examples.length, 10)
})

test("formatIssueReport JSON marks empty result", () => {
  const parsed = JSON.parse(formatIssueReport(makeResult([]), "json")) as IssueReportJSON
  assert.equal(parsed.empty, true)
  assert.equal(parsed.rules.length, 0)
  assert.equal(parsed.summary.totalViolations, 0)
})

test("formatIssueReport markdown is unchanged for the no-violations case", () => {
  const md = formatIssueReport(makeResult([]))
  assert.match(md, /No violations to report/)
})

test("formatIssueReport markdown defaults when no format is passed", () => {
  const md = formatIssueReport(makeResult([makeViolation()]))
  assert.match(md, /^## Governance audit drift report/)
})
