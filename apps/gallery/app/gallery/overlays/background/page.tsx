"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@wyllo/ui"

export default function OverlayBackgroundPage() {
  return (
    <div className="space-y-12">

      {/* Page header */}
      <div className="space-y-2">
        <div className="h1">Overlay Background</div>
        <p className="p text-muted-foreground">
          Scrim and glass surface tokens for layered UI — dialogs, sheets, and floating surfaces.
        </p>
      </div>

      {/* ─── Overlay Scrim ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Overlay Scrim</CardTitle>
          <CardDescription className="p-sm">
            The backdrop that sits behind dialogs and sheets. Semi-transparent with subtle blur
            so the content underneath remains perceptible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Live demo */}
          <div className="relative rounded-[var(--radius)] overflow-hidden border border-border" style={{ height: 280 }}>
            {/* Simulated page content underneath */}
            <div className="absolute inset-0 p-5 grid grid-cols-3 gap-3 content-start bg-secondary">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-[var(--radius)] border border-border h-20" />
              ))}
            </div>
            {/* The scrim */}
            <div className="absolute inset-0 bg-overlay backdrop-blur-overlay flex items-center justify-center">
              {/* A floating surface sitting on top */}
              <div
                className="bg-card rounded-[var(--radius)] shadow-[var(--elevation-overlay)] p-6 text-center space-y-2 w-52"
              >
                <div className="label-md">Dialog / Sheet</div>
                <p className="p-sm text-muted-foreground">Floating surface above scrim</p>
              </div>
            </div>
          </div>

          {/* Token reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card level={2} size="sm">
              <CardContent className="space-y-1">
                <div className="label-sm text-muted-foreground">Background</div>
                <code className="p-sm font-mono">bg-overlay</code>
                <p className="p-sm text-muted-foreground">
                  color-mix(background · 60% · transparent) — keeps the page visible
                </p>
              </CardContent>
            </Card>
            <Card level={2} size="sm">
              <CardContent className="space-y-1">
                <div className="label-sm text-muted-foreground">Blur</div>
                <code className="p-sm font-mono">backdrop-blur-overlay</code>
                <p className="p-sm text-muted-foreground">
                  blur(4px) — softens the page content without hiding it
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Usage note */}
          <div className="rounded-[var(--radius)] border border-border-subtle bg-muted/40 px-4 py-3">
            <p className="p-sm text-muted-foreground">
              <span className="font-[525] text-foreground">Usage: </span>
              Apply <code className="font-mono">bg-overlay backdrop-blur-overlay</code> to the
              fixed backdrop element behind any dialog, sheet, or command palette.
            </p>
          </div>

        </CardContent>
      </Card>

      {/* ─── Glass Surface ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Glass Surface</CardTitle>
          <CardDescription className="p-sm">
            Frosted-glass panel for cards that float directly over rich backgrounds — gradients,
            imagery, or coloured canvases. More transparent and stronger blur than the scrim.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Live demo */}
          <div className="relative rounded-[var(--radius)] overflow-hidden border border-border" style={{ height: 280 }}>
            {/* Gradient background to show the glass effect against */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent to-background p-5 grid grid-cols-3 gap-3 content-start">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-primary/15 rounded-[var(--radius)] border border-primary/20 h-20" />
              ))}
            </div>
            {/* Glass card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-glass backdrop-blur-glass border border-glass-border rounded-[var(--radius)] shadow-[var(--elevation-floating)] p-6 text-center space-y-2 w-56">
                <div className="label-md">Glass Panel</div>
                <p className="p-sm text-muted-foreground">Frosted surface above gradient</p>
              </div>
            </div>
          </div>

          {/* Token reference */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card level={2} size="sm">
              <CardContent className="space-y-1">
                <div className="label-sm text-muted-foreground">Background</div>
                <code className="p-sm font-mono">bg-glass</code>
                <p className="p-sm text-muted-foreground">
                  color-mix(background · 25%, transparent)
                </p>
              </CardContent>
            </Card>
            <Card level={2} size="sm">
              <CardContent className="space-y-1">
                <div className="label-sm text-muted-foreground">Blur</div>
                <code className="p-sm font-mono">backdrop-blur-glass</code>
                <p className="p-sm text-muted-foreground">
                  blur(8px) — stronger frosted effect
                </p>
              </CardContent>
            </Card>
            <Card level={2} size="sm">
              <CardContent className="space-y-1">
                <div className="label-sm text-muted-foreground">Border</div>
                <code className="p-sm font-mono">border-glass-border</code>
                <p className="p-sm text-muted-foreground">
                  color-mix(white · 40%, transparent)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Usage note */}
          <div className="rounded-[var(--radius)] border border-border-subtle bg-muted/40 px-4 py-3">
            <p className="p-sm text-muted-foreground">
              <span className="font-[525] text-foreground">Usage: </span>
              Apply <code className="font-mono">bg-glass backdrop-blur-glass border border-glass-border</code> to
              any panel that sits directly over a coloured or gradient background.
            </p>
          </div>

        </CardContent>
      </Card>

      {/* ─── Comparison ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Scrim vs. Glass — When to Use</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card level={2}>
            <CardContent className="space-y-3">
              <div className="label-md">Overlay Scrim</div>
              <ul className="space-y-1.5 p-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="mt-0.5 text-foreground">→</span> Dialog and modal backdrops</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-foreground">→</span> Sheet and drawer backdrops</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-foreground">→</span> Command palette backdrops</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-foreground">→</span> Full-screen interruptions</li>
              </ul>
            </CardContent>
          </Card>
          <Card level={2}>
            <CardContent className="space-y-3">
              <div className="label-md">Glass Surface</div>
              <ul className="space-y-1.5 p-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="mt-0.5 text-foreground">→</span> KPI tiles over gradient dashboards</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-foreground">→</span> Floating panels over imagery</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-foreground">→</span> Contextual tooltips on colour surfaces</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-foreground">→</span> Nav bars with background blur</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

    </div>
  )
}
