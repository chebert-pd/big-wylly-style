"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type StatTrend = {
  value: string
  direction: "up" | "down"
}

type SurfaceLevel = 0 | 1 | 2

type StatAction = {
  label: string
  onClick?: () => void
}

export type StatProps = {
  /**
   * Where this stat card is being placed.
   * 0 = canvas/background, 1 = inside a level-1 surface (card), 2 = inside a level-2 surface (secondary).
   * The StatCard will automatically render on the *next* surface level.
   */
  surfaceLevel?: SurfaceLevel

  /** Overall card spacing/typography density */
  size?: "default" | "lg"

  /** Size of the primary metric */
  valueSize?: "sm" | "md" | "lg"

  icon?: React.ReactNode
  label: string
  value: string

  /** Small muted description under the label (used by the default variant). */
  description?: string

  /** Secondary line under the value (uses .p). Used for data explainer or trend copy. */
  secondary?: React.ReactNode

  trend?: StatTrend

  /** Comparison text shown in the footer (left side). */
  comparison?: React.ReactNode

  /** Optional footer action (right side). Renders as a ghost button. */
  action?: StatAction

  /** Visual variant of the stat card. */
  variant?: "default" | "large"

  className?: string
}

function surfaceClasses(surfaceLevel: SurfaceLevel) {
  // Level mapping:
  // - If the component is placed on Level 0 (canvas), the stat should be Level 1 (card).
  // - If placed on Level 1, the stat should be Level 2 (secondary).
  // - If placed on Level 2, keep it on Level 2 (still secondary) for now.
  const containerBg = surfaceLevel === 0 ? "bg-card" : "bg-secondary"
  const footerBg = surfaceLevel === 0 ? "bg-secondary" : "bg-background"

  // Only apply elevation when floating above the canvas.
  const elevation = surfaceLevel === 0 ? "shadow-[var(--elevation-surface)]" : "shadow-none"

  return { containerBg, footerBg, elevation }
}

export function StatCard({
  surfaceLevel = 0,
  size = "default",
  valueSize = "md",
  icon,
  label,
  value,
  description,
  secondary,
  trend,
  comparison,
  action,
  variant = "default",
  className,
}: StatProps) {
  const isLg = size === "lg"

  const valueClass =
    valueSize === "lg" ? "data-lg" : valueSize === "sm" ? "data-sm" : "data-md"

  // When the metric is smaller, the label should step down so the hierarchy still reads clean.
  const labelClass =
    valueSize === "sm"
      ? "label-sm"
      : isLg
        ? "label-md"
        : "label-sm"

  const { containerBg, footerBg, elevation } = surfaceClasses(surfaceLevel)

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border flex flex-col",
        containerBg,
        elevation,
        className
      )}
    >
      {variant === "large" ? (
        <>
          <div className={cn("flex flex-col gap-6 flex-1", isLg ? "p-6" : "p-5")}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className={cn(labelClass, "text-muted-foreground")}>{label}</span>
                {description && (
                  <span className="p-sm text-muted-foreground">{description}</span>
                )}
              </div>

              {icon && <div className="text-muted-foreground">{icon}</div>}
            </div>

            <div className="flex flex-col gap-1">
              <span className={cn(valueClass)}>{value}</span>
              {secondary && <div className="p">{secondary}</div>}
            </div>
          </div>

          {action && (
            <div
              className={cn(
                "flex items-center gap-3 border-t border-border-subtle px-5 py-3 justify-center",
                footerBg
              )}
            >
              <Button variant="ghost" size="sm" onClick={action.onClick}>
                {action.label}
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className={cn("flex flex-col gap-1 flex-1", isLg ? "p-6" : "p-5")}>
            {/* Label + optional icon */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className={cn(labelClass, "text-muted-foreground")}>{label}</span>
                {description && (
                  <span className="p-sm text-muted-foreground">{description}</span>
                )}
              </div>

              {icon && <div className="text-muted-foreground">{icon}</div>}
            </div>

            {/* Primary value */}
            <div className="flex items-center gap-3">
              <span className={cn(valueClass)}>{value}</span>

              {trend && (
                <Badge
                  variant={trend.direction === "up" ? "success" : "destructive"}
                  className="gap-1"
                >
                  {trend.direction === "up" ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {trend.value}
                </Badge>
              )}
            </div>
          </div>

          {(comparison || action) && (
            <div
              className={cn(
                "flex items-center gap-3 border-t border-border-subtle px-5 py-3",
                comparison ? "justify-between" : "justify-center",
                footerBg
              )}
            >
              {comparison && (
                <div className="p-sm text-muted-foreground">{comparison}</div>
              )}

              {action && (
                <Button variant="ghost" size="sm" onClick={action.onClick}>
                  {action.label}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function StatsGrid({
  children,
  surfaceLevel = 0,
  className,
}: {
  children: React.ReactNode
  surfaceLevel?: SurfaceLevel
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child

        // If the child already defines a surfaceLevel, respect it.
        if ("surfaceLevel" in child.props) {
          return child
        }

        return React.cloneElement(child, {
          surfaceLevel,
        })
      })}
    </div>
  )
}