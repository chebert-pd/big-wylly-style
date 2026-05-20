"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { PageContainer } from "../page-container"
import {
  PageLayoutContext,
  usePageLayoutSize,
  type PageContainerSize,
} from "./context"

type PageLayoutVariant = "stack" | "two-column" | "full"
type PageLayoutRatio = "1:1" | "2:1" | "3:1"
type PageLayoutAsideSide = "left" | "right"
type PageLayoutGap = "none" | "sm" | "md" | "lg"

/* ─── Two-column ratios ────────────────────────────────────────────────────── */

const ratioClasses: Record<
  PageLayoutRatio,
  { main: string; aside: string }
> = {
  "1:1": { main: "md:basis-0 md:grow", aside: "md:basis-0 md:grow" },
  "2:1": { main: "md:basis-0 md:grow-[2]", aside: "md:basis-0 md:grow" },
  "3:1": { main: "md:basis-0 md:grow-[3]", aside: "md:basis-0 md:grow" },
}

const gapClasses: Record<PageLayoutGap, string> = {
  none: "gap-0",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
}

/* ─── Slot context for two-column ──────────────────────────────────────────── */

type SlotContextValue = {
  ratio: PageLayoutRatio
  asideSide: PageLayoutAsideSide
}

const SlotContext = React.createContext<SlotContextValue | null>(null)

function useSlotContext(componentName: string): SlotContextValue {
  const ctx = React.useContext(SlotContext)
  if (!ctx) {
    throw new Error(
      `${componentName} must be used inside a <PageLayout variant="two-column">.`,
    )
  }
  return ctx
}

/* ─── Body / Main / Aside slot components ──────────────────────────────────── */

type PageLayoutBodyProps = React.ComponentProps<"div">

function PageLayoutBody({
  className,
  children,
  ...props
}: PageLayoutBodyProps) {
  return (
    <div data-slot="page-layout-body" className={className} {...props}>
      {children}
    </div>
  )
}

type PageLayoutMainProps = React.ComponentProps<"div">

function PageLayoutMain({ className, children, ...props }: PageLayoutMainProps) {
  const { ratio } = useSlotContext("PageLayout.Main")
  return (
    <div
      data-slot="page-layout-main"
      className={cn("min-w-0 w-full", ratioClasses[ratio].main, className)}
      {...props}
    >
      {children}
    </div>
  )
}

type PageLayoutAsideProps = React.ComponentProps<"aside">

function PageLayoutAside({
  className,
  children,
  ...props
}: PageLayoutAsideProps) {
  const { ratio } = useSlotContext("PageLayout.Aside")
  return (
    <aside
      data-slot="page-layout-aside"
      className={cn("min-w-0 w-full", ratioClasses[ratio].aside, className)}
      {...props}
    >
      {children}
    </aside>
  )
}

/* ─── PageLayout ───────────────────────────────────────────────────────────── */

type PageLayoutProps = React.ComponentProps<"div"> & {
  /**
   * Page structure. "stack" = vertical column, "two-column" = main + aside flex row
   * that stacks on narrow viewports, "full" = no max-width container, all children full-bleed.
   */
  variant?: PageLayoutVariant
  /**
   * Container max-width preset shared with descendants (Header, PageLayout.Body,
   * PageLayout.Main + Aside) via context.
   */
  size?: PageContainerSize
  /** Vertical gap between top-level children. Also the gap between Main and Aside in two-column. */
  gap?: PageLayoutGap
  /** Two-column only — main:aside flex-grow ratio. Defaults to "2:1". */
  ratio?: PageLayoutRatio
  /** Two-column only — which side the aside renders on. Defaults to "right". */
  asideSide?: PageLayoutAsideSide
}

function PageLayout({
  variant = "stack",
  size = "lg",
  gap = "md",
  ratio = "2:1",
  asideSide = "right",
  className,
  children,
  ...props
}: PageLayoutProps) {
  const contextValue = React.useMemo(() => ({ size }), [size])

  if (variant === "full") {
    return (
      <PageLayoutContext.Provider value={contextValue}>
        <div
          data-slot="page-layout"
          data-variant="full"
          className={cn("flex w-full flex-col", gapClasses[gap], className)}
          {...props}
        >
          {children}
        </div>
      </PageLayoutContext.Provider>
    )
  }

  // Walk children, separating slot elements from full-bleed siblings.
  // - Body  → wrapped in PageContainer at the child's position
  // - Main + Aside → collected; rendered as a constrained flex-row at the
  //   position of the first Main/Aside encountered (two-column only)
  // - Other → rendered as-is, full-bleed
  const childArray = React.Children.toArray(children)
  const rendered: React.ReactNode[] = []
  let columnsRendered = false
  let mainChild: React.ReactElement | null = null
  let asideChild: React.ReactElement | null = null

  if (variant === "two-column") {
    for (const child of childArray) {
      if (React.isValidElement(child)) {
        if (child.type === PageLayoutMain) mainChild = child
        else if (child.type === PageLayoutAside) asideChild = child
      }
    }
  }

  const renderColumns = (key: React.Key) => (
    <PageContainer
      key={key}
      size={size}
      data-slot="page-layout-columns"
      data-ratio={ratio}
      data-aside-side={asideSide}
      className={cn(
        "flex flex-col md:flex-row",
        asideSide === "left" && "md:flex-row-reverse",
        gapClasses[gap],
      )}
    >
      {mainChild}
      {asideChild}
    </PageContainer>
  )

  childArray.forEach((child, i) => {
    if (React.isValidElement(child)) {
      if (child.type === PageLayoutBody) {
        rendered.push(
          <PageContainer
            key={child.key ?? `body-${i}`}
            size={size}
            className={(child.props as PageLayoutBodyProps).className}
          >
            {(child.props as PageLayoutBodyProps).children}
          </PageContainer>,
        )
        return
      }
      if (child.type === PageLayoutMain || child.type === PageLayoutAside) {
        if (variant === "two-column" && !columnsRendered) {
          rendered.push(renderColumns(`columns-${i}`))
          columnsRendered = true
        }
        return
      }
    }
    rendered.push(child)
  })

  return (
    <PageLayoutContext.Provider value={contextValue}>
      <SlotContext.Provider value={{ ratio, asideSide }}>
        <div
          data-slot="page-layout"
          data-variant={variant}
          className={cn("flex w-full flex-col", gapClasses[gap], className)}
          {...props}
        >
          {rendered}
        </div>
      </SlotContext.Provider>
    </PageLayoutContext.Provider>
  )
}

/* ─── Compound exports ─────────────────────────────────────────────────────── */

PageLayout.Body = PageLayoutBody
PageLayout.Main = PageLayoutMain
PageLayout.Aside = PageLayoutAside

export {
  PageLayout,
  PageLayoutBody,
  PageLayoutMain,
  PageLayoutAside,
  usePageLayoutSize,
}
export type {
  PageLayoutProps,
  PageLayoutVariant,
  PageLayoutRatio,
  PageLayoutAsideSide,
  PageLayoutGap,
  PageLayoutBodyProps,
  PageLayoutMainProps,
  PageLayoutAsideProps,
  PageContainerSize,
}
