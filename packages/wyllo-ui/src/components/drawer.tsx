"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "../lib/utils"

// ─── Root ─────────────────────────────────────────────────────────────────────

function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  )
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

// ─── Portal ───────────────────────────────────────────────────────────────────

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

// ─── Close ────────────────────────────────────────────────────────────────────

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay backdrop-blur-overlay",
        className
      )}
      {...props}
    />
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

/**
 * The drawer panel. Slides up from the bottom.
 *
 * Applies the ModalBase glass treatment to the top edge only — full width,
 * anchored to the bottom of the screen. A drag handle is shown by default.
 *
 * @prop showHandle — show the drag handle pill (default: true)
 */
function DrawerContent({
  className,
  children,
  showHandle = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  showHandle?: boolean
}) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          // Positioning — full width, anchored to screen bottom
          "fixed inset-x-0 bottom-0 z-50",
          // Glass wrapper — same tokens as ModalBase, visible on top edge only
          "bg-glass backdrop-blur-glass",
          "border-t border-l border-r border-glass-border",
          "rounded-t-[calc(1rem+2px)] p-[2px]",
          "shadow-2xl outline-none",
          className
        )}
        {...props}
      >
        {/* Inner card surface — glass background peeks through the 2px gap as the border ring */}
        <div className="relative bg-card rounded-t-[1rem] overflow-hidden flex flex-col">
          {showHandle && (
            <div
              data-slot="drawer-handle"
              aria-hidden
              className="mx-auto mt-3 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-muted"
            />
          )}
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-4 pb-0", className)}
      {...props}
    />
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

// ─── Title ────────────────────────────────────────────────────────────────────

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("label-lg", className)}
      {...props}
    />
  )
}

// ─── Description ──────────────────────────────────────────────────────────────

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("p-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
