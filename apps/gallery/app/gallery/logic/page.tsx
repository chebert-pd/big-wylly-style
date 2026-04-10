"use client"

import React from "react"
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
  Badge,
  Separator,
} from "@wyllo/ui"

/* ─────────────────────────────────────────────
 * DATA
 * ───────────────────────────────────────────── */

const personalityTraits = [
  {
    trait: "Inviting",
    tagline: "Come in and have a conversation with us.",
    expression: "Generous spacing, progressive disclosure, plain-language summaries, calm surfaces. The interface welcomes exploration, never challenges the user.",
    violation: "If something feels overwhelming or visually aggressive, it violates Inviting.",
  },
  {
    trait: "Invested",
    tagline: "Borderline obsessed with creating momentum for your business.",
    expression: "Decision summaries that explain what happened and why. Structured signal breakdowns. Clear action states. Edge-light activation signaling intentional focus.",
    violation: "If the UI feels transactional or mechanical, it violates Invested.",
  },
  {
    trait: "Inspired",
    tagline: "What you do inspires us to be better at what we do.",
    expression: "Strategic summaries over raw logs. Insight-forward dashboards. Space for nuance — confidence, signals observed, layered reasoning. We assume our users are smart.",
    violation: "If the UI talks down to users or oversimplifies complex context into binary labels, it violates Inspired.",
  },
  {
    trait: "Ambitious",
    tagline: "Driven by what\u2019s coming; staying ahead of ever-evolving commerce.",
    expression: "Directional, smooth motion (slide, fade \u2014 no bounce). Structured decision narratives. Semantic states over fear-driven color flooding.",
    violation: "If the interface feels like a crisis console, it violates Ambitious.",
  },
  {
    trait: "Discerning",
    tagline: "Fluent in the realities CX teams face and thoughtfully pointed in our solutions.",
    expression: "Restrained color. No decorative gradients. No badge overuse. Strict radius discipline. Edge-light only for meaningful activation. Every visual decision has intent.",
    violation: "If a UI element exists \u201Cbecause it looks cool,\u201D it violates Discerning.",
  },
]

const weightScale = [
  { role: "Body text", weight: "420", classes: ".p-lg, .p, .p-sm" },
  { role: "Labels / UI", weight: "520", classes: ".label-lg, .label-md, .label-sm" },
  { role: "Headings", weight: "620", classes: ".h1 \u2013 .h4" },
  { role: "Data", weight: "660", classes: ".data-lg, .data-md, .data-sm" },
]

const borderTokens = [
  { token: "--border", light: "gray-91", dark: "gray-29", usage: "Structural \u2014 level 1 cards, layout dividers" },
  { token: "--border-subtle", light: "gray-94", dark: "gray-26", usage: "Soft \u2014 nested surfaces, table rows" },
  { token: "--input", light: "gray-88", dark: "gray-33", usage: "Interactive \u2014 inputs, dialogs, decision UI" },
]

const elevationTokens = [
  { primitive: "--shadow-y1", semantic: "elevation-surface", usage: "Primary cards, panels" },
  { primitive: "--shadow-y2", semantic: "elevation-floating", usage: "Dropdowns, hover panels" },
  { primitive: "--shadow-y6", semantic: "elevation-overlay", usage: "Dialogs, sheets, drawers" },
  { primitive: "--shadow-y16", semantic: "elevation-popover", usage: "Tooltips, command palettes" },
]

const avoidWords = [
  "Fraudster", "Bad actor", "Suspicious customer", "Red flag",
  "Critical threat", "Severe risk", "Dangerous", "Fraud alert",
  "High Risk", "IMMEDIATE ACTION",
]

const preferWords = [
  "Signals observed", "Confidence level", "Recommended action",
  "Risk indicators present", "Review recommended",
  "Additional verification suggested", "Patterns consistent with\u2026",
]

/* ─────────────────────────────────────────────
 * PAGE
 * ───────────────────────────────────────────── */

export default function LogicPage() {
  return (
    <div className="space-y-12 max-w-4xl">

      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="h1">Design Logic</h1>
        <p className="p text-muted-foreground max-w-2xl">
          The architectural and strategic decisions behind the system &mdash; why
          the tokens are structured the way they are, how brand personality
          translates to interface behavior, and what rules govern every component.
        </p>
      </div>

      {/* ======================== */}
      {/* Brand → Product         */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Brand &rarr; Product</CardTitle>
          <CardDescription>
            Marketing expresses momentum. Product expresses judgment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="p text-muted-foreground">
            The portal must visually and behaviorally reflect clarity over intensity,
            insight over alarm, structure over spectacle, and confidence over
            defensiveness. If a UI decision increases noise, urgency, or visual chaos,
            it is misaligned. Brand is not decoration layered onto product &mdash;
            brand is behavior expressed through interface decisions.
          </p>

          <div className="space-y-4">
            {personalityTraits.map((t) => (
              <Card key={t.trait} level={2}>
                <CardContent className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="label-md">{t.trait}</span>
                    <span className="p-sm text-muted-foreground italic">{t.tagline}</span>
                  </div>
                  <p className="p text-muted-foreground">{t.expression}</p>
                  <p className="p-sm text-destructive-foreground">{t.violation}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card level={2}>
            <CardContent className="space-y-2">
              <div className="label-sm">Personality Integrity Test</div>
              <p className="p-sm text-muted-foreground">
                Before shipping any UI change, ask: Does this feel Inviting?
                Does this show we&rsquo;re Invested? Does it respect user intelligence
                (Inspired)? Does it feel forward-looking (Ambitious)? Is it restrained
                and intentional (Discerning)? If the answer to any is &ldquo;no,&rdquo;
                it needs reconsideration.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Color Architecture      */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Color Architecture</CardTitle>
          <CardDescription>
            OKLCH primitives, semantic tokens, and color roles in the product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Primitives</div>
                <p className="p-sm text-muted-foreground">
                  Six OKLCH-based scales &mdash; gray, violet, orange, pink, cyan,
                  and lime &mdash; each named by perceptual lightness. Five brand
                  palettes are built around a foundation color; gray is product-only.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Semantic Layer</div>
                <p className="p-sm text-muted-foreground">
                  Components never reference primitives directly. They consume
                  intent tokens (<code className="p-sm">--background</code>,
                  {" "}<code className="p-sm">--primary</code>,
                  {" "}<code className="p-sm">--border</code>) so the system can
                  shift without rewriting components.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Color Roles</div>
                <p className="p-sm text-muted-foreground">
                  Violet anchors intelligence and brand equity. Orange triggers
                  momentum. Accents bring energy but should punctuate, not dominate.
                  Brand color is used intentionally, not decoratively.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="p-sm text-muted-foreground">
            Status colors are 3-token contracts (bg / border / foreground). Using
            the base token for text (e.g.{" "}
            <code className="p-sm">text-destructive</code>) is a governance
            violation &mdash; use the <code className="p-sm">-foreground</code> variant.
            No gradient surfaces in core workflows. No color flooding to communicate urgency.
          </p>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Surface System          */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Surface System</CardTitle>
          <CardDescription>
            How surfaces alternate, how borders signal depth, and how elevation is applied.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Neutral First */}
          <div className="space-y-3">
            <div className="label-md">Neutral First Policy</div>
            <p className="p text-muted-foreground">
              The product UI is built primarily on neutral surfaces, structured
              borders, and minimal elevation. Default containers are flat. Shadows
              are subtle, rare, and used only to indicate layer change. If something
              is not a new layer, it does not float. Nested structures rely on surface
              contrast, borders, and spacing &mdash; not shadows.
            </p>
          </div>

          <Separator />

          {/* Tone alternation */}
          <div className="space-y-3">
            <div className="label-md">Tone Alternation</div>
            <p className="p text-muted-foreground">
              Cards compute their surface tone from a numeric{" "}
              <code className="p-sm">level</code> prop. Odd levels render the
              primary surface; even levels render the secondary surface. Size scales
              automatically &mdash; level 1 uses default, level 2 uses sm, level 3+
              uses xs.
            </p>

            <div className="rounded-xl bg-secondary p-4 space-y-3">
              <span className="label-sm text-muted-foreground">Level 0 &mdash; Canvas</span>
              <Card level={1}>
                <CardContent className="space-y-3">
                  <span className="label-sm text-muted-foreground">Level 1 &mdash; Primary surface</span>
                  <Card level={2}>
                    <CardContent>
                      <span className="label-sm text-muted-foreground">Level 2 &mdash; Nested surface</span>
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
              Three tiers of border provide depth cues. The{" "}
              <code className="p-sm">input</code> token is appropriate anywhere the
              user is actively making a decision &mdash; not just form fields.
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
                    <TableCell><code className="p-sm">{b.token}</code></TableCell>
                    <TableCell><code className="p-sm">{b.light}</code></TableCell>
                    <TableCell><code className="p-sm">{b.dark}</code></TableCell>
                    <TableCell className="p-sm text-muted-foreground">{b.usage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Elevation */}
          <div className="space-y-3">
            <div className="label-md">Elevation</div>
            <p className="p text-muted-foreground">
              Shadows are named by Y-axis offset at the primitive level, then mapped
              to semantic roles. All shadows use violet-tinted ambient color for
              brand cohesion. Only level 1 surfaces carry elevation. In dark mode,
              each tier gains an inset ring border.
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
                    <TableCell><code className="p-sm">{e.primitive}</code></TableCell>
                    <TableCell><code className="p-sm">{e.semantic}</code></TableCell>
                    <TableCell className="p-sm text-muted-foreground">{e.usage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Typography              */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Typography</CardTitle>
          <CardDescription>
            Inter Variable with a four-tier numeric weight system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="p text-muted-foreground">
            Global base weight of <code className="p-sm">420</code>. We use
            custom OpenType features to establish our own typographic identity
            within Inter &mdash; single-story a, disambiguated I/l/1, round
            quotes, tabular numerals. Named weights
            (<code className="p-sm">font-bold</code>,{" "}
            <code className="p-sm">font-medium</code>) are forbidden. The
            governance auditor enforces numeric values exclusively.
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
                  <TableCell><code className="p-sm">{w.weight}</code></TableCell>
                  <TableCell><code className="p-sm">{w.classes}</code></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Interaction             */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Interaction Architecture</CardTitle>
          <CardDescription>
            How states are communicated through structure, elevation, and edge light.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Structure = Border</div>
                <p className="p-sm text-muted-foreground">
                  Borders and background color define structural relationships.
                  Layout components own spacing.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Elevation = Shadow</div>
                <p className="p-sm text-muted-foreground">
                  Shadows indicate layer change only. Interactive components
                  may gain elevation on hover.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Activation = Edge Light</div>
                <p className="p-sm text-muted-foreground">
                  Edge light (subtle outer outline) is reserved for selection,
                  focus, and activation. It is never decorative.
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="p-sm text-muted-foreground">
            Layout components (Field, CardHeader) own spacing and structure.
            Interactive components (ChoiceCard, Switch, Tabs) own selection,
            halo, and hover states. This separation prevents cascading side
            effects when composing complex interfaces. The tokenized halo uses{" "}
            <code className="p-sm">--accent-halo</code> for consistent feedback
            across cards, radios, and toggles.
          </p>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Visual Governance       */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Visual Governance</CardTitle>
          <CardDescription>
            Rules that prevent drift from the brand&rsquo;s visual language.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-3">
            <div className="label-md">Geometry Discipline</div>
            <p className="p text-muted-foreground">
              The product uses a locked radius scale: 4px (micro), 6px (small controls),
              8px (controls), 12px (cards), 16px (overlays). No arbitrary radii. No mixed
              radii inside a component. Softness communicates warmth. Consistency
              communicates authority.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Motion Governance</div>
            <p className="p text-muted-foreground">
              Motion must be directional, smooth, calm, and intentional. Allowed:
              slide, fade, scale transitions. Forbidden: bounce, gooey morph,
              elastic overshoot, decorative animation. Momentum without theatrics.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Alarm Control Policy</div>
            <p className="p text-muted-foreground">
              The product avoids excessive red usage, stacked alert banners,
              fear-based visual emphasis, and emotional language. Risk is
              communicated through structured explanation, confidence levels,
              signals observed, and recommended actions. Alert banners are reserved
              for system outages, integration failures, and configuration errors
              &mdash; never for normal risk decisions. Risk is part of the system.
              It is not an emergency.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Brand Drift Detection</div>
            <p className="p text-muted-foreground">
              A design decision may be misaligned if it: uses brand color decoratively,
              introduces unstructured shadow, adds multiple competing emphasis styles,
              creates visual density or urgency, adds expressive motion without functional
              purpose, or uses gradients in workflow surfaces. When in doubt, ask:
              Does this increase clarity? Does this reduce anxiety? Does this reinforce
              structured intelligence?
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Content & Language       */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Content &amp; Language</CardTitle>
          <CardDescription>
            How risk, decisions, and states are communicated in the product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-3">
            <div className="label-md">Core Principles</div>
            <p className="p text-muted-foreground">
              We describe, we don&rsquo;t declare. We lead with insight, not
              emotion. We separate the customer from risk &mdash; we assess
              behavior and signals, not character. When a user reads any risk
              message, they should feel informed, in control, supported, and
              clear on the next step. They should never feel alarmed, accused,
              panicked, or judged.
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm text-destructive-foreground">Avoid</div>
                <ul className="space-y-1">
                  {avoidWords.map((w) => (
                    <li key={w} className="p-sm text-muted-foreground">{w}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm text-success-foreground">Prefer</div>
                <ul className="space-y-1">
                  {preferWords.map((w) => (
                    <li key={w} className="p-sm text-muted-foreground">{w}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Confidence Model</div>
            <p className="p text-muted-foreground">
              Surface-level views use categorical confidence (High / Moderate /
              Low) for fast scanning. Drill-down views (SidePanel, expanded
              signal view) reveal percentage scores and threshold variance for
              analytical depth. Pass/Fail remains as operational system status
              in MVP, visually secondary to the decision + confidence framing.
              Over time, confidence becomes the primary signal.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Progressive Depth</div>
            <p className="p text-muted-foreground">
              Primary views surface summaries, decisions, and key signals. Detail
              lives in side panels, expandable sections, and secondary views.
              The portal never dumps full diagnostic data as a default state.
              Less reaction. More reason.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Component Principles    */}
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
              Visual differences are implemented as variants, not new components.
              A Card&rsquo;s tone, border, and elevation are derived from its{" "}
              <code className="p-sm">level</code> prop automatically.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Semantic Tokens Only</div>
            <p className="p text-muted-foreground">
              Components reference semantic tokens exclusively. No raw primitives.
              The governance auditor enforces this automatically.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Navigation vs Actions</div>
            <p className="p text-muted-foreground">
              <code className="p-sm">Button</code> triggers an action;{" "}
              <code className="p-sm">Link</code> navigates. Context menus are
              right-click only &mdash; use{" "}
              <code className="p-sm">DropdownMenu</code> for button-activated
              action lists.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Dialogs Require Actions</div>
            <p className="p text-muted-foreground">
              Every Dialog must have a footer with at least one action. A dialog
              without footer actions should not be a dialog &mdash; use SidePanel,
              toast, or Popover instead.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Dark Mode               */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Dark Mode Strategy</CardTitle>
          <CardDescription>
            Independent semantic remapping, not mathematical inversion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="p text-muted-foreground">
            Core polarity tokens invert between themes. All other semantic tokens
            are intentionally remapped to preserve contrast, hierarchy, and
            interaction clarity. The relationships hold, not the absolute values.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Proportional Contrast</div>
                <p className="p-sm text-muted-foreground">
                  Dark mode tokens maintain the same relative contrast deltas
                  between surfaces. Card is slightly elevated from background.
                  Subtle borders are always less prominent than structural borders.
                </p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-2">
                <div className="label-sm">Solid Variants</div>
                <p className="p-sm text-muted-foreground">
                  Destructive and brand schemes include solid variants for filled
                  backgrounds. These invert independently from the tinted set and
                  should never be mixed with them.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Responsive              */}
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
              Components change structure at breakpoints &mdash; sidebar collapsing,
              cards stacking, radio cards reflowing &mdash; rather than simply
              resizing. Layout adapts to cognition, not just viewport width.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Density Scaling</div>
            <p className="p text-muted-foreground">
              Controls and navigation offer size variants to support both dense
              dashboards and spacious workflows using the same token system.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="label-md">Navigation Collapse</div>
            <p className="p text-muted-foreground">
              The primary sidebar collapses into a hamburger-driven mobile drawer
              below the <code className="p-sm">lg</code> breakpoint. The mobile
              header is sticky to keep navigation reachable while scrolling.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      {/* Product Integrity       */}
      {/* ======================== */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Product Integrity Standard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="p text-muted-foreground">
            The Wyllo portal should feel like a strategic intelligence environment.
            Not a fintech marketing site. Not a consumer app. Not a security bunker.
            Not a startup experiment. Every visual and behavioral decision must ladder
            up to: clarity, judgment, and structured insight.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
