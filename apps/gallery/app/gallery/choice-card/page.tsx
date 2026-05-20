"use client"

import { useState } from "react"
import { Zap, Rocket, Crown, ShieldCheck, ShoppingBag, Package } from "lucide-react"
import {
  ChoiceCard,
  Checkbox,
  FieldSet,
  FieldLegend,
  RadioGroup,
  RadioGroupItem,
  Switch,
} from "@big-wylly-style/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const CHOICE_CARD_ROWS: PropRow[] = [
  {
    prop: "htmlFor",
    type: "string",
    required: true,
    description: "ID of the embedded control. Used as the FieldLabel htmlFor binding.",
  },
  {
    prop: "title",
    type: "ReactNode",
    required: true,
    description: "Primary label for the option. Rendered with label-md weight.",
  },
  {
    prop: "description",
    type: "ReactNode",
    description: "Secondary text below the title.",
  },
  {
    prop: "icon",
    type: "ReactNode",
    description: "Optional icon shown above the title for visual distinction.",
  },
  {
    prop: "control",
    type: "ReactNode",
    description: "The selection control — RadioGroupItem, Checkbox, or Switch.",
  },
  {
    prop: "controlPosition",
    type: '"left" | "right"',
    default: '"right"',
    description: "Where the control sits in the card. Right is card-first; left is traditional form layout.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Reduces opacity and disables pointer interaction on the card surface.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional classes merged onto the card surface.",
  },
]

export default function ChoiceCardPage() {
  const [plan, setPlan] = useState<string>("pro")
  const [billing, setBilling] = useState<string>("annual")
  const [features, setFeatures] = useState<Record<string, boolean>>({
    orders: true,
    returns: false,
  })
  const [betaEnabled, setBetaEnabled] = useState(false)

  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Choice Card</h1>
        <p className="p text-muted-foreground">
          A selectable card for deliberate decision-making. The whole card is the
          label for an embedded control — a RadioGroupItem, Checkbox, or Switch.
          Wrap single-select ChoiceCards in a RadioGroup.
        </p>
      </div>

      {/* Single-select with icons */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Single select — plan picker</h2>
          <p className="p text-muted-foreground">
            RadioGroup with three ChoiceCards. Selected card matches the
            Toggle/ToggleGroup selected state (bg-accent + primary border + ring).
          </p>
        </div>

        <FieldSet>
          <FieldLegend variant="label">
            Plan
          </FieldLegend>
          <RadioGroup
            value={plan}
            onValueChange={setPlan}
            className="grid gap-3 md:grid-cols-3 items-stretch"
          >
            <ChoiceCard
              htmlFor="plan-starter"
              icon={<Zap className="size-5" />}
              title="Starter"
              description="For individuals trying things out."
              control={<RadioGroupItem value="starter" id="plan-starter" />}
            />
            <ChoiceCard
              htmlFor="plan-pro"
              icon={<Rocket className="size-5" />}
              title="Pro"
              description="For teams that ship every week."
              control={<RadioGroupItem value="pro" id="plan-pro" />}
            />
            <ChoiceCard
              htmlFor="plan-enterprise"
              icon={<Crown className="size-5" />}
              title="Enterprise"
              description="For larger orgs with audit and SSO needs."
              control={<RadioGroupItem value="enterprise" id="plan-enterprise" />}
            />
          </RadioGroup>
        </FieldSet>
      </section>

      {/* Control position left */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Control on the left</h2>
          <p className="p text-muted-foreground">
            controlPosition=&quot;left&quot; puts the radio in a traditional form-row position.
          </p>
        </div>

        <FieldSet>
          <FieldLegend variant="label">
            Billing cycle
          </FieldLegend>
          <RadioGroup
            value={billing}
            onValueChange={setBilling}
            className="flex flex-col gap-2"
          >
            <ChoiceCard
              htmlFor="billing-monthly"
              controlPosition="left"
              title="Monthly"
              description="Pay each month. Cancel anytime."
              control={<RadioGroupItem value="monthly" id="billing-monthly" />}
            />
            <ChoiceCard
              htmlFor="billing-annual"
              controlPosition="left"
              title="Annual — save 20%"
              description="Billed once a year. Lower per-month rate."
              control={<RadioGroupItem value="annual" id="billing-annual" />}
            />
          </RadioGroup>
        </FieldSet>
      </section>

      {/* Multi-select with checkboxes */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Multi select — checkboxes</h2>
          <p className="p text-muted-foreground">
            Independent ChoiceCards each holding a Checkbox. No RadioGroup
            wrapper needed when selections are independent.
          </p>
        </div>

        <FieldSet>
          <FieldLegend variant="label">
            Screening products
          </FieldLegend>
          <div className="flex flex-col gap-2">
            <ChoiceCard
              htmlFor="screening-orders"
              icon={<ShoppingBag className="size-5" />}
              title="Orders"
              description="Real-time order risk assessment."
              control={
                <Checkbox
                  id="screening-orders"
                  checked={features.orders}
                  onCheckedChange={(v) =>
                    setFeatures((f) => ({ ...f, orders: v === true }))
                  }
                />
              }
            />
            <ChoiceCard
              htmlFor="screening-returns"
              icon={<Package className="size-5" />}
              title="Returns"
              description="Return abuse detection and predictive analytics."
              control={
                <Checkbox
                  id="screening-returns"
                  checked={features.returns}
                  onCheckedChange={(v) =>
                    setFeatures((f) => ({ ...f, returns: v === true }))
                  }
                />
              }
            />
          </div>
        </FieldSet>
      </section>

      {/* Multi-select compact: control-left, label only, grid */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Multi select — compact grid</h2>
          <p className="p text-muted-foreground">
            Title-only cards with the checkbox on the left, arranged in a grid.
            Use when options are short and need to be scannable side-by-side
            rather than skimmed top-to-bottom.
          </p>
        </div>

        <FieldSet>
          <FieldLegend variant="label">
            Permissions
          </FieldLegend>
          <div className="grid gap-2 md:grid-cols-3">
            {[
              { id: "perm-view", label: "View" },
              { id: "perm-edit", label: "Edit" },
              { id: "perm-delete", label: "Delete" },
              { id: "perm-share", label: "Share" },
              { id: "perm-comment", label: "Comment" },
              { id: "perm-export", label: "Export" },
            ].map((item) => (
              <ChoiceCard
                key={item.id}
                htmlFor={item.id}
                controlPosition="left"
                title={item.label}
                // govern:disable-next-line CO-002 -- inside <ChoiceCard control={…}>; ChoiceCard wraps the control in Field internally per its metadata
                control={<Checkbox id={item.id} />}
              />
            ))}
          </div>
        </FieldSet>
      </section>

      {/* Switch + disabled */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Switch and disabled</h2>
          <p className="p text-muted-foreground">
            A ChoiceCard can host a Switch for binary feature toggles. The
            disabled card stays unselected and ignores pointer events.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <ChoiceCard
            htmlFor="beta-features"
            icon={<ShieldCheck className="size-5" />}
            title="Beta features"
            description="Get early access. Things may change without notice."
            control={
              <Switch
                id="beta-features"
                checked={betaEnabled}
                onCheckedChange={setBetaEnabled}
              />
            }
          />
          <ChoiceCard
            htmlFor="legacy-mode"
            disabled
            icon={<ShieldCheck className="size-5" />}
            title="Legacy mode"
            description="No longer available on the current plan."
            control={
              <Switch
                id="legacy-mode"
                disabled
              />
            }
          />
        </div>
      </section>

      <PropTable rows={CHOICE_CARD_ROWS} />
    </div>
  )
}
