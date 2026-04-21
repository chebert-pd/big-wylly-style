import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@chebert-pd/ui"
import { ArrowRight } from "lucide-react"

const sections = [
  {
    title: "Typography",
    description: "Type scale, weight system, OpenType features, and font configuration.",
    href: "/gallery/tokens/typography",
  },
  {
    title: "Colors",
    description: "Primitive palettes, semantic color mappings, accessibility values, and a contrast checker tool.",
    href: "/gallery/tokens/colors",
  },
  {
    title: "Surfaces & Elevation",
    description: "Corner radius, elevation shadows, overlay scrims, and glass surface tokens.",
    href: "/gallery/tokens/surfaces",
  },
]

export default function TokensPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="h1">Tokens</h1>
        <p className="p-lg text-muted-foreground max-w-2xl">
          The raw vocabulary of the design system — color primitives, semantic
          mappings, typography, corner radius, elevation, and surface rules.
          Everything a component references.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="group block h-full">
            <Card
              level={1}
              className="h-full transition-shadow hover:shadow-[var(--elevation-floating)]"
            >
              <CardHeader className="pb-5">
                <CardTitle className="flex items-center justify-between gap-2">
                  {section.title}
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
