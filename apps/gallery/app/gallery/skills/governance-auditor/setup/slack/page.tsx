// govern:disable-file TY-001,TY-002,PL-001,PL-002,PL-003,SC-001,SC-002,BD-001,EL-003 -- documentation page that names governance violations as part of its prose
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@chebert-pd/ui"
import { CodeSnippet } from "@/app/gallery/_components/code-block"

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

export default function GovernanceAuditorSlackPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      <div className="space-y-4">
        <Badge variant="default">Integrations</Badge>
        <h1 className="h1">Hooking the auditor into Slack</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          Two patterns, both built on top of <Inline>audit-governance --print-issue --format json</Inline>.
          Pattern A pings consumer teams when CI blocks a PR. Pattern B gives the design-system
          maintainer a weekly cross-repo digest. Pattern A is faster to set up; Pattern B is the
          one that turns &ldquo;is tech debt growing or shrinking?&rdquo; into a question you can answer.
        </p>
      </div>

      <Card level={1}>
        <CardHeader>
          <CardTitle>Before you start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
            <li>The auditor is already running in CI &mdash; if not, do the{" "}
              <a href="/gallery/skills/governance-auditor/setup" className="text-link hover:text-link-hover underline underline-offset-2">setup walkthrough</a>{" "}
              first.</li>
            <li>You can create an Incoming Webhook in your Slack workspace, or get someone who can.</li>
            <li>You can add a repository secret in GitHub Actions.</li>
          </ul>
          <p className="p text-muted-foreground">
            The JSON contract behind both patterns is{" "}
            <Inline>audit-governance --print-issue --format json</Inline>. It always exits zero
            so you can pipe it freely. The shape is fully described under{" "}
            <span className="font-[520] text-foreground">The JSON contract</span> below.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* ─────────────────────────────────────────────
       * PATTERN A — ON-FAILURE PR ALERT
       * ───────────────────────────────────────────── */}

      <section className="space-y-4">
        <div className="space-y-2">
          <Badge variant="brand" className="w-fit">Pattern A</Badge>
          <h2 className="h2 mt-2">On-failure PR alert (per consumer repo)</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> every time the auditor blocks a
            PR, post a summary into a Slack channel so the team sees it without having to watch CI.
          </p>
          <p className="p text-muted-foreground">
            Lives in <span className="font-[520] text-foreground">each consumer repo</span>{" "}
            (Portal, Wyllolabs, your app). Low-noise by design &mdash; it only fires when CI
            fails, never on a clean run.
          </p>
        </div>

        <Card level={2}>
          <CardHeader>
            <CardTitle>Step 1 &mdash; Create a Slack app and generate a webhook URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p-sm text-muted-foreground">
              The legacy standalone &ldquo;Incoming Webhooks&rdquo; integration is deprecated.
              Slack now wants you to create a small app and enable Incoming Webhooks as a
              feature on it. The URL format and payload shape are identical &mdash; just the
              setup path is different. You only do this once; the same app issues webhooks
              for every channel you need. Canonical reference:{" "}
              <a href="https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks" className="text-link hover:text-link-hover underline underline-offset-2" target="_blank" rel="noreferrer">
                docs.slack.dev / Sending messages using incoming webhooks
              </a>.
            </p>
            <ol className="space-y-2 text-muted-foreground p list-decimal pl-5">
              <li>Go to <a href="https://api.slack.com/apps" className="text-link hover:text-link-hover underline underline-offset-2" target="_blank" rel="noreferrer">api.slack.com/apps</a>{" "}
                and click <Inline>Create New App</Inline> &rarr; <Inline>From scratch</Inline>.
                Name it something like &ldquo;Governance Auditor&rdquo;, pick your workspace,
                and click <Inline>Create App</Inline>.</li>
              <li>In the app&rsquo;s sidebar, under <Inline>Features</Inline>, open{" "}
                <Inline>Incoming Webhooks</Inline> and toggle <Inline>Activate Incoming Webhooks</Inline> on.</li>
              <li>Scroll down and click <Inline>Add New Webhook to Workspace</Inline>. Pick the
                channel that should receive the alerts (we use <Inline>#wylly-design-system</Inline>{" "}
                for the on-failure stream) and click <Inline>Allow</Inline>.</li>
              <li>Copy the webhook URL. It looks like{" "}
                <Inline>https://hooks.slack.com/services/T.../B.../...</Inline>. Treat it like
                a secret &mdash; anyone with the URL can post to that channel as the app.</li>
            </ol>
          </CardContent>
        </Card>

        <Card level={2}>
          <CardHeader>
            <CardTitle>Step 2 &mdash; Save it as a repo secret</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              In the consumer repo on GitHub: <Inline>Settings</Inline> &rarr;{" "}
              <Inline>Secrets and variables</Inline> &rarr; <Inline>Actions</Inline> &rarr;{" "}
              <Inline>New repository secret</Inline>. Name it{" "}
              <Inline>SLACK_GOVERNANCE_WEBHOOK</Inline> and paste the URL.
            </p>
          </CardContent>
        </Card>

        <Card level={2}>
          <CardHeader>
            <CardTitle>Step 3 &mdash; Add the workflow step</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              Open <Inline>.github/workflows/governance-audit.yml</Inline> (created in the
              setup walkthrough). Add a second job that runs after the audit, captures the JSON
              report, and posts only when the previous job failed:
            </p>
            <CodeSnippet>{`name: Governance audit

on:
  pull_request:
    branches: [main]

jobs:
  audit:
    uses: chebert-pd/big-wylly-style/.github/workflows/governance-audit.yml@main
    with:
      scope: .

  notify:
    needs: audit
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: 20 }
      - run: npm ci
      - name: Capture audit JSON
        run: |
          npx audit-governance --scope . --print-issue --format json > audit.json
      - name: Post to Slack
        env:
          SLACK_WEBHOOK: \${{ secrets.SLACK_GOVERNANCE_WEBHOOK }}
        run: |
          if jq -e '.empty == false' audit.json > /dev/null; then
            payload=$(jq -n \\
              --slurpfile audit audit.json \\
              --arg pr "\${{ github.event.pull_request.html_url }}" \\
              --arg title "\${{ github.event.pull_request.title }}" \\
              '{
                blocks: [
                  { type: "header",
                    text: { type: "plain_text",
                            text: "Governance audit — \\($audit[0].summary.totalViolations) violations" } },
                  { type: "section",
                    text: { type: "mrkdwn",
                            text: "*PR:* <\\($pr)|\\($title)>" } },
                  { type: "divider" }
                ] + ($audit[0].rules | map({
                  type: "section",
                  text: { type: "mrkdwn",
                          text: "*\\(.id)* — \\(.count) hit\\(if .count > 1 then "s" else "" end)\\n_\\(.message)_\\n\`\`\`\\(.examples[0].file):\\(.examples[0].line)\`\`\`" }
                }))
              }')
            curl -sS -X POST -H 'Content-Type: application/json' \\
              --data "$payload" "$SLACK_WEBHOOK"
          fi`}</CodeSnippet>
            <p className="p text-muted-foreground">
              <Inline>if: failure()</Inline> is the load-bearing line. Using{" "}
              <Inline>if: always()</Inline> would ping the channel on every PR, which trains
              the team to ignore it.
            </p>
          </CardContent>
        </Card>

        <Card level={2}>
          <CardHeader>
            <CardTitle>What the message looks like</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              A header with the violation count, the PR link, then one section per rule with
              the first example file and line. Compact enough to scan on mobile; specific
              enough to know whether to drop what you&rsquo;re doing.
            </p>
            <CodeSnippet>{`Governance audit — 3 violations
PR: <https://github.com/.../pull/142|Add billing tab to settings>

PL-003 — 2 hits
Hardcoded color literal: text-blue-500
src/app/billing/header.tsx:18

CO-002 — 1 hit
Form control must be wrapped in <Field>
src/app/billing/form.tsx:34`}</CodeSnippet>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* ─────────────────────────────────────────────
       * PATTERN B — WEEKLY CROSS-REPO DIGEST
       * ───────────────────────────────────────────── */}

      <section className="space-y-4">
        <div className="space-y-2">
          <Badge variant="brand" className="w-fit">Pattern B</Badge>
          <h2 className="h2 mt-2">Weekly cross-repo drift digest (DS maintainer)</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> once a week, run the auditor
            against every consumer repo&rsquo;s main branch and post a single aggregate
            summary to the DS maintainer.
          </p>
          <p className="p text-muted-foreground">
            Lives in a <span className="font-[520] text-foreground">DS-owned repo</span>{" "}
            (this one is fine; a dedicated ops repo is also fine). Pattern A tells consumers
            when they hit a violation. Pattern B tells the maintainer whether the system as
            a whole is getting cleaner or dirtier &mdash; which is the signal that doesn&rsquo;t
            exist today.
          </p>
        </div>

        <Card level={2}>
          <CardHeader>
            <CardTitle>Why this is the more valuable pattern</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-muted-foreground p-sm list-disc pl-5">
              <li>Is Portal&rsquo;s baseline shrinking or growing?</li>
              <li>Did Wyllolabs introduce a fresh class of <Inline>CO-002</Inline> hits last week?</li>
              <li>Did some rule start firing 10&times; as often &mdash; suggesting a false-positive epidemic, not a real regression?</li>
              <li>Which consumer is on a stale <Inline>@chebert-pd/ui</Inline> version and missing new rules entirely?</li>
            </ul>
            <p className="p-sm text-muted-foreground">
              None of those are visible from Pattern A. The digest is what turns
              &ldquo;feels like things are sliding&rdquo; into a number.
            </p>
          </CardContent>
        </Card>

        <Card level={2}>
          <CardHeader>
            <CardTitle>Step 1 &mdash; A second webhook URL on the same app</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Keep the digest on its own channel (e.g. <Inline>#ds-maintainer-digest</Inline>)
              so it doesn&rsquo;t compete with Pattern A&rsquo;s PR alerts. Open the same Slack
              app you created for Pattern A at{" "}
              <a href="https://api.slack.com/apps" className="text-link hover:text-link-hover underline underline-offset-2" target="_blank" rel="noreferrer">api.slack.com/apps</a>,
              go to <Inline>Incoming Webhooks</Inline>, and click{" "}
              <Inline>Add New Webhook to Workspace</Inline> again &mdash; pick the digest
              channel this time. You&rsquo;ll get a second URL alongside the first one.
              Save it as <Inline>SLACK_DIGEST_WEBHOOK</Inline> in the DS repo&rsquo;s secrets.
            </p>
            <p className="p-sm text-muted-foreground">
              One app, multiple webhooks. There&rsquo;s no need to make a second app per
              channel.
            </p>
          </CardContent>
        </Card>

        <Card level={2}>
          <CardHeader>
            <CardTitle>Step 2 &mdash; A fine-grained PAT for cross-repo reads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              The digest workflow has to clone each consumer repo to audit it. GitHub&rsquo;s
              default <Inline>GITHUB_TOKEN</Inline> only has access to the repo the workflow
              lives in, so create a fine-grained PAT with{" "}
              <Inline>Contents: read</Inline> on each consumer repo and save it as{" "}
              <Inline>DS_AUDIT_PAT</Inline>.
            </p>
            <p className="p-sm text-muted-foreground">
              Scope it to the minimum &mdash; <span className="font-[520] text-foreground">read</span>{" "}
              access to just the consumer repos. Set a six-month expiry and put a calendar
              reminder to rotate.
            </p>
          </CardContent>
        </Card>

        <Card level={2}>
          <CardHeader>
            <CardTitle>Step 3 &mdash; The scheduled workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="p text-muted-foreground">
              Drop this in the DS-owned repo at{" "}
              <Inline>.github/workflows/governance-digest.yml</Inline>:
            </p>
            <CodeSnippet>{`name: Governance digest

on:
  schedule:
    - cron: '0 9 * * MON'   # Mondays, 9am UTC
  workflow_dispatch:        # Lets you run it manually too

jobs:
  audit:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        repo:
          - chebert-pd/portal
          - chebert-pd/wyllolabs
    steps:
      - uses: actions/checkout@v5
        with:
          repository: \${{ matrix.repo }}
          token: \${{ secrets.DS_AUDIT_PAT }}
          path: \${{ matrix.repo }}
      - uses: actions/setup-node@v5
        with: { node-version: 20 }
      - name: Install + audit
        working-directory: \${{ matrix.repo }}
        run: |
          npm ci
          npx audit-governance --scope . --print-issue --format json > audit.json
      - uses: actions/upload-artifact@v4
        with:
          name: audit-\${{ matrix.repo }}
          path: \${{ matrix.repo }}/audit.json

  digest:
    needs: audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { path: audits }
      - name: Build digest payload
        id: build
        run: |
          # Aggregate all audit-*.json into one Slack message. Day-1 version just
          # shows absolute counts per repo; week-over-week deltas can be added once
          # a history store exists (see "What's next" on this page).
          payload=$(jq -s '
            map({
              repo: (input_filename | sub("^audits/audit-"; "") | sub("/audit.json$"; "")),
              violations: .summary.totalViolations,
              top_rules: (.rules | sort_by(-.count) | .[0:3] | map("\\(.id) (\\(.count))") | join(", "))
            })
            | { blocks:
                [{ type: "header",
                   text: { type: "plain_text", text: "Weekly governance digest" } }]
              + ( map({ type: "section",
                        text: { type: "mrkdwn",
                                text: "*\\(.repo)* — \\(.violations) violations\\n\\(.top_rules)" } }) )
            }
          ' audits/*/audit.json)
          echo "payload=$payload" >> "$GITHUB_OUTPUT"
      - name: Post to Slack
        env:
          SLACK_WEBHOOK: \${{ secrets.SLACK_DIGEST_WEBHOOK }}
        run: |
          curl -sS -X POST -H 'Content-Type: application/json' \\
            --data '\${{ steps.build.outputs.payload }}' "$SLACK_WEBHOOK"`}</CodeSnippet>
            <p className="p-sm text-muted-foreground">
              The matrix is the consumer list. Add a repo by adding a line. The audit job
              runs in parallel per repo; the digest job consolidates and posts once.
            </p>
          </CardContent>
        </Card>

        <Card level={2}>
          <CardHeader>
            <CardTitle>What the digest message looks like</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CodeSnippet>{`Weekly governance digest

chebert-pd/portal — 24 violations
PL-003 (12), CO-002 (7), MD-001 (3)

chebert-pd/wyllolabs — 9 violations
LC-002 (4), IC-005 (3), FG-001 (2)`}</CodeSnippet>
            <p className="p-sm text-muted-foreground">
              Top three rules per repo is usually enough to spot a pattern. Drill into any
              of them by running <Inline>audit-governance --scope . --print-issue</Inline>{" "}
              locally on the affected repo.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* ─────────────────────────────────────────────
       * JSON CONTRACT
       * ───────────────────────────────────────────── */}

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The JSON contract</h2>
          <p className="p text-muted-foreground">
            Both patterns are just shape transformations on this object. If you want to wire
            the auditor into something other than Slack &mdash; a Linear webhook, a Notion DB,
            a dashboard &mdash; this is the contract you target.
          </p>
        </div>
        <CodeSnippet>{`{
  "empty": false,
  "scope": { "root": "/repo", "filesScanned": 142 },
  "summary": { "totalViolations": 3 },
  "tool": { "name": "audit-governance", "version": "2.10.0" },
  "rules": [
    {
      "id": "PL-003",
      "count": 2,
      "message": "Hardcoded color literal",
      "fix": "Use a semantic token (e.g. text-foreground, text-muted-foreground)",
      "examples": [
        { "file": "src/header.tsx", "line": 18, "snippet": "text-blue-500" },
        { "file": "src/footer.tsx", "line": 42, "snippet": "text-blue-500" }
      ]
    }
  ]
}`}</CodeSnippet>
        <p className="p-sm text-muted-foreground">
          <Inline>empty: true</Inline> means no violations &mdash; safe to skip posting.{" "}
          <Inline>examples</Inline> is capped at the first ten per rule so the payload stays
          small. The command exits zero either way, so you can&rsquo;t use exit code to
          decide whether to post &mdash; check the <Inline>empty</Inline> field instead.
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Common situations</h2>
        </div>
        <Accordion variant="card">
          <AccordionItem value="too-noisy">
            <AccordionTrigger>Pattern A is too noisy</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="p text-muted-foreground">
                  Long-lived PRs that haven&rsquo;t been rebased re-trigger the alert on
                  every push. Two options:
                </p>
                <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
                  <li>
                    Add a <Inline>chat:write</Inline> scope to the Slack app you already created,
                    install it to the workspace to get a bot token, and call{" "}
                    <Inline>chat.postMessage</Inline> on the first run (capture the returned{" "}
                    <Inline>ts</Inline>), then <Inline>chat.update</Inline> on subsequent runs.
                    The webhook becomes one evolving message instead of one new message per push.
                    (See <span className="font-[520] text-foreground">What&rsquo;s next</span>.)
                  </li>
                  <li>
                    Add <Inline>github.event.action</Inline> filters so it only fires on{" "}
                    <Inline>opened</Inline> and <Inline>ready_for_review</Inline>, not every
                    push.
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="add-repo">
            <AccordionTrigger>I want to add a new consumer to the digest</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="p text-muted-foreground">
                  Two changes: add the repo slug to the matrix in{" "}
                  <Inline>governance-digest.yml</Inline>, and grant the{" "}
                  <Inline>DS_AUDIT_PAT</Inline> read access on that repo. Run the workflow
                  manually via the <Inline>workflow_dispatch</Inline> trigger to confirm the
                  new repo appears in the digest.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="week-over-week">
            <AccordionTrigger>I want week-over-week deltas, not just absolute counts</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="p text-muted-foreground">
                  Store each week&rsquo;s digest JSON somewhere durable &mdash; a small{" "}
                  <Inline>ds-audit-history</Inline> repo with one JSON file per run is the
                  cheapest option. The next run reads the previous file, computes the diff
                  per rule, and includes the delta in the message
                  (e.g. <Inline>PL-003 (12, +3)</Inline>).
                </p>
                <p className="p text-muted-foreground">
                  GitHub Actions cache also works but expires after seven days of inactivity,
                  so a repo is safer once you skip a week.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="non-slack">
            <AccordionTrigger>I want to send results to Linear / Discord / Teams instead</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="p text-muted-foreground">
                  Same pipeline; different last step. Capture{" "}
                  <Inline>audit-governance --print-issue --format json</Inline>, then post to
                  whichever platform&rsquo;s webhook / API takes JSON. The shape under{" "}
                  <span className="font-[520] text-foreground">The JSON contract</span>{" "}
                  is stable &mdash; the keys are part of the CLI&rsquo;s public API.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="false-alarm">
            <AccordionTrigger>The digest fired on a real regression &mdash; what now?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="p text-muted-foreground">
                  Run <Inline>npx audit-governance --scope . --print-issue</Inline> locally
                  on the affected repo for the markdown drill-down. From there, either fix
                  the violation, add a suppression with a real justification (see{" "}
                  <a href="/gallery/skills/governance-auditor/setup" className="text-link hover:text-link-hover underline underline-offset-2">
                    setup &rarr; Common situations
                  </a>), or file a drift report with <Inline>--print-issue | gh issue create</Inline>{" "}
                  if the rule itself feels wrong.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">What&rsquo;s next</h2>
          <p className="p text-muted-foreground">
            Pattern A and Pattern B are deliberately the minimum viable wiring. A few
            things to layer on once the basics prove valuable:
          </p>
        </div>
        <Card level={2}>
          <CardContent className="space-y-3 pt-6">
            <p className="p-sm text-muted-foreground">
              <span className="font-[520] text-foreground">Thread updates instead of new messages.</span>{" "}
              Add a <Inline>chat:write</Inline> OAuth scope to the same Slack app, install it to
              the workspace, and use the resulting bot token to call{" "}
              <Inline>chat.postMessage</Inline> on the first run (capture the returned{" "}
              <Inline>ts</Inline>) and <Inline>chat.update</Inline> on subsequent runs. The PR
              alert becomes one evolving message instead of a new message per push.
            </p>
            <p className="p-sm text-muted-foreground">
              <span className="font-[520] text-foreground">Suppression-abuse signal in the digest.</span>{" "}
              Once the digest has a history store, surface{" "}
              <Inline>totalSuppressed</Inline> alongside <Inline>totalViolations</Inline>.
              A repo whose violation count is flat while its suppression count grows is
              hiding tech debt, not fixing it.
            </p>
            <p className="p-sm text-muted-foreground">
              <span className="font-[520] text-foreground">Stale-version warning.</span>{" "}
              The digest can also check each consumer&rsquo;s{" "}
              <Inline>@chebert-pd/ui</Inline> version against the latest published one. A
              consumer on an old version is missing whatever new rules shipped in between
              &mdash; that&rsquo;s the kind of drift that only shows up cross-repo.
            </p>
          </CardContent>
        </Card>
        <p className="p text-muted-foreground">
          Back to <a href="/gallery/skills/governance-auditor/setup" className="text-link hover:text-link-hover underline underline-offset-2">
            Adding the auditor
          </a>{" "}
          &middot; <a href="/gallery/skills/governance-auditor" className="text-link hover:text-link-hover underline underline-offset-2">
            Case study
          </a>
        </p>
      </section>

    </div>
  )
}
