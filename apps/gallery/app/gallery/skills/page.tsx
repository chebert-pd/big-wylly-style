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

      {/* Why */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Why does this matter?</h2>
          <p className="p text-muted-foreground">
            A design system isn&rsquo;t just a collection of components for humans to browse.
            When AI tools like Claude Code need to build UI, they face the same problem a new
            developer does: <em>where are the components, how do they relate, and which one
            should I use?</em>
          </p>
          <p className="p text-muted-foreground">
            Without structure, AI has to explore the file system &mdash; grepping through
            directories, reading files one by one, and mentally reconstructing the architecture.
            This is slow, inconsistent, and misses things. In benchmarks, unstructured exploration
            missed 25% of components and took over twice as long.
          </p>
          <p className="p text-muted-foreground">
            With structured infrastructure &mdash; metadata files, a relationship index, and
            instructions that teach AI how to read them &mdash; the same questions get answered
            with 100% accuracy, near-zero variance, and 2.5x speed. The AI stops being a tourist
            in the codebase and starts operating like a team member who knows where everything is.
          </p>
        </div>
        <Card level={2}>
          <CardContent>
            <p className="p-sm text-muted-foreground">
              <span className="font-[520] text-foreground">The ARC Protocol.</span>{" "}
              This approach follows the Audit &rarr; Report &rarr; Compose framework described
              in{" "}
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

      {/* Three skills */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The three skills</h2>
          <p className="p text-muted-foreground">
            We use three complementary skills from the{" "}
            <Inline>giorris-claude-skills</Inline> package. Each handles a different
            layer of the system. Together, they give AI everything it needs to understand,
            query, and compose with the design system.
          </p>
        </div>
      </section>

      {/* Skill 1: Codebase Index */}
      <section className="space-y-4">
        <Card level={1}>
          <CardHeader>
            <Badge variant="brand" className="w-fit">Skill 1</Badge>
            <CardTitle className="mt-2">codebase-index</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              Scans every component file and produces a map of the entire system &mdash;
              what exists, what imports what, what external packages each component depends on,
              and which components are used together.
            </p>
            <p className="p text-muted-foreground">
              Think of it as a table of contents for AI. Instead of opening 60+ files to
              understand the architecture, the AI reads one index file and immediately knows the
              full picture: 64 components, 792 relationships, every dependency.
            </p>
            <p className="p text-muted-foreground">
              The output lives in <Inline>.ai/</Inline> directories using TOON format &mdash;
              a structured text format that uses 30&ndash;60% fewer tokens than JSON,
              which means the AI can load more context for less cost.
            </p>
            <CodeSnippet title="Generate the index">{`python3 .claude/skills/codebase-index/scripts/index_codebase.py ./packages/wyllo-ui`}</CodeSnippet>
            <p className="p-sm text-muted-foreground">
              Output structure:
            </p>
            <CodeSnippet>{`packages/wyllo-ui/src/components/.ai/
  index.toon                            # Summary and entry point
  relationships/
    component-usage.toon                # Component graph (uses / usedBy)
    dependencies.toon                   # npm packages, utilities, CSS
    data-flow.toon                      # Data queries and API patterns`}</CodeSnippet>
          </CardContent>
        </Card>
      </section>

      {/* Skill 2: Component Metadata */}
      <section className="space-y-4">
        <Card level={1}>
          <CardHeader>
            <Badge variant="brand" className="w-fit">Skill 2</Badge>
            <CardTitle className="mt-2">ai-component-metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              Generates structured metadata files for each component &mdash;
              a <Inline>.metadata.json</Inline> file co-located with the source code.
              These files describe <em>how</em> to use a component: its variants, props,
              composition patterns, accessibility requirements, and anti-patterns.
            </p>
            <p className="p text-muted-foreground">
              If the codebase index is the map, metadata is the instruction manual. The index
              tells AI <em>where</em> things are. Metadata tells it <em>what to do</em> with them.
              Together, they eliminate guesswork.
            </p>
            <CodeSnippet title="Example: button.metadata.json">{`{
  "component": {
    "name": "Button",
    "category": "atoms",
    "type": "interactive"
  },
  "usage": {
    "useCases": ["Primary actions", "Form submission", "Destructive confirmation"],
    "antiPatterns": ["Never use secondary variant — use outline instead"]
  },
  "variants": {
    "visual": {
      "allowed": ["primary", "outline", "ghost", "destructive"],
      "forbidden": ["secondary"]
    }
  },
  "accessibility": {
    "role": "button",
    "keyboardSupport": ["Enter", "Space"]
  }
}`}</CodeSnippet>
          </CardContent>
        </Card>
      </section>

      {/* Skill 3: DS Composer */}
      <section className="space-y-4">
        <Card level={1}>
          <CardHeader>
            <Badge variant="brand" className="w-fit">Skill 3</Badge>
            <CardTitle className="mt-2">ai-ds-composer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              The reasoning layer. This skill teaches AI how to <em>think</em> through
              component selection: understand what the user wants, consult the metadata,
              pick the right components, compose them together, and flag gaps when
              something doesn&rsquo;t exist yet.
            </p>
            <p className="p text-muted-foreground">
              It enforces rules like &ldquo;never use the secondary button variant&rdquo; and
              &ldquo;always wrap inputs in a Field component.&rdquo; Anti-patterns in metadata
              are treated as hard rules &mdash; the AI won&rsquo;t violate them unless you
              explicitly override.
            </p>
            <p className="p text-muted-foreground">
              The goal is high component reuse with intentional, justified decisions.
              When the existing components don&rsquo;t fit, the skill tells AI to flag the gap
              rather than invent something new.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* How they work together */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">How they work together</h2>
          <p className="p text-muted-foreground">
            The three skills form a pipeline. The codebase index provides the map
            (what exists and how it connects). Component metadata provides the contracts
            (how each piece should be used). The composer provides the reasoning
            (how to make decisions given both).
          </p>
        </div>
        <CodeSnippet title="The pipeline">{`Ask AI to build a settings page
       |
       v
  codebase-index      "What components exist? What uses what?"
       |
       v
  ai-component-metadata   "Card needs a level prop. Tabs default to line variant.
       |                    Never use Button secondary — use outline."
       v
  ai-ds-composer      "Settings page = Tabs + Card per section + Separator + save action.
                       Use outline Button for cancel, primary for save.
                       Wrap inputs in Field. Flag: no toggle component for boolean prefs."`}</CodeSnippet>
      </section>

      <Separator />

      {/* Changes we made */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Changes to codebase-index</h2>
          <p className="p text-muted-foreground">
            The original skill had a blind spot with monorepo component libraries like ours.
            When components import each other using relative paths (e.g.,{" "}
            <Inline>{"import { Button } from \"./button\""}</Inline>), the indexer
            didn&rsquo;t recognize those as component relationships. Every component showed
            zero connections &mdash; no &ldquo;uses&rdquo; or &ldquo;usedBy&rdquo; data.
          </p>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>What was broken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              The indexer decided whether an import was a &ldquo;component import&rdquo; by checking
              two things: does the path end with <Inline>.tsx</Inline>, or does it contain{" "}
              <Inline>/components/</Inline>? Our imports use bare paths
              like <Inline>./button</Inline> &mdash; no extension, no <Inline>/components/</Inline> segment.
              So every sibling import was silently dropped.
            </p>
            <p className="p text-muted-foreground">
              Even if detection had worked, the indexer stored import <em>names</em> (like{" "}
              <Inline>Button</Inline>) but tried to match them against file <em>stems</em> (like{" "}
              <Inline>button</Inline>). The case mismatch meant nothing would link up.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>What we fixed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              <span className="font-[520] text-foreground">Detection:</span>{" "}
              Any relative import (<Inline>./</Inline> or <Inline>../</Inline>) that
              isn&rsquo;t a utility or schema is now treated as a component import.
            </p>
            <p className="p text-muted-foreground">
              <span className="font-[520] text-foreground">Resolution:</span>{" "}
              Instead of storing import names, the indexer now resolves the relative path to
              an actual file on disk. <Inline>./button</Inline> becomes{" "}
              <Inline>src/components/button.tsx</Inline>. This matches
              exactly against the component keys, so the relationship graph builds correctly.
            </p>
            <p className="p text-muted-foreground">
              <span className="font-[520] text-foreground">Result:</span>{" "}
              Button now correctly shows 15 components that use it. The full graph has 792
              mapped relationships across 64 components. Before the fix: zero.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* GitHub Action */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Automated indexing</h2>
          <p className="p text-muted-foreground">
            The codebase index isn&rsquo;t something you have to remember to update. A GitHub
            Action watches for changes to component files on the main branch. When something
            changes, it re-runs the indexer and opens a pull request with the updated map.
          </p>
          <p className="p text-muted-foreground">
            This means the AI&rsquo;s understanding of the system stays in sync with the actual
            code. You change a component, the index updates, and the next AI session sees
            the current architecture &mdash; not a stale snapshot.
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

      <Separator />

      {/* Why this matters for a design system */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Why this matters for a design system</h2>
          <p className="p text-muted-foreground">
            Design system governance is traditionally expensive. Someone has to manually audit
            usage, track adoption, find drift, and write up findings. It takes enough time and
            effort that most teams only do it once a quarter &mdash; if at all.
          </p>
          <p className="p text-muted-foreground">
            With machine-readable infrastructure, the economics flip. An AI can run a
            comprehensive audit on demand for about $0.20 in tokens. It catches patterns that
            humans miss: duplicate components, CSS classes that shadow existing components,
            unused exports, inconsistent composition patterns.
          </p>
        </div>
        <div className="space-y-4">
          <Card level={1}>
            <CardHeader>
              <CardTitle>AI as a consumer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="p text-muted-foreground">
                When AI builds UI using the design system, metadata and the index mean it picks
                the right component every time. No hallucinated variants, no missed anti-patterns,
                no reinventing something that already exists. It reads the map instead of wandering.
              </p>
            </CardContent>
          </Card>
          <Card level={1}>
            <CardHeader>
              <CardTitle>AI as a maintainer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="p text-muted-foreground">
                This is where it gets interesting. When the system can analyze itself, it stops
                being passive documentation and starts being active governance. The metadata files
                aren&rsquo;t just descriptions &mdash; they&rsquo;re contracts the AI can enforce.
                When it tells you a CSS class duplicates a component&rsquo;s functionality,
                it&rsquo;s doing the work of a staff engineer.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Install */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Installing the skills</h2>
          <p className="p text-muted-foreground">
            All three skills are installed from the same package:
          </p>
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
