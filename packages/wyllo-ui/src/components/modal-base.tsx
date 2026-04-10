"use client"

import * as React from "react"
import { cn } from "../lib/utils"

function ModalBase({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-base"
      className={cn(
        "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 p-[2px] rounded-2xl bg-glass backdrop-blur-glass border border-glass-border shadow-[var(--elevation-overlay)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { ModalBase }
