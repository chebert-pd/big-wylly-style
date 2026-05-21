import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import type ts from "typescript"

/** Dynamic-import typescript so we don't drag the 60MB package into every
 *  consumer of @big-wylly-style/ui — only the `discover` subcommand pays
 *  this cost, and only at the moment it runs. */
export async function loadTypescript(): Promise<typeof ts> {
  try {
    const mod = await import("typescript")
    // ESM/CJS interop: typescript ships CJS, so the namespace is on `default`
    // when loaded via dynamic import in an ESM context.
    return (mod.default ?? mod) as typeof ts
  } catch {
    throw new Error(
      "audit-governance discover requires the 'typescript' package to be installed. " +
        "Run `npm install --save-dev typescript` (or pnpm/yarn equivalent) in this repo and try again."
    )
  }
}

/** Find the consumer's tsconfig.json by walking up from the scope root.
 *  Returns the absolute path or null if none is found within reasonable depth.
 *  This is best-effort — discover still works without a tsconfig, but it loses
 *  the ability to resolve path aliases the consumer uses. */
export function findTsconfig(scopeRoot: string): string | null {
  let dir = resolve(scopeRoot)
  const root = resolve("/")
  // 8 levels is enough for any sane monorepo layout; bail out otherwise.
  for (let i = 0; i < 8; i++) {
    const candidate = resolve(dir, "tsconfig.json")
    if (existsSync(candidate)) return candidate
    if (dir === root) return null
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
  return null
}

export interface CreateProgramOpts {
  /** Absolute paths to source files to include as roots. */
  rootNames: string[]
  /** If provided, the consumer's tsconfig is loaded and its compilerOptions
   *  + path aliases are merged into the defaults. */
  tsconfigPath?: string | null
}

/** Build a ts.Program suitable for type-info-only analysis. Type checking is
 *  intentionally lax (no strict, skipLibCheck on) — we want a usable
 *  TypeChecker, not a build verdict. */
export function createProgram(tsApi: typeof ts, opts: CreateProgramOpts): ts.Program {
  const baseOptions: ts.CompilerOptions = {
    target: tsApi.ScriptTarget.ES2020,
    module: tsApi.ModuleKind.ESNext,
    moduleResolution: tsApi.ModuleResolutionKind.Bundler,
    jsx: tsApi.JsxEmit.Preserve,
    allowJs: false,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    skipLibCheck: true,
    noEmit: true,
    strict: false,
    isolatedModules: false,
    resolveJsonModule: false,
  }

  let compilerOptions = baseOptions
  if (opts.tsconfigPath) {
    const configFile = tsApi.readConfigFile(opts.tsconfigPath, tsApi.sys.readFile)
    if (!configFile.error && configFile.config) {
      const parsed = tsApi.parseJsonConfigFileContent(
        configFile.config,
        tsApi.sys,
        dirname(opts.tsconfigPath),
      )
      // Merge: consumer's compilerOptions override defaults, but keep our
      // analysis-friendly overrides (noEmit, skipLibCheck, strict=false).
      compilerOptions = {
        ...baseOptions,
        ...parsed.options,
        noEmit: true,
        skipLibCheck: true,
        strict: false,
      }
    }
  }

  return tsApi.createProgram({
    rootNames: opts.rootNames,
    options: compilerOptions,
  })
}
