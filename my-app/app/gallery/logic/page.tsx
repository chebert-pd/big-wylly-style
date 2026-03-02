"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

/* ─────────────────────────────────────────────
 * DATA
 * ───────────────────────────────────────────── */

const opentypeFeatures = [
  {
    feature: "calt",
    value: "off",
    purpose: "Contextual alternates disabled — preserves glyph consistency",
  },
  {
    feature: "dlig",
    value: "on",
    purpose: "Discretionary ligatures for visual polish",
  },
  {
    feature: "tnum",
    value: "on",
    purpose: "Tabular (monospaced) digits for data alignment",
  },
  {
    feature: "frac",
    value: "on",
    purpose: "Proper fraction rendering",
  },
  {
    feature: "ccmp",
    value: "on",
    purpose: "Glyph composition / decomposition",
  },
  {
    feature: "ss03",
    value: "on",
    purpose: "Open digits — geometric 6 and 9 with open terminals",
  },
  {
    feature: "cv01–cv05",
    value: "on",
    purpose: "Alternate numerals (1, 4, 6, 9) and disambiguated lowercase l",
  },
  {
    feature: "cv08–cv13",
    value: "on",
    purpose: "Alternate letterforms — single-story a, simplified u, circular dots",
  },
]

const weightScale = [
  { role: "Body text", weight: "425", classes: ".p-lg, .p, .p-sm" },
  { role: "Labels / UI", weight: "525", classes: ".label-lg, .label-md, .label-sm" },
  { role: "Headings", weight: "650", classes: ".h1 – .h4" },
  { role: "Data", weight: "650", classes: ".data-lg, .data-md, .data-sm" },
]

const radiusScale = [
  {
    token: "--radius",
    value: "4px",
    tailwind: "rounded",
    usage: "Micro elements — badges, chips",
  },
  {
    token: "--radius-lg",
    value: "8px",
    tailwind: "rounded-lg",
    usage: "Controls — buttons, inputs, dropdowns",
  },
  {
    token: "--radius-xl",
    value: "12px",
    tailwind: "rounded-xl",
    usage: "Structural cards",
  },
  {
    token: "--radius-2xl",
    value: "16px",
    tailwind: "rounded-2xl",
    usage: "Large surfaces — dialogs, sheets",
  },
]

const borderTokens = [
  {
    token: "--border",
    light: "gray-91",
    dark: "gray-55",
    usage: "Structural — level 1 cards, layout dividers",
  },
  {
    token: "--border-subtle",
    light: "gray-94",
    dark: "gray-33",
    usage: "Soft — nested surfaces, table rows",
  },
  {
    token: "--input",
    light: "gray-88",
    dark: "gray-33",
    usage: "Interactive — inputs, dialogs",
  },
]

const elevationTokens = [
  {
    primitive: "--shadow-y1",
    semantic: "elevation-surface",
    usage: "Primary cards, panels",
  },
  {
    primitive: "--shadow-y2",
    semantic: "elevation-floating",
    usage: "Dropdowns, hover panels",
  },
  {
    primitive: "--shadow-y6",
    semantic: "elevation-overlay",
    usage: "Dialogs, sheets, drawers",
  },
  {
    primitive: "--shadow-y16",
    semantic: "elevation-popover",
    usage: "Tooltips, command palettes",
  },
]

const glassTokens = [
  {
    token: "--overlay-bg",
    light: "color-mix(muted 60%, transparent)",
    dark: "same",
  },
  { token: "--overlay-blur", light: "4px", dark: "4px" },
  {
    token: "--glass-bg",
    light: "color-mix(background 25%, transparent)",
    dark: "color-mix(background 20%, transparent)",
  },
  { token: "--glass-blur", light: "8px", dark: "8px" },
  {
    token: "--glass-border",
    light: "color-mix(white 40%, transparent)",
    dark: "color-mix(white 20%, transparent)",
  },
]

/* ─────────────────────────────────────────────
 * PAGE
 * ───────────────────────────────────────────── */

export default function LogicPage() {
  return (
    <div className="space-y-12 max-w-4xl">
      {/* ======================== */}
      {/* Page Header              */}
      {/* ======================== */}
      <div className="space-y-2">
        <h1 className="h1">Design Logic</h1>
        <p className="p text-muted-foreground max-w-2xl">
          The architectural decisions behind the system — how tokens are
          structured, how surfaces alternate, how elevation works, and how
          semantic intent maps to visual primitives. This is the &ldquo;why&rdquo;
          behind the UI.
        </p>
      </div>

      {/* ======================== */}
      {/* Brand Direction          */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Brand Direction</CardTitle>
          <CardDescription>
            The design language that shapes every decision in this system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="label-md">Architectural Softness</div>
            <p className="p text-muted-foreground">
              The system is built around a principle we call Architectural
              Softness — calm, decisive, and spatially organized. Surfaces feel
              deliberate and measured, with just enough warmth to support
              sensitive, high-trust contexts. Nothing reads as glassy,
              experimental, or startup-y. Softness is structural, not cosmetic.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card level={2}>
              <CardContent>
                <div className="label-sm">Calm</div>
                <p className="p-sm text-muted-foreground">
                  Low-contrast surfaces, muted borders, and restrained color
                  keep the interface quiet.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent>
                <div className="label-sm">Decisive</div>
                <p className="p-sm text-muted-foreground">
                  Clear hierarchy through weight, level, and semantic tokens —
                  never ambiguous.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent>
                <div className="label-sm">Spatial</div>
                <p className="p-sm text-muted-foreground">
                  Surface alternation, elevation tiers, and 4px rhythm create
                  architectural depth.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Typography               */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Typography</CardTitle>
          <CardDescription>
            Inter Variable with custom OpenType features and a utility-driven
            type scale.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Font choice */}
          <div className="space-y-3">
            <div className="label-md">Inter Variable</div>
            <p className="p text-muted-foreground">
              The system runs on Inter Variable, loaded locally as a single
              variable font file (
              <code className="p-sm">InterVariable.woff2</code>). It&rsquo;s
              configured with{" "}
              <code className="p-sm">font-optical-sizing: auto</code> and a
              global base weight of{" "}
              <code className="p-sm">425</code> — slightly lighter than
              Inter&rsquo;s default 400 for better readability at small sizes in
              data-heavy interfaces.
            </p>
          </div>

          {/* OpenType features */}
          <div className="space-y-3">
            <div className="label-md">OpenType Customization</div>
            <p className="p text-muted-foreground">
              Inter ships with extensive stylistic alternates. We enable a
              specific set globally to produce a more geometric, open feel while
              preserving legibility in dense UI.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead size="sm">Feature</TableHead>
                  <TableHead size="sm">State</TableHead>
                  <TableHead size="sm">Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opentypeFeatures.map((f) => (
                  <TableRow key={f.feature}>
                    <TableCell>
                      <code className="p-sm">{f.feature}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{f.value}</Badge>
                    </TableCell>
                    <TableCell className="p-sm text-muted-foreground">
                      {f.purpose}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Weight scale */}
          <div className="space-y-3">
            <div className="label-md">Weight as Hierarchy</div>
            <p className="p text-muted-foreground">
              Hierarchy is created through weight and rhythm, not just size.
              Three weight tiers cover the full range from body text to data
              displays.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead size="sm">Role</TableHead>
                  <TableHead size="sm">Weight</TableHead>
                  <TableHead size="sm">Classes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weightScale.map((w) => (
                  <TableRow key={w.role}>
                    <TableCell className="p-sm">{w.role}</TableCell>
                    <TableCell>
                      <code className="p-sm">{w.weight}</code>
                    </TableCell>
                    <TableCell>
                      <code className="p-sm">{w.classes}</code>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="p-sm text-muted-foreground">
              Data classes also enable{" "}
              <code className="p-sm">tabular-nums</code> and{" "}
              <code className="p-sm">leading-tight</code> for dashboard-grade
              density.
            </p>
          </div>

          {/* Vertical rhythm */}
          <div className="space-y-3">
            <div className="label-md">4px Vertical Rhythm</div>
            <p className="p text-muted-foreground">
              Line heights and spacing are aligned to a 4px grid. This enforces
              tighter SaaS-style density rather than editorial looseness, and
              reinforces the architectural precision of the layout.
            </p>
          </div>

          {/* Form typography */}
          <div className="space-y-3">
            <div className="label-md">Form Typography</div>
            <p className="p text-muted-foreground">
              Form labels use <code className="p-sm">.form-label</code> (14px /
              425 / muted foreground) to reduce visual noise. Entered values use{" "}
              <code className="p-sm">.form-data</code> (14px / 525 / foreground)
              so user input reads as the primary information. This hierarchy
              keeps dense forms scannable.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Shape & Radius           */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Shape &amp; Radius</CardTitle>
          <CardDescription>
            A 4-tier radius scale that maps structural intent to corner size.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead size="sm">Token</TableHead>
                <TableHead size="sm">Value</TableHead>
                <TableHead size="sm">Tailwind</TableHead>
                <TableHead size="sm">Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radiusScale.map((r) => (
                <TableRow key={r.token}>
                  <TableCell>
                    <code className="p-sm">{r.token}</code>
                  </TableCell>
                  <TableCell className="p-sm">{r.value}</TableCell>
                  <TableCell>
                    <code className="p-sm">{r.tailwind}</code>
                  </TableCell>
                  <TableCell className="p-sm text-muted-foreground">
                    {r.usage}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Visual demo */}
          <div className="space-y-2">
            <div className="flex items-end gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="size-14 rounded border border-[var(--border)] bg-secondary" />
                <span className="p-sm text-muted-foreground">4px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="size-14 rounded-lg border border-[var(--border)] bg-secondary" />
                <span className="p-sm text-muted-foreground">8px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="size-14 rounded-xl border border-[var(--border)] bg-secondary" />
                <span className="p-sm text-muted-foreground">12px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="size-14 rounded-2xl border border-[var(--border)] bg-secondary" />
                <span className="p-sm text-muted-foreground">16px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="size-14 rounded-full border border-[var(--border)] bg-secondary" />
                <span className="p-sm text-muted-foreground">full</span>
              </div>
            </div>
          </div>

          {/* Corner smoothing */}
          <div className="space-y-3">
            <div className="label-md">Corner Smoothing</div>
            <p className="p text-muted-foreground">
              The system defines{" "}
              <code className="p-sm">--corner-smoothing: 60</code> and a{" "}
              <code className="p-sm">.smooth-corners</code> utility that uses a
              CSS Houdini paint worklet for Figma-style continuous curvature
              (squircles). This is Chromium-only with graceful fallback to
              standard <code className="p-sm">border-radius</code> on other
              browsers. Corner smoothing is opt-in per element, not applied
              globally.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Color Architecture       */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Color Architecture</CardTitle>
          <CardDescription>
            OKLCH primitives, semantic tokens, and a two-tier mapping system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">1. Primitives</div>
                <p className="p-sm text-muted-foreground">
                  Gray and violet scales defined by OKLCH lightness (e.g.{" "}
                  <code className="p-sm">--gray-91</code>,{" "}
                  <code className="p-sm">--violet-64</code>). Shared hue 288 for
                  grays, 286.45 for violets. Named by perceptual lightness for
                  predictability.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">2. Semantic Layer</div>
                <p className="p-sm text-muted-foreground">
                  Intent tokens (
                  <code className="p-sm">--background</code>,{" "}
                  <code className="p-sm">--primary</code>,{" "}
                  <code className="p-sm">--border</code>) map to primitives.
                  Components never reference primitives directly — they consume
                  semantic tokens so the system can shift without rewriting
                  components.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">3. OKLCH Benefits</div>
                <p className="p-sm text-muted-foreground">
                  Perceptual lightness consistency, predictable contrast shifts
                  between steps, and better dark-mode parity compared to HSL or
                  HEX color spaces.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="p-sm text-muted-foreground">
            Semantic states (success, warning, destructive) use
            Tailwind-native color families (emerald, amber, rose) in a
            consistent 50 / 200 / 600 pattern for background, border, and
            foreground.
          </p>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Surface System           */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Surface System</CardTitle>
          <CardDescription>
            How surfaces alternate, how borders signal depth, and how
            elevation is applied.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Tone alternation */}
          <div className="space-y-3">
            <div className="label-md">Tone Alternation</div>
            <p className="p text-muted-foreground">
              Cards compute their surface tone from a numeric{" "}
              <code className="p-sm">level</code> prop. Odd levels render the
              primary surface (<code className="p-sm">--card</code>); even
              levels render the secondary surface (
              <code className="p-sm">--secondary</code>). This keeps nested
              surfaces visually distinct without manually assigning variants.
            </p>

            {/* Live demo */}
            <div className="rounded-xl bg-secondary p-4 space-y-3">
              <span className="label-sm text-muted-foreground">
                Level 0 — Canvas
              </span>
              <Card level={1}>
                <CardContent className="space-y-3">
                  <span className="label-sm text-muted-foreground">
                    Level 1 — Primary surface
                  </span>
                  <Card level={2}>
                    <CardContent>
                      <span className="label-sm text-muted-foreground">
                        Level 2 — Nested surface
                      </span>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Border hierarchy */}
          <div className="space-y-3">
            <div className="label-md">Border Hierarchy</div>
            <p className="p text-muted-foreground">
              Three tiers of border provide clear depth cues. Structural
              borders are visible; subtle borders recede; input borders carry
              stronger contrast for interactive affordance.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead size="sm">Token</TableHead>
                  <TableHead size="sm">Light</TableHead>
                  <TableHead size="sm">Dark</TableHead>
                  <TableHead size="sm">Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borderTokens.map((b) => (
                  <TableRow key={b.token}>
                    <TableCell>
                      <code className="p-sm">{b.token}</code>
                    </TableCell>
                    <TableCell>
                      <code className="p-sm">{b.light}</code>
                    </TableCell>
                    <TableCell>
                      <code className="p-sm">{b.dark}</code>
                    </TableCell>
                    <TableCell className="p-sm text-muted-foreground">
                      {b.usage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="p-sm text-muted-foreground">
              Level 0 (canvas) has no border. Level 1 surfaces use{" "}
              <code className="p-sm">--border</code>. Level 2+ surfaces use{" "}
              <code className="p-sm">--border-subtle</code> to reduce visual
              weight and preserve hierarchy.
            </p>
          </div>

          <Separator />

          {/* Elevation */}
          <div className="space-y-3">
            <div className="label-md">Elevation</div>
            <p className="p text-muted-foreground">
              Shadows are named by Y-axis offset at the primitive level, then
              mapped to semantic elevation roles. All shadows use a
              violet-tinted ambient color (hue 286.45) for cohesion with the
              brand palette.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead size="sm">Primitive</TableHead>
                  <TableHead size="sm">Semantic</TableHead>
                  <TableHead size="sm">Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elevationTokens.map((e) => (
                  <TableRow key={e.primitive}>
                    <TableCell>
                      <code className="p-sm">{e.primitive}</code>
                    </TableCell>
                    <TableCell>
                      <code className="p-sm">{e.semantic}</code>
                    </TableCell>
                    <TableCell className="p-sm text-muted-foreground">
                      {e.usage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="p-sm text-muted-foreground">
              Only level 1 surfaces carry elevation. Level 2+ are flat. In dark
              mode, each shadow tier gains an inset ring border to compensate
              for reduced shadow visibility against dark backgrounds.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Overlay & Glass          */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Overlay &amp; Glass</CardTitle>
          <CardDescription>
            How modals, sheets, and floating surfaces are composed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Overlay Scrim</div>
                <p className="p-sm text-muted-foreground">
                  Background scrim uses{" "}
                  <code className="p-sm">color-mix()</code> to blend{" "}
                  <code className="p-sm">--muted</code> at 60% opacity with a
                  4px backdrop blur. The muted tone keeps the scrim warm and
                  cohesive with the surface system.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Glass Surface</div>
                <p className="p-sm text-muted-foreground">
                  The <code className="p-sm">&lt;GlassFrame /&gt;</code>{" "}
                  wrapper provides a frosted container for dialogs and sheets.
                  It uses 25% <code className="p-sm">--background</code> with
                  8px backdrop blur, a translucent white border, and 2px of
                  padding that peeks around the inner content.
                </p>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead size="sm">Token</TableHead>
                <TableHead size="sm">Light</TableHead>
                <TableHead size="sm">Dark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {glassTokens.map((g) => (
                <TableRow key={g.token}>
                  <TableCell>
                    <code className="p-sm">{g.token}</code>
                  </TableCell>
                  <TableCell className="p-sm text-muted-foreground">
                    {g.light}
                  </TableCell>
                  <TableCell className="p-sm text-muted-foreground">
                    {g.dark}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Interaction              */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Interaction Architecture</CardTitle>
          <CardDescription>
            How selection, focus, and interactive states are structured.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="label-md">Ownership Separation</div>
            <p className="p text-muted-foreground">
              Layout components (Field, CardHeader) own spacing and structure.
              Interactive components (ChoiceCard, Switch, Tabs) own selection,
              halo, border, and hover states. This separation prevents
              cascading side effects when composing complex interfaces.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Tokenized Halo</div>
            <p className="p text-muted-foreground">
              Selection halos use{" "}
              <code className="p-sm">--accent-halo</code> — a 2px ring built
              with <code className="p-sm">color-mix()</code> at 40% primary
              opacity. This ensures consistent focus and selection feedback
              across cards, radios, and toggles without ad-hoc ring utilities.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Primary Border Emphasis</div>
            <p className="p text-muted-foreground">
              When primary emphasis needs to feel premium (e.g. default
              badges), a dedicated{" "}
              <code className="p-sm">--border-primary-subtle</code> token uses
              the same 40% <code className="p-sm">color-mix()</code> approach.
              This avoids overbearing solid borders while staying within the
              semantic system.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Skeuomorphic Toggle</div>
            <p className="p text-muted-foreground">
              The Switch thumb uses tokenized gradients and layered shadows to
              create a subtle raised effect. On-state styling shifts from
              neutral gray undertones to violet undertones while preserving
              the same structural logic.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Dark Mode                */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Dark Mode Strategy</CardTitle>
          <CardDescription>
            Independent semantic remapping — not mathematical lightness
            inversion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="p text-muted-foreground">
            Core polarity tokens (
            <code className="p-sm">background</code> and{" "}
            <code className="p-sm">foreground</code>) invert between themes.
            All other semantic tokens are intentionally remapped to different
            primitives per theme to preserve contrast, hierarchy, and
            interaction clarity.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Structural vs Subtle Borders</div>
                <p className="p-sm text-muted-foreground">
                  Subtle borders (
                  <code className="p-sm">--border-subtle</code>) are always
                  perceptually lighter than structural borders (
                  <code className="p-sm">--border</code>) in both themes.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Destructive Solid Token</div>
                <p className="p-sm text-muted-foreground">
                  Destructive buttons use{" "}
                  <code className="p-sm">--destructive-solid</code> instead of
                  the background semantic. This preserves accessibility without
                  compromising contextual alert styling.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Composition Patterns     */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Composition Patterns</CardTitle>
          <CardDescription>
            Recurring structural patterns that components share.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">GlassFrame Wrapper</div>
                <p className="p-sm text-muted-foreground">
                  Dialogs and sheets share a reusable{" "}
                  <code className="p-sm">&lt;GlassFrame /&gt;</code>. Blur,
                  border, padding, and ambient shadow are centralized so
                  overlays remain visually consistent.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">DataTable Shell</div>
                <p className="p-sm text-muted-foreground">
                  DataTable separates structural table rendering from optional
                  controls (search, filters, column visibility). Features are
                  composable, not baked in.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Inline Field Controls</div>
                <p className="p-sm text-muted-foreground">
                  Tables and dense workflows use inline variants for Input and
                  Select — borderless by default, 525 weight, with an animated
                  underline that thickens on focus.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Metric Panel</div>
                <p className="p-sm text-muted-foreground">
                  A row of stat-like triggers with a single expandable detail
                  region below. Closed by default with click-to-open,
                  click-again-to-close behavior.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Semantic Badges</div>
                <p className="p-sm text-muted-foreground">
                  Badges support semantic intent variants and composed patterns
                  (status, indicator, avatar, delta, action). Composed patterns
                  are style-agnostic and pair with any variant.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Form Field Composition</div>
                <p className="p-sm text-muted-foreground">
                  All inputs are wrapped in{" "}
                  <code className="p-sm">&lt;Field&gt;</code> for consistent
                  label association and error display. FieldGroup and FieldSet
                  provide semantic grouping above individual fields.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Component Principles     */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Component Principles</CardTitle>
          <CardDescription>
            Rules that govern how components are built and used.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="label-md">Variant over Duplication</div>
            <p className="p text-muted-foreground">
              Visual differences (tone, border, elevation, size) are
              implemented as variants — not new components. A Card&rsquo;s
              tone, border, and elevation are derived from its{" "}
              <code className="p-sm">level</code> prop automatically.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Semantic Tokens Only</div>
            <p className="p text-muted-foreground">
              Buttons, Cards, Alerts, and Inputs reference semantic tokens
              exclusively. No component references raw primitive values.
              Components consume{" "}
              <code className="p-sm">--border</code>, never{" "}
              <code className="p-sm">--gray-91</code>.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Navigation vs Actions</div>
            <p className="p text-muted-foreground">
              <code className="p-sm">Button</code> triggers an action;{" "}
              <code className="p-sm">Link</code> navigates. They are never
              interchangeable. Context menus are right-click only — use{" "}
              <code className="p-sm">DropdownMenu</code> for button-activated
              action lists.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">System Trust</div>
            <p className="p text-muted-foreground">
              Gallery pages and examples never override tokens. They rely
              entirely on system logic so architecture can be validated under
              real nesting conditions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Responsive Philosophy    */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Responsive Philosophy</CardTitle>
          <CardDescription>
            How the system adapts across viewport sizes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="label-md">Structural Reflow</div>
            <p className="p text-muted-foreground">
              Components change structure at breakpoints — sidebar collapsing,
              cards stacking, radio cards reflowing — rather than simply
              resizing. Layout adapts to cognition, not just viewport width.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Density Scaling</div>
            <p className="p text-muted-foreground">
              Controls and navigation offer size variants (Tabs, Buttons,
              TableHead) to support both dense dashboards and spacious
              workflows using the same token system.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Navigation Collapse</div>
            <p className="p text-muted-foreground">
              The primary sidebar collapses into a hamburger-driven mobile
              drawer below the{" "}
              <code className="p-sm">lg</code> breakpoint. The mobile header
              is sticky to keep navigation reachable while scrolling content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
