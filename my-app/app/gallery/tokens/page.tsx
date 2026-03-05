"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

/* ─────────────────────────────────────────────
 * DATA
 * ───────────────────────────────────────────── */

const grayScale = [
  { name: "gray-98", oklch: "oklch(0.9824 0.0013 288)" },
  { name: "gray-96", oklch: "oklch(0.9677 0.0027 288)" },
  { name: "gray-94", oklch: "oklch(0.9412 0.0053 288)" },
  { name: "gray-91", oklch: "oklch(0.9179 0.0094 288)" },
  { name: "gray-88", oklch: "oklch(0.8818 0.0123 288)" },
  { name: "gray-83", oklch: "oklch(0.8304 0.0138 288)" },
  { name: "gray-73", oklch: "oklch(0.7395 0.0214 288)" },
  { name: "gray-64", oklch: "oklch(0.6498 0.0281 288)" },
  { name: "gray-55", oklch: "oklch(0.5557 0.0308 288)" },
  { name: "gray-48", oklch: "oklch(0.4815 0.0269 288)" },
  { name: "gray-43", oklch: "oklch(0.4335 0.0244 288)" },
  { name: "gray-40", oklch: "oklch(0.4040 0.0229 288)" },
  { name: "gray-33", oklch: "oklch(0.3334 0.0192 288)" },
  { name: "gray-19", oklch: "oklch(0.1975 0.008 288)"  },
]

const violetScale = [
  { name: "violet-99", oklch: "oklch(0.9867 0.012 298.61)" },
  { name: "violet-97", oklch: "oklch(0.9753 0.0136 299.8)" },
  { name: "violet-95", oklch: "oklch(0.9552 0.0245 298.61)" },
  { name: "violet-89", oklch: "oklch(0.8943 0.058 296.12)" },
  { name: "violet-80", oklch: "oklch(0.8099 0.1073 295.38)" },
  { name: "violet-72", oklch: "oklch(0.7247 0.1585 293.67)" },
  { name: "violet-64", oklch: "oklch(0.6478 0.204954 291.1021)" },
  { name: "violet-58", oklch: "oklch(0.5803 0.2448 287.66)" },
  { name: "violet-51", oklch: "oklch(0.5165 0.2153 288)" },
  { name: "violet-45", oklch: "oklch(0.4538 0.1861 288)" },
  { name: "violet-39", oklch: "oklch(0.39 0.1556 288.5)" },
  { name: "violet-33", oklch: "oklch(0.3342 0.1287 288.4)" },
  { name: "violet-20", oklch: "oklch(0.2099 0.1211 288)" },
]

const semanticColors: {
  section: string
  tokens: {
    token: string
    description: string
    lightValue: string
    darkValue: string
  }[]
}[] = [
  {
    section: "Surfaces",
    tokens: [
      { token: "background", description: "Canvas background (level 0)", lightValue: "--gray-98", darkValue: "--gray-19" },
      { token: "foreground", description: "Default text color", lightValue: "--gray-19", darkValue: "--gray-98" },
      { token: "card", description: "Primary surface (level 1)", lightValue: "oklch(1 0 0)", darkValue: "--gray-33" },
      { token: "card-foreground", description: "Text on card surfaces", lightValue: "--gray-19", darkValue: "--gray-98" },
      { token: "popover", description: "Popover / floating surface", lightValue: "oklch(1 0 0)", darkValue: "--gray-33" },
      { token: "popover-foreground", description: "Text on popovers", lightValue: "--gray-33", darkValue: "--gray-98" },
      { token: "secondary", description: "Secondary surface (canvas tone)", lightValue: "--gray-98", darkValue: "--gray-19" },
      { token: "secondary-foreground", description: "Text on secondary", lightValue: "--gray-33", darkValue: "--gray-98" },
      { token: "muted", description: "Subtle / quiet surface", lightValue: "--gray-94", darkValue: "--gray-33" },
      { token: "muted-foreground", description: "Muted text", lightValue: "--gray-55", darkValue: "--gray-64" },
    ],
  },
  {
    section: "Brand",
    tokens: [
      { token: "primary", description: "Primary brand / action", lightValue: "--violet-58", darkValue: "--violet-72" },
      { token: "primary-foreground", description: "Text on primary", lightValue: "--violet-95", darkValue: "--violet-95" },
      { token: "accent", description: "Accent / hover surface", lightValue: "--violet-95", darkValue: "--violet-39" },
      { token: "accent-foreground", description: "Text on accent", lightValue: "--violet-39", darkValue: "--violet-95" },
      { token: "link", description: "Link color", lightValue: "--primary", darkValue: "--violet-80" },
      { token: "link-hover", description: "Link hover color", lightValue: "--primary", darkValue: "--violet-72" },
    ],
  },
  {
    section: "Borders",
    tokens: [
      { token: "border", description: "Primary structural border", lightValue: "--gray-91", darkValue: "--gray-48" },
      { token: "border-subtle", description: "Subtle / nested border", lightValue: "--gray-94", darkValue: "--gray-43" },
      { token: "border-primary", description: "Brand emphasis border", lightValue: "--primary", darkValue: "--primary" },
      { token: "input", description: "Input field border", lightValue: "--gray-88", darkValue: "--gray-48" },
      { token: "ring", description: "Focus ring", lightValue: "--primary", darkValue: "--primary" },
    ],
  },
  {
    section: "Feedback",
    tokens: [
      { token: "success", description: "Success background", lightValue: "oklch(0.95 0.03 155)", darkValue: "oklch(0.20 0.05 155)" },
      { token: "success-border", description: "Success border", lightValue: "oklch(0.88 0.06 155)", darkValue: "oklch(0.32 0.10 155)" },
      { token: "success-foreground", description: "Success text", lightValue: "oklch(0.53 0.18 155)", darkValue: "oklch(0.75 0.20 155)" },
      { token: "warning", description: "Warning background", lightValue: "oklch(0.97 0.03 85)", darkValue: "oklch(0.20 0.05 85)" },
      { token: "warning-border", description: "Warning border", lightValue: "oklch(0.89 0.08 85)", darkValue: "oklch(0.32 0.10 85)" },
      { token: "warning-foreground", description: "Warning text", lightValue: "oklch(0.62 0.16 85)", darkValue: "oklch(0.78 0.18 85)" },
      { token: "info", description: "Info background", lightValue: "--card", darkValue: "oklch(0.20 0.05 210)" },
      { token: "info-border", description: "Info border", lightValue: "--border", darkValue: "oklch(0.32 0.10 210)" },
      { token: "info-foreground", description: "Info text", lightValue: "--gray-33", darkValue: "oklch(0.78 0.18 210)" },
      { token: "destructive", description: "Destructive background", lightValue: "oklch(0.96 0.03 10)", darkValue: "oklch(0.20 0.09 10)" },
      { token: "destructive-border", description: "Destructive border", lightValue: "oklch(0.89 0.06 10)", darkValue: "oklch(0.38 0.16 10)" },
      { token: "destructive-foreground", description: "Destructive text", lightValue: "oklch(0.55 0.22 10)", darkValue: "oklch(0.90 0.20 10)" },
    ],
  },
  {
    section: "Charts",
    tokens: [
      { token: "chart-1", description: "Chart color 1", lightValue: "--violet-80", darkValue: "--violet-80" },
      { token: "chart-2", description: "Chart color 2", lightValue: "--violet-72", darkValue: "--violet-72" },
      { token: "chart-3", description: "Chart color 3", lightValue: "--violet-64", darkValue: "--violet-64" },
      { token: "chart-4", description: "Chart color 4", lightValue: "--violet-51", darkValue: "--violet-51" },
      { token: "chart-5", description: "Chart color 5", lightValue: "--violet-45", darkValue: "--violet-45" },
    ],
  },
  {
    section: "Sidebar",
    tokens: [
      { token: "sidebar", description: "Sidebar background", lightValue: "--gray-94", darkValue: "--gray-33" },
      { token: "sidebar-foreground", description: "Sidebar text", lightValue: "--gray-33", darkValue: "--gray-98" },
      { token: "sidebar-primary", description: "Sidebar primary", lightValue: "--primary", darkValue: "--primary" },
      { token: "sidebar-accent", description: "Sidebar accent", lightValue: "--accent", darkValue: "--accent" },
    ],
  },
]

const typographyTokens = [
  { class: ".h1", size: "text-2xl (24px)", weight: "650", usage: "Page title" },
  { class: ".h2", size: "text-base (16px)", weight: "650", usage: "Section title" },
  { class: ".h3", size: "text-sm (14px)", weight: "650", usage: "Subsection title" },
  { class: ".h4", size: "text-xs (12px)", weight: "650", usage: "Minor heading" },
  { class: ".p-lg", size: "text-base (16px)", weight: "425", usage: "Large body text" },
  { class: ".p", size: "text-sm (14px)", weight: "425", usage: "Default body text" },
  { class: ".p-sm", size: "text-xs (12px)", weight: "425", usage: "Small / caption text" },
  { class: ".label-lg", size: "text-base (16px)", weight: "525", usage: "Large label / UI" },
  { class: ".label-md", size: "text-sm (14px)", weight: "525", usage: "Default label / UI" },
  { class: ".label-sm", size: "text-xs (12px)", weight: "525", usage: "Small label / UI" },
  { class: ".form-label", size: "text-sm (14px)", weight: "425", usage: "Form field label (muted)" },
  { class: ".form-control", size: "text-sm (14px)", weight: "425", usage: "Form input value" },
  { class: ".form-data", size: "text-sm (14px)", weight: "525", usage: "Form displayed data" },
  { class: ".data-lg", size: "text-3xl (30px)", weight: "650", usage: "Hero metric" },
  { class: ".data-md", size: "text-xl (20px)", weight: "650", usage: "Metric value" },
  { class: ".data-sm", size: "text-base (16px)", weight: "650", usage: "Compact metric value" },
]

const radiusTokens = [
  {
    cssVar: "--radius",
    twClass: "rounded",
    value: "0.25rem",
    computed: "4px",
    tier: "1 — Micro",
    usage: "Badges, tags, chips, table selection backgrounds",
  },
  {
    cssVar: "--radius-lg",
    twClass: "rounded-lg",
    value: "0.5rem",
    computed: "8px",
    tier: "2 — Controls",
    usage: "Buttons, inputs, selects, dropdowns, toggle groups",
  },
  {
    cssVar: "--radius-xl",
    twClass: "rounded-xl",
    value: "0.75rem",
    computed: "12px",
    tier: "3 — Cards",
    usage: "Cards at every level — core brand radius",
  },
  {
    cssVar: "--radius-2xl",
    twClass: "rounded-2xl",
    value: "1rem",
    computed: "16px",
    tier: "4 — Surfaces",
    usage: "Dialogs, full-width hero modules",
  },
  {
    cssVar: null,
    twClass: "rounded-full",
    value: "9999px",
    computed: "∞",
    tier: "5 — Circular",
    usage: "Radio buttons, switches — shapes that are always circular",
  },
]

const elevationTokens = [
  {
    name: "elevation-surface",
    primitive: "--shadow-y1",
    lightValue: "0 1px 1px oklch(0.55 0.02 286.45 / 0.08)",
    usage: "Cards, panels, standard content containers",
  },
  {
    name: "elevation-floating",
    primitive: "--shadow-y2",
    lightValue: "0 2px 6px oklch(0.50 0.03 286.45 / 0.10)",
    usage: "Dropdowns, hover panels, toolbars",
  },
  {
    name: "elevation-overlay",
    primitive: "--shadow-y6",
    lightValue: "0 6px 16px oklch(0.45 0.04 286.45 / 0.14)",
    usage: "Dialogs, sheets, drawers",
  },
  {
    name: "elevation-popover",
    primitive: "--shadow-y16",
    lightValue: "0 16px 32px oklch(0.40 0.05 286.45 / 0.18)",
    usage: "Tooltips, command palettes, popovers",
  },
]

/* ─────────────────────────────────────────────
 * PAGE
 * ───────────────────────────────────────────── */

export default function TokensPage() {
  const [liveValues, setLiveValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const read = () => {
      const isDark = document.documentElement.classList.contains("dark")
      const isBlack = document.documentElement.getAttribute("data-theme") === "black"

      // Build the set of selectors that apply in the current theme + mode.
      // Order matters — later entries win (mirrors CSS cascade).
      const activeSelectors: string[] = [":root"]
      if (isDark) activeSelectors.push(".dark")
      if (isBlack) activeSelectors.push('[data-theme="black"]')
      if (isBlack && isDark) activeSelectors.push('[data-theme="black"].dark')

      // Read raw authored values directly from stylesheet rules.
      // This avoids @property / getComputedStyle resolving var() references
      // to their computed hex/oklch color before we can read the name.
      const merged: Record<string, string> = {}

      const scanRules = (rules: CSSRuleList) => {
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSStyleRule) {
            const sel = rule.selectorText.trim()
            // Normalise quote style for attribute selectors
            const selNorm = sel.replace(/'/g, '"')
            if (activeSelectors.includes(sel) || activeSelectors.includes(selNorm)) {
              for (let i = 0; i < rule.style.length; i++) {
                const prop = rule.style[i]
                if (prop.startsWith("--")) {
                  merged[prop] = rule.style.getPropertyValue(prop).trim()
                }
              }
            }
          }
          // Recurse into @layer, @media, @supports, etc.
          if ("cssRules" in rule) {
            try { scanRules((rule as CSSGroupingRule).cssRules) } catch { /* cross-origin */ }
          }
        }
      }

      for (const sheet of Array.from(document.styleSheets)) {
        try { scanRules(sheet.cssRules) } catch { /* cross-origin */ }
      }

      const values: Record<string, string> = {}
      semanticColors.forEach((section) => {
        section.tokens.forEach((token) => {
          const raw = merged[`--${token.token}`] ?? ""
          values[token.token] = raw.startsWith("var(") ? raw.slice(4, -1) : raw
        })
      })
      setLiveValues(values)
    }

    read()

    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="space-y-12">
      {/* Page header */}
      <div className="space-y-2">
        <div className="h1">Tokens</div>
        <p className="p-lg text-muted-foreground">
          A complete reference of every design token in the system — color
          primitives, semantic mappings, typography, corner radius, elevation,
          and surface rules.
        </p>
      </div>


      {/* ═══════════════════════════════════════
       * 1. TYPOGRAPHY
       * ═══════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Typography</CardTitle>
          <CardDescription className="p">
            Utility classes for the type system. Font: Inter variable.
            Feature settings: tnum, dlig, frac, ccmp, ss03, cv01–cv05, cv08, cv09, cv11–cv13. calt off.
            Font optical sizing: auto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Live preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card level={2}>
              <CardContent className="space-y-3">
                <div className="label-sm text-muted-foreground">Headings</div>
                <div className="h1">h1 — 24px / 650</div>
                <div className="h2">h2 — 16px / 650</div>
                <div className="h3">h3 — 14px / 650</div>
                <div className="h4">h4 — 12px / 650</div>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-3">
                <div className="label-sm text-muted-foreground">Body</div>
                <p className="p-lg">p-lg — 16px / 425</p>
                <p className="p">p — 14px / 425</p>
                <p className="p-sm">p-sm — 12px / 425</p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-3">
                <div className="label-sm text-muted-foreground">Labels</div>
                <div className="label-lg">label-lg — 16px / 525</div>
                <div className="label-md">label-md — 14px / 525</div>
                <div className="label-sm">label-sm — 12px / 525</div>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-3">
                <div className="label-sm text-muted-foreground">Data</div>
                <div className="data-lg">data-lg — 30px / 650</div>
                <div className="data-md">data-md — 20px / 650</div>
                <div className="data-sm">data-sm — 16px / 650</div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead size="sm" className="text-muted-foreground">Class</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Size</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Weight</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typographyTokens.map((t) => (
                <TableRow key={t.class}>
                  <TableCell><code className="p-sm font-mono">{t.class}</code></TableCell>
                  <TableCell><span className="p-sm">{t.size}</span></TableCell>
                  <TableCell><span className="p-sm">{t.weight}</span></TableCell>
                  <TableCell><span className="p-sm text-muted-foreground">{t.usage}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════
       * 2. FONT SETTINGS
       * ═══════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Font Configuration</CardTitle>
          <CardDescription className="p">
            Inter variable — our primary typeface. We use Inter with a deliberately curated set of
            OpenType features for data clarity, character disambiguation, and brand personality.
            Inter has become ubiquitous in AI tools, which has given it an association with "AI slop."
            By using custom values on the weight axis and customizing the features—such as enabling
            specific character variants and stylistic sets—we preserve Inter&apos;s clarity and
            approachability while establishing our own typographic identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">

          {/* Base metadata */}
          <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
            <span className="p-sm text-muted-foreground">Family</span>
            <span className="p-sm">Inter (variable)</span>
            <span className="p-sm text-muted-foreground">Base weight</span>
            <span className="p-sm">425</span>
            <span className="p-sm text-muted-foreground">Optical sizing</span>
            <span className="p-sm">auto</span>
            <span className="p-sm text-muted-foreground">calt</span>
            <span className="p-sm text-muted-foreground">off — contextual alternates disabled to prevent unintended substitutions in UI text</span>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* NUMBERS & DATA */}
          <div className="space-y-4">
            <div>
              <p className="label-md">Numbers &amp; Data</p>
              <p className="p-sm text-muted-foreground mt-0.5">Alternate digit forms and numeric layout features that reduce ambiguity and improve precision in data-heavy UI.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">

              {/* tnum */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6">
                    <div>
                      <div style={{ fontFeatureSettings: '"tnum" 0', fontSize: 28, lineHeight: 1.4 }}>
                        <div>1111</div>
                        <div>8888</div>
                      </div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground self-center">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"tnum" 1', fontSize: 28, lineHeight: 1.4 }}>
                        <div>1111</div>
                        <div>8888</div>
                      </div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">tnum</code>
                    <span className="label-sm">Tabular Numbers</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Every digit takes the same horizontal space. Numbers in tables and dashboards stay perfectly column-aligned — essential for any product where users scan and compare numeric data.</p>
                </CardContent>
              </Card>

              {/* cv01 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv01" 0', fontSize: 48, lineHeight: 1 }}>1</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv01" 1', fontSize: 48, lineHeight: 1 }}>1</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv01</code>
                    <span className="label-sm">Alternate One</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Adds a horizontal serif foot to the digit 1, clearly distinguishing it from lowercase l and capital I. In codes, IDs, and alphanumeric strings, this single change eliminates the most common misread in sans-serif type.</p>
                </CardContent>
              </Card>

              {/* cv09 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv09" 0', fontSize: 48, lineHeight: 1 }}>3</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv09" 1', fontSize: 48, lineHeight: 1 }}>3</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv09</code>
                    <span className="label-sm">Flat-top Three</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Replaces the curved top of 3 with a flat horizontal stroke. In data-dense UI, the flat top reads more crisply and reduces split-second confusion with 8 — especially at small label and table cell sizes.</p>
                </CardContent>
              </Card>

              {/* cv02 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv02" 0', fontSize: 48, lineHeight: 1 }}>4</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv02" 1', fontSize: 48, lineHeight: 1 }}>4</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv02</code>
                    <span className="label-sm">Open Four</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Opens the enclosed counter of the 4, giving the numeral a more open aperture. Significantly more legible at small sizes — axis labels, table cells, footnotes — where the default closed form can look like a filled shape.</p>
                </CardContent>
              </Card>

              {/* cv03 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv03" 0', fontSize: 48, lineHeight: 1 }}>6</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv03" 1', fontSize: 48, lineHeight: 1 }}>6</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv03</code>
                    <span className="label-sm">Open Six</span>
                  </div>
                  <p className="p-sm text-muted-foreground">A more open aperture at the top of 6. The humanist form reads comfortably at every scale — from a 12px table cell to a 48px hero metric — without ambiguity with 0 or 8.</p>
                </CardContent>
              </Card>

              {/* cv04 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv04" 0', fontSize: 48, lineHeight: 1 }}>9</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv04" 1', fontSize: 48, lineHeight: 1 }}>9</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv04</code>
                    <span className="label-sm">Open Nine</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Mirrors the open six with a wider aperture at the bottom of 9. The two variants form a matched pair — consistent visual rhythm across the digit set, and faster recognition in dense numeric sequences.</p>
                </CardContent>
              </Card>

              {/* frac */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"frac" 0', fontSize: 40, lineHeight: 1 }}>1/4</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"frac" 1', fontSize: 40, lineHeight: 1 }}>1/4</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">frac</code>
                    <span className="label-sm">Fractions</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Automatically typesets number/slash/number sequences as proper fractions. Elevates measurements, ratios, and data annotations from crude slash-separated text to precise, professional typographic values.</p>
                </CardContent>
              </Card>

            </div>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* DISAMBIGUATION */}
          <div className="space-y-4">
            <div>
              <p className="label-md">Disambiguation</p>
              <p className="p-sm text-muted-foreground mt-0.5">Alternate letterforms that solve the I/l/1 problem — the most persistent legibility failure in sans-serif typefaces.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* cv08 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv08" 0', fontSize: 48, lineHeight: 1, letterSpacing: "0.05em" }}>I l 1</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv08" 1', fontSize: 48, lineHeight: 1, letterSpacing: "0.05em" }}>I l 1</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv08</code>
                    <span className="label-sm">Capital I with Serifs</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Serifs on uppercase I immediately set it apart from lowercase l and digit 1. In a product where users read serial numbers, handles, codes, and keys, this isn&apos;t a stylistic choice — it&apos;s a safety feature.</p>
                </CardContent>
              </Card>

              {/* cv05 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv05" 0', fontSize: 48, lineHeight: 1, letterSpacing: "0.05em" }}>l I 1</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv05" 1', fontSize: 48, lineHeight: 1, letterSpacing: "0.05em" }}>l I 1</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv05</code>
                    <span className="label-sm">Lowercase l with Tail</span>
                  </div>
                  <p className="p-sm text-muted-foreground">A curved upswing tail gives lowercase l a unique baseline anchor. Combined with cv08 (I with serifs) and cv01 (1 with foot), all three visually similar characters become individually distinct at every size.</p>
                </CardContent>
              </Card>

            </div>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* STYLE & PERSONALITY */}
          <div className="space-y-4">
            <div>
              <p className="label-md">Style &amp; Personality</p>
              <p className="p-sm text-muted-foreground mt-0.5">Letterform choices that shape tone — contemporary, approachable, and distinctly ours.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

              {/* cv11 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv11" 0', fontSize: 48, lineHeight: 1 }}>a</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv11" 1', fontSize: 48, lineHeight: 1 }}>a</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv11</code>
                    <span className="label-sm">Single-story a</span>
                  </div>
                  <p className="p-sm text-muted-foreground">The single-bowl a matches handwritten letterforms — open, friendly, modern. Where the double-story default reads formal and mechanical, the single-story form reads contemporary and human. One character shifts Inter&apos;s entire tone.</p>
                </CardContent>
              </Card>

              {/* cv12 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv12" 0', fontSize: 48, lineHeight: 1 }}>f</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv12" 1', fontSize: 48, lineHeight: 1 }}>f</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv12</code>
                    <span className="label-sm">Compact f</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Reduces the overhang of the f ascender, creating a cleaner silhouette in body text. A detail most readers won&apos;t consciously notice — but combined with cv13, it makes the overall text texture calmer and more even.</p>
                </CardContent>
              </Card>

              {/* cv13 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv13" 0', fontSize: 48, lineHeight: 1 }}>t</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv13" 1', fontSize: 48, lineHeight: 1 }}>t</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv13</code>
                    <span className="label-sm">Compact t</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Tightens the t crossbar, reducing visual noise at text sizes. Pairs with cv12 to create a consistent compact aesthetic across the most visually complex letterforms in the Latin alphabet.</p>
                </CardContent>
              </Card>

              {/* ss03 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"ss03" 0', fontSize: 36, lineHeight: 1 }}>{"\u201CHi,\u201D"}</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"ss03" 1', fontSize: 36, lineHeight: 1 }}>{"\u201CHi,\u201D"}</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">ss03</code>
                    <span className="label-sm">Round Quotes &amp; Commas</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Replaces angular quotation marks and commas with softer, rounder forms. Adds warmth to UI copy, tooltips, empty states, and error messages — anywhere the product speaks directly to the user.</p>
                </CardContent>
              </Card>

            </div>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* TYPOGRAPHIC POLISH */}
          <div className="space-y-4">
            <div>
              <p className="label-md">Typographic Polish</p>
              <p className="p-sm text-muted-foreground mt-0.5">Low-level rendering improvements for text texture, ligatures, and international support.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* dlig */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"dlig" 0', fontSize: 40, lineHeight: 1, letterSpacing: "0.02em" }}>fi fl fj</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">→</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"dlig" 1', fontSize: 40, lineHeight: 1, letterSpacing: "0.02em" }}>fi fl fj</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">dlig</code>
                    <span className="label-sm">Discretionary Ligatures</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Merges fi, fl, and fj into single optimized glyphs — the f&apos;s hook no longer collides with the adjacent character. Creates a smoother, more cohesive text texture, most noticeable in headings and display sizes.</p>
                </CardContent>
              </Card>

              {/* ccmp */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <div style={{ fontFeatureSettings: '"ccmp" 1', fontSize: 40, lineHeight: 1, letterSpacing: "0.05em" }}>é ü ñ</div>
                    <div className="label-sm text-muted-foreground mt-1">active</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">ccmp</code>
                    <span className="label-sm">Glyph Composition</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Ensures composite glyphs — accented characters, diacritical marks — are rendered with precisely positioned components. Foundational for multilingual UI: without it, diacritics can collide or misalign across browsers and rendering contexts.</p>
                </CardContent>
              </Card>

            </div>
          </div>

        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════
       * 3. COLOR PRIMITIVES
       * ═══════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Color Primitives</CardTitle>
          <CardDescription className="p">
            Base color scales in OKLCH. Designed for accessibility and perceptual uniformity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Gray Scale */}
          <div className="space-y-3">
            <div className="label-md">Gray Scale</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {grayScale.map((color) => (
                <div
                  key={color.name}
                  className="h-20 rounded-md border p-2 flex flex-col justify-between"
                  style={{
                    backgroundColor: `var(--${color.name})`,
                    color: parseInt(color.name.split("-")[1]) >= 83 ? "var(--gray-19)" : "var(--gray-98)",
                  }}
                >
                  <div className="p-sm font-[500]">{color.name}</div>
                  <div className="space-y-0.5">
                    <div className="p-sm opacity-75 text-xs">{color.oklch}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Violet Scale */}
          <div className="space-y-3">
            <div className="label-md">Violet Scale (Brand)</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {violetScale.map((color) => (
                <div
                  key={color.name}
                  className="h-20 rounded-md border p-2 flex flex-col justify-between"
                  style={{
                    backgroundColor: color.oklch,
                    color: parseInt(color.name.split("-")[1]) >= 80 ? "var(--gray-19)" : "var(--gray-98)",
                  }}
                >
                  <div className="p-sm font-[500]">{color.name}</div>
                  <div className="space-y-0.5">
                    <div className="p-sm opacity-75 text-xs">{color.oklch}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════
       * 4. SEMANTIC COLOR TOKENS
       * ═══════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Semantic Color Tokens</CardTitle>
          <CardDescription className="p">
            Semantic tokens mapped to primitives. Color swatches and values reflect
            the live token in the active theme and mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {semanticColors.map((section) => (
            <div key={section.section} className="space-y-3">
              <div className="label-md">{section.section}</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead size="sm" className="w-10 text-muted-foreground" />
                    <TableHead size="sm" className="text-muted-foreground">Token</TableHead>
                    <TableHead size="sm" className="text-muted-foreground">Description</TableHead>
                    <TableHead size="sm" className="text-muted-foreground">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.tokens.map((token) => (
                    <TableRow key={token.token}>
                      <TableCell>
                        <div
                          className="size-6 rounded border border-border shrink-0"
                          style={{ backgroundColor: `var(--${token.token})` }}
                        />
                      </TableCell>
                      <TableCell><code className="p-sm font-mono">{token.token}</code></TableCell>
                      <TableCell><span className="p-sm text-muted-foreground">{token.description}</span></TableCell>
                      <TableCell><code className="p-sm font-mono text-muted-foreground">{liveValues[token.token] ?? token.lightValue}</code></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>


      {/* ═══════════════════════════════════════
       * 5. CORNER RADIUS
       * ═══════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Corner Radius</CardTitle>
          <CardDescription className="p">
            A four-tier semantic scale. Each tier is named for its purpose — not
            its size — so the right class is always obvious.
            Corner smoothing is set to 60% (Figma-style continuous curvature)
            via the <code className="font-mono p-sm">.smooth-corners</code>{" "}
            utility class using a CSS Houdini paint worklet (Chromium only,
            graceful fallback in other browsers).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Token table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead size="sm" className="text-muted-foreground">Preview</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Tailwind class</TableHead>
                <TableHead size="sm" className="text-muted-foreground">CSS token</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Value</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radiusTokens.map((t) => (
                <TableRow key={t.twClass}>
                  <TableCell className="py-3">
                    <div
                      className="w-12 h-8 bg-primary/15 border border-primary/30"
                      style={{ borderRadius: t.cssVar ? `var(${t.cssVar})` : "9999px" }}
                    />
                  </TableCell>
                  <TableCell><code className="p-sm font-mono">{t.twClass}</code></TableCell>
                  <TableCell>
                    {t.cssVar
                      ? <code className="p-sm font-mono text-muted-foreground">{t.cssVar}</code>
                      : <span className="p-sm text-muted-foreground">—</span>
                    }
                  </TableCell>
                  <TableCell>
                    <span className="p-sm font-[500]">{t.computed}</span>
                    <span className="p-sm text-muted-foreground ml-1">({t.value})</span>
                  </TableCell>
                  <TableCell><span className="p-sm text-muted-foreground">{t.usage}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Corner smoothing note */}
          <Card level={2}>
            <CardContent className="space-y-2">
              <div className="label-md">Corner Smoothing</div>
              <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                <span className="p-sm text-muted-foreground">Token</span>
                <code className="p-sm font-mono">--corner-smoothing: 60</code>
                <span className="p-sm text-muted-foreground">Method</span>
                <span className="p-sm">CSS Houdini paint worklet (progressive enhancement)</span>
                <span className="p-sm text-muted-foreground">CSS class</span>
                <code className="p-sm font-mono">.smooth-corners</code>
                <span className="p-sm text-muted-foreground">Browser support</span>
                <span className="p-sm">Chromium (Chrome, Edge, Opera, Arc). Falls back to standard <code className="font-mono">border-radius</code> elsewhere.</span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════
       * 6. ELEVATION / SHADOWS
       * ═══════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Elevation</CardTitle>
          <CardDescription className="p">
            Y-axis shadow primitives mapped to semantic elevation tiers.
            Dark mode uses ring+shadow combos for visibility against dark surfaces.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Live preview */}
          <div className="space-y-6">
            {elevationTokens.map((e) => (
              <div
                key={e.name}
                className="rounded-md bg-card p-5"
                style={{ boxShadow: `var(--${e.name})` }}
              >
                <div className="label-md">{e.name}</div>
                <p className="p-sm text-muted-foreground mt-1">{e.usage}</p>
                <code className="p-sm font-mono text-muted-foreground mt-2 block">
                  {e.primitive}: {e.lightValue}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════
       * 7. OVERLAY & GLASS
       * ═══════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Overlay &amp; Glass</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead size="sm" className="text-muted-foreground">Token</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Light</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Dark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><code className="p-sm font-mono">--overlay-bg</code></TableCell>
                <TableCell><span className="p-sm">color-mix(in oklch, muted 60%, transparent)</span></TableCell>
                <TableCell><span className="p-sm">same formula</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code className="p-sm font-mono">--overlay-blur</code></TableCell>
                <TableCell><span className="p-sm">4px</span></TableCell>
                <TableCell><span className="p-sm">4px</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code className="p-sm font-mono">--glass-bg</code></TableCell>
                <TableCell><span className="p-sm">color-mix(in oklch, background 25%, transparent)</span></TableCell>
                <TableCell><span className="p-sm">color-mix(in oklch, background 20%, transparent)</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code className="p-sm font-mono">--glass-blur</code></TableCell>
                <TableCell><span className="p-sm">8px</span></TableCell>
                <TableCell><span className="p-sm">8px</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code className="p-sm font-mono">--glass-border</code></TableCell>
                <TableCell><span className="p-sm">color-mix(in oklch, white 40%, transparent)</span></TableCell>
                <TableCell><span className="p-sm">color-mix(in oklch, white 20%, transparent)</span></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
