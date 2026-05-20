"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import {
  usePageLayoutSize,
  type PageContainerSize,
} from "../page-layout/context"

const sizeClasses: Record<PageContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-8xl",
  full: "",
}

type PageContainerProps = React.ComponentProps<"div"> & {
  /**
   * Max-width preset, mapped onto Tailwind's container scale:
   * sm = 3xl (768px), md = 5xl (1024px), lg = 7xl (1280px),
   * xl = 8xl (1440px, custom token), full = no constraint.
   * When omitted, reads from the surrounding PageLayout's size, then falls back to "lg".
   */
  size?: PageContainerSize
}

function PageContainer({
  size,
  className,
  children,
  ...props
}: PageContainerProps) {
  const layoutSize = usePageLayoutSize()
  const resolved: PageContainerSize = size ?? layoutSize ?? "lg"
  return (
    <div
      data-slot="page-container"
      data-size={resolved}
      className={cn("mx-auto w-full px-6", sizeClasses[resolved], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { PageContainer }
export type { PageContainerProps }
export type { PageContainerSize } from "../page-layout/context"
