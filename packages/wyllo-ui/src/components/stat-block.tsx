"use client"

import * as React from "react"

import { cn } from "../lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

export type StatTrend = {
  value: string
  direction: "up" | "down"
  /** Controls text/icon color. Defaults to direction-inferred (up→success, down→destructive). */
  tone?: "success" | "destructive" | "neutral"
}

export type StatBlockProps = {
  icon?: React.ReactNode
  label: string
  value: string

  /** Small muted description under the label. */
  description?: string

  /** Secondary line under the value (uses .p). Used for data explainer or trend copy. */
  secondary?: React.ReactNode

  trend?: StatTrend

  /**
   * Controls where the trend sits relative to the primary value.
   * "inline"  — side by side with the value (default)
   * "between" — value left, trend right, full width
   * "below"   — trend on its own line under the value
   */
  trendPosition?: "inline" | "between" | "below"

  /** Overall spacing/typography density */
  size?: "default" | "lg"

  /** Size of the primary metric */
  valueSize?: "sm" | "md" | "lg"

  className?: string
}

export function TrendIndicator({ trend }: { trend: StatTrend }) {
  const tone = trend.tone ?? (trend.direction === "up" ? "success" : "destructive")
  const colorClass =
    tone === "success"
      ? "text-success-foreground"
      : tone === "destructive"
        ? "text-destructive-foreground"
        : "text-muted-foreground"

  return (
    <span className={cn("inline-flex items-center gap-0.5 label-sm shrink-0", colorClass)}>
      {trend.direction === "up" ? (
        <ChevronUp className="size-3.5" />
      ) : (
        <ChevronDown className="size-3.5" />
      )}
      {trend.value}
    </span>
  )
}

/**
 * Chromeless stat layout primitive.
 *
 * Renders a label / value / icon / description / secondary / trend
 * composition with no container chrome (no border, background, shadow,
 * or padding). Wrap in Card, MetricPanel, MetricStripItem, or any
 * custom surface.
 */
export function StatBlock({
  icon,
  label,
  value,
  description,
  secondary,
  trend,
  trendPosition = "inline",
  size = "default",
  valueSize = "md",
  className,
}: StatBlockProps) {
  const isLg = size === "lg"

  const valueClass =
    valueSize === "lg" ? "data-lg" : valueSize === "sm" ? "data-sm" : "data-md"

  const labelClass =
    valueSize === "sm"
      ? "label-sm"
      : isLg
        ? "label-md"
        : "label-sm"

  return (
    <div
      data-slot="stat-block"
      className={cn("flex flex-col", isLg ? "gap-6" : "gap-1", className)}
    >
      {/* Label row: label + description (left) / icon (right) */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className={cn(labelClass, "text-muted-foreground")}>{label}</span>
          {description && (
            <span className="p-sm text-muted-foreground">{description}</span>
          )}
        </div>

        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>

      {/* Value + trend + secondary */}
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            "flex",
            trendPosition === "below"
              ? "flex-col gap-1"
              : trendPosition === "between"
                ? "items-center justify-between gap-4"
                : "items-center gap-3"
          )}
        >
          <span className={cn(valueClass)}>{value}</span>
          {trend && <TrendIndicator trend={trend} />}
        </div>
        {secondary && <div className="p text-muted-foreground">{secondary}</div>}
      </div>
    </div>
  )
}
