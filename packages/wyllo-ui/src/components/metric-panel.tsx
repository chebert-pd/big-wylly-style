"use client"

import * as React from "react"
import { useState } from "react"

import { cn } from "../lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Card, CardContent } from "./card"
import { StatBlock } from "./stat-block"

const CLOSED_TAB_VALUE = "__closed__"

export type MetricItem = {
  key: string

  /** StatBlock inputs */
  label: string
  value: string
  icon?: React.ReactNode
  description?: string
  secondary?: React.ReactNode

  /** The expanded content (chart, table, etc.) */
  content: React.ReactNode
}

export type MetricPanelProps = {
  title?: string
  subtitle?: string
  items: MetricItem[]

  /** Closed by default if omitted. Provide a key to open a metric by default. */
  defaultOpenKey?: string

  className?: string
}

export function MetricPanel({
  title,
  subtitle,
  items,
  defaultOpenKey,
  className,
}: MetricPanelProps) {
  // Closed by default unless a defaultOpenKey is provided.
  const [active, setActive] = useState<string>(defaultOpenKey ?? CLOSED_TAB_VALUE)

  return (
    <Card level={1} className={cn("animate-in fade-in duration-500", className)}>
      <CardContent className="p-0">
        {/* Header */}
        {(title || subtitle) && (
          <div className="space-y-2 border-b border-border-subtle px-8 py-6">
            {title && <div className="label-lg">{title}</div>}
            {subtitle && <p className="p text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        <Tabs
          value={active}
          onValueChange={(v) => setActive(v)}
          className="w-full"
        >
          {/*
            Triggers: keep them in a single row on md+ with vertical separators.
            On small screens, stack them with horizontal separators.
          */}
          <TabsList
            className={cn(
              // Override shadcn TabsList defaults (it ships with fixed height/padding)
              "w-full bg-transparent p-0",
              "h-auto",
              "items-stretch",
              "flex flex-col md:flex-row",
              // Internal separators
              "divide-y divide-border-subtle md:divide-y-0 md:divide-x",
              // Baseline rule so the active underline feels anchored
              "border-b border-border-subtle"
            )}
          >
            <TabsTrigger
              value={CLOSED_TAB_VALUE}
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
            {items.map((item) => (
              <TabsTrigger
                key={item.key}
                value={item.key}
                onMouseDown={(e) => {
                  // Radix Tabs selects on pointer down; intercept that for toggle-close.
                  if (active === item.key) {
                    e.preventDefault()
                    setActive(CLOSED_TAB_VALUE)
                  }
                }}
                className={cn(
                  // Override shadcn TabsTrigger defaults (fixed height + padding)
                  "relative w-full rounded-none p-0 text-left",
                  "h-auto",
                  "items-stretch",
                  "justify-stretch",

                  // Keep the surface in the same family as the Card background (no grey-on-colored)
                  "bg-transparent",
                  "hover:bg-secondary/40",
                  "data-[state=active]:bg-transparent",

                  // Bottom-only active indicator
                  "border-b-2 border-transparent -mb-px",
                  "data-[state=active]:[border-bottom-color:var(--primary)]",

                  // Typography/interaction polish
                  "transition-colors",
                  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                )}
              >
                <StatBlock
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                  description={item.description}
                  secondary={item.secondary}
                  size="lg"
                  valueSize="lg"
                  className="p-6 w-full h-full"
                />
              </TabsTrigger>
            ))}
          </TabsList>

          {items.map((item) => (
            <TabsContent
              key={item.key}
              value={item.key}
              className={cn(
                "border-t border-border-subtle",
                "px-8 pt-6 pb-8",
                "animate-in fade-in slide-in-from-top-2 duration-500"
              )}
            >
              {item.content}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
