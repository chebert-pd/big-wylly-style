import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, Badge, Separator } from "@chebert-pd/ui"
import { Code, Palette, ArrowRight } from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────

const devPaths = [
  {
    label: "New repo",
    title: "New Project Setup",
    description:
      "Install @chebert-pd/ui in a fresh Next.js project. Three steps, about five minutes.",
    href: "/gallery/setup",
  },
  {
    label: "Existing repo",
    title: "Existing Project Setup",
    description:
      "Adopt the system in a product that already has live pages. Role-split checklist for the maintainer leading the work.",
    href: "/gallery/migration",
  },
]

const designerPath = [
  {
    step: "01",
    title: "Designer Handbook",
    description:
      "How to use the system day-to-day in product work — AI assistance, the auditor, what to do when something doesn't fit.",
    href: "/gallery/for-designers",
  },
  {
    step: "02",
    title: "System Logic",
    description:
      "The architectural and strategic decisions behind the tokens, surfaces, and rules.",
    href: "/gallery/logic",
  },
  {
    step: "03",
    title: "Tokens",
    description:
      "The raw vocabulary: color, spacing, radius, elevation, and type tokens that every component pulls from.",
    href: "/gallery/tokens",
  },
]

const maintainerExtension = [
  {
    title: "Agentic Skills",
    description:
      "How the design system is made machine-readable so AI generates compliant code by default.",
    href: "/gallery/skills",
  },
  {
    title: "Process",
    description:
      "End-to-end lifecycle for design system changes, including the maintainer/dev split.",
    href: "/gallery/process",
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ElementType
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-muted-foreground" />
        <span className="label-sm text-muted-foreground">{eyebrow}</span>
      </div>
      <h2 className="h2">{title}</h2>
      <p className="p text-muted-foreground">{description}</p>
    </div>
  )
}

function PathCard({
  label,
  title,
  description,
  href,
}: {
  label: string
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card
        level={1}
        className="h-full transition-shadow hover:shadow-[var(--elevation-floating)]"
      >
        <CardHeader className="pb-5">
          <CardTitle className="flex items-center justify-between gap-2">
            {title}
            <Badge variant="brand" className="shrink-0">{label}</Badge>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

function StepCard({
  step,
  title,
  description,
  href,
}: {
  step: string
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card
        level={1}
        className="h-full transition-shadow hover:shadow-[var(--elevation-floating)]"
      >
        <CardHeader className="pb-5">
          <div className="label-sm text-primary mb-2">{step}</div>
          <CardTitle className="flex items-center justify-between gap-2">
            {title}
            <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

function NavCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card
        level={1}
        className="h-full transition-shadow hover:shadow-[var(--elevation-floating)]"
      >
        <CardHeader className="pb-5">
          <CardTitle className="flex items-center justify-between gap-2">
            {title}
            <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GalleryHome() {
  return (
    <div className="max-w-4xl space-y-14 py-2">

      {/* Hero */}
      <div className="flex items-start gap-8">
        <div className="flex-1 space-y-4">
          <Badge variant="default">Design System · 69 components</Badge>
          <h1 className="h1">Big Wylly Style</h1>
          <p className="p-lg text-muted-foreground">
            A component library and design token system built on shadcn/ui, Radix UI, and
            Tailwind CSS v4. Includes OKLCH color primitives, a governance auditor, agentic
            skills for AI-assisted development, and machine-readable component metadata.
          </p>
        </div>
        <img
          src="/hero.gif"
          alt="Big Wylly Style"
          className="w-80 shrink-0 rounded-lg"
        />
      </div>

      <Separator />

      {/* Start here — Developers */}
      <section className="space-y-6">
        <SectionHeading
          icon={Code}
          eyebrow="Start here · Developers"
          title="Pick the path that matches your repo"
          description="Two routes — a fresh project, or a product that already exists."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {devPaths.map((item) => (
            <PathCard key={item.href} {...item} />
          ))}
        </div>
      </section>

      {/* Start here — Designers */}
      <section className="space-y-6">
        <SectionHeading
          icon={Palette}
          eyebrow="Start here · Designers"
          title="Three pages, in this order"
          description="Read these in sequence to understand how the system works and how to use it in product work."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {designerPath.map((item) => (
            <StepCard key={item.href} {...item} />
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <h3 className="h3">Optional continuation · For the maintainer</h3>
            <p className="p text-muted-foreground">
              If you also own the design system itself, these go deeper into how the AI
              integration and change pipeline work.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {maintainerExtension.map((item) => (
              <NavCard key={item.href} {...item} />
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
