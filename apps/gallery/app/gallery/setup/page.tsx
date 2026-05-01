"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@chebert-pd/ui"
import { CodeSnippet } from "@/app/gallery/_components/code-block"

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <Card level={1}>
      <CardHeader>
        <Badge variant="default" className="w-fit">{number}</Badge>
        <CardTitle className="mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}

function Inline({ children }: { children: React.ReactNode }) {
  return <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">{children}</code>
}

function CssStepBody() {
  return (
    <>
      <p className="p text-muted-foreground">
        This is the step people miss. Three lines go into your{" "}
        <Inline>globals.css</Inline>, after your Tailwind imports. Each one does
        something different:
      </p>
      <CodeSnippet title="globals.css">{`@import "tailwindcss";
@import "tw-animate-css";

/* 1. Tell Tailwind to scan the package output for classes */
@source "../node_modules/@chebert-pd/ui/dist";

/* 2. Enable dark mode */
@custom-variant dark (&:is(.dark *));

/* 3. Import design tokens (colors, radius, elevation, typography) */
@import "@chebert-pd/ui/globals.css";`}</CodeSnippet>
      <p className="p text-muted-foreground">
        The <Inline>@source</Inline> path is relative to wherever your{" "}
        <Inline>globals.css</Inline> lives &mdash; walk up to the directory that
        contains <Inline>node_modules</Inline>. In a flat repo with{" "}
        <Inline>src/index.css</Inline> that&rsquo;s{" "}
        <Inline>../node_modules/...</Inline>; with <Inline>app/globals.css</Inline>{" "}
        (Next.js App Router) it&rsquo;s <Inline>../../node_modules/...</Inline>. In a
        monorepo where <Inline>node_modules</Inline> is hoisted to the workspace
        root, walk up further &mdash; usually{" "}
        <Inline>../../../node_modules/...</Inline>.
      </p>
      <Card level={2} className="mt-2">
        <CardContent>
          <p className="p-sm text-muted-foreground">
            <span className="font-[520] text-foreground">Why is @source needed?</span>{" "}
            Tailwind only generates CSS for classes it finds in your project files. The
            components use classes like <Inline>bg-card</Inline> and{" "}
            <Inline>rounded-xl</Inline> internally, but they live inside{" "}
            <Inline>node_modules</Inline> where Tailwind doesn&rsquo;t look by default.
            The <Inline>@source</Inline> line points at the package&rsquo;s built{" "}
            <Inline>dist/</Inline> directory so Tailwind can scan it.
          </p>
        </CardContent>
      </Card>
    </>
  )
}

function GovernanceBody() {
  return (
    <p className="p text-muted-foreground">
      The auditor ships inside the same package. There&rsquo;s nothing more to install
      &mdash; it&rsquo;s already in your <Inline>node_modules</Inline>. To turn it on
      for your project, follow the{" "}
      <a href="/gallery/skills/governance-auditor/setup" className="underline">
        consumer setup guide
      </a>
      : add a 5-line workflow file, capture a baseline, and pre-existing violations
      stop blocking PRs from day one.
    </p>
  )
}

export default function SetupPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      {/* Header */}
      <div className="space-y-4">
        <Badge variant="default">Getting Started</Badge>
        <h1 className="h1">New Project Setup</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          How to install and configure <span className="font-[520] text-foreground">@chebert-pd/ui</span>{" "}
          in a new React project. Pick your bundler below &mdash; most steps are identical;
          only Step 2, font loading, and dark-mode wiring differ.
        </p>
      </div>

      <Tabs defaultValue="vite" variant="line" className="space-y-10">
        <TabsList>
          <TabsTrigger value="vite">Vite</TabsTrigger>
          <TabsTrigger value="nextjs">Next.js</TabsTrigger>
        </TabsList>

        {/* Prerequisites */}
        <section className="space-y-3">
          <h2 className="h2">Before you start</h2>
          <TabsContent value="vite">
            <p className="p text-muted-foreground">
              Your project needs <span className="font-[520] text-foreground">Vite 7+</span>,{" "}
              <span className="font-[520] text-foreground">React 19</span>,{" "}
              <span className="font-[520] text-foreground">Tailwind CSS v4</span> with the{" "}
              <Inline>@tailwindcss/vite</Inline> plugin, and{" "}
              <span className="font-[520] text-foreground">shadcn/ui</span> already set up.
              If you ran <Inline>npx shadcn@latest init</Inline> on a fresh Vite project and
              picked Vite as the framework, you&rsquo;re good to go.
            </p>
          </TabsContent>
          <TabsContent value="nextjs">
            <p className="p text-muted-foreground">
              Your project needs <span className="font-[520] text-foreground">Next.js 15+</span>{" "}
              (16 recommended), <span className="font-[520] text-foreground">React 18+</span>,{" "}
              <span className="font-[520] text-foreground">Tailwind CSS v4</span>, and{" "}
              <span className="font-[520] text-foreground">shadcn/ui</span> already set up.
              If you ran <Inline>npx shadcn@latest init</Inline> on a fresh Next.js project,
              you&rsquo;re good to go.
            </p>
          </TabsContent>
        </section>

        {/* Steps */}
        <div className="space-y-6">

          <Step number="Step 1" title="Install the package">
            <p className="p text-muted-foreground">
              <Inline>@chebert-pd/ui</Inline> is published to the public npm registry. No
              registry config or authentication is required.
            </p>
            <CodeSnippet>{`npm install @chebert-pd/ui`}</CodeSnippet>
            <p className="p text-muted-foreground">
              Install peer dependencies as you use components &mdash; missing peers
              produce a clear bundler error naming the exact package. The package is
              shipped with subpath exports and per-component chunks, so unused
              components don&rsquo;t pull in their peers (see{" "}
              <a href="#importing-components" className="underline">Importing components</a>{" "}
              below).
            </p>
          </Step>

          <TabsContent value="vite">
            <Card tone="ghost">
              <CardHeader>
                <Badge variant="default" className="w-fit">Note</Badge>
                <CardTitle className="mt-2">No bundler config needed for Vite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="p text-muted-foreground">
                  Vite resolves and bundles ESM packages from <Inline>node_modules</Inline>{" "}
                  automatically, so there&rsquo;s nothing to add to your{" "}
                  <Inline>vite.config.ts</Inline>. Next.js needs{" "}
                  <Inline>transpilePackages</Inline> because it skips transformation of{" "}
                  <Inline>node_modules</Inline> by default; Vite pre-bundles dependencies on
                  dev startup, so package code goes through the same pipeline as your own
                  source. Skip to Step 3.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nextjs">
            <Step number="Step 2" title="Tell Next.js to compile the package">
              <p className="p text-muted-foreground">
                The package doesn&rsquo;t ship TypeScript declarations yet (planned for a
                future release). Until it does, add one line to your{" "}
                <Inline>next.config.ts</Inline> so Next.js compiles the package&rsquo;s output
                alongside your own code:
              </p>
              <CodeSnippet title="next.config.ts">{`const nextConfig = {
  transpilePackages: ["@chebert-pd/ui"],
};`}</CodeSnippet>
            </Step>
          </TabsContent>

          <TabsContent value="vite">
            <Step number="Step 2" title="Set up your CSS">
              <CssStepBody />
            </Step>
          </TabsContent>
          <TabsContent value="nextjs">
            <Step number="Step 3" title="Set up your CSS">
              <CssStepBody />
            </Step>
          </TabsContent>

          <TabsContent value="vite">
            <Step number="Step 3 (recommended)" title="Enable the governance auditor">
              <GovernanceBody />
            </Step>
          </TabsContent>
          <TabsContent value="nextjs">
            <Step number="Step 4 (recommended)" title="Enable the governance auditor">
              <GovernanceBody />
            </Step>
          </TabsContent>

        </div>

        <Separator />

        {/* Font */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="h2">Font</h2>
            <p className="p text-muted-foreground">
              The design system is built around{" "}
              <a href="https://rsms.me/inter/" className="text-link hover:text-link-hover underline underline-offset-2" target="_blank" rel="noopener noreferrer">Inter</a>.
              Load it however you prefer and set the <Inline>--font-sans</Inline> CSS variable.
            </p>
          </div>
          <TabsContent value="vite" className="space-y-4">
            <p className="p text-muted-foreground">
              The cleanest path is <Inline>@fontsource-variable/inter</Inline> &mdash; one
              install, one import, one CSS variable:
            </p>
            <CodeSnippet>{`npm install @fontsource-variable/inter`}</CodeSnippet>
            <CodeSnippet title="src/main.tsx">{`import "@fontsource-variable/inter"`}</CodeSnippet>
            <CodeSnippet title="globals.css">{`:root {
  --font-sans: "Inter Variable", system-ui, sans-serif;
}`}</CodeSnippet>
            <p className="p-sm text-muted-foreground">
              Prefer Google Fonts or self-hosting? Drop a <Inline>{"<link>"}</Inline> in{" "}
              <Inline>index.html</Inline> and set <Inline>--font-sans</Inline> to match.
            </p>
          </TabsContent>
          <TabsContent value="nextjs">
            <CodeSnippet title="layout.tsx">{`import localFont from "next/font/local";

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-sans",
});

<html className={inter.variable}>`}</CodeSnippet>
          </TabsContent>
        </section>

        <Separator />

        {/* Usage */}
        <section id="importing-components" className="space-y-4">
          <div className="space-y-2">
            <h2 className="h2">Importing components</h2>
            <p className="p text-muted-foreground">
              The package ships with two import styles. Pick whichever you prefer for
              your project &mdash; mixing them in the same app is fine.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="h4">Subpath imports (recommended)</h3>
            <p className="p text-muted-foreground">
              One subpath per component. The bundler only loads chunks for components
              you actually import, and you only need to install the peer dependencies
              for the components you use.
            </p>
          </div>
          <CodeSnippet>{`import { Button } from "@chebert-pd/ui/button";
import { Card, CardHeader, CardTitle } from "@chebert-pd/ui/card";`}</CodeSnippet>

          <div className="space-y-2">
            <h3 className="h4">Barrel import</h3>
            <p className="p text-muted-foreground">
              Single entry point that re-exports every component. Convenient for quick
              prototyping; modern bundlers tree-shake unused exports, but to be safe
              install the full peer-dep list when using the barrel.
            </p>
          </div>
          <CodeSnippet>{`import { Button, Card, CardHeader, CardTitle } from "@chebert-pd/ui";`}</CodeSnippet>

          <p className="p text-muted-foreground">
            Browse the component pages in this gallery to see every component, its
            variants, and how to compose them together.
          </p>
        </section>

        <Separator />

        {/* Dark mode */}
        <section className="space-y-4">
          <h2 className="h2">Dark mode</h2>
          <p className="p text-muted-foreground">
            Toggle dark mode by adding or removing the <Inline>dark</Inline> class on your{" "}
            <Inline>{"<html>"}</Inline> element. All components and tokens respond
            automatically.
          </p>
          <TabsContent value="vite" className="space-y-4">
            <p className="p text-muted-foreground">
              A small custom hook with localStorage persistence handles the typical case:
            </p>
            <CodeSnippet title="src/hooks/use-theme.ts">{`import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") ?? "light"
  )
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])
  return { theme, setTheme }
}`}</CodeSnippet>
            <p className="p text-muted-foreground">
              To prevent a flash of light mode on first paint, run a tiny script in{" "}
              <Inline>index.html</Inline> before React hydrates:
            </p>
            <CodeSnippet title="index.html">{`<script>
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark")
  }
</script>`}</CodeSnippet>
          </TabsContent>
          <TabsContent value="nextjs" className="space-y-4">
            <p className="p text-muted-foreground">
              Use <Inline>next-themes</Inline> for class management, SSR-safe defaults, and
              system-preference detection. Wrap your app at the root:
            </p>
            <CodeSnippet title="app/providers.tsx">{`"use client"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>
}`}</CodeSnippet>
          </TabsContent>
        </section>

      </Tabs>

    </div>
  )
}
