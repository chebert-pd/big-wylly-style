import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, Badge, Separator } from "@wyllo/ui"
import { BookOpen, Sparkles, ArrowRight } from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────

const startHere = [
  {
    step: "01",
    title: "Setup",
    description:
      "How to install and configure @wyllo/ui in a Next.js project. Three steps, about five minutes.",
    href: "/gallery/setup",
  },
  {
    step: "02",
    title: "System Logic",
    description:
      "The rules behind the system — surface alternation, border rendering, and elevation relationships.",
    href: "/gallery/logic",
  },
  {
    step: "03",
    title: "Tokens",
    description:
      "The raw vocabulary: color, spacing, radius, elevation, and type tokens that every component pulls from.",
    href: "/gallery/tokens",
  },
  {
    step: "04",
    title: "Agentic Skills",
    description:
      "How we make the design system machine-readable so AI can query it, audit it, and compose with it.",
    href: "/gallery/skills",
  },
]

const patterns = [
  {
    title: "Data Table",
    description: "Sortable, filterable, paginated tables with external toolbar and filter panel.",
    href: "/gallery/data-table",
  },
  {
    title: "Empty State",
    description: "Empty, error, and no-results compositions with icon, copy, and CTA.",
    href: "/gallery/empty-state",
  },
  {
    title: "Forms",
    description: "Field, Input, Select, Combobox, Checkbox, Switch, Slider, and multi-step patterns.",
    href: "/gallery/forms",
  },
  {
    title: "Full Screen Sheet",
    description: "Full-viewport overlay with scroll-condensing header and sticky footer.",
    href: "/gallery/full-screen-panel",
  },
  {
    title: "Header",
    description: "Page header with title, breadcrumb, action slots, and scroll behavior.",
    href: "/gallery/header",
  },
  {
    title: "Metric Panel",
    description: "Tabbed metric display with chart integration and drill-down rows.",
    href: "/gallery/modules/metric-panel",
  },
  {
    title: "Side Panel",
    description: "Push-content panel with mobile sheet fallback and auto-close on navigation.",
    href: "/gallery/side-panel",
  },
  {
    title: "Sidebar",
    description: "Responsive navigation sidebar with collapsible sections, cookie persistence, and mobile sheet.",
    href: "/gallery/sidebar",
  },
  {
    title: "Stats",
    description: "Stat cards and grids with trends, delta badges, and action footers.",
    href: "/gallery/stats",
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
      <h2 className="h3">{title}</h2>
      <p className="p text-muted-foreground">{description}</p>
    </div>
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
          <Badge variant="default">Design System · 64 components</Badge>
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

      {/* Start here */}
      <section className="space-y-6">
        <SectionHeading
          icon={BookOpen}
          eyebrow="Start here"
          title="Understand the system first"
          description="Understand how the design language is built before you use any components."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {startHere.map((item) => (
            <Link key={item.href} href={item.href} className="group block h-full">
              <Card
                level={1}
                className="h-full transition-shadow hover:shadow-[var(--elevation-floating)]"
              >
                <CardHeader className="pb-5">
                  <div className="label-sm text-primary mb-2">{item.step}</div>
                  <CardTitle className="flex items-center justify-between gap-2">
                    {item.title}
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Composed patterns */}
      <section className="space-y-6">
        <SectionHeading
          icon={Sparkles}
          eyebrow="Composed Patterns"
          title="Full compositions"
          description="High-level patterns assembled from multiple components — ready to drop into a page."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patterns.map((item) => (
            <NavCard key={item.href} {...item} />
          ))}
        </div>
      </section>

    </div>
  )
}
