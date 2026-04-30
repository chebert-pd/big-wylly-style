"use client"

import {
  Figma,
  Code,
  ShieldCheck,
  FileText,
  GitCommit,
  GitPullRequest,
  Eye,
  GitMerge,
  Bot,
  CircleCheck,
  Rocket,
  Package,
  Zap,
  ArrowRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Separator,
  Steps,
  Step,
} from "@chebert-pd/ui"

type Who = "you" | "you + claude" | "automatic" | "you (quick)"

function StepContent({
  icon: Icon,
  title,
  description,
  who,
  trigger,
}: {
  icon: React.ElementType
  title: string
  description: string
  who: Who
  trigger: string
}) {
  const whoVariant =
    who === "automatic"
      ? "success"
      : who === "you + claude"
        ? "default"
        : "outline"

  return (
    <Card level={2}>
      <CardContent className="flex items-start gap-3">
        <Icon className="size-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="label-sm">{title}</span>
            <Badge variant={whoVariant} className="shrink-0">{who}</Badge>
          </div>
          <span className="p-sm text-muted-foreground">{description}</span>
          <div className="flex items-center gap-1.5 border-t border-border-subtle -mx-5 px-5 mt-2 pt-2">
            <Zap className="size-3 text-card-foreground shrink-0" />
            <span className="p-sm text-card-foreground">
              <span className="font-[520]">Triggered by:</span> {trigger}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ConvergeIndicator() {
  return (
    <div className="flex items-center gap-3 py-2 pl-2">
      <div className="flex items-center gap-2">
        <ArrowRight className="size-4 text-muted-foreground" />
        <span className="label-sm text-muted-foreground">Both paths converge here</span>
        <ArrowRight className="size-4 text-muted-foreground" />
      </div>
    </div>
  )
}

export default function ProcessPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="h1">Process</h1>
        <p className="p text-muted-foreground">
          Two starting points for design system changes, converging at the same
          review and publish pipeline. From merge to published npm package is
          mostly automated.
        </p>
      </div>

      {/* Two paths side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Figma-first */}
        <Card level={1}>
          <CardHeader data-divider>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Figma className="size-5" />
                Figma-first
              </span>
            </CardTitle>
            <CardDescription>Design it visually, then implement to match.</CardDescription>
          </CardHeader>
          <CardContent>
            <Steps variant="display">
              <Step status="current" number={1}>
                <StepContent
                  icon={Figma}
                  title="Design in Figma"
                  description="Update the component, variant, or layout in the Figma library."
                  who="you"
                  trigger="You open Figma and make the change"
                />
              </Step>
              <Step status="upcoming" number={2}>
                <StepContent
                  icon={Code}
                  title="Share URL with Claude"
                  description="Paste the Figma link. Claude pulls the design via get_design_context to see the screenshot and Code Connect mappings."
                  who="you + claude"
                  trigger="You paste the Figma URL into a Claude Code session"
                />
              </Step>
              <Step status="upcoming" number={3} last>
                <StepContent
                  icon={Code}
                  title="Implement to match"
                  description="Claude writes code using existing @chebert-pd/ui primitives to match the Figma design."
                  who="you + claude"
                  trigger="Claude picks up the Figma context and starts editing"
                />
              </Step>
            </Steps>
          </CardContent>
        </Card>

        {/* Code-first */}
        <Card level={1}>
          <CardHeader data-divider>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Code className="size-5" />
                Code-first
              </span>
            </CardTitle>
            <CardDescription>Implement the change, then sync visuals back to Figma.</CardDescription>
          </CardHeader>
          <CardContent>
            <Steps variant="display">
              <Step status="current" number={1}>
                <StepContent
                  icon={Code}
                  title="Describe the change"
                  description="Structural refactor, new component, API change — describe what you need."
                  who="you"
                  trigger="You start a Claude Code session with your request"
                />
              </Step>
              <Step status="upcoming" number={2}>
                <StepContent
                  icon={Code}
                  title="Claude implements it"
                  description="Referencing metadata, governance rules, and the .ai/ codebase index."
                  who="you + claude"
                  trigger="Claude works from your prompt + loaded CLAUDE.md rules"
                />
              </Step>
              <Step status="upcoming" number={3} last>
                <StepContent
                  icon={Figma}
                  title="Sync back to Figma"
                  description="If the change is visual, push component updates to the Figma library via MCP tools."
                  who="you + claude"
                  trigger="You ask Claude to sync, or run Figma MCP tools directly"
                />
              </Step>
            </Steps>
          </CardContent>
        </Card>
      </div>

      {/* Converge */}
      <ConvergeIndicator />

      {/* Shared pipeline */}
      <Card level={1}>
        <CardHeader data-divider>
          <CardTitle>Shared pipeline</CardTitle>
          <CardDescription>
            Every change follows this path. Steps marked "automatic" run without any input from you. Steps marked "you" or "you + claude" need a deliberate action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Steps variant="display">
            <Step status="upcoming" number={4}>
              <StepContent
                icon={ShieldCheck}
                title="Run governance audit locally (recommended)"
                description="npx audit-governance --scope . — catches token misuse and rule violations. CI runs this too, but running locally gives you faster feedback before pushing."
                who="you + claude"
                trigger="You or Claude runs the script before committing"
              />
            </Step>
            <Step status="upcoming" number={5}>
              <StepContent
                icon={FileText}
                title="Update metadata"
                description="If the API, use cases, or design intent changed, update the .metadata.json file. Stale metadata leads to bad AI suggestions in future sessions."
                who="you + claude"
                trigger="Claude updates metadata when component APIs change"
              />
            </Step>
            <Step status="upcoming" number={6}>
              <StepContent
                icon={GitCommit}
                title="Commit with Conventional Commits format"
                description="Every commit must use feat:, fix:, chore:, docs:, etc. Release Please parses these to decide the next version and CHANGELOG entry. Non-conventional messages are ignored."
                who="you + claude"
                trigger="Claude writes conventional commit messages by default"
              />
            </Step>
            <Step status="upcoming" number={7}>
              <StepContent
                icon={GitPullRequest}
                title="Push branch and open PR"
                description="Open a PR against main. Vercel auto-creates a preview deployment of the gallery so you can visually verify."
                who="you + claude"
                trigger="You push the branch and Claude (or you) runs gh pr create"
              />
            </Step>
            <Step status="upcoming" number={8}>
              <StepContent
                icon={CircleCheck}
                title="CI checks run"
                description="ci.yml runs three jobs on every PR: typecheck @chebert-pd/ui, typecheck gallery, and governance audit. All must pass before merge is allowed."
                who="automatic"
                trigger="PR is opened or updated"
              />
            </Step>
            <Step status="upcoming" number={9}>
              <StepContent
                icon={Eye}
                title="Review preview and merge"
                description="Check the Vercel preview URL, confirm things look right, squash-merge to main."
                who="you"
                trigger="You click the merge button in GitHub"
              />
            </Step>
            <Step status="upcoming" number={10}>
              <StepContent
                icon={Bot}
                title="Codebase index updates"
                description="The update-index workflow detects component changes on main, re-runs the indexer, and opens a chore PR with updated .ai/ files."
                who="automatic"
                trigger="Push to main that touches packages/wyllo-ui/src/components/**"
              />
            </Step>
            <Step status="upcoming" number={11}>
              <StepContent
                icon={GitMerge}
                title="Merge the chore index PR"
                description="Do this promptly. Stacked chore PRs conflict because they all touch the same .ai/ files."
                who="you (quick)"
                trigger="You click the merge button in GitHub"
              />
            </Step>
            <Step status="upcoming" number={12}>
              <StepContent
                icon={Bot}
                title="Release Please opens a release PR"
                description="Release Please reads your Conventional Commits and opens or updates a 'chore: release main' PR with the next version bump and generated CHANGELOG."
                who="automatic"
                trigger="Every push to main runs release-please.yml"
              />
            </Step>
            <Step status="upcoming" number={13}>
              <StepContent
                icon={GitMerge}
                title="Merge the release PR when ready to ship"
                description="Accumulate commits in the release PR until you're ready to cut a version, then merge. Release Please uses the RELEASE_PLEASE_TOKEN PAT to push the tag, which triggers the next step automatically."
                who="you"
                trigger="You click the merge button on the release PR"
              />
            </Step>
            <Step status="upcoming" number={14}>
              <StepContent
                icon={Rocket}
                title="Auto-publish to npm"
                description="The tag push fires publish-ui.yml, which builds and publishes @chebert-pd/ui to registry.npmjs.org. No manual action needed."
                who="automatic"
                trigger="wyllo-ui@X.Y.Z tag pushed to origin"
              />
            </Step>
            <Step status="upcoming" last>
              <Card level={2}>
                <CardContent className="flex items-center gap-3">
                  <Package className="size-5 text-success-foreground shrink-0" />
                  <span className="label-sm">Published to npm — consumers can install @chebert-pd/ui</span>
                </CardContent>
              </Card>
            </Step>
          </Steps>
        </CardContent>
      </Card>

      <Separator />

      {/* ─────────────────────────────────────────────
       * MAINTAINER + DEV-PARTNER WORKFLOW
       * ───────────────────────────────────────────── */}

      <div className="space-y-4 max-w-3xl">
        <Badge variant="default">Working with a partner</Badge>
        <h2 className="h1">Maintainer + dev-partner workflow</h2>
        <p className="p-lg text-muted-foreground">
          The pipeline above is what happens. This section is who does it. The
          design system has two ongoing roles — a maintainer who owns intent,
          and a dev partner who owns execution. Most stages are co-owned, but
          the split matters when a decision has to be made.
        </p>
      </div>

      <Card level={1}>
        <CardHeader>
          <CardTitle>Plain English glossary &mdash; the two roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
            <li>
              <span className="font-[520] text-foreground">Maintainer</span> &mdash;
              the person who owns the design system&rsquo;s intent. Decides which
              tokens exist, what the rules mean, which patterns are correct, and
              when a violation is real vs. a false alarm. This is a judgment role.
            </li>
            <li>
              <span className="font-[520] text-foreground">Dev partner</span> &mdash;
              the person who owns the technical execution. Writes the
              implementation, keeps the build green, makes sure components are
              fast and accessible, handles tricky TypeScript, and deals with the
              packaging/release plumbing. This is a craft role.
            </li>
            <li>
              <span className="font-[520] text-foreground">Co-owned</span> &mdash;
              work that needs both perspectives at once. Neither side can land it
              alone without losing something important. Most of the actual work
              ends up here.
            </li>
            <li>
              <span className="font-[520] text-foreground">Hand-off</span> &mdash;
              the moment one role finishes their part and the other picks it up.
              The clearer the hand-off, the fewer rework loops.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Stage 1 */}
      <section className="space-y-4 max-w-3xl">
        <div className="space-y-2">
          <h2 className="h2">Stage 1 &mdash; Identifying the change</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the maintainer
            decides what should change and why; the dev partner pressure-tests
            whether it&rsquo;s tractable.
          </p>
          <p className="p text-muted-foreground">
            Most changes start with the maintainer noticing drift &mdash; a token
            that&rsquo;s missing, a component that keeps getting reinvented in
            consumer apps, a pattern that needs to be promoted into the system.
            The dev partner&rsquo;s job here is reality-checking: is this a
            half-day change or a half-month one, are there breaking implications,
            does the proposed shape conflict with anything already shipped?
          </p>
        </div>
      </section>
      <RoleSplit
        maintainer={[
          "Articulate the design intent — what should be true, not what to type",
          "Decide whether this is a fix, a new pattern, or a breaking change",
          "Set the success bar (\"clean audit on the gallery\", \"no regressions in X component\")",
        ]}
        dev={[
          "Estimate scope — files touched, breaking changes, follow-on work",
          "Flag conflicts with in-flight work or upcoming deps",
          "Suggest the smallest landing path if the proposal is too large",
        ]}
        coOwned={[
          "Deciding whether to do it now, do it later, or do it differently",
          "Writing the issue / PR description so future-you can read it",
        ]}
      />

      {/* Stage 2 */}
      <section className="space-y-4 max-w-3xl">
        <div className="space-y-2">
          <h2 className="h2">Stage 2 &mdash; Designing &amp; implementing</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the maintainer
            owns the visual and API decisions; the dev partner owns making them
            real in code without breaking the rest of the system.
          </p>
          <p className="p text-muted-foreground">
            Whether the work starts in Figma or in code, the same split holds.
            Visual choices, prop naming, default behavior &mdash; those are
            design decisions, even when they happen in a TSX file. Wiring,
            performance, edge cases, and TypeScript ergonomics &mdash; those are
            implementation decisions, even when they affect the visual result.
            When they&rsquo;re in tension, the maintainer breaks the tie.
          </p>
        </div>
      </section>
      <RoleSplit
        maintainer={[
          "Pick variants, sizes, slots, default values",
          "Decide which existing primitives the change should compose from",
          "Approve or reject any visual deviation the dev partner surfaces",
          "Sync changes back to Figma when the source of truth is code",
        ]}
        dev={[
          "Write the actual TSX, with correct types and Radix/CVA wiring",
          "Handle edge cases — keyboard nav, focus management, RTL, motion",
          "Keep the bundle reasonable; flag perf cliffs early",
          "Make the dev experience match the rest of the package (cn, asChild, ref forwarding)",
        ]}
        coOwned={[
          "API shape — props, slot names, what should be controlled vs uncontrolled",
          "Naming things — variants, slots, exports",
          "Whether to extend an existing component or create a new one",
        ]}
      />

      {/* Stage 3 */}
      <section className="space-y-4 max-w-3xl">
        <div className="space-y-2">
          <h2 className="h2">Stage 3 &mdash; Governance &amp; metadata</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the maintainer
            keeps the rules and metadata aligned with intent; the dev partner
            keeps the auditor and indexer working.
          </p>
          <p className="p text-muted-foreground">
            Every change can ripple into <Inline>governance-rules.json</Inline>,
            <Inline>{"<component>.metadata.json"}</Inline>, or the codebase
            index. Letting any of those drift is the fastest way to lose AI
            accuracy. The maintainer is the only one who can say what
            &ldquo;correct&rdquo; means in a new rule. The dev partner is the
            only one who can say whether the auditor expresses it correctly.
          </p>
        </div>
      </section>
      <RoleSplit
        maintainer={[
          "Decide when a new rule is needed and what it should catch",
          "Update component metadata — useCases, antiPatterns, aiHints",
          "Triage auditor output: real violation vs. false positive vs. accepted exception",
          "Decide severity (warning vs. error) for any new rule",
        ]}
        dev={[
          "Translate a rule into auditor logic without false positives",
          "Keep the indexer working — fix it when a new pattern breaks detection",
          "Run the auditor locally before pushing; fix what it finds in the dev partner’s lane",
          "Add tests for any new rule and any false-positive fix",
        ]}
        coOwned={[
          "Reviewing the codebase-index chore PR before merge",
          "Deciding whether a flagged violation is a code fix or a rule fix",
        ]}
      />

      {/* Stage 4 */}
      <section className="space-y-4 max-w-3xl">
        <div className="space-y-2">
          <h2 className="h2">Stage 4 &mdash; Review, merge, release</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the dev partner
            owns the mechanical pipeline; the maintainer owns the visual and
            semantic review &mdash; and the choice of when to ship a release.
          </p>
          <p className="p text-muted-foreground">
            Once a PR is open, most of the path to npm is automated. The two
            humans intervene at exactly two points: the visual review of the
            Vercel preview, and the merge of the Release Please PR that decides
            when accumulated commits become a published version.
          </p>
        </div>
      </section>
      <RoleSplit
        maintainer={[
          "Visually review the Vercel preview — does it look right",
          "Approve the squash-merge",
          "Decide when to merge the Release Please PR (i.e., when to cut a version)",
          "Write the changelog entry beyond what Conventional Commits captures",
        ]}
        dev={[
          "Make CI green — typecheck, audit, build",
          "Write Conventional Commits so Release Please bumps correctly",
          "Promptly merge the chore index PR (it conflicts if stacked)",
          "Watch the publish workflow; debug if the npm push fails",
        ]}
        coOwned={[
          "Deciding what counts as a breaking change",
          "Reviewing each other’s code on substantive PRs",
        ]}
      />

      {/* Stage 5 */}
      <section className="space-y-4 max-w-3xl">
        <div className="space-y-2">
          <h2 className="h2">Stage 5 &mdash; Adoption &amp; feedback</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the maintainer
            stays close to consumer teams to hear what&rsquo;s working; the dev
            partner makes upgrades safe and frictionless.
          </p>
          <p className="p text-muted-foreground">
            A change isn&rsquo;t really shipped until consumer apps have picked
            it up. The maintainer is the design system&rsquo;s spokesperson to
            those teams &mdash; explaining intent, helping interpret auditor
            output, deciding which feedback is real signal vs. one team&rsquo;s
            preference. The dev partner&rsquo;s job is to make sure the upgrade
            mechanics never become the reason a team falls behind.
          </p>
        </div>
      </section>
      <RoleSplit
        maintainer={[
          "Field questions from consumer teams about intent and rules",
          "Decide when feedback warrants a rule, component, or doc change",
          "Write or commission docs (case studies, setup guides, this page)",
          "Promote rules from warning to error when teams have had time to adjust",
        ]}
        dev={[
          "Keep upgrade paths clean &mdash; codemods, deprecation notices, type-safe migrations",
          "Maintain the reusable governance-audit workflow consumers depend on",
          "Investigate consumer-side build/CI failures rooted in the package",
          "Keep the SARIF/JSON outputs stable so dashboards don&rsquo;t break",
        ]}
        coOwned={[
          "Triaging GitHub issues from consumer teams",
          "Deciding whether to backport a fix or wait for the next minor",
        ]}
      />
    </div>
  )
}

function RoleSplit({
  maintainer,
  dev,
  coOwned,
}: {
  maintainer: string[]
  dev: string[]
  coOwned: string[]
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
      <RoleColumn label="Maintainer owns" tone="brand" items={maintainer} />
      <RoleColumn label="Dev partner owns" tone="default" items={dev} />
      <RoleColumn label="Co-owned" tone="success" items={coOwned} />
    </div>
  )
}

function RoleColumn({
  label,
  tone,
  items,
}: {
  label: string
  tone: "brand" | "default" | "success"
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

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}
