#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { collectAllViolations, resolveBaselinePath, runAudit } from "./auditor.js"
import { DEFAULT_BASELINE_FILENAME, writeBaseline } from "./baseline.js"
import { formatReport, formatSuggestion } from "./report.js"
import type { AuditOptions, BaselineMode, Mode } from "./types.js"

const HELP = `audit-governance — Design System governance auditor for @chebert-pd/ui

Usage:
  audit-governance [options]

Options:
  --scope <path>          Directory to audit (default: current directory)
  --rules <path>          Path to governance-rules.json (default: bundled rules)
  --include <glob>        Force-include files matching glob (repeatable)
  --exclude <glob>        Exclude files matching glob (repeatable)
  --all                   Audit all TSX/JSX, not just files importing @chebert-pd/ui
  --changed-only          Only audit files changed since base ref (uses git diff)
  --base-ref <ref>        Git base ref for --changed-only (default: origin/<PR base> or main)
  --mode <ds|consumer>    Rule applicability scope (default: auto-detected from scope)
  --baseline write        Write current violations to ${DEFAULT_BASELINE_FILENAME} and exit
  --baseline check        Filter results against the baseline (default if file exists)
  --no-baseline           Ignore the baseline even if a file is present
  --baseline-path <path>  Override baseline file location
  --suggest-suppressions <file>   Print a recommended file-wide directive for <file>
  --format <text|json|github>     Output format (default: text)
  --help                  Show this help
`

function detectMode(scope: string): Mode {
  try {
    const pkg = JSON.parse(readFileSync(join(resolve(scope), "package.json"), "utf-8"))
    if (pkg.name === "@chebert-pd/ui") return "ds"
  } catch {}
  return "consumer"
}

function getToolVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    const pkg = JSON.parse(readFileSync(resolve(here, "../../package.json"), "utf-8"))
    return pkg.version ?? "0.0.0"
  } catch {
    return "0.0.0"
  }
}

function parseRepeatable(value: string | string[] | undefined): string[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function main(): void {
  const { values } = parseArgs({
    options: {
      scope: { type: "string", default: "." },
      rules: { type: "string" },
      include: { type: "string", multiple: true },
      exclude: { type: "string", multiple: true },
      all: { type: "boolean", default: false },
      "changed-only": { type: "boolean", default: false },
      "base-ref": { type: "string" },
      mode: { type: "string" },
      baseline: { type: "string" },
      "no-baseline": { type: "boolean", default: false },
      "baseline-path": { type: "string" },
      "suggest-suppressions": { type: "string" },
      format: { type: "string", default: "text" },
      help: { type: "boolean", default: false },
    },
    strict: true,
  })

  if (values.help) {
    process.stdout.write(HELP)
    process.exit(0)
  }

  const format = values.format as string
  if (format !== "text" && format !== "json" && format !== "github") {
    process.stderr.write(`Invalid --format: ${format}. Use text, json, or github.\n`)
    process.exit(2)
  }

  const scope = values.scope as string
  const modeArg = values.mode as string | undefined
  if (modeArg !== undefined && modeArg !== "ds" && modeArg !== "consumer") {
    process.stderr.write(`Invalid --mode: ${modeArg}. Use ds or consumer.\n`)
    process.exit(2)
  }
  const mode: Mode = (modeArg as Mode | undefined) ?? detectMode(scope)

  const baselineArg = values.baseline as string | undefined
  const noBaseline = values["no-baseline"] as boolean
  const baselinePath = values["baseline-path"] as string | undefined
  const baselineMode = resolveBaselineMode(baselineArg, noBaseline, scope, baselinePath)

  const opts: AuditOptions = {
    scope,
    rulesPath: values.rules as string | undefined,
    include: parseRepeatable(values.include as string | string[] | undefined),
    exclude: parseRepeatable(values.exclude as string | string[] | undefined),
    all: values.all as boolean,
    changedOnly: values["changed-only"] as boolean,
    baseRef: values["base-ref"] as string | undefined,
    format,
    mode,
    baselineMode,
    baselinePath,
  }

  if (baselineMode === "write") {
    const all = collectAllViolations(opts, getToolVersion())
    const path = resolveBaselinePath(all.scopeRoot, baselinePath)
    writeBaseline(path, all.violations, { tool: `audit-governance@${getToolVersion()}`, scope: all.scopeRoot })
    process.stdout.write(`Wrote ${all.violations.length} entries to ${path}\n`)
    process.exit(0)
  }

  let result
  try {
    result = runAudit(opts, getToolVersion())
  } catch (err) {
    process.stderr.write(`audit-governance: ${(err as Error).message}\n`)
    process.exit(2)
  }

  const suggestFile = values["suggest-suppressions"] as string | undefined
  if (suggestFile) {
    process.stdout.write(formatSuggestion(result, suggestFile) + "\n")
    process.exit(0)
  }

  process.stdout.write(formatReport(result, opts.format) + "\n")
  process.exit(result.violations.length > 0 ? 1 : 0)
}

function resolveBaselineMode(
  arg: string | undefined,
  noBaseline: boolean,
  scope: string,
  baselinePath: string | undefined,
): BaselineMode {
  if (noBaseline) return "ignore"
  if (arg === "write") return "write"
  if (arg === "check") return "check"
  if (arg === "ignore") return "ignore"
  if (arg !== undefined) {
    process.stderr.write(`Invalid --baseline value: ${arg}. Use write, check, or ignore.\n`)
    process.exit(2)
  }
  const path = baselinePath
    ? (resolve(baselinePath))
    : join(resolve(scope), DEFAULT_BASELINE_FILENAME)
  return existsSync(path) ? "check" : "ignore"
}

main()
