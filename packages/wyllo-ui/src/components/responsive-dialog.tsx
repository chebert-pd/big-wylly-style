"use client"

import * as React from "react"

import { useMediaQuery } from "../hooks/use-media-query"
import { cn } from "../lib/utils"
import { Button } from "./button"
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMedia,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

// ─── Context ────────────────────────────────────────────────────────────────

/**
 * "drawer" — vaul drawer with glass-top treatment, natural height (default)
 * "sheet"  — full-viewport Sheet that slides up from the bottom
 */
type MobileVariant = "drawer" | "sheet"

type ResponsiveDialogContextValue = {
  isDesktop: boolean
  mobileVariant: MobileVariant
}

const ResponsiveDialogContext =
  React.createContext<ResponsiveDialogContextValue>({
    isDesktop: true,
    mobileVariant: "drawer",
  })

function useResponsiveDialog() {
  return React.useContext(ResponsiveDialogContext)
}

// ─── Root ────────────────────────────────────────────────────────────────────

/**
 * Renders a centered Dialog on desktop (≥ 768px) and a mobile overlay on smaller screens.
 *
 * @prop mobileVariant
 *   "drawer" (default) — vaul drawer; glass border on the top edge, natural height, drag-to-dismiss
 *   "sheet"            — full-viewport Sheet that covers the entire screen
 */
function ResponsiveDialog({
  mobileVariant = "drawer",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  mobileVariant?: MobileVariant
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const Comp = isDesktop ? Dialog : mobileVariant === "drawer" ? Drawer : Sheet

  return (
    <ResponsiveDialogContext.Provider value={{ isDesktop, mobileVariant }}>
      <Comp {...props}>{children}</Comp>
    </ResponsiveDialogContext.Provider>
  )
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

function ResponsiveDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogTrigger>) {
  const { isDesktop, mobileVariant } = useResponsiveDialog()
  if (isDesktop) return <DialogTrigger {...props} />
  if (mobileVariant === "drawer") return <DrawerTrigger {...props} />
  return <SheetTrigger {...props} />
}

// ─── Content ─────────────────────────────────────────────────────────────────

function ResponsiveDialogContent({
  size,
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  const { isDesktop, mobileVariant } = useResponsiveDialog()

  if (isDesktop) {
    return (
      <DialogContent size={size} className={className} {...props}>
        {children}
      </DialogContent>
    )
  }

  if (mobileVariant === "drawer") {
    return (
      <DrawerContent
        className={className}
        {...(props as React.ComponentProps<typeof DrawerContent>)}
      >
        {children}
      </DrawerContent>
    )
  }

  // sheet — full-viewport
  return (
    <SheetContent
      side="bottom"
      className={cn("h-svh rounded-none", className)}
      {...(props as React.ComponentProps<typeof SheetContent>)}
    >
      {children}
    </SheetContent>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

function ResponsiveDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isDesktop } = useResponsiveDialog()
  if (isDesktop) return <DialogHeader className={className} {...props} />
  // Mobile: centered header with same grid support as DialogHeader
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center px-6 pt-4 pb-4",
        "has-data-[slot=dialog-media]:grid-rows-[auto_auto_1fr]",
        className
      )}
      {...props}
    />
  )
}

// ─── Title ───────────────────────────────────────────────────────────────────

function ResponsiveDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  const { isDesktop } = useResponsiveDialog()
  if (isDesktop) return <DialogTitle className={className} {...props} />
  return (
    <div data-slot="dialog-title" className={cn("label-lg", className)} {...props} />
  )
}

// ─── Description ─────────────────────────────────────────────────────────────

function ResponsiveDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  const { isDesktop } = useResponsiveDialog()
  if (isDesktop) return <DialogDescription className={className} {...props} />
  return (
    <div data-slot="dialog-description" className={cn("p text-muted-foreground", className)} {...props} />
  )
}

// ─── Media ───────────────────────────────────────────────────────────────────

function ResponsiveDialogMedia({
  ...props
}: React.ComponentProps<typeof DialogMedia>) {
  return <DialogMedia {...props} />
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function ResponsiveDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isDesktop, mobileVariant } = useResponsiveDialog()
  if (isDesktop) return <DialogFooter className={className} {...props} />
  if (mobileVariant === "drawer") return <DrawerFooter className={className} {...props} />
  return <SheetFooter className={className} {...props} />
}

// ─── Close ───────────────────────────────────────────────────────────────────

function ResponsiveDialogClose({
  ...props
}: React.ComponentProps<typeof DialogClose>) {
  const { isDesktop, mobileVariant } = useResponsiveDialog()
  if (isDesktop) return <DialogClose {...props} />
  if (mobileVariant === "drawer") return <DrawerClose {...props} />
  return <SheetClose {...props} />
}

// ─── Action ──────────────────────────────────────────────────────────────────

/**
 * Primary action button. Closes the dialog/drawer/sheet on click.
 */
function ResponsiveDialogAction({
  size = "sm",
  className,
  ...props
}: React.ComponentProps<typeof DialogAction>) {
  const { isDesktop, mobileVariant } = useResponsiveDialog()

  if (isDesktop) {
    return <DialogAction size={size} className={className} {...props} />
  }

  const CloseComp = mobileVariant === "drawer" ? DrawerClose : SheetClose

  return (
    <Button variant="primary" size={size} asChild>
      <CloseComp
        className={cn(className)}
        {...(props as React.ComponentProps<typeof DrawerClose>)}
      />
    </Button>
  )
}

// ─── Cancel ──────────────────────────────────────────────────────────────────

/**
 * Cancel button. Closes the dialog/drawer/sheet on click.
 * Only render alongside ResponsiveDialogAction.
 */
function ResponsiveDialogCancel({
  size = "sm",
  className,
  ...props
}: React.ComponentProps<typeof DialogCancel>) {
  const { isDesktop, mobileVariant } = useResponsiveDialog()

  if (isDesktop) {
    return <DialogCancel size={size} className={className} {...props} />
  }

  const CloseComp = mobileVariant === "drawer" ? DrawerClose : SheetClose

  return (
    <Button variant="outline" size={size} asChild>
      <CloseComp
        className={cn(className)}
        {...(props as React.ComponentProps<typeof DrawerClose>)}
      />
    </Button>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  ResponsiveDialog,
  ResponsiveDialogAction,
  ResponsiveDialogCancel,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
}
