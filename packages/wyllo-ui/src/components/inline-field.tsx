"use client"

import * as React from "react"
import { cn } from "../lib/utils"

type InlineFieldProps = {
  label?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function InlineField({
  label,
  children,
  className,
}: InlineFieldProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        className
      )}
    >
      {label && (
        <span className="label-sm text-muted-foreground">
          {label}
        </span>
      )}
      {children}
    </div>
  )
}