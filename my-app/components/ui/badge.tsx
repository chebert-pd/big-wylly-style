import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, Minus } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground border border-border-primary-subtle [a&]:hover:bg-accent/90",
        secondary:
          "bg-muted text-muted-foreground border border-border [a&]:hover:bg-muted/80",
        destructive: "bg-destructive text-destructive-foreground border border-destructive-border",
        outline:
          "bg-card border-border-subtle text-muted-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        success: "bg-success text-success-foreground border border-success-border",
        warning: "bg-warning text-warning-foreground border border-warning-border",
        info: "bg-info text-info-foreground border border-info-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

type BadgeIconProps = {
  icon: React.ElementType
  className?: string
}

function BadgeIcon({ icon: Icon, className }: BadgeIconProps) {
  return (
    <Icon
      aria-hidden="true"
      className={cn("size-4 shrink-0 text-muted-foreground", className)}
    />
  )
}

type BadgeAvatarProps = {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md"
  className?: string
}

function BadgeAvatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: BadgeAvatarProps) {
  const sizeClass = size === "sm" ? "size-4" : "size-5"

  return (
    <span
      data-slot="badge-avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-subtle bg-card text-foreground",
        sizeClass,
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          className="h-full w-full object-cover"
        />
      ) : null}
      {!src ? (
        <span className={cn("label-sm leading-none", size === "sm" ? "text-[10px]" : "text-[11px]")}
        >
          {(fallback ?? "").slice(0, 2).toUpperCase()}
        </span>
      ) : null}
    </span>
  )
}

type BadgeAvatarGroupProps = React.HTMLAttributes<HTMLSpanElement>

function BadgeAvatarGroup({ className, ...props }: BadgeAvatarGroupProps) {
  return (
    <span
      data-slot="badge-avatar-group"
      className={cn("inline-flex items-center -space-x-2", className)}
      {...props}
    />
  )
}

type BadgeIndicatorVariant = "default" | "success" | "error" | "warning" | "info"

type BadgeIndicatorProps = {
  variant?: BadgeIndicatorVariant
  pulse?: boolean
  className?: string
}

function BadgeIndicator({
  variant = "default",
  pulse = false,
  className,
}: BadgeIndicatorProps) {
  const toneClass =
    variant === "success"
      ? "text-success"
      : variant === "error"
        ? "text-destructive"
        : variant === "warning"
          ? "text-warning"
          : variant === "info"
            ? "text-info"
            : "text-primary"

  return (
    <span
      data-slot="badge-indicator"
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-2 shrink-0 rounded-full bg-current",
        toneClass,
        pulse &&
          "after:absolute after:inset-0 after:rounded-full after:animate-ping after:bg-current after:opacity-40",
        className
      )}
    />
  )
}

type BadgeDeltaProps = {
  delta: number
  className?: string
}

function BadgeDelta({ delta, className }: BadgeDeltaProps) {
  const isUp = delta > 0
  const isDown = delta < 0

  const Icon = isUp ? ChevronUp : isDown ? ChevronDown : Minus

  const toneClass = isUp
    ? "text-success-foreground"
    : isDown
      ? "text-destructive-foreground"
      : "text-muted-foreground"

  return (
    <span
      data-slot="badge-delta"
      className={cn("inline-flex items-center gap-1", toneClass, className)}
    >
      <Icon aria-hidden="true" className="size-3" />
      <span className="tabular-nums">{Math.abs(delta)}</span>
    </span>
  )
}

type BadgeActionProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean
}

function BadgeAction({ className, asChild = false, ...props }: BadgeActionProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="badge-action"
      type={asChild ? undefined : "button"}
      className={cn(
        // Ghost-button-ish, but sized for badges
        "-my-0.5 -mr-1 inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

export {
  Badge,
  badgeVariants,
  BadgeAction,
  BadgeAvatar,
  BadgeAvatarGroup,
  BadgeDelta,
  BadgeIcon,
  BadgeIndicator,
}
