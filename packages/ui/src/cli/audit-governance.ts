#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { parseArgs } from "node:util"
import { collectAllViolations, resolveBaselinePath, runAudit } from "./auditor.js"
import { DEFAULT_BASELINE_FILENAME, writeBaseline } from "./baseline.js"
import { reportSkillFreshness } from "./freshness.js"
import { checkMetadataDrift, formatDriftReport } from "./metadata-drift.js"
import { loadMetadataErrors, type MetadataValidationError } from "./metadata-loader.js"
import { formatIssueReport, formatReport, formatSuggestion } from "./report.js"
import { resolveBundledSkillsRoot } from "./skill-utils.js"
import type { AuditOptions, BaselineMode, Mode } from "./types.js"

const HELP = `audit-governance — Design System governance auditor for @big-wylly-style/ui

Usage:
  audit-governance [options]
  audit-governance install-skill [--dest <path>] [--force] [--print-path]
  audit-governance discover [--scope <path>] [--format md|json] [--out <file>] [--threshold <n>]

Subcommands:
  install-skill           Copy the Claude Code skill bundled with this package
                          into the consumer repo's .claude/skills/ directory.
                          See \`audit-governance install-skill --help\` for options.
  discover                Fuzzy-detect local component shadows of DS exports
                          by comparing prop signatures. Out-of-band report,
                          not a CI gate. See \`audit-governance discover --help\`.

Options:
  --scope <path>          Directory to audit (default: current directory)
  --rules <path>          Path to governance-rules.json (default: bundled rules)
  --include <glob>        Force-include files matching glob (repeatable)
  --exclude <glob>        Exclude files matching glob (repeatable)
  --all                   Audit all TSX/JSX, not just files importing @big-wylly-style/ui
  --changed-only          Only audit files changed since base ref (uses git diff)
  --base-ref <ref>        Git base ref for --changed-only (default: origin/<PR base> or main)
  --mode <ds|consumer>    Rule applicability scope (default: auto-detected from scope)
  --baseline write        Write current violations to ${DEFAULT_BASELINE_FILENAME} and exit
  --baseline check        Filter results against the baseline (default if file exists)
  --no-baseline           Ignore the baseline even if a file is present
  --baseline-path <path>  Override baseline file location
  --suggest-suppressions <file>   Print a recommended file-wide directive for <file>
  --print-issue           Print a body suitable for filing a drift report with the DS team. Respects --format (markdown by default, json with --format json).
  --check-drift           Check metadata declarations vs. each component's TS signature and exit (DS-only)
  --strict-metadata       Exit non-zero if any *.metadata.json file fails schema validation (default: warn-only)
  --format <text|json|github|sarif>     Output format (default: text)
  --help                  Show this help
`

function detectMode(scope: string): Mode {
  try {
    const pkg = JSON.parse(readFileSync(join(resolve(scope), "package.json"), "utf-8"))
    if (pkg.name === "@big-wylly-style/ui") return "ds"
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

const INSTALL_SKILL_HELP = `audit-governance install-skill — Install the bundled Claude Code skill

Usage:
  audit-governance install-skill [options]

Options:
  --dest <path>           Target directory for the skill (default: .claude/skills/governance-auditor)
  --force                 Overwrite SKILL.md if it already exists
  --print-path            Print the source path inside the installed package and exit
  --help                  Show this help

The skill teaches Claude Code how to run and interpret the auditor. After
installing, restart Claude Code so it picks up the new skill.
`

function resolveSkillSource(): string {
  // CLI runs from <package>/dist/cli/audit-governance.js — the skill lives at
  // <package>/.claude/skills/governance-auditor/. Resolve relative to import.meta.url
  // so it works both in node_modules and in the local monorepo build.
  const here = dirname(fileURLToPath(import.meta.url))
  return resolve(here, "..", "..", ".claude", "skills", "governance-auditor")
}

function installSkill(args: string[]): void {
  let dest = ".claude/skills/governance-auditor"
  let force = false
  let printPath = false
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === "--help" || a === "-h") {
      process.stdout.write(INSTALL_SKILL_HELP)
      process.exit(0)
    } else if (a === "--force" || a === "-f") {
      force = true
    } else if (a === "--print-path") {
      printPath = true
    } else if (a === "--dest" || a === "-d") {
      const next = args[++i]
      if (!next) {
        process.stderr.write("audit-governance: --dest requires a path argument.\n")
        process.exit(2)
      }
      dest = next
    } else {
      process.stderr.write(`audit-governance: unknown install-skill option: ${a}\n`)
      process.exit(2)
    }
  }

  const sourceRoot = resolveSkillSource()
  const sourceFile = join(sourceRoot, "SKILL.md")
  if (!existsSync(sourceFile)) {
    process.stderr.write(
      `audit-governance: skill source not found at ${sourceFile}.\n` +
        "This usually means the @big-wylly-style/ui package was installed from a build that didn't ship the skill.\n",
    )
    process.exit(2)
  }

  if (printPath) {
    process.stdout.write(sourceRoot + "\n")
    process.exit(0)
  }

  const destRoot = resolve(process.cwd(), dest)
  const destFile = join(destRoot, "SKILL.md")
  if (existsSync(destFile) && !force) {
    process.stderr.write(
      `audit-governance: ${destFile} already exists. Re-run with --force to overwrite.\n`,
    )
    process.exit(1)
  }

  mkdirSync(destRoot, { recursive: true })
  copyFileSync(sourceFile, destFile)
  process.stdout.write(`Installed governance-auditor skill -> ${destFile}\n`)
  process.exit(0)
}

const DISCOVER_HELP = `audit-governance discover — Find local component shadows of DS exports

Usage:
  audit-governance discover [options]

Options:
  --scope <path>          Directory to analyze (default: current directory)
  --format <md|json>      Output format (default: md)
  --out <file>            Write report to a file (default: stdout)
  --threshold <0.0-1.0>   Minimum confidence to include (default: 0.5)
  --include <glob>        Force-include files (repeatable)
  --exclude <glob>        Exclude files (repeatable)
  --help                  Show this help

Discover mode does fuzzy shadow detection: it scans your consumer codebase for
React components whose prop signatures look similar to DS components (by name
or by overlapping prop names), even when the local name differs from the DS
export name. Output is a report, not a CI gate — the command always exits 0.

Requires the 'typescript' package to be installed in the consumer repo.
`

async function runDiscoverCli(args: string[]): Promise<void> {
  // We import the discover module lazily so the (heavy) typescript dependency
  // is only resolved when discover actually runs. Other subcommands stay fast.
  const { runDiscover } = await import("./discover/index.js")
  const { formatJson, formatMarkdown } = await import("./discover/format.js")

  let scope = "."
  let format: "md" | "json" = "md"
  let outFile: string | undefined
  let threshold = 0.5
  const include: string[] = []
  const exclude: string[] = []

  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === "--help" || a === "-h") {
      process.stdout.write(DISCOVER_HELP)
      process.exit(0)
    } else if (a === "--scope") {
      scope = requireArg(args, ++i, "--scope")
    } else if (a === "--format") {
      const v = requireArg(args, ++i, "--format")
      if (v !== "md" && v !== "json") {
        process.stderr.write(`audit-governance discover: --format must be 'md' or 'json' (got '${v}').\n`)
        process.exit(2)
      }
      format = v
    } else if (a === "--out") {
      outFile = requireArg(args, ++i, "--out")
    } else if (a === "--threshold") {
      const raw = requireArg(args, ++i, "--threshold")
      const n = Number(raw)
      if (!Number.isFinite(n) || n < 0 || n > 1) {
        process.stderr.write(`audit-governance discover: --threshold must be a number in [0,1] (got '${raw}').\n`)
        process.exit(2)
      }
      threshold = n
    } else if (a === "--include") {
      include.push(requireArg(args, ++i, "--include"))
    } else if (a === "--exclude") {
      exclude.push(requireArg(args, ++i, "--exclude"))
    } else {
      process.stderr.write(`audit-governance discover: unknown option: ${a}\n`)
      process.exit(2)
    }
  }

  let result
  try {
    result = await runDiscover({
      scope,
      format,
      out: outFile,
      threshold,
      include,
      exclude,
    }, getToolVersion())
  } catch (err) {
    process.stderr.write(`audit-governance discover: ${(err as Error).message}\n`)
    process.exit(2)
  }

  const rendered = format === "json" ? formatJson(result) : formatMarkdown(result)
  if (outFile) {
    const { writeFileSync } = await import("node:fs")
    writeFileSync(outFile, rendered)
    process.stdout.write(`Wrote discover report -> ${outFile}\n`)
  } else {
    process.stdout.write(rendered)
  }
  // Discover always exits 0 — it's a report, not a CI gate.
  process.exit(0)
}

function requireArg(args: string[], index: number, name: string): string {
  const v = args[index]
  if (v === undefined) {
    process.stderr.write(`audit-governance discover: ${name} requires a value.\n`)
    process.exit(2)
  }
  return v
}

function main(): void {
  const subcommand = process.argv[2]
  if (subcommand === "install-skill") {
    installSkill(process.argv.slice(3))
    return
  }
  if (subcommand === "discover") {
    runDiscoverCli(process.argv.slice(3)).catch((err) => {
      process.stderr.write(`audit-governance discover: ${(err as Error).message}\n`)
      process.exit(2)
    })
    return
  }

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
      "print-issue": { type: "boolean", default: false },
      "check-drift": { type: "boolean", default: false },
      "strict-metadata": { type: "boolean", default: false },
      format: { type: "string", default: "text" },
      help: { type: "boolean", default: false },
    },
    strict: true,
  })

  if (values.help) {
    process.stdout.write(HELP)
    process.exit(0)
  }

  if (values["check-drift"]) {
    const findings = checkMetadataDrift()
    process.stdout.write(formatDriftReport(findings) + "\n")
    const errors = findings.filter((f) => f.severity === "error").length
    process.exit(errors > 0 ? 1 : 0)
  }

  const format = values.format as string
  if (format !== "text" && format !== "json" && format !== "github" && format !== "sarif") {
    process.stderr.write(`Invalid --format: ${format}. Use text, json, github, or sarif.\n`)
    process.exit(2)
  }

  const scope = values.scope as string
  const modeArg = values.mode as string | undefined
  if (modeArg !== undefined && modeArg !== "ds" && modeArg !== "consumer") {
    process.stderr.write(`Invalid --mode: ${modeArg}. Use ds or consumer.\n`)
    process.exit(2)
  }
  const mode: Mode = (modeArg as Mode | undefined) ?? detectMode(scope)

  // Skill freshness check (consumer mode only; maintainer mode is silent).
  // Output goes to stderr regardless of --format so structured outputs on
  // stdout (json / sarif / github) aren't polluted. Never changes the exit
  // code — informational only.
  reportSkillFreshness({
    mode,
    packageSkillsRoot: resolveBundledSkillsRoot(import.meta.url),
    consumerSkillsRoot: resolve(process.cwd(), ".claude", "skills"),
    stderr: process.stderr,
  })

  const baselineArg = values.baseline as string | undefined
  const noBaseline = values["no-baseline"] as boolean
  const baselinePath = values["baseline-path"] as string | undefined
  const baselineMode = resolveBaselineMode(baselineArg, noBaseline, scope, baselinePath)

  const opts: AuditOptions = {
    scope,
    rulesPath: values.rules as string | undefined,
    include: parseRepeatable(values.include as string | string[] | undefined),
    exclude: parseRepeatable(values.exclude as string | string[] | undefined),
    // --print-issue implies --all so drift reports are comprehensive (DS-applicable
    // rules like PL-* / LC-* / IC-* / TY-* still fire on files that don't import
    // the DS yet). Passing both flags is a redundant no-op, not an error.
    all: (values.all as boolean) || (values["print-issue"] as boolean),
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

  // Surface metadata validation problems before any other output. These signal
  // a malformed *.metadata.json that silently disabled enforcement for the
  // affected component — they're independent of audit violations and should
  // always be visible (printed to stderr so they don't pollute structured
  // formats like SARIF / JSON / GitHub annotations).
  const metadataErrors = loadMetadataErrors()
  if (metadataErrors.length > 0) {
    process.stderr.write(formatMetadataErrors(metadataErrors))
  }

  const suggestFile = values["suggest-suppressions"] as string | undefined
  if (suggestFile) {
    process.stdout.write(formatSuggestion(result, suggestFile) + "\n")
    process.exit(0)
  }

  if (values["print-issue"]) {
    const printIssueFormat = format === "json" ? "json" : "markdown"
    process.stdout.write(formatIssueReport(result, printIssueFormat) + "\n")
    // --print-issue is informational; always exit 0 so the output can be piped
    // (e.g. `... --print-issue | gh issue create --body-file -`).
    process.exit(0)
  }

  process.stdout.write(formatReport(result, opts.format) + "\n")

  // --strict-metadata escalates metadata problems to a hard failure so CI can
  // block PRs that introduce malformed metadata even when the audit itself
  // would otherwise pass.
  if (values["strict-metadata"] && metadataErrors.length > 0) {
    process.exit(1)
  }
  process.exit(result.violations.length > 0 ? 1 : 0)
}

function formatMetadataErrors(errors: MetadataValidationError[]): string {
  const out: string[] = []
  out.push("============================================================")
  out.push(`  Metadata validation: ${errors.length} problem${errors.length === 1 ? "" : "s"}`)
  out.push("============================================================")
  for (const e of errors) {
    out.push(`  [${e.severity.toUpperCase()}] ${e.relativeFile} @ ${e.field}`)
    out.push(`    ${e.message}`)
  }
  out.push("")
  out.push("Note: metadata problems silently disable MD-001 / MD-002 enforcement for the")
  out.push("affected component. Fix the JSON or pass --strict-metadata to gate the audit on this.")
  out.push("")
  return out.join("\n") + "\n"
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

// Only run main() when invoked as a script, not when imported by tests.
// Realpath both sides because npm installs CLI bins as symlinks in
// node_modules/.bin/; Node resolves symlinks for import.meta.url but NOT for
// process.argv[1], so a naive comparison silently skips main() when invoked
// via the symlink.
function isMainModule(): boolean {
  const argv1 = process.argv[1]
  if (!argv1) return false
  try {
    return import.meta.url === pathToFileURL(realpathSync(argv1)).href
  } catch {
    return false
  }
}
if (isMainModule()) {
  main()
}
