"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionGroup,
  Card,
  CardContent,
  Badge,
  Button,
} from "@wyllo/ui"
import { FileText, Folder, Settings, Users, BarChart3 } from "lucide-react"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const ACCORDION_ROWS: PropRow[] = [
  {
    prop: "type",
    type: '"single" | "multiple"',
    default: '"single"',
    description: "Whether one or multiple items can be expanded at a time.",
  },
  {
    prop: "collapsible",
    type: "boolean",
    default: "true",
    description: "When type is single, allows closing the open item.",
  },
  {
    prop: "variant",
    type: '"line" | "card" | "contained"',
    default: '"line"',
    description: "Visual treatment. Line shows dividers only; card and contained add border, radius, and background.",
  },
  {
    prop: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Controls padding, typography scale, and spacing of triggers and content.",
  },
  {
    prop: "surface",
    type: "0 | 1",
    default: "0",
    description: "Surface depth hint for card/contained variants. Drives data-surface attribute for contextual styling.",
  },
  {
    prop: "columns",
    type: "1 | 2",
    default: "1",
    description: "Enables a two-column grid layout when set to 2.",
  },
  {
    prop: "autoCollapse",
    type: "boolean",
    default: "true",
    description: "When true, forces single-select behavior regardless of the type prop.",
  },
  {
    prop: "masonry",
    type: "boolean",
    default: "false",
    description: "Switches from CSS grid to CSS columns layout for variable-height items.",
  },
  {
    prop: "defaultValue",
    type: "string | string[]",
    description: "Initially expanded item value(s) when uncontrolled.",
  },
  {
    prop: "value",
    type: "string | string[]",
    description: "Controlled expanded item value(s).",
  },
  {
    prop: "onValueChange",
    type: "(value: string | string[]) => void",
    description: "Callback fired when the expanded state changes.",
  },
]

const ACCORDION_ITEM_ROWS: PropRow[] = [
  {
    prop: "value",
    type: "string",
    required: true,
    description: "Unique identifier for this item within the accordion.",
  },
  {
    prop: "variant",
    type: '"line" | "card"',
    description: "Overrides the variant inherited from the parent Accordion.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Prevents the item from being expanded or collapsed.",
  },
]

const ACCORDION_TRIGGER_ROWS: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    required: true,
    description: "Primary label content of the trigger.",
  },
  {
    prop: "icon",
    type: "ReactNode",
    description: "Optional leading icon rendered before the label.",
  },
  {
    prop: "chevronPosition",
    type: '"left" | "right"',
    default: '"right"',
    description: "Which side the expand/collapse chevron appears on.",
  },
  {
    prop: "layout",
    type: '"default" | "stat"',
    default: '"default"',
    description: 'Layout mode. "stat" renders a stacked label + data value layout for dashboard metrics.',
  },
  {
    prop: "label",
    type: "ReactNode",
    description: 'Secondary label rendered above the main content in "stat" layout.',
  },
  {
    prop: "subtitle",
    type: "ReactNode",
    description: "Muted text rendered below the primary label.",
  },
  {
    prop: "badge",
    type: "ReactNode",
    description: 'Badge element shown alongside the chevron in "stat" layout.',
  },
  {
    prop: "dataSize",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Typography scale for the data value in "stat" layout.',
  },
]

const ACCORDION_CONTENT_ROWS: PropRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    required: true,
    description: "Content revealed when the parent item is expanded. Accepts any content including text, media, forms, tables, or nested accordions.",
  },
]

const ACCORDION_GROUP_ROWS: PropRow[] = [
  {
    prop: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Controls padding and typography scale for the group header, footer, and child accordion.",
  },
  {
    prop: "headerTitle",
    type: "ReactNode",
    description: "Title displayed in the group header.",
  },
  {
    prop: "headerSubtitle",
    type: "ReactNode",
    description: "Smaller muted text below the header title.",
  },
  {
    prop: "headerDescription",
    type: "ReactNode",
    description: "Body text below the header title.",
  },
  {
    prop: "headerAction",
    type: "ReactNode",
    description: "Slot for a button or action element in the header, aligned to the right.",
  },
  {
    prop: "headerTitleLevel",
    type: '"h1" | "h2" | "h3"',
    description: "Override the heading element used for the header title.",
  },
  {
    prop: "footerDescription",
    type: "ReactNode",
    description: "Text displayed in the group footer area.",
  },
  {
    prop: "footerAction",
    type: "ReactNode",
    description: "Slot for a button or action element in the footer, aligned to the right.",
  },
]

export default function AccordionsPage() {
  return (
    <div className="space-y-20">

      {/* ===================================================== */}
      {/* PAGE HEADER + VARIANTS OVERVIEW */}
      {/* ===================================================== */}
      <section className="space-y-10">
        <div className="space-y-4">
          <h1 className="h1">Accordion</h1>
          <div className="space-y-2">
            <h2 className="h2">Variants</h2>
            <p className="p text-muted-foreground">
              Accordions have versatility built into them, with optionality for icons,
              chevron position, subtitles, badges, sizing, and depth.
            </p>
          </div>
        </div>

        <div className="space-y-10">

          {/* LINE VARIANT */}
          <div className="space-y-4">
            <h3 className="h3">Line</h3>

            <Accordion type="single" collapsible size="sm">
              <AccordionItem value="line-sm">
                <AccordionTrigger>Size sm</AccordionTrigger>
                <AccordionContent>
                  Small size uses label-sm and p-sm for text.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible size="md">
              <AccordionItem value="line-md">
                <AccordionTrigger>
                  Size md <Badge variant="default">badge</Badge>
                </AccordionTrigger>
                <AccordionContent>
                  Medium size uses label-md and p for content.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible size="lg">
              <AccordionItem value="line-lg">
                <AccordionTrigger>
                  Size lg
                </AccordionTrigger>
                <AccordionContent>
                  Size large uses label-lg and p for text. Spacing increases proportionally.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* INDIVIDUAL CARD VARIANT */}
          <div className="space-y-4">
            <h3 className="h3">Individual Card</h3>

            <Card level={1}>
              <CardContent className="p-0">
                <Accordion type="single" collapsible size="sm">
                  <AccordionItem value="card-sm">
                    <AccordionTrigger>Size sm</AccordionTrigger>
                    <AccordionContent>
                      Small card accordion.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card level={1}>
              <CardContent className="p-0">
                <Accordion type="single" collapsible size="md">
                  <AccordionItem value="card-md">
                    <AccordionTrigger>
                      Size md <Badge variant="default">badge</Badge>
                    </AccordionTrigger>
                    <AccordionContent>
                      Medium card accordion.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card level={1}>
              <CardContent className="p-0">
                <Accordion type="single" collapsible size="lg">
                  <AccordionItem value="card-lg">
                    <AccordionTrigger>
                      Size lg
                    </AccordionTrigger>
                    <AccordionContent>
                      Large card accordion.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* GROUP CARD VARIANT */}
          <div className="space-y-4">
            <h3 className="h3">Group Card</h3>

            <AccordionGroup type="single" collapsible size="md">
              <AccordionItem value="group-docs">
                <AccordionTrigger icon={<FileText className="size-4 text-muted-foreground" />} subtitle="Manage your files">
                  Documents
                </AccordionTrigger>
                <AccordionContent>
                  View, upload, and organize all your documents in one place.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="group-projects">
                <AccordionTrigger icon={<Folder className="size-4 text-muted-foreground" />} subtitle="Organize your work">
                  Projects
                </AccordionTrigger>
                <AccordionContent>
                  Group initiatives and manage workflows.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="group-settings">
                <AccordionTrigger icon={<Settings className="size-4 text-muted-foreground" />} subtitle="Customize your experience">
                  Settings
                </AccordionTrigger>
                <AccordionContent>
                  Configure preferences and integrations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="group-team">
                <AccordionTrigger icon={<Users className="size-4 text-muted-foreground" />} subtitle="Manage users and roles">
                  Team Members
                </AccordionTrigger>
                <AccordionContent>
                  Add collaborators and assign permissions.
                </AccordionContent>
              </AccordionItem>
            </AccordionGroup>
          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* SPACING TOKEN CALLOUT */}
      {/* ===================================================== */}
      <section className="space-y-6">
        <Card level={1}>
          <CardContent className="p-6 space-y-4">
            <h2 className="h2">Spacing System</h2>
            <p className="p text-muted-foreground">
              Accordion spacing is token-driven and scales by size:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card level={2}>
                <CardContent className="p-4 space-y-2">
                  <div className="label-sm">sm</div>
                  <p className="p-sm text-muted-foreground">
                    px-4 · compact rhythm · label-sm / p-sm
                  </p>
                </CardContent>
              </Card>
              <Card level={2}>
                <CardContent className="p-4 space-y-2">
                  <div className="label-sm">md (default)</div>
                  <p className="p-sm text-muted-foreground">
                    px-6 · balanced rhythm · label-md / p
                  </p>
                </CardContent>
              </Card>
              <Card level={2}>
                <CardContent className="p-4 space-y-2">
                  <div className="label-sm">lg</div>
                  <p className="p-sm text-muted-foreground">
                    px-6 · increased emphasis · label-lg / p
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ===================================================== */}
      {/* SIZE COMPARISON MATRIX */}
      {/* ===================================================== */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Size Comparison</h2>
          <p className="p text-muted-foreground">
            Visual comparison of typography scaling. Padding for md and lg is consistent; small is the compact variant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Card key={size} level={1} className="self-start">
              <CardContent className="p-0">
                <Accordion type="single" collapsible size={size}>
                  <AccordionItem value={`matrix-${size}`}>
                    <AccordionTrigger>
                      {size.toUpperCase()} Example
                    </AccordionTrigger>
                    <AccordionContent>
                      This demonstrates spacing and typography scaling for the {size} size.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================================================== */}
      {/* 1. FULL WIDTH ACCORDIONS */}
      {/* ===================================================== */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="h2">Layout Examples</h2>
          <p className="p text-muted-foreground">
            Structural layout patterns for organizing accordions across different contexts.
          </p>
        </div>

        {/* Documentation Accordion */}
        <h3 className="h3">Full Width</h3>
        <Accordion type="single" collapsible size="md" className="w-full">
          <AccordionItem value="doc-1" className="border-b border-border-subtle">
            <AccordionTrigger>
              Documentation Accordion
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Ideal for structured information like help articles,
                API references, and legal policies.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Supports long-form text</li>
                <li>Works well with nested accordions</li>
                <li>Great for content-heavy pages</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Larger Size */}
        <Accordion type="single" collapsible size="lg" className="w-full">
          <AccordionItem value="doc-2" className="border-b border-border-subtle">
            <AccordionTrigger>
              <span className="label-lg">
                Large Documentation Variant
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-3 items-center">
                <FileText className="size-5 text-muted-foreground" />
                <p>
                  Larger trigger size for high emphasis sections or onboarding flows.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Why Your Orders Failed AccordionGroup moved to Use Cases section */}
      </section>

      {/* ===================================================== */}
      {/* 2. GRID-BASED ACCORDIONS */}
      {/* ===================================================== */}


      {/* ===================================================== */}
      {/* 2. GRID-BASED ACCORDIONS */}
      {/* ===================================================== */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h3 className="h3">Grid</h3>
          <p className="p text-muted-foreground">
            Use when grouping multiple expandable cards within dashboards or configuration pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-4">
          {["Projects", "Settings", "Team", "Integrations"].map((title, i) => (
            <Card key={i} level={1}>
              <CardContent className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem value={`grid-${i}`} className="border-0">
                    <AccordionTrigger>
                      {title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="p text-muted-foreground">
                        This grid layout works well in dashboard-style layouts.
                      </p>
                      <Badge variant="default">Expandable</Badge>
                      <Button variant="ghost" size="sm">
                        Action
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      {/* ===================================================== */}
      {/* 3. MASONRY ACCORDIONS */}
      {/* ===================================================== */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h3 className="h3">Masonry</h3>
          <p className="p text-muted-foreground">
            Ideal for FAQ explorers, analytics panels, and modular dashboards.
            Items stack vertically and flow naturally based on height.
          </p>
        </div>

        <div className="columns-1 md:columns-2 gap-4 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} level={1} className="break-inside-avoid">
              <CardContent className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem value={`masonry-${item}`} className="border-0">
                    <AccordionTrigger>
                      Masonry Item {item}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="p text-muted-foreground">
                        Variable height content works well in masonry layouts.
                      </p>

                      {item % 2 === 0 && (
                        <div className="space-y-2">
                          <Badge variant="outline">Insight</Badge>
                          <Badge variant="default">Performance</Badge>
                        </div>
                      )}

                      {item === 3 && (
                        <div className="space-y-3">
                          <p className="p-sm text-muted-foreground">
                            This example includes additional explanatory content to
                            simulate uneven heights between columns.
                          </p>
                          <Button variant="ghost" size="sm">
                            View details
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      {/* ===================================================== */}
      {/* 4. ACCORDION TYPE EXPLAINERS */}
      {/* ===================================================== */}
      <section className="space-y-10">
        <div className="space-y-2">
          <h2 className="h2">Use Cases</h2>
          <p className="p text-muted-foreground">
            Examples of surface-aware and dashboard-integrated accordion variants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Surface Aware */}
          <Card level={0}>
            <CardContent className="p-6 space-y-4">
              <div className="label-md">Surface-Aware Accordion</div>
              <p className="p text-muted-foreground">
                Automatically adjusts elevation and borders based on background level.
                Use in complex layouts with layered surfaces.
              </p>
              <Accordion type="single" collapsible>
                <AccordionItem value="surface" className="border-b border-border-subtle">
                  <AccordionTrigger>
                    Expand Surface Example
                  </AccordionTrigger>
                  <AccordionContent>
                    Content adapts to its surface depth.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contained Elevated */}
          <Card level={1}>
            <CardContent className="p-6 space-y-4">
              <div className="label-md">Contained Elevated Accordion</div>
              <p className="p text-muted-foreground">
                Used inside cards for grouped configurations.
                Full-width separators and shared elevation.
              </p>
              <Accordion type="single" collapsible>
                <AccordionItem value="contained" className="border-b border-border-subtle">
                  <AccordionTrigger>
                    Expand Contained Example
                  </AccordionTrigger>
                  <AccordionContent>
                    Ideal for settings clusters and admin panels.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Dashboard Stat Accordion */}
          <Card level={1}>
            <CardContent className="p-6 space-y-4">
              <div className="label-md">Dashboard Stat Accordion</div>
              <p className="p text-muted-foreground">
                Combine stats and expandable analytics for dashboards.
              </p>
              <Accordion type="single" collapsible>
                <AccordionItem value="stat" className="border-b border-border-subtle">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3">
                      <BarChart3 className="size-4 text-muted-foreground" />
                      Fraud Rate
                      <Badge variant="default">↓ 3%</Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    Detailed breakdown by region, payment method, and device type.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

        </div>
        <AccordionGroup
          type="single"
          collapsible
          size="md"
          headerTitle="Why Your Orders Failed"
          headerSubtitle="Understanding failed order reasons can highlight emerging fraud trends"
        >
          <AccordionItem value="velocity">
            <AccordionTrigger>
              <div className="flex w-full items-start justify-between gap-6 text-left">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="label-md">Card usage high velocity</div>
                    <div className="p-sm text-muted-foreground">Checks payment method used</div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="label-md text-destructive-foreground">33%</div>
                    <div className="w-20 h-1.5 rounded-full bg-destructive/40 shadow-inner overflow-hidden">
                      <div
                        className="h-full rounded-full bg-destructive-foreground transition-[width] duration-700 ease-out"
                        style={{ width: "33%" }}
                      />
                    </div>
                  </div>
                  <div className="p-sm text-muted-foreground">1,234 orders</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <div className="label-sm text-muted-foreground">Contribution</div>
                  <p>
                    High velocity detected from multiple transactions using the same card
                    within a short timeframe. This pattern is commonly associated with
                    automated fraud attempts or card testing behavior.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">What this checks</div>
                  <p>
                    Monitors the frequency of transactions from a single payment method
                    across configurable time windows.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">Data evaluated</div>
                  <p>Card ending in 6180</p>
                </div>

                <Button variant="link" size="sm" className="px-0">
                  View orders flagged by this factor
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="avs">
            <AccordionTrigger>
              <div className="flex w-full items-start justify-between gap-6 text-left">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="label-md">Address verification mismatch</div>
                    <div className="p-sm text-muted-foreground">Checks billing and shipping addresses</div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="label-md text-destructive-foreground">16%</div>
                    <div className="w-20 h-1.5 rounded-full bg-destructive/40 shadow-inner overflow-hidden">
                      <div
                        className="h-full rounded-full bg-destructive-foreground transition-[width] duration-700 ease-out"
                        style={{ width: "16%" }}
                      />
                    </div>
                  </div>
                  <div className="p-sm text-muted-foreground">842 orders</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <div className="label-sm text-muted-foreground">Contribution</div>
                  <p>
                    Billing address provided did not match the issuing bank’s records, increasing the likelihood of unauthorized card usage.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">What this checks</div>
                  <p>
                    Compares customer-submitted billing address details against issuer response codes during authorization.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">Data evaluated</div>
                  <p>ZIP code and street match response (AVS code N)</p>
                </div>

                <Button variant="link" size="sm" className="px-0">
                  View orders flagged by this factor
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cvv">
            <AccordionTrigger>
              <div className="flex w-full items-start justify-between gap-6 text-left">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="label-md">CVV verification failure</div>
                    <div className="p-sm text-muted-foreground">Checks card security code validation</div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="label-md text-destructive-foreground">14%</div>
                    <div className="w-20 h-1.5 rounded-full bg-destructive/40 shadow-inner overflow-hidden">
                      <div
                        className="h-full rounded-full bg-destructive-foreground transition-[width] duration-700 ease-out"
                        style={{ width: "14%" }}
                      />
                    </div>
                  </div>
                  <div className="p-sm text-muted-foreground">765 orders</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <div className="label-sm text-muted-foreground">Contribution</div>
                  <p>
                    Card security code mismatch indicates potential use of stolen or compromised card credentials.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">What this checks</div>
                  <p>
                    Validates the CVV value submitted during checkout against issuer verification results.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">Data evaluated</div>
                  <p>CVV response code Mismatch</p>
                </div>

                <Button variant="link" size="sm" className="px-0">
                  View orders flagged by this factor
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ip">
            <AccordionTrigger>
              <div className="flex w-full items-start justify-between gap-6 text-left">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="label-md">IP risk signal</div>
                    <div className="p-sm text-muted-foreground">Checks network and geolocation signals</div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="label-md text-destructive-foreground">12%</div>
                    <div className="w-20 h-1.5 rounded-full bg-destructive/40 shadow-inner overflow-hidden">
                      <div
                        className="h-full rounded-full bg-destructive-foreground transition-[width] duration-700 ease-out"
                        style={{ width: "12%" }}
                      />
                    </div>
                  </div>
                  <div className="p-sm text-muted-foreground">640 orders</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <div className="label-sm text-muted-foreground">Contribution</div>
                  <p>
                    The customer’s IP address was associated with proxy routing, abnormal geolocation, or previously identified high-risk activity.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">What this checks</div>
                  <p>
                    Analyzes IP reputation, proxy usage, velocity across accounts, and geographic anomalies.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">Data evaluated</div>
                  <p>IP address 185.203.119.42 (High Risk)</p>
                </div>

                <Button variant="link" size="sm" className="px-0">
                  View orders flagged by this factor
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="device">
            <AccordionTrigger>
              <div className="flex w-full items-start justify-between gap-6 text-left">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="label-md">Device fingerprint mismatch</div>
                    <div className="p-sm text-muted-foreground">Checks device identity consistency</div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="label-md text-destructive-foreground">10%</div>
                    <div className="w-20 h-1.5 rounded-full bg-destructive/40 shadow-inner overflow-hidden">
                      <div
                        className="h-full rounded-full bg-destructive-foreground transition-[width] duration-700 ease-out"
                        style={{ width: "10%" }}
                      />
                    </div>
                  </div>
                  <div className="p-sm text-muted-foreground">512 orders</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <div className="label-sm text-muted-foreground">Contribution</div>
                  <p>
                    Device fingerprint characteristics did not align with the customer’s trusted historical activity.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">What this checks</div>
                  <p>
                    Compares device attributes such as browser version, OS, timezone, and hardware signature against known safe sessions.
                  </p>
                </div>

                <div>
                  <div className="label-sm text-muted-foreground">Data evaluated</div>
                  <p>New device signature – no historical match</p>
                </div>

                <Button variant="link" size="sm" className="px-0">
                  View orders flagged by this factor
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </AccordionGroup>
      </section>
      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Accordion" rows={ACCORDION_ROWS} />
        <PropTable title="AccordionItem" rows={ACCORDION_ITEM_ROWS} />
        <PropTable title="AccordionTrigger" rows={ACCORDION_TRIGGER_ROWS} />
        <PropTable title="AccordionContent" rows={ACCORDION_CONTENT_ROWS} />
        <PropTable title="AccordionGroup" rows={ACCORDION_GROUP_ROWS} />
      </section>
    </div>
  )
}