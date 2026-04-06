"use client"

import * as React from "react"

import { useMediaQuery } from "../hooks/use-media-query"
import { cn } from "../lib/utils"
import { Button } from "./button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
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

// ─── Context ────────────────────────────────────────────────────────────────

type ResponsiveAlertDialogContextValue = {
  isDesktop: boolean
}

const ResponsiveAlertDialogContext =
  React.createContext<ResponsiveAlertDialogContextValue>({
    isDesktop: true,
  })

function useResponsiveAlertDialog() {
  return React.useContext(ResponsiveAlertDialogContext)
}

// ─── Root ────────────────────────────────────────────────────────────────────

/**
 * Renders a centered, blocking AlertDialog on desktop (≥ 768px).
 * On mobile it renders a vaul Drawer with `dismissible={false}` — the Drawer
 * cannot be dragged away or dismissed by tapping the overlay, only by the
 * action or cancel buttons. This preserves the AlertDialog safety contract on
 * all screen sizes.
 */
function ResponsiveAlertDialog({
  children,
  open,
  onOpenChange,
  defaultOpen,
}: React.ComponentProps<typeof AlertDialog>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const common = { open, onOpenChange, defaultOpen, children }

  return (
    <ResponsiveAlertDialogContext.Provider value={{ isDesktop }}>
      {isDesktop ? (
        <AlertDialog {...common} />
      ) : (
        <Drawer dismissible={false} {...common} />
      )}
    </ResponsiveAlertDialogContext.Provider>
  )
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

function ResponsiveAlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogTrigger>) {
  const { isDesktop } = useResponsiveAlertDialog()
  return isDesktop ? (
    <AlertDialogTrigger {...props} />
  ) : (
    <DrawerTrigger {...props} />
  )
}

// ─── Content ─────────────────────────────────────────────────────────────────

function ResponsiveAlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogContent>) {
  const { isDesktop } = useResponsiveAlertDialog()

  if (isDesktop) {
    return (
      <AlertDialogContent className={className} {...props}>
        {children}
      </AlertDialogContent>
    )
  }

  return (
    // showHandle={false} — no drag handle because the drawer is not dismissible by dragging
    <DrawerContent
      showHandle={false}
      className={className}
      {...(props as React.ComponentProps<typeof DrawerContent>)}
    >
      {children}
    </DrawerContent>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

function ResponsiveAlertDialogHeader({
  ...props
}: React.ComponentProps<"div">) {
  const { isDesktop } = useResponsiveAlertDialog()
  return isDesktop ? (
    <AlertDialogHeader {...props} />
  ) : (
    <DrawerHeader {...props} />
  )
}

// ─── Title ───────────────────────────────────────────────────────────────────

function ResponsiveAlertDialogTitle({
  ...props
}: React.ComponentProps<typeof AlertDialogTitle>) {
  const { isDesktop } = useResponsiveAlertDialog()
  return isDesktop ? (
    <AlertDialogTitle {...props} />
  ) : (
    <DrawerTitle {...props} />
  )
}

// ─── Description ─────────────────────────────────────────────────────────────

function ResponsiveAlertDialogDescription({
  ...props
}: React.ComponentProps<typeof AlertDialogDescription>) {
  const { isDesktop } = useResponsiveAlertDialog()
  return isDesktop ? (
    <AlertDialogDescription {...props} />
  ) : (
    <DrawerDescription {...props} />
  )
}

// ─── Media ───────────────────────────────────────────────────────────────────

/**
 * Icon or image slot in the header. Renders identically on both surfaces
 * since it is a styled div with no surface-specific behaviour.
 */
function ResponsiveAlertDialogMedia({
  ...props
}: React.ComponentProps<typeof AlertDialogMedia>) {
  return <AlertDialogMedia {...props} />
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function ResponsiveAlertDialogFooter({
  ...props
}: React.ComponentProps<"div">) {
  const { isDesktop } = useResponsiveAlertDialog()
  return isDesktop ? (
    <AlertDialogFooter {...props} />
  ) : (
    <DrawerFooter {...props} />
  )
}

// ─── Action ──────────────────────────────────────────────────────────────────

/**
 * Confirm action button.
 *
 * Defaults to `variant="primary"`. Pass `variant="destructive"` for
 * irreversible actions such as delete or disconnect.
 *
 * Closes the dialog/drawer on click. Attach an `onClick` handler for the
 * actual side-effect.
 */
function ResponsiveAlertDialogAction({
  variant = "primary",
  size = "sm",
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogAction>) {
  const { isDesktop } = useResponsiveAlertDialog()

  if (isDesktop) {
    return (
      <AlertDialogAction
        variant={variant}
        size={size}
        className={className}
        {...props}
      />
    )
  }

  return (
    <Button variant={variant} size={size} asChild>
      <DrawerClose
        className={cn(className)}
        {...(props as React.ComponentProps<typeof DrawerClose>)}
      />
    </Button>
  )
}

// ─── Cancel ──────────────────────────────────────────────────────────────────

/**
 * Cancel button. Always renders as `outline`.
 * Closes the dialog/drawer without executing the action.
 */
function ResponsiveAlertDialogCancel({
  size = "sm",
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogCancel>) {
  const { isDesktop } = useResponsiveAlertDialog()

  if (isDesktop) {
    return (
      <AlertDialogCancel size={size} className={className} {...props} />
    )
  }

  return (
    <Button variant="outline" size={size} asChild>
      <DrawerClose
        className={cn(className)}
        {...(props as React.ComponentProps<typeof DrawerClose>)}
      />
    </Button>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogMedia,
  ResponsiveAlertDialogTitle,
  ResponsiveAlertDialogTrigger,
}
