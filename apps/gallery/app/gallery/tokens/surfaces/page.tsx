"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@chebert-pd/ui"

const radiusTokens = [
  {
    cssVar: "--radius-sm",
    twClass: "rounded-sm",
    value: "calc(--radius - 4px)",
    computed: "4px",
    tier: "1 — Micro",
    usage: "Badges, tags, chips, table selection backgrounds",
  },
  {
    cssVar: "--radius-md",
    twClass: "rounded-md",
    value: "calc(--radius - 2px)",
    computed: "6px",
    tier: "2 — Small controls",
    usage: "Small buttons, inline elements",
  },
  {
    cssVar: "--radius-lg",
    twClass: "rounded-lg",
    value: "--radius",
    computed: "8px",
    tier: "3 — Controls",
    usage: "Buttons, inputs, selects, dropdowns, toggle groups",
  },
  {
    cssVar: "--radius-xl",
    twClass: "rounded-xl",
    value: "calc(--radius + 4px)",
    computed: "12px",
    tier: "4 — Cards",
    usage: "Cards at every level — core brand radius",
  },
  {
    cssVar: "--radius-2xl",
    twClass: "rounded-2xl",
    value: "calc(--radius + 8px)",
    computed: "16px",
    tier: "5 — Surfaces",
    usage: "Dialogs, full-width hero modules",
  },
  {
    cssVar: null,
    twClass: "rounded-full",
    value: "9999px",
    computed: "∞",
    tier: "6 — Circular",
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

export default function SurfacesPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="h1">Surfaces & Elevation</h1>
        <p className="p-lg text-muted-foreground">Corner radius, elevation shadows, overlay scrims, and glass surface tokens.</p>
      </div>

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
