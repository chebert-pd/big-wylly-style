"use client"

import * as React from "react"

import { cn } from "../lib/utils"

type TimelineOrientation = "vertical" | "horizontal"

type TimelineContextValue = {
  orientation: TimelineOrientation
  alternating: boolean
}

const TimelineContext = React.createContext<TimelineContextValue>({
  orientation: "vertical",
  alternating: false,
})

type TimelineItemContextValue = {
  step: number
  last: boolean
}

const TimelineItemContext = React.createContext<TimelineItemContextValue>({
  step: 1,
  last: false,
})

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */

type TimelineProps = React.ComponentProps<"ol"> & {
  orientation?: TimelineOrientation
  alternating?: boolean
}

function Timeline({
  orientation = "vertical",
  alternating = false,
  className,
  ...props
}: TimelineProps) {
  return (
    <TimelineContext.Provider value={{ orientation, alternating }}>
      <ol
        data-slot="timeline"
        data-orientation={orientation}
        className={cn(
          "group/timeline",
          orientation === "vertical" ? "flex flex-col" : "flex flex-row",
          className
        )}
        {...props}
      />
    </TimelineContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineItem                                                       */
/* ------------------------------------------------------------------ */

type TimelineItemProps = React.ComponentProps<"li"> & {
  step?: number
  last?: boolean
}

function TimelineItem({
  step = 1,
  last = false,
  className,
  children,
  ...props
}: TimelineItemProps) {
  const { orientation, alternating } = React.useContext(TimelineContext)
  const isFlipped = alternating && step % 2 === 0

  return (
    <TimelineItemContext.Provider value={{ step, last }}>
      <li
        data-slot="timeline-item"
        data-flip={isFlipped || undefined}
        className={cn(
          "group/timeline-item",
          orientation === "vertical" && [
            "grid",
            alternating
              ? "grid-cols-[1fr_auto_1fr]"
              : "grid-cols-[auto_auto_1fr]",
          ],
          orientation === "horizontal" && "flex flex-col items-center flex-1 text-center",
          className
        )}
        {...props}
      >
        {children}
      </li>
    </TimelineItemContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineIndicator                                                  */
/* ------------------------------------------------------------------ */

type TimelineIndicatorProps = React.ComponentProps<"div"> & {
  /** "dot" renders a tiny subtle dot. Default auto-detects: small filled dot when empty, larger outline circle with children. */
  variant?: "dot"
}

function TimelineIndicator({
  variant,
  className,
  children,
  ...props
}: TimelineIndicatorProps) {
  const { orientation } = React.useContext(TimelineContext)
  const { last, step } = React.useContext(TimelineItemContext)

  const isDot = variant === "dot"
  const hasChildren = !isDot && children != null

  // Horizontal layout
  if (orientation === "horizontal") {
    return (
      <div data-slot="timeline-indicator" className="relative w-full flex justify-center py-2">
        {step > 1 && (
          <div aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 left-0 right-1/2 h-px bg-border" />
        )}
        {!last && (
          <div aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 left-1/2 right-0 h-px bg-border" />
        )}
        {hasChildren ? (
          <div className={cn("relative z-10 flex items-center justify-center shrink-0 rounded-full size-6 border", !className && "border-border bg-card text-muted-foreground", className)} {...props}>
            {children}
          </div>
        ) : isDot ? (
          <div className={cn("relative z-10 shrink-0 size-2 rounded-full bg-border-subtle", className)} {...props} />
        ) : (
          <div className={cn("relative z-10 flex shrink-0 size-5 items-center justify-center", className)} {...props}>
            <span aria-hidden="true" className="absolute size-4 rounded-full bg-border-subtle" />
            <span className="relative block size-2 rounded-full bg-card border border-border" />
          </div>
        )}
      </div>
    )
  }

  // Vertical layout
  const lineTop = hasChildren ? "top-6" : isDot ? "top-3.5" : "top-5"

  return (
    <div
      data-slot="timeline-indicator"
      className="col-start-2 row-start-1 row-span-2 relative flex flex-col items-center self-stretch"
    >
      {/* Vertical connector line */}
      {!last && (
        <div
          aria-hidden="true"
          className={cn("absolute left-1/2 -translate-x-1/2 bottom-0 w-px bg-border", lineTop)}
        />
      )}
      {/* Dot */}
      {hasChildren ? (
        <div className={cn("relative z-10 flex items-center justify-center shrink-0 rounded-full size-6 border", !className && "border-border bg-card text-muted-foreground", className)} {...props}>
          {children}
        </div>
      ) : isDot ? (
        <div className={cn("relative z-10 shrink-0 size-2 rounded-full bg-border mt-[6px]", className)} {...props} />
      ) : (
        <div className={cn("relative z-10 flex shrink-0 size-5 items-center justify-center", className)} {...props}>
          <span aria-hidden="true" className="absolute size-4 rounded-full bg-border-subtle" />
          <span className="relative block size-2 rounded-full bg-card border border-border" />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineHeader                                                     */
/* ------------------------------------------------------------------ */

function TimelineHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(TimelineContext)

  return (
    <div
      data-slot="timeline-header"
      className={cn(
        orientation === "vertical" && [
          "col-start-3 row-start-1 pl-3 flex items-start gap-2",
          "group-data-flip/timeline-item:col-start-1 group-data-flip/timeline-item:flex-row-reverse group-data-flip/timeline-item:text-right group-data-flip/timeline-item:pr-3 group-data-flip/timeline-item:pl-0",
        ],
        orientation === "horizontal" && "pt-2",
        className
      )}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineDate                                                       */
/* ------------------------------------------------------------------ */

function TimelineDate({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(TimelineContext)

  return (
    <div
      data-slot="timeline-date"
      className={cn(
        "p-sm text-muted-foreground shrink-0",
        orientation === "vertical" && [
          "col-start-1 row-start-1 self-center text-right pr-3 min-w-32",
          "group-data-flip/timeline-item:col-start-3 group-data-flip/timeline-item:text-left group-data-flip/timeline-item:pl-3 group-data-flip/timeline-item:pr-0",
        ],
        orientation === "horizontal" && "order-first pb-2",
        className
      )}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineTitle                                                      */
/* ------------------------------------------------------------------ */

function TimelineTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(TimelineContext)

  return (
    <div
      data-slot="timeline-title"
      className={cn(
        "label-md",
        orientation === "vertical" && [
          "col-start-3 row-start-1 self-center",
          "group-data-flip/timeline-item:col-start-1 group-data-flip/timeline-item:text-right",
        ],
        orientation === "horizontal" && "pt-2",
        className
      )}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  TimelineContent                                                    */
/* ------------------------------------------------------------------ */

function TimelineContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(TimelineContext)

  return (
    <div
      data-slot="timeline-content"
      className={cn(
        "p text-muted-foreground",
        orientation === "vertical" && [
          "col-start-3 row-start-2 pl-3 pt-1 pb-8",
          "group-data-flip/timeline-item:col-start-1 group-data-flip/timeline-item:text-right group-data-flip/timeline-item:pr-3 group-data-flip/timeline-item:pl-0",
        ],
        orientation === "horizontal" && "pt-1",
        className
      )}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineHeader,
  TimelineDate,
  TimelineTitle,
  TimelineContent,
}

export type {
  TimelineOrientation,
  TimelineProps,
  TimelineItemProps,
  TimelineIndicatorProps,
}
