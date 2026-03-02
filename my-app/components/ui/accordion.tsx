"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const AccordionSizeContext = React.createContext<"sm" | "md" | "lg">("md")
const AccordionDepthContext = React.createContext<number>(0)
const AccordionVariantContext = React.createContext<"line" | "card" | "contained">("line")

/* =====================
   Variants
===================== */

const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      line: "",
      card:
        "rounded-xl border border-border bg-card overflow-hidden data-[surface=0]:bg-card data-[surface=1]:bg-secondary",
      contained:
        "rounded-xl border border-border bg-card overflow-hidden shadow-[var(--elevation-surface)]",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "line",
    size: "md",
  },
})

const itemVariants = cva("", {
  variants: {
    variant: {
      line: "border-b border-border-subtle last:border-0",
      card: "border-b border-border-subtle last:border-0",
    },
  },
  defaultVariants: {
    variant: "line",
  },
})

/* =====================
   Root
===================== */

interface AccordionProps
  extends React.ComponentProps<typeof AccordionPrimitive.Root>,
    VariantProps<typeof accordionVariants> {
  surface?: 0 | 1
  columns?: 1 | 2
  autoCollapse?: boolean
  masonry?: boolean
}

function Accordion({
  className,
  variant,
  size,
  surface = 0,
  columns = 1,
  autoCollapse = true,
  masonry = false,
  type,
  ...props
}: AccordionProps) {
  return (
    <AccordionVariantContext.Provider value={(variant ?? "line") as "line" | "card" | "contained"}>
      <AccordionSizeContext.Provider value={size ?? "md"}>
        <AccordionDepthContext.Provider value={(React.useContext(AccordionDepthContext) ?? 0) + 1}>
          <AccordionPrimitive.Root
            data-slot="accordion"
            data-surface={surface}
            type={autoCollapse ? "single" : type}
            collapsible
            className={cn(
              accordionVariants({ variant, size }),
              masonry
                ? cn(
                    "columns-1",
                    columns === 2 && "md:columns-2"
                  )
                : columns === 2 && "grid md:grid-cols-2",
              className
            )}
            {...props}
          />
        </AccordionDepthContext.Provider>
      </AccordionSizeContext.Provider>
    </AccordionVariantContext.Provider>
  )
}

/* =====================
   Item
===================== */

interface AccordionItemProps
  extends React.ComponentProps<typeof AccordionPrimitive.Item>,
    VariantProps<typeof itemVariants> {}

function AccordionItem({ className, variant, ...props }: AccordionItemProps) {
  const rootVariant = React.useContext(AccordionVariantContext)
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        itemVariants({ variant: (variant ?? (rootVariant === "contained" ? "card" : rootVariant)) as any }),
        "break-inside-avoid",
        className
      )}
      {...props}
    />
  )
}

/* =====================
   Trigger
===================== */

interface AccordionTriggerProps
  extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
  icon?: React.ReactNode
  chevronPosition?: "left" | "right"
  layout?: "default" | "stat"
  label?: React.ReactNode
  subtitle?: React.ReactNode
  badge?: React.ReactNode
  dataSize?: "sm" | "md" | "lg"
}

function AccordionTrigger({
  className,
  children,
  icon,
  chevronPosition = "right",
  layout = "default",
  label,
  subtitle,
  badge,
  dataSize = "md",
  ...props
}: AccordionTriggerProps) {
  const size = React.useContext(AccordionSizeContext)
  const depth = React.useContext(AccordionDepthContext)

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex w-full items-center gap-4 text-left transition-colors duration-200",
          "hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",

          // Padding by size (md + lg match)
          size === "sm" && "px-4 py-3",
          (size === "md" || size === "lg") && "px-6 py-4",

          // Nested indentation (adds 8px per depth level)
          depth >= 2 && "pl-2",

          layout === "default" &&
            (size === "sm"
              ? "label-sm"
              : size === "md"
              ? "label-md"
              : "label-lg"),

          layout === "stat" && "flex-col items-start gap-2",

          className
        )}
        {...props}
      >
        {layout === "default" && chevronPosition === "left" && (
          <ChevronDown className="size-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
        )}

        {layout === "default" && icon && (
          <span className="shrink-0">{icon}</span>
        )}

        {layout === "default" && (
          <div className="flex flex-1 flex-col">
            <span>{children}</span>
            {subtitle && (
              <span
                className={cn(
                  "text-muted-foreground",
                  size === "sm" && "p-sm",
                  size === "md" && "p-sm",
                  size === "lg" && "p"
                )}
              >
                {subtitle}
              </span>
            )}
          </div>
        )}

        {layout === "stat" && (
          <div className="flex w-full flex-col gap-1">
            {label && (
              <span className="label-sm text-muted-foreground">{label}</span>
            )}

            <div className="flex items-center justify-between gap-4">
              {chevronPosition === "left" && (
                <ChevronDown className="size-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              )}

              <div className="flex flex-col">
                <span
                  className={cn(
                    "transition-opacity duration-300",
                    "group-data-[state=open]:opacity-100",
                    "group-data-[state=closed]:opacity-80",
                    dataSize === "sm" && "data-sm",
                    dataSize === "md" && "data-md",
                    dataSize === "lg" && "data-lg"
                  )}
                >
                  {children}
                </span>
                {subtitle && (
                  <span
                    className={cn(
                      "text-muted-foreground",
                      size === "sm" && "p-sm",
                      size === "md" && "p-sm",
                      size === "lg" && "p"
                    )}
                  >
                    {subtitle}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {badge}
                {chevronPosition === "right" && (
                  <ChevronDown className="size-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                )}
              </div>
            </div>
          </div>
        )}

        {layout === "default" && chevronPosition === "right" && (
          <ChevronDown className="size-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/* =====================
   Content (Premium Animations)
===================== */

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const size = React.useContext(AccordionSizeContext)

  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden",
        "origin-top",
        "will-change-[height,opacity,transform]",
        "data-[state=open]:animate-in",
        "data-[state=open]:fade-in-0",
        "data-[state=open]:slide-in-from-top-1",
        "data-[state=open]:duration-300",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=closed]:slide-out-to-top-1",
        "data-[state=closed]:duration-200",
        "[&>*]:transition-all [&>*]:duration-300 [&>*]:delay-75",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          size === "sm" && "px-4 pb-4",
          (size === "md" || size === "lg") && "px-6 pb-6"
        )}
      >
        <div
          className={cn(
            "border-t border-border-subtle text-muted-foreground",
            size === "sm" && "p-sm",
            size === "md" && "p",
            size === "lg" && "p",
            size === "sm" && "pt-4",
            (size === "md" || size === "lg") && "pt-6"
          )}
        >
          {children}
        </div>
      </div>
    </AccordionPrimitive.Content>
  )
}

interface AccordionGroupProps extends Omit<AccordionProps, "variant"> {
  size?: "sm" | "md" | "lg"
  headerTitle?: React.ReactNode
  headerSubtitle?: React.ReactNode
  headerDescription?: React.ReactNode
  headerAction?: React.ReactNode
  headerTitleLevel?: "h3" | "h2" | "h1"
  footerDescription?: React.ReactNode
  footerAction?: React.ReactNode
}

function AccordionGroup({
  className,
  size = "md",
  headerTitle,
  headerSubtitle,
  headerDescription,
  headerAction,
  headerTitleLevel,
  footerDescription,
  footerAction,
  children,
  ...props
}: AccordionGroupProps) {
  return (
    <div
      data-slot="accordion-group"
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className
      )}
    >
      {(headerTitle || headerSubtitle || headerDescription || headerAction) && (
        <div
          className={cn(
            "border-b border-border-subtle",
            size === "sm" && "px-4 py-4",
            size === "md" && "px-6 py-5",
            size === "lg" && "px-8 py-6"
          )}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-1">
              {headerTitle && (
                React.createElement(
                  headerTitleLevel ??
                    (size === "sm"
                      ? "h3"
                      : size === "md"
                      ? "h3"
                      : "h2"),
                  {
                    className:
                      size === "sm"
                        ? "h3"
                        : size === "md"
                        ? headerTitleLevel === "h2"
                          ? "h2"
                          : "h3"
                        : headerTitleLevel === "h1"
                        ? "h1"
                        : "h2",
                  },
                  headerTitle
                )
              )}
              {headerSubtitle && (
                <div className="p-sm text-muted-foreground">
                  {headerSubtitle}
                </div>
              )}
              {headerDescription && (
                <div className="p text-muted-foreground">
                  {headerDescription}
                </div>
              )}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        </div>
      )}

      <Accordion variant="line" {...props}>
        {children}
      </Accordion>

      {(footerDescription || footerAction) && (
        <div className="px-6 py-4 bg-secondary border-t border-border-subtle flex items-center justify-between gap-6">
          {footerDescription && (
            <div className="p-sm text-muted-foreground">
              {footerDescription}
            </div>
          )}
          {footerAction && <div className="shrink-0">{footerAction}</div>}
        </div>
      )}
    </div>
  )
}

export { Accordion, AccordionGroup, AccordionItem, AccordionTrigger, AccordionContent }
