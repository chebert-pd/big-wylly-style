"use client"

import * as React from "react"
import { cn } from "@wyllo/ui"
import { Check, Copy } from "lucide-react"

/* ─── Root ─────────────────────────────────────────────────────────────────── */

function CodeBlock({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-clip rounded-lg",
        "bg-brand/40 border border-brand-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ─── Header ───────────────────────────────────────────────────────────────── */

function CodeBlockHeader({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-9 items-center justify-between px-3 py-1.5",
        "label-sm text-brand-foreground",
        "border-b border-brand-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ─── Copy button ──────────────────────────────────────────────────────────── */

function CodeBlockCopy({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)

  const copy = React.useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [value])

  return (
    <button
      onClick={copy}
      className={cn(
        "flex items-center justify-center rounded-md p-1",
        "text-brand-foreground/60 hover:text-brand-foreground hover:bg-brand-border/50",
        "transition-colors",
      )}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

/* ─── Content ──────────────────────────────────────────────────────────────── */

function CodeBlockContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "overflow-x-auto",
        "bg-brand/40 p-4",
        "font-mono text-xs leading-relaxed whitespace-pre text-brand-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ─── Convenience: single-use snippet ──────────────────────────────────────── */

function CodeSnippet({
  children,
  title,
  className,
}: {
  children: string
  title?: string
  className?: string
}) {
  return (
    <CodeBlock className={className}>
      {title && (
        <CodeBlockHeader>
          <span>{title}</span>
          <CodeBlockCopy value={children} />
        </CodeBlockHeader>
      )}
      <CodeBlockContent>
        {!title && (
          <div className="float-right -mt-1 -mr-1">
            <CodeBlockCopy value={children} />
          </div>
        )}
        {children}
      </CodeBlockContent>
    </CodeBlock>
  )
}

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockCopy,
  CodeBlockContent,
  CodeSnippet,
}
