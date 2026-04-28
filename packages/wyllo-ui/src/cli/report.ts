import type { AuditResult, Violation } from "./types.js"

export function formatReport(result: AuditResult, format: "text" | "json" | "github"): string {
  switch (format) {
    case "json": return JSON.stringify(result, null, 2)
    case "github": return formatGithub(result)
    case "text": return formatText(result)
  }
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
  out.push(`Files scanned: ${result.scope.filesScanned}`)
  out.push(`Violations: ${result.summary.totalViolations}`)
  if (result.summary.totalSuppressed > 0) {
    out.push(`Suppressed: ${result.summary.totalSuppressed}`)
  }
  out.push("")

  if (result.violations.length === 0) {
    out.push("No violations found. All audited files follow governance rules.")
    return out.join("\n")
  }

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
  return out.join("\n")
}

function formatViolation(v: Violation): string {
  const lines: string[] = []
  lines.push(`  [${v.rule}] ${v.file}:${v.line}`)
  lines.push(`    ${v.message}`)
  if (v.snippet) lines.push(`    -> ${v.snippet.slice(0, 120)}`)
  if (v.fix) lines.push(`    Fix: ${v.fix}`)
  return lines.join("\n")
}
