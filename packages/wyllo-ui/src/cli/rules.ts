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
  "PL-001": { appliesTo: ["both"], severity: "error" },
  "PL-002": { appliesTo: ["both"], severity: "error" },
  "PL-003": { appliesTo: ["both"], severity: "error" },
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

interface CheckCtx {
  file: string
  line: string
  lineNum: number
  componentName: string
  mode: Mode
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
  checkPrimitiveLeakage,
  checkHardcodedColors,
  checkTailwindPalette,
  checkElevationCoherence,
]

export function runChecks(ctx: CheckCtx): Violation[] {
  const stripped = ctx.line.trim()
  if (stripped.startsWith("import ") || stripped.startsWith("//") || stripped.startsWith("*")) {
    return []
  }
  const out: Violation[] = []
  for (const fn of CHECKERS) out.push(...fn(ctx))
  return out.filter((v) => ruleAppliesInMode(v.rule, ctx.mode))
}
