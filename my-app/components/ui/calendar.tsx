"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("relative p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-2",
        month_caption: "flex h-9 items-center justify-center",
        caption_label: "label-md",
        nav: "absolute inset-x-0 top-3 z-10 flex items-center justify-between px-3",
        button_previous: [
          "h-7 w-7 flex items-center justify-center",
          "rounded border border-border bg-background",
          "text-muted-foreground hover:bg-muted hover:text-foreground",
          "transition-colors disabled:opacity-30 disabled:pointer-events-none",
        ].join(" "),
        button_next: [
          "h-7 w-7 flex items-center justify-center",
          "rounded border border-border bg-background",
          "text-muted-foreground hover:bg-muted hover:text-foreground",
          "transition-colors disabled:opacity-30 disabled:pointer-events-none",
        ].join(" "),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-8 h-8 flex items-center justify-center label-sm text-muted-foreground",
        week: "flex",
        day: "relative p-0 text-center",
        day_button: [
          "h-8 w-8 text-sm rounded",
          "hover:bg-muted transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-30",
        ].join(" "),
        // Selected (range start / end / single)
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        // Range edges — square off the connecting side
        range_start: "!rounded-r-none",
        range_end: "!rounded-l-none",
        // Middle of a range — lighter fill, no rounding
        range_middle: "!bg-primary/15 !text-foreground !rounded-none",
        today: "font-semibold",
        outside: "opacity-30",
        disabled: "opacity-30",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
