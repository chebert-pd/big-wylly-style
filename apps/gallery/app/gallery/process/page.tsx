"use client"

import {
  Figma,
  Code,
  ShieldCheck,
  FileText,
  GitPullRequest,
  Eye,
  GitMerge,
  Bot,
  Tag,
  Package,
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

function StepContent({
  icon: Icon,
  title,
  description,
  who,
}: {
  icon: React.ElementType
  title: string
  description: string
  who: "you" | "you + claude" | "automatic" | "you (quick)"
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
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="label-sm">{title}</span>
            <Badge variant={whoVariant} className="shrink-0">{who}</Badge>
          </div>
          <span className="p-sm text-muted-foreground">{description}</span>
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
          review and publish pipeline.
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
                />
              </Step>
              <Step status="upcoming" number={2}>
                <StepContent
                  icon={Code}
                  title="Share URL with Claude"
                  description="Paste the Figma link. Claude pulls the design via get_design_context to see the screenshot and Code Connect mappings."
                  who="you + claude"
                />
              </Step>
              <Step status="upcoming" number={3} last>
                <StepContent
                  icon={Code}
                  title="Implement to match"
                  description="Claude writes code using existing @chebert-pd/ui primitives to match the Figma design."
                  who="you + claude"
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
                />
              </Step>
              <Step status="upcoming" number={2}>
                <StepContent
                  icon={Code}
                  title="Claude implements it"
                  description="Referencing metadata, governance rules, and the .ai/ codebase index."
                  who="you + claude"
                />
              </Step>
              <Step status="upcoming" number={3} last>
                <StepContent
                  icon={Figma}
                  title="Sync back to Figma"
                  description="If the change is visual, push component updates to the Figma library via MCP tools."
                  who="you + claude"
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
            Every change follows this path from implementation to production.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Steps variant="display">
            <Step status="upcoming" number={4}>
              <StepContent
                icon={ShieldCheck}
                title="Run governance audit"
                description="python3 packages/wyllo-ui/scripts/audit_governance.py — catches token misuse, forbidden variants, and rule violations."
                who="you + claude"
              />
            </Step>
            <Step status="upcoming" number={5}>
              <StepContent
                icon={FileText}
                title="Update metadata"
                description="If the API, use cases, or design intent changed, update the .metadata.json file. Stale metadata leads to bad AI suggestions."
                who="you + claude"
              />
            </Step>
            <Step status="upcoming" number={6}>
              <StepContent
                icon={GitPullRequest}
                title="Push branch and open PR"
                description="Vercel auto-creates a preview deployment of the gallery so you can visually verify."
                who="you + claude"
              />
            </Step>
            <Step status="upcoming" number={7}>
              <StepContent
                icon={Eye}
                title="Review preview and merge"
                description="Check the Vercel preview URL, confirm things look right, merge to main."
                who="you"
              />
            </Step>
            <Step status="upcoming" number={8}>
              <StepContent
                icon={Bot}
                title="Codebase index updates"
                description="The update-index workflow detects component changes on main, re-runs the indexer, and opens a chore PR with updated .ai/ files."
                who="automatic"
              />
            </Step>
            <Step status="upcoming" number={9}>
              <StepContent
                icon={GitMerge}
                title="Merge the chore PR"
                description="Do this promptly. Stacked chore PRs conflict because they all touch the same .ai/ files."
                who="you (quick)"
              />
            </Step>
            <Step status="upcoming" number={10}>
              <StepContent
                icon={Tag}
                title="Tag and publish"
                description="git tag wyllo-ui@<version> && git push origin --tags. The publish workflow auto-builds and publishes to GitHub Packages."
                who="you"
              />
            </Step>
            <Step status="upcoming" last>
              <Card level={2}>
                <CardContent className="flex items-center gap-3">
                  <Package className="size-5 text-success-foreground shrink-0" />
                  <span className="label-sm">Published to GitHub Packages</span>
                </CardContent>
              </Card>
            </Step>
          </Steps>
        </CardContent>
      </Card>
    </div>
  )
}
