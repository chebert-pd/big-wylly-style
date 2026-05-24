import { test } from "node:test"
import { strict as assert } from "node:assert"
import { formatIssueReport, formatReport } from "../report.js"
import type { IssueReportJSON } from "../report.js"
import type { AuditResult, Violation } from "../types.js"

function makeResult(violations: Violation[], overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    schemaVersion: "1.0",
    tool: { name: "audit-governance", version: "1.2.3" },
    scope: { root: "/x", filesScanned: 1, discoveryMode: "ds-importers" },
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
    ...overrides,
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
  // basename("/x") — see "leaf folder name for scope.root" test below for the privacy reasoning.
  assert.equal(parsed.scope.root, "x")
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

test("formatIssueReport markdown uses leaf folder name for Scope (privacy — no absolute paths)", () => {
  const result = makeResult([makeViolation()], {
    scope: { root: "/Users/dev/my-secret-repo", filesScanned: 3, discoveryMode: "ds-importers" },
  })
  const md = formatIssueReport(result, "markdown")
  assert.match(md, /\*\*Scope:\*\* `my-secret-repo`/)
  assert.doesNotMatch(md, /\/Users\/dev/)
})

test("formatIssueReport json uses leaf folder name for scope.root (privacy — no absolute paths)", () => {
  const result = makeResult([makeViolation()], {
    scope: { root: "/Users/dev/my-secret-repo", filesScanned: 3, discoveryMode: "ds-importers" },
  })
  const parsed = JSON.parse(formatIssueReport(result, "json")) as IssueReportJSON
  assert.equal(parsed.scope.root, "my-secret-repo")
  assert.doesNotMatch(JSON.stringify(parsed), /\/Users\/dev/)
})

test("formatText annotates Files-scanned with discoveryMode (DS importers)", () => {
  const result = makeResult([], {
    scope: { root: "/x", filesScanned: 7, discoveryMode: "ds-importers" },
  })
  const text = formatReport(result, "text")
  assert.match(text, /Files scanned: 7 \(DS importers\)/)
})

test("formatText annotates Files-scanned with discoveryMode (all)", () => {
  const result = makeResult([], {
    scope: { root: "/x", filesScanned: 12, discoveryMode: "all" },
  })
  const text = formatReport(result, "text")
  assert.match(text, /Files scanned: 12 \(all\)/)
})

test("formatIssueReport markdown annotates Files-scanned with discoveryMode", () => {
  const result = makeResult([makeViolation()], {
    scope: { root: "/repo", filesScanned: 12, discoveryMode: "all" },
  })
  const md = formatIssueReport(result, "markdown")
  assert.match(md, /\*\*Files scanned:\*\* 12 \(all\)/)
})

test("formatText: suppressed section lists each with reason when count <= cap", () => {
  const result = makeResult([], {
    suppressed: [
      { ...makeViolation({ rule: "PL-003", file: "brand.tsx", line: 14 }), reason: "intentional brand color" },
      { ...makeViolation({ rule: "IC-003", file: "dialog.tsx", line: 88 }), reason: "icon override per design" },
      { ...makeViolation({ rule: "TY-001", file: "legacy/old.tsx", line: 202 }), reason: "pre-DS migration" },
    ],
    summary: {
      totalViolations: 0, totalSuppressed: 3, totalBaselined: 0,
      byRule: {}, byFile: {}, bySeverity: { error: 0, warning: 0 },
    },
  })
  const text = formatReport(result, "text")
  assert.match(text, /-- Suppressed \(3\) --/)
  assert.match(text, /\[PL-003\] brand\.tsx:14 — intentional brand color/)
  assert.match(text, /\[IC-003\] dialog\.tsx:88 — icon override per design/)
  assert.match(text, /\[TY-001\] legacy\/old\.tsx:202 — pre-DS migration/)
  assert.doesNotMatch(text, /text output is capped/)
})

test("formatText: suppressed section truncates at cap and shows footer with --format json hint", () => {
  const suppressed = Array.from({ length: 55 }, (_, i) => ({
    ...makeViolation({ rule: "PL-003", file: `file-${i}.tsx`, line: i + 1 }),
    reason: `reason-${i}`,
  }))
  const result = makeResult([], {
    suppressed,
    summary: {
      totalViolations: 0, totalSuppressed: 55, totalBaselined: 0,
      byRule: {}, byFile: {}, bySeverity: { error: 0, warning: 0 },
    },
  })
  const text = formatReport(result, "text")
  assert.match(text, /-- Suppressed \(showing 20 of 55\) --/)
  assert.match(text, /Re-run with --format json to see all 55 — text output is capped at 20\./)
  // The 20th entry is shown, the 21st is not.
  assert.match(text, /\[PL-003\] file-19\.tsx:20 — reason-19/)
  assert.doesNotMatch(text, /file-20\.tsx:21/)
})

test("formatText: no suppressed section when result.suppressed is empty", () => {
  const text = formatReport(makeResult([makeViolation()]), "text")
  assert.doesNotMatch(text, /-- Suppressed/)
})

test("formatText: violations + suppressed produces both sections, suppressed last", () => {
  const result = makeResult([makeViolation({ rule: "PL-003", file: "page.tsx", line: 1 })], {
    suppressed: [
      { ...makeViolation({ rule: "IC-003", file: "icon.tsx", line: 5 }), reason: "intentional" },
    ],
    summary: {
      totalViolations: 1, totalSuppressed: 1, totalBaselined: 0,
      byRule: { "PL-003": 1 }, byFile: { "page.tsx": 1 }, bySeverity: { error: 1, warning: 0 },
    },
  })
  const text = formatReport(result, "text")
  const violationsIdx = text.indexOf("-- PL-003")
  const suppressedIdx = text.indexOf("-- Suppressed")
  assert.ok(violationsIdx > 0 && suppressedIdx > violationsIdx, "suppressed section should appear after violations section")
})

test("truncateSnippet: snippet at or under max returns unchanged (no '...' indicator)", () => {
  const short = 'className="bg-primary"'
  const result = makeResult([makeViolation({ snippet: short })])
  const text = formatReport(result, "text")
  assert.match(text, /-> className="bg-primary"/)
  assert.doesNotMatch(text, /\.\.\./)
})

test("truncateSnippet: cuts at safe boundary in last half of window, not mid-class", () => {
  // 127-char className spanning multiple Tailwind classes. Hard cut at 120
  // would land mid-class; boundary cut should land at a whitespace/quote/brace/>.
  const snippet = 'className="bg-primary text-foreground hover:bg-accent focus:ring-2 focus:ring-primary border border-input rounded-md px-4 py-2"'
  assert.ok(snippet.length > 120, `test fixture must exceed truncation max; got ${snippet.length}`)
  const result = makeResult([makeViolation({ snippet })])
  const text = formatReport(result, "text")
  const truncated = text.match(/-> (.*\.\.\.)/m)
  assert.ok(truncated, "expected a truncated snippet with trailing '...'")
  // trimEnd strips trailing whitespace inside the helper, so the char right
  // before "..." is the LAST char of the previous complete class. The right
  // check is that the truncated content is a prefix of the original snippet
  // ending at a position where the NEXT char in the original is a boundary —
  // i.e. we did not slice mid-class.
  const truncatedContent = truncated![1].replace(/\.\.\.$/, "")
  assert.ok(
    snippet.startsWith(truncatedContent),
    "truncated content should be a prefix of the original snippet",
  )
  const followingChar = snippet[truncatedContent.length]
  assert.ok(
    followingChar !== undefined && /[\s"'`{}>]/.test(followingChar),
    `cut should land just before a boundary char; original has '${followingChar}' at the cut point`,
  )
})

test("truncateSnippet: falls back to hard cut + '...' when no boundary in last half", () => {
  // Pathological 200-char alphanumeric blob — no whitespace/quotes/braces/>.
  const snippet = "a".repeat(200)
  const result = makeResult([makeViolation({ snippet })])
  const text = formatReport(result, "text")
  assert.match(text, /-> a{120}\.\.\./)
})

test("truncateSnippet: --print-issue markdown also uses class-boundary truncation", () => {
  const snippet = 'className="bg-primary text-foreground hover:bg-accent focus:ring-2 focus:ring-primary border border-input rounded-md px-4 py-2"'
  const result = makeResult([makeViolation({ snippet })])
  const md = formatIssueReport(result, "markdown")
  // markdown wraps the snippet in backticks; the truncated content with "..."
  // should appear inside them.
  assert.match(md, /`[^`]*\.\.\.`/)
})

test("formatText: zero violations + non-zero suppressed prints both 'No violations found' and the suppressed section", () => {
  const result = makeResult([], {
    suppressed: [
      { ...makeViolation({ rule: "PL-003", file: "brand.tsx", line: 14 }), reason: "intentional brand color" },
    ],
    summary: {
      totalViolations: 0, totalSuppressed: 1, totalBaselined: 0,
      byRule: {}, byFile: {}, bySeverity: { error: 0, warning: 0 },
    },
  })
  const text = formatReport(result, "text")
  assert.match(text, /No violations found\. All audited files follow governance rules\./)
  assert.match(text, /-- Suppressed \(1\) --/)
  assert.match(text, /brand\.tsx:14 — intentional brand color/)
})
