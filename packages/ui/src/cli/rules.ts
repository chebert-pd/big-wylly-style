import type { Mode, RuleMeta, Violation } from "./types.js"
import { loadMetadataIndex } from "./metadata-loader.js"

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
  "MD-001": { appliesTo: ["both"], severity: "error" },
  "MD-002": { appliesTo: ["both"], severity: "error" },
  "SF-002": { appliesTo: ["both"], severity: "error" },
  "CS-001": { appliesTo: ["both"], severity: "error" },
  "CS-002": { appliesTo: ["both"], severity: "error" },
  "CO-001": { appliesTo: ["both"], severity: "error" },
  "CO-002": { appliesTo: ["both"], severity: "error" },
  "CO-003": { appliesTo: ["both"], severity: "error" },
  "CO-004": { appliesTo: ["both"], severity: "warning" },
  "CO-005": { appliesTo: ["consumer"], severity: "warning" },
  "LC-001": { appliesTo: ["both"], severity: "error" },
  "BD-002": { appliesTo: ["both"], severity: "error" },
  "EL-002": { appliesTo: ["both"], severity: "error" },
  "FG-002": { appliesTo: ["both"], severity: "error" },
  "SF-001": { appliesTo: ["both"], severity: "warning" },
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

// BD-002 — hardcoded border color, either as a Tailwind arbitrary value
// (`border-[#hex]`, `border-t-[oklch(...)]`, etc.) or as an inline-style
// border property (`borderColor: "#hex"`, `border: "1px solid #hex"`, etc.).
// Matches the entire utility/property so PL-002 can strip the capture before
// its own scan and avoid double-firing on the same value.
const BD002_TW_ARBITRARY_RE =
  /\bborder(?:-(?:t|r|b|l|x|y|top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\s*\(|oklch\s*\(|hsla?\s*\()[^\]]*\]/g
const BD002_STYLE_RE =
  /\bborder(?:Color|TopColor|RightColor|BottomColor|LeftColor|Top|Right|Bottom|Left|Block|Inline)?\s*:\s*['"`][^'"`]*(?:#[0-9a-fA-F]{3,8}|rgba?\s*\(|oklch\s*\(|hsla?\s*\()[^'"`]*['"`]/g

// EL-002 — hardcoded box-shadow value. Matches Tailwind arbitrary shadow
// utilities (`shadow-[0_2px_8px_rgba(...)]`) and inline `boxShadow:` properties.
// Token-driven shadows (var(--shadow-…)) are explicitly allowed.
const EL002_TW_ARBITRARY_RE = /\bshadow-\[[^\]]+\]/g
const EL002_STYLE_RE = /\bboxShadow\s*:\s*['"`][^'"`]+['"`]/g

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

function v(rule: string, ctx: CheckCtx, message: string, fix?: string, snippet?: string): Violation {
  return {
    rule,
    severity: RULE_META[rule]?.severity ?? "error",
    file: ctx.file,
    line: ctx.lineNum,
    endLine: ctx.lineNum,
    column: null,
    message,
    // A rule can pass a custom snippet for cases where ctx.line.trim() doesn't
    // carry the evidence (e.g. IC-004's icon child usually lives on a different
    // line from the <Button> opening tag, so the default would show only the
    // opening tag and hide what made it icon-only).
    snippet: snippet ?? ctx.line.trim(),
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

function hasStyleableContext(line: string): boolean {
  return line.includes("className") || line.includes("class=") ||
    line.includes("cn(") || line.includes("style")
}

function isCommentOrTypeLine(line: string): boolean {
  const stripped = line.trim()
  return stripped.startsWith("//") || stripped.startsWith("*") || stripped.startsWith("type ")
}

// FG-002 — `text-primary-foreground` only renders correctly against a primary-colored
// surface. The auditor checks the same className (or extracted class fragments) for a
// matching primary surface utility. False positives are possible when the primary
// surface is applied via a parent component's variant (e.g. <Button variant="primary">
// child uses text-primary-foreground) — fires at `warning` severity for that reason,
// and consumers can suppress with `// govern:disable-next-line FG-002 -- inside <Button
// variant="primary">` when the context is clear.
const FG002_TEXT_RE = /\btext-primary-foreground\b/
// Surface utilities that justify text-primary-foreground:
//  - bg-primary (the primary brand surface, dark gray/black)
//  - bg-brand-solid (the brand violet solid surface; metadata calls primary-foreground "on primary-colored surfaces only")
// State prefixes (hover:, data-[state=checked]:, etc.) before bg-primary are also valid:
//   `data-[state=checked]:bg-primary` => element renders bg-primary in checked state, fg-primary correct there too
const FG002_PRIMARY_SURFACE_RE = /\b(?:bg-primary\b|bg-brand-solid\b)/

function checkPrimaryForegroundOutsidePrimarySurface(ctx: CheckCtx): Violation[] {
  if (!FG002_TEXT_RE.test(ctx.line)) return []
  // Extract className/cn() string fragments — same approach as TY-004 — so JSX
  // element names like <Button> can't accidentally satisfy a primary-surface match.
  const fragments: string[] = []
  for (const m of ctx.line.matchAll(/(?:className|class)\s*=\s*["'`]([^"'`]*)["'`]/g)) {
    fragments.push(m[1])
  }
  for (const m of ctx.line.matchAll(/\bcn\s*\(([^)]*)\)/g)) {
    fragments.push(m[1])
  }
  if (fragments.length === 0) return []
  const classText = fragments.join(" ")
  if (FG002_PRIMARY_SURFACE_RE.test(classText)) return []
  return [v("FG-002", ctx,
    "text-primary-foreground used without a primary surface (bg-primary or bg-brand-solid) on the same element — likely invisible or wrong-contrast",
    "Use text-foreground (or text-muted-foreground) on non-primary surfaces. If the primary surface comes from a parent component variant (e.g. <Button variant=\"primary\">), suppress with `// govern:disable-next-line FG-002 -- inside <Button variant=\"primary\">`.")]
}

// SF-001 — `bg-accent` is reserved for hover/active/focus state utilities.
// A bare `bg-accent` (not preceded by a state prefix like `hover:`,
// `data-[state=open]:`, `group-hover:`, etc.) signals static usage, which
// should be `bg-secondary` / `bg-muted` instead. The negative lookbehind
// blocks any non-space character before `bg-accent` — that covers state
// prefixes ending in `:` and any `data-[...]:` style modifier.
const SF001_BARE_ACCENT_RE = /(?<![:\w-])bg-accent\b(?!-)/

function checkAccentOnStaticContent(ctx: CheckCtx): Violation[] {
  if (!SF001_BARE_ACCENT_RE.test(ctx.line)) return []
  // Same class-fragment scoping as FG-002 to avoid matching prose.
  const fragments: string[] = []
  for (const m of ctx.line.matchAll(/(?:className|class)\s*=\s*["'`]([^"'`]*)["'`]/g)) {
    fragments.push(m[1])
  }
  for (const m of ctx.line.matchAll(/\bcn\s*\(([^)]*)\)/g)) {
    fragments.push(m[1])
  }
  if (fragments.length === 0) return []
  const classText = fragments.join(" ")
  if (!SF001_BARE_ACCENT_RE.test(classText)) return []
  return [v("SF-001", ctx,
    "bg-accent used on static content — accent is reserved for hover/focus/active states",
    "For static differentiation, use bg-secondary or bg-muted. If this IS meant to fire on state, prefix with the state utility (hover:bg-accent, data-[state=open]:bg-accent, etc.).")]
}

function checkBorderHardcoded(ctx: CheckCtx): Violation[] {
  if (isCommentOrTypeLine(ctx.line)) return []
  if (!hasStyleableContext(ctx.line)) return []
  const out: Violation[] = []
  for (const m of ctx.line.matchAll(BD002_TW_ARBITRARY_RE)) {
    out.push(v("BD-002", ctx,
      `Hardcoded border color in arbitrary value: ${m[0].slice(0, 40)}`,
      "Use a border token: border / border-subtle / input"))
  }
  for (const m of ctx.line.matchAll(BD002_STYLE_RE)) {
    out.push(v("BD-002", ctx,
      `Hardcoded border color in inline style: ${m[0].slice(0, 40)}`,
      "Use a CSS var bound to a border token (var(--color-border), var(--color-border-subtle), var(--color-input))"))
  }
  return out
}

function checkShadowHardcoded(ctx: CheckCtx): Violation[] {
  if (isCommentOrTypeLine(ctx.line)) return []
  if (!hasStyleableContext(ctx.line)) return []
  const out: Violation[] = []
  for (const m of ctx.line.matchAll(EL002_TW_ARBITRARY_RE)) {
    // Allow any token-bound shadow value: shadow-[var(--elevation-floating)],
    // shadow-[var(--shadow-…)], etc. The indirection through CSS variables IS
    // the themeable hook, so anything wrapping a `var(--…)` reference is
    // considered token-driven.
    if (m[0].includes("var(--")) continue
    out.push(v("EL-002", ctx,
      `Hardcoded box-shadow value: ${m[0].slice(0, 60)}`,
      "Use a semantic elevation token: elevation-surface / elevation-floating / elevation-overlay / elevation-popover"))
  }
  for (const m of ctx.line.matchAll(EL002_STYLE_RE)) {
    if (m[0].includes("var(--")) continue
    out.push(v("EL-002", ctx,
      `Hardcoded box-shadow value in inline style: ${m[0].slice(0, 60)}`,
      "Use a CSS var bound to an elevation token (e.g. var(--elevation-floating))"))
  }
  return out
}

function checkHardcodedColors(ctx: CheckCtx): Violation[] {
  if (isCommentOrTypeLine(ctx.line)) return []
  if (!hasStyleableContext(ctx.line)) return []

  // Strip BD-002 / EL-002 captures so PL-002 doesn't double-fire on the same
  // hardcoded value. A line like `border-[#fff] bg-[#000]` still flags both —
  // BD-002 on the border, PL-002 on the bg — because only the border capture
  // is removed here.
  let scoped = ctx.line
  scoped = scoped.replace(BD002_TW_ARBITRARY_RE, "")
  scoped = scoped.replace(BD002_STYLE_RE, "")
  scoped = scoped.replace(EL002_TW_ARBITRARY_RE, "")
  scoped = scoped.replace(EL002_STYLE_RE, "")

  for (const pattern of HARDCODED_COLOR_PATTERNS) {
    const match = scoped.match(pattern)
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

// LC-001 — <PageLayout> or <PageContainer> must not be rendered inside <SidePanel>.
// SidePanel is itself a constrained, fixed-width surface; nesting a page-level
// width container inside compounds the constraint and shrinks content unpredictably.
const LC001_FORBIDDEN_TAGS = ["PageLayout", "PageContainer"] as const

function checkPageLayoutInSidePanel(ctx: CheckCtx): Violation[] {
  const out: Violation[] = []
  for (const tag of LC001_FORBIDDEN_TAGS) {
    const re = new RegExp(`<${tag}(?=[\\s>/])`)
    const localStart = ctx.line.search(re)
    if (localStart < 0) continue
    const offset = fileOffsetFor(ctx.fileContent, ctx.lineNum, localStart)
    if (jsxAncestorDepth(ctx.fileContent, "SidePanel", offset) <= 0) continue
    out.push(v("LC-001", ctx,
      `<${tag}> rendered inside <SidePanel> — SidePanel is already a constrained surface and must not contain a page-level width container`,
      `Remove the <${tag}> wrapper. Use <Stack> (or plain vertical spacing) for SidePanel content. Reserve <PageLayout>/<PageContainer> for the main content area.`))
  }
  return out
}

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
 *  Skips over:
 *  - content inside string literals (`"..."`, `'...'`, `` `...` ``)
 *  - content inside JSX attribute expressions (`{...}`) — so `>` characters in
 *    arrow functions like `onClick={() => router.push("/foo")}` don't
 *    prematurely terminate the tag.
 *  Returns the offset of the character AFTER the closing `>`, or -1 if not found. */
function findOpeningTagEnd(src: string, start: number): number {
  let inString: '"' | "'" | "`" | "" = ""
  let braceDepth = 0
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
    if (c === "{") { braceDepth++; continue }
    if (c === "}") { if (braceDepth > 0) braceDepth--; continue }
    if (braceDepth > 0) continue
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

  // Custom snippet: include the body so the reader can see what made the
  // Button icon-only without opening the file. Collapse internal whitespace
  // (the source often spans multiple lines) and tidy `<\s` / `\s>` artifacts.
  const customSnippet = `${openingTag}${body}</Button>`
    .replace(/\s+/g, " ")
    .replace(/\s>/g, ">")
    .replace(/<\s/g, "<")

  return [v("IC-004", ctx,
    `Icon-only Button missing ${missing.join(" and ")} — required for square sizing and accessibility`,
    `Add ${fixHint} to the <Button>`,
    customSnippet)]
}

/** Convert a (1-based lineNum, 0-based local column) pair into a file-content
 *  offset. Used by ancestor-check rules that anchor on a line match but need
 *  to look up the surrounding JSX tree in the full file content. */
function fileOffsetFor(fileContent: string, lineNum: number, localCol: number): number {
  const lines = fileContent.split("\n")
  let charsBeforeLine = 0
  for (let i = 0; i < lineNum - 1; i++) charsBeforeLine += lines[i].length + 1
  return charsBeforeLine + localCol
}

/** Count unclosed `<Tag>` opens before `offset` in `fileContent`, ignoring
 *  self-closing tags and ignoring tags inside string/template literals. The tag
 *  match uses a `(?=[\s>/])` lookahead so `<Card` does NOT also match
 *  `<CardHeader`, `<CardContent`, etc.
 *
 *  Returns the open depth at `offset` — a positive number means we are
 *  currently inside one or more `<Tag>` elements at that point. */
function jsxAncestorDepth(fileContent: string, tag: string, offset: number): number {
  const slice = fileContent.slice(0, offset)
  // Strip string/template-literal content cheaply by replacing them with empty
  // strings. The pattern handles `"..."`, `'...'`, and `` `...` `` including
  // simple escapes — good enough to avoid being fooled by tag-like substrings
  // inside JSX attribute values or CodeSnippet children.
  const stripped = slice.replace(/`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""')
  const openRe = new RegExp(`<${tag}(?=[\\s>/])`, "g")
  const selfCloseRe = new RegExp(`<${tag}\\b[^>]*/>`, "g")
  const closeRe = new RegExp(`</${tag}\\s*>`, "g")
  const opens = stripped.match(openRe)?.length ?? 0
  const selfCloses = stripped.match(selfCloseRe)?.length ?? 0
  const closes = stripped.match(closeRe)?.length ?? 0
  return opens - selfCloses - closes
}

function checkChoiceCardInCard(ctx: CheckCtx): Violation[] {
  const localStart = ctx.line.search(/<ChoiceCard(?=[\s>/])/)
  if (localStart < 0) return []
  const offset = fileOffsetFor(ctx.fileContent, ctx.lineNum, localStart)
  if (jsxAncestorDepth(ctx.fileContent, "Card", offset) <= 0) return []
  return [v("CO-001", ctx,
    "<ChoiceCard> nested inside <Card> — ChoiceCard is itself a card surface and must not stack inside another Card",
    "Lift the ChoiceCard out of the surrounding <Card>. ChoiceCards belong directly inside <RadioGroup> or another collection wrapper, not inside another card surface.")]
}

// Form controls that must be wrapped in <Field> per the design system convention.
// Matching uses the `(?=[\s>/])` lookahead so e.g. <RadioGroupItem> does not
// collide with <RadioGroup>.
const CO002_FORM_CONTROLS = [
  "Input", "Textarea", "Select", "Combobox",
  "RadioGroup", "Checkbox", "Switch",
] as const

function checkFieldWrapping(ctx: CheckCtx): Violation[] {
  const out: Violation[] = []
  for (const control of CO002_FORM_CONTROLS) {
    const re = new RegExp(`<${control}(?=[\\s>/])`)
    const localStart = ctx.line.search(re)
    if (localStart < 0) continue
    const offset = fileOffsetFor(ctx.fileContent, ctx.lineNum, localStart)
    // Valid wrappers:
    //  - <Field> ... <FieldContent>...</FieldContent>...</Field> (single-control static path)
    //  - <Form> ... <FormField render={(field) => <FormControl>...</FormControl>}> (react-hook-form path)
    //  - <FieldSet> ... <FieldLegend>...</FieldLegend>...</FieldSet> (grouped-control path,
    //    only valid for RadioGroup — which is itself a labeled group of options. Single controls
    //    inside a FieldSet still need their own Field per-control.)
    if (jsxAncestorDepth(ctx.fileContent, "Field", offset) > 0) continue
    if (jsxAncestorDepth(ctx.fileContent, "FormControl", offset) > 0) continue
    if (control === "RadioGroup" &&
        jsxAncestorDepth(ctx.fileContent, "FieldSet", offset) > 0) continue
    out.push(v("CO-002", ctx,
      `<${control}> not wrapped in <Field> (or <FormControl> for react-hook-form${control === "RadioGroup" ? "; <FieldSet> is also valid for grouped radio options" : ""}) — form controls need a wrapper for label association, spacing, and error slot`,
      control === "RadioGroup"
        ? `Wrap in <FieldSet><FieldLegend>...</FieldLegend><RadioGroup>...</RadioGroup></FieldSet> for the group, with each option as <Field orientation="horizontal">...<RadioGroupItem /></Field>. Or use <Field> + <FieldContent><RadioGroup>...</RadioGroup></FieldContent>.`
        : `Wrap in <Field><FieldLabel>...</FieldLabel><FieldContent><${control} ... /></FieldContent><FieldError /></Field>. For react-hook-form: <FormField render={({ field }) => (<FormItem><FormControl><${control} {...field} /></FormControl></FormItem>)} />.`))
  }
  return out
}

function checkContextMenuTrigger(ctx: CheckCtx): Violation[] {
  const localStart = ctx.line.search(/<ContextMenuTrigger(?=[\s>/])/)
  if (localStart < 0) return []

  // Compute the body of this <ContextMenuTrigger> element from the file.
  // The trigger should fire on right-click on its wrapped subtree — putting a
  // <Button> inside (with or without `asChild`) turns it into a click-activated
  // menu, which is what DropdownMenu is for.
  const offset = fileOffsetFor(ctx.fileContent, ctx.lineNum, localStart)
  const openingEnd = findOpeningTagEnd(ctx.fileContent, offset)
  if (openingEnd < 0) return []

  const openingTag = ctx.fileContent.slice(offset, openingEnd)
  if (openingTag.endsWith("/>")) return [] // self-closing — no body

  const closeIdx = ctx.fileContent.indexOf("</ContextMenuTrigger>", openingEnd)
  if (closeIdx < 0) return []
  const body = ctx.fileContent.slice(openingEnd, closeIdx)

  if (!/<Button(?=[\s>/])/.test(body)) return []
  return [v("CO-003", ctx,
    "<ContextMenuTrigger> wraps a <Button> — ContextMenu fires on right-click and must not be activated by a button",
    "Use <DropdownMenu> for button-activated action lists. Reserve <ContextMenu> for right-click on a content surface (table row, card, canvas, etc.)")]
}

// Navigation calls that should not appear inside a <Button> onClick handler.
// These are coarse signals — they only catch the obvious "Button as link"
// anti-pattern. Truly semantic catches (does this onClick actually navigate?)
// are out of reach for static analysis, so CO-004 fires at `warning` severity.
const CO004_NAV_CALLS = [
  /\brouter\.(?:push|replace|back|forward)\s*\(/,
  /\bwindow\.location\b/,
  /\bhistory\.(?:push|replace)\s*\(/,
  /\bnavigate\s*\(/,
]

function checkButtonVsLink(ctx: CheckCtx): Violation[] {
  const out: Violation[] = []

  const buttonStart = ctx.line.search(/<Button(?=[\s>/])/)
  if (buttonStart >= 0) {
    const offset = fileOffsetFor(ctx.fileContent, ctx.lineNum, buttonStart)
    const openingEnd = findOpeningTagEnd(ctx.fileContent, offset)
    if (openingEnd > 0) {
      const openingTag = ctx.fileContent.slice(offset, openingEnd)
      if (/\bhref\s*=/.test(openingTag)) {
        out.push(v("CO-004", ctx,
          "<Button> with href — Button triggers actions; use <Link> for navigation",
          "Replace with <Link href=\"...\">. If you need the visual treatment of a Button while navigating, render <Button asChild><Link href=\"...\">…</Link></Button>."))
      }
      if (/\bonClick\s*=/.test(openingTag) &&
          CO004_NAV_CALLS.some((re) => re.test(openingTag))) {
        out.push(v("CO-004", ctx,
          "<Button onClick=...> performs navigation — Button is for actions, use <Link> instead",
          "Replace with <Link href=\"...\">. Buttons triggering router.push / window.location should almost always be Links — they break middle-click, cmd-click, and assistive tech expectations."))
      }
    }
  }

  const linkStart = ctx.line.search(/<Link(?=[\s>/])/)
  if (linkStart >= 0) {
    const offset = fileOffsetFor(ctx.fileContent, ctx.lineNum, linkStart)
    const openingEnd = findOpeningTagEnd(ctx.fileContent, offset)
    if (openingEnd > 0) {
      const openingTag = ctx.fileContent.slice(offset, openingEnd)
      if (!/\bhref\s*=/.test(openingTag)) {
        out.push(v("CO-004", ctx,
          "<Link> without href — Link navigates; use <Button> for click-only actions",
          "Either add href=\"...\" or replace with <Button onClick=...>. A Link without href is not navigable, which defeats its purpose."))
      }
    }
  }

  return out
}

function checkCardGhostTone(ctx: CheckCtx): Violation[] {
  // Fire when a <Card> JSX opening tag carries bg-transparent in its className.
  // The CVA definition inside Card.tsx uses lowercase variant keys (ghost: "...bg-transparent..."),
  // not <Card> JSX, so this scope naturally skips the design-system source.
  if (!/<Card\b[^>]*bg-transparent/.test(ctx.line)) return []
  return [v("SF-002", ctx,
    "<Card> with bg-transparent — use tone=\"ghost\" instead",
    "Replace bg-transparent with tone=\"ghost\" so Card surface intent flows through the design system")]
}

// CS-001 — className merging must go through cn().
// Catches the two unambiguous violations: template literals with interpolation,
// and string concatenation with `+`. Skips when the expression already starts
// with cn(/clsx(/cva( — those are already merging through a helper.
const CS001_TEMPLATE_RE = /className\s*=\s*\{\s*`[^`]*\$\{/
const CS001_CONCAT_RE = /className\s*=\s*\{[^}]*(?:"[^"]*"\s*\+|\+\s*"[^"]*")/
const CS001_WRAPPED_RE = /className\s*=\s*\{\s*(?:cn|clsx|cva)\s*\(/

function checkClassNameMerging(ctx: CheckCtx): Violation[] {
  if (CS001_WRAPPED_RE.test(ctx.line)) return []
  if (CS001_TEMPLATE_RE.test(ctx.line)) {
    return [v("CS-001", ctx,
      "Template-literal className merging — use cn() so tailwind-merge resolves conflicting utilities",
      "Wrap in cn(): className={cn(\"base\", variant && \"variant-class\")}")]
  }
  if (CS001_CONCAT_RE.test(ctx.line)) {
    return [v("CS-001", ctx,
      "String-concat className merging — use cn() so tailwind-merge resolves conflicting utilities",
      "Wrap in cn(): className={cn(\"base\", extra)}")]
  }
  return []
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

// CS-002 — imports from @big-wylly-style/ui must use the root entry point.
// Allowed non-component subpaths: the CSS bundle, the governance rules JSON,
// and metadata files consumed by tooling. Everything else (components,
// hooks, utils like cn) must come through the root export.
const CS002_ALLOWED_SUBPATHS = [
  "globals.css",
  "governance-rules.json",
] as const

function checkImportRoot(ctx: CheckCtx): Violation[] {
  const importMatch = ctx.line.match(/from\s+["']([^"']+)["']/)
  if (!importMatch) return []
  const path = importMatch[1]
  if (!path.startsWith("@big-wylly-style/ui/")) return []
  const subpath = path.slice("@big-wylly-style/ui/".length)
  if (CS002_ALLOWED_SUBPATHS.includes(subpath as typeof CS002_ALLOWED_SUBPATHS[number])) return []
  if (subpath.startsWith("metadata/")) return []
  return [v("CS-002", ctx,
    `Subpath import '${path}' — use the root @big-wylly-style/ui entry`,
    `Import from '@big-wylly-style/ui' instead. Subpaths bypass the package's curated public API and can break across versions.`)]
}

// CO-005 — a consumer file imports a name from a non-DS path whose specifier
// name matches a component exported from @big-wylly-style/ui. The shadow can
// be a leftover shadcn primitive (`@/components/ui/button`), a hand-rolled
// product copy of a DS component, or a barrel re-export — what matters is
// that the *imported* identifier collides with a DS export name, because that
// is the surface the rest of the codebase reads and the other rules key on.
//
// Specifier-name match is the truth source. Path-tail heuristics (e.g.
// "/components/ui/<name>") are intentionally not used — they miss barrels
// and re-exports while flagging coincidentally-named files. The metadata
// loader's component-name set is the same one MD-001/MD-002 consult.
let _dsComponentNames: Set<string> | null = null
function dsComponentNames(): Set<string> {
  if (_dsComponentNames === null) {
    _dsComponentNames = new Set(Object.keys(loadMetadataIndex()))
  }
  return _dsComponentNames
}

/** Test-only: clear the cached DS-name set so test fixtures that reset the
 *  metadata index can also reset CO-005's view of it. */
export function __resetCO005CacheForTests(): void {
  _dsComponentNames = null
}

/** "Local-looking" import source — a relative path or a common path alias.
 *  Bare npm packages (lucide-react, react-icons, @radix-ui/…) are excluded:
 *  a name collision with a DS component there (e.g. lucide's `Table` icon
 *  vs the DS `Table` component) is incidental, not a shadow. The spec frames
 *  CO-005 as "import from a local path whose specifier matches a DS export";
 *  this is that "local path" check. */
function isLocalImportPath(source: string): boolean {
  if (source.startsWith("./") || source.startsWith("../")) return true
  // Path-alias prefixes used by Next.js / Vite / TS path-mapping configs:
  //   @/components/ui/button   ~/lib/foo   #/internal/x
  // The trailing slash check ensures `@radix-ui/x` (npm scope) is NOT
  // treated as local — only `@/x` is.
  if (/^[@~#]\//.test(source)) return true
  return false
}

function checkShadowPrimitiveImport(ctx: CheckCtx): Violation[] {
  if (!ctx.line.trim().startsWith("import ")) return []
  const sourceMatch = ctx.line.match(/from\s+["']([^"']+)["']/)
  if (!sourceMatch) return []
  const source = sourceMatch[1]
  // Skip imports from the DS itself. CS-002 already handles subpath misuse;
  // the root import is the canonical path we *want* consumers to use.
  if (source === "@big-wylly-style/ui") return []
  if (source.startsWith("@big-wylly-style/ui/")) return []
  // Skip bare npm packages — name collisions there (lucide-react's `Table`
  // icon vs the DS `Table` component) are incidental, not shadowing.
  if (!isLocalImportPath(source)) return []

  // Extract the named-import block: `{ A, B as C, type D }`.
  // We intentionally do not handle default imports — the local binding name
  // is the consumer's choice and carries no guarantee about what the module
  // actually exports. Namespace imports (`import * as X`) likewise hide the
  // specifier names. Named imports are the case where shadowing is loud.
  const namedBlock = ctx.line.match(/import\s+(?:[\w$]+\s*,\s*)?\{\s*([^}]*)\s*\}\s+from\s+["']/)
  if (!namedBlock) return []
  const specifiersStr = namedBlock[1].trim()
  if (!specifiersStr) return []

  const dsNames = dsComponentNames()
  const out: Violation[] = []
  for (const spec of specifiersStr.split(",")) {
    let name = spec.trim()
    if (!name) continue
    // Strip leading `type ` for type-only specifiers (`import { type Button }`).
    name = name.replace(/^type\s+/, "")
    // For `A as B`, the *imported* name is A. That is the name the local
    // module surfaces externally and is what the DS-name set is keyed on.
    name = name.split(/\s+as\s+/)[0].trim()
    if (!name) continue
    if (dsNames.has(name)) {
      out.push(v("CO-005", ctx,
        `Import of '${name}' from '${source}' — the design system already exports a component with this name; importing a shadow primitive splits the design language.`,
        `Replace with: import { ${name} } from "@big-wylly-style/ui". If the local file is a shadow of a DS primitive, delete it after migration. If it is a legitimate product composition whose role differs from the DS component, rename it so it does not collide with a DS export name.`))
    }
  }
  return out
}

// Modal/sheet/dialog/drawer ancestors where hand-rolling `mx-auto max-w-*` is
// legitimate: these surfaces don't share PageLayout's size context, and the DS
// metadata for FullScreenSheet explicitly documents `<div className="mx-auto
// max-w-7xl p-6">` inside FullScreenSheetBody. LC-003's "page-level" intent
// only applies to the page root, not to content nested inside a modal surface.
const LC003_MODAL_CONTAINERS = [
  "FullScreenSheet",
  "Sheet",
  "Dialog",
  "AlertDialog",
  "ResponsiveDialog",
  "ResponsiveAlertDialog",
  "Drawer",
  "SidePanel",
] as const

function isInsideModalContainer(fileContent: string, offset: number): boolean {
  return LC003_MODAL_CONTAINERS.some(
    (tag) => jsxAncestorDepth(fileContent, tag, offset) > 0,
  )
}

function checkLayoutHandRolledMaxWidth(ctx: CheckCtx): Violation[] {
  if (!PAGE_FILE_RE.test(ctx.file)) return []
  // If the file uses PageLayout, internal max-w usage is the user's call.
  // Detect actual JSX usage, not the literal word in a comment or text content.
  if (/<PageLayout(\s|>|\/)/.test(ctx.fileContent)) return []
  const out: Violation[] = []

  // max-w-{3xl,5xl,7xl,8xl} co-located with mx-auto on the same line.
  const mxMatch = ctx.line.match(/\bmx-auto\b/)
  const maxWMatch = ctx.line.match(/\bmax-w-(?:3xl|5xl|7xl|8xl)\b/)
  if (mxMatch && maxWMatch) {
    const col = Math.min(mxMatch.index ?? 0, maxWMatch.index ?? 0)
    const offset = fileOffsetFor(ctx.fileContent, ctx.lineNum, col)
    if (!isInsideModalContainer(ctx.fileContent, offset)) {
      out.push(v("LC-003", ctx,
        "Hand-rolled max-w + mx-auto at page level",
        "Replace with <PageLayout size=\"sm|md|lg|xl|full\"> — same output, consistent across the system, automatic Header coordination"))
    }
  }

  // Tailwind 'container' utility inside a className value.
  const containerMatch = ctx.line.match(/(?:className|class)\s*=\s*(?:["'`])[^"'`]*\bcontainer\b[^"'`]*(?:["'`])/)
  if (containerMatch) {
    const offset = fileOffsetFor(ctx.fileContent, ctx.lineNum, containerMatch.index ?? 0)
    if (!isInsideModalContainer(ctx.fileContent, offset)) {
      out.push(v("LC-003", ctx,
        "'container' utility used at page level",
        "Replace with <PageLayout size=\"sm|md|lg|xl|full\"> — same output, consistent across the system"))
    }
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

/** Per-line check that consults each component's metadata for forbidden
 *  variants (MD-001) and out-of-range sizes (MD-002). Literal-only — dynamic
 *  prop assignments (variant={x}) are intentionally skipped; the type system
 *  is the right place to enforce those.
 *
 *  Strategy: cheap pre-filter (line must contain `<` followed by uppercase),
 *  then walk every JSX opening-tag match on the line and consult the
 *  metadata index. One metadata read at startup, in-memory lookups thereafter. */
function checkMetadataConstraints(ctx: CheckCtx): Violation[] {
  if (!/<[A-Z]/.test(ctx.line)) return []

  const index = loadMetadataIndex()
  const out: Violation[] = []
  // Find every JSX opening tag on the line — `<ComponentName` followed by
  // a word boundary. Includes `<ComponentName>`, `<ComponentName ...`, etc.
  const tagRe = /<([A-Z][A-Za-z0-9]*)\b/g
  let match: RegExpExecArray | null
  while ((match = tagRe.exec(ctx.line)) !== null) {
    const componentName = match[1]
    const rule = index[componentName]
    if (!rule) continue

    // Slice from this opening tag forward, then capture the prop value within
    // the same opening tag (anything up to the closing `>` or `/>`).
    const fromTag = ctx.line.slice(match.index)
    const tagBody = fromTag.match(/^<[^>]*>/)?.[0] ?? fromTag

    if (rule.forbiddenVariants.length > 0) {
      const variantMatch = tagBody.match(/\bvariant\s*=\s*["']([^"']+)["']/)
      if (variantMatch && rule.forbiddenVariants.includes(variantMatch[1])) {
        out.push(v("MD-001", ctx,
          `<${componentName} variant="${variantMatch[1]}"> — forbidden variant per component metadata`,
          mdFix(ctx.mode, "variant", componentName)))
      }
    }

    if (rule.allowedSizes) {
      const sizeMatch = tagBody.match(/\bsize\s*=\s*["']([^"']+)["']/)
      if (sizeMatch && !rule.allowedSizes.includes(sizeMatch[1])) {
        out.push(v("MD-002", ctx,
          `<${componentName} size="${sizeMatch[1]}"> — not in allowed sizes [${rule.allowedSizes.join(", ")}] per component metadata`,
          mdFix(ctx.mode, "size", componentName, rule.allowedSizes)))
      }
    }
  }
  return out
}

/** Build a fix-text string for MD-001 / MD-002 that's appropriate for the audit mode.
 *  Maintainers can edit metadata directly; consumers can't (it's in node_modules) and
 *  should be steered toward changing the prop or filing a drift report. */
function mdFix(
  mode: Mode,
  prop: "variant" | "size",
  componentName: string,
  allowedSizes?: string[],
): string {
  const ruleId = prop === "variant" ? "MD-001" : "MD-002"
  if (mode === "ds") {
    if (prop === "variant") {
      return `Replace with an allowed variant. If the metadata is wrong, update ${componentName}.metadata.json (variants.visual.forbidden) to match the TS signature.`
    }
    return `Use one of: ${allowedSizes!.join(", ")}. If ${componentName}'s TS signature accepts the rejected value, the metadata may have drifted — update ${componentName}.metadata.json (variants.size.options).`
  }
  // consumer mode — can't edit metadata in node_modules
  if (prop === "variant") {
    return `Change the prop value to an allowed variant. If you believe the metadata is wrong, file an issue with the design-system team and add \`// govern:disable-next-line ${ruleId} -- waiting on @big-wylly-style/ui release\` until the fix ships.`
  }
  return `Use one of: ${allowedSizes!.join(", ")}. If you believe the value is genuinely valid, file an issue with the design-system team and add \`// govern:disable-next-line ${ruleId} -- waiting on @big-wylly-style/ui release\` until the fix ships.`
}

const CHECKERS = [
  checkForegroundHierarchy,
  checkPrimaryForegroundOutsidePrimarySurface,
  checkSemanticColorPairing,
  checkBorderHierarchy,
  checkTypography,
  checkUppercase,
  checkTypographyPresets,
  checkPrimitiveLeakage,
  // BD-002 and EL-002 run before PL-002 because PL-002 strips their captures
  // before scanning — the ordering keeps the line state aligned.
  checkBorderHardcoded,
  checkShadowHardcoded,
  checkHardcodedColors,
  checkTailwindPalette,
  checkAccentOnStaticContent,
  checkElevationCoherence,
  checkPageLayoutInSidePanel,
  checkLayoutPageHeaderWrapping,
  checkLayoutHandRolledMaxWidth,
  checkIconographyOverflowVertical,
  checkIconographyTrash2,
  checkIconographyButtonIconOnly,
  checkCardGhostTone,
  checkClassNameMerging,
  checkChoiceCardInCard,
  checkFieldWrapping,
  checkContextMenuTrigger,
  checkButtonVsLink,
  checkMetadataConstraints,
]

// Checkers that fire on import statements, before the global import-line filter.
const IMPORT_CHECKERS = [checkIconographyLibrary, checkImportRoot, checkShadowPrimitiveImport]

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
