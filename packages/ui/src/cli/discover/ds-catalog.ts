import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { readdirSync, statSync } from "node:fs"
import type ts from "typescript"
import { createProgram } from "./ts-program.js"
import { extractComponents } from "./extract-props.js"
import type { DsComponentProps } from "./types.js"

export interface DsCatalog {
  /** One entry per DS component that exports a typed React component. */
  components: DsComponentProps[]
  /** propName → number of DS components that declare that prop. Used to
   *  down-weight universal props (className, children, style, …) when scoring
   *  similarity against consumer components. */
  propFrequency: Map<string, number>
}

/** Locate the DS source `src/components` directory. import.meta.url varies
 *  with how the code is loaded:
 *    - Bundled CLI:    `<pkg>/dist/cli/audit-governance.js`        → ../../src/components
 *    - Source / tests: `<pkg>/src/cli/discover/ds-catalog.ts`      → ../../components
 *    - Unbundled dist: `<pkg>/dist/cli/discover/ds-catalog.js`     → ../../../src/components
 *  We probe each candidate and pick the first one that exists, falling back
 *  to the bundled-CLI assumption if nothing matches (keeps behavior stable
 *  when statSync fails on an unfamiliar layout). */
function resolveDsComponentsDir(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    resolve(here, "..", "..", "src", "components"),
    resolve(here, "..", "..", "components"),
    resolve(here, "..", "..", "..", "src", "components"),
  ]
  for (const c of candidates) {
    try {
      if (statSync(c).isDirectory()) return c
    } catch {
      continue
    }
  }
  return candidates[0]
}

/** Walk DS components dir for `<componentName>/<componentName>.tsx` files. */
function findDsSourceFiles(dir: string): string[] {
  const out: string[] = []
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    if (entry.startsWith(".")) continue
    const sub = join(dir, entry)
    let st
    try {
      st = statSync(sub)
    } catch {
      continue
    }
    if (!st.isDirectory()) continue
    // DS convention: each component lives at `<name>/<name>.tsx`.
    const tsx = join(sub, `${entry}.tsx`)
    try {
      if (statSync(tsx).isFile()) out.push(tsx)
    } catch {
      // Component directory without a matching tsx — skip silently.
    }
  }
  return out
}

let cached: DsCatalog | null = null

/** Load and cache the DS prop catalog. The catalog is built from the DS's own
 *  source .tsx files via the TypeScript compiler API — `extends`, generics,
 *  and imported union types resolve correctly. */
export function loadDsCatalog(tsApi: typeof ts): DsCatalog {
  if (cached) return cached

  const componentsDir = resolveDsComponentsDir()
  const sourceFiles = findDsSourceFiles(componentsDir)
  if (sourceFiles.length === 0) {
    cached = { components: [], propFrequency: new Map() }
    return cached
  }

  // The DS package has its own tsconfig.json; pick it up so paths like
  // `@/lib/utils` (if used internally) resolve. We resolve from one level
  // above the components dir, where the DS package root lives.
  const pkgRoot = resolve(componentsDir, "..", "..")
  const tsconfigPath = join(pkgRoot, "tsconfig.json")

  const program = createProgram(tsApi, {
    rootNames: sourceFiles,
    tsconfigPath,
  })
  const checker = program.getTypeChecker()

  const components: DsComponentProps[] = []
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue
    if (!sourceFiles.includes(sourceFile.fileName)) continue
    for (const extracted of extractComponents(tsApi, sourceFile, checker)) {
      components.push({ name: extracted.name, props: extracted.props })
    }
  }

  // Some DS files export sub-components from the same file (Card + CardHeader
  // + CardContent + …). All of them legitimately live in the catalog because
  // a consumer's `LocalDescription` might shadow `CardDescription` etc. The
  // metadata loader's component.name field is the canonical "primary" name,
  // but sub-components are equally valid match targets for shadow detection.
  // Dedup by name in case of duplicate exports (last-write-wins is fine).
  const byName = new Map<string, DsComponentProps>()
  for (const c of components) byName.set(c.name, c)

  const frequency = new Map<string, number>()
  for (const c of byName.values()) {
    for (const p of c.props) {
      frequency.set(p, (frequency.get(p) ?? 0) + 1)
    }
  }

  cached = {
    components: [...byName.values()].sort((a, b) => a.name.localeCompare(b.name)),
    propFrequency: frequency,
  }
  return cached
}

/** Test-only: clear the cached DS catalog so test fixtures can rebuild it. */
export function __resetDsCatalogCacheForTests(): void {
  cached = null
}
