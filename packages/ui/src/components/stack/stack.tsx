"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl"

const gapClasses: Record<StackGap, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
}

type StackProps = React.ComponentProps<"div"> & {
  /** Vertical gap between children. Defaults to md (24px). */
  gap?: StackGap
}

function Stack({ gap = "md", className, children, ...props }: StackProps) {
  return (
    <div
      data-slot="stack"
      data-gap={gap}
      className={cn("flex flex-col", gapClasses[gap], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Stack }
export type { StackGap, StackProps }
