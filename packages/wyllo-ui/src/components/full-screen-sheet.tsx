"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "../lib/utils"

/* ─── Context ──────────────────────────────────────────────────────────────── */

type SheetContextValue = {
  scrolled: boolean
  bodyRef: React.RefObject<HTMLDivElement | null>
}

const SheetContext = React.createContext<SheetContextValue>({
  scrolled: false,
  bodyRef: { current: null },
})

/* ─── Root ─────────────────────────────────────────────────────────────────── */

function FullScreenSheet({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const [scrolled, setScrolled] = React.useState(false)
  const bodyRef = React.useRef<HTMLDivElement>(null)

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Listen to scroll on the body ref
  React.useEffect(() => {
    if (!open) {
      setScrolled(false)
      return
    }
    const el = bodyRef.current
    if (!el) return

    const onScroll = () => setScrolled(el.scrollTop > 10)
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [open])

  if (!open) return null

  return (
    <SheetContext.Provider value={{ scrolled, bodyRef }}>
      <div
        data-slot="full-screen-sheet"
        className="fixed inset-0 z-50 flex h-dvh flex-col bg-background animate-in fade-in-0 duration-200"
      >
        {children}
      </div>
    </SheetContext.Provider>
  )
}

/* ─── Header ───────────────────────────────────────────────────────────────── */

function FullScreenSheetHeader({
  onClose,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  onClose: () => void
}) {
  const { scrolled } = React.useContext(SheetContext)

  return (
    <div
      data-slot="full-screen-sheet-header"
      className={cn(
        "shrink-0 border-b border-border bg-card transition-shadow duration-150",
        scrolled && "shadow-[var(--elevation-surface)]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-7xl items-start justify-between gap-4 px-6 transition-[padding] duration-150",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        <div
          className={cn(
            "min-w-0 flex-1 transition-all duration-150",
            scrolled ? "flex flex-row items-center gap-3" : "flex flex-col gap-1",
          )}
        >
          {children}
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}

/* ─── Header sub-slots ─────────────────────────────────────────────────────── */

function FullScreenSheetTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  const { scrolled } = React.useContext(SheetContext)

  return (
    <h2
      data-slot="full-screen-sheet-title"
      className={cn(
        "truncate font-[620] transition-[font-size] duration-150",
        scrolled ? "text-sm" : "text-base",
        className,
      )}
      {...props}
    />
  )
}

function FullScreenSheetDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { scrolled } = React.useContext(SheetContext)

  return (
    <div
      data-slot="full-screen-sheet-description"
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground transition-all duration-150",
        scrolled ? "p-sm truncate" : "p-sm",
        className,
      )}
      {...props}
    />
  )
}

/* ─── Actions (sits inside header, to the left of the close button) ────── */

function FullScreenSheetActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="full-screen-sheet-actions"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

/* ─── Body ─────────────────────────────────────────────────────────────────── */

function FullScreenSheetBody({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { bodyRef } = React.useContext(SheetContext)

  return (
    <div
      ref={bodyRef}
      data-slot="full-screen-sheet-body"
      className={cn("min-h-0 flex-1 overflow-y-auto bg-background", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/* ─── Footer ───────────────────────────────────────────────────────────────── */

function FullScreenSheetFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="full-screen-sheet-footer"
      className={cn("shrink-0 border-t border-border bg-card", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-3 px-6 py-3">
        {children}
      </div>
    </div>
  )
}

/* ─── Exports ──────────────────────────────────────────────────────────────── */

export {
  FullScreenSheet,
  FullScreenSheetHeader,
  FullScreenSheetTitle,
  FullScreenSheetDescription,
  FullScreenSheetActions,
  FullScreenSheetBody,
  FullScreenSheetFooter,
}
