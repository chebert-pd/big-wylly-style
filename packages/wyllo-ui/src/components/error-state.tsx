"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "../lib/utils"

interface ErrorStateProps {
  title: string
  description: string
  /** The icon displayed in the badge at the top. */
  icon: LucideIcon
  /**
   * Controls the icon badge treatment.
   * - "destructive" — bg-destructive with destructive-foreground icon and
   *   a destructive ring. Use for runtime errors.
   * - "neutral" — bg-background with muted-foreground icon and a neutral
   *   ring + elevation, matching EmptyState's icon treatment. Use for 404s.
   *
   * @default "destructive"
   */
  tone?: "destructive" | "neutral"
  /** Error detail shown below the description. Pass a ReactNode to use a
   *  custom component (e.g. CodeSnippet with copy support). Pass a string
   *  for a simple monospace block. */
  errorDetail?: React.ReactNode
  /** Slot for action buttons rendered below the content. */
  children?: React.ReactNode
  className?: string
}

export function ErrorState({
  title,
  description,
  icon: Icon,
  tone = "destructive",
  errorDetail,
  children,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "bg-background border border-border text-center",
        "rounded-xl p-14 w-full max-w-[620px]",
        className
      )}
    >
      <div className="flex justify-center">
        <div
          className={cn(
            "size-12 grid place-items-center rounded-xl",
            tone === "destructive"
              ? "bg-background shadow-[var(--elevation-floating)] ring-1 ring-destructive-border"
              : "bg-background shadow-[var(--elevation-floating)] ring-1 ring-border"
          )}
        >
          <Icon
            className={cn(
              "w-6 h-6",
              tone === "destructive"
                ? "text-destructive-foreground"
                : "text-muted-foreground"
            )}
          />
        </div>
      </div>

      <h2 className="label-lg mt-6">{title}</h2>
      <p className="p text-muted-foreground mt-1">{description}</p>

      {errorDetail && (
        <div className="mt-4 max-w-lg mx-auto text-left">
          {typeof errorDetail === "string" ? (
            <pre className="overflow-auto rounded-md border border-border bg-muted px-4 py-3 font-mono text-xs text-muted-foreground">
              {errorDetail}
            </pre>
          ) : (
            errorDetail
          )}
        </div>
      )}

      {children && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {children}
        </div>
      )}
    </div>
  )
}
