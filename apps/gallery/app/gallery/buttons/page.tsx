"use client"

import { Button } from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"
import { Star, Trash, Download, Plus, ArrowRight } from "lucide-react"

const BUTTON_ROWS: PropRow[] = [
  { prop: "variant", type: '"primary" | "destructive" | "outline" | "ghost" | "link"', default: '"primary"', description: 'Visual style. "secondary" is forbidden — use "outline" instead.' },
  { prop: "size", type: '"xs" | "sm" | "md"', default: '"sm"', description: 'Controls padding and font size. sm is the default for most actions. md is reserved for the most important action(s) on the screen (header/top of page). xs is for compact spaces (tables, small cards, lists). lg is forbidden.' },
  { prop: "iconOnly", type: "boolean", default: "false", description: "Collapses padding to make a square icon button. Use when the button contains only an icon." },
  { prop: "asChild", type: "boolean", default: "false", description: "Merges button behaviour onto the child element (e.g. a Next.js Link). Uses Radix Slot." },
  { prop: "disabled", type: "boolean", description: "Disables the button and applies reduced opacity." },
  { prop: "onClick", type: "() => void", description: "Click handler. Inherited from HTML button." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

const variants = ["primary", "outline", "ghost", "destructive", "link"] as const
const sizes = ["xs", "sm", "md"] as const

export default function ButtonsPage() {
  return (
    <div className="space-y-10">
      <h1 className="h1">Buttons</h1>

      {/* -------------------------------- */}
      {/* Variants */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Variants</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Sizes */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Sizes</h2>
        <p className="p-sm text-muted-foreground max-w-2xl">
          sm is the default. md is reserved for the most important action(s) on
          the screen (header / top of page). xs is for compact spaces like tables,
          small cards, and lists. lg is forbidden.
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <Button variant="outline" size="md">md — hero action</Button>
          <Button variant="outline" size="sm">sm — default</Button>
          <Button variant="outline" size="xs">xs — compact</Button>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* With Icons */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">With Icons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">
            <Plus className="size-4" />
            Create
          </Button>
          <Button variant="outline">
            <Download className="size-4" />
            Export
          </Button>
          <Button variant="destructive">
            <Trash className="size-4" />
            Delete
          </Button>
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Icon Only */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Icon Only</h2>
        <div className="flex flex-wrap items-end gap-4">
          {sizes.map((size) => (
            <Button key={size} variant="outline" size={size} iconOnly>
              <Star className="size-4" />
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {variants.filter((v) => v !== "link").map((variant) => (
            <Button key={variant} variant={variant} iconOnly>
              <Star className="size-4" />
            </Button>
          ))}
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Disabled */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Disabled</h2>
        <div className="flex flex-wrap items-center gap-4">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} disabled>
              {variant}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {variants.filter((v) => v !== "link").map((variant) => (
            <Button key={variant} variant={variant} iconOnly disabled>
              <Star className="size-4" />
            </Button>
          ))}
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Primary + Cancel Pattern */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Primary + Cancel</h2>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save Changes</Button>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Destructive Confirmation */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Destructive Confirmation</h2>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">
            <Trash className="size-4" />
            Delete Account
          </Button>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* API Reference */}
      {/* -------------------------------- */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Button" rows={BUTTON_ROWS} />
      </section>
    </div>
  )
}
