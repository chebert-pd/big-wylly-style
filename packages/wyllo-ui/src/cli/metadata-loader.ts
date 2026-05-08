import { readFileSync, readdirSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

/** Constraints we extract from a component's metadata.json that the auditor can
 *  enforce against literal-prop usage of the component. */
export interface ComponentRule {
  /** variant values listed in metadata.variants.visual.forbidden */
  forbiddenVariants: string[]
  /** size values listed in metadata.variants.size.options. null when the
   *  component has no size scale or the metadata doesn't declare one. */
  allowedSizes: string[] | null
}

export type MetadataIndex = Record<string, ComponentRule>

let cached: MetadataIndex | null = null

/** Resolve the components directory at runtime.
 *  The CLI bundle lives at <pkg>/dist/cli/audit-governance.js.
 *  Component metadata lives at <pkg>/src/components/<name>/<name>.metadata.json
 *  (shipped via package.json `files`). Both layouts (DS internal and
 *  consumer-via-node_modules) resolve via `../../src/components` from the CLI. */
function resolveComponentsDir(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  return join(here, "..", "..", "src", "components")
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string")
}

function readRule(path: string): { name: string; rule: ComponentRule } | null {
  let raw: string
  try {
    raw = readFileSync(path, "utf-8")
  } catch {
    return null
  }
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof json !== "object" || json === null) return null
  const root = json as Record<string, unknown>

  const component = root.component as Record<string, unknown> | undefined
  const name = component && typeof component.name === "string" ? component.name : null
  if (!name) return null

  const variants = root.variants as Record<string, unknown> | undefined
  const visual = variants?.visual as Record<string, unknown> | undefined
  const forbidden = isStringArray(visual?.forbidden) ? (visual!.forbidden as string[]) : []

  const sizeBlock = variants?.size as Record<string, unknown> | undefined
  const sizeOptions = isStringArray(sizeBlock?.options)
    ? (sizeBlock!.options as string[])
    : null
  // Empty options array means "no size scale declared" — don't enforce.
  const allowedSizes = sizeOptions && sizeOptions.length > 0 ? sizeOptions : null

  return {
    name,
    rule: { forbiddenVariants: forbidden, allowedSizes },
  }
}

function walk(dir: string, out: string[]): void {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const entryName of entries) {
    const full = join(dir, entryName)
    let st
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      walk(full, out)
    } else if (entryName.endsWith(".metadata.json")) {
      out.push(full)
    }
  }
}

/** Load and cache the metadata index. The index is keyed by the JSX component
 *  name (from metadata.component.name). Components with no enforceable
 *  constraints are still indexed so future rules can extend cheaply. */
export function loadMetadataIndex(): MetadataIndex {
  if (cached) return cached
  const componentsDir = resolveComponentsDir()
  const files: string[] = []
  walk(componentsDir, files)

  const index: MetadataIndex = {}
  for (const file of files) {
    const result = readRule(file)
    if (result) index[result.name] = result.rule
  }
  cached = index
  return index
}

/** Test-only: clear the cached index. Used by unit tests; safe to no-op in production. */
export function __resetMetadataIndexForTests(): void {
  cached = null
}
