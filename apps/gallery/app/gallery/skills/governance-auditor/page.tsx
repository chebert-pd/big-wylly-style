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

    </div>
  )
}
