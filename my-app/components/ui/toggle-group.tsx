"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  Pick<VariantProps<typeof toggleVariants>, "size" | "variant"> & {
    isMultiple: boolean
  }
>({
  size: "default",
  variant: "outline",
  isMultiple: false,
})

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  // Read type from props without removing it so it still spreads to the primitive
  const isMultiple =
    (props as { type?: "single" | "multiple" }).type === "multiple"

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant="outline"
      data-size={size}
      className={cn(
        "group/toggle-group inline-flex w-fit items-center rounded-lg",
        // single → connected strip (gap-0), multiple → spaced pills (gap-1)
        isMultiple ? "gap-1" : "gap-0",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant: "outline", size, isMultiple }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant="outline"
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: "outline",
          size: context.size || size,
        }),
        "w-auto min-w-0 shrink-0 focus:z-10 focus-visible:z-10",
        context.isMultiple
          ? // Multiple: each item is a standalone pill with full rounding + border
            "rounded-lg"
          : // Single: connected strip — collapse shared borders, round only the ends
            "rounded-none first:rounded-l-lg last:rounded-r-lg border-l-0 first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
