import { existsSync, readFileSync, writeFileSync } from "node:fs"
import type { Violation } from "./types.js"

export interface BaselineEntry {
  file: string
  rule: string
  snippet: string
}

export interface BaselineFile {
  schemaVersion: 1
  tool: string
  createdAt: string
  scope: string
  entries: BaselineEntry[]
}

export const DEFAULT_BASELINE_FILENAME = ".govern-baseline.json"

function normalizeSnippet(s: string): string {
  return s.replace(/\s+/g, " ").trim()
}

export function loadBaseline(path: string): BaselineEntry[] | null {
  if (!existsSync(path)) return null
  try {
    const file = JSON.parse(readFileSync(path, "utf-8")) as BaselineFile
    if (file.schemaVersion !== 1 || !Array.isArray(file.entries)) {
      throw new Error(`Unsupported baseline schema at ${path}`)
    }
    return file.entries
  } catch (err) {
    throw new Error(`Failed to read baseline at ${path}: ${(err as Error).message}`)
  }
}

export function writeBaseline(
  path: string,
  violations: Violation[],
  opts: { tool: string; scope: string },
): void {
  const file: BaselineFile = {
    schemaVersion: 1,
    tool: opts.tool,
    createdAt: new Date().toISOString(),
    scope: opts.scope,
    entries: violations.map((v) => ({
      file: v.file,
      rule: v.rule,
      snippet: normalizeSnippet(v.snippet ?? ""),
    })),
  }
  writeFileSync(path, JSON.stringify(file, null, 2) + "\n", "utf-8")
}

export function partitionByBaseline(
  violations: Violation[],
  baseline: BaselineEntry[],
): { active: Violation[]; baselined: Violation[] } {
  const remaining = baseline.map((e) => ({ ...e, snippet: normalizeSnippet(e.snippet) }))
  const active: Violation[] = []
  const baselined: Violation[] = []

  for (const v of violations) {
    const key = normalizeSnippet(v.snippet ?? "")
    const idx = remaining.findIndex(
      (e) => e.file === v.file && e.rule === v.rule && e.snippet === key,
    )
    if (idx >= 0) {
      remaining.splice(idx, 1)
      baselined.push(v)
    } else {
      active.push(v)
    }
  }
  return { active, baselined }
}
