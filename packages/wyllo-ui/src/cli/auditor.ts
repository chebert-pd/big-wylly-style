import { readFileSync } from "node:fs"
import { basename, extname, isAbsolute, join, relative, resolve } from "node:path"
import { DEFAULT_BASELINE_FILENAME, loadBaseline, partitionByBaseline } from "./baseline.js"
import { discoverFiles } from "./discover.js"
import { runChecks } from "./rules.js"
import { isSuppressed, parseSuppressions } from "./suppression.js"
import type { AuditOptions, AuditResult, Severity, SuppressedViolation, Violation } from "./types.js"

const TOOL_NAME = "audit-governance"

export function resolveBaselinePath(scopeRoot: string, override: string | undefined): string {
  if (override) {
    return isAbsolute(override) ? override : resolve(override)
  }
  return join(scopeRoot, DEFAULT_BASELINE_FILENAME)
}

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

  const allViolations: Violation[] = []
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
        mode: opts.mode,
      })
      for (const v of found) {
        const sup = isSuppressed(suppressions, v.rule, lineNum)
        if (sup.suppressed) {
          suppressed.push({ ...v, reason: sup.reason })
        } else {
          allViolations.push(v)
        }
      }
    }
  }

  let violations = allViolations
  let baselined: Violation[] = []
  if (opts.baselineMode === "check") {
    const path = resolveBaselinePath(scopeRoot, opts.baselinePath)
    const entries = loadBaseline(path)
    if (entries) {
      const split = partitionByBaseline(allViolations, entries)
      violations = split.active
      baselined = split.baselined
    }
  }

  return {
    schemaVersion: "1.0",
    tool: { name: TOOL_NAME, version: toolVersion },
    scope: { root: scopeRoot, filesScanned: files.length },
    summary: buildSummary(violations, suppressed, baselined),
    violations,
    suppressed,
    baselined,
  }
}

function buildSummary(
  violations: Violation[],
  suppressed: SuppressedViolation[],
  baselined: Violation[],
) {
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
    totalBaselined: baselined.length,
    byRule: Object.fromEntries(Object.entries(byRule).sort()),
    byFile: Object.fromEntries(Object.entries(byFile).sort((a, b) => b[1] - a[1])),
    bySeverity,
  }
}

export function collectAllViolations(opts: AuditOptions, toolVersion: string): {
  scopeRoot: string
  filesScanned: number
  violations: Violation[]
  suppressed: SuppressedViolation[]
} {
  const ignoreOpts: AuditOptions = { ...opts, baselineMode: "ignore" }
  const result = runAudit(ignoreOpts, toolVersion)
  return {
    scopeRoot: result.scope.root,
    filesScanned: result.scope.filesScanned,
    violations: result.violations,
    suppressed: result.suppressed,
  }
}
