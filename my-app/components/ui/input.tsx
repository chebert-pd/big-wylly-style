import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  size?: "default" | "sm" | "inline"
}

function Input({ className, type, size = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 rounded-lg border border-input bg-secondary shadow-xs transition-[color,box-shadow,background-color] outline-none focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        size === "default" && "h-9 px-3 py-1 text-base md:text-sm",
        size === "sm" && "h-8 px-2 text-sm",
        size === "inline" &&
          "h-8 w-auto px-2 text-sm font-[525] bg-transparent border-0 border-b border-input rounded-t-lg rounded-b-none shadow-none text-primary caret-primary opacity-90 transition-[border-width,border-color,background-color,color,opacity] duration-200 ease-out hover:bg-accent/60 hover:opacity-100 focus:bg-accent focus:opacity-100 focus:border-primary focus:border-b-2 focus-visible:ring-0 focus-visible:outline-none",
        "aria-invalid:border-destructive aria-invalid:ring-destructive focus-visible:aria-invalid:ring-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
