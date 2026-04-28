import * as React from "react"

import { cn } from "../lib/utils"

type CardProps = React.ComponentProps<"div"> & {
  size?: "default" | "sm" | "xs"
  level?: number
  tone?: "primary" | "secondary" | "ghost"
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
    borderTone ?? (computedTone === "ghost" ? "subtle" : level === 1 ? "primary" : "subtle")

  const computedSize =
    size ?? (level > 2 ? "xs" : level > 1 ? "sm" : "default")

  const hasElevation = computedTone !== "ghost" && level <= 1

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
        // ghost: no background class
        // Border tone
        "data-[border-tone=primary]:border-[var(--border)]",
        "data-[border-tone=subtle]:border-[var(--border-subtle)]",
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
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-6 pt-6 pb-0 has-data-[slot=card-action]:grid-cols-[1fr_auto] group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pt-4 group-data-[size=xs]/card:px-3 group-data-[size=xs]/card:pt-2 data-[divider=true]:border-b data-[divider=true]:border-[var(--border)] data-[divider=true]:pb-6 group-data-[size=sm]/card:data-[divider=true]:pb-4 group-data-[size=xs]/card:data-[divider=true]:pb-2",
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
        "label-lg leading-tight group-data-[size=sm]/card:text-sm group-data-[size=sm]/card:font-[525] group-data-[size=xs]/card:text-xs group-data-[size=xs]/card:font-[520]",
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
        "p text-muted-foreground group-data-[size=sm]/card:font-[425] group-data-[size=xs]/card:text-xs group-data-[size=xs]/card:font-[420]",
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
        "px-6 pt-6 pb-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pt-3 group-data-[size=sm]/card:pb-3 group-data-[size=xs]/card:px-3 group-data-[size=xs]/card:py-2",
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
        "mt-auto flex items-center px-6 py-4 bg-secondary text-secondary-foreground group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3 group-data-[size=xs]/card:px-3 group-data-[size=xs]/card:py-2 data-[divider=true]:border-t data-[divider=true]:border-[var(--border)]",
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
