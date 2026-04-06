import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg label-md transition-colors transition-shadow duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-[var(--elevation-surface)] hover:bg-primary/80 hover:shadow-[var(--elevation-floating)] active:translate-y-[0.5px] active:shadow-[var(--elevation-surface)]",
        destructive:
          "bg-[var(--destructive-solid)] text-[var(--destructive-solid-foreground)] shadow-[var(--elevation-surface)] hover:bg-[var(--destructive-border)] hover:shadow-[var(--elevation-floating)] active:translate-y-[0.5px] active:shadow-[var(--elevation-surface)] focus-visible:ring-[var(--destructive-solid)]/30",
        outline:
          "border border-border bg-background text-foreground shadow-[var(--elevation-surface)] hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-border dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--elevation-surface)] hover:bg-secondary/70 hover:shadow-[var(--elevation-floating)] active:translate-y-[0.5px] active:shadow-[var(--elevation-surface)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "bg-transparent p-0 h-auto shadow-none text-[var(--link)] hover:text-[var(--link-hover)] hover:underline underline-offset-4 hover:bg-transparent active:translate-y-0 focus-visible:ring-0 focus-visible:border-transparent rounded-none font-normal text-base leading-normal",
      },
      size: {
        xs: "h-6 gap-1 rounded-lg px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        md: "h-9 px-4 py-2 has-[>svg]:px-3",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-lg",
      },
      iconOnly: {
        true: "aspect-square px-0",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      iconOnly: false,
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  iconOnly = false,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    iconOnly?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly ? "true" : "false"}
      className={cn(buttonVariants({ variant, size, iconOnly, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
