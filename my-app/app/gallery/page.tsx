import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Box, Layers, Sparkles, ArrowRight } from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────

const startHere = [
  {
    step: "01",
    title: "Tokens",
    description:
      "The raw vocabulary: color, spacing, radius, elevation, and type tokens that every component pulls from.",
    href: "/gallery/tokens",
  },
  {
    step: "02",
    title: "System Logic",
    description:
      "The rules behind the system — surface alternation, border rendering, and elevation relationships.",
    href: "/gallery/logic",
  },
]

const components = [
  {
    title: "Core",
    description: "Foundational atoms: Card, Separator, Label, Link, ModalBase.",
    href: "/gallery/core",
  },
  {
    title: "Buttons",
    description: "Primary, outline, ghost, destructive, and link variants with size and icon support.",
    href: "/gallery/buttons",
  },
  {
    title: "Badges",
    description: "Status indicators, metadata labels, delta indicators, and avatar groups.",
    href: "/gallery/badge",
  },
  {
    title: "Forms",
    description: "Field, Input, Select, Combobox, Checkbox, Switch, Slider, and multi-step patterns.",
    href: "/gallery/forms",
  },
  {
    title: "Date Picker",
    description: "Single-date and range pickers with popover calendar and keyboard navigation.",
    href: "/gallery/date-picker",
  },
  {
    title: "Tables",
    description: "Static tables with structured column layouts.",
    href: "/gallery/tables",
  },
  {
    title: "Data Table",
    description: "Sortable, filterable, and paginated tables with expandable rows.",
    href: "/gallery/data-table",
  },
  {
    title: "Tabs",
    description: "Line and pill variants, vertical tabs, and responsive wrapping behavior.",
    href: "/gallery/tabs",
  },
  {
    title: "Toggle",
    description: "Toggle and ToggleGroup primitives for binary and multi-option selection.",
    href: "/gallery/toggle",
  },
  {
    title: "Accordions",
    description: "Collapsible content sections with icon, subtitle, badge, and size options.",
    href: "/gallery/accordions",
  },
]

const structural = [
  {
    title: "Dialog",
    description: "Modal dialogs with structured header, body, and footer regions.",
    href: "/gallery/overlays/dialog",
  },
  {
    title: "Sheet",
    description: "Slide-over panels for contextual editing and side drawers.",
    href: "/gallery/overlays/sheet",
  },
  {
    title: "Overlay Background",
    description: "Backdrop blur, glass-frame surfaces, and overlay layering.",
    href: "/gallery/overlays/background",
  },
  {
    title: "Command Palette",
    description: "Keyboard-driven command interface with grouped results and search.",
    href: "/gallery/command-palette",
  },
  {
    title: "Header",
    description: "Page header with title, breadcrumb, action slots, and scroll behavior.",
    href: "/gallery/header",
  },
  {
    title: "Sidebar",
    description: "Responsive navigation sidebar with collapsible sections and active state.",
    href: "/gallery/sidebar",
  },
]

const patterns = [
  {
    title: "Stats",
    description: "Stat cards and grids with trends, delta badges, and action footers.",
    href: "/gallery/stats",
  },
  {
    title: "Metric Panel",
    description: "Tabbed metric display with chart integration and drill-down rows.",
    href: "/gallery/modules/metric-panel",
  },
  {
    title: "Empty State",
    description: "Empty, error, and no-results compositions with icon, copy, and CTA.",
    href: "/gallery/empty-state",
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
      <div className="space-y-4">
        <Badge variant="secondary">Design System · 37 components</Badge>
        <h1 className="h1">Big Wylly Style</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          A production-grade component library built on shadcn/ui, Radix UI, and Tailwind CSS v4.
          New to the system? Start with the three foundation pages below — everything else builds on them.
        </p>
      </div>

      <Separator />

      {/* Start here */}
      <section className="space-y-6">
        <SectionHeading
          icon={BookOpen}
          eyebrow="Start here"
          title="Understand the system first"
          description="Two pages that explain how the design language is built, before you use any components."
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

      {/* Components */}
      <section className="space-y-6">
        <SectionHeading
          icon={Box}
          eyebrow="Components"
          title="UI components"
          description="Atoms, molecules, and organisms — the building blocks you'll compose into every interface."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {components.map((item) => (
            <NavCard key={item.href} {...item} />
          ))}
        </div>
      </section>

      {/* Structural */}
      <section className="space-y-6">
        <SectionHeading
          icon={Layers}
          eyebrow="Overlays & Navigation"
          title="Structural components"
          description="Components that control page layout, flow, and contextual surfaces."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {structural.map((item) => (
            <NavCard key={item.href} {...item} />
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
        <div className="grid gap-4 md:grid-cols-3">
          {patterns.map((item) => (
            <NavCard key={item.href} {...item} />
          ))}
        </div>
      </section>

    </div>
  )
}
