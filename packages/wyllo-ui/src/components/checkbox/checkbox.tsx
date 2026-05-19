"use client"

import * as React from "react"
import { CheckIcon, MinusIcon } from "lucide-react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "../../lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer relative size-4 shrink-0 rounded-[4px] border transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50\n\nborder-input bg-card\n\nhover:border-primary/50\n\n data-[state=checked]:bg-primary\n data-[state=checked]:border-primary\n data-[state=checked]:text-primary-foreground\n\n data-[state=checked]:shadow-[inset_0_2px_0_rgba(255,255,255,0.18)]\n\n data-[state=indeterminate]:bg-primary\n data-[state=indeterminate]:border-primary\n data-[state=indeterminate]:text-primary-foreground\n data-[state=indeterminate]:shadow-[inset_0_2px_0_rgba(255,255,255,0.18)]\n\n aria-invalid:border-destructive\n aria-invalid:ring-destructive/20\n dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-opacity duration-150"
      >
        <CheckIcon className="size-3.5 group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon className="size-3.5 hidden group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
