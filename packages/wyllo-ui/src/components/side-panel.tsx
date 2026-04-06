"use client"

import * as React from "react"
import { X, ArrowLeft } from "lucide-react"

import { cn } from "../lib/utils"
import { useMediaQuery } from "../hooks/use-media-query"
import { Button } from "./button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./sheet"

/* ─── Types ────────────────────────────────────────────────────────────────── */

type SidePanelConfig = {
  side: "left" | "right"
  title?: React.ReactNode
  subtitle?: React.ReactNode
  content: React.ReactNode
}

type SidePanelState = {
  left: SidePanelConfig | null
  right: SidePanelConfig | null
}

type SidePanelContextValue = {
  openSidePanel: (config: SidePanelConfig) => void
  closeSidePanel: (side: "left" | "right") => void
  closeAllSidePanels: () => void
  leftPanel: SidePanelConfig | null
  rightPanel: SidePanelConfig | null
}

/* ─── Context ──────────────────────────────────────────────────────────────── */

const SidePanelContext = React.createContext<SidePanelContextValue | null>(null)

function useSidePanel() {
  const context = React.useContext(SidePanelContext)
  if (!context) {
    throw new Error("useSidePanel must be used within a SidePanelProvider")
  }
  return context
}

/* ─── Provider ─────────────────────────────────────────────────────────────── */

function SidePanelProvider({
  children,
  pathname,
}: {
  children: React.ReactNode
  /** When pathname changes, all panels auto-close */
  pathname?: string
}) {
  const [panels, setPanels] = React.useState<SidePanelState>({
    left: null,
    right: null,
  })

  // Auto-close on route change
  React.useEffect(() => {
    setPanels({ left: null, right: null })
  }, [pathname])

  const openSidePanel = React.useCallback((config: SidePanelConfig) => {
    setPanels((prev) => ({ ...prev, [config.side]: config }))
  }, [])

  const closeSidePanel = React.useCallback((side: "left" | "right") => {
    setPanels((prev) => ({ ...prev, [side]: null }))
  }, [])

  const closeAllSidePanels = React.useCallback(() => {
    setPanels({ left: null, right: null })
  }, [])

  const value = React.useMemo(
    () => ({
      openSidePanel,
      closeSidePanel,
      closeAllSidePanels,
      leftPanel: panels.left,
      rightPanel: panels.right,
    }),
    [openSidePanel, closeSidePanel, closeAllSidePanels, panels],
  )

  return (
    <SidePanelContext.Provider value={value}>
      {children}
    </SidePanelContext.Provider>
  )
}

/* ─── Panel renderer ───────────────────────────────────────────────────────── */

function SidePanelRenderer({
  panel,
  side,
  onClose,
}: {
  panel: SidePanelConfig | null
  side: "left" | "right"
  onClose: () => void
}) {
  const isMobile = useMediaQuery("(max-width: 767px)")

  if (!panel) return null

  const titleAriaLabel =
    typeof panel.title === "string" && panel.title.trim().length > 0
      ? panel.title
      : `${side} panel`

  // Mobile: full-width Sheet
  if (isMobile) {
    return (
      <Sheet open={!!panel} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side={side}
          className="w-full sm:max-w-md p-0 flex flex-col [&>button]:hidden"
        >
          <SheetHeader className="flex-row items-center gap-2 p-4 border-b border-border space-y-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex-1">
              {panel.title != null && panel.title !== "" && (
                <SheetTitle>{panel.title}</SheetTitle>
              )}
              {panel.subtitle != null && panel.subtitle !== "" && (
                <div className="p-sm text-muted-foreground">
                  {panel.subtitle}
                </div>
              )}
            </div>
          </SheetHeader>
          <div className="flex-1 min-h-0 flex flex-col">{panel.content}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: inline aside that pushes content
  return (
    <aside
      data-slot="side-panel"
      data-side={side}
      className={cn(
        "flex h-full shrink-0 flex-col bg-card",
        side === "left" ? "border-r border-border w-72" : "border-l border-border w-96",
      )}
      aria-label={titleAriaLabel}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
        <div className="min-w-0 flex-1">
          {panel.title != null && panel.title !== "" && (
            <h2 className="h3 text-foreground">{panel.title}</h2>
          )}
          {panel.subtitle != null && panel.subtitle !== "" && (
            <div className="p-sm text-muted-foreground">{panel.subtitle}</div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col">{panel.content}</div>
    </aside>
  )
}

/* ─── Container ────────────────────────────────────────────────────────────── */

function SidePanelContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { leftPanel, rightPanel, closeSidePanel } = useSidePanel()

  return (
    <div
      data-slot="side-panel-container"
      className={cn("flex min-h-0 flex-1 overflow-hidden", className)}
    >
      <SidePanelRenderer
        panel={leftPanel}
        side="left"
        onClose={() => closeSidePanel("left")}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>

      <SidePanelRenderer
        panel={rightPanel}
        side="right"
        onClose={() => closeSidePanel("right")}
      />
    </div>
  )
}

/* ─── Exports ──────────────────────────────────────────────────────────────── */

export {
  SidePanelProvider,
  SidePanelContainer,
  useSidePanel,
}
export type { SidePanelConfig }
