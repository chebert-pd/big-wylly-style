"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function GlassFrame({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-frame"
      className={cn(
        "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 p-[2px] rounded-[calc(1rem+2px)] bg-glass backdrop-blur-glass border border-glass-border shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { GlassFrame }