// govern:disable-file PL-001,PL-003,TY-002,SC-001 -- documentation page that names governance violations and raw classes as part of its prose
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@chebert-pd/ui"

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

export default function MigrationPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      <div className="space-y-4">
        <Badge variant="default">Migration Guide</Badge>
        <h1 className="h1">Existing Project Setup</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          A role-split checklist for adopting the design system in a React + Next.js
          product, paired with a dev partner. Written for a product where only the
          first few pages are live and more are about to land.
        </p>
      </div>

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
            For the Wyllo Portal specifically: four live pages today &mdash;
            Dashboard (Overview tab + Chargebacks tab), Orders, and Order
            Detail. Customers and Billing are in design and will land soon.
            That timing matters: every stage below is sequenced to leave the
            design system, the auditor, and the AI-assist setup ready
            <em>before</em> the next batch of pages starts. Do it after, and
            you&rsquo;ll be retrofitting.
          </p>
          <p className="p text-muted-foreground">
            The same playbook works for any product where the live surface is
            small and the next batch of pages is on the way. The page names
            change; the sequencing doesn&rsquo;t.
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
              {" "}<Inline>@chebert-pd/ui</Inline>, Next.js, and Tailwind v4
              actually fit together. Read these before starting the stage,
              not after.
            </li>
            <li>
              <span className="font-[520] text-foreground">Live pages</span> &mdash;
              the pages that already render in the new product. For Portal
              today: Dashboard, Orders, Order Detail.
            </li>
            <li>
              <span className="font-[520] text-foreground">Next pages</span> &mdash;
              pages about to be built. For Portal: Customers, Customer Detail,
              Billing. The leverage point &mdash; if the system is in place
              first, these pages get built on it from day one.
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
            <li>The product is on Next.js 15 or 16, React 18+, Tailwind v4, and shadcn/ui (new-york).</li>
            <li>You have someone with merge rights to <Inline>main</Inline> &mdash; the dev partner, or you.</li>
            <li>The product&rsquo;s CI runs on PRs and you can add a workflow file.</li>
            <li>You&rsquo;ve read <a href="/gallery/setup" className="underline">/gallery/setup</a> and <a href="/gallery/skills/governance-auditor/setup" className="underline">the auditor setup guide</a> at least once.</li>
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
          "Confirm React/Next/Tailwind versions match the design system requirements",
          "Decide the order across the live pages (e.g. Order Detail first because it exercises the most components)",
          "Set the success bar: \"all live pages render in light + dark, audit passes, AI-assist generates compliant code on a Customers spike\"",
          "Communicate to the team: timeline (1–2 weeks before next pages start), what will visibly change, what won't",
        ]}
        askDev={[
          "Spike a throwaway branch: npm install, render one component, revert",
          "Identify any internal packages that pin conflicting React/Tailwind versions",
          "Confirm the Vercel preview cycle works on the spike",
          "Report time estimate based on the spike",
        ]}
        failureModes={[
          "An internal package pins React 17 or Tailwind v3, blocking the install silently",
          "shadcn/ui isn't actually set up the way the team thinks (CSS vars missing, registry out of date)",
          "Existing CSS resets fight the design system's tokens (e.g., a global * { box-sizing } overrides shadcn)",
          "Migration starts the same week Customers/Billing dev work starts — no slack for issues",
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
            order. See <a href="/gallery/setup" className="underline">/gallery/setup</a>{" "}
            for the canonical recipe. Your dev partner runs through it once;
            you verify the result by walking the live pages.
          </p>
        </div>
      </section>
      <ChecklistGrid
        iDo={[
          "Walk Dashboard (Overview + Chargebacks), Orders, Order Detail in the Vercel preview",
          "Confirm dark mode toggles correctly across all four pages",
          "Verify Inter loads (not the system fallback) — dead giveaway that font setup is wrong",
          "Sign off on each live page visually before moving on",
        ]}
        askDev={[
          "npm install @chebert-pd/ui",
          "Add transpilePackages: ['@chebert-pd/ui'] to next.config.ts",
          "Add the four lines to globals.css (@source, @custom-variant dark, @import tokens) — see /gallery/setup",
          "Set up Inter via next/font/local with --font-sans CSS variable",
          "Replace one component on a live page with the @chebert-pd/ui equivalent and verify, then expand to the rest of the page",
        ]}
        failureModes={[
          "@source path is wrong relative to globals.css — components render but with no Tailwind classes",
          "transpilePackages forgotten — Next refuses to compile because the package ships ESM/TSX",
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
            With four live pages the baseline should be tens of violations,
            not hundreds. That&rsquo;s the whole reason this stage is cheap
            now &mdash; do it before Customers/Billing arrive and you avoid
            ever growing the baseline beyond trivial. Full walkthrough lives
            in the{" "}
            <a href="/gallery/skills/governance-auditor/setup" className="underline">auditor setup guide</a>.
          </p>
        </div>
      </section>
      <ChecklistGrid
        iDo={[
          "Decide which scope to audit (whole app, src/, or just the new portal route tree)",
          "Skim the first audit output — at this scale you can read every violation",
          "Decide which violations are real bugs to fix now vs. baselined for later",
          "Review and approve the .govern-baseline.json before commit",
          "Decide whether SARIF upload to Security tab is worth the extra setup",
        ]}
        askDev={[
          "Add .github/workflows/governance-audit.yml — five-line reusable workflow call",
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
          "Auditor can't find @chebert-pd/ui because npm install hasn't run yet in the workflow",
          "Baseline accepted without triage — real bugs hide inside it because the maintainer didn't read it",
        ]}
      />

      {/* Stage 3 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Stage 3 &mdash; AI &amp; agentic setup</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> point your
            team&rsquo;s AI assistants at the design system&rsquo;s metadata,
            rules, and index so they generate compliant UI by default
            &mdash; this is the highest-leverage stage given what&rsquo;s coming next.
          </p>
          <p className="p text-muted-foreground">
            The next pages (Customers, Customer Detail, Billing) will be
            largely AI-assisted. If the AI generates compliant UI on first try,
            those pages land clean. If it doesn&rsquo;t, every PR becomes a
            cleanup. The metadata, governance rules, and codebase index ship
            inside <Inline>@chebert-pd/ui</Inline> in <Inline>node_modules</Inline> &mdash;
            available the moment the package is installed. The work in this
            stage is making sure your assistants <em>actually read</em> them.
          </p>
        </div>
      </section>
      <ChecklistGrid
        iDo={[
          "Write the product's CLAUDE.md — point at metadata files, governance rules, hard rules (forbidden variants, etc.)",
          "Decide which giorris-claude-skills to install for the product",
          "Run a Customers/Billing spike before the real work starts: ask AI to build a Customer Detail page; check whether it pulls the right components",
          "Spot-check AI-generated UI on the live pages too — if it's still hardcoding there, the rules aren't loading",
          "Update CLAUDE.md as the product develops its own conventions",
        ]}
        askDev={[
          "Install the three skills: codebase-index, ai-component-metadata, ai-ds-composer",
          "Confirm the package's metadata/.ai files are reachable in node_modules — not silently stripped by a build pruner",
          "Wire CLAUDE.md path into the AI tooling teammates use (Cursor, Claude Code, etc.)",
          "(Optional) Set up update-index.yml to keep the product's own component graph fresh as more pages land",
        ]}
        failureModes={[
          "CLAUDE.md exists but never points at the metadata files — AI keeps guessing",
          "Skills installed but committed copies in .claude/skills/ get overwritten on next install",
          "node_modules metadata files stripped by an aggressive bundler or .npmignore",
          "CLAUDE.md too long — AI ignores everything past the cutoff",
          "Team uses different AI tools and only one of them reads CLAUDE.md",
          "Customers/Billing dev work starts before the AI spike — first PRs are full of drift, baseline grows",
        ]}
      />

      {/* Stage 4 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Stage 4 &mdash; Lock it in before next pages land</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> close out the
            migration so Customers and Billing start as compliant code, not
            cleanup work.
          </p>
          <p className="p text-muted-foreground">
            The win condition isn&rsquo;t &ldquo;zero violations&rdquo; on the
            live pages &mdash; it&rsquo;s &ldquo;the next page that lands
            passes the audit on the first PR, without anyone having to think
            about it.&rdquo; If that&rsquo;s true, the system is doing its job
            and the migration is done. If it isn&rsquo;t, find out why before
            real Customers/Billing work starts.
          </p>
        </div>
      </section>
      <ChecklistGrid
        iDo={[
          "Drive the baseline to zero (or near-zero) on the live pages — small enough to be feasible now",
          "Run a Customers spike: AI-generated Customer Detail page in a throwaway branch; confirm audit passes on first try",
          "If the spike fails, fix the gap (CLAUDE.md, metadata, rule wording) before real work starts",
          "Walk the dev partner through the maintainer side once — they need to be able to triage audit output without you",
          "Hand off to the regular review/merge/release flow documented in /gallery/process",
        ]}
        askDev={[
          "Pick off baselined violations on the live pages until the file is empty or trivially small",
          "Re-run --baseline write after the cleanup pass; commit the smaller (or deleted) file",
          "Confirm the governance-audit workflow is green for two PRs in a row before declaring done",
          "Bookmark @chebert-pd/ui's release notes — bumps will bring new rules and components",
        ]}
        failureModes={[
          "Customers/Billing PRs start landing while baseline is still large — drift accumulates instead of decreasing",
          "Spike never happens — first real Customers PR is the spike, except now it's blocking a deadline",
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
            <li>CI runs the audit on every PR and blocks new violations.</li>
            <li>The baseline is empty, or small enough that you can name every entry from memory.</li>
            <li>An AI-generated spike of a not-yet-built page (Customer Detail, etc.) passes the audit on first try.</li>
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
