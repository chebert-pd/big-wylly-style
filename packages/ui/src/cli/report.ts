import { basename } from "node:path"
import type { AuditResult, DiscoveryMode, Violation } from "./types.js"

// Terse label for the discovery scope. Used to disambiguate the Files-scanned
// line in text + --print-issue output. Full meaning lives in --help.
function discoveryLabel(mode: DiscoveryMode): string {
  return mode === "all" ? "(all)" : "(DS importers)"
}

// Cap for the per-run suppression listing in text output. Suppressions are
// often dense (a single page with --all can produce 50+). JSON output is
// uncapped — the cap only affects the human-readable text format.
const SUPPRESSED_DISPLAY_CAP = 20

// Truncate a snippet at a safe boundary (whitespace, quote, brace, or JSX
// tag-closer) within [max/2, max] so a className doesn't get sliced mid-class
// (e.g. "bg-prim"). Falls back to a hard cut if no boundary is found in the
// window. Always appends ASCII "..." (not Unicode "…") when truncation occurs
// — cross-environment reliability beats aesthetics in CI logs and copy-paste.
function truncateSnippet(snippet: string, max: number): string {
  if (snippet.length <= max) return snippet
  for (let i = max - 1; i >= Math.floor(max / 2); i--) {
    const c = snippet[i]
    if (c === " " || c === "\t" || c === "\"" || c === "'" || c === "`" || c === "{" || c === "}" || c === ">") {
      return snippet.slice(0, i + 1).trimEnd() + "..."
    }
  }
  return snippet.slice(0, max) + "..."
}

export type ReportFormat = "text" | "json" | "github" | "sarif"

export function formatReport(result: AuditResult, format: ReportFormat): string {
  switch (format) {
    case "json": return JSON.stringify(result, null, 2)
    case "github": return formatGithub(result)
    case "sarif": return formatSarif(result)
    case "text": return formatText(result)
  }
}

function formatSarif(result: AuditResult): string {
  const ruleIds = new Set<string>()
  for (const v of result.violations) ruleIds.add(v.rule)

  const sarif = {
    $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Documents/CommitteeSpecifications/2.1.0/sarif-schema-2.1.0.json",
    version: "2.1.0",
    runs: [
      {
        tool: {
          driver: {
            name: result.tool.name,
            version: result.tool.version,
            informationUri: "https://github.com/chebert-pd/big-wylly-style",
            rules: [...ruleIds].sort().map((id) => ({
              id,
              name: id,
              shortDescription: { text: id },
            })),
          },
        },
        results: result.violations.map((v) => ({
          ruleId: v.rule,
          level: v.severity === "error" ? "error" : "warning",
          message: { text: v.message },
          locations: [
            {
              physicalLocation: {
                artifactLocation: { uri: v.file },
                region: {
                  startLine: v.line,
                  endLine: v.endLine,
                },
              },
            },
          ],
        })),
      },
    ],
  }
  return JSON.stringify(sarif, null, 2)
}

export type IssueReportFormat = "markdown" | "json"

/** Structured shape of a `--print-issue --format json` payload. Designed for
 *  tooling consumers (Linear/Slack/dashboards) that want to read violations
 *  programmatically instead of parsing markdown. */
export interface IssueReportJSON {
  empty: boolean
  scope: {
    root: string
    filesScanned: number
  }
  summary: {
    totalViolations: number
  }
  tool: {
    name: string
    version: string
  }
  rules: Array<{
    id: string
    count: number
    message: string
    fix: string | null
    examples: Array<{
      file: string
      line: number
      snippet: string | null
    }>
  }>
}

/** Build a body suitable for filing a drift / metadata issue with the
 *  design-system team. Groups violations by rule so the report is scannable.
 *  Markdown is the default; pass `format: "json"` for structured output that
 *  tooling can read directly (Linear / Slack / dashboards). */
export function formatIssueReport(
  result: AuditResult,
  format: IssueReportFormat = "markdown",
): string {
  if (format === "json") {
    return JSON.stringify(buildIssueReportJSON(result), null, 2)
  }
  return buildIssueReportMarkdown(result)
}

function buildIssueReportJSON(result: AuditResult): IssueReportJSON {
  const byRule = new Map<string, Violation[]>()
  for (const v of result.violations) {
    if (!byRule.has(v.rule)) byRule.set(v.rule, [])
    byRule.get(v.rule)!.push(v)
  }

  const rules = [...byRule.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([id, violations]) => ({
    id,
    count: violations.length,
    message: violations[0].message,
    fix: violations[0].fix ?? null,
    examples: violations.slice(0, 10).map((v) => ({
      file: v.file,
      line: v.line,
      snippet: v.snippet ?? null,
    })),
  }))

  return {
    empty: result.violations.length === 0,
    scope: {
      // Leaf folder name only — never the absolute path. The audit may be filed
      // as a public-ish drift report, so don't leak local filesystem layout.
      root: basename(result.scope.root),
      filesScanned: result.scope.filesScanned,
    },
    summary: {
      totalViolations: result.summary.totalViolations,
    },
    tool: {
      name: result.tool.name,
      version: result.tool.version,
    },
    rules,
  }
}

function buildIssueReportMarkdown(result: AuditResult): string {
  if (result.violations.length === 0) {
    return "No violations to report. The audit is clean."
  }

  const out: string[] = []
  out.push("## Governance audit drift report")
  out.push("")
  out.push("Filing this so the design-system team can review whether these violations indicate a metadata gap, a real consumer bug, or something the rule should accept.")
  out.push("")
  // Leaf folder name only — same privacy reasoning as buildIssueReportJSON above.
  out.push(`- **Scope:** \`${basename(result.scope.root)}\``)
  out.push(`- **Files scanned:** ${result.scope.filesScanned} ${discoveryLabel(result.scope.discoveryMode)}`)
  out.push(`- **Violations:** ${result.summary.totalViolations}`)
  out.push(`- **Tool version:** \`${result.tool.name}@${result.tool.version}\``)
  out.push("")

  const byRule = new Map<string, Violation[]>()
  for (const v of result.violations) {
    if (!byRule.has(v.rule)) byRule.set(v.rule, [])
    byRule.get(v.rule)!.push(v)
  }

  for (const [ruleId, violations] of [...byRule.entries()].sort()) {
    out.push(`### ${ruleId} — ${violations.length} occurrence${violations.length === 1 ? "" : "s"}`)
    out.push("")
    out.push(violations[0].message)
    out.push("")
    out.push("Examples:")
    out.push("")
    for (const v of violations.slice(0, 10)) {
      const snippet = v.snippet ? `\`${truncateSnippet(v.snippet, 120)}\`` : "(no snippet)"
      out.push(`- \`${v.file}:${v.line}\` — ${snippet}`)
    }
    if (violations.length > 10) {
      out.push(`- … and ${violations.length - 10} more`)
    }
    out.push("")
    if (violations[0].fix) {
      out.push(`**Suggested fix from auditor:** ${violations[0].fix}`)
      out.push("")
    }
  }

  out.push("---")
  out.push("")
  out.push("_Generated by `audit-governance --print-issue`. Edit the body before submitting if helpful._")
  return out.join("\n")
}

export function formatSuggestion(result: AuditResult, file: string): string {
  const matching = result.violations.filter((v) => v.file === file || v.file.endsWith(file))
  if (matching.length === 0) {
    return `No violations found in ${file}. No suppression needed.`
  }
  const counts: Record<string, number> = {}
  for (const v of matching) counts[v.rule] = (counts[v.rule] ?? 0) + 1
  const ruleIds = Object.keys(counts).sort()
  const breakdown = ruleIds.map((r) => `${r}: ${counts[r]}`).join(", ")
  const total = matching.length
  return [
    `// govern:disable-file ${ruleIds.join(",")} -- describe why this file is exempt`,
    `// ${matching[0].file} — ${total} violation${total === 1 ? "" : "s"} across ${ruleIds.length} rule${ruleIds.length === 1 ? "" : "s"}`,
    `// ${breakdown}`,
  ].join("\n")
}

function formatGithub(result: AuditResult): string {
  return result.violations
    .map((v) => `::error file=${v.file},line=${v.line},title=${v.rule}::${v.message}`)
    .join("\n")
}

function formatText(result: AuditResult): string {
  const out: string[] = []
  out.push("=".repeat(60))
  out.push("  Design System Governance Audit")
  out.push("=".repeat(60))
  out.push("")
  out.push(`Scope: ${result.scope.root}`)
  out.push(`Files scanned: ${result.scope.filesScanned} ${discoveryLabel(result.scope.discoveryMode)}`)
  out.push(`Violations: ${result.summary.totalViolations}`)
  if (result.summary.totalSuppressed > 0) {
    out.push(`Suppressed: ${result.summary.totalSuppressed}`)
  }
  if (result.summary.totalBaselined > 0) {
    out.push(`Baselined:  ${result.summary.totalBaselined}`)
  }
  out.push("")

  if (result.violations.length === 0) {
    out.push("No violations found. All audited files follow governance rules.")
    // Fall through to the suppressed section below — don't return early.
  } else {
    const byRule = new Map<string, Violation[]>()
    for (const v of result.violations) {
      if (!byRule.has(v.rule)) byRule.set(v.rule, [])
      byRule.get(v.rule)!.push(v)
    }

    for (const [ruleId, violations] of [...byRule.entries()].sort()) {
      const count = violations.length
      out.push(`-- ${ruleId} (${count} violation${count === 1 ? "" : "s"}) --`)
      for (const v of violations) out.push(formatViolation(v))
      out.push("")
    }

    out.push("-- By file --")
    for (const [file, count] of Object.entries(result.summary.byFile)) {
      out.push(`  ${String(count).padStart(3, " ")}  ${file}`)
    }
    out.push("")
  }

  if (result.suppressed.length > 0) {
    const total = result.suppressed.length
    const shown = Math.min(total, SUPPRESSED_DISPLAY_CAP)
    out.push(
      total > SUPPRESSED_DISPLAY_CAP
        ? `-- Suppressed (showing ${shown} of ${total}) --`
        : `-- Suppressed (${total}) --`,
    )
    for (const s of result.suppressed.slice(0, SUPPRESSED_DISPLAY_CAP)) {
      out.push(`  [${s.rule}] ${s.file}:${s.line} — ${s.reason}`)
    }
    if (total > SUPPRESSED_DISPLAY_CAP) {
      out.push(
        `  Re-run with --format json to see all ${total} — text output is capped at ${SUPPRESSED_DISPLAY_CAP}.`,
      )
    }
    out.push("")
  }

  return out.join("\n")
}

function formatViolation(v: Violation): string {
  const lines: string[] = []
  lines.push(`  [${v.rule}] ${v.file}:${v.line}`)
  lines.push(`    ${v.message}`)
  if (v.snippet) lines.push(`    -> ${truncateSnippet(v.snippet, 120)}`)
  if (v.fix) lines.push(`    Fix: ${v.fix}`)
  return lines.join("\n")
}
