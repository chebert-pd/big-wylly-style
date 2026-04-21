"use client"

import * as React from "react"

import { cn } from "../lib/utils"
import { Check } from "lucide-react"

type StepStatus = "complete" | "current" | "upcoming"
type StepsVariant = "progress" | "display"

const StepsContext = React.createContext<StepsVariant>("progress")

type StepsProps = React.ComponentProps<"ol"> & {
  /**
   * "progress" — tracks completion with primary highlights and check marks (default).
   * "display"  — shows a static process; all dots use muted styling, no primary border.
   */
  variant?: StepsVariant
  className?: string
}

function Steps({ variant = "progress", className, ...props }: StepsProps) {
  return (
    <StepsContext.Provider value={variant}>
      <ol
        data-slot="steps"
        className={cn("flex flex-col", className)}
        {...props}
      />
    </StepsContext.Provider>
  )
}

type StepProps = React.ComponentProps<"li"> & {
  /** Controls the visual treatment of the step indicator. Ignored when variant="display". */
  status: StepStatus
  /** Step number displayed in the dot when not complete. */
  number?: number
  /** Whether this is the last step (hides the connector line). */
  last?: boolean
  className?: string
}

function Step({
  status,
  number,
  last = false,
  className,
  children,
  ...props
}: StepProps) {
  const variant = React.useContext(StepsContext)

  return (
    <li
      data-slot="step"
      data-status={status}
      className={cn(
        "grid grid-cols-[auto_1fr] gap-2 md:gap-6 items-start",
        !last && "pb-10",
        className
      )}
      {...props}
    >
      <StepIndicator status={status} number={number} last={last} variant={variant} />
      <div className="min-w-0">{children}</div>
    </li>
  )
}

function StepIndicator({
  status,
  number,
  last,
  variant,
}: {
  status: StepStatus
  number?: number
  last: boolean
  variant: StepsVariant
}) {
  const isDisplay = variant === "display"

  return (
    <div className="relative flex flex-col items-center self-stretch">
      {/* Connector line */}
      {!last && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute left-1/2 -translate-x-1/2 top-5 md:top-8 -bottom-10 w-px",
            !isDisplay && status === "complete" ? "bg-primary" : "bg-border"
          )}
        />
      )}

      {/* Dot */}
      <div
        className={cn(
          "relative flex size-5 md:size-8 items-center justify-center rounded-full border text-xs md:text-sm font-[650]",
          isDisplay
            ? "bg-card text-muted-foreground border-border"
            : status === "complete"
              ? "bg-primary text-primary-foreground border-primary"
              : status === "current"
                ? "bg-card text-foreground border-primary"
                : "bg-card text-muted-foreground border-border"
        )}
      >
        {!isDisplay && status === "complete" ? (
          <Check className="size-3.5 md:size-4" />
        ) : (
          number != null && <span>{number}</span>
        )}
      </div>
    </div>
  )
}

export { Steps, Step }
export type { StepStatus, StepsVariant, StepsProps, StepProps }
