"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"

type ChoiceCardProps = {
  disabled?: boolean
  htmlFor: string
  className?: string
  control?: React.ReactNode
  controlPosition?: "left" | "right"
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
}

export function ChoiceCard({
  disabled = false,
  htmlFor,
  className,
  control,
  controlPosition = "right",
  icon,
  title,
  description,
}: ChoiceCardProps) {
  return (
    <FieldLabel
      htmlFor={htmlFor}
      className={cn(
        // Base visual container
        "group block w-full rounded-xl border border-input bg-card p-0",
        "transition-[background-color,color,border-color,box-shadow] duration-150 ease-out",

        // Hover
        "hover:bg-accent hover:text-accent-foreground",

        // Selected (detect checked control inside via :has([data-state=checked]))
        "has-[[data-state=checked]]:border-primary",
        "has-[[data-state=checked]]:ring-2",
        "has-[[data-state=checked]]:ring-primary/40",

        // Selected text/icon color (avoid `group-has` so we only rely on `has-*`)
        "has-[[data-state=checked]]:[&_[data-choicecard=icon]]:text-accent-foreground",
        "has-[[data-state=checked]]:[&_[data-choicecard=title]]:text-accent-foreground",

        disabled && "opacity-60 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
    >
      <Field
        orientation="horizontal"
        className="items-start gap-3 p-4 w-full border-0 bg-transparent"
      >
        {controlPosition === "left" && control && (
          <div className="mt-1 shrink-0">{control}</div>
        )}

        <FieldContent className="flex-1 gap-1">
          {icon && (
            <div
              data-choicecard="icon"
              className="mb-1 text-foreground group-hover:text-accent-foreground"
            >
              {icon}
            </div>
          )}

          <FieldTitle
            data-choicecard="title"
            className="text-foreground group-hover:text-accent-foreground"
          >
            {title}
          </FieldTitle>

          {description && (
            <FieldDescription className="text-muted-foreground group-hover:text-accent-foreground/80">
              {description}
            </FieldDescription>
          )}
        </FieldContent>

        {controlPosition === "right" && control && (
          <div className="mt-1 shrink-0 ml-auto">{control}</div>
        )}
      </Field>
    </FieldLabel>
  )
}