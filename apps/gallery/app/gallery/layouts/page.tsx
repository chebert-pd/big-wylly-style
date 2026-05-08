"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Header,
  PageLayout,
  Stack,
} from "@chebert-pd/ui"

import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const PAGE_LAYOUT_ROWS: PropRow[] = [
  {
    prop: "variant",
    type: '"stack" | "two-column" | "full"',
    default: '"stack"',
    description:
      "Page structure. stack = vertical column with optional Body slot for constrained content. two-column = main + aside flex row that collapses on narrow viewports. full = no max-width container; all children full-bleed.",
  },
  {
    prop: "size",
    type: '"sm" | "md" | "lg" | "xl" | "full"',
    default: '"lg"',
    description:
      "Container max-width preset. Mapped to Tailwind container scale (3xl=768, 5xl=1024, 7xl=1280, 8xl=1440). Shared with Header and PageContainer descendants via context.",
  },
  {
    prop: "gap",
    type: '"none" | "sm" | "md" | "lg"',
    default: '"md"',
    description: "Vertical gap between top-level children, and horizontal gap between Main/Aside in two-column.",
  },
  {
    prop: "ratio",
    type: '"1:1" | "2:1" | "3:1"',
    default: '"2:1"',
    description: "Two-column only — main:aside flex-grow ratio.",
  },
  {
    prop: "asideSide",
    type: '"left" | "right"',
    default: '"right"',
    description: "Two-column only — which side the aside renders on. Ignored on mobile (single-column stack).",
  },
]

const PAGE_CONTAINER_ROWS: PropRow[] = [
  {
    prop: "size",
    type: '"sm" | "md" | "lg" | "xl" | "full"',
    description:
      "Max-width preset. sm=max-w-3xl (768px), md=max-w-5xl (1024px), lg=max-w-7xl (1280px), xl=max-w-8xl (1440px, custom token), full=no constraint. When omitted, reads from the surrounding PageLayout's size, then falls back to lg.",
  },
]

const STACK_ROWS: PropRow[] = [
  {
    prop: "gap",
    type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',
    default: '"md"',
    description: "Vertical gap between children: none=0, xs=8px, sm=16px, md=24px, lg=32px, xl=48px.",
  },
]

function FillerCard({ title, lines = 3 }: { title: string; lines?: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="xs">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded-sm bg-muted"
              style={{ width: `${60 + ((i * 23) % 35)}%` }}
              aria-hidden
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

function DemoFrame({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="h3">{label}</h3>
      <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-background">
        {children}
      </div>
    </section>
  )
}

export default function LayoutsPage() {
  return (
    <Stack gap="lg" className="p-6">
      <header className="space-y-2">
        <h1 className="h1">Layouts</h1>
        <p className="p text-muted-foreground max-w-3xl">
          Standard page layouts for consistency. Header chrome stays full-bleed; body content
          (PageLayout.Body, .Main, .Aside) is constrained by a shared max-width that PageLayout
          propagates to Header automatically.
        </p>
      </header>

      <DemoFrame label="Stack — default vertical layout (size=lg)">
        <PageLayout variant="stack" size="lg">
          <Header
            variant="fixed"
            title="Orders"
            metadata="Auto-flagged review queue"
          />
          <PageLayout.Body>
            <Stack gap="md">
              <FillerCard title="Pending review (12)" lines={3} />
              <FillerCard title="Manually flagged (4)" lines={2} />
              <FillerCard title="Auto-approved (208)" lines={2} />
            </Stack>
          </PageLayout.Body>
        </PageLayout>
      </DemoFrame>

      <DemoFrame label="Two-column 2:1, aside on the right (default)">
        <PageLayout variant="two-column" size="lg" ratio="2:1">
          <Header variant="fixed" title="Order #A-1042" />
          <PageLayout.Main>
            <Stack gap="md">
              <FillerCard title="Transaction summary" lines={4} />
              <FillerCard title="Customer history" lines={5} />
            </Stack>
          </PageLayout.Main>
          <PageLayout.Aside>
            <Stack gap="md">
              <FillerCard title="Risk signals" lines={3} />
              <FillerCard title="Related orders" lines={3} />
            </Stack>
          </PageLayout.Aside>
        </PageLayout>
      </DemoFrame>

      <DemoFrame label="Two-column 3:1, aside on the left">
        <PageLayout variant="two-column" size="lg" ratio="3:1" asideSide="left">
          <Header variant="fixed" title="Reports" />
          <PageLayout.Main>
            <FillerCard title="Daily volume" lines={6} />
          </PageLayout.Main>
          <PageLayout.Aside>
            <Stack gap="sm">
              <FillerCard title="Filters" lines={4} />
            </Stack>
          </PageLayout.Aside>
        </PageLayout>
      </DemoFrame>

      <DemoFrame label="Two-column 1:1 — equal columns">
        <PageLayout variant="two-column" size="lg" ratio="1:1">
          <Header variant="fixed" title="Compare" />
          <PageLayout.Main>
            <FillerCard title="Period A" lines={4} />
          </PageLayout.Main>
          <PageLayout.Aside>
            <FillerCard title="Period B" lines={4} />
          </PageLayout.Aside>
        </PageLayout>
      </DemoFrame>

      <DemoFrame label="Narrow stack (size=sm) — for forms / settings">
        <PageLayout variant="stack" size="sm">
          <Header variant="fixed" title="Account settings" />
          <PageLayout.Body>
            <Stack gap="md">
              <FillerCard title="Profile" lines={5} />
              <FillerCard title="Notifications" lines={4} />
            </Stack>
          </PageLayout.Body>
        </PageLayout>
      </DemoFrame>

      <DemoFrame label="Full-bleed (variant=full)">
        <PageLayout variant="full">
          <Header variant="fixed" title="Builder" contentSize="full" />
          <div className="bg-secondary p-6 text-muted-foreground p-sm">
            Canvas-style page — no max-width constraint. Use for builders, full-screen tables,
            or any content that genuinely needs the entire viewport.
          </div>
        </PageLayout>
      </DemoFrame>

      <PropTable title="PageLayout props" rows={PAGE_LAYOUT_ROWS} />
      <PropTable title="PageContainer props" rows={PAGE_CONTAINER_ROWS} />
      <PropTable title="Stack props" rows={STACK_ROWS} />
    </Stack>
  )
}
