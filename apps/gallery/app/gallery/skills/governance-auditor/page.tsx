// govern:disable-file TY-001,TY-002,PL-001,PL-002,PL-003,SC-001,SC-002,BD-001,EL-003
// This page documents governance violations by name; matching them in prose is intentional.
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@chebert-pd/ui"
import { CodeSnippet } from "@/app/gallery/_components/code-block"

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

export default function GovernanceAuditorPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      <div className="space-y-4">
        <Badge variant="default">Case Study</Badge>
        <h1 className="h1">Building the Governance Auditor</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          How we encoded design intent into executable rules and ran our first audit &mdash;
          53 violations, 4 false positives, and a cleaner system on the other side.
        </p>
      </div>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The problem we were solving</h2>
          <p className="p text-muted-foreground">
            We had a codebase index (the map) and component metadata (the contracts). Both told
            AI what exists and how to use it. What we didn&rsquo;t have was a way to check whether
            existing code actually followed the rules &mdash; a governance layer that could audit
            the system after the fact, not just guide generation.
          </p>
          <p className="p text-muted-foreground">
            The specific trigger was a pattern we kept seeing with AI tools: they&rsquo;d
            write <Inline>text-destructive</Inline> for error text when they
            meant <Inline>text-destructive-foreground</Inline>. The
            base <Inline>destructive</Inline> token is a background tint &mdash; rose-50 in light
            mode, nearly white. As text, it&rsquo;s invisible. The code compiles. The PR passes
            review. The error message silently disappears.
          </p>
          <p className="p text-muted-foreground">
            A linter would say &ldquo;that token exists, you&rsquo;re fine.&rdquo; Governance says
            &ldquo;that token exists, but it&rsquo;s designed to be a background, not text content.&rdquo;
            That distinction &mdash; checking intent, not just existence &mdash; is what we needed to
            encode.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Writing the rules</h2>
          <p className="p text-muted-foreground">
            Before writing any code, we articulated seven rule categories by looking at the token
            system and asking: what can go wrong even when every individual token is valid? The rules
            are stored in <Inline>governance-rules.json</Inline> alongside the package.
          </p>
          <p className="p text-muted-foreground">
            The hardest part wasn&rsquo;t technical. It was making implicit knowledge
            explicit. <Inline>muted-foreground</Inline> on an h1 isn&rsquo;t &ldquo;wrong&rdquo; in
            any syntactic sense. But it violates the foreground hierarchy &mdash; top-level headings
            should have full emphasis. That&rsquo;s a design decision, not a type error. Encoding it
            means articulating a rule you&rsquo;ve been following unconsciously.
          </p>
          <p className="p text-muted-foreground">
            The semantic color pairing rule was the most impactful. Status colors in our system are
            3-token contracts: a background tint, a border, and a foreground. They&rsquo;re designed
            as sets. Using <Inline>bg-success</Inline> with <Inline>text-warning-foreground</Inline> is
            a cross-scheme violation. Using <Inline>text-destructive</Inline> for an error icon is
            using the background token as content. Both are syntactically valid. Both are semantically
            wrong.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">First run: 53 violations</h2>
          <p className="p text-muted-foreground">
            The auditor scanned 64 component files and found 53 violations. The breakdown:
          </p>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>What it found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
              <li>
                <span className="font-[520] text-foreground">38 named font weights</span> &mdash;
                {" "}<Inline>font-medium</Inline>, <Inline>font-semibold</Inline>,
                {" "}<Inline>font-bold</Inline> inherited from shadcn/v0 defaults. Our type system
                uses numeric weights (420/520/620/660). These weren&rsquo;t breaking anything
                visually, but they represented drift from the system &mdash; future AI sessions
                would see mixed conventions and propagate the wrong one.
              </li>
              <li>
                <span className="font-[520] text-foreground">7 semantic color violations</span> &mdash;
                base status tokens used as text color.{" "}
                <Inline>text-destructive</Inline> in date-picker error messages, field validation
                states, and dropdown menu destructive items. These were the silent failures we
                built the auditor to catch.
              </li>
              <li>
                <span className="font-[520] text-foreground">4 arbitrary font sizes</span> &mdash;
                {" "}<Inline>text-[10px]</Inline> and <Inline>text-[11px]</Inline> on counter badges
                and compact tab variants. Below the type scale, but intentionally &mdash; these are
                tiny UI elements where the scale doesn&rsquo;t have a stop small enough.
              </li>
              <li>
                <span className="font-[520] text-foreground">4 false positives</span> &mdash;
                two from the border hierarchy check, two from the foreground hierarchy check.
                These told us the rules needed refinement, not the code.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Refining the rules</h2>
          <p className="p text-muted-foreground">
            The false positives were as valuable as the real violations. Each one pointed to an
            edge case the rules didn&rsquo;t account for.
          </p>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Border hierarchy false positives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              The auditor flagged <Inline>ring-ring</Inline> in input-group and input-otp as
              &ldquo;ring outside focus state.&rdquo; But both were inside focus states &mdash; the
              selectors were just complex. Input-group
              used <Inline>{"has-[[data-slot=input-group-control]:focus-visible]:ring-ring"}</Inline>.
              Input-otp used <Inline>{"data-[active=true]:ring-ring/50"}</Inline> where the active
              state on an OTP slot is functionally equivalent to focus.
            </p>
            <p className="p text-muted-foreground">
              The fix: expand the focus detection to recognize complex selectors containing
              {" "}<Inline>:focus-visible</Inline> anywhere in the string, plus <Inline>data-[active=true]</Inline> as
              a focus-equivalent pattern.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Foreground hierarchy false positives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              The auditor flagged <Inline>text-muted-foreground</Inline> in empty-state and
              side-panel as &ldquo;muted-foreground near h2.&rdquo; But the muted text was on
              description paragraphs <em>below</em> the h2, not on the heading itself. The rule
              used a proximity heuristic that checked surrounding lines &mdash; too broad.
            </p>
            <p className="p text-muted-foreground">
              The fix: only flag when <Inline>muted-foreground</Inline> appears on the same
              JSX element as an h1/h2 tag or heading class, not just within a few lines of one.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Accepted exceptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              The 4 arbitrary font sizes were intentional. Counter badges and compact tab variants
              need sizes below the type scale. Rather than ignoring them, we codified the exception:
              {" "}<Inline>text-[10px]</Inline> and <Inline>text-[11px]</Inline> are accepted for
              compact UI elements. Any other arbitrary size still triggers a violation.
            </p>
            <p className="p text-muted-foreground">
              Similarly, the BadgeIndicator component uses <Inline>text-success</Inline> and
              {" "}<Inline>text-destructive</Inline> as shape fill colors
              via <Inline>bg-current</Inline> &mdash; the text color becomes the dot color. This
              isn&rsquo;t rendering text, so the 3-token contract doesn&rsquo;t apply. The auditor
              now skips lines using the <Inline>bg-current</Inline> pattern.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The fixes</h2>
          <p className="p text-muted-foreground">
            With the rules refined, we fixed the real violations:
          </p>
        </div>
        <Card level={1}>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
              <li>
                <span className="font-[520] text-foreground">Semantic colors:</span>{" "}
                <Inline>text-destructive</Inline> &rarr; <Inline>text-destructive-foreground</Inline> in
                date-picker error message, field invalid state, and field error
                component. <Inline>text-destructive</Inline> &rarr; <Inline>text-destructive-solid</Inline> in
                dropdown-menu destructive items (which need the bold red, not the tinted foreground).
              </li>
              <li>
                <span className="font-[520] text-foreground">Font weights:</span> bulk
                migration across 21 files. <Inline>font-normal</Inline> &rarr; <Inline>font-[420]</Inline>,
                {" "}<Inline>font-medium</Inline> &rarr; <Inline>font-[520]</Inline>,
                {" "}<Inline>font-semibold</Inline> &rarr; <Inline>font-[620]</Inline>,
                {" "}<Inline>font-bold</Inline> &rarr; <Inline>font-[620]</Inline>. 39 replacements total.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">After: zero violations</h2>
          <p className="p text-muted-foreground">
            Second run: 64 files scanned, 0 violations. The system is clean &mdash; not because
            every file was manually reviewed, but because the rules encode the design intent and
            the auditor checks every file against them automatically.
          </p>
          <p className="p text-muted-foreground">
            The auditor now runs as part of the workflow. When a component is added or modified,
            we can check it against all seven rule categories in seconds. The rules
            in <Inline>governance-rules.json</Inline> are versioned alongside the code, so they
            evolve with the system. When we add a new token scheme or change the type scale, we
            update the rules and re-run. The auditor catches anything that fell out of sync.
          </p>
          <p className="p text-muted-foreground">
            The most important outcome isn&rsquo;t the clean report. It&rsquo;s that we now have
            a machine-readable definition of what &ldquo;correct&rdquo; means for this design
            system. That definition didn&rsquo;t exist before &mdash; it lived in the designer&rsquo;s
            head. Now it lives in a file that AI can read, developers can reference, and a script
            can enforce.
          </p>
        </div>
      </section>

      <Separator />

      <div className="space-y-4">
        <Badge variant="default">Part Two</Badge>
        <h2 className="h1">Extending the audit to consumer apps</h2>
        <p className="p-lg text-muted-foreground max-w-2xl">
          The design system was clean. The apps using it weren&rsquo;t. The rewrite that fixed
          the gap &mdash; and what the first run on the gallery turned up.
        </p>
      </div>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The gap we missed</h2>
          <p className="p text-muted-foreground">
            The first version of the auditor only scanned the design system source. That was
            useful &mdash; it caught mistakes inside the components themselves &mdash; but it
            couldn&rsquo;t see the place violations actually accumulate: the apps that import
            the components and style around them.
          </p>
          <p className="p text-muted-foreground">
            A consumer app reaches for <Inline>font-medium</Inline> because it&rsquo;s the
            Tailwind default. It uses <Inline>text-blue-500</Inline> because the AI didn&rsquo;t
            know to look up a brand token. It hardcodes a hex color in a one-off spot. None of
            this breaks the design system &mdash; the system stays clean &mdash; but the surface
            area visible to users drifts further from the intent every week.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">What the rewrite did</h2>
          <p className="p text-muted-foreground">
            We rewrote the auditor in TypeScript and bundled it inside the
            {" "}<Inline>@chebert-pd/ui</Inline> package as a CLI. Apps that already install the
            design system now get the auditor for free &mdash; no separate install, no version
            mismatch. When the rules change, they ship in the next release of the package.
          </p>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>The seven decisions, settled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
              <li>
                <span className="font-[520] text-foreground">Distribution.</span> Bundled with
                {" "}<Inline>@chebert-pd/ui</Inline>. Auto-updates via the consumer&rsquo;s normal
                dependency bot. One source of truth, one version number.
              </li>
              <li>
                <span className="font-[520] text-foreground">Rules location.</span> Live with the
                design system. Apps can&rsquo;t fork them; rule changes ride with the package
                version.
              </li>
              <li>
                <span className="font-[520] text-foreground">File scope.</span> By default, only
                files that import from <Inline>@chebert-pd/ui</Inline>. Business logic and server
                code are ignored. Globs available for force-include or exclude.
              </li>
              <li>
                <span className="font-[520] text-foreground">CI hookup.</span> A reusable GitHub
                Actions workflow that any consumer repo can call with five lines. Posts inline
                annotations on the PR diff so violations land next to the offending line.
              </li>
              <li>
                <span className="font-[520] text-foreground">Escape hatch.</span> A
                {" "}<Inline>{"// govern:disable-next-line"}</Inline> comment silences a single
                line. Rule-specific or all-rules. Suppressions are reported separately so abuse
                shows up.
              </li>
              <li>
                <span className="font-[520] text-foreground">Output formats.</span> Three:
                pretty text for the terminal, structured JSON for tools and dashboards, and
                GitHub annotation lines for inline PR feedback.
              </li>
              <li>
                <span className="font-[520] text-foreground">Performance.</span> A
                {" "}<Inline>--changed-only</Inline> mode that uses git diff to scope the audit
                to files modified in the PR. Existing violations get grandfathered in; only new
                ones block the merge.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">First run on the gallery: 131 violations</h2>
          <p className="p text-muted-foreground">
            Pointing the new CLI at this gallery turned up 131 violations across 15 files. The
            design system itself stayed at zero. The drift was entirely in the consumer code &mdash;
            exactly the gap we suspected.
          </p>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>What it found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
              <li>
                <span className="font-[520] text-foreground">55 raw primitive tokens</span> &mdash;
                {" "}<Inline>gray-55</Inline>, <Inline>violet-58</Inline>, and similar leaked into
                gallery pages. These are the underlying values the semantic tokens are built on,
                not user-facing classes.
              </li>
              <li>
                <span className="font-[520] text-foreground">44 named font weights</span> &mdash;
                {" "}<Inline>font-medium</Inline> and friends, the same shadcn/v0 default we cleaned
                out of the design system. They came back in through the apps.
              </li>
              <li>
                <span className="font-[520] text-foreground">9 semantic color violations</span> &mdash;
                base status tokens used as text. <Inline>text-destructive</Inline> showing up
                where <Inline>text-destructive-foreground</Inline> belongs &mdash; the exact silent
                failure we built the original auditor to catch, just one layer further out.
              </li>
              <li>
                <span className="font-[520] text-foreground">8 raw shadow primitives</span> &mdash;
                {" "}<Inline>shadow-y4</Inline> and similar. Should be the semantic
                {" "}<Inline>elevation-*</Inline> tokens.
              </li>
              <li>
                <span className="font-[520] text-foreground">5 hardcoded colors and 2 Tailwind palette classes</span> &mdash;
                hex values and <Inline>text-blue-500</Inline> bypassing the token system entirely.
              </li>
              <li>
                <span className="font-[520] text-foreground">4 cross-scheme mixings, 3 arbitrary font sizes, 1 ring-outside-focus</span> &mdash;
                the long tail.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Why this matters</h2>
          <p className="p text-muted-foreground">
            A design system is only as healthy as the surface area users actually see. Clean
            components in a registry are useful; clean components in an app are the product.
            Without an auditor that can see the consumer side, the design system team has no
            visibility into where intent breaks down.
          </p>
          <p className="p text-muted-foreground">
            Bundling the auditor with the package means the rules travel with the system. There
            is no separate tool to install, no copy of the rules to fork, no version of the
            checker to update. When a designer adjusts a rule, every app on the next release of
            {" "}<Inline>@chebert-pd/ui</Inline> picks it up the next time CI runs. The
            distribution problem is solved by not having a distribution problem.
          </p>
          <p className="p text-muted-foreground">
            The deeper shift: the original auditor proved we could encode design intent. This
            extension proves we can deploy that intent across every team that consumes the
            system. A rule that lives in a JSON file and runs on every PR is a different
            artifact than a rule that lives in a designer&rsquo;s head.
          </p>
        </div>
      </section>

      <Separator />

      <div className="space-y-4">
        <Badge variant="default">Part Three</Badge>
        <h2 className="h1">Building the foundation</h2>
        <p className="p-lg text-muted-foreground max-w-2xl">
          Before sharing with the rest of the team, the auditor needed three things that any
          tool with users (not just one) requires: a safety net, room to grow, and a clearer
          way to opt out.
        </p>
      </div>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">What we needed</h2>
          <p className="p text-muted-foreground">
            The first run on the gallery surfaced a class of bug we&rsquo;d never see in the
            design system itself: the auditor flagged <Inline>&amp;#123;</Inline> as a
            hardcoded color because <Inline>#123</Inline> matches the hex pattern. That bug
            had been there since day one. It only fired because consumer code uses HTML
            entities for prose escaping, and the design system source doesn&rsquo;t.
          </p>
          <p className="p text-muted-foreground">
            The lesson: every time the auditor lands in a new codebase, it&rsquo;s going to
            find a regex edge case nobody anticipated. Without tests, those bugs surface in
            other teams&rsquo; CI logs and damage trust. With tests, they get caught the first
            time and never come back.
          </p>
          <p className="p text-muted-foreground">
            We also needed two structural improvements before opening the auditor to other
            apps: a way to mark rules as DS-only (so consumers don&rsquo;t see nonsense
            violations from rules that don&rsquo;t apply to them), and a richer suppression
            comment that captures <em>why</em> something was suppressed, not just that it
            was.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">What landed</h2>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>32 tests, three files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              A test suite using Node&rsquo;s built-in runner covers the core surfaces of the
              auditor: rule positives and negatives, suppression directive parsing across
              comment styles, and an end-to-end run against a fixture file. Catches regressions
              on every change.
            </p>
            <p className="p text-muted-foreground">
              The HTML-entity bug from the first gallery run is now a test that asserts the
              auditor does <em>not</em> match <Inline>&amp;#123;</Inline> as a hex color.
              Future regressions of that exact shape will fail CI on the PR that introduces
              them.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Rule scoping: appliesTo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Each rule now carries metadata declaring which mode it applies in:
              {" "}<Inline>ds</Inline>, <Inline>consumer</Inline>, or <Inline>both</Inline>.
              The CLI auto-detects the mode from the audited <Inline>package.json</Inline>{" "}
              and applies the appropriate filter.
            </p>
            <p className="p text-muted-foreground">
              The driving case: the elevation rule that warns about heavy shadows on small
              components keys off the file&rsquo;s base name. Inside the design system that
              means <Inline>button</Inline>, <Inline>badge</Inline>, etc. In a consumer app,
              files are commonly named <Inline>page</Inline>, which matches nothing — but the
              rule wouldn&rsquo;t know that. Scoping the rule to <Inline>ds</Inline> mode
              stops it from firing on files where it has no signal.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Severity wired end-to-end</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Today every rule is severity <Inline>error</Inline> and fails CI. But the
              metadata field is now plumbed all the way through the JSON output. A future
              rule can ship as <Inline>warning</Inline>, give teams time to adjust, and be
              promoted to <Inline>error</Inline> in a later release without code changes.
              The wiring is in place; the policy decision is for later.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Suppression with reasons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Suppression directives accept an optional <Inline>{"-- reason"}</Inline>{" "}
              clause. The captured text shows up in the JSON output as the suppression&rsquo;s
              reason field — visible to dashboards, code review, and future audits of the
              audits.
            </p>
            <CodeSnippet>{`// govern:disable-next-line PL-003 -- vendor widget enforces own colors
{/* govern:disable-next-line SC-002 -- ternary picks one scheme */}
// govern:disable-file PL-001 -- token reference data table`}</CodeSnippet>
            <p className="p text-muted-foreground">
              The reason isn&rsquo;t required yet. Once enough of the codebase uses the new
              syntax, we can promote it to required — &ldquo;suppression without
              justification fails CI&rdquo; — without any tooling changes.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Why this is a foundation, not features</h2>
          <p className="p text-muted-foreground">
            None of these changes added a single new check. The rule count is the same. The
            point of the foundation is to make every <em>future</em> change cheaper and safer:
            tests catch regressions, scoping prevents nonsense, severity unblocks gradual
            rollout, and reasons make suppression auditable. Each piece is small on its own;
            together they convert the auditor from &ldquo;a script that works on our repo&rdquo;
            into &ldquo;a tool teams can adopt without surprise.&rdquo;
          </p>
          <p className="p text-muted-foreground">
            The next steps build on this foundation: a baseline mode that lets new consumers
            adopt without a triage day, output formats that hook into more places (SARIF for
            GitHub Code Scanning), and a setup guide that walks new teams through it in five
            minutes. Each one assumes the safety net is in place.
          </p>
        </div>
      </section>

    </div>
  )
}
