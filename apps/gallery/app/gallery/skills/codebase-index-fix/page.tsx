// govern:disable-file CO-005 -- documentation page renders example import statements as CodeSnippet text content, not actual module imports
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@big-wylly-style/ui"
import { CodeSnippet } from "@/app/gallery/_components/code-block"

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

export default function CodebaseIndexFixPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      <div className="space-y-4">
        <Badge variant="default">Case Study</Badge>
        <h1 className="h1">Fixing the Codebase Indexer</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          Two fixes to the indexer and the workflow around it: a blind spot in the
          relationship graph that left every component showing zero connections, and
          a CI loop that kept opening empty PRs.
        </p>
      </div>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The symptom</h2>
          <p className="p text-muted-foreground">
            After restructuring the design system into a monorepo, we ran the codebase-index
            skill to generate the relationship graph. The indexer scanned all 64 components
            and reported 792 relationships found. But when we opened the output, every single
            component had <Inline>uses[0]</Inline> and <Inline>usedBy[0]</Inline>. Zero
            connections. The index knew the components existed, but it thought none of them
            talked to each other.
          </p>
          <p className="p text-muted-foreground">
            This made the index useless for its primary purpose: answering questions like
            &ldquo;what depends on Button?&rdquo; or &ldquo;what would break if I refactored
            Dialog?&rdquo; The map existed but had no roads.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The diagnosis</h2>
          <p className="p text-muted-foreground">
            We traced the problem to a single function in the indexer
            script: <Inline>_is_component_import</Inline>. This function decided whether an
            import statement counted as a &ldquo;component import&rdquo; (which goes into the
            relationship graph) or something else (external package, utility, schema).
          </p>
          <p className="p text-muted-foreground">
            It checked two conditions:
          </p>
        </div>
        <CodeSnippet title="Original detection logic">{`def _is_component_import(self, source: str) -> bool:
    component_extensions = tuple(self.config["extensions"])
    return (
        any(source.endswith(ext) for ext in component_extensions)
        or '/components/' in source
    )`}</CodeSnippet>
        <div className="space-y-2">
          <p className="p text-muted-foreground">
            An import counted as a component if the path ended with <Inline>.tsx</Inline> or
            contained <Inline>/components/</Inline>. Our components import each other with
            bare relative paths:
          </p>
        </div>
        <CodeSnippet title="How our components import each other">{`import { Button } from "./button"
import { Dialog } from "./dialog"
import { Sheet } from "./sheet"`}</CodeSnippet>
        <p className="p text-muted-foreground">
          No file extension. No <Inline>/components/</Inline> in the path. Neither condition
          matched, so every sibling import was silently classified as &ldquo;not a component&rdquo;
          and dropped from the graph. The 792 &ldquo;relationships found&rdquo; in the summary were
          counting import statements parsed, not relationships actually recorded.
        </p>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">A second bug hiding behind the first</h2>
          <p className="p text-muted-foreground">
            Even if the detection had worked, there was a second problem. When the indexer did
            find a component import, it stored the <em>import name</em> &mdash; the JavaScript
            identifier like <Inline>Button</Inline> or <Inline>DialogContent</Inline>. Later,
            when building the <Inline>usedBy</Inline> reverse lookup, it tried to match these
            names against component keys.
          </p>
          <p className="p text-muted-foreground">
            But the component keys were file paths
            like <Inline>src/components/button/button.tsx</Inline>. The lookup tried to
            match <Inline>Button</Inline> against file stems
            like <Inline>button</Inline>. Case mismatch. Even with correct detection,
            the relationship graph would have stayed empty because the two halves of the system
            spoke different languages.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The fix</h2>
          <p className="p text-muted-foreground">
            Two changes, both in the indexer script:
          </p>
        </div>
        <Card level={1}>
          <CardHeader>
            <CardTitle>1. Broaden detection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Any relative import (<Inline>./</Inline> or <Inline>../</Inline>) that isn&rsquo;t
              a utility or schema is now treated as a component import. This catches the bare
              path pattern our components use without being so broad that it picks up utility
              imports from <Inline>../lib/utils</Inline>.
            </p>
          </CardContent>
        </Card>
        <Card level={1}>
          <CardHeader>
            <CardTitle>2. Resolve to file paths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Instead of storing the import name (<Inline>Button</Inline>), the indexer now
              resolves the relative path to an actual file on
              disk. <Inline>../button</Inline> from <Inline>dialog/dialog.tsx</Inline> resolves
              to <Inline>src/components/button/button.tsx</Inline> by trying each known file
              extension. This resolved path matches the component keys exactly, so
              the <Inline>usedBy</Inline> reverse lookup works correctly. Duplicates from
              multiple named imports of the same file are deduplicated automatically.
            </p>
          </CardContent>
        </Card>
        <CodeSnippet title="Fixed detection + resolution">{`def _is_component_import(self, source: str) -> bool:
    # Original checks
    if any(source.endswith(ext) for ext in extensions) or '/components/' in source:
        return True
    # New: relative imports that aren't utilities or schemas
    if source.startswith('.') and not self._is_utility_import(source)
       and not self._is_schema_import(source):
        return True
    return False

def _resolve_import_to_component_key(self, source, importing_file):
    """Resolve ../button to src/components/button/button.tsx"""
    resolved = (importing_file.parent / source).resolve()
    for ext in self.config["extensions"]:
        candidate = resolved.with_suffix(ext)
        if candidate.exists():
            return str(candidate.relative_to(self.project_root))
    return None`}</CodeSnippet>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The result</h2>
          <p className="p text-muted-foreground">
            Before the fix: 64 components, 0 relationships. After: 64 components, 792
            relationships. Button correctly shows 15 components that depend on it. Dialog shows
            it&rsquo;s used by ResponsiveDialog and Command. The full dependency chain is visible.
          </p>
          <p className="p text-muted-foreground">
            The fix also exposed the structure of the system in a way the flat file list never did.
            Separator is used by 4 components. Sheet is used by SidePanel and ResponsiveDialog.
            Input is used by 6 components. These are the load-bearing pieces of the
            system &mdash; the ones where a breaking change has the widest impact. Without the
            relationship graph, that information was invisible.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The workflow problem</h2>
          <p className="p text-muted-foreground">
            That fixed the index itself. The workflow that regenerates it was still doing too
            much. Every push that touched a component triggered the indexer, which rewrote
            a <Inline>generated:</Inline> timestamp inside each <Inline>.toon</Inline> file.
            The workflow&rsquo;s &ldquo;did anything change?&rdquo; check saw the diff, opened
            a chore PR, and waited. If no component structure had actually changed, the PR
            contained nothing but timestamp churn. Three of these accumulated and were closed
            by hand (#71, #90, #92) before the pattern was obvious.
          </p>
          <p className="p text-muted-foreground">
            The detection was answering the wrong question. <Inline>git diff --staged --quiet</Inline>
            returns 1 if any byte changed &mdash; including metadata that ships with every
            regeneration. We needed the more useful question: did anything <em>load-bearing</em>{" "}
            change?
          </p>
        </div>
        <CodeSnippet title="The added check in update-index.yml">{`# No changes at all
if git diff --staged --quiet; then exit 0; fi

# Only the regeneration timestamp changed — skip the PR.
# \`-I '^generated:'\` ignores hunks where every added/removed line
# matches the regex, so a real content change still triggers a PR.
if git diff --staged -I '^generated:' --quiet; then exit 0; fi`}</CodeSnippet>
        <p className="p text-muted-foreground">
          Git&rsquo;s <Inline>diff -I &lt;regex&gt;</Inline> ignores hunks where every added or
          removed line matches the pattern. A timestamp-only diff has exactly one such hunk per
          file; all of them get filtered, the diff comes back empty, and the workflow exits
          quietly. A real content change &mdash; a new component, a changed import &mdash; lives
          in a hunk that doesn&rsquo;t match the regex, survives the filter, and opens a PR as
          before. The <Inline>generated:</Inline> field stays in the files because the
          regeneration timestamp is occasionally useful when debugging &ldquo;is this index
          stale?&rdquo; The inbox just stops getting paged about it.
        </p>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">The feedback loop</h2>
          <p className="p text-muted-foreground">
            Both fixes are textbook ARC feedback loops. We ran the tool (Audit), the output
            told us something was wrong (Report), and we fixed the tool itself (Compose). The
            infrastructure got better because we used it. The next run was accurate because the
            previous run surfaced the gap.
          </p>
          <p className="p text-muted-foreground">
            The two fixes live at different layers, though. The relationship-graph fix is
            upstream-able &mdash; the original skill was built for projects where components
            import each other with full paths or through a <Inline>/components/</Inline>{" "}
            directory structure, and our bare-sibling-import pattern was a case it
            hadn&rsquo;t encountered. The fix is generic enough that any project using the
            skill benefits from it. The timestamp-PR fix lives in this repo&rsquo;s CI
            plumbing &mdash; a small tweak that doesn&rsquo;t generalize, but matters because
            the workflow noise was eroding trust in the automation.
          </p>
        </div>
      </section>

    </div>
  )
}
