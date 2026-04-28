"use client"

import { useState } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const INPUT_OTP_ROWS: PropRow[] = [
  {
    prop: "maxLength",
    type: "number",
    required: true,
    description: "Total number of OTP input slots.",
  },
  {
    prop: "value",
    type: "string",
    description: "Controlled value of the OTP input.",
  },
  {
    prop: "onChange",
    type: "(value: string) => void",
    description: "Callback fired when the OTP value changes.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Prevents interaction with the input.",
  },
  {
    prop: "containerClassName",
    type: "string",
    description: "Additional CSS classes applied to the outer container.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes applied to the hidden input element.",
  },
]

const INPUT_OTP_SUB_ROWS: PropRow[] = [
  {
    prop: "InputOTPGroup",
    type: "component",
    description:
      "Groups a set of InputOTPSlot components visually. Accepts standard div props.",
  },
  {
    prop: "InputOTPSlot",
    type: "component",
    description:
      "Renders a single character slot. Props: index (number, required) — the zero-based position in the OTP.",
  },
  {
    prop: "InputOTPSeparator",
    type: "component",
    description:
      "Renders a visual separator (minus icon) between OTP groups.",
  },
]

export default function InputOTPPage() {
  const [value, setValue] = useState("")

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Input OTP</h1>
        <p className="p text-muted-foreground">
          A one-time password input with individual character slots, grouped
          segments, and visual separators. Built on top of{" "}
          <code className="font-mono p-sm">input-otp</code>.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 6-digit with separator */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">6-Digit with Separator</CardTitle>
            <CardDescription>
              Two groups of three slots separated by a dash.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <InputOTP maxLength={6} value={value} onChange={setValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="p-sm text-muted-foreground">
              Value:{" "}
              <span className="font-[520] text-foreground font-mono">
                {value || "—"}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* 4-digit single group */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">4-Digit Single Group</CardTitle>
            <CardDescription>
              A single continuous group of four slots.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InputOTP maxLength={4}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </CardContent>
        </Card>

        {/* Disabled */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Disabled</CardTitle>
            <CardDescription>
              Input is non-interactive when disabled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InputOTP maxLength={6} disabled>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </CardContent>
        </Card>

        {/* 8-digit with multiple separators */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">8-Digit Multi-Group</CardTitle>
            <CardDescription>
              Four groups of two with separators between each.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InputOTP maxLength={8}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="InputOTP" rows={INPUT_OTP_ROWS} />
        <PropTable title="Sub-components" rows={INPUT_OTP_SUB_ROWS} />
      </section>
    </div>
  )
}
