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
    </div>
  )
}
