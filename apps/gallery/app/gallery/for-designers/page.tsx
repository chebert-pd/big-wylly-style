// govern:disable-file PL-001,PL-003,TY-002,SC-001,SC-002 -- documentation page that names governance violations and raw classes as part of its prose
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@chebert-pd/ui"
import { CodeSnippet } from "@/app/gallery/_components/code-block"

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

export default function ForDesignersPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      <div className="space-y-4">
        <Badge variant="default">Designer Handbook</Badge>
        <h1 className="h1">Using the system in product work</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          A short reference for designers working in a product repo that
          already has <Inline>@chebert-pd/ui</Inline> installed. If
          you&rsquo;re the one doing the install, read{" "}
          <a href="/gallery/migration" className="underline">/gallery/migration</a> first.
        </p>
      </div>

      <Card level={1}>
        <CardHeader>
          <CardTitle>Plain English glossary &mdash; the vocabulary on this page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
            <li>
              <span className="font-[520] text-foreground">CLI</span> &mdash;
              Command Line Interface. A tool you run by typing a command in
              a terminal. Same job as a button in a UI; different surface.
            </li>
            <li>
              <span className="font-[520] text-foreground">CI</span> &mdash;
              Continuous Integration. The automated checks that run when you
              open a pull request. Lives on GitHub. Runs the auditor (and
              other things) and blocks PRs that fail.
            </li>
            <li>
              <span className="font-[520] text-foreground">PR</span> &mdash;
              pull request. A proposed change, reviewed before being merged
              into the main code.
            </li>
            <li>
              <span className="font-[520] text-foreground">SARIF</span> &mdash;
              a standard file format for tool findings. If your repo
              uploads SARIF, the auditor&rsquo;s violations also show up in
              the GitHub Security tab and persist across PRs as historical
              findings. Optional &mdash; nice for tracking drift over time.
            </li>
            <li>
              <span className="font-[520] text-foreground">Suppression</span> &mdash;
              a comment you add to the code that tells the auditor
              &ldquo;I know this looks wrong, but it&rsquo;s intentional, and
              here&rsquo;s why.&rdquo; The reason gets captured into the
              audit report.
            </li>
            <li>
              <span className="font-[520] text-foreground">Baseline</span> &mdash;
              a snapshot of pre-existing violations the auditor ignores so
              it only fails on net-new ones. Already set up by the
              maintainer; you don&rsquo;t need to think about it day-to-day.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Separator />

      {/* Section 1 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">1. AI-ds-composer is automatic</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> open the
            repo, describe what you want, review what the AI builds &mdash;
            the skill engages on its own.
          </p>
          <p className="p text-muted-foreground">
            You don&rsquo;t invoke anything. The three skills
            (<Inline>codebase-index</Inline>, <Inline>ai-component-metadata</Inline>,{" "}
            <Inline>ai-ds-composer</Inline>) are committed to the repo
            at <Inline>.claude/skills/</Inline> and Claude Code picks them up
            automatically every session you open in that repo. Same for
            Cursor.
          </p>
          <p className="p text-muted-foreground">
            What this looks like in practice:
          </p>
          <ol className="space-y-2 text-muted-foreground p list-decimal pl-5">
            <li>
              You: &ldquo;Build a Customer Detail page with a header, a
              left sidebar of customer info, and a right pane of recent
              activity.&rdquo; (Or paste a Figma URL.)
            </li>
            <li>
              Claude reads the project&rsquo;s <Inline>CLAUDE.md</Inline>,
              the component metadata, the governance rules, and the
              codebase index &mdash; then writes the page using existing
              components and tokens.
            </li>
            <li>
              You review the output, request changes, iterate.
            </li>
          </ol>
          <p className="p text-muted-foreground">
            The quality of the output depends entirely on whether
            {" "}<Inline>CLAUDE.md</Inline> points the AI at the right rules
            and metadata. The maintainer wrote that file; if the AI is
            drifting (raw HTML, wrong variants, hardcoded colors), it&rsquo;s
            usually a CLAUDE.md or metadata gap &mdash; not something
            you need to fix yourself.
          </p>
        </div>
      </section>

      <Separator />

      {/* Section 2 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">2. Three ways the auditor reaches you</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> you&rsquo;ll
            see violations as inline comments on your PRs without doing
            anything; the other two surfaces are optional.
          </p>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>CI annotations on the PR diff &mdash; mandatory, no setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              You open a PR. If you introduced a new violation, GitHub
              shows a comment on the offending line of the diff &mdash;
              right next to the code that triggered it. The PR can&rsquo;t
              merge until you fix or suppress.
            </p>
            <p className="p text-muted-foreground">
              Nothing to set up on your end. The maintainer wired this in
              once during migration; it runs on every PR forever.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Local CLI before you push &mdash; recommended</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Run this from the product repo&rsquo;s root, before pushing:
            </p>
            <CodeSnippet>{`npx audit-governance --scope .`}</CodeSnippet>
            <p className="p text-muted-foreground">
              Same checks as CI, faster feedback. If something fails,
              you fix it before anyone else sees the PR. Saves a round-trip
              every time you would have triggered CI just to find out you
              forgot a token.
            </p>
            <p className="p text-muted-foreground">
              Want to scope the audit to just the files you changed on
              this branch? Add the <Inline>--changed-only</Inline> and{" "}
              <Inline>--base-ref</Inline> flags to the same command:
            </p>
            <CodeSnippet>{`npx audit-governance --scope . --changed-only --base-ref origin/main`}</CodeSnippet>
            <p className="p text-muted-foreground">
              Flags always go after <Inline>--scope .</Inline>, separated by
              spaces. Order between them doesn&rsquo;t matter; the leading{" "}
              <Inline>--</Inline> is what marks each one.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>SARIF in GitHub Security tab &mdash; optional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              If the repo is set up to upload SARIF (the maintainer would
              have done this in Stage 2 of migration), the same violations
              show up in your repo&rsquo;s Security tab as historical
              findings. Useful for the maintainer who wants to see drift
              across many PRs at once. Day-to-day you don&rsquo;t need to
              look at it.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Section 3 */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">3. When something doesn&rsquo;t fit</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> two
            situations &mdash; the auditor flags something you think is
            right, or the AI generates something that drifts. Different
            response for each.
          </p>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>The auditor flags something you think is correct</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              Suppress the violation with a real reason. Two paths get you
              there &mdash; pick the one that fits how you like to work.
            </p>

            <Card level={2}>
              <CardHeader>
                <CardTitle>Best path &mdash; suppress in the code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="p-sm text-muted-foreground">
                  This is the recommended path because it&rsquo;s
                  self-service: you don&rsquo;t wait on anyone else and the
                  reason lands in the code in one step. The auditor
                  supports three suppression shapes:
                </p>
                <CodeSnippet title="On a single TS/TSX line">{`// govern:disable-next-line PL-003 -- vendor widget enforces its own colors
<span className="text-blue-500">Subscribe</span>`}</CodeSnippet>
                <CodeSnippet title="Inside JSX (where // isn't valid)">{`{/* govern:disable-next-line SC-002 -- ternary picks one color scheme */}`}</CodeSnippet>
                <CodeSnippet title="At the top of a whole file">{`// govern:disable-file SC-001 -- this page documents tokens by name`}</CodeSnippet>
              </CardContent>
            </Card>

            <Card level={2}>
              <CardHeader>
                <CardTitle>If you&rsquo;d rather not edit code &mdash; leave it on the PR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="p-sm text-muted-foreground">
                  Not everyone wants to crack open the file just to add a
                  comment. If that&rsquo;s you, reply directly to the
                  auditor&rsquo;s annotation on the PR diff with one line:
                </p>
                <CodeSnippet>{`Suppress -- vendor widget enforces its own colors`}</CodeSnippet>
                <p className="p-sm text-muted-foreground">
                  Whoever pushes the next commit (the dev partner or the
                  maintainer) will read your comment and add the in-code
                  suppression with your exact reason &mdash; so the
                  reason still ends up in the audit report. You stay in
                  GitHub the whole time.
                </p>
              </CardContent>
            </Card>

            <p className="p text-muted-foreground">
              Either way, the text after <Inline>{"-- "}</Inline> is the
              reason &mdash; and the reason is what matters. It lands in the
              audit report regardless of which path you took, and gets
              shown to whoever reviews the PR. Write a real one.{" "}
              <em>&ldquo;Vendor widget&rdquo;</em> is fine;{" "}
              <em>&ldquo;idk&rdquo;</em> or <em>&ldquo;fix later&rdquo;</em>{" "}
              isn&rsquo;t. Future-you and the maintainer will read it.
            </p>
            <p className="p text-muted-foreground">
              And if you&rsquo;re not sure the suppression is justified
              at all, ping the maintainer. The auditor exists to surface
              that conversation.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>The AI generates something that drifts from the system</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Examples: it writes raw <Inline>{"<div>"}</Inline> instead of{" "}
              <Inline>Card</Inline>; it picks a forbidden variant; it
              hardcodes a hex color. That&rsquo;s a CLAUDE.md or metadata
              gap, not your problem to solve in the PR.
            </p>
            <p className="p text-muted-foreground">
              Ping the maintainer with two things: the prompt you used,
              and what the AI generated. The maintainer can sharpen the
              rules so the next generation comes out compliant.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Onboarding &mdash; about 30 minutes</h2>
        </div>
        <Card level={1}>
          <CardContent>
            <ol className="space-y-2 text-muted-foreground p list-decimal pl-5">
              <li>Clone the product repo to your machine.</li>
              <li>Install Claude Code (or Cursor &mdash; whichever the team standardized on).</li>
              <li>Open the repo, read its <Inline>CLAUDE.md</Inline> once. Don&rsquo;t worry about memorising it &mdash; just know it exists and what it points at.</li>
              <li>Run <Inline>npx audit-governance --scope .</Inline> once. See what the output looks like when everything passes.</li>
              <li>Try a small generation: ask Claude to build a tiny component on a throwaway branch. Confirm the AI uses real components from the system, not raw HTML.</li>
              <li>You&rsquo;re ready. From here it&rsquo;s the same as any other product work &mdash; with the auditor and the AI handling consistency in the background.</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Where to go next</h2>
          <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
            <li>
              <a href="/gallery/setup" className="underline">/gallery/setup</a> &mdash; the install recipe (read if you&rsquo;re curious how the package wires in).
            </li>
            <li>
              <a href="/gallery/skills" className="underline">/gallery/skills</a> &mdash; the full story of how the AI integration works.
            </li>
            <li>
              <a href="/gallery/skills/governance-auditor" className="underline">Governance auditor case study</a> &mdash; the seven rules the auditor enforces, with examples.
            </li>
            <li>
              <a href="/gallery/process" className="underline">/gallery/process</a> &mdash; the full lifecycle of a design system change, including the maintainer/dev split.
            </li>
          </ul>
        </div>
      </section>

    </div>
  )
}
