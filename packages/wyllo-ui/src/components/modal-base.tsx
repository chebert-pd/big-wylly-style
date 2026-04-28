"use client"

import * as React from "react"
import { cn } from "../lib/utils"

function ModalBase({
  className,
  position = "center",
  children,
  ...props
}: React.ComponentProps<"div"> & { position?: "center" | "top" }) {
  return (
    <div
      data-slot="modal-base"
      data-position={position}
      className={cn(
        "fixed left-1/2 z-50 -translate-x-1/2 p-[2px] rounded-2xl bg-glass backdrop-blur-glass border border-glass-border shadow-[var(--elevation-overlay)]",
        position === "center" && "top-1/2 -translate-y-1/2",
        position === "top" && "top-[20vh]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { ModalBase }
