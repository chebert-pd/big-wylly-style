import type { Mode, RuleMeta, Violation } from "./types.js"

export const RULE_META: Record<string, RuleMeta> = {
  "FG-001": { appliesTo: ["both"], severity: "error" },
  "BD-001": { appliesTo: ["both"], severity: "error" },
  "EL-001": { appliesTo: ["ds"],   severity: "error" },
  "EL-003": { appliesTo: ["both"], severity: "error" },
  "SC-001": { appliesTo: ["both"], severity: "error" },
  "SC-002": { appliesTo: ["both"], severity: "error" },
  "SC-003": { appliesTo: ["both"], severity: "error" },
  "TY-001": { appliesTo: ["both"], severity: "error" },
  "TY-002": { appliesTo: ["both"], severity: "error" },
  "TY-003": { appliesTo: ["both"], severity: "error" },
  "TY-004": { appliesTo: ["both"], severity: "error" },
  "PL-001": { appliesTo: ["both"], severity: "error" },
  "PL-002": { appliesTo: ["both"], severity: "error" },
  "PL-003": { appliesTo: ["both"], severity: "error" },
  "LC-002": { appliesTo: ["both"], severity: "error" },
  "LC-003": { appliesTo: ["both"], severity: "error" },
  "IC-002": { appliesTo: ["both"], severity: "error" },
  "IC-003": { appliesTo: ["both"], severity: "error" },
  "IC-004": { appliesTo: ["both"], severity: "error" },
  "IC-005": { appliesTo: ["both"], severity: "error" },
}

export function ruleAppliesInMode(ruleId: string, mode: Mode): boolean {
  const meta = RULE_META[ruleId]
  if (!meta) return true
  const at = meta.appliesTo as readonly string[]
  return at.includes("both") || at.includes(mode)
}

const TAILWIND_PALETTE = [
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime", "green",
  "emerald", "teal", "cyan", "sky", "blue", "indigo",
  "violet", "purple", "fuchsia", "pink", "rose",
]

const NAMED_WEIGHTS = [
  "font-thin", "font-extralight", "font-light", "font-normal",
  "font-medium", "font-semibold", "font-bold", "font-extrabold", "font-black",
]

const SCHEMES = ["destructive", "success", "warning", "info", "brand", "review"]

const PRIMITIVE_PATTERNS = [/gray-\d+/, /violet-\d+/, /orange-\d+/]

const HARDCODED_COLOR_PATTERNS = [
  /(?<!&)#[0-9a-fA-F]{3,8}\b/,
  /rgb\s*\(/,
  /rgba\s*\(/,
  /oklch\s*\(/,
  /hsl\s*\(/,
  /hsla\s*\(/,
]

const HEAVY_ELEVATIONS = ["elevation-overlay", "elevation-popover"]
const SMALL_COMPONENTS = new Set([
  "badge", "button", "input", "checkbox", "switch", "toggle",
  "radio", "label", "kbd", "spinner", "skeleton",
])

const ACCEPTED_TINY_SIZES = new Set(["10px", "11px"])

// TY-004 — preset class enforcement.
// Maps "text-{size}|{weight}" to the matching preset utility name.
const TY004_PRESET_LOOKUP: Record<string, string> = {
  "text-xs|420": "p-sm",
  "text-sm|420": "p",
  "text-base|420": "p-lg",
  "text-xs|520": "label-sm",
  "text-sm|520": "label-md",
  "text-base|520": "label-lg",
  "text-xs|620": "h4",
  "text-sm|620": "h3",
  "text-base|620": "h2",
  "text-2xl|620": "h1",
  "text-base|660": "data-sm",
  "text-xl|660": "data-md",
  "text-3xl|660": "data-lg",
}

const TY004_PRESET_BY_WEIGHT: Record<string, string> = {
  "420": ".p / .p-lg / .p-sm",
  "520": ".label-sm / .label-md / .label-lg",
  "620": ".h1 / .h2 / .h3 / .h4",
  "660": ".data-sm / .data-md / .data-lg",
}

// Escape hatch: any of these in the className value means a preset is
// already in play, so a co-occurring size/weight is treated as a deliberate
// override rather than drift. Bare `p` uses a negative lookahead so `p-4`
// (padding) doesn't mask the bare-body case.
const TY004_PRESET_CLASS_RE =
  /\b(?:h[1-4]|label-(?:sm|md|lg)|p-(?:sm|lg)|data-(?:sm|md|lg)|form-(?:label|control|data))\b|\bp(?![-\w])/

const TY004_TEXT_SIZE_RE =
  /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/

const TY004_FONT_WEIGHT_RE = /\bfont-\[(420|520|620|660)\]/

interface CheckCtx {
  file: string
  line: string
  lineNum: number
  componentName: string
  mode: Mode
  /** Full file content — used by file-level checks (e.g. LC-002 needs to know
   *  whether PageLayout appears anywhere in the file, not just on the matched line). */
  fileContent: string
}

function v(rule: string, ctx: CheckCtx, message: string, fix?: string): Violation {
  return {
    rule,
    severity: RULE_META[rule]?.severity ?? "error",
    file: ctx.file,
    line: ctx.lineNum,
    endLine: ctx.lineNum,
    column: null,
    message,
    snippet: ctx.line.trim(),
    fix,
  }
}

function checkForegroundHierarchy(ctx: CheckCtx): Violation[] {
  if (!ctx.line.includes("text-muted-foreground")) return []
  const patterns = [
    /<h1[^>]*text-muted-foreground/,
    /<h2[^>]*text-muted-foreground/,
    /text-muted-foreground[^"]*"[^>]*>.*<\/h1>/,
    /text-muted-foreground[^"]*"[^>]*>.*<\/h2>/,
    /["\s]h1["\s].*text-muted-foreground/,
    /text-muted-foreground.*["\s]h1["\s]/,
    /["\s]h2["\s].*text-muted-foreground/,
    /text-muted-foreground.*["\s]h2["\s]/,
  ]
  for (const p of patterns) {
    if (p.test(ctx.line)) {
      return [v("FG-001", ctx, "muted-foreground on h1/h2 element — top-level headings require full emphasis", "Use text-foreground for h1 and h2")]
    }
  }
  return []
}

function checkBorderHierarchy(ctx: CheckCtx): Violation[] {
  if (!ctx.line.includes("ring-ring")) return []
  const focusIndicators = [
    "focus-visible", "focus:", "focus-within:",
    ":focus-visible", ":focus", "data-[active=true]",
  ]
  if (focusIndicators.some((f) => ctx.line.includes(f))) return []
  return [v("BD-001", ctx, "ring token used outside focus state",
    "ring is exclusively for focus indicators — use border or input for non-focus borders")]
}

function checkElevationCoherence(ctx: CheckCtx): Violation[] {
  const out: Violation[] = []
  if (SMALL_COMPONENTS.has(ctx.componentName)) {
    for (const heavy of HEAVY_ELEVATIONS) {
      if (ctx.line.includes(heavy)) {
        out.push(v("EL-001", ctx,
          `${heavy} on small component '${ctx.componentName}' — heavy shadows break visual scale`,
          "Use elevation-surface or elevation-floating for small components"))
      }
    }
  }
  if (/shadow-y\d+/.test(ctx.line) && !ctx.line.includes("var(--shadow")) {
    out.push(v("EL-003", ctx,
      "Raw shadow primitive (shadow-y*) — use semantic elevation tokens",
      "Use elevation-surface, elevation-floating, elevation-overlay, or elevation-popover"))
  }
  return out
}

function checkSemanticColorPairing(ctx: CheckCtx): Violation[] {
  const out: Violation[] = []
  if (ctx.line.includes("bg-current")) return out

  const stripped = ctx.line.trim()
  if (stripped.startsWith("?") || stripped.startsWith(":")) {
    if (!ctx.line.includes("className") && !ctx.line.includes("cn(")) return out
  }

  for (const scheme of SCHEMES) {
    const re = new RegExp(`\\btext-${scheme}\\b(?!-)`)
    if (re.test(ctx.line)) {
      out.push(v("SC-001", ctx,
        `text-${scheme} uses the background tint token for text — nearly invisible`,
        `Use text-${scheme}-foreground instead`))
    }
  }

  const schemesOnLine = new Set<string>()
  for (const scheme of SCHEMES) {
    const re = new RegExp(`\\b(?:bg|text|border)-${scheme}(?:-|\\b)`)
    if (re.test(ctx.line)) schemesOnLine.add(scheme)
  }
  if (schemesOnLine.size > 1) {
    const mixed = [...schemesOnLine].sort().join(" + ")
    out.push(v("SC-002", ctx,
      `Cross-scheme mixing: ${mixed} tokens on the same line`,
      "Use tokens from a single scheme per element"))
  }

  for (const scheme of ["destructive", "brand"]) {
    const hasSolid = ctx.line.includes(`${scheme}-solid`)
    const tintedBgRe = new RegExp(`\\bbg-${scheme}\\b(?!-solid)`)
    const hasTintedBg = tintedBgRe.test(ctx.line)
    const hasTintedFg = ctx.line.includes(`text-${scheme}-foreground`)
    if (hasSolid && hasTintedBg) {
      const stateBgRe = new RegExp(`(?:focus|hover|active):bg-${scheme}\\b`)
      if (stateBgRe.test(ctx.line)) continue
    }
    if (hasSolid && (hasTintedBg || hasTintedFg)) {
      out.push(v("SC-003", ctx,
        `Mixing ${scheme} solid and tinted variants on the same element`,
        `Use either the tinted set (${scheme}/${scheme}-border/${scheme}-foreground) or the solid set (${scheme}-solid/${scheme}-solid-foreground)`))
    }
  }

  return out
}

function checkTypography(ctx: CheckCtx): Violation[] {
  const out: Violation[] = []
  const sizeMatch = ctx.line.match(/text-\[(\d+\.?\d*(?:px|rem|em))\]/)
  if (sizeMatch && !ACCEPTED_TINY_SIZES.has(sizeMatch[1])) {
    out.push(v("TY-002", ctx,
      `Arbitrary font size text-[${sizeMatch[1]}] — use the type scale`,
      "Use text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, or text-3xl"))
  }
  for (const weight of NAMED_WEIGHTS) {
    const re = new RegExp(`\\b${weight}\\b`)
    if (re.test(ctx.line)) {
      out.push(v("TY-001", ctx,
        `Named weight '${weight}' — use numeric weights`,
        "Use font-[420] (body), font-[520] (label), font-[620] (heading), or font-[660] (data)"))
    }
  }
  return out
}

function checkUppercase(ctx: CheckCtx): Violation[] {
  // Only fire when `uppercase` appears as a class utility or text-transform
  // value — not when it shows up in JSX text content describing the word.
  const inClassAttr = /(?:className|class)\s*=\s*(?:["'`])[^"'`]*\buppercase\b[^"'`]*(?:["'`])/.test(ctx.line)
  const inCnCall = /\bcn\s*\([^)]*\buppercase\b[^)]*\)/.test(ctx.line)
  const inStyle = /(?:textTransform|text-transform)\s*:\s*["'`]?uppercase["'`]?/.test(ctx.line)
  if (!inClassAttr && !inCnCall && !inStyle) return []
  const trackingMatch = ctx.line.match(/\btracking-(wide|wider|widest)\b/)
  const detail = trackingMatch ? `'uppercase' and '${trackingMatch[0]}'` : "'uppercase'"
  const fix = trackingMatch
    ? "Remove both. All-caps + wide letter-spacing is the small-label anti-pattern. Hierarchy comes from weight (.label-md, .label-sm) and color (text-muted-foreground), not casing."
    : "Remove 'uppercase'. Hierarchy comes from weight (.label-md, .label-sm) and color (text-muted-foreground), not casing."
  return [v("TY-003", ctx,
    `All-caps text styling ${detail} — use sentence case`,
    fix)]
}

function checkTypographyPresets(ctx: CheckCtx): Violation[] {
  // Extract everything inside className=/class= quoted values and cn() calls.
  // Scoping to class strings (rather than the whole line) prevents JSX element
  // names like <h1>, <p> from satisfying the preset-class escape hatch.
  const fragments: string[] = []
  for (const m of ctx.line.matchAll(/(?:className|class)\s*=\s*["'`]([^"'`]*)["'`]/g)) {
    fragments.push(m[1])
  }
  for (const m of ctx.line.matchAll(/\bcn\s*\(([^)]*)\)/g)) {
    fragments.push(m[1])
  }
  if (fragments.length === 0) return []
  const classText = fragments.join(" ")

  const sizeMatch = classText.match(TY004_TEXT_SIZE_RE)
  const weightMatch = classText.match(TY004_FONT_WEIGHT_RE)
  if (!sizeMatch || !weightMatch) return []

  // A preset is already in the class string — treat as a deliberate override.
  if (TY004_PRESET_CLASS_RE.test(classText)) return []

  const key = `text-${sizeMatch[1]}|${weightMatch[1]}`
  const exactPreset = TY004_PRESET_LOOKUP[key]

  const fix = exactPreset
    ? `Use .${exactPreset} (exact match for text-${sizeMatch[1]} + font-[${weightMatch[1]}])`
    : `Use ${TY004_PRESET_BY_WEIGHT[weightMatch[1]]} as the base + a size override (e.g., 'h1 text-${sizeMatch[1]}')`

  return [v("TY-004", ctx,
    `Raw text-${sizeMatch[1]} + font-[${weightMatch[1]}] — use a typography preset class`,
    fix)]
}

function checkPrimitiveLeakage(ctx: CheckCtx): Violation[] {
  const out: Violation[] = []
  for (const pattern of PRIMITIVE_PATTERNS) {
    const match = ctx.line.match(pattern)
    if (!match) continue
    if (ctx.line.includes("var(--")) continue
    const stripped = ctx.line.trim()
    if (stripped.startsWith("//") || stripped.startsWith("*")) continue
    out.push(v("PL-001", ctx,
      `Raw primitive token '${match[0]}' — use semantic tokens`,
      "Replace with the appropriate semantic token"))
  }
  return out
}

function checkHardcodedColors(ctx: CheckCtx): Violation[] {
  const stripped = ctx.line.trim()
  if (stripped.startsWith("//") || stripped.startsWith("*") || stripped.startsWith("type ")) return []
  if (!ctx.line.includes("className") && !ctx.line.includes("class=") &&
      !ctx.line.includes("cn(") && !ctx.line.includes("style")) return []
  for (const pattern of HARDCODED_COLOR_PATTERNS) {
    const match = ctx.line.match(pattern)
    if (match) {
      return [v("PL-002", ctx,
        `Hardcoded color value: ${match[0].slice(0, 30)}`,
        "Use a semantic color token from the design system")]
    }
  }
  return []
}

/** A Next.js App Router page file: ends in /page.tsx or /page.ts (and not a layout/route file). */
const PAGE_FILE_RE = /(?:^|\/)page\.(?:tsx|ts)$/

function checkLayoutPageHeaderWrapping(ctx: CheckCtx): Violation[] {
  if (!PAGE_FILE_RE.test(ctx.file)) return []
  // Fire on the line that introduces a Header element (opening tag).
  if (!/<Header(\s|>|\/)/.test(ctx.line)) return []
  // If the file already uses PageLayout anywhere, it's compliant.
  // Detect actual JSX usage, not the literal word in a comment or text content.
  if (/<PageLayout(\s|>|\/)/.test(ctx.fileContent)) return []
  return [v("LC-002", ctx,
    "<Header /> rendered in a page file without a PageLayout wrapper",
    "Wrap the page root in <PageLayout variant=\"stack\" | \"two-column\" | \"full\" size=\"...\"> so Header and body share size context")]
}

// Banned vertical-overflow icon variants — overflow menus must use MoreHorizontal.
const IC002_BANNED_ICONS = ["EllipsisVertical", "MoreVertical"] as const

function checkIconographyOverflowVertical(ctx: CheckCtx): Violation[] {
  const out: Violation[] = []
  for (const icon of IC002_BANNED_ICONS) {
    const re = new RegExp(`\\b${icon}\\b`)
    if (re.test(ctx.line)) {
      out.push(v("IC-002", ctx,
        `${icon} used — overflow menus must use MoreHorizontal for consistency`,
        "Replace with MoreHorizontal from lucide-react"))
    }
  }
  return out
}

/** Find the closing `>` or `/>` of a JSX opening tag starting at `start` in `src`.
 *  Skips over content inside string literals to avoid being confused by `>` in attribute values.
 *  Returns the offset of the character AFTER the closing `>`, or -1 if not found. */
function findOpeningTagEnd(src: string, start: number): number {
  let inString: '"' | "'" | "`" | "" = ""
  for (let i = start; i < Math.min(src.length, start + 2000); i++) {
    const c = src[i]
    if (inString) {
      if (c === inString) inString = ""
      continue
    }
    if (c === '"' || c === "'" || c === "`") {
      inString = c as '"' | "'" | "`"
      continue
    }
    if (c === ">") return i + 1
  }
  return -1
}

/** A "single icon child" body — exactly one self-closing PascalCase JSX element,
 *  with no surrounding text or other elements. Matches `<Trash />`, `<Trash className="..."/>`,
 *  `<Icon />`, etc. Does not match expressions like `{icon}`, multiple children, or text. */
const ICON_ONLY_BODY_RE = /^<[A-Z][A-Za-z0-9]*(?:\s[^<>]*)?\/>$/

function checkIconographyButtonIconOnly(ctx: CheckCtx): Violation[] {
  // Anchor on lines that introduce a <Button> opening tag — multi-line elements
  // are still detected because we stitch through fileContent below.
  const localStart = ctx.line.search(/<Button(?:\s|>)/)
  if (localStart < 0) return []

  // Compute byte offset of <Button in the full file content.
  const lines = ctx.fileContent.split("\n")
  let charsBeforeLine = 0
  for (let i = 0; i < ctx.lineNum - 1; i++) charsBeforeLine += lines[i].length + 1
  const tagStart = charsBeforeLine + localStart

  const openingEnd = findOpeningTagEnd(ctx.fileContent, tagStart)
  if (openingEnd < 0) return []

  const openingTag = ctx.fileContent.slice(tagStart, openingEnd)
  const isSelfClosing = openingTag.endsWith("/>")
  if (isSelfClosing) return [] // No body to inspect — not the icon-only-with-children case.

  // Body between opening's `>` and the next `</Button>`. We don't try to handle
  // nested <Button> elements — they're vanishingly rare and the cost of a false
  // miss is acceptable for this rule.
  const closeIdx = ctx.fileContent.indexOf("</Button>", openingEnd)
  if (closeIdx < 0) return []
  const body = ctx.fileContent.slice(openingEnd, closeIdx).trim()

  if (!ICON_ONLY_BODY_RE.test(body)) return [] // Has text, multiple children, or expression

  const hasIconOnly = /\biconOnly\b/.test(openingTag)
  const hasAriaLabel = /\baria-label\s*=/.test(openingTag)
  if (hasIconOnly && hasAriaLabel) return []

  const missing: string[] = []
  if (!hasIconOnly) missing.push("iconOnly")
  if (!hasAriaLabel) missing.push("aria-label")

  const fixHint = missing
    .map((p) => (p === "aria-label" ? 'aria-label="..."' : "iconOnly"))
    .join(" and ")

  return [v("IC-004", ctx,
    `Icon-only Button missing ${missing.join(" and ")} — required for square sizing and accessibility`,
    `Add ${fixHint} to the <Button>`)]
}

function checkIconographyTrash2(ctx: CheckCtx): Violation[] {
  if (!/\bTrash2\b/.test(ctx.line)) return []
  return [v("IC-003", ctx,
    "Trash2 used — design system uses the Trash icon (no line)",
    "Replace with Trash from lucide-react")]
}

// Icon libraries other than lucide-react. Imports from these packages should
// be replaced with the lucide-react equivalent.
const IC005_BANNED_PACKAGES = [
  "react-icons",
  "@heroicons/react",
  "@phosphor-icons/react",
  "phosphor-react",
  "feather-icons-react",
  "react-feather",
  "@tabler/icons-react",
  "tabler-icons-react",
  "bootstrap-icons-react",
  "@radix-ui/react-icons",
] as const

function checkIconographyLibrary(ctx: CheckCtx): Violation[] {
  const importMatch = ctx.line.match(/from\s+["']([^"']+)["']/)
  if (!importMatch) return []
  const path = importMatch[1]
  for (const pkg of IC005_BANNED_PACKAGES) {
    if (path === pkg || path.startsWith(`${pkg}/`)) {
      return [v("IC-005", ctx,
        `Icon library '${path}' — only lucide-react is allowed`,
        "Find the equivalent icon in lucide-react or request a custom addition")]
    }
  }
  return []
}

function checkLayoutHandRolledMaxWidth(ctx: CheckCtx): Violation[] {
  if (!PAGE_FILE_RE.test(ctx.file)) return []
  // If the file uses PageLayout, internal max-w usage is the user's call.
  // Detect actual JSX usage, not the literal word in a comment or text content.
  if (/<PageLayout(\s|>|\/)/.test(ctx.fileContent)) return []
  const out: Violation[] = []

  // max-w-{3xl,5xl,7xl,8xl} co-located with mx-auto on the same line.
  const co = /\bmax-w-(?:3xl|5xl|7xl|8xl)\b/.test(ctx.line) && /\bmx-auto\b/.test(ctx.line)
  if (co) {
    out.push(v("LC-003", ctx,
      "Hand-rolled max-w + mx-auto at page level",
      "Replace with <PageLayout size=\"sm|md|lg|xl|full\"> — same output, consistent across the system, automatic Header coordination"))
  }

  // Tailwind 'container' utility inside a className value.
  const inClass = /(?:className|class)\s*=\s*(?:["'`])[^"'`]*\bcontainer\b[^"'`]*(?:["'`])/.test(ctx.line)
  if (inClass) {
    out.push(v("LC-003", ctx,
      "'container' utility used at page level",
      "Replace with <PageLayout size=\"sm|md|lg|xl|full\"> — same output, consistent across the system"))
  }

  return out
}

function checkTailwindPalette(ctx: CheckCtx): Violation[] {
  const out: Violation[] = []
  for (const color of TAILWIND_PALETTE) {
    const re = new RegExp(`\\b(?:text|bg|border|ring|outline|shadow|from|to|via)-${color}-\\d+`)
    const match = ctx.line.match(re)
    if (!match) continue
    if (ctx.line.includes("var(--") && ctx.line.includes(`--color-${color}`)) continue
    out.push(v("PL-003", ctx,
      `Tailwind palette class '${match[0]}' bypasses design system`,
      "Use semantic tokens from the design system"))
  }
  return out
}

const CHECKERS = [
  checkForegroundHierarchy,
  checkSemanticColorPairing,
  checkBorderHierarchy,
  checkTypography,
  checkUppercase,
  checkTypographyPresets,
  checkPrimitiveLeakage,
  checkHardcodedColors,
  checkTailwindPalette,
  checkElevationCoherence,
  checkLayoutPageHeaderWrapping,
  checkLayoutHandRolledMaxWidth,
  checkIconographyOverflowVertical,
  checkIconographyTrash2,
  checkIconographyButtonIconOnly,
]

// Checkers that fire on import statements, before the global import-line filter.
const IMPORT_CHECKERS = [checkIconographyLibrary]

export function runChecks(ctx: CheckCtx): Violation[] {
  const stripped = ctx.line.trim()

  // Import-line checks always run — they exist specifically to catch import statements.
  const out: Violation[] = []
  for (const fn of IMPORT_CHECKERS) out.push(...fn(ctx))

  // The remaining checkers skip imports/comments to avoid noise on declaration-only lines.
  if (stripped.startsWith("import ") || stripped.startsWith("//") || stripped.startsWith("*")) {
    return out.filter((v) => ruleAppliesInMode(v.rule, ctx.mode))
  }
  for (const fn of CHECKERS) out.push(...fn(ctx))
  return out.filter((v) => ruleAppliesInMode(v.rule, ctx.mode))
}
