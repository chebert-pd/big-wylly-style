import { readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

/** A drift finding between a component's metadata and its TS signature. */
export interface DriftFinding {
  componentName: string
  metadataPath: string
  sourcePath: string
  field: "size" | "variant"
  severity: "error" | "warning"
  message: string
}

/** Resolve the components directory the same way metadata-loader does. */
function resolveComponentsDir(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  return join(here, "..", "..", "src", "components")
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

/** Extract string-literal values from a TS type union expression like
 *  `"default" | "sm" | "xs"`. Returns null when the value isn't a pure
 *  string-literal union (e.g. references an external type). */
function extractStringLiteralUnion(typeExpr: string): string[] | null {
  const trimmed = typeExpr.trim()
  // Pure string-literal union: every segment between `|` must be a quoted literal.
  const segments = trimmed.split("|").map((s) => s.trim())
  const values: string[] = []
  for (const seg of segments) {
    const m = seg.match(/^["']([^"']+)["']$/)
    if (!m) return null
    values.push(m[1])
  }
  return values.length > 0 ? values : null
}

/** Extract size or variant values from a component's TS source.
 *
 *  Heuristic: prefer an explicit prop-type union (`size?: "sm" | "md"`).
 *  Fall back to CVA variant keys (`size: { sm: "...", md: "..." }`).
 *  Returns null when neither pattern is found. */
function extractAllowedFromSource(source: string, field: "size" | "variant"): string[] | null {
  // 1. Explicit prop-type union — looks for `size?: "..." | "..."` (or variant?:).
  //    Matches up to a terminator that ends a TS type expression in a prop interface.
  const propRe = new RegExp(`\\b${field}\\??\\s*:\\s*([^;\\n}]+)`, "g")
  let propMatch: RegExpExecArray | null
  while ((propMatch = propRe.exec(source)) !== null) {
    const captured = propMatch[1]
    // Skip object-literal-looking captures (CVA variant blocks); those start with `{`.
    if (captured.trim().startsWith("{")) continue
    const literals = extractStringLiteralUnion(captured)
    if (literals) return literals
  }

  // 2. CVA variant keys — `size: { xs: "...", sm: "...", md: "..." }`
  const cvaRe = new RegExp(`\\b${field}\\s*:\\s*\\{([\\s\\S]*?)\\}`, "g")
  let cvaMatch: RegExpExecArray | null
  while ((cvaMatch = cvaRe.exec(source)) !== null) {
    const block = cvaMatch[1]
    const keys: string[] = []
    // Match identifier or quoted keys followed by `:` at the start of each entry.
    const keyRe = /(?:^|,)\s*(?:["']([^"']+)["']|([A-Za-z_$][A-Za-z0-9_$-]*))\s*:/g
    let keyMatch: RegExpExecArray | null
    while ((keyMatch = keyRe.exec(block)) !== null) {
      keys.push(keyMatch[1] ?? keyMatch[2])
    }
    if (keys.length > 0) return keys
  }

  return null
}

interface MetadataShape {
  component?: { name?: string }
  variants?: {
    visual?: { options?: unknown; forbidden?: unknown }
    size?: { options?: unknown; forbidden?: unknown }
  }
}

function readMetadata(path: string): MetadataShape | null {
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as MetadataShape
  } catch {
    return null
  }
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  if (!value.every((v) => typeof v === "string")) return null
  return value as string[]
}

/** Run the drift check across every component. Returns the list of findings. */
export function checkMetadataDrift(): DriftFinding[] {
  const findings: DriftFinding[] = []
  const componentsDir = resolveComponentsDir()
  const metadataFiles: string[] = []
  walk(componentsDir, metadataFiles)

  for (const metadataPath of metadataFiles) {
    const metadata = readMetadata(metadataPath)
    if (!metadata) continue

    const componentName = metadata.component?.name
    if (!componentName) continue

    // Source file is sibling: <component-dir>/<base>.tsx
    const dir = dirname(metadataPath)
    const baseName = metadataPath
      .split("/")
      .pop()!
      .replace(/\.metadata\.json$/, "")
    const sourcePath = join(dir, `${baseName}.tsx`)

    let source: string
    try {
      source = readFileSync(sourcePath, "utf-8")
    } catch {
      continue // No matching .tsx — skip silently (could be a non-component metadata file)
    }

    // Compare the two fields we currently enforce.
    for (const field of ["size", "variant"] as const) {
      const metadataField = field === "size" ? "size" : "visual"
      const declared = asStringArray(metadata.variants?.[metadataField]?.options)
      if (!declared || declared.length === 0) continue

      const fromSource = extractAllowedFromSource(source, field)
      if (!fromSource) continue

      const sourceSet = new Set(fromSource)
      const declaredSet = new Set(declared)
      const forbidden = asStringArray(metadata.variants?.[metadataField]?.forbidden) ?? []
      const forbiddenSet = new Set(forbidden)

      // Error: metadata declares a value the TS signature doesn't accept.
      const phantom = declared.filter((v) => !sourceSet.has(v))
      if (phantom.length > 0) {
        findings.push({
          componentName,
          metadataPath,
          sourcePath,
          field,
          severity: "error",
          message: `metadata declares ${field === "size" ? "size" : "variant"} value(s) [${phantom.join(", ")}] that the TS signature does not accept (allowed in source: [${fromSource.join(", ")}]). Either fix the metadata or add the value to the component.`,
        })
      }

      // Warning: TS signature has values the metadata neither lists in `options[]`
      // nor explicitly forbids. Values present in `forbidden[]` are treated as
      // documented intentional narrowing and don't warn.
      const missing = fromSource.filter((v) => !declaredSet.has(v) && !forbiddenSet.has(v))
      if (missing.length > 0) {
        findings.push({
          componentName,
          metadataPath,
          sourcePath,
          field,
          severity: "warning",
          message: `TS signature accepts ${field === "size" ? "size" : "variant"} value(s) [${missing.join(", ")}] not listed in metadata (declared: [${declared.join(", ")}], forbidden: [${forbidden.join(", ") || "(none)"}]). If this is intentional narrowing, add the value(s) to variants.${metadataField}.forbidden; otherwise the metadata is incomplete.`,
        })
      }
    }
  }

  return findings
}

/** Render findings as a text report. */
export function formatDriftReport(findings: DriftFinding[]): string {
  const out: string[] = []
  out.push("=".repeat(60))
  out.push("  Metadata-vs-TS Drift Check")
  out.push("=".repeat(60))
  out.push("")
  out.push(`Findings: ${findings.length}`)
  const errors = findings.filter((f) => f.severity === "error")
  const warnings = findings.filter((f) => f.severity === "warning")
  out.push(`  Errors:   ${errors.length}`)
  out.push(`  Warnings: ${warnings.length}`)
  out.push("")

  if (findings.length === 0) {
    out.push("No drift detected. Metadata matches TS signatures.")
    return out.join("\n")
  }

  const byComponent = new Map<string, DriftFinding[]>()
  for (const f of findings) {
    if (!byComponent.has(f.componentName)) byComponent.set(f.componentName, [])
    byComponent.get(f.componentName)!.push(f)
  }

  for (const [name, list] of [...byComponent.entries()].sort()) {
    out.push(`-- ${name} (${list.length} finding${list.length === 1 ? "" : "s"}) --`)
    for (const f of list) {
      out.push(`  [${f.severity}] ${f.field}: ${f.message}`)
      out.push(`    metadata: ${f.metadataPath}`)
      out.push(`    source:   ${f.sourcePath}`)
    }
    out.push("")
  }

  return out.join("\n")
}
