"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@wyllo/ui"

/* ─── Token list ──────────────────────────────────────────────────────────────
   Grouped by category for the dropdown.
   Only color tokens — no radius, shadow, blur, font, etc.
*/

const TOKEN_GROUPS: { label: string; tokens: string[] }[] = [
  {
    label: "Surfaces",
    tokens: [
      "background", "foreground", "card", "card-foreground",
      "popover", "popover-foreground", "secondary", "secondary-foreground",
      "muted", "muted-foreground", "accent", "accent-foreground",
    ],
  },
  {
    label: "Interactive",
    tokens: ["primary", "primary-foreground", "link", "link-hover"],
  },
  {
    label: "Borders",
    tokens: ["border", "border-subtle", "input", "ring"],
  },
  {
    label: "Feedback",
    tokens: [
      "success", "success-border", "success-foreground",
      "warning", "warning-border", "warning-foreground",
      "destructive", "destructive-border", "destructive-foreground",
      "destructive-solid", "destructive-solid-foreground",
      "info", "info-border", "info-foreground",
    ],
  },
  {
    label: "Brand",
    tokens: [
      "brand", "brand-border", "brand-foreground",
      "brand-solid", "brand-solid-foreground",
      "review", "review-border", "review-foreground",
    ],
  },
  {
    label: "Charts",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    label: "Sidebar",
    tokens: [
      "sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground",
      "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring",
    ],
  },
  {
    label: "Gray Primitives",
    tokens: [
      "gray-98", "gray-96", "gray-94", "gray-91", "gray-88", "gray-83",
      "gray-73", "gray-64", "gray-55", "gray-48", "gray-43", "gray-40",
      "gray-33", "gray-29", "gray-26", "gray-22", "gray-19",
    ],
  },
  {
    label: "Violet Primitives",
    tokens: [
      "violet-99", "violet-97", "violet-95", "violet-89", "violet-80", "violet-72",
      "violet-64", "violet-58", "violet-51", "violet-45", "violet-39", "violet-33", "violet-20",
    ],
  },
  {
    label: "Orange Primitives",
    tokens: [
      "orange-96", "orange-91", "orange-84", "orange-78", "orange-73", "orange-69",
      "orange-61", "orange-54", "orange-46", "orange-39",
    ],
  },
  {
    label: "Pink Primitives",
    tokens: [
      "pink-97", "pink-92", "pink-87", "pink-81", "pink-77", "pink-73",
      "pink-65", "pink-57", "pink-48", "pink-41",
    ],
  },
  {
    label: "Cyan Primitives",
    tokens: [
      "cyan-97", "cyan-94", "cyan-89", "cyan-85", "cyan-80", "cyan-77",
      "cyan-68", "cyan-60", "cyan-51", "cyan-43",
    ],
  },
  {
    label: "Lime Primitives",
    tokens: [
      "lime-99", "lime-97", "lime-95", "lime-93", "lime-91", "lime-90",
      "lime-79", "lime-69", "lime-59", "lime-50",
    ],
  },
]

const ALL_TOKEN_OPTIONS = TOKEN_GROUPS.flatMap((group) =>
  group.tokens.map((t) => ({ label: t, value: t }))
)

/* ─── Color math ──────────────────────────────────────────────────────────── */

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

function wcagContrast(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  let l1 = relativeLuminance(...rgb1)
  let l2 = relativeLuminance(...rgb2)
  if (l1 < l2) [l1, l2] = [l2, l1]
  return (l1 + 0.05) / (l2 + 0.05)
}

function apcaContrast(textRgb: [number, number, number], bgRgb: [number, number, number]): number {
  const yTxt = relativeLuminance(...textRgb)
  const yBg = relativeLuminance(...bgRgb)

  let sapc: number
  if (yBg > yTxt) {
    sapc = (yBg ** 0.56 - yTxt ** 0.57) * 1.14
  } else {
    sapc = (yBg ** 0.65 - yTxt ** 0.62) * 1.14
  }

  if (Math.abs(sapc) < 0.1) return 0
  return sapc > 0
    ? Math.round((sapc - 0.027) * 1000) / 10
    : Math.round((sapc + 0.027) * 1000) / 10
}

function wcagLevel(ratio: number): string {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA Large"
  return "Fail"
}

function apcaTier(lc: number): string {
  const abs = Math.abs(lc)
  if (abs >= 90) return "Body text, small text, crucial content"
  if (abs >= 75) return "Standard text, non-critical content"
  if (abs >= 60) return "Medium text (24px+), large UI elements"
  if (abs >= 45) return "Large text (36px+), icons, design elements"
  if (abs >= 30) return "Incidental text, disabled elements"
  return "Not recommended for any text"
}

/* ─── Resolve CSS token ───────────────────────────────────────────────────── */

function resolveTokenToRgb(token: string): [number, number, number] | null {
  if (typeof document === "undefined") return null
  // Create a visible element so the browser fully resolves the color
  const el = document.createElement("div")
  el.style.position = "fixed"
  el.style.left = "-9999px"
  el.style.top = "-9999px"
  el.style.width = "1px"
  el.style.height = "1px"
  el.style.backgroundColor = `var(--${token})`
  document.body.appendChild(el)
  const computed = getComputedStyle(el).backgroundColor
  document.body.removeChild(el)
  // Parse rgb/rgba
  const match = computed.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/)
  if (match) {
    return [parseFloat(match[1]) / 255, parseFloat(match[2]) / 255, parseFloat(match[3]) / 255]
  }
  // If browser returned oklch or other format, use canvas to convert
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.fillStyle = computed
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  if (r === 0 && g === 0 && b === 0 && computed === "rgba(0, 0, 0, 0)") return null
  return [r / 255, g / 255, b / 255]
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export function ContrastChecker() {
  const [tokenA, setTokenA] = useState("foreground")
  const [tokenB, setTokenB] = useState("background")
  const [result, setResult] = useState<{
    colorA: string
    colorB: string
    rgbA: [number, number, number]
    rgbB: [number, number, number]
    wcag: number
    apca: number
    apcaReverse: number
  } | null>(null)

  const compute = useCallback(() => {
    const rgbA = resolveTokenToRgb(tokenA)
    const rgbB = resolveTokenToRgb(tokenB)
    if (!rgbA || !rgbB) return

    setResult({
      colorA: `rgb(${Math.round(rgbA[0] * 255)}, ${Math.round(rgbA[1] * 255)}, ${Math.round(rgbA[2] * 255)})`,
      colorB: `rgb(${Math.round(rgbB[0] * 255)}, ${Math.round(rgbB[1] * 255)}, ${Math.round(rgbB[2] * 255)})`,
      rgbA,
      rgbB,
      wcag: Math.round(wcagContrast(rgbA, rgbB) * 100) / 100,
      apca: apcaContrast(rgbA, rgbB),
      apcaReverse: apcaContrast(rgbB, rgbA),
    })
  }, [tokenA, tokenB])

  useEffect(() => {
    compute()
  }, [compute])

  // Re-compute when theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => compute())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [compute])

  function TokenPicker({ label, value, onValueChange }: { label: string; value: string; onValueChange: (v: string) => void }) {
    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!open) return
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false)
          setSearch("")
        }
      }
      document.addEventListener("mousedown", handleClick)
      return () => document.removeEventListener("mousedown", handleClick)
    }, [open])
    const filtered = search
      ? TOKEN_GROUPS.map((g) => ({
          ...g,
          tokens: g.tokens.filter((t) => t.includes(search.toLowerCase())),
        })).filter((g) => g.tokens.length > 0)
      : TOKEN_GROUPS

    return (
      <div ref={ref} className="space-y-1.5 relative">
        <div className="label-sm text-muted-foreground">{label}</div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 w-full h-9 rounded-lg border border-input bg-secondary px-3 text-sm font-[420] text-foreground text-left"
        >
          <span
            className="inline-block size-3 rounded-sm border border-border-subtle shrink-0"
            style={{ backgroundColor: `var(--${value})` }}
          />
          {value}
        </button>
        {open && (
          <div className="absolute z-50 top-full mt-1 w-full rounded-lg border border-input bg-popover shadow-[var(--elevation-floating)] overflow-hidden">
            <div className="p-2 border-b border-border-subtle">
              <input
                type="text"
                className="w-full h-8 bg-transparent text-sm font-[420] outline-none placeholder:text-muted-foreground"
                placeholder="Search tokens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {filtered.length === 0 && (
                <div className="py-4 text-center text-sm text-muted-foreground">No tokens found</div>
              )}
              {filtered.map((group) => (
                <div key={group.label}>
                  <div className="px-2 py-1.5 text-xs font-[520] text-muted-foreground">{group.label}</div>
                  {group.tokens.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={"flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground" + (t === value ? " bg-accent text-accent-foreground" : "")}
                      onClick={() => {
                        onValueChange(t)
                        setSearch("")
                        setOpen(false)
                      }}
                    >
                      <span
                        className="inline-block size-3 rounded-sm border border-border-subtle shrink-0"
                        style={{ backgroundColor: `var(--${t})` }}
                      />
                      {t}
                      {t === value && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="label-lg">Contrast Checker</CardTitle>
        <CardDescription className="p">
          Pick any two tokens to check their contrast. Values update live when you toggle dark mode.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TokenPicker label="Foreground / Text" value={tokenA} onValueChange={setTokenA} />
          <TokenPicker label="Background" value={tokenB} onValueChange={setTokenB} />
        </div>

        {result && (
          <>
            {/* Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-lg border p-4 space-y-1"
                style={{ backgroundColor: `var(--${tokenB})`, color: `var(--${tokenA})` }}
              >
                <div className="label-sm">Text on background</div>
                <div className="h2">The quick brown fox</div>
                <div className="p">jumps over the lazy dog. 0123456789</div>
                <div className="p-sm">Small text sample for body copy legibility.</div>
              </div>
              <div
                className="rounded-lg border p-4 space-y-1"
                style={{ backgroundColor: `var(--${tokenA})`, color: `var(--${tokenB})` }}
              >
                <div className="label-sm">Reversed</div>
                <div className="h2">The quick brown fox</div>
                <div className="p">jumps over the lazy dog. 0123456789</div>
                <div className="p-sm">Small text sample for body copy legibility.</div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* WCAG */}
              <Card level={2} size="xs">
                <CardContent>
                  <div className="label-sm text-muted-foreground">WCAG 2.x</div>
                  <div className="data-lg mt-1">{result.wcag}:1</div>
                  <div className={`label-sm mt-1 ${result.wcag >= 4.5 ? "text-success-foreground" : result.wcag >= 3 ? "text-warning-foreground" : "text-destructive-foreground"}`}>
                    {wcagLevel(result.wcag)}
                  </div>
                </CardContent>
              </Card>

              {/* APCA (text on bg) */}
              <Card level={2} size="xs">
                <CardContent>
                  <div className="label-sm text-muted-foreground">APCA (text on bg)</div>
                  <div className="data-lg mt-1">Lc {result.apca}</div>
                  <div className={`p-sm mt-1 ${Math.abs(result.apca) >= 45 ? "text-success-foreground" : Math.abs(result.apca) >= 30 ? "text-warning-foreground" : "text-destructive-foreground"}`}>
                    {apcaTier(result.apca)}
                  </div>
                </CardContent>
              </Card>

              {/* APCA (reversed) */}
              <Card level={2} size="xs">
                <CardContent>
                  <div className="label-sm text-muted-foreground">APCA (reversed)</div>
                  <div className="data-lg mt-1">Lc {result.apcaReverse}</div>
                  <div className={`p-sm mt-1 ${Math.abs(result.apcaReverse) >= 45 ? "text-success-foreground" : Math.abs(result.apcaReverse) >= 30 ? "text-warning-foreground" : "text-destructive-foreground"}`}>
                    {apcaTier(result.apcaReverse)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
