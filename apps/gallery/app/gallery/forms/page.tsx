"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
  Input,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Button,
  Separator,
  ToggleGroup,
  ToggleGroupItem,
  Combobox,
  Steps,
  Step,
} from "@chebert-pd/ui"
import { useState } from "react"
import {
  CircleOff,
  ShieldUser,
  ShieldCheck,
  ShoppingBag,
  Package,
  BotOff,
  ShoppingCart,
} from "lucide-react"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const FIELD_ROWS: PropRow[] = [
  { prop: "orientation", type: '"vertical" | "horizontal" | "responsive"', default: '"vertical"', description: "Layout direction of label and input. Responsive switches from vertical to horizontal at the container breakpoint." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
  { prop: "children", type: "ReactNode", description: "Field sub-components (FieldLabel, FieldContent, Input, FieldError, etc.)." },
]

const FIELD_SUB_ROWS: PropRow[] = [
  { prop: "FieldLabel", type: "component", description: "Renders a <Label> for the field. Accepts all Label props including htmlFor." },
  { prop: "FieldContent", type: "component", description: "Wrapper for the input and helper text area. Provides flex-col layout with gap." },
  { prop: "FieldDescription", type: "component", description: "Help text rendered below the label or input. Renders a <p> with muted styling." },
  { prop: "FieldError", type: "component", description: "Validation error display. Props: errors (Array<{ message?: string }>), or pass children directly." },
  { prop: "FieldTitle", type: "component", description: "Bold title text for card-style fields. Renders a <div> with label-md styling." },
  { prop: "FieldGroup", type: "component", description: "Groups related Field components with consistent vertical spacing." },
  { prop: "FieldSet", type: "component", description: "Semantic <fieldset> wrapper with vertical spacing for grouped fields." },
  { prop: "FieldLegend", type: "component", description: "Legend for a FieldSet. Props: variant ('legend' | 'label', default 'legend')." },
  { prop: "FieldSeparator", type: "component", description: "Horizontal rule between fields. Accepts optional children for an inline label." },
]

const INPUT_ROWS: PropRow[] = [
  { prop: "size", type: '"default" | "sm" | "inline"', default: '"default"', description: "Controls the height and padding of the input." },
  { prop: "type", type: "string", description: "HTML input type attribute (text, email, password, number, etc.)." },
  { prop: "placeholder", type: "string", description: "Placeholder text shown when the input is empty." },
  { prop: "disabled", type: "boolean", description: "Disables the input and applies reduced-opacity styling." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function Page() {
  const [paymentType, setPaymentType] = useState<"credit" | "ach" | "wire">("credit")
  const [telemetryEnabled, setTelemetryEnabled] = useState(false)

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Create a new merchant workspace</h1>
        <p className="p text-muted-foreground">
          Merchant workspaces empower your CX teams to approve good orders by
          integrating with numerous external partners such as Shopify,
          BigCommerce, Loop, Slack, and even a direct API.
        </p>
      </div>

      {/* Timeline + Steps (numbers align to their cards) */}
      <Steps>
              {/* STEP 1 */}
              <Step status="complete" number={1}>
                <Card level={1}>
                  <CardHeader>
                    <CardTitle>Step 1 — Choose Wyllo Products</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Chargeback Product */}
                    <div className="space-y-2">
                      <FieldLabel className="form-label text-muted-foreground">Chargeback Product</FieldLabel>
                      <RadioGroup defaultValue="none" className="grid gap-2 md:grid-cols-3 items-stretch">
                        {[
                          {
                            label: "None",
                            value: "none",
                            description:
                              "Chargebacks are merchant managed.",
                          },
                          {
                            label: "Chargeback Management",
                            value: "management",
                            description:
                              "Chargebacks are fully managed and protected by Wyllo.",
                          },
                          {
                            label: "Chargeback Protection",
                            value: "protection",
                            description:
                              "Merchant managed, but Wyllo provides protection.",
                          },
                        ].map((item) => (
                          <FieldLabel key={item.value} htmlFor={`step1-${item.value}`} className="block h-full">
                            <Field
                              orientation="horizontal"
                              className="group items-start gap-3 w-full h-full rounded-[var(--radius)] border border-input bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary/40"
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <span className="mt-1 text-muted-foreground">
                                  {item.value === "none" && <CircleOff className="h-4 w-4" />}
                                  {item.value === "management" && <ShieldUser className="h-4 w-4" />}
                                  {item.value === "protection" && <ShieldCheck className="h-4 w-4" />}
                                </span>
                                <div className="space-y-1">
                                  <p className="label-md text-foreground">{item.label}</p>
                                  <p className="p-sm text-muted-foreground">{item.description}</p>
                                </div>
                              </div>
                              <RadioGroupItem
                                id={`step1-${item.value}`}
                                value={item.value}
                                className="ml-auto"
                              />
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* Screening Product */}
                    <div className="space-y-2">
                      <FieldLabel className="form-label text-muted-foreground">Screening Product</FieldLabel>
                      <div className="flex flex-col gap-2">
                        {["Orders", "Returns"].map((label) => (
                          <FieldLabel key={label} htmlFor={`screening-${label}`}>
                            <Field
                              orientation="horizontal"
                              className="group items-start gap-3 w-full rounded-[var(--radius)] border border-input bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary/40"
                            >
                              <span className="mt-1 text-muted-foreground">
                                {label === "Orders" && <ShoppingBag className="h-4 w-4" />}
                                {label === "Returns" && <Package className="h-4 w-4" />}
                              </span>
                              <div className="flex-1 space-y-1">
                                <p className="label-md text-foreground">{label}</p>
                                {label === "Orders" && (
                                  <p className="p-sm text-muted-foreground">
                                    Real-time order risk assessment using behavioral, device, and transaction signals to prevent fraud before fulfillment.
                                  </p>
                                )}
                                {label === "Returns" && (
                                  <p className="p-sm text-muted-foreground">
                                    Return abuse detection powered by predictive analytics to identify policy manipulation and high-risk refund activity.
                                  </p>
                                )}
                              </div>
                              <Checkbox id={`screening-${label}`} className="ml-auto" />
                            </Field>
                          </FieldLabel>
                        ))}
                      </div>

                      <div className="space-y-2 pt-4">
                        <FieldLabel className="form-label text-muted-foreground">Additional Features</FieldLabel>
                        <div className="flex flex-col gap-2">
                          <Field
                            orientation="horizontal"
                            className="group items-start gap-3 w-full rounded-[var(--radius)] border border-input bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary/40"
                          >
                            <span className="mt-1 text-muted-foreground">
                              <BotOff className="h-4 w-4" />
                            </span>
                            <div className="flex-1 space-y-1">
                              <p className="label-md text-foreground">Telemetry & Bot Blocking</p>
                              <p className="p-sm text-muted-foreground">
                                Collects real-time behavioral and device signals to power predictive risk scoring and automated fraud detection.
                              </p>
                            </div>
                            <Switch className="ml-auto" />
                          </Field>

                          <Field
                            orientation="horizontal"
                            className="group items-start gap-3 w-full rounded-[var(--radius)] border border-input bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary/40"
                          >
                            <span className="mt-1 text-muted-foreground">
                              <ShoppingCart className="h-4 w-4" />
                            </span>
                            <div className="flex-1 space-y-1">
                              <p className="label-md text-foreground">Checkout UI Extension</p>
                              <p className="p-sm text-muted-foreground">
                                Blocks invalid or incomplete customer information directly at checkout before the transaction is completed.
                              </p>
                            </div>
                            <Switch className="ml-auto" />
                          </Field>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Step>

              {/* STEP 2 */}
              <Step status="complete" number={2}>
                <Card level={1}>
                  <CardHeader>
                    <CardTitle>Step 2 — Activate Merchant Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <Field className="space-y-1">
                      <FieldLabel className="form-label text-muted-foreground">Payment Method Type</FieldLabel>

                      <div className="pt-2">
                        <ToggleGroup
                          type="single"
                          variant="outline"
                          value={paymentType}
                          onValueChange={(value) => {
                            if (value) setPaymentType(value as "credit" | "ach" | "wire")
                          }}
                        >
                          <ToggleGroupItem value="credit">Credit Card</ToggleGroupItem>
                          <ToggleGroupItem value="ach">ACH</ToggleGroupItem>
                          <ToggleGroupItem value="wire">Wire</ToggleGroupItem>
                        </ToggleGroup>
                      </div>

                      {/* CREDIT CARD */}
                      {paymentType === "credit" && (
                        <div className="space-y-4 pt-4">
                          <Field className="space-y-1">
                            <FieldLabel className="form-label text-muted-foreground">Cardholder Name</FieldLabel>
                            <Input className="form-data" placeholder="John Doe" />
                          </Field>

                          <Field className="space-y-1">
                            <FieldLabel className="form-label text-muted-foreground">Card Number</FieldLabel>
                            <Input className="form-data" placeholder="4242 4242 4242 4242" />
                          </Field>

                          <div className="flex gap-3">
                            <Field className="space-y-1 flex-1">
                              <FieldLabel className="form-label text-muted-foreground">Expiration</FieldLabel>
                              <Input className="form-data" placeholder="MM/YY" />
                            </Field>

                            <Field className="space-y-1 flex-1">
                              <FieldLabel className="form-label text-muted-foreground">CVC</FieldLabel>
                              <Input className="form-data" placeholder="123" />
                            </Field>
                          </div>
                        </div>
                      )}

                      {/* ACH */}
                      {paymentType === "ach" && (
                        <div className="space-y-4 pt-4">
                          <Field className="space-y-1">
                            <FieldLabel className="form-label text-muted-foreground">Account Holder Name</FieldLabel>
                            <Input className="form-data" placeholder="John Doe" />
                          </Field>

                          <Field className="space-y-1">
                            <FieldLabel className="form-label text-muted-foreground">Routing Number</FieldLabel>
                            <Input className="form-data" placeholder="123456789" />
                          </Field>

                          <Field className="space-y-1">
                            <FieldLabel className="form-label text-muted-foreground">Account Number</FieldLabel>
                            <Input className="form-data" placeholder="000123456789" />
                          </Field>
                        </div>
                      )}

                      {/* WIRE */}
                      {paymentType === "wire" && (
                        <div className="space-y-4 pt-4">
                          <Field className="space-y-1">
                            <FieldLabel className="form-label text-muted-foreground">Account Holder Name</FieldLabel>
                            <Input className="form-data" placeholder="John Doe" />
                          </Field>

                          <Field className="space-y-1">
                            <FieldLabel className="form-label text-muted-foreground">Bank Name</FieldLabel>
                            <Input className="form-data" placeholder="Bank of Example" />
                          </Field>

                          <Field className="space-y-1">
                            <FieldLabel className="form-label text-muted-foreground">SWIFT / BIC Code</FieldLabel>
                            <Input className="form-data" placeholder="ABCDEFGH" />
                          </Field>
                        </div>
                      )}
                    </Field>
                  </CardContent>
                </Card>
              </Step>

              {/* STEP 3 */}
              <Step status="complete" number={3} last>
                <Card level={1}>
                  <CardHeader>
                    <CardTitle>Step 3 — Merchant Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Field className="space-y-1">
                      <FieldLabel className="form-label text-muted-foreground">Merchant Name</FieldLabel>
                      <Input className="form-data" placeholder="Acme Co." />
                    </Field>

                    <Field className="space-y-1">
                      <FieldLabel className="form-label text-muted-foreground">Billing Address</FieldLabel>
                      <Input className="form-data" placeholder="123 Market St" />
                    </Field>

                    <div className="flex gap-3">
                      <Field className="space-y-1 flex-1">
                        <FieldLabel className="form-label text-muted-foreground">Phone Number</FieldLabel>
                        <Input className="form-data" placeholder="(555) 123-4567" />
                      </Field>

                      <Field className="space-y-1 flex-1">
                        <FieldLabel className="form-label text-muted-foreground">Email Address</FieldLabel>
                        <Input className="form-data" placeholder="merchant@company.com" />
                      </Field>
                    </div>

                    <Field className="space-y-1 w-full">
                      <FieldLabel className="form-label text-muted-foreground">Industry</FieldLabel>
                      <Combobox
                        options={[
                          { label: "Retail", value: "retail" },
                          { label: "Digital Goods", value: "digital-goods" },
                          { label: "SaaS", value: "saas" },
                        ]}
                        placeholder="Select industry"
                        className="form-data w-full"
                      />
                    </Field>

                    <div className="flex gap-3">
                      <Field className="space-y-1 flex-1">
                        <FieldLabel className="form-label text-muted-foreground">Product Category</FieldLabel>
                        <Combobox
                          options={[
                            { label: "Apparel", value: "apparel" },
                            { label: "Electronics", value: "electronics" },
                            { label: "Home Goods", value: "home-goods" },
                          ]}
                          placeholder="Select category"
                          className="form-data w-full"
                        />
                      </Field>

                      <Field className="space-y-1 flex-1">
                        <FieldLabel className="form-label text-muted-foreground">Product Subcategory</FieldLabel>
                        <Combobox
                          options={[
                            { label: "Men's", value: "mens" },
                            { label: "Women's", value: "womens" },
                            { label: "Accessories", value: "accessories" },
                          ]}
                          placeholder="Select subcategory"
                          className="form-data w-full"
                        />
                      </Field>
                    </div>
                  </CardContent>
                </Card>
              </Step>
      </Steps>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Field" rows={FIELD_ROWS} />
        <PropTable title="Field Sub-components" rows={FIELD_SUB_ROWS} />
        <PropTable title="Input" rows={INPUT_ROWS} />
      </section>
    </div>
  )
}