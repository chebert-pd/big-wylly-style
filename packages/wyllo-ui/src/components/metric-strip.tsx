"use client"

import * as React from "react"

import { cn } from "../lib/utils"

type MetricStripProps = React.ComponentProps<"div"> & {
  /** Additional CSS classes on the outer container */
  className?: string
}

function MetricStrip({ className, children, ...props }: MetricStripProps) {
  return (
    <div
      data-slot="metric-strip"
      className={cn("rounded-lg border border-border", className)}
      {...props}
    >
      {children}
    </div>
  )
}

type MetricStripHeaderProps = React.ComponentProps<"div"> & {
  /** Primary heading for the strip (e.g. "This Period") */
  title: string
  /** Optional description shown to the right of the title */
  description?: string
}

function MetricStripHeader({
  title,
  description,
  className,
  ...props
}: MetricStripHeaderProps) {
  return (
    <>
      <div
        data-slot="metric-strip-header"
        className={cn(
          "flex items-start gap-12 px-4 py-2",
          className
        )}
        {...props}
      >
        <span className="label-sm text-muted-foreground flex-1">{title}</span>
        {description && (
          <span className="p-sm text-muted-foreground">{description}</span>
        )}
      </div>
      <div className="border-t border-border" />
    </>
  )
}

type MetricStripItemSimpleProps = {
  /** The primary data value */
  value: string
  /** Label describing what the value represents */
  label: string
  children?: never
}

type MetricStripItemRichProps = {
  /** Rich content (e.g. a StatBlock) replaces the default value/label layout. */
  children: React.ReactNode
  value?: never
  label?: never
}

type MetricStripItemProps = React.ComponentProps<"div"> &
  (MetricStripItemSimpleProps | MetricStripItemRichProps)

function MetricStripItem(props: MetricStripItemProps) {
  const { className, children, ...rest } = props as MetricStripItemProps & {
    children?: React.ReactNode
    value?: string
    label?: string
  }

  // Strip value/label from div props when using simple mode
  const { value, label, ...divProps } = rest as typeof rest & {
    value?: string
    label?: string
  }

  return (
    <div
      data-slot="metric-strip-item"
      className={cn(
        "flex flex-1 flex-col gap-1 px-4 py-2",
        className
      )}
      {...divProps}
    >
      {children ?? (
        <>
          <span className="data-sm text-foreground">{value}</span>
          <span className="p-sm text-muted-foreground">{label}</span>
        </>
      )}
    </div>
  )
}

type MetricStripContentProps = React.ComponentProps<"div">

function MetricStripContent({
  className,
  children,
  ...props
}: MetricStripContentProps) {
  const items = React.Children.toArray(children)

  return (
    <div
      data-slot="metric-strip-content"
      className={cn("flex items-center", className)}
      {...props}
    >
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className="w-px self-stretch bg-border" />}
          {child}
        </React.Fragment>
      ))}
    </div>
  )
}

export { MetricStrip, MetricStripHeader, MetricStripItem, MetricStripContent }
