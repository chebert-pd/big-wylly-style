import { dirname, isAbsolute, relative, resolve } from "node:path"
import { existsSync, readFileSync, statSync } from "node:fs"

/** Build a reverse-import graph: for each component file in `candidateFiles`,
 *  list the consumer files (also relative to scope root) that import from it.
 *
 *  We're intentionally regex-based here, not AST-based: this map only needs
 *  to know "does this file mention an import of that file?" — not the type
 *  semantics. Skipping the TS compiler keeps this step fast for large repos.
 *
 *  Resolves three import shapes:
 *   - `from "./foo"`           — relative to the importing file
 *   - `from "../bar"`          — same
 *   - `from "@/components/x"`  — path alias; we resolve against the tsconfig
 *                                 path mapping by treating `@/` as `<scope>/`
 *                                 if no tsconfig was provided. This is a
 *                                 best-effort heuristic; missed resolutions
 *                                 fall through without error. */
export interface ImportedByOptions {
  scopeRoot: string
  /** Files that may be imported by other files. Relative to scopeRoot. */
  candidateFiles: string[]
  /** All files that should be scanned for imports. Relative to scopeRoot. */
  scannedFiles: string[]
  /** Path-alias prefixes (e.g. "@/" → "src/"). If the consumer has a tsconfig
   *  with paths configured, the caller can pass them through. Otherwise we
   *  default to `@/` mapping to the scope root, which matches the Next.js /
   *  Vite default for app/ + src/-rooted projects. */
  pathAliases?: Record<string, string>
}

/** Default path-alias mapping. Most React projects use `@/` to mean "the
 *  source root" — Next.js's default `tsconfig.json` does this, as does the
 *  default Vite + shadcn template. */
const DEFAULT_ALIASES: Record<string, string> = {
  "@/": "",
}

const IMPORT_RE = /(?:from|import)\s+["']([^"']+)["']/g

/** Resolve an import specifier from the file at `fromAbs` to an absolute
 *  path of a candidate file, or null if it doesn't point at one. */
function resolveImport(
  scopeRoot: string,
  fromAbs: string,
  spec: string,
  candidateAbsSet: Set<string>,
  aliases: Record<string, string>,
): string | null {
  // Bare packages — skip immediately. They can't point at a local file.
  if (!spec.startsWith(".") && !spec.startsWith("/") && !startsWithAlias(spec, aliases)) {
    return null
  }

  let candidate: string
  if (spec.startsWith(".")) {
    candidate = resolve(dirname(fromAbs), spec)
  } else if (isAbsolute(spec)) {
    candidate = spec
  } else {
    const aliasMatch = matchAlias(spec, aliases)
    if (!aliasMatch) return null
    candidate = resolve(scopeRoot, aliasMatch.base, aliasMatch.rest)
  }

  // Try a few extensions/index conventions in order.
  const tries = [
    candidate,
    `${candidate}.tsx`,
    `${candidate}.ts`,
    join(candidate, "index.tsx"),
    join(candidate, "index.ts"),
  ]
  for (const c of tries) {
    if (candidateAbsSet.has(c)) return c
  }
  return null
}

function startsWithAlias(spec: string, aliases: Record<string, string>): boolean {
  for (const prefix of Object.keys(aliases)) {
    if (spec.startsWith(prefix)) return true
  }
  return false
}

function matchAlias(
  spec: string,
  aliases: Record<string, string>,
): { base: string; rest: string } | null {
  for (const [prefix, base] of Object.entries(aliases)) {
    if (spec.startsWith(prefix)) {
      return { base, rest: spec.slice(prefix.length) }
    }
  }
  return null
}

// node:path's `join` doesn't normalize a trailing path component pair the
// way we want when one half is empty; pull it in explicitly to keep
// resolution behavior predictable.
function join(a: string, b: string): string {
  if (b === "" || b === ".") return a
  return a.endsWith("/") ? `${a}${b}` : `${a}/${b}`
}

export function buildImportedByMap(options: ImportedByOptions): Map<string, string[]> {
  const aliases = options.pathAliases ?? DEFAULT_ALIASES
  const scopeRoot = resolve(options.scopeRoot)

  // Absolute paths of every candidate file we might be looking for as a
  // resolved import target.
  const candidateAbsSet = new Set<string>()
  for (const rel of options.candidateFiles) {
    candidateAbsSet.add(resolve(scopeRoot, rel))
  }

  const map = new Map<string, string[]>()
  for (const candidateRel of options.candidateFiles) {
    map.set(candidateRel, [])
  }

  for (const consumerRel of options.scannedFiles) {
    const consumerAbs = resolve(scopeRoot, consumerRel)
    let content: string
    try {
      // Skip files we can't stat — symlinks pointing at deleted targets, etc.
      if (!existsSync(consumerAbs) || !statSync(consumerAbs).isFile()) continue
      content = readFileSync(consumerAbs, "utf-8")
    } catch {
      continue
    }
    // Scan all import sources in this file.
    let match: RegExpExecArray | null
    // Reset lastIndex defensively since the regex is /g and shared above.
    const re = new RegExp(IMPORT_RE.source, "g")
    while ((match = re.exec(content)) !== null) {
      const spec = match[1]
      const resolved = resolveImport(scopeRoot, consumerAbs, spec, candidateAbsSet, aliases)
      if (!resolved) continue
      const resolvedRel = relative(scopeRoot, resolved)
      const list = map.get(resolvedRel)
      if (list && !list.includes(consumerRel)) {
        list.push(consumerRel)
      }
    }
  }

  return map
}
