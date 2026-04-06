"use client"

import * as React from "react"

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Header,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"
import { EllipsisVertical } from "lucide-react"

const HEADER_ROWS: PropRow[] = [
  { prop: "variant", type: '"sticky" | "fixed"', default: '"sticky"', description: "Sticky pins to the top with bg/border/shadow and condenses on scroll. Fixed is a static header with no background." },
  { prop: "title", type: "string", required: true, description: "Page title rendered as an h1." },
  { prop: "badge", type: "ReactNode", description: "Badge displayed inline next to the title." },
  { prop: "metadata", type: "ReactNode", description: "Metadata below the title (sticky only). Shifts inline when condensed on scroll." },
  { prop: "rightMetadata", type: "ReactNode", description: "Content displayed to the left of the action buttons (e.g. a summary stat or price)." },
  { prop: "actions", type: "ReactNode", description: "Action buttons displayed on the right." },
  { prop: "tabs", type: "ReactNode", description: "Tab navigation rendered below the heading row (sticky only). Use TabsList with variant=\"line\"." },
  { prop: "scrollContainerRef", type: "RefObject<HTMLElement | null>", description: "Ref to the scroll container. Listens to scroll events on that element. Falls back to window when omitted." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

/** Ellipsis icon button that opens the order actions dropdown */
function ActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" iconOnly aria-label="Order actions">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Submit Chargeback</DropdownMenuItem>
        <DropdownMenuItem>Report Fraud</DropdownMenuItem>
        <DropdownMenuItem>Submit Abuse</DropdownMenuItem>
        <DropdownMenuItem>Mark as Passed by Merchant</DropdownMenuItem>
        <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Scrollable demo shell for the default (no-tabs) sticky variant */
function ScrollDemo({
  children,
  label,
}: {
  children: (ref: React.RefObject<HTMLDivElement>) => React.ReactNode
  label: string
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  return (
    <div className="space-y-2">
      <p className="label-sm text-muted-foreground">{label}</p>
      <div
        ref={containerRef}
        className="relative h-64 overflow-y-auto rounded-lg border border-border"
      >
        {children(containerRef as React.RefObject<HTMLDivElement>)}
        <div className="space-y-3 p-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-border-subtle" />
          ))}
        </div>
      </div>
      <p className="p-sm text-muted-foreground">↑ Scroll inside the box to see it condense</p>
    </div>
  )
}

/**
 * Tabs demo needs a different structure: <Tabs> must wrap the scroll container
 * (so Radix context is available to TabsList/TabsContent), but Header must be
 * a *direct* child of the overflow container so sticky positioning works.
 */
const TAB_ITEMS = [
  { value: "overview", label: "Overview" },
  { value: "items",    label: "Items" },
  { value: "history",  label: "History" },
  { value: "notes",    label: "Notes" },
]

function TabsScrollDemo({ label }: { label: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = React.useState("overview")

  return (
    <div className="space-y-2">
      <p className="label-sm text-muted-foreground">{label}</p>

      {/* Mobile: full header visible, select takes the place of the tabs row */}
      <div className="sm:hidden rounded-lg border border-border overflow-hidden">
        <Header
          variant="sticky"
          title="ORD-0123"
          badge={<Badge variant="destructive">Cancelled</Badge>}
          metadata="Month DD, YYYY, 00:00 AM ET"
          rightMetadata="$1,234"
          actions={
            <Button variant="outline" size="md">
              Actions
            </Button>
          }
        />
        <div className="border-t border-border bg-background px-4 py-3">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAB_ITEMS.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3 p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-border-subtle" />
          ))}
        </div>
      </div>

      {/* Desktop: scroll box with Tabs + Header inside */}
      <div className="hidden sm:block">
        <Tabs variant="line" value={activeTab} onValueChange={setActiveTab}>
          <div
            ref={containerRef}
            className="relative h-64 overflow-y-auto rounded-lg border border-border"
          >
            <Header
              variant="sticky"
              title="ORD-0123"
              badge={<Badge variant="destructive">Cancelled</Badge>}
              metadata="Month DD, YYYY, 00:00 AM ET"
              rightMetadata="$1,234"
              actions={<ActionsMenu />}
              tabs={
                <TabsList className="w-full justify-start px-6">
                  {TAB_ITEMS.map((t) => (
                    <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                  ))}
                </TabsList>
              }
              scrollContainerRef={containerRef}
            />
            {TAB_ITEMS.map((t) => (
              <TabsContent key={t.value} value={t.value}>
                {t.value === "overview" ? (
                  <div className="space-y-3 p-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-8 rounded bg-border-subtle" />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 p-sm text-muted-foreground">No {t.label.toLowerCase()}</div>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      <p className="p-sm text-muted-foreground">↑ Scroll inside the box to see it condense</p>
    </div>
  )
}

export default function HeaderGalleryPage() {
  return (
    <div className="space-y-16 pb-16">
      <div>
        <h2 className="h2 mb-1">Header</h2>
        <p className="p text-muted-foreground">
          Page-level header with two variants: sticky (condenses on scroll) and fixed (static, no
          background).
        </p>
      </div>

      {/* ── STICKY ───────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <h3 className="h3">Sticky</h3>

        <ScrollDemo label="Default">
          {(ref) => (
            <Header
              variant="sticky"
              title="ORD-0123"
              badge={<Badge variant="destructive">Cancelled</Badge>}
              metadata="Month DD, YYYY, 00:00 AM ET"
              rightMetadata="$1,234"
              actions={<ActionsMenu />}
              scrollContainerRef={ref}
            />
          )}
        </ScrollDemo>

        <TabsScrollDemo label="With tabs" />
      </section>

      {/* ── FIXED ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="h3">Fixed</h3>
        <div className="rounded-lg border border-border">
          <Header
            variant="fixed"
            title="Settings"
            badge={<Badge variant="destructive">badge</Badge>}
            actions={
              <>
                <Button variant="outline" size="md">
                  Button text
                </Button>
                <Button variant="primary" size="md">
                  Button text
                </Button>
              </>
            }
          />
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Header" rows={HEADER_ROWS} />
      </section>
    </div>
  )
}
