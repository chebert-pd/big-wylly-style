"use client"

import * as React from "react"
import { ArrowLeft } from "lucide-react"

import { cn } from "../../lib/utils"
import { PageContainer } from "../page-container"
import {
  usePageLayoutSize,
  type PageContainerSize,
} from "../page-layout/context"

export interface HeaderProps {
  /**
   * "sticky" — pins to the viewport top with bg-card/border/shadow,
   *   and condenses into a single-row compact layout when scrolled.
   * "fixed" — static page header with no background, border, or shadow.
   */
  variant?: "sticky" | "fixed"

  /** Page title rendered as an h1 */
  title: string

  /** Back button — renders an ArrowLeft icon + label to the left of the title, separated by a vertical divider */
  back?: { label?: string; onClick?: () => void; href?: string }

  /** Badge displayed inline next to the title */
  badge?: React.ReactNode

  /**
   * Metadata displayed below the title in the default state (sticky only).
   * Shifts inline to the right of the badge when the header is condensed on scroll.
   */
  metadata?: React.ReactNode

  /** Content displayed to the left of the action buttons (e.g. a summary stat or price) */
  rightMetadata?: React.ReactNode

  /** Action buttons displayed on the right — use Button size="md" */
  actions?: React.ReactNode

  /**
   * Content rendered between the heading row and tabs.
   * Use for inline metric panels or contextual summaries that are
   * less emphasized than the main page content.
   */
  subsection?: React.ReactNode

  /**
   * Tab navigation rendered below the heading row (sticky only).
   * Use TabsList with variant="line".
   */
  tabs?: React.ReactNode

  /**
   * Ref to the scroll container. When provided the component listens to
   * scroll events on that element. Falls back to window when omitted.
   */
  scrollContainerRef?: React.RefObject<HTMLElement | null>

  /**
   * Max-width preset applied to the Header's inner rows (heading, subsection, tabs).
   * The outer chrome (background, border, shadow) always spans full width.
   * Falls back to the surrounding PageLayout's size, then "lg" (1280px).
   */
  contentSize?: PageContainerSize

  className?: string
}

function Header({
  variant = "sticky",
  title,
  back,
  badge,
  metadata,
  rightMetadata,
  actions,
  subsection,
  tabs,
  scrollContainerRef,
  contentSize,
  className,
}: HeaderProps) {
  const [scrolled, setScrolled] = React.useState(false)
  const isSticky = variant === "sticky"
  const layoutSize = usePageLayoutSize()
  const innerSize: PageContainerSize = contentSize ?? layoutSize ?? "lg"

  React.useEffect(() => {
    if (!isSticky) return

    const target: EventTarget =
      scrollContainerRef?.current ?? window

    const getScrollY = () =>
      scrollContainerRef?.current
        ? scrollContainerRef.current.scrollTop
        : window.scrollY

    const onScroll = () => setScrolled(getScrollY() > 10)

    target.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions)
    onScroll() // set initial state

    return () => target.removeEventListener("scroll", onScroll)
  }, [isSticky, scrollContainerRef])

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        isSticky && [
          "sticky top-0 z-10",
          "bg-card",
          // Border bleeds full-width via the outer chrome. When tabs are present,
          // the TabsList's own border-b sits at the same Y/color and visually merges.
          "border-b border-border-subtle",
          "shadow-[var(--elevation-surface)]",
        ],
        className
      )}
    >
      {/* ── Heading row ─────────────────────────────────────────────── */}
      <PageContainer
        size={innerSize}
        className={cn(
          "flex flex-wrap items-center gap-x-4 gap-y-2 transition-[padding] duration-150",
          isSticky && scrolled ? "py-2" : "py-4"
        )}
      >
        {/* Back button */}
        {back && (
          <div className="flex items-center border-r border-border pr-4">
            <a
              href={back.href ?? "#"}
              onClick={back.onClick}
              className="flex items-center gap-2 rounded-md px-2 py-1 p-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              {back.label ?? "Back"}
            </a>
          </div>
        )}

        {/* Left ── title + badge + optional metadata */}
        <div
          className={cn(
            "min-w-0 flex-1",
            isSticky && scrolled
              ? "flex flex-row items-center gap-3"
              : "flex flex-col items-start"
          )}
        >
          {/* Title + badge */}
          <div className="flex shrink-0 items-center gap-3">
            <h1
              className={cn(
                "shrink-0 font-[620] text-foreground",
                isSticky && scrolled
                  ? "text-base leading-6 tracking-normal"
                  : "h1"
              )}
            >
              {title}
            </h1>
            {badge}
          </div>

          {/* Metadata: below title in default; inline on scroll (sticky only) */}
          {metadata && isSticky && (
            <div
              className={cn(
                "text-muted-foreground",
                scrolled ? "p-sm ml-auto min-w-0 truncate" : "p mt-0.5 w-full"
              )}
            >
              {metadata}
            </div>
          )}
        </div>

        {/* Right ── optional right metadata + actions; wraps below left on small viewports */}
        {(rightMetadata || actions) && (
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:shrink-0 sm:justify-start">
            {rightMetadata && (
              <div
                className={cn(
                  "font-[620] text-foreground transition-all duration-150",
                  isSticky && scrolled ? "text-xs" : "text-base"
                )}
              >
                {rightMetadata}
              </div>
            )}
            {actions && (
              <div className="flex shrink-0 items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        )}
      </PageContainer>

      {/* ── Subsection slot ───────────────────────────────────────────── */}
      {subsection && (
        <PageContainer
          size={innerSize}
          data-scrolled={isSticky && scrolled ? "" : undefined}
          className={cn(
            "transition-all duration-150",
            isSticky && scrolled ? "pb-2" : "pb-4"
          )}
        >
          {subsection}
        </PageContainer>
      )}

      {/* ── Tabs slot (sticky only) ──────────────────────────────────── */}
      {isSticky && tabs && (
        <PageContainer size={innerSize}>{tabs}</PageContainer>
      )}
    </div>
  )
}

export { Header }
