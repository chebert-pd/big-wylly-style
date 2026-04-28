import { readFileSync } from "node:fs"
import { basename, extname, relative, resolve } from "node:path"
import { discoverFiles } from "./discover.js"
import { runChecks } from "./rules.js"
import { isSuppressed, parseSuppressions } from "./suppression.js"
import type { AuditOptions, AuditResult, Severity, SuppressedViolation, Violation } from "./types.js"

const TOOL_NAME = "audit-governance"

export function runAudit(opts: AuditOptions, toolVersion: string): AuditResult {
  const scopeRoot = resolve(opts.scope)
  const files = discoverFiles({
    scope: scopeRoot,
    include: opts.include,
    exclude: opts.exclude,
    all: opts.all,
    changedOnly: opts.changedOnly,
    baseRef: opts.baseRef,
  })

  const violations: Violation[] = []
  const suppressed: SuppressedViolation[] = []

  for (const file of files) {
    let content: string
    try {
      content = readFileSync(file, "utf-8")
    } catch {
      continue
    }

    const rel = relative(scopeRoot, file)
    const componentName = basename(file, extname(file))
    const lines = content.split("\n")
    const suppressions = parseSuppressions(content)

    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1
      const found = runChecks({
        file: rel,
        line: lines[i],
        lineNum,
        componentName,
      })
      for (const v of found) {
        const sup = isSuppressed(suppressions, v.rule, lineNum)
        if (sup.suppressed) {
          suppressed.push({ ...v, reason: sup.reason })
        } else {
          violations.push(v)
        }
      }
    }
  }

  return {
    schemaVersion: "1.0",
    tool: { name: TOOL_NAME, version: toolVersion },
    scope: { root: scopeRoot, filesScanned: files.length },
    summary: buildSummary(violations, suppressed),
    violations,
    suppressed,
  }
}

function buildSummary(violations: Violation[], suppressed: SuppressedViolation[]) {
  const byRule: Record<string, number> = {}
  const byFile: Record<string, number> = {}
  const bySeverity: Record<Severity, number> = { error: 0, warning: 0 }

  for (const v of violations) {
    byRule[v.rule] = (byRule[v.rule] ?? 0) + 1
    byFile[v.file] = (byFile[v.file] ?? 0) + 1
    bySeverity[v.severity] += 1
  }

  return {
    totalViolations: violations.length,
    totalSuppressed: suppressed.length,
    byRule: Object.fromEntries(Object.entries(byRule).sort()),
    byFile: Object.fromEntries(Object.entries(byFile).sort((a, b) => b[1] - a[1])),
    bySeverity,
  }
}
