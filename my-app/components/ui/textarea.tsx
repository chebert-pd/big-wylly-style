import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground transition-[color,box-shadow] outline-none focus-visible:bg-background focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:ring-destructive focus-visible:aria-invalid:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
