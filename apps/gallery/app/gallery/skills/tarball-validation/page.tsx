// govern:disable-file CO-005 -- documentation page renders example import statements as CodeSnippet text content, not actual module imports
import { Card, CardContent, Badge, Separator } from "@big-wylly-style/ui"
import { CodeSnippet } from "@/app/gallery/_components/code-block"

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

export default function TarballValidationPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      <div className="space-y-4">
        <Badge variant="default">Case Study</Badge>
        <h1 className="h1">The bug that almost shipped</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          During pre-merge validation of the skill-bundling PR, a real-tarball install
          in a consumer app surfaced a silent failure that unit tests, build smoke
          tests, and CI all missed: the npm-installed CLI did nothing when invoked
          through a symlink. Here&rsquo;s how it slipped past the safety net &mdash; and
          how we tuned the net so the next one doesn&rsquo;t.
        </p>
      </div>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">What we were shipping</h2>
          <p className="p text-muted-foreground">
            PR #163 bundled <Inline>ai-ds-composer</Inline> with{" "}
            <Inline>@big-wylly-style/ui</Inline>, added a new{" "}
            <Inline>bws-install-skills</Inline> CLI for installing both consumer-facing
            skills with one command, and added a freshness check that warns from inside
            the auditor when the consumer&rsquo;s installed skills are stale, missing,
            or corrupt.
          </p>
          <p className="p text-muted-foreground">
            The safety net looked complete:{" "}
            <span className="font-[520] text-foreground">191 unit tests passing</span>,
            a local <Inline>node dist/cli/install-skills.js</Inline> smoke run printing
            the right output, and{" "}
            <span className="font-[520] text-foreground">CI green across build,
            typecheck, tests, governance audit, and Vercel preview</span>. Ready to
            merge.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The first sign of trouble</h2>
          <p className="p text-muted-foreground">
            Before merging, we ran the test plan&rsquo;s install-skills behavior section
            against a real consumer app. Step one: pack the branch tarball, install it
            in the test app, and run the basic checks.
          </p>
        </div>
        <CodeSnippet title="What the smoke test did">{`npm install /path/to/big-wylly-style-ui-3.2.2.tgz
./node_modules/.bin/bws-install-skills --help
./node_modules/.bin/bws-install-skills --bogus`}</CodeSnippet>
        <p className="p text-muted-foreground">
          Both invocations produced{" "}
          <span className="font-[520] text-foreground">no output and exit code 0</span>.
          The CLI was there &mdash; the symlink resolved, the file existed, the shebang
          was right &mdash; but <Inline>main()</Inline> never ran.
        </p>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The diagnosis</h2>
          <p className="p text-muted-foreground">
            <Inline>install-skills.ts</Inline> shipped with an entry guard so the test
            suite could import the module without triggering its main path:
          </p>
        </div>
        <CodeSnippet title="Original guard">{`const invokedHref = process.argv[1] ? pathToFileURL(process.argv[1]).href : ""
if (import.meta.url === invokedHref) {
  main()
}`}</CodeSnippet>
        <p className="p text-muted-foreground">
          The guard worked when invoked directly
          (<Inline>node dist/cli/install-skills.js</Inline>) because both{" "}
          <Inline>import.meta.url</Inline> and <Inline>process.argv[1]</Inline> pointed
          at the same real path. It fell over when invoked through the npm-installed
          symlink because Node treats those two values differently:
        </p>
        <Card level={2}>
          <CardContent className="space-y-2 p-sm text-muted-foreground">
            <div>
              <span className="font-[520] text-foreground">
                <Inline>import.meta.url</Inline>
              </span>{" "}
              &mdash; the resolved real path of the loaded module
            </div>
            <div>
              <span className="font-[520] text-foreground">
                <Inline>process.argv[1]</Inline>
              </span>{" "}
              &mdash; the literal path the shell typed (the symlink, not its target)
            </div>
          </CardContent>
        </Card>
        <CodeSnippet title="What Node actually sees through the symlink">{`argv1 (symlink): /…/node_modules/.bin/bws-install-skills
argv1 as URL:    file:///…/node_modules/.bin/bws-install-skills
import.meta.url: file:///…/node_modules/@big-wylly-style/ui/dist/cli/install-skills.js`}</CodeSnippet>
        <p className="p text-muted-foreground">
          The URLs didn&rsquo;t match, so the guard skipped <Inline>main()</Inline>.
          Silent exit 0, no output, no error. The CLI looked installed but did
          nothing.
        </p>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The fix</h2>
          <p className="p text-muted-foreground">
            Resolve both sides to their real paths before the URL comparison, and wrap
            in a try/catch so an unreadable <Inline>argv1</Inline> falls back to a safe
            default:
          </p>
        </div>
        <CodeSnippet title="Updated guard">{`function isMainModule(): boolean {
  const argv1 = process.argv[1]
  if (!argv1) return false
  try {
    return import.meta.url === pathToFileURL(realpathSync(argv1)).href
  } catch {
    return false
  }
}
if (isMainModule()) {
  main()
}`}</CodeSnippet>
        <p className="p text-muted-foreground">
          The same guard landed in <Inline>audit-governance.ts</Inline> proactively. It
          had no guard at all and worked today only because no test imported it &mdash;
          the moment a test did, the same bug would surface.
        </p>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Locking it down</h2>
          <p className="p text-muted-foreground">
            The unit-test suite that ran before this discovery passed because tests
            import the module directly &mdash; they never invoke through a symlink. So
            we added a test that does exactly that: write the real built CLI to a
            tempdir, symlink to it, invoke via the symlink, assert that the help banner
            prints.
          </p>
        </div>
        <CodeSnippet title="install-skills.test.ts — symlink regression">{`test("install-skills: invoking the built CLI via a symlink runs main() (npm-bin shape)", () => {
  if (!existsSync(DIST_INSTALL_SKILLS)) return
  const tmpRoot = mkdtempSync(join(tmpdir(), "bws-symlink-"))
  const symlinkPath = join(tmpRoot, "bws-install-skills")
  symlinkSync(DIST_INSTALL_SKILLS, symlinkPath)
  try {
    const result = spawnSync("node", [symlinkPath, "--help"], { encoding: "utf-8" })
    assert.equal(result.status, 0)
    assert.match(result.stdout, /bws-install-skills — Install Claude Code skills/)
  } finally {
    rmSync(tmpRoot, { recursive: true, force: true })
  }
})`}</CodeSnippet>
        <p className="p text-muted-foreground">
          Test the deployment shape, not just the dev shape. If the bug came back, this
          test would fail in the next CI run &mdash; long before it reached a consumer.
        </p>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The lesson</h2>
          <p className="p text-muted-foreground">
            Direct invocation lies. <Inline>node dist/cli/install-skills.js</Inline>{" "}
            from the source tree exercises a different code path than{" "}
            <Inline>npx bws-install-skills</Inline> after an actual{" "}
            <Inline>npm install</Inline>. They share most logic but diverge on
            module-identity edge cases like this one.
          </p>
          <p className="p text-muted-foreground">
            Real-tarball, real-install validation against a consumer app caught the bug
            with ninety seconds of work. It now sits between &ldquo;CI green&rdquo; and
            &ldquo;merge&rdquo; in the test plan template, with the regression test
            locking in the specific failure mode that surfaced this time.
          </p>
        </div>
        <Card level={2}>
          <CardContent className="space-y-2 p-sm text-muted-foreground">
            <div>
              <span className="font-[520] text-foreground">Pre-merge artifact:</span>{" "}
              <a
                href="https://github.com/chebert-pd/big-wylly-style/pull/163"
                className="text-link hover:text-link-hover underline underline-offset-2"
              >
                PR #163
              </a>{" "}
              &mdash; bundling work + the fix commit{" "}
              <Inline>fix(ui): realpath both sides of CLI entry guard</Inline>
            </div>
            <div>
              <span className="font-[520] text-foreground">Released as:</span>{" "}
              <Inline>@big-wylly-style/ui@3.3.0</Inline>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  )
}
