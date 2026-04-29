import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@chebert-pd/ui"
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

export default function SetupPage() {
  return (
    <div className="max-w-3xl space-y-10 py-2">

      {/* Header */}
      <div className="space-y-4">
        <Badge variant="default">Getting Started</Badge>
        <h1 className="h1">Setup</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          How to install and configure <span className="font-[520] text-foreground">@chebert-pd/ui</span> in
          a new Next.js project. Three steps for the install, plus an optional fourth to enable
          the governance auditor.
        </p>
      </div>

      <Separator />

      {/* Prerequisites */}
      <section className="space-y-3">
        <h2 className="h2">Before you start</h2>
        <p className="p text-muted-foreground">
          Your project needs <span className="font-[520] text-foreground">Next.js 15+</span> (16
          recommended), <span className="font-[520] text-foreground">React 18+</span>,{" "}
          <span className="font-[520] text-foreground">Tailwind CSS v4</span>, and{" "}
          <span className="font-[520] text-foreground">shadcn/ui</span> already set up.
          If you ran <Inline>npx shadcn@latest init</Inline> on a fresh Next.js project, you&rsquo;re
          good to go.
        </p>
      </section>

      {/* Steps */}
      <div className="space-y-6">

        <Step number="Step 1" title="Install the package">
          <p className="p text-muted-foreground">
            <Inline>@chebert-pd/ui</Inline> is published to the public npm registry. No
            registry config or authentication is required.
          </p>
          <CodeSnippet>{`npm install @chebert-pd/ui`}</CodeSnippet>
        </Step>

        <Step number="Step 2" title="Tell Next.js to compile the package">
          <p className="p text-muted-foreground">
            The package doesn&rsquo;t ship TypeScript declarations yet (planned for a future
            release). Until it does, add one line to your <Inline>next.config.ts</Inline> so
            Next.js compiles the package&rsquo;s output alongside your own code:
          </p>
          <CodeSnippet title="next.config.ts">{`const nextConfig = {
  transpilePackages: ["@chebert-pd/ui"],
};`}</CodeSnippet>
        </Step>

        <Step number="Step 3" title="Set up your CSS">
          <p className="p text-muted-foreground">
            This is the step people miss. Three lines go into your{" "}
            <Inline>globals.css</Inline>, after your Tailwind and shadcn imports. Each one
            does something different:
          </p>
          <CodeSnippet title="globals.css">{`@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/* 1. Tell Tailwind to scan the package output for classes */
@source "../../node_modules/@chebert-pd/ui/dist";

/* 2. Enable dark mode */
@custom-variant dark (&:is(.dark *));

/* 3. Import design tokens (colors, radius, elevation, typography) */
@import "@chebert-pd/ui/globals.css";`}</CodeSnippet>
          <p className="p text-muted-foreground">
            The <Inline>@source</Inline> path is relative to wherever your{" "}
            <Inline>globals.css</Inline> lives. Adjust the <Inline>../../</Inline> part if
            your file is deeper or shallower in the project.
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
        </Step>

        <Step number="Step 4 (recommended)" title="Enable the governance auditor">
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
        </Step>

      </div>

      <Separator />

      {/* Font */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Font</h2>
          <p className="p text-muted-foreground">
            The design system is built around{" "}
            <a href="https://rsms.me/inter/" className="text-link hover:text-link-hover underline underline-offset-2" target="_blank" rel="noopener noreferrer">Inter</a>.
            Load it however you prefer (next/font, Google Fonts, self-hosted) and set the{" "}
            <Inline>--font-sans</Inline> CSS variable on your <Inline>{"<html>"}</Inline> element:
          </p>
        </div>
        <CodeSnippet title="layout.tsx">{`import localFont from "next/font/local";

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-sans",
});

<html className={inter.variable}>`}</CodeSnippet>
      </section>

      <Separator />

      {/* Usage */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Using components</h2>
          <p className="p text-muted-foreground">
            Everything exports from a single entry point. Import what you need:
          </p>
        </div>
        <CodeSnippet>{`import { Button, Card, CardHeader, CardTitle } from "@chebert-pd/ui";`}</CodeSnippet>
        <p className="p text-muted-foreground">
          Browse the component pages in this gallery to see every component, its variants,
          and how to compose them together.
        </p>
      </section>

      <Separator />

      {/* Dark mode */}
      <section className="space-y-4">
        <h2 className="h2">Dark mode</h2>
        <p className="p text-muted-foreground">
          Toggle dark mode by adding or removing the <Inline>dark</Inline> class on your{" "}
          <Inline>{"<html>"}</Inline> element. All components and tokens respond
          automatically. Use <Inline>next-themes</Inline> or a simple localStorage toggle
          &mdash; whatever fits your app.
        </p>
      </section>

    </div>
  )
}
