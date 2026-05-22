// govern:disable-file PL-001,PL-002,PL-003,TY-001,TY-002,SC-001,MD-002 -- documentation page that names governance violations, legacy patterns (e.g. <Button size="icon">), and issue numbers (#NNN) as part of its prose
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@big-wylly-style/ui"

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

export default function MigrationPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      <div className="space-y-4">
        <Badge variant="default">Migration Guide</Badge>
        <h1 className="h1">Existing project setup</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          A role-split checklist for adopting the design system in a React app
          built with Vite or Next.js, paired with a dev partner. Written for a
          product where only the first few pages are live and more are about
          to land.
        </p>
      </div>

      <Card level={2}>
        <CardHeader>
          <CardTitle>Companion docs at the repo root</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-muted-foreground p-sm list-disc pl-5">
            <li>
              <Inline>CONSUMER_ONBOARDING.md</Inline> &mdash; first-audit
              triage guide. Lists what to expect when a consumer app runs the
              auditor for the first time (legacy{" "}
              <Inline>{`<Button size="icon">`}</Inline> patterns, forbidden
              variants, primitive leakage) and the recommended fix order.
              Pair with this migration guide: that one is the role-split
              playbook, this one is the violation-by-violation reference.
            </li>
            <li>
              <Inline>MIGRATION.md</Inline> &mdash; planned schema migration
              for the metadata files themselves (rename{" "}
              <Inline>variants.visual</Inline> to{" "}
              <Inline>variants.variant</Inline>, convert{" "}
              <Inline>forbidden</Inline> to{" "}
              <Inline>narrowedOut</Inline> with reasons, recategorize
              components). Internal-facing, not in flight yet. Mentioned here
              for transparency; consumers don&rsquo;t need to act on it.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card level={1}>
        <CardHeader>
          <CardTitle>The shape of this migration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> a small live
            surface today, plus more pages about to land &mdash; so the goal
            isn&rsquo;t a slow cleanup, it&rsquo;s being ready before the next
            pages start.
          </p>
          <p className="p text-muted-foreground">
            The sequencing below assumes a product where the live page count
            is small enough to count on one hand and the next batch of pages
            is in design and about to land. Every stage is timed to leave the
            design system, the auditor, and the AI-assist setup ready{" "}
            <em>before</em> the next pages start &mdash; do it after, and
            you&rsquo;ll be retrofitting instead of building clean.
          </p>
          <p className="p text-muted-foreground">
            The playbook works the same regardless of stack (Vite or Next.js)
            and regardless of how many pages are live. The page names change;
            the sequencing doesn&rsquo;t.
          </p>
        </CardContent>
      </Card>

      <Card level={1}>
        <CardHeader>
          <CardTitle>Plain English glossary &mdash; how to read this page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
            <li>
              <span className="font-[520] text-foreground">I do</span> &mdash;
              the maintainer&rsquo;s lane. Decisions, design intent, judgement
              calls, reviews. Things that need someone who knows what
              &ldquo;correct&rdquo; means in this design system.
            </li>
            <li>
              <span className="font-[520] text-foreground">Ask dev to do</span> &mdash;
              the dev partner&rsquo;s lane. Mechanical work: installing,
              configuring, writing CI, debugging build failures.
            </li>
            <li>
              <span className="font-[520] text-foreground">Likely failure modes</span> &mdash;
              specific things that break in this stage based on how
              {" "}<Inline>@big-wylly-style/ui</Inline>, your bundler, and
              Tailwind v4 actually fit together. Read these before starting
              the stage, not after.
            </li>
            <li>
              <span className="font-[520] text-foreground">Live pages</span> &mdash;
              the pages that already render in the product today. Confirm what
              counts as live before you start &mdash; what&rsquo;s on the
              deployed branch is the real answer, not what the team{" "}
              <em>thinks</em> is shipped.
            </li>
            <li>
              <span className="font-[520] text-foreground">Next pages</span> &mdash;
              pages about to be built. The leverage point &mdash; if the
              system is in place first, these pages get built on it from day
              one.
            </li>
            <li>
              <span className="font-[520] text-foreground">Baseline</span> &mdash;
              a snapshot of pre-existing governance violations the auditor
              ignores so it only fails on net-new ones. With a small live
              surface this should be tiny.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card level={1}>
        <CardHeader>
          <CardTitle>Before you start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
            <li>
              The product is on <span className="font-[520] text-foreground">Vite or Next.js</span>{" "}
              with React, Tailwind v4, and shadcn/ui (new-york). For the exact
              peer-dependency floors, check{" "}
              <Inline>@big-wylly-style/ui</Inline>&rsquo;s{" "}
              <Inline>package.json</Inline> on{" "}
              <a href="https://www.npmjs.com/package/@big-wylly-style/ui" className="underline">npm</a> &mdash;
              that&rsquo;s the authoritative version floor and it shifts with
              releases. <Inline>npm install</Inline> will also warn loudly on
              peer-dep mismatches.
            </li>
            <li>You have someone with merge rights to <Inline>main</Inline> &mdash; the dev partner, or you.</li>
            <li>The product&rsquo;s CI runs on PRs and you can add a workflow file.</li>
            <li>
              You&rsquo;ve read{" "}
              <a href="/gallery/setup" className="underline">/gallery/setup</a>{" "}
              (which has both Vite and Next.js tabs) and{" "}
              <a href="/gallery/skills/governance-auditor/setup" className="underline">the auditor setup guide</a>{" "}
              at least once.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Separator />

      {/* Stage 0 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Stage 0 &mdash; Preflight</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> spend an
            afternoon confirming the product can host the design system, then
            decide the order you&rsquo;ll touch the live pages.
          </p>
          <p className="p text-muted-foreground">
            With only a handful of live pages, this is short. The team
            already knows the stack &mdash; the question is whether anything
            specific to this product (an internal package, a custom CSS reset,
            a non-standard shadcn setup) will fight the install.
          </p>
        </div>
      </section>
      <ChecklistGrid
        iDo={[
          "Confirm React / Tailwind / bundler versions match @big-wylly-style/ui's peerDependencies",
          "Decide the order across the live pages (e.g. the most component-heavy page first, because it exercises the most surface)",
          "Set the success bar: \"all live pages render in light + dark, audit passes, AI-assist generates compliant code on a spike of a not-yet-built page\"",
          "Communicate to the team: timeline (1–2 weeks before next pages start), what will visibly change, what won't",
        ]}
        askDev={[
          "Spike a throwaway branch: npm install, render one component (e.g. <Button>), revert",
          "Identify any internal packages that pin conflicting React or Tailwind versions",
          "Confirm the preview deploy / dev server cycle works on the spike",
          "Report time estimate based on the spike",
        ]}
        failureModes={[
          "An internal package pins an older React or Tailwind v3, blocking the install silently",
          "shadcn/ui isn't actually set up the way the team thinks (CSS vars missing, registry out of date)",
          "Existing CSS resets fight the design system's tokens (e.g., a global * { box-sizing } overrides shadcn)",
          "Migration starts the same week next-page work starts — no slack for issues",
        ]}
      />

      {/* Stage 1 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Stage 1 &mdash; Install &amp; styling</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> get the
            package installed, the CSS wired up, and every live page rendering
            correctly in light and dark mode.
          </p>
          <p className="p text-muted-foreground">
            Most install pain happens here, because three layers of CSS
            (Tailwind, shadcn, design tokens) all have to import in the right
            order. The canonical install recipe lives in{" "}
            <a href="/gallery/setup" className="underline">/gallery/setup</a> &mdash;
            it has both <Inline>Vite</Inline> and <Inline>Next.js</Inline>{" "}
            tabs. Your dev partner runs through it once; you verify the result
            by walking the live pages.
          </p>
        </div>
      </section>
      <ChecklistGrid
        iDo={[
          "Walk each live page in the preview (or local dev server)",
          "Confirm dark mode toggles correctly across all live pages",
          "Verify Inter loads (not the system fallback) — dead giveaway that font setup is wrong",
          "Sign off on each live page visually before moving on",
        ]}
        askDev={[
          "Follow /gallery/setup for the product's bundler (Vite tab or Next.js tab)",
          "npm install @big-wylly-style/ui",
          "Wire globals.css per /gallery/setup (the @source / @import lines differ slightly per bundler)",
          "Set up Inter via the product's font loader (next/font/local for Next.js, manual @font-face or @fontsource for Vite)",
          "Replace one component on a live page with its @big-wylly-style/ui equivalent and verify, then expand to the rest of the page",
        ]}
        failureModes={[
          "@source path wrong relative to globals.css — components render but with no Tailwind classes",
          "Next.js: transpilePackages forgotten — Next refuses to compile because the package ships ESM/TSX",
          "Vite: @tailwindcss/vite plugin missing — v4 directives like @source silently no-op",
          "@custom-variant dark missing — every dark: class silently no-ops",
          "Tailwind v3 still in the project — @source and @import directives don't exist there",
          "Inter loaded but --font-sans variable not set — text falls back to system sans",
          "One live page sneaks through visual review because the maintainer only checked the home tab",
        ]}
      />

      {/* Stage 2 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Stage 2 &mdash; Governance hookup</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> turn on the
            auditor with a (small) baseline so the live pages don&rsquo;t block
            PRs, and every PR after this point has to clear the rules.
          </p>
          <p className="p text-muted-foreground">
            With a handful of live pages the baseline should be tens of
            violations, not hundreds. That&rsquo;s the whole reason this stage
            is cheap now &mdash; do it before the next pages arrive and you
            avoid ever growing the baseline beyond trivial. Full walkthrough
            lives in the{" "}
            <a href="/gallery/skills/governance-auditor/setup" className="underline">auditor setup guide</a>.
          </p>
        </div>
      </section>
      <ChecklistGrid
        iDo={[
          "Decide which scope to audit (whole app, src/, or just the new route tree)",
          "Skim the first audit output — at this scale you can read every violation",
          "Decide which violations are real bugs to fix now vs. baselined for later",
          "Review and approve the .govern-baseline.json before commit",
          "Decide whether SARIF upload to the Security tab is worth the extra setup",
        ]}
        askDev={[
          "Add .github/workflows/governance-audit.yml — five-line reusable workflow call",
          "npx audit-governance install-skill (drops the auditor SKILL.md into .claude/skills/governance-auditor/)",
          "Run npx audit-governance --scope . --baseline write locally",
          "Commit the resulting .govern-baseline.json",
          "(Optional) Add SARIF upload via github/codeql-action/upload-sarif",
          "Open a test PR with one intentional violation — confirm the audit blocks it",
        ]}
        failureModes={[
          "Workflow file in wrong path or wrong filename — runs silently never",
          "package-manager input not set when the team uses pnpm or yarn",
          "Baseline file written but .gitignored or never committed — CI fails on every PR",
          "SARIF upload missing securityEvents: write permission",
          "Auditor can't find @big-wylly-style/ui because npm install hasn't run yet in the workflow",
          "Baseline accepted without triage — real bugs hide inside it because the maintainer didn't read it",
          "install-skill skipped — Claude doesn't know to run the auditor after edits, drift accumulates",
        ]}
      />

      <Card level={1}>
        <CardHeader>
          <CardTitle>What the auditor will fire on most when migrating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="p text-muted-foreground">
            Most violations from a pre-DS page fall into a handful of rule
            families. Knowing them up front saves a round of confusion when
            you see the first audit output.
          </p>
          <dl className="space-y-4 p">
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                CO &mdash; composition
              </dt>
              <dd className="text-muted-foreground">
                Form controls (Input / Textarea / Select / Combobox /
                RadioGroup / Checkbox / Switch) not wrapped in{" "}
                <Inline>&lt;Field&gt;</Inline>.{" "}
                <Inline>&lt;ChoiceCard&gt;</Inline> nested inside a{" "}
                <Inline>&lt;Card&gt;</Inline>.{" "}
                <Inline>&lt;ContextMenuTrigger&gt;</Inline> rendered as a{" "}
                <Inline>&lt;Button&gt;</Inline>. Imports of DS-named components
                from local paths (e.g.{" "}
                <Inline>{`import { Button } from "@/components/ui/button"`}</Inline>)
                instead of <Inline>@big-wylly-style/ui</Inline>.{" "}
                <em>Fix:</em> wrap form controls in{" "}
                <Inline>&lt;Field&gt;</Inline>; move{" "}
                <Inline>ChoiceCard</Inline> out of <Inline>Card</Inline>; use{" "}
                <Inline>&lt;DropdownMenu&gt;</Inline> for button-triggered
                menus; replace shadow imports with{" "}
                <Inline>{`import { Button } from "@big-wylly-style/ui"`}</Inline>{" "}
                (delete the local shadow file or rename it if the local
                composition genuinely differs from the DS component).
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                MD &mdash; metadata consistency
              </dt>
              <dd className="text-muted-foreground">
                Forbidden variants like{" "}
                <Inline>Button variant=&quot;secondary&quot;</Inline> or{" "}
                <Inline>Button size=&quot;lg&quot;</Inline>. Each component&rsquo;s
                metadata declares allowed and forbidden values.{" "}
                <em>Fix:</em> <Inline>secondary</Inline> &rarr;{" "}
                <Inline>outline</Inline>; <Inline>lg</Inline> &rarr;{" "}
                <Inline>md</Inline>; check the component&rsquo;s{" "}
                <Inline>.metadata.json</Inline> for the full list.
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                TY &mdash; typography
              </dt>
              <dd className="text-muted-foreground">
                Arbitrary <Inline>font-medium</Inline> or{" "}
                <Inline>text-lg</Inline> instead of preset classes.{" "}
                <em>Fix:</em> use <Inline>.h1</Inline> / <Inline>.h2</Inline>{" "}
                / <Inline>.p</Inline> / <Inline>.label-md</Inline>. Numeric
                weights only (420 / 520 / 620 / 660).
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                PL &mdash; primitive leakage
              </dt>
              <dd className="text-muted-foreground">
                Raw Tailwind palette like <Inline>text-gray-500</Inline> or{" "}
                <Inline>bg-blue-50</Inline>. Hardcoded hex or{" "}
                <Inline>rgb()</Inline>.{" "}
                <em>Fix:</em> use semantic tokens (<Inline>text-muted-foreground</Inline>,{" "}
                <Inline>bg-secondary</Inline>, etc.).
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                FG &mdash; foreground hierarchy
              </dt>
              <dd className="text-muted-foreground">
                <Inline>text-muted-foreground</Inline> on{" "}
                <Inline>&lt;h1&gt;</Inline> / <Inline>&lt;h2&gt;</Inline>.{" "}
                <Inline>text-primary-foreground</Inline> without paired{" "}
                <Inline>bg-primary</Inline>.{" "}
                <em>Fix:</em> move muted text to body copy only; pair
                foreground tokens with their matching background.
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                LC &mdash; layout composition
              </dt>
              <dd className="text-muted-foreground">
                Hand-rolled <Inline>max-w-*</Inline> +{" "}
                <Inline>mx-auto</Inline> at page level. Page files using{" "}
                <Inline>&lt;Header&gt;</Inline> without a{" "}
                <Inline>&lt;PageLayout&gt;</Inline> wrapper.{" "}
                <em>Fix:</em> use <Inline>&lt;PageLayout&gt;</Inline> +{" "}
                <Inline>&lt;PageContainer&gt;</Inline> as the page shell.
              </dd>
            </div>
          </dl>
          <p className="p text-muted-foreground">
            Run{" "}
            <Inline>npx audit-governance --scope . --baseline write</Inline>{" "}
            once to capture pre-existing violations; from then on{" "}
            <Inline>npx audit-governance --scope . --changed-only --base-ref origin/main</Inline>{" "}
            on PRs only fires on net-new ones.
          </p>
        </CardContent>
      </Card>

      {/* Stage 3 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Stage 3 &mdash; AI &amp; agentic setup</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> point your
            team&rsquo;s AI assistants at the design system&rsquo;s metadata
            and rules so they generate compliant UI by default &mdash; this
            is the highest-leverage stage given what&rsquo;s coming next.
          </p>
          <p className="p text-muted-foreground">
            The next pages will be largely AI-assisted. If the AI generates
            compliant UI on the first try, those pages land clean. If it
            doesn&rsquo;t, every PR becomes a cleanup. The metadata,
            governance rules, and codebase index already ship inside{" "}
            <Inline>@big-wylly-style/ui</Inline> in{" "}
            <Inline>node_modules</Inline> &mdash; available the moment the
            package is installed. The work in this stage is making sure your
            assistants <em>actually read</em> them.
          </p>
        </div>
      </section>

      <Card level={1}>
        <CardHeader>
          <CardTitle>The two skills you should install</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="p text-muted-foreground">
            Of the four Claude Code skills in the ecosystem, two belong in a
            consumer repo. The other two are author-only or DS-only.
          </p>
          <dl className="space-y-4 p">
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                <Inline>governance-auditor</Inline> &mdash; essential
              </dt>
              <dd className="text-muted-foreground">
                Ships inside <Inline>@big-wylly-style/ui</Inline>. Install
                with <Inline>npx audit-governance install-skill</Inline> after{" "}
                <Inline>npm install</Inline>. Teaches Claude to run the
                auditor after edits, triage violations, and follow the
                metadata-vs-code drift flow. Required if you want PR cleanup
                to be the auditor&rsquo;s job and not a human&rsquo;s.
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                <Inline>ai-ds-composer</Inline> &mdash; essential for
                AI-assisted page work
              </dt>
              <dd className="text-muted-foreground">
                Teaches Claude to read the{" "}
                <Inline>.metadata.json</Inline> files that ship inside the
                package when generating UI. Without this, Claude guesses
                component names and props. With it, AI-generated UI respects
                forbidden variants, composition rules, and the hierarchy of
                sizes and variants the design intends. This is the
                highest-leverage skill for the next-pages stage.
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card level={1}>
        <CardHeader>
          <CardTitle>Skills you do not need in a consumer repo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="space-y-4 p">
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                <Inline>ai-component-metadata</Inline> &mdash; author-only
              </dt>
              <dd className="text-muted-foreground">
                Generates <Inline>.metadata.json</Inline> files for new
                components. A consumer repo isn&rsquo;t authoring DS
                components &mdash; it&rsquo;s consuming them. The metadata
                files already ship pre-built in the package.
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-[520] text-foreground">
                <Inline>codebase-index</Inline> &mdash; optional
              </dt>
              <dd className="text-muted-foreground">
                Generates the relationship graph (<Inline>.toon</Inline>{" "}
                files) for a component library. The DS already ships its own
                index in{" "}
                <Inline>node_modules/@big-wylly-style/ui/src/components/.ai/</Inline>.
                Install this skill in the consumer repo only if you want to
                index <em>your own</em> product&rsquo;s components &mdash;
                useful when the product grows its own component layer on top
                of the DS, not useful for a thin consumer.
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <ChecklistGrid
        iDo={[
          "Write the product's CLAUDE.md — point at @big-wylly-style/ui's metadata files, governance rules, and the hard rules (forbidden variants, etc.)",
          "Decide whether to add codebase-index for the product's own components (only if the product is building a layer on top)",
          "Run an AI spike before the real work starts: ask the AI to build one of the next pages; check whether it pulls the right components",
          "Spot-check AI-generated UI on the live pages too — if it's still hardcoding there, the rules aren't loading",
          "Update CLAUDE.md as the product develops its own conventions",
        ]}
        askDev={[
          "npx audit-governance install-skill (drops the governance-auditor skill into .claude/skills/)",
          "Install ai-ds-composer in .claude/skills/ai-ds-composer/ (copy the SKILL.md from the big-wylly-style repo — bundling is tracked in issue #150)",
          "Confirm node_modules/@big-wylly-style/ui/src/components/*.metadata.json files are reachable — not silently stripped by a build pruner or .npmignore",
          "Wire CLAUDE.md path into the AI tooling teammates use (Cursor, Claude Code, etc.)",
          "(Optional) Set up update-index.yml — only if you installed codebase-index for the product's own components",
        ]}
        failureModes={[
          "CLAUDE.md exists but never points at the metadata files — AI keeps guessing",
          "ai-ds-composer installed but the committed copy in .claude/skills/ gets overwritten on a reinstall",
          "node_modules metadata files stripped by an aggressive bundler or .npmignore",
          "CLAUDE.md too long — AI ignores everything past the cutoff",
          "Team uses different AI tools and only one of them reads CLAUDE.md",
          "Next-page dev work starts before the AI spike — first PRs are full of drift, baseline grows",
        ]}
      />

      {/* Stage 4 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Stage 4 &mdash; Lock it in before next pages land</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> close out the
            migration so the next pages start as compliant code, not cleanup
            work.
          </p>
          <p className="p text-muted-foreground">
            The win condition isn&rsquo;t &ldquo;zero violations&rdquo; on the
            live pages &mdash; it&rsquo;s &ldquo;the next page that lands
            passes the audit on the first PR, without anyone having to think
            about it.&rdquo; If that&rsquo;s true, the system is doing its job
            and the migration is done. If it isn&rsquo;t, find out why before
            real next-page work starts.
          </p>
        </div>
      </section>
      <ChecklistGrid
        iDo={[
          "Drive the baseline to zero (or near-zero) on the live pages — small enough to be feasible now",
          "Run an AI spike: AI-generated draft of a not-yet-built page in a throwaway branch; confirm audit passes on first try",
          "If the spike fails, fix the gap (CLAUDE.md, metadata, rule wording) before real work starts",
          "Walk the dev partner through the maintainer side once — they need to be able to triage audit output without you",
          "Hand off to the regular review/merge/release flow documented in /gallery/process",
        ]}
        askDev={[
          "Pick off baselined violations on the live pages until the file is empty or trivially small",
          "Re-run --baseline write after the cleanup pass; commit the smaller (or deleted) file",
          "Confirm the governance-audit workflow is green for two PRs in a row before declaring done",
          "Bookmark @big-wylly-style/ui's release notes — bumps will bring new rules and components",
        ]}
        failureModes={[
          "Next-page PRs start landing while baseline is still large — drift accumulates instead of decreasing",
          "Spike never happens — first real next-page PR is the spike, except now it's blocking a deadline",
          "Maintainer is the only one who can triage audit output — bus factor of one",
          "Bumps deferred for months — when finally taken, ten new rules fire at once and the team blames the auditor",
        ]}
      />

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">When to call the migration done</h2>
          <p className="p text-muted-foreground">
            Done is when:
          </p>
          <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
            <li>All live pages render correctly in light and dark mode.</li>
            <li>CI runs the audit on every PR and blocks net-new violations.</li>
            <li>The baseline is empty, or small enough that you can name every entry from memory.</li>
            <li>An AI-generated spike of a not-yet-built page passes the audit on first try.</li>
            <li>The dev partner can triage audit output without you in the room.</li>
          </ul>
          <p className="p text-muted-foreground">
            Anything past that is maintenance, not migration. Hand it off to
            the normal review/merge/release process documented in{" "}
            <a href="/gallery/process" className="underline">/gallery/process</a>.
          </p>
        </div>
      </section>

    </div>
  )
}

function ChecklistGrid({
  iDo,
  askDev,
  failureModes,
}: {
  iDo: string[]
  askDev: string[]
  failureModes: string[]
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ChecklistColumn label="I do" tone="brand" items={iDo} />
      <ChecklistColumn label="Ask dev to do" tone="default" items={askDev} />
      <ChecklistColumn label="Likely failure modes" tone="destructive" items={failureModes} />
    </div>
  )
}

function ChecklistColumn({
  label,
  tone,
  items,
}: {
  label: string
  tone: "brand" | "default" | "destructive"
  items: string[]
}) {
  return (
    <Card level={1}>
      <CardHeader>
        <Badge variant={tone} className="w-fit">{label}</Badge>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-muted-foreground p-sm list-disc pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
