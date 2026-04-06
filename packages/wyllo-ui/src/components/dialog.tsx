"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { X } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { ModalBase } from "./modal-base"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
  )
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
  )
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close data-slot="dialog-close" {...props} />
  )
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay backdrop-blur-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  size?: "default" | "sm"
}) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <ModalBase>
        <DialogPrimitive.Content
          data-slot="dialog-content"
          data-size={size}
          className={cn(
            "bg-card border border-[var(--input)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 group/dialog-content relative grid w-full gap-4 rounded-2xl p-6 duration-200 data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg",
            className
          )}
          {...props}
        >
          {children}

          <DialogPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              className="absolute right-4 top-4 text-muted-foreground"
              aria-label="Close"
            >
              <X />
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </ModalBase>
    </DialogPortal>
  )
}

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 pr-6", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-6 -mb-6 mt-2 flex flex-col-reverse gap-3 rounded-b-2xl bg-secondary px-6 py-4 border-t border-[color:var(--border-subtle)] sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("label-lg", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("p-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * Primary action button. Closes the dialog on click.
 * Use for the confirming/submitting action.
 */
function DialogAction({
  className,
  size = "sm",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "size">) {
  return (
    <Button variant="primary" size={size} asChild>
      <DialogPrimitive.Close
        data-slot="dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

/**
 * Cancel/dismiss button. Closes the dialog on click.
 * Only render this when there is also a DialogAction.
 */
function DialogCancel({
  className,
  size = "sm",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close> &
  Pick<React.ComponentProps<typeof Button>, "size">) {
  return (
    <Button variant="outline" size={size} asChild>
      <DialogPrimitive.Close
        data-slot="dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

export {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
