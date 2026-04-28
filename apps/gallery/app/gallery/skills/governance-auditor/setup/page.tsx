// govern:disable-file TY-001,TY-002,PL-001,PL-002,PL-003,SC-001,SC-002,BD-001,EL-003 -- documentation page that names governance violations as part of its prose
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@chebert-pd/ui"
import { CodeSnippet } from "@/app/gallery/_components/code-block"

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

export default function GovernanceAuditorSetupPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      <div className="space-y-4">
        <Badge variant="default">Setup Guide</Badge>
        <h1 className="h1">Adopting the governance auditor</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          A five-minute walkthrough for any team that already uses
          {" "}<Inline>@chebert-pd/ui</Inline>. Skip nothing &mdash; every step is short.
        </p>
      </div>

      <Card level={1}>
        <CardHeader>
          <CardTitle>Before you start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
            <li>Your project is on GitHub, with CI running on PRs to your main branch.</li>
            <li>
              Your <Inline>package.json</Inline> already lists <Inline>@chebert-pd/ui</Inline>{" "}
              as a dependency. (If not: install it first; the auditor ships with it.)
            </li>
            <li>You have permission to add a workflow file to <Inline>.github/workflows/</Inline>.</li>
          </ul>
          <p className="p text-muted-foreground">
            That&rsquo;s it. The auditor is already in your <Inline>node_modules</Inline> the
            moment <Inline>@chebert-pd/ui</Inline> is installed. There&rsquo;s nothing else
            to install.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Step 1 &mdash; Add the workflow</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> add five lines of YAML to
            your repo so the auditor runs on every PR.
          </p>
          <p className="p text-muted-foreground">
            Create <Inline>.github/workflows/governance-audit.yml</Inline> in your repo with
            this content:
          </p>
        </div>
        <CodeSnippet>{`name: Governance audit

on:
  pull_request:
    branches: [main]

jobs:
  audit:
    uses: chebert-pd/big-wylly-style/.github/workflows/governance-audit.yml@main
    with:
      scope: .`}</CodeSnippet>
        <p className="p text-muted-foreground">
          That&rsquo;s the whole hookup. The reusable workflow handles installing your
          dependencies, finding files that import the design system, running the auditor,
          and posting violations as inline annotations on the PR diff.
        </p>
        <Card level={1}>
          <CardHeader>
            <CardTitle>If you use pnpm or yarn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Add a <Inline>package-manager</Inline> input:
            </p>
            <CodeSnippet>{`with:
  scope: .
  package-manager: pnpm   # or yarn`}</CodeSnippet>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Step 2 &mdash; Capture your baseline</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> snapshot your existing
            violations once, so the auditor only fails on net-new ones from now on.
          </p>
          <p className="p text-muted-foreground">
            From your project root, run:
          </p>
        </div>
        <CodeSnippet>{`npx audit-governance --scope . --baseline write`}</CodeSnippet>
        <p className="p text-muted-foreground">
          This creates a file called <Inline>.govern-baseline.json</Inline>. Commit it.
          Done.
        </p>
        <Card level={1}>
          <CardHeader>
            <CardTitle>What to expect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              The first run is going to find a lot of violations &mdash; probably 50&ndash;200
              for a real-world consumer app. That&rsquo;s normal. Some are real bugs, some
              are intentional (e.g. a documentation page that names tokens by name), and
              some are edge cases the auditor will improve over time.
            </p>
            <p className="p text-muted-foreground">
              All of them go into the baseline. From this point on, the auditor reports them
              as &ldquo;baselined&rdquo; (visible, not blocking). Only <em>new</em>{" "}
              violations introduced by future PRs will fail the check.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Step 3 &mdash; That&rsquo;s it</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> your next PR will run the
            audit automatically &mdash; no further setup needed.
          </p>
          <p className="p text-muted-foreground">
            Open a PR. The audit job runs. If you introduced a new violation, it&rsquo;ll
            show up as an inline annotation on the offending line of the diff. Fix or
            suppress, and the PR can merge.
          </p>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Common situations</h2>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>I want to silence a single intentional violation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Add a comment immediately above the line, with a brief reason:
            </p>
            <CodeSnippet>{`// govern:disable-next-line PL-003 -- vendor widget enforces own colors
<span className="text-blue-500">Subscribe</span>`}</CodeSnippet>
            <p className="p text-muted-foreground">
              Use <Inline>{"{/* govern:disable-next-line ... */}"}</Inline> if the
              suppression sits inside JSX (where <Inline>//</Inline> isn&rsquo;t valid).
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>The whole file is intentional (e.g. a documentation page)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Use a file-wide directive at the very top of the file. The auditor can
              recommend the exact line for you:
            </p>
            <CodeSnippet>{`npx audit-governance --scope . --suggest-suppressions tokens/colors/page.tsx

// govern:disable-file PL-001,TY-002 -- describe why this file is exempt
// tokens/colors/page.tsx — 44 violations across 2 rules
// PL-001: 42, TY-002: 2`}</CodeSnippet>
            <p className="p text-muted-foreground">
              Paste the first line into the top of the file (and replace the placeholder
              reason with a real one).
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>The baseline is stale and I want to refresh it</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Re-run the write command:
            </p>
            <CodeSnippet>{`npx audit-governance --scope . --baseline write`}</CodeSnippet>
            <p className="p text-muted-foreground">
              The file is overwritten with the current state. Commit and push.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>I want to clean up the baseline gradually</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Pick a file from the baseline. Either fix the violations directly or add a
              file-wide suppression with a real reason. Re-run the write command to update
              the file. The baseline shrinks. Eventually it hits zero, and you can delete
              the file entirely.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>I want to ignore the auditor for now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Pass <Inline>--no-baseline</Inline> to ignore the baseline file, or just
              remove the workflow from CI. The audit will stop blocking PRs immediately.
              Re-enable when you&rsquo;re ready.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Troubleshooting</h2>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>The auditor is flagging code that looks correct to me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              First, double-check by reading the rule (the rule ID is in the violation
              message). The auditor is generally right when it flags things like
              {" "}<Inline>text-destructive</Inline> used as a text color &mdash; this is the
              silent failure the rule was built to catch.
            </p>
            <p className="p text-muted-foreground">
              If you&rsquo;re sure the violation is a false positive, suppress it with a
              comment that explains why. The captured reason makes it easy for someone else
              to see whether the rule itself needs refining.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>The CI job can&rsquo;t find the auditor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Make sure <Inline>@chebert-pd/ui</Inline> is in your{" "}
              <Inline>package.json</Inline> dependencies (not just installed locally), so
              CI&rsquo;s install step picks it up.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>I want a richer integration than PR annotations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Pass <Inline>format: sarif</Inline> to the workflow. Then upload the SARIF
              output via <Inline>github/codeql-action/upload-sarif</Inline> and the
              violations will appear in your repo&rsquo;s Security tab and persist across
              PRs as historical findings.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Next steps</h2>
          <p className="p text-muted-foreground">
            Once the auditor is running and the baseline is captured, you&rsquo;re done with
            setup. The rest is gradual: chip away at the baseline at your own pace, refine
            suppressions when you find better answers, and keep an eye on what the rule set
            catches as it grows.
          </p>
          <p className="p text-muted-foreground">
            For the full story of how this tool was built and the design decisions behind
            it, see the <a href="/gallery/skills/governance-auditor" className="underline">case study</a>.
          </p>
        </div>
      </section>

    </div>
  )
}
