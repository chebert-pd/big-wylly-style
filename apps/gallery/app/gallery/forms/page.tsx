"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChoiceCard,
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FullScreenSheet,
  FullScreenSheetBody,
  FullScreenSheetDescription,
  FullScreenSheetFooter,
  FullScreenSheetHeader,
  FullScreenSheetTitle,
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
export default function Page() {
  const [open, setOpen] = useState(false)
  const [paymentType, setPaymentType] = useState<"credit" | "ach" | "wire">("credit")

  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Forms — Example</h1>
        <p className="p text-muted-foreground">
          A multi-step merchant workspace creation flow. Substantial forms like
          this belong in a FullScreenSheet rather than on the page surface.
        </p>
      </div>

      <div>
        <Button variant="primary" size="md" onClick={() => setOpen(true)}>
          Create a new merchant workspace
        </Button>
      </div>

      <FullScreenSheet open={open} onClose={() => setOpen(false)}>
        <FullScreenSheetHeader onClose={() => setOpen(false)}>
          <FullScreenSheetTitle>Create a new merchant workspace</FullScreenSheetTitle>
          <FullScreenSheetDescription>
            Merchant workspaces empower your CX teams to approve good orders by integrating with numerous external partners such as Shopify, BigCommerce, Loop, Slack, and even a direct API.
          </FullScreenSheetDescription>
        </FullScreenSheetHeader>

        <FullScreenSheetBody>
          <div className="mx-auto max-w-5xl space-y-8 p-6">
            <Steps>
              {/* STEP 1 */}
              <Step status="complete" number={1}>
                <Card level={1}>
                  <CardHeader>
                    <CardTitle>Step 1 — Choose Wyllo Products</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Chargeback Product */}
                    <FieldSet className="space-y-2">
                      <FieldLegend variant="label">Chargeback Product</FieldLegend>
                      <RadioGroup defaultValue="none" className="grid gap-2 md:grid-cols-3 items-stretch">
                        {[
                          {
                            label: "None",
                            value: "none",
                            description: "Chargebacks are merchant managed.",
                            icon: <CircleOff className="size-5" />,
                          },
                          {
                            label: "Chargeback Management",
                            value: "management",
                            description: "Chargebacks are fully managed and protected by Wyllo.",
                            icon: <ShieldUser className="size-5" />,
                          },
                          {
                            label: "Chargeback Protection",
                            value: "protection",
                            description: "Merchant managed, but Wyllo provides protection.",
                            icon: <ShieldCheck className="size-5" />,
                          },
                        ].map((item) => (
                          <ChoiceCard
                            key={item.value}
                            htmlFor={`step1-${item.value}`}
                            icon={item.icon}
                            title={item.label}
                            description={item.description}
                            control={<RadioGroupItem value={item.value} id={`step1-${item.value}`} />}
                          />
                        ))}
                      </RadioGroup>
                    </FieldSet>

                    <Separator />

                    {/* Screening Product */}
                    <FieldSet className="space-y-2">
                      <FieldLegend variant="label">Screening Product</FieldLegend>
                      <div className="flex flex-col gap-2">
                        <ChoiceCard
                          htmlFor="screening-orders"
                          icon={<ShoppingBag className="size-5" />}
                          title="Orders"
                          description="Real-time order risk assessment using behavioral, device, and transaction signals to prevent fraud before fulfillment."
                          // govern:disable-next-line CO-002 -- inside <ChoiceCard control={…}>; ChoiceCard wraps the control in Field internally per its metadata
                          control={<Checkbox id="screening-orders" />}
                        />
                        <ChoiceCard
                          htmlFor="screening-returns"
                          icon={<Package className="size-5" />}
                          title="Returns"
                          description="Return abuse detection powered by predictive analytics to identify policy manipulation and high-risk refund activity."
                          // govern:disable-next-line CO-002 -- inside <ChoiceCard control={…}>; ChoiceCard wraps the control in Field internally per its metadata
                          control={<Checkbox id="screening-returns" />}
                        />
                      </div>
                    </FieldSet>

                    {/* Additional Features */}
                    <FieldSet className="space-y-2">
                      <FieldLegend variant="label">Additional Features</FieldLegend>
                      <div className="flex flex-col gap-2">
                        <ChoiceCard
                          htmlFor="feature-telemetry"
                          icon={<BotOff className="size-5" />}
                          title="Telemetry & Bot Blocking"
                          description="Collects real-time behavioral and device signals to power predictive risk scoring and automated fraud detection."
                          // govern:disable-next-line CO-002 -- inside <ChoiceCard control={…}>; ChoiceCard wraps the control in Field internally per its metadata
                          control={<Switch id="feature-telemetry" />}
                        />
                        <ChoiceCard
                          htmlFor="feature-checkout-ui"
                          icon={<ShoppingCart className="size-5" />}
                          title="Checkout UI Extension"
                          description="Blocks invalid or incomplete customer information directly at checkout before the transaction is completed."
                          // govern:disable-next-line CO-002 -- inside <ChoiceCard control={…}>; ChoiceCard wraps the control in Field internally per its metadata
                          control={<Switch id="feature-checkout-ui" />}
                        />
                      </div>
                    </FieldSet>
                  </CardContent>
                </Card>
              </Step>

              {/* STEP 2 */}
              <Step status="current" number={2}>
                <Card level={1}>
                  <CardHeader>
                    <CardTitle>Step 2 — Activate Merchant Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <FieldSet className="space-y-1">
                      <FieldLegend variant="label">Payment Method Type</FieldLegend>

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
                        <FieldGroup className="pt-4">
                          <Field>
                            <FieldLabel htmlFor="cc-cardholder">Cardholder Name</FieldLabel>
                            <FieldContent>
                              <Input id="cc-cardholder" placeholder="John Doe" />
                            </FieldContent>
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="cc-number">Card Number</FieldLabel>
                            <FieldContent>
                              <Input id="cc-number" placeholder="4242 4242 4242 4242" />
                            </FieldContent>
                          </Field>

                          <div className="flex gap-3">
                            <Field className="flex-1">
                              <FieldLabel htmlFor="cc-expiration">Expiration</FieldLabel>
                              <FieldContent>
                                <Input id="cc-expiration" placeholder="MM/YY" />
                              </FieldContent>
                            </Field>

                            <Field className="flex-1">
                              <FieldLabel htmlFor="cc-cvc">CVC</FieldLabel>
                              <FieldContent>
                                <Input id="cc-cvc" placeholder="123" />
                              </FieldContent>
                            </Field>
                          </div>
                        </FieldGroup>
                      )}

                      {/* ACH */}
                      {paymentType === "ach" && (
                        <FieldGroup className="pt-4">
                          <Field>
                            <FieldLabel htmlFor="ach-name">Account Holder Name</FieldLabel>
                            <FieldContent>
                              <Input id="ach-name" placeholder="John Doe" />
                            </FieldContent>
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="ach-routing">Routing Number</FieldLabel>
                            <FieldContent>
                              <Input id="ach-routing" placeholder="123456789" />
                            </FieldContent>
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="ach-account">Account Number</FieldLabel>
                            <FieldContent>
                              <Input id="ach-account" placeholder="000123456789" />
                            </FieldContent>
                          </Field>
                        </FieldGroup>
                      )}

                      {/* WIRE */}
                      {paymentType === "wire" && (
                        <FieldGroup className="pt-4">
                          <Field>
                            <FieldLabel htmlFor="wire-name">Account Holder Name</FieldLabel>
                            <FieldContent>
                              <Input id="wire-name" placeholder="John Doe" />
                            </FieldContent>
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="wire-bank">Bank Name</FieldLabel>
                            <FieldContent>
                              <Input id="wire-bank" placeholder="Bank of Example" />
                            </FieldContent>
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="wire-swift">SWIFT / BIC Code</FieldLabel>
                            <FieldContent>
                              <Input id="wire-swift" placeholder="ABCDEFGH" />
                            </FieldContent>
                          </Field>
                        </FieldGroup>
                      )}
                    </FieldSet>
                  </CardContent>
                </Card>
              </Step>

              {/* STEP 3 */}
              <Step status="upcoming" number={3} last>
                <Card level={1}>
                  <CardHeader>
                    <CardTitle>Step 3 — Merchant Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="merchant-name">Merchant Name</FieldLabel>
                        <FieldContent>
                          <Input id="merchant-name" placeholder="Acme Co." />
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="merchant-address">Billing Address</FieldLabel>
                        <FieldContent>
                          <Input id="merchant-address" placeholder="123 Market St" />
                        </FieldContent>
                      </Field>

                      <div className="flex gap-3">
                        <Field className="flex-1">
                          <FieldLabel htmlFor="merchant-phone">Phone Number</FieldLabel>
                          <FieldContent>
                            <Input id="merchant-phone" placeholder="(555) 123-4567" />
                          </FieldContent>
                        </Field>

                        <Field className="flex-1">
                          <FieldLabel htmlFor="merchant-email">Email Address</FieldLabel>
                          <FieldContent>
                            <Input id="merchant-email" placeholder="merchant@company.com" />
                          </FieldContent>
                        </Field>
                      </div>

                      <Field className="w-full">
                        <FieldLabel htmlFor="merchant-industry">Industry</FieldLabel>
                        <FieldContent>
                          <Combobox
                            options={[
                              { label: "Retail", value: "retail" },
                              { label: "Digital Goods", value: "digital-goods" },
                              { label: "SaaS", value: "saas" },
                              { label: "Marketplace", value: "marketplace" },
                              { label: "Subscription Services", value: "subscription" },
                              { label: "Travel & Hospitality", value: "travel" },
                              { label: "Food & Beverage", value: "food-beverage" },
                              { label: "Health & Beauty", value: "health-beauty" },
                              { label: "Financial Services", value: "financial" },
                              { label: "Education", value: "education" },
                              { label: "Gaming", value: "gaming" },
                              { label: "Media & Entertainment", value: "media" },
                              { label: "Automotive", value: "automotive" },
                              { label: "Nonprofit", value: "nonprofit" },
                              { label: "Other", value: "other" },
                            ]}
                            placeholder="Select industry"
                            className="w-full"
                          />
                        </FieldContent>
                      </Field>

                      <div className="flex gap-3">
                        <Field className="flex-1">
                          <FieldLabel htmlFor="merchant-category">Product Category</FieldLabel>
                          <FieldContent>
                            <Combobox
                              options={[
                                { label: "Apparel", value: "apparel" },
                                { label: "Electronics", value: "electronics" },
                                { label: "Home & Garden", value: "home-garden" },
                                { label: "Beauty & Personal Care", value: "beauty" },
                                { label: "Books & Media", value: "books-media" },
                                { label: "Sports & Outdoors", value: "sports-outdoors" },
                                { label: "Toys & Games", value: "toys-games" },
                                { label: "Food & Grocery", value: "food-grocery" },
                                { label: "Health & Wellness", value: "health-wellness" },
                                { label: "Office Supplies", value: "office" },
                                { label: "Pet Supplies", value: "pet" },
                                { label: "Automotive Parts", value: "auto-parts" },
                                { label: "Jewelry & Accessories", value: "jewelry" },
                              ]}
                              placeholder="Select category"
                              className="w-full"
                            />
                          </FieldContent>
                        </Field>

                        <Field className="flex-1">
                          <FieldLabel htmlFor="merchant-subcategory">Product Subcategory</FieldLabel>
                          <FieldContent>
                            <Combobox
                              options={[
                                { label: "Men's Apparel", value: "mens-apparel" },
                                { label: "Women's Apparel", value: "womens-apparel" },
                                { label: "Children's Apparel", value: "childrens-apparel" },
                                { label: "Footwear", value: "footwear" },
                                { label: "Outerwear", value: "outerwear" },
                                { label: "Activewear", value: "activewear" },
                                { label: "Formal Wear", value: "formal" },
                                { label: "Underwear & Sleepwear", value: "underwear-sleepwear" },
                                { label: "Swimwear", value: "swimwear" },
                                { label: "Maternity", value: "maternity" },
                                { label: "Accessories", value: "accessories" },
                                { label: "Bags & Luggage", value: "bags-luggage" },
                              ]}
                              placeholder="Select subcategory"
                              className="w-full"
                            />
                          </FieldContent>
                        </Field>
                      </div>
                    </FieldGroup>
                  </CardContent>
                </Card>
              </Step>
            </Steps>
          </div>
        </FullScreenSheetBody>

        <FullScreenSheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" size="md">Create Workspace</Button>
        </FullScreenSheetFooter>
      </FullScreenSheet>
    </div>
  )
}