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
          How we turned design intent into a tool that automatically checks every change &mdash;
          starting with 53 violations in the design system, ending with a tool any team can use.
        </p>
      </div>

      <Card level={1}>
        <CardHeader>
          <CardTitle>Plain English glossary &mdash; the vocabulary used throughout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
            <li>
              <span className="font-[520] text-foreground">Token</span> &mdash; a named design
              value (color, size, shadow). The design system gives every value a name; apps
              use the names instead of typing values directly.
            </li>
            <li>
              <span className="font-[520] text-foreground">Class</span> /{" "}
              <span className="font-[520] text-foreground">className</span> &mdash; a short
              label added to a UI element that controls how it looks. Tailwind&rsquo;s style.
            </li>
            <li>
              <span className="font-[520] text-foreground">Linter</span> &mdash; a tool that
              flags code that doesn&rsquo;t follow rules. Catches typos, syntax mistakes,
              missing imports. The governance auditor goes further &mdash; it checks whether
              the rules were followed in spirit, not just in letter.
            </li>
            <li>
              <span className="font-[520] text-foreground">Violation</span> &mdash; a place
              where the auditor caught a rule being broken.
            </li>
            <li>
              <span className="font-[520] text-foreground">Suppression</span> &mdash; a
              special comment that tells the auditor to ignore a specific line or whole file
              on purpose. Used when a violation is intentional (e.g. a documentation page
              that names a forbidden class as part of its prose).
            </li>
            <li>
              <span className="font-[520] text-foreground">CI</span> &mdash; the automated
              checks that run when someone proposes a change. Violations caught here block
              the change from being merged.
            </li>
            <li>
              <span className="font-[520] text-foreground">PR</span> &mdash; pull request. A
              proposed change, reviewed before being merged into the main code.
            </li>
            <li>
              <span className="font-[520] text-foreground">CLI</span> &mdash; a tool you run
              by typing a command. The auditor is one of these.
            </li>
            <li>
              <span className="font-[520] text-foreground">Consumer app</span> &mdash; an app
              that <em>uses</em> the design system (vs. the design system itself).
            </li>
          </ul>
        </CardContent>
      </Card>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The problem we were solving</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the design system gave every
            color a meaning, but nothing was checking that those meanings were used correctly.
          </p>
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
            That distinction &mdash; checking the spirit of the rule, not just whether the code
            ran &mdash; is what we needed to encode.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Writing the rules</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> we listed seven things that
            could go wrong, then taught a script how to spot each of them.
          </p>
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
            mixing schemes &mdash; a green background with orange text. Using
            {" "}<Inline>text-destructive</Inline> for an error icon means using the background
            color as the icon color &mdash; the icon is invisible. Both shapes look fine to the
            computer. Both are wrong by design.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">First run: 53 violations</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> we ran the script for the first
            time and it found 53 problems &mdash; some real, some false alarms that taught us
            how to refine the rules.
          </p>
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
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the false alarms were just as
            useful as the real findings &mdash; each one pointed to a case the rules
            didn&rsquo;t handle yet.
          </p>
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
              &ldquo;ring outside focus state.&rdquo; Both were actually inside focus states
              &mdash; the rule was just looking for a simple pattern and missed the more
              complex shapes the components used. Input-otp, for example, uses{" "}
              <Inline>data-[active=true]</Inline> on the boxes that hold each character of a
              verification code &mdash; functionally the same as focus, but expressed
              differently.
            </p>
            <p className="p text-muted-foreground">
              The fix: teach the rule to recognize the additional patterns that mean
              &ldquo;focused&rdquo; in this design system, not just the literal{" "}
              <Inline>focus:</Inline> prefix.
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
              description paragraphs <em>below</em> the heading, not on the heading itself.
              The rule was checking nearby lines &mdash; too broad a guess.
            </p>
            <p className="p text-muted-foreground">
              The fix: only flag the rule when the muted color is applied to the heading
              element itself, not just sitting near one.
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
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> with the rules cleaner, we
            went through the real violations and fixed them.
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
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the system was clean &mdash;
            and would stay that way, because future changes get checked automatically.
          </p>
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
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the design system was clean,
            but the apps using it weren&rsquo;t &mdash; and the auditor couldn&rsquo;t see them.
          </p>
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
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> we put the auditor inside the
            design system package, so any team that uses the design system gets the auditor
            automatically.
          </p>
          <p className="p text-muted-foreground">
            We rewrote the auditor in TypeScript and bundled it inside the
            {" "}<Inline>@chebert-pd/ui</Inline> package as a command-line tool. Apps that
            already install the design system now get the auditor for free &mdash; no
            separate install, no version mismatch. When the rules change, they ship in the
            next release of the package.
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
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the design system was at zero,
            but the gallery (an app that uses it) had 131 violations &mdash; the drift was
            real and exactly where we expected.
          </p>
          <p className="p text-muted-foreground">
            Pointing the new tool at this gallery turned up 131 violations across 15 files.
            The design system itself stayed at zero. All the drift was in the apps consuming
            the design system &mdash; exactly the gap we suspected.
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
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> a design system is only as
            healthy as the apps using it &mdash; so the auditor has to be able to see them.
          </p>
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
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> before sharing the tool with
            other teams, we needed a safety net to catch our own bugs and a few small
            features that would prevent confusion downstream.
          </p>
          <p className="p text-muted-foreground">
            The first run on the gallery surfaced a class of bug we&rsquo;d never see in the
            design system itself. The auditor was matching the HTML escape code for a curly
            brace (<Inline>&amp;#123;</Inline>) as if it were a hardcoded color, because the
            sequence <Inline>#123</Inline> looks like a 3-digit hex. That bug had been there
            since day one. It only fired now because gallery prose uses HTML escape codes;
            the design system code doesn&rsquo;t.
          </p>
          <p className="p text-muted-foreground">
            The lesson: every time the auditor lands in a new codebase, it&rsquo;s going to
            find a corner case nobody anticipated. Without automated tests of our own, those
            bugs would show up in other teams&rsquo; automated checks and damage trust. With
            tests, they get caught the first time and never come back.
          </p>
          <p className="p text-muted-foreground">
            We also needed two small features. First, a way to mark some rules as
            &ldquo;design system only&rdquo; so they wouldn&rsquo;t fire confusingly in
            consumer apps. Second, a way to attach a reason to every suppression &mdash; so
            when someone silences a rule, the next person can see <em>why</em>.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">What landed</h2>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>An automated test suite (32 tests)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Tests check each rule with examples that should and shouldn&rsquo;t trigger it,
              plus end-to-end runs against a small sample file. They run on every change to
              the auditor &mdash; so any regression is caught before it ships.
            </p>
            <p className="p text-muted-foreground">
              The HTML-escape-code bug above is now itself a test: it asserts the auditor does
              <em>not</em> match <Inline>&amp;#123;</Inline> as a color. If anyone ever
              accidentally re-introduces that bug, the test fails and blocks the change.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Rule scoping: design-system-only vs. everywhere</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Each rule now declares whether it applies to the design system itself, to
              consumer apps, or both. The auditor figures out automatically which mode it&rsquo;s
              in by looking at the project it&rsquo;s pointed at.
            </p>
            <p className="p text-muted-foreground">
              Why this matters: one rule (the one warning about heavy shadows on small
              components) only makes sense inside the design system, where files are named
              after the component (button, badge, etc.). In consumer apps, files are
              typically named <Inline>page</Inline> &mdash; the rule would never have
              meaningful signal. Scoping it to design-system-only keeps it useful where it
              applies and silent everywhere else.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Severity wired through the system</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Today every rule is treated as a hard error: it fails the automated check and
              blocks the change. But each rule now also has a severity field that can be
              flipped to &ldquo;warning&rdquo; in the future. That gives the design-system
              team an option for rolling out new rules gently &mdash; ship them as warnings
              first, give teams time to adjust, then promote them to errors later. No code
              changes needed; just the policy.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Suppressions with reasons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              When you silence a rule, you can now attach a reason after a{" "}
              <Inline>{"-- "}</Inline> separator. The reason gets captured into the audit
              report &mdash; visible to whoever reviews the change and to any future
              dashboard tracking suppressions across the codebase.
            </p>
            <CodeSnippet>{`// govern:disable-next-line PL-003 -- vendor widget enforces own colors
{/* govern:disable-next-line SC-002 -- ternary picks one scheme */}
// govern:disable-file PL-001 -- token reference data table`}</CodeSnippet>
            <p className="p text-muted-foreground">
              The reason isn&rsquo;t required yet. The plan is to start as optional, watch
              how teams use it, and eventually require it &mdash; &ldquo;you can&rsquo;t
              silence a rule without saying why.&rdquo;
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Why this is a foundation, not features</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> none of these changes added
            a new rule &mdash; they made every future change cheaper and safer.
          </p>
          <p className="p text-muted-foreground">
            None of these changes added a single new check. The rule count is the same. The
            point of the foundation is to make every <em>future</em> change cheaper and safer:
            tests catch regressions, scoping prevents confusion, severity unblocks gradual
            rollout, and reasons make suppressions visible. Each piece is small on its own;
            together they convert the auditor from &ldquo;a script that works on our repo&rdquo;
            into &ldquo;a tool teams can adopt without surprise.&rdquo;
          </p>
        </div>
      </section>

      <Separator />

      <div className="space-y-4">
        <Badge variant="default">Part Four</Badge>
        <h2 className="h1">Removing the adoption tax</h2>
        <p className="p-lg text-muted-foreground max-w-2xl">
          Every team that adopts a new tool pays a tax in time and frustration. We made that
          tax disappear &mdash; so a new team can be running the auditor in five minutes,
          without doing a cleanup pass first.
        </p>
      </div>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The problem with day one</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> when a team installs a new
            checking tool, the first run shows hundreds of problems &mdash; and most teams
            either spend a day cleaning up or quietly turn the tool off.
          </p>
          <p className="p text-muted-foreground">
            Imagine you&rsquo;re a team lead. Someone shares a new tool that catches design
            system mistakes. You install it, run it once, and see 100+ violations from code
            written before the tool existed. Now what?
          </p>
          <p className="p text-muted-foreground">
            The realistic options are bad. Spend a day triaging every violation before you
            can use the tool at all. Or turn the tool off and tell yourself you&rsquo;ll come
            back to it. Most teams pick the second.
          </p>
          <p className="p text-muted-foreground">
            We&rsquo;d already lived this with the gallery itself: the first run found 131
            violations, and we spent real time deciding which were real bugs, which were
            intentional, and which to fix. That worked because we built the tool. We
            can&rsquo;t expect every team to do the same.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Baseline mode</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> a team can &ldquo;snapshot&rdquo;
            their existing violations, and from then on the auditor only blocks <em>new</em>{" "}
            violations &mdash; not pre-existing ones.
          </p>
          <p className="p text-muted-foreground">
            The new feature is a baseline. A team runs the auditor once with a special flag,
            and it captures the current state of the codebase to a small file
            (<Inline>.govern-baseline.json</Inline>) that lives alongside the project.
          </p>
          <p className="p text-muted-foreground">
            From then on, every audit run compares against the baseline. Pre-existing
            violations are reported as &ldquo;baselined&rdquo; (visible, but not blocking).
            Anything new &mdash; introduced by today&rsquo;s change &mdash; fails the
            automated check. Teams clean up the baseline at their own pace, but new mistakes
            are caught immediately.
          </p>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>Adoption in five minutes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-muted-foreground p list-disc pl-5">
              <li>
                <span className="font-[520] text-foreground">Day one:</span> install the
                design system (already done), run the auditor with the
                <Inline>{" "}--baseline write{" "}</Inline> flag, commit the resulting file.
                Audit now passes.
              </li>
              <li>
                <span className="font-[520] text-foreground">Every PR after:</span> the
                auditor runs automatically. Existing violations don&rsquo;t block the merge;
                new ones do.
              </li>
              <li>
                <span className="font-[520] text-foreground">Whenever you have time:</span>{" "}
                fix or suppress entries from the baseline. The file shrinks. Eventually it
                hits zero, and you can delete it.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Suggest-suppressions</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> for files where violations
            are intentional (like documentation pages), the auditor can recommend the exact
            suppression comment to copy in.
          </p>
          <p className="p text-muted-foreground">
            Sometimes a violation isn&rsquo;t a mistake. The token reference page in this
            gallery <em>has</em> to mention raw color names like <Inline>gray-55</Inline>{" "}
            because it&rsquo;s documenting the colors. The auditor can&rsquo;t tell that from
            the code, so it flags every instance.
          </p>
          <p className="p text-muted-foreground">
            Rather than asking the team to write the suppression comment from scratch, the
            new <Inline>--suggest-suppressions</Inline> flag analyzes a file and prints a
            recommended directive, ready to paste at the top of the file:
          </p>
        </div>
        <CodeSnippet>{`$ npx audit-governance --scope . --suggest-suppressions tokens/colors/page.tsx
// govern:disable-file PL-001,TY-002 -- describe why this file is exempt
// tokens/colors/page.tsx — 44 violations across 2 rules
// PL-001: 42, TY-002: 2`}</CodeSnippet>
        <p className="p text-muted-foreground">
          The team adds a meaningful reason after the <Inline>{"-- "}</Inline> and pastes the
          comment into the file. Done. The auditor reports those violations as suppressed,
          with the reason captured for future audits.
        </p>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Why this matters</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> a tool that requires
            cleanup before adoption gets used by a few committed teams; a tool that adopts
            cleanly gets used by everyone.
          </p>
          <p className="p text-muted-foreground">
            The hardest part of any quality tool isn&rsquo;t the rules &mdash; it&rsquo;s the
            on-ramp. If a team has to spend a day cleaning up before they can ship anything,
            most teams will skip the tool. If they can adopt it in five minutes and
            improve at their own pace, most teams will keep it on.
          </p>
          <p className="p text-muted-foreground">
            Baseline mode is the same idea ESLint and TypeScript use to roll out stricter
            rules across mature codebases. The principle: don&rsquo;t make people clean up
            the past as a precondition for catching mistakes in the future.
          </p>
        </div>
      </section>

      <Separator />

      <div className="space-y-4">
        <Badge variant="default">Part Five</Badge>
        <h2 className="h1">Ready to share</h2>
        <p className="p-lg text-muted-foreground max-w-2xl">
          The last mile: making the auditor land cleanly in any team&rsquo;s setup, surface
          its findings in tools they already use, and read clearly to anyone &mdash; not
          just the people who built it.
        </p>
      </div>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Working with any toolchain</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the auditor used to assume
            a specific way of running things; now it works with whatever the team already uses.
          </p>
          <p className="p text-muted-foreground">
            The reusable workflow now accepts a <Inline>package-manager</Inline> input, so
            teams that use pnpm or yarn (rather than npm) can plug in with the same five
            lines of YAML. It also accepts an optional <Inline>build-command</Inline> for
            monorepos like ours, where the auditor&rsquo;s code lives next to the design
            system and gets built alongside it.
          </p>
          <p className="p text-muted-foreground">
            Every team has opinions about their toolchain. The auditor doesn&rsquo;t try to
            change them &mdash; it adapts.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">SARIF output for the Security tab</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> violations now show up in
            GitHub&rsquo;s Security tab, not just on individual PRs.
          </p>
          <p className="p text-muted-foreground">
            SARIF is a standard format for static-analysis findings. GitHub Code Scanning,
            most IDEs, and many third-party dashboards consume it. Adding SARIF as an
            output format means a team can upload the audit results to GitHub&rsquo;s
            Security tab, where violations persist across PRs as historical findings &mdash;
            useful for the design system team that wants to see drift across all consumer
            apps in one place.
          </p>
          <p className="p text-muted-foreground">
            For the consumer team: nothing changes in their day-to-day. The PR annotations
            still work. SARIF is an additional surface, not a replacement.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Writing for any reader</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> a tool that&rsquo;s only
            documented for the people who built it isn&rsquo;t really a tool other teams
            can use.
          </p>
          <p className="p text-muted-foreground">
            The case study you&rsquo;re reading was originally written assuming the reader
            knew what CI, regex, JSX, and a suppression directive were. That&rsquo;s fine if
            the only readers are the people who built the auditor. It&rsquo;s a problem if
            the audience is &ldquo;any designer or PM who wants to understand what their
            team adopted.&rdquo;
          </p>
          <p className="p text-muted-foreground">
            The fix was small: a glossary of recurring vocabulary at the top, an italicized
            &ldquo;in one sentence&rdquo; lead at every section, and specific jargon swaps
            where a plain phrase carries the same meaning. The technical depth is preserved
            &mdash; nothing was deleted, only framed. Senior developers reading
            top-to-bottom won&rsquo;t notice. A designer learning code won&rsquo;t get stuck
            on the third paragraph.
          </p>
          <p className="p text-muted-foreground">
            This is part of the tool, even though no code changed. A tool you can&rsquo;t
            explain to your colleagues isn&rsquo;t adoptable. A tool you can&rsquo;t explain
            to your stakeholders won&rsquo;t get the budget for the next iteration.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">A setup guide</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> the case study tells the
            story; the setup guide tells you what to do.
          </p>
          <p className="p text-muted-foreground">
            One last piece: a separate <a href="/gallery/skills/governance-auditor/setup" className="underline">setup
            guide page</a> that&rsquo;s purely operational. It walks a team from &ldquo;we
            just installed the design system&rdquo; to &ldquo;we have the auditor running
            on every PR&rdquo; in three steps. The case study is for understanding why; the
            setup guide is for getting to work.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Looking back</h2>
          <p className="p text-muted-foreground italic">
            <span className="font-[520]">In one sentence:</span> we started with a script
            that worked on one repo. We finished with a tool any team can adopt without us.
          </p>
          <p className="p text-muted-foreground">
            The arc of this work, in five lines: encode design intent into rules; ship them
            with the package; build a safety net; remove the adoption tax; document for any
            reader.
          </p>
          <p className="p text-muted-foreground">
            None of these steps were dramatic. None of them were &ldquo;the big idea.&rdquo;
            The big idea was the original auditor &mdash; rules a script can check.
            Everything since has been making that idea robust, distributable, and readable.
            That&rsquo;s usually where the actual work is: not in the breakthrough, but in
            making the breakthrough usable by people who weren&rsquo;t in the room when it
            happened.
          </p>
          <p className="p text-muted-foreground">
            The auditor now ships inside <Inline>@chebert-pd/ui</Inline>. Any team that
            installs the design system has it. The next team to adopt won&rsquo;t need to
            build any of this &mdash; they&rsquo;ll just use it.
          </p>
        </div>
      </section>

    </div>
  )
}
