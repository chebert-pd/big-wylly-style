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
            "bg-card border border-input data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 group/dialog-content relative flex flex-col w-full rounded-xl duration-200 data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg overflow-hidden [&>:not([data-slot])]:p-6 [&>[data-slot=dialog-header]+[data-slot=dialog-body]]:pt-0 data-[size=sm]:[&>:not([data-slot])]:p-4 data-[size=sm]:[&>[data-slot=dialog-header]+[data-slot=dialog-body]]:pt-0",
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
              className="absolute right-4 top-4 z-10 text-muted-foreground group-data-[size=sm]/dialog-content:hidden"
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
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-start gap-1.5 px-6 pt-6 pb-6 pr-12",
        "has-data-[slot=dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=dialog-media]:gap-x-4",
        "sm:has-data-[slot=dialog-media]:grid-cols-[auto_1fr] sm:has-data-[slot=dialog-media]:grid-rows-[auto_1fr]",
        // Small size: centered, tighter padding, no extra right padding
        "group-data-[size=sm]/dialog-content:place-items-center group-data-[size=sm]/dialog-content:text-center group-data-[size=sm]/dialog-content:px-4 group-data-[size=sm]/dialog-content:pt-4 group-data-[size=sm]/dialog-content:pb-4 group-data-[size=sm]/dialog-content:pr-4",
        className
      )}
      {...props}
    />
  )
}

function DialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-media"
      className={cn(
        "bg-muted inline-flex size-12 items-center justify-center rounded-xl sm:row-span-2 [&_svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    />
  )
}

function DialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("p-6 group-data-[size=sm]/dialog-content:p-4", className)}
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
        "flex flex-col-reverse gap-3 bg-secondary px-6 py-4 border-t border-border-subtle sm:flex-row sm:justify-end group-data-[size=sm]/dialog-content:flex-row group-data-[size=sm]/dialog-content:px-4 group-data-[size=sm]/dialog-content:py-3 group-data-[size=sm]/dialog-content:[&>*]:flex-1",
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
      className={cn("label-lg sm:group-has-data-[slot=dialog-media]/dialog-content:col-start-2", className)}
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
      className={cn("p text-muted-foreground sm:group-has-data-[slot=dialog-media]/dialog-content:col-start-2", className)}
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
  DialogBody,
  DialogCancel,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMedia,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
