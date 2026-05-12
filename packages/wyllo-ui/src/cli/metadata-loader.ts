import { readFileSync, readdirSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, relative } from "node:path"

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

/** A metadata-loading problem the auditor wants to surface to the user.
 *  Distinct from violations — these signal that the metadata pipeline itself
 *  has a bug (malformed JSON, missing required field, wrong-typed field) that
 *  silently disables enforcement for a component. */
export interface MetadataValidationError {
  /** Absolute path to the .metadata.json file. */
  file: string
  /** Relative path under the components dir, for short display. */
  relativeFile: string
  /** Dotted path inside the JSON (e.g. `component.name`, `variants.visual.forbidden`). */
  field: string
  /** One-sentence description of what's wrong. */
  message: string
  /** "error" = the auditor cannot read this file's rules at all; "warning" =
   *  the file loaded but a specific field is malformed and that part of the
   *  rule was skipped. The CLI's --strict-metadata flag treats both as fatal. */
  severity: "error" | "warning"
}

interface MetadataLoadResult {
  index: MetadataIndex
  errors: MetadataValidationError[]
}

let cached: MetadataLoadResult | null = null

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

export interface ReadRuleResult {
  rule: { name: string; rule: ComponentRule } | null
  errors: Array<Omit<MetadataValidationError, "file" | "relativeFile">>
}

/** Parse a single .metadata.json file. Returns the extracted rule (if any)
 *  plus a list of validation problems. A file with a parse error returns
 *  `{rule: null, errors: [...]}` — the caller surfaces those problems and
 *  skips the file when building the index. Exported for direct unit testing. */
export function readRule(path: string): ReadRuleResult {
  const errors: ReadRuleResult["errors"] = []

  let raw: string
  try {
    raw = readFileSync(path, "utf-8")
  } catch (err) {
    errors.push({
      field: "(file)",
      severity: "error",
      message: `Could not read file: ${(err as Error).message}`,
    })
    return { rule: null, errors }
  }

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch (err) {
    errors.push({
      field: "(json)",
      severity: "error",
      message: `Invalid JSON: ${(err as Error).message}`,
    })
    return { rule: null, errors }
  }

  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    errors.push({
      field: "(root)",
      severity: "error",
      message: "Root value must be a JSON object",
    })
    return { rule: null, errors }
  }

  const root = json as Record<string, unknown>

  // component.name is required — without it the auditor has nothing to key on
  // and the file's rules silently disappear from MD-001 / MD-002 enforcement.
  const component = root.component
  if (component === undefined) {
    errors.push({
      field: "component",
      severity: "error",
      message: "Required field 'component' is missing",
    })
    return { rule: null, errors }
  }
  if (typeof component !== "object" || component === null || Array.isArray(component)) {
    errors.push({
      field: "component",
      severity: "error",
      message: "Field 'component' must be a JSON object",
    })
    return { rule: null, errors }
  }
  const componentObj = component as Record<string, unknown>
  const name = componentObj.name
  if (typeof name !== "string" || name.length === 0) {
    errors.push({
      field: "component.name",
      severity: "error",
      message: "Required field 'component.name' is missing or not a non-empty string",
    })
    return { rule: null, errors }
  }

  // variants block is optional. If present, validate its sub-fields strictly
  // so a typo (e.g. `variants.visual.forbiden`) becomes a loud error instead
  // of a silently-empty rule.
  const variants = root.variants
  let forbidden: string[] = []
  let allowedSizes: string[] | null = null

  if (variants !== undefined) {
    if (typeof variants !== "object" || variants === null || Array.isArray(variants)) {
      errors.push({
        field: "variants",
        severity: "warning",
        message: "Field 'variants' must be a JSON object — variant/size enforcement disabled for this component",
      })
    } else {
      const variantsObj = variants as Record<string, unknown>
      const visual = variantsObj.visual
      if (visual !== undefined) {
        if (typeof visual !== "object" || visual === null || Array.isArray(visual)) {
          errors.push({
            field: "variants.visual",
            severity: "warning",
            message: "Field 'variants.visual' must be a JSON object — forbidden-variant enforcement disabled for this component",
          })
        } else {
          const visualObj = visual as Record<string, unknown>
          if (visualObj.forbidden !== undefined) {
            if (isStringArray(visualObj.forbidden)) {
              forbidden = visualObj.forbidden
            } else {
              errors.push({
                field: "variants.visual.forbidden",
                severity: "warning",
                message: "Field 'variants.visual.forbidden' must be an array of strings — forbidden-variant enforcement disabled for this component",
              })
            }
          }
          if (visualObj.allowed !== undefined && !isStringArray(visualObj.allowed)) {
            errors.push({
              field: "variants.visual.allowed",
              severity: "warning",
              message: "Field 'variants.visual.allowed' must be an array of strings",
            })
          }
        }
      }

      const sizeBlock = variantsObj.size
      if (sizeBlock !== undefined) {
        if (typeof sizeBlock !== "object" || sizeBlock === null || Array.isArray(sizeBlock)) {
          errors.push({
            field: "variants.size",
            severity: "warning",
            message: "Field 'variants.size' must be a JSON object — size enforcement disabled for this component",
          })
        } else {
          const sizeObj = sizeBlock as Record<string, unknown>
          if (sizeObj.options !== undefined) {
            if (isStringArray(sizeObj.options)) {
              allowedSizes = sizeObj.options.length > 0 ? sizeObj.options : null
            } else {
              errors.push({
                field: "variants.size.options",
                severity: "warning",
                message: "Field 'variants.size.options' must be an array of strings — size enforcement disabled for this component",
              })
            }
          }
        }
      }
    }
  }

  return {
    rule: { name, rule: { forbiddenVariants: forbidden, allowedSizes } },
    errors,
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

function load(): MetadataLoadResult {
  if (cached) return cached
  const componentsDir = resolveComponentsDir()
  const files: string[] = []
  walk(componentsDir, files)

  const index: MetadataIndex = {}
  const errors: MetadataValidationError[] = []
  for (const file of files) {
    const result = readRule(file)
    const relativeFile = relative(componentsDir, file)
    for (const err of result.errors) {
      errors.push({ ...err, file, relativeFile })
    }
    if (result.rule) {
      index[result.rule.name] = result.rule.rule
    }
  }
  cached = { index, errors }
  return cached
}

/** Load and cache the metadata index. The index is keyed by the JSX component
 *  name (from metadata.component.name). Components with no enforceable
 *  constraints are still indexed so future rules can extend cheaply. */
export function loadMetadataIndex(): MetadataIndex {
  return load().index
}

/** Validation errors collected while loading the metadata index. The CLI
 *  surfaces these so a typo in `*.metadata.json` produces a visible warning
 *  instead of silently disabling MD-001 / MD-002 for the affected component. */
export function loadMetadataErrors(): MetadataValidationError[] {
  return load().errors
}

/** Test-only: clear the cached index. Used by unit tests; safe to no-op in production. */
export function __resetMetadataIndexForTests(): void {
  cached = null
}
