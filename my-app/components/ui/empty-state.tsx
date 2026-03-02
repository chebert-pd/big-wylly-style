"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  /** Pass 1 or 3 icons. With 3 icons the fan animation plays on hover. */
  icons?: LucideIcon[]
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icons = [],
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-background border-border text-center",
        "border-2 border-dashed rounded-xl p-14 w-full max-w-[620px]",
        "group hover:bg-muted/30 hover:border-border/60 transition duration-500 hover:duration-200",
        className
      )}
    >
      {/* Icon cluster */}
      <div className="flex justify-center isolate">
        {icons.length >= 3 ? (
          <>
            {/* Left icon — tilts further left on hover */}
            <div className="bg-background size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-[var(--elevation-floating)] ring-1 ring-border group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[0], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
            {/* Center icon — lifts up */}
            <div className="bg-background size-12 grid place-items-center rounded-xl relative z-10 shadow-[var(--elevation-floating)] ring-1 ring-border group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[1], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
            {/* Right icon — tilts further right on hover */}
            <div className="bg-background size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-[var(--elevation-floating)] ring-1 ring-border group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[2], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
          </>
        ) : (
          // Single icon — just lifts on hover
          <div className="bg-background size-12 grid place-items-center rounded-xl shadow-[var(--elevation-floating)] ring-1 ring-border group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
            {icons[0] &&
              React.createElement(icons[0], {
                className: "w-6 h-6 text-muted-foreground",
              })}
          </div>
        )}
      </div>

      <h2 className="label-lg mt-6">{title}</h2>
      <p className="p-sm text-muted-foreground mt-1 whitespace-pre-line">
        {description}
      </p>

      {action && (
        <Button
          onClick={action.onClick}
          variant="primary"
          size="sm"
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
