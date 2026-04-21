"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardContent, Badge } from "@chebert-pd/ui"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const TABS_ROWS: PropRow[] = [
  {
    prop: "variant",
    type: '"line" | "pill" | "vertical"',
    default: '"line"',
    description: "Visual style applied to all child TabsList and TabsTrigger elements via context.",
  },
  {
    prop: "size",
    type: '"sm" | "md"',
    default: '"md"',
    description: "Size applied to all child TabsTrigger elements via context.",
  },
  {
    prop: "defaultValue",
    type: "string",
    description: "Initially active tab value when uncontrolled.",
  },
  {
    prop: "value",
    type: "string",
    description: "Controlled active tab value.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    description: "Callback fired when the active tab changes.",
  },
]

const TABS_LIST_ROWS: PropRow[] = [
  {
    prop: "variant",
    type: '"line" | "pill" | "vertical"',
    description: "Overrides the variant inherited from the parent Tabs.",
  },
]

const TABS_TRIGGER_ROWS: PropRow[] = [
  {
    prop: "value",
    type: "string",
    required: true,
    description: "Unique identifier that links this trigger to its corresponding TabsContent.",
  },
  {
    prop: "variant",
    type: '"line" | "pill" | "vertical"',
    description: "Overrides the variant inherited from context.",
  },
  {
    prop: "size",
    type: '"sm" | "md"',
    description: "Overrides the size inherited from context.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Prevents interaction with this tab trigger.",
  },
]

const TABS_CONTENT_ROWS: PropRow[] = [
  {
    prop: "value",
    type: "string",
    required: true,
    description: "Must match the value of the corresponding TabsTrigger.",
  },
  {
    prop: "children",
    type: "ReactNode",
    required: true,
    description: "Content displayed when this tab is active.",
  },
]

const tabItems = [
  "orders",
  "customers",
  "returns",
  "chargebacks",
  "integrations",
  "account",
  "policies",
]

export default function TabsPage() {
  const [value, setValue] = useState("orders")

  return (
    <>
    <Card level={1}>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <h2 className="h2">Tabs</h2>
          <p className="p text-muted-foreground">
            Line, pill, vertical, animated indicator, and mobile fallback.
          </p>
        </div>

        {/* Mobile Select Fallback */}
        <div className="sm:hidden relative">
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full appearance-none rounded-md border border-input bg-card px-3 py-2 pr-8 label-md"
          >
            {tabItems.map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Horizontal Line Variant */}
        <div className="hidden sm:block">
          <Tabs value={value} onValueChange={setValue} variant="line" size="md">
            <TabsList className="border-b border-border-subtle">
              {tabItems.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  <span className="capitalize">{tab}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tabItems.map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="p text-muted-foreground">
                  {tab} content
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Horizontal Line Variant - Small */}
        <div className="hidden sm:block">
          <Tabs value={value} onValueChange={setValue} variant="line" size="sm">
            <TabsList className="border-b border-border-subtle">
              {tabItems.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  <span className="capitalize">{tab}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Pill Variant */}
        <Tabs defaultValue="orders" variant="pill" size="md">
          <TabsList className="gap-1">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize transition-all duration-200 text-muted-foreground"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Pill Variant - Small */}
        <Tabs defaultValue="orders" variant="pill" size="sm">
          <TabsList className="gap-1">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize transition-all duration-200 text-muted-foreground"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Vertical Variant with Badges */}
        <Tabs defaultValue="orders" variant="vertical" size="md" className="flex gap-8">
          <TabsList className="flex-col items-start gap-2 w-fit">
            {tabItems.map((tab, index) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex items-center gap-2 capitalize text-muted-foreground"
              >
                <span>{tab}</span>
                {index === 0 && (
                  <Badge variant="default">
                    12
                  </Badge>
                )}
                {index === 3 && (
                  <Badge variant="destructive">
                    3
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1">
            <div className="p text-muted-foreground">
              Vertical pill tab content
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>

    {/* API Reference */}
    <section className="space-y-6">
      <h2 className="h2">API Reference</h2>
      <PropTable title="Tabs" rows={TABS_ROWS} />
      <PropTable title="TabsList" rows={TABS_LIST_ROWS} />
      <PropTable title="TabsTrigger" rows={TABS_TRIGGER_ROWS} />
      <PropTable title="TabsContent" rows={TABS_CONTENT_ROWS} />
    </section>
    </>
  )
}
