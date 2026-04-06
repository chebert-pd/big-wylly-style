import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@wyllo/ui"
import { CodeSnippet } from "@/app/gallery/_components/code-block"

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

export default function SkillsPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      {/* Header */}
      <div className="space-y-4">
        <Badge variant="default">Primitives</Badge>
        <h1 className="h1">Agentic Skills</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          How we make the design system machine-readable so AI can query it,
          audit it, and compose with it &mdash; instead of guessing.
        </p>
      </div>

      <Separator />

      {/* ─────────────────────────────────────────────
       * I. THE PROBLEM
       * ───────────────────────────────────────────── */}

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The drift problem</h2>
          <p className="p text-muted-foreground">
            When AI builds UI without infrastructure, something predictable happens: it finds
            your components, imports them, and then reinvents them from scratch. Raw HTML where
            your Card should be. Hardcoded styles where your Button variants exist. The import
            sits at the top of the file, unused.
          </p>
          <p className="p text-muted-foreground">
            Every generation is a coin flip. Over time, this creates drift &mdash; inconsistent
            styling, duplicated logic, compound technical debt. In benchmarks, unstructured
            exploration missed 25% of components, took over twice as long, and produced false
            negatives: components reported as &ldquo;unused&rdquo; that were actually three
            levels deep in the dependency chain. Following that recommendation would mean
            deleting active code.
          </p>
          <p className="p text-muted-foreground">
            With structured infrastructure, the same questions get answered with 100% accuracy,
            near-zero variance, and 2.5x speed. The AI loads a map once (~4,000 tokens) and
            reasons over it instead of re-reading files.
          </p>
        </div>
        <Card level={2}>
          <CardContent>
            <p className="p-sm text-muted-foreground">
              <span className="font-[520] text-foreground">The ARC Protocol.</span>{" "}
              This approach follows the Audit &rarr; Report &rarr; Compose framework from{" "}
              <a
                href="https://www.designsystemscollective.com/towards-an-agentic-design-system-c7e0a6469bb1"
                className="text-link hover:text-link-hover underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Towards an Agentic Design System
              </a>{" "}
              by Giorris. Phase 1 (Audit) lets AI read the system with perfect accuracy.
              Phase 2 (Report) lets it analyze patterns and flag debt. Phase 3 (Compose) is
              where it starts maintaining the system itself.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* ─────────────────────────────────────────────
       * II. THE THREE SKILLS
       * ───────────────────────────────────────────── */}

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The three skills</h2>
          <p className="p text-muted-foreground">
            Three complementary skills from the{" "}
            <Inline>giorris-claude-skills</Inline> package. Each handles a different layer.
            Together, they give AI everything it needs to understand, query, and compose with
            the design system.
          </p>
        </div>
        <Card level={2}>
          <CardContent className="space-y-3">
            <p className="p-sm font-[520] text-foreground">They answer different questions:</p>
            <ul className="space-y-1.5 text-muted-foreground p-sm list-disc pl-5">
              <li>
                <span className="font-[520] text-foreground">Index:</span>{" "}
                &ldquo;Where is Button used?&rdquo; &rarr; <Inline>component-usage.toon</Inline>
              </li>
              <li>
                <span className="font-[520] text-foreground">Metadata:</span>{" "}
                &ldquo;How do I use Button?&rdquo; &rarr; <Inline>button.metadata.json</Inline>
              </li>
              <li>
                <span className="font-[520] text-foreground">Composer:</span>{" "}
                &ldquo;Should I create a new card component?&rdquo; &rarr; Check the index for
                existing cards, check metadata for their capabilities, decide
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Skill 1: Codebase Index */}
      <section className="space-y-4">
        <Card level={1}>
          <CardHeader>
            <Badge variant="brand" className="w-fit">The map</Badge>
            <CardTitle className="mt-2">codebase-index</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              Scans every component and produces a relationship graph &mdash; what exists,
              what imports what, what packages each component depends on. Instead of opening
              60+ files, the AI reads one index and immediately knows the full picture:
              64 components, 792 relationships, every dependency.
            </p>
            <p className="p text-muted-foreground">
              The output uses TOON format (30&ndash;60% fewer tokens than JSON) so the AI
              can load more context for less cost.
            </p>
            <CodeSnippet title="Output structure">{`packages/wyllo-ui/src/components/.ai/
  index.toon                            # Summary and entry point
  relationships/
    component-usage.toon                # Component graph (uses / usedBy)
    dependencies.toon                   # npm packages, utilities, CSS
    data-flow.toon                      # Data queries and API patterns`}</CodeSnippet>
            <p className="p-sm font-[520] text-foreground">Deep tracing:</p>
            <p className="p-sm text-muted-foreground">
              Some questions require following the full dependency chain. The index makes this
              explicit &mdash; components with <Inline>uses[0]</Inline> are leaf nodes. The AI
              traces recursively instead of grepping through templates, catching components
              nested three levels deep that a shallow search would miss entirely.
            </p>
            <ul className="space-y-2 text-muted-foreground p-sm list-disc pl-5 pt-2">
              <li>
                <span className="font-[520] text-foreground">Audit the system</span> &mdash;
                full report on unused components, duplicate patterns, adoption gaps. ~$0.20.
              </li>
              <li>
                <span className="font-[520] text-foreground">Find impact</span> &mdash;
                &ldquo;what breaks if I rename Button?&rdquo; Check <Inline>usedBy</Inline>,
                get the full list instantly.
              </li>
              <li>
                <span className="font-[520] text-foreground">Catch false negatives</span> &mdash;
                without the graph, AI reports Tooltip as &ldquo;unused.&rdquo; The index shows
                it&rsquo;s used by CopyButton, used by CodeBlock &mdash; very much alive.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Skill 2: Component Metadata */}
      <section className="space-y-4">
        <Card level={1}>
          <CardHeader>
            <Badge variant="brand" className="w-fit">The contracts</Badge>
            <CardTitle className="mt-2">ai-component-metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              Generates a <Inline>.metadata.json</Inline> file co-located with each component.
              If the index is the map, metadata is the instruction manual. The index tells AI
              {" "}<em>where</em> things are. Metadata tells it <em>what to do</em> with them.
            </p>
            <p className="p text-muted-foreground">
              This isn&rsquo;t new documentation. It&rsquo;s the same rules that live in Figma
              annotations, Storybook best practices, and code review comments &mdash; translated
              to a format machines can check before generating code.
            </p>
            <CodeSnippet title="button.metadata.json (abridged)">{`{
  "usage": {
    "antiPatterns": [
      {
        "scenario": "Multiple primary buttons in same section",
        "reason": "Creates visual hierarchy confusion",
        "alternative": "Use one primary and outline/ghost for others"
      }
    ]
  },
  "variants": {
    "visual": {
      "allowed": ["primary", "outline", "ghost", "destructive"],
      "forbidden": ["secondary"]
    }
  },
  "aiHints": {
    "selectionCriteria": {
      "usePrimary": "Main action user should take on the page/section",
      "useOutline": "Alternative actions, cancel buttons",
      "useGhost": "Tertiary actions, minimal visual weight",
      "useDestructive": "Delete, remove, irreversible actions"
    }
  }
}`}</CodeSnippet>
            <p className="p-sm text-muted-foreground">
              The structure forces precision. Anti-patterns require a scenario, a reason, and an
              alternative &mdash; you can&rsquo;t write &ldquo;don&rsquo;t overuse primary buttons.&rdquo;
              Selection criteria eliminate vagueness. This makes the metadata better documentation
              even if AI never touches it.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Skill 3: DS Composer */}
      <section className="space-y-4">
        <Card level={1}>
          <CardHeader>
            <Badge variant="brand" className="w-fit">The reasoning</Badge>
            <CardTitle className="mt-2">ai-ds-composer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              Teaches AI how to think through component selection: understand intent, consult
              metadata, pick the right components, compose them, and flag gaps when something
              doesn&rsquo;t exist yet. Anti-patterns in metadata are treated as hard rules.
            </p>
            <p className="p text-muted-foreground">
              A core principle is <em>prefer editing over creating</em>. Before making a new
              component, check the index for similar ones. Check if an existing component can
              be extended with new props or variants. Compose what exists. Only create when
              nothing in the system fits. This prevents the proliferation that happens when
              agents create a new component for every variation.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* ─────────────────────────────────────────────
       * III. HOW THE SYSTEM WORKS
       * ───────────────────────────────────────────── */}

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Skills, rules, and instructions</h2>
          <p className="p text-muted-foreground">
            The skills themselves are generic &mdash; install them on any project and they work.
            But they need your system&rsquo;s specific decisions to be useful: which variants are
            forbidden, how tokens relate, what composition patterns exist. Those decisions live in
            rules (your CLAUDE.md, metadata files, governance rules). The CLAUDE.md file acts as a
            router, telling AI when to load which rules and when to reach for which skills.
          </p>
        </div>
        <div className="flex flex-col items-center gap-0">
          <div className="rounded-lg border bg-brand/40 border-brand-border px-5 py-2.5 text-center w-full max-w-sm">
            <div className="label-sm text-foreground">CLAUDE.md</div>
            <div className="p-sm text-muted-foreground mt-0.5">The router</div>
          </div>
          <div className="flex flex-col items-center py-1">
            <div className="w-px h-4 bg-border" />
            <div className="text-muted-foreground text-[10px] font-[420] py-0.5">points to</div>
            <div className="w-px h-4 bg-border" />
          </div>
          <div className="rounded-lg border bg-card border-border px-5 py-2.5 text-center w-full max-w-sm">
            <div className="label-sm text-foreground">Rules</div>
            <div className="p-sm text-muted-foreground mt-0.5">Path-specific context &mdash; your system&rsquo;s decisions</div>
          </div>
          <div className="flex flex-col items-center py-1">
            <div className="w-px h-4 bg-border" />
            <div className="text-muted-foreground text-[10px] font-[420] py-0.5">which reference</div>
            <div className="w-px h-4 bg-border" />
          </div>
          <div className="rounded-lg border bg-card border-border px-5 py-2.5 text-center w-full max-w-sm">
            <div className="label-sm text-foreground">Skills</div>
            <div className="p-sm text-muted-foreground mt-0.5">Reusable capabilities &mdash; portable across projects</div>
          </div>
          <div className="flex flex-col items-center py-1">
            <div className="w-px h-4 bg-border" />
            <div className="text-muted-foreground text-[10px] font-[420] py-0.5">which produce</div>
            <div className="w-px h-4 bg-border" />
          </div>
          <div className="rounded-lg border bg-card border-border px-5 py-2.5 text-center w-full max-w-sm">
            <div className="label-sm text-foreground">Artifacts</div>
            <div className="p-sm text-muted-foreground mt-0.5">Metadata, indexes, traced relationships</div>
          </div>
        </div>
        <CodeSnippet title="The pipeline in action">{`Ask AI to build a settings page
       |
       v
  codebase-index           "What components exist? What uses what?"
       |
       v
  ai-component-metadata    "Card needs a level prop. Tabs default to line variant.
       |                    Never use Button secondary — use outline."
       v
  ai-ds-composer           "Settings page = Tabs + Card per section + Separator + save action.
                            Use outline Button for cancel, primary for save.
                            Wrap inputs in Field. Flag: no toggle for boolean prefs."`}</CodeSnippet>
      </section>

      <Separator />

      {/* ─────────────────────────────────────────────
       * IV. BEYOND TOOLING
       * ───────────────────────────────────────────── */}

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">From linting to governance</h2>
          <p className="p text-muted-foreground">
            A linter checks whether a token exists. Governance checks whether the
            {" "}<em>relationships</em> between tokens violate design intent &mdash; even when
            every individual token is valid. A muted foreground on body copy isn&rsquo;t a
            missing token, it&rsquo;s the wrong position in the hierarchy. A custom shadow
            isn&rsquo;t breaking syntax, it&rsquo;s bypassing the elevation scale.
          </p>
          <p className="p text-muted-foreground">
            The metadata encodes <em>intent</em>: visual hierarchy rules, foreground sequences,
            elevation-size coherence. When an audit checks against these, it finds components
            where every token is valid but their relationships violate the design decisions.
            That&rsquo;s the difference between checking existence and checking intent.
          </p>
        </div>
        <Card level={2}>
          <CardContent>
            <p className="p-sm text-muted-foreground">
              <span className="font-[520] text-foreground">The goal isn&rsquo;t to catch violations.</span>{" "}
              It&rsquo;s to make violations the harder path. When the infrastructure is
              well-designed, staying on the rails is the path of least resistance. The auditor
              doesn&rsquo;t make components clean. The environment does. The auditor verifies
              the environment is working.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Token auditor */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h3 className="h3">The governance auditor</h3>
          <p className="p text-muted-foreground">
            We built a token auditor that checks components against seven rule categories.
            It scans every <Inline>.tsx</Inline> file in the package and reports violations
            grouped by rule, with the exact line, a snippet, and a fix.
          </p>
        </div>
        <CodeSnippet title="Run the auditor">{`python3 packages/wyllo-ui/scripts/audit_governance.py`}</CodeSnippet>
        <div className="space-y-6">
          {/* Rule 1: Foreground hierarchy */}
          <Card level={1}>
            <CardHeader>
              <CardTitle>1. Foreground hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="p text-muted-foreground">
                <Inline>muted-foreground</Inline> should never appear on h1 or h2. It&rsquo;s fine on
                h3/h4 when they&rsquo;re acting as secondary subheadings. <Inline>foreground</Inline> can
                appear on anything &mdash; it&rsquo;s the default, not restricted to headings. Don&rsquo;t
                use raw gray primitives when a semantic foreground token exists.
              </p>
              <Card level={2} size="sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-[420]">
                  <thead><tr className="border-b border-border-subtle">
                    <th className="text-left py-2 pl-3 pr-4 font-[520]">Token</th>
                    <th className="text-left py-2 pr-3 font-[520]">Purpose</th>
                  </tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>foreground</Inline></td><td className="py-2 pr-3">Any content that needs full emphasis &mdash; headings, body text, labels, data</td></tr>
                    <tr><td className="py-2 pl-3 pr-4"><Inline>muted-foreground</Inline></td><td className="py-2 pr-3">De-emphasized content &mdash; descriptions, helper text, placeholders, h3/h4 as subheadings</td></tr>
                  </tbody>
                </table>
              </div>
              </Card>
            </CardContent>
          </Card>

          {/* Rule 2: Surface hierarchy */}
          <Card level={1}>
            <CardHeader>
              <CardTitle>2. Surface hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="p text-muted-foreground">
                Don&rsquo;t use <Inline>accent</Inline> for static content &mdash; it&rsquo;s for
                hover states. Don&rsquo;t use raw gray primitives for backgrounds when semantic tokens exist.
              </p>
              <Card level={2} size="sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-[420]">
                  <thead><tr className="border-b border-border-subtle">
                    <th className="text-left py-2 pl-3 pr-4 font-[520]">Token</th>
                    <th className="text-left py-2 pr-3 font-[520]">Purpose</th>
                  </tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>background</Inline></td><td className="py-2 pr-3">Canvas / page-level</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>card</Inline></td><td className="py-2 pr-3">Elevated content surface</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>secondary</Inline></td><td className="py-2 pr-3">Nested or recessed surface</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>muted</Inline></td><td className="py-2 pr-3">Subtle differentiation</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>accent</Inline></td><td className="py-2 pr-3">Interactive hover states</td></tr>
                    <tr><td className="py-2 pl-3 pr-4"><Inline>popover</Inline></td><td className="py-2 pr-3">Floating surfaces (dropdowns, command palette)</td></tr>
                  </tbody>
                </table>
              </div>
              </Card>
            </CardContent>
          </Card>

          {/* Rule 3: Border hierarchy */}
          <Card level={1}>
            <CardHeader>
              <CardTitle>3. Border hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="p text-muted-foreground">
                <Inline>border-subtle</Inline> must always be less prominent than <Inline>border</Inline>.
                {" "}<Inline>ring</Inline> should only appear in focus states. <Inline>input</Inline> is
                appropriate anywhere the user is actively interacting or making a choice &mdash; not
                just form fields. Don&rsquo;t hardcode border colors.
              </p>
              <Card level={2} size="sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-[420]">
                  <thead><tr className="border-b border-border-subtle">
                    <th className="text-left py-2 pl-3 pr-4 font-[520]">Token</th>
                    <th className="text-left py-2 pr-3 font-[520]">Purpose</th>
                  </tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>border</Inline></td><td className="py-2 pr-3">Structural dividers, card borders</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>border-subtle</Inline></td><td className="py-2 pr-3">Low-emphasis separators inside surfaces</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>input</Inline></td><td className="py-2 pr-3">Interactive surfaces &mdash; form controls, dialogs, any decision UI</td></tr>
                    <tr><td className="py-2 pl-3 pr-4"><Inline>ring</Inline></td><td className="py-2 pr-3">Focus indicators only</td></tr>
                  </tbody>
                </table>
              </div>
              </Card>
            </CardContent>
          </Card>

          {/* Rule 4: Elevation coherence */}
          <Card level={1}>
            <CardHeader>
              <CardTitle>4. Elevation coherence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="p text-muted-foreground">
                A small component (badge, button) should never use <Inline>elevation-overlay</Inline> or
                {" "}<Inline>elevation-popover</Inline>. Don&rsquo;t use raw <Inline>shadow-y*</Inline> primitives
                &mdash; use semantic elevation tokens. Never hardcode <Inline>box-shadow</Inline> values.
              </p>
              <Card level={2} size="sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-[420]">
                  <thead><tr className="border-b border-border-subtle">
                    <th className="text-left py-2 pl-3 pr-4 font-[520]">Token</th>
                    <th className="text-left py-2 pr-3 font-[520]">Purpose</th>
                  </tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>elevation-surface</Inline></td><td className="py-2 pr-3">Cards, subtle lift</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>elevation-floating</Inline></td><td className="py-2 pr-3">Dropdowns, tooltips, hover states</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>elevation-overlay</Inline></td><td className="py-2 pr-3">Sheets, drawers, side panels</td></tr>
                    <tr><td className="py-2 pl-3 pr-4"><Inline>elevation-popover</Inline></td><td className="py-2 pr-3">Modals, command palette, full overlays</td></tr>
                  </tbody>
                </table>
              </div>
              </Card>
            </CardContent>
          </Card>

          {/* Rule 5: Semantic color pairing */}
          <Card level={1}>
            <CardHeader>
              <CardTitle>5. Semantic color pairing &mdash; the 3-token contract</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="p text-muted-foreground">
                Each status scheme is a set of three tokens designed to work together.
                The <Inline>-foreground</Inline> variant is for text and icons. The base
                token (e.g., <Inline>destructive</Inline>) is a background tint &mdash;
                light in light mode, dark in dark mode. Using the base token on text will
                be nearly invisible. Never use <Inline>text-destructive</Inline> for text
                or icons &mdash; use <Inline>text-destructive-foreground</Inline>. Same for
                all schemes: success, warning, brand, review. The solid variants
                (<Inline>destructive-solid</Inline>, <Inline>brand-solid</Inline>) are
                inverted pairs for filled backgrounds and shouldn&rsquo;t be mixed with
                the tinted set.
              </p>
              <Card level={2} size="sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-[420]">
                  <thead><tr className="border-b border-border-subtle">
                    <th className="text-left py-2 pl-3 pr-4 font-[520]">Role</th>
                    <th className="text-left py-2 pr-4 font-[520]">Example</th>
                    <th className="text-left py-2 pr-3 font-[520]">Use for</th>
                  </tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>destructive</Inline></td><td className="py-2 pr-4">rose-50</td><td className="py-2 pr-3">Background tint behind an alert</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4"><Inline>destructive-border</Inline></td><td className="py-2 pr-4">rose-200</td><td className="py-2 pr-3">Border around that alert</td></tr>
                    <tr><td className="py-2 pl-3 pr-4"><Inline>destructive-foreground</Inline></td><td className="py-2 pr-4">rose-600</td><td className="py-2 pr-3">Text and icon color inside it</td></tr>
                  </tbody>
                </table>
              </div>
              </Card>
            </CardContent>
          </Card>

          {/* Rule 6: Typography */}
          <Card level={1}>
            <CardHeader>
              <CardTitle>6. Typography conventions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="p text-muted-foreground">
                Don&rsquo;t use <Inline>font-bold</Inline>, <Inline>font-semibold</Inline>, or
                {" "}<Inline>font-medium</Inline> &mdash; use the numeric weight system. Don&rsquo;t
                use arbitrary sizes like <Inline>text-[14px]</Inline> &mdash; use the scale classes.
                Sub-scale sizes (10px, 11px) are accepted for compact UI like counter badges.
              </p>
              <Card level={2} size="sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-[420]">
                  <thead><tr className="border-b border-border-subtle">
                    <th className="text-left py-2 pl-3 pr-4 font-[520]">Weight</th>
                    <th className="text-left py-2 pr-4 font-[520]">Classes</th>
                    <th className="text-left py-2 pr-3 font-[520]">Purpose</th>
                  </tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4">420</td><td className="py-2 pr-4">p, p-lg, p-sm</td><td className="py-2 pr-3">Body text</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4">520</td><td className="py-2 pr-4">label-lg/md/sm</td><td className="py-2 pr-3">UI labels, navigation</td></tr>
                    <tr className="border-b border-border-subtle"><td className="py-2 pl-3 pr-4">620</td><td className="py-2 pr-4">h1, h2, h3, h4</td><td className="py-2 pr-3">Headings</td></tr>
                    <tr><td className="py-2 pl-3 pr-4">660</td><td className="py-2 pr-4">data-lg/md/sm</td><td className="py-2 pr-3">Metrics, numbers</td></tr>
                  </tbody>
                </table>
              </div>
              </Card>
            </CardContent>
          </Card>

          {/* Rule 7: Primitive leakage */}
          <Card level={1}>
            <CardHeader>
              <CardTitle>7. Primitive leakage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="p text-muted-foreground">
                No raw primitives (<Inline>gray-55</Inline>, <Inline>violet-58</Inline>,
                {" "}<Inline>orange-73</Inline>) in component source files &mdash; always use semantic
                tokens. No hardcoded color values (hex, rgb, oklch). No Tailwind palette classes
                (<Inline>text-blue-500</Inline>, <Inline>bg-red-400</Inline>). Primitives are for
                token definitions in <Inline>globals.css</Inline> only. If a component needs a color
                that doesn&rsquo;t have a semantic token, that&rsquo;s a gap to flag &mdash; not a
                reason to use the primitive directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The feedback loop</h2>
          <p className="p text-muted-foreground">
            Each audit surfaces something: a missed edge case in the indexer, a metadata field
            that needs updating, a composition pattern that should be documented. Each insight
            refines the skills or rules. The next audit is more accurate. The agent moves from
            consumer to maintainer.
          </p>
        </div>
        <Card level={2}>
          <CardContent className="space-y-3">
            <p className="p-sm text-muted-foreground">
              We&rsquo;ve documented two examples of this loop in practice:
              {" "}<a href="/gallery/skills/codebase-index-fix" className="text-link hover:text-link-hover underline underline-offset-2">fixing the codebase indexer</a> when
              it couldn&rsquo;t detect sibling imports,
              and <a href="/gallery/skills/governance-auditor" className="text-link hover:text-link-hover underline underline-offset-2">building the governance auditor</a> from
              first principles. Both show how using the tools surfaces their gaps, and fixing those
              gaps makes the next run better.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Designing conditions, not interfaces</h2>
          <p className="p text-muted-foreground">
            There&rsquo;s a level shift that happens with this infrastructure. You stop designing
            the interface and start designing the <em>conditions under which interfaces get built
            correctly</em>. The harder part isn&rsquo;t technical &mdash; it&rsquo;s epistemic. You
            have to articulate rules you&rsquo;ve been following unconsciously. Every rule you encode
            was something you already knew. The work is making that knowledge legible to something
            other than you.
          </p>
          <p className="p text-muted-foreground">
            The system scales whatever you give it &mdash; including your mistakes. A bad color
            scale encoded into tokens will be faithfully applied everywhere with zero violations
            reported. Only a human looking at the actual output catches that. The system enforces
            what you encode. It can&rsquo;t know you encoded something wrong. That requires people
            who trace problems through the system instead of patching around them.
          </p>
        </div>
        <Card level={2}>
          <CardContent>
            <p className="p-sm text-muted-foreground">
              <span className="font-[520] text-foreground">Self-healing, not autonomous.</span>{" "}
              The system surfaces the shape of how drift happens &mdash; the only way to stop
              it before it compounds. But the designer still decides which rules to encode,
              which gaps to fill, which patterns mean something. The execution doesn&rsquo;t
              need you. The judgment does.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* ─────────────────────────────────────────────
       * V. REFERENCE
       * ───────────────────────────────────────────── */}

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Reference</h2>
          <h3 className="h3">Generating the index</h3>
        </div>
        <CodeSnippet>{`python3 .claude/skills/codebase-index/scripts/index_codebase.py ./packages/wyllo-ui`}</CodeSnippet>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h3 className="h3">Running the governance auditor</h3>
          <p className="p text-muted-foreground">
            Scans all components against the governance rules
            in <Inline>governance-rules.json</Inline>. Exits with code 1 if violations are found.
          </p>
        </div>
        <CodeSnippet>{`# Audit all components
python3 packages/wyllo-ui/scripts/audit_governance.py

# Audit a single file
python3 packages/wyllo-ui/scripts/audit_governance.py --file src/components/button.tsx

# JSON output (for CI or dashboards)
python3 packages/wyllo-ui/scripts/audit_governance.py --format json`}</CodeSnippet>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h3 className="h3">Automated indexing</h3>
          <p className="p text-muted-foreground">
            A GitHub Action watches for component changes on main, re-runs the indexer, and
            opens a PR with the updated map. The AI&rsquo;s understanding stays in sync
            automatically.
          </p>
        </div>
        <CodeSnippet title=".github/workflows/update-index.yml">{`name: Update Codebase Index

on:
  push:
    branches: [main]
    paths:
      - "packages/wyllo-ui/src/components/**"
  workflow_dispatch:

jobs:
  update-index:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.x"

      - name: Run codebase indexer
        run: python .claude/skills/codebase-index/scripts/index_codebase.py ./packages/wyllo-ui

      - name: Create PR if index changed
        run: |
          git add packages/wyllo-ui/src/components/.ai/
          if ! git diff --staged --quiet; then
            BRANCH="chore/update-index-$(date +%s)"
            git checkout -b "$BRANCH"
            git commit -m "chore: update codebase index"
            git push origin "$BRANCH"
            gh pr create --title "chore: update codebase index" --base main
          fi`}</CodeSnippet>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h3 className="h3">Installing the skills</h3>
        </div>
        <CodeSnippet>{`npx giorris-claude-skills install codebase-index
npx giorris-claude-skills install ai-component-metadata
npx giorris-claude-skills install ai-ds-composer`}</CodeSnippet>
        <p className="p text-muted-foreground">
          Skills install into <Inline>.claude/skills/</Inline> at the project root
          and are automatically available to Claude Code in every session.
        </p>
      </section>

    </div>
  )
}
