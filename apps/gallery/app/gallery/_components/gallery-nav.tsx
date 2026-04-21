"use client"

import { usePathname } from "next/navigation"
import { cn } from "@chebert-pd/ui"

/**
 * Gallery-only nav link with active page detection.
 * NOT a design system component — this is specific to the gallery app.
 */
function GalleryNavLink({
  href,
  children,
  indent = false,
  onClick,
}: {
  href: string
  children: React.ReactNode
  /** Renders as an indented sub-link (smaller text, left padding) */
  indent?: boolean
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "block rounded-md px-2 py-1 transition-colors",
        indent ? "p-sm pl-4 text-muted-foreground" : "p-sm",
        isActive
          ? "bg-accent text-foreground font-[520]"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      {children}
    </a>
  )
}

function GalleryNavGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="pt-4 space-y-0.5">
      <div className="label-sm text-foreground px-2 pb-1">{label}</div>
      {children}
    </div>
  )
}

export { GalleryNavLink, GalleryNavGroup }
