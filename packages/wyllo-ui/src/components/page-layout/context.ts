"use client"

import * as React from "react"

type PageContainerSize = "sm" | "md" | "lg" | "xl" | "full"

type PageLayoutContextValue = {
  size: PageContainerSize
}

const PageLayoutContext = React.createContext<PageLayoutContextValue | null>(null)

/**
 * Read the active container size from the nearest PageLayout ancestor.
 * Returns null when used outside a PageLayout — callers fall back to their own default.
 */
function usePageLayoutSize(): PageContainerSize | null {
  return React.useContext(PageLayoutContext)?.size ?? null
}

export { PageLayoutContext, usePageLayoutSize }
export type { PageContainerSize, PageLayoutContextValue }
