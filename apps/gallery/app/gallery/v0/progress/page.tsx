"use client"

import { useState, useEffect } from "react"
import {
  Progress,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const PROGRESS_ROWS: PropRow[] = [
  {
    prop: "value",
    type: "number | null",
    default: "0",
    description:
      "Current progress value from 0 to max. Null renders an indeterminate state.",
  },
  {
    prop: "max",
    type: "number",
    default: "100",
    description: "Maximum value of the progress bar.",
  },
  {
    prop: "getValueLabel",
    type: "(value: number, max: number) => string",
    description:
      "Custom accessible label function. Defaults to percentage string.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes applied to the progress track.",
  },
]

const progressValues = [
  { label: "25%", value: 25 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
]

export default function ProgressPage() {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Progress</h1>
        <p className="p text-muted-foreground">
          A horizontal progress bar indicating completion status. Built on Radix
          UI Progress primitive with smooth transitions.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Static values */}
        {progressValues.map((item) => (
          <Card key={item.value} level={1}>
            <CardHeader>
              <CardTitle className="label-md">{item.label} Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={item.value} />
            </CardContent>
          </Card>
        ))}

        {/* Animated on mount */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Animated on Mount</CardTitle>
            <CardDescription>
              Transitions from 0 to 66% after a short delay.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={animated} />
          </CardContent>
        </Card>

        {/* Zero / empty state */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Empty (0%)</CardTitle>
            <CardDescription>
              Progress bar with no fill, indicating not started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={0} />
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Progress" rows={PROGRESS_ROWS} />
      </section>
    </div>
  )
}
