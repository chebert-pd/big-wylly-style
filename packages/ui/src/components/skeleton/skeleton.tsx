"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      // govern:disable-next-line SF-001 -- skeleton placeholder uses bg-accent intentionally as a low-contrast pulsing surface; the rule's "hover/focus/active only" intent does not apply to loading-state primitives
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
