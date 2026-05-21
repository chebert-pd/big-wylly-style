import { readdirSync, statSync, readFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import type ts from "typescript"
import { createProgram, findTsconfig } from "./ts-program.js"
import { extractComponents } from "./extract-props.js"
import type { LocalComponent } from "./types.js"

/** Directories we never descend into when scanning a consumer repo. These are
 *  build outputs, dependency caches, and other places where any React-shaped
 *  file we find will be junk for shadow-detection purposes. */
const ALWAYS_EXCLUDE_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "out",
  ".next",
  ".vercel",
  ".turbo",
  ".git",
  "coverage",
  "__snapshots__",
])

/** File-name suffixes we skip — tests, stories, type declarations. */
const EXCLUDE_SUFFIXES = [
  ".test.tsx",
  ".spec.tsx",
  ".stories.tsx",
  ".test.ts",
  ".spec.ts",
  ".stories.ts",
  ".d.ts",
]

/** Minimum line count for a file to be considered a candidate component
 *  source. Stubs, barrel re-exports, and one-line wrappers below this
 *  threshold rarely yield useful shadow-detection signal and tend to inflate
 *  the candidate list with noise. */
const MIN_LINES_TO_SCAN = 10

export interface ScanResult {
  /** Successfully extracted components, deduplicated by (file, name). */
  components: LocalComponent[]
  /** Files (relative paths) that were big enough to send through TS prop
   *  extraction. Used for the summary's filesScanned count. */
  scannedFiles: string[]
  /** Every .tsx file under scope after directory/suffix exclusions but
   *  BEFORE the min-line filter is applied. The importedBy graph uses this
   *  so short files (under 10 lines) can still be counted as importers — a
   *  4-line page that imports `HeaderPage` is still a relevant signal. */
  allCandidateImporters: string[]
}

interface ScanOptions {
  /** Optional includes — when provided, only files matching at least one of
   *  these globs are scanned. The globs are evaluated against paths relative
   *  to the scope root. Implements a *very* small subset of glob syntax —
   *  see `globToRegex`. */
  include: string[]
  /** Extra exclude globs on top of the always-excluded dirs and suffixes. */
  exclude: string[]
}

/** Tiny glob-to-regex translator. Supports `*` (single path segment),
 *  `**` (any depth), `?` (single char), and literal characters. Good enough
 *  for the targeting patterns this CLI accepts; not a full minimatch. */
function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "(?:.*/)?")
    .replace(/\*\*/g, ".*")
    .replace(/\*/g, "[^/]*")
    .replace(/\?/g, "[^/]")
  return new RegExp(`^${escaped}$`)
}

function matchesAny(relPath: string, patterns: string[]): boolean {
  if (patterns.length === 0) return false
  return patterns.some((p) => globToRegex(p).test(relPath))
}

function walk(root: string, dir: string, out: string[]): void {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.startsWith(".") && entry !== ".") continue
    if (ALWAYS_EXCLUDE_DIRS.has(entry)) continue
    const full = join(dir, entry)
    let st
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      walk(root, full, out)
      continue
    }
    if (!entry.endsWith(".tsx")) continue
    if (EXCLUDE_SUFFIXES.some((suffix) => entry.endsWith(suffix))) continue
    out.push(full)
  }
}

function lineCountAtLeast(path: string, min: number): boolean {
  try {
    const content = readFileSync(path, "utf-8")
    let count = 1
    for (let i = 0; i < content.length; i++) {
      if (content.charCodeAt(i) === 10) count++
      if (count >= min) return true
    }
    return count >= min
  } catch {
    return false
  }
}

export function scanConsumer(
  tsApi: typeof ts,
  scopeRoot: string,
  options: ScanOptions,
): ScanResult {
  const absScope = resolve(scopeRoot)

  const allFiles: string[] = []
  walk(absScope, absScope, allFiles)

  // Apply user-provided filters once, then split into two lists: the broader
  // "could be an importer" list (no min-line filter) and the narrower
  // "could be a component definition" list (min-line filter applied).
  const importerCandidates: string[] = []
  const componentCandidates: string[] = []
  for (const file of allFiles) {
    const rel = relative(absScope, file)
    if (matchesAny(rel, options.exclude)) continue
    if (options.include.length > 0 && !matchesAny(rel, options.include)) continue
    importerCandidates.push(file)
    if (lineCountAtLeast(file, MIN_LINES_TO_SCAN)) {
      componentCandidates.push(file)
    }
  }

  const allCandidateImporters = importerCandidates.map((f) => relative(absScope, f))
  if (componentCandidates.length === 0) {
    return { components: [], scannedFiles: [], allCandidateImporters }
  }

  // Use the consumer's tsconfig if present so path aliases (e.g. `@/components/*`)
  // resolve when our extractor follows imported types.
  const tsconfigPath = findTsconfig(absScope)

  const program = createProgram(tsApi, {
    rootNames: componentCandidates,
    tsconfigPath,
  })
  const checker = program.getTypeChecker()

  const componentCandidateSet = new Set(componentCandidates)
  const components: LocalComponent[] = []
  const dedup = new Set<string>()
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue
    if (!componentCandidateSet.has(sourceFile.fileName)) continue
    const rel = relative(absScope, sourceFile.fileName)
    for (const extracted of extractComponents(tsApi, sourceFile, checker)) {
      const key = `${rel}::${extracted.name}`
      if (dedup.has(key)) continue
      dedup.add(key)
      components.push({ file: rel, name: extracted.name, props: extracted.props })
    }
  }

  return {
    components,
    scannedFiles: componentCandidates.map((f) => relative(absScope, f)),
    allCandidateImporters,
  }
}
