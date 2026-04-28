import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, resolve, sep } from "node:path"
import { execSync } from "node:child_process"

const DEFAULT_EXCLUDES = [
  "**/node_modules/**",
  "**/.next/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/coverage/**",
]

const SOURCE_EXTS = [".tsx", ".jsx"]
const DS_IMPORT_RE = /from\s+["']@chebert-pd\/ui(?:\/[^"']+)?["']/

function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "(?:.*/)?")
    .replace(/\*\*/g, ".*")
    .replace(/\*/g, "[^/]*")
    .replace(/\?/g, "[^/]")
  return new RegExp(`^${escaped}$`)
}

function matchesAny(relPath: string, patterns: RegExp[]): boolean {
  const normalized = relPath.split(sep).join("/")
  return patterns.some((p) => p.test(normalized))
}

function walk(root: string, scopeRoot: string, excludes: RegExp[], out: string[]): void {
  let entries: string[]
  try {
    entries = readdirSync(root)
  } catch {
    return
  }
  for (const name of entries) {
    const full = join(root, name)
    const rel = relative(scopeRoot, full)
    if (matchesAny(rel, excludes)) continue
    let stat
    try {
      stat = statSync(full)
    } catch {
      continue
    }
    if (stat.isDirectory()) {
      walk(full, scopeRoot, excludes, out)
    } else if (SOURCE_EXTS.some((ext) => name.endsWith(ext))) {
      if (name.includes(".metadata.")) continue
      out.push(full)
    }
  }
}

function importsDS(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, "utf-8")
    return DS_IMPORT_RE.test(content)
  } catch {
    return false
  }
}

function getChangedFiles(scopeRoot: string, baseRef: string): string[] {
  try {
    const repoRoot = execSync("git rev-parse --show-toplevel", {
      cwd: scopeRoot, encoding: "utf-8",
    }).trim()
    const output = execSync(
      `git diff --name-only --diff-filter=ACMR ${baseRef}...HEAD`,
      { cwd: repoRoot, encoding: "utf-8" },
    )
    return output
      .split("\n")
      .filter(Boolean)
      .map((p) => resolve(repoRoot, p))
  } catch (err) {
    throw new Error(
      `--changed-only failed: could not run git diff against '${baseRef}'. ` +
      `Make sure the ref exists and you're inside a git repo.`,
    )
  }
}

export interface DiscoverOptions {
  scope: string
  include: string[]
  exclude: string[]
  all: boolean
  changedOnly: boolean
  baseRef?: string
}

export function discoverFiles(opts: DiscoverOptions): string[] {
  const scopeRoot = resolve(opts.scope)
  const excludes = [...DEFAULT_EXCLUDES, ...opts.exclude].map(globToRegex)
  const includes = opts.include.map(globToRegex)

  let candidates: string[] = []

  if (opts.changedOnly) {
    const baseRef = opts.baseRef
      ?? (process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "main")
    const changed = getChangedFiles(scopeRoot, baseRef)
    candidates = changed.filter((f) => {
      if (!SOURCE_EXTS.some((ext) => f.endsWith(ext))) return false
      const rel = relative(scopeRoot, f)
      if (rel.startsWith("..") || rel.includes(`${sep}..`)) return false
      if (matchesAny(rel, excludes)) return false
      return true
    })
  } else {
    walk(scopeRoot, scopeRoot, excludes, candidates)
  }

  return candidates.filter((file) => {
    const rel = relative(scopeRoot, file)
    if (includes.length && matchesAny(rel, includes)) return true
    if (opts.all) return true
    return importsDS(file)
  })
}
