import * as React from "react"

import { cn } from "@/lib/utils"

type CardProps = React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  level?: number
  tone?: "primary" | "secondary"
  borderTone?: "primary" | "subtle"
}

function Card({
  className,
  size,
  level = 1,
  tone,
  borderTone,
  ...props
}: CardProps) {
  const computedTone =
    tone ?? (level % 2 === 1 ? "primary" : "secondary")

  const computedBorderTone =
    borderTone ?? (level === 1 ? "primary" : "subtle")

  const computedSize =
    size ?? (level > 1 ? "sm" : "default")

  const hasElevation = level <= 1

  return (
    <div
      data-slot="card"
      data-size={computedSize}
      data-tone={computedTone}
      data-border-tone={computedBorderTone}
      className={cn(
        "group/card flex flex-col rounded-xl border overflow-hidden text-card-foreground",
        hasElevation && "shadow-[var(--elevation-surface)]",
        // Surface tone
        "data-[tone=primary]:bg-card",
        "data-[tone=secondary]:bg-secondary",
        // Border tone
        "data-[border-tone=primary]:border-border",
        "data-[border-tone=subtle]:border-muted",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-5 pt-5 pb-0 has-data-[slot=card-action]:grid-cols-[1fr_auto] group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pt-4 data-[divider=true]:border-b data-[divider=true]:border-border data-[divider=true]:pb-5 group-data-[size=sm]/card:data-[divider=true]:pb-4",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "label-lg leading-tight group-data-[size=sm]/card:text-sm group-data-[size=sm]/card:font-[525]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "p text-muted-foreground group-data-[size=sm]/card:text-xs group-data-[size=sm]/card:font-[425]",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-5 pt-4 pb-4 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pt-3 group-data-[size=sm]/card:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-5 py-4 bg-accent/70 dark:bg-accent/40 text-accent-foreground group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3 data-[divider=true]:border-t data-[divider=true]:border-border",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
