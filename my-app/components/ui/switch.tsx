"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer data-[state=checked]:border-[var(--violet-58)] data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 group/switch inline-flex shrink-0 items-center rounded-full border data-[state=unchecked]:border-border transition-colors duration-200 ease-out outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full transition-all duration-200 ease-out group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 bg-gradient-to-b from-[var(--gray-98)] to-[var(--gray-94)] dark:from-[var(--gray-94)] dark:to-[var(--gray-88)] shadow-[0_3px_6px_oklch(0.25_0.01_286.45/0.15)] shadow-[inset_0_1px_1px_var(--gray-98)] shadow-[inset_0_-1px_1px_var(--gray-91)] data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-[var(--violet-95)] data-[state=checked]:to-[var(--violet-89)] data-[state=checked]:shadow-[0_3px_6px_oklch(0.25_0.05_286.45/0.18)] data-[state=checked]:shadow-[inset_0_1px_1px_var(--violet-95)] data-[state=checked]:shadow-[inset_0_-1px_1px_var(--violet-58)] data-[state=unchecked]:border data-[state=unchecked]:border-border data-[state=checked]:border data-[state=checked]:border-[var(--violet-58)]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
