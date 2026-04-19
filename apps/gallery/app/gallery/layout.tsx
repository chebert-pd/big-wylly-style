"use client"

import { useEffect, useState } from "react"
import { Sun, Moon, Menu, X } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@wyllo/ui"
import { GalleryNavLink, GalleryNavGroup } from "@/app/gallery/_components/gallery-nav"

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mobileOpen, setMobileOpen] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    if (stored) {
      setTheme(stored)
      return
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setTheme(prefersDark ? "dark" : "light")
  }, [])

  // Sync theme to <html> + persist
  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-[var(--border)] bg-background sticky top-0 h-screen flex-col">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <a href="/gallery">
            <img src="/logo.png" alt="Wyllo" className="h-8 w-auto" />
          </a>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <nav className="space-y-0.5 pb-4">
            <GalleryNavGroup label="Primitives">
              <GalleryNavLink href="/gallery/setup">Setup</GalleryNavLink>
              <GalleryNavLink href="/gallery/logic">System Logic</GalleryNavLink>
              <GalleryNavLink href="/gallery/tokens">Tokens</GalleryNavLink>
              <GalleryNavLink href="/gallery/tokens/typography" indent>Typography</GalleryNavLink>
              <GalleryNavLink href="/gallery/tokens/colors" indent>Colors</GalleryNavLink>
              <GalleryNavLink href="/gallery/tokens/surfaces" indent>Surfaces & Elevation</GalleryNavLink>
              <GalleryNavLink href="/gallery/skills">Agentic Skills</GalleryNavLink>
              <GalleryNavLink href="/gallery/skills/codebase-index-fix" indent>Codebase Index Fix</GalleryNavLink>
              <GalleryNavLink href="/gallery/skills/governance-auditor" indent>Governance Auditor</GalleryNavLink>
            </GalleryNavGroup>

            <GalleryNavGroup label="Components">
              <GalleryNavLink href="/gallery/accordions">Accordions</GalleryNavLink>
              <GalleryNavLink href="/gallery/badge">Badges</GalleryNavLink>
              <GalleryNavLink href="/gallery/breadcrumb">Breadcrumb</GalleryNavLink>
              <GalleryNavLink href="/gallery/buttons">Buttons</GalleryNavLink>
              <GalleryNavLink href="/gallery/chart">Chart</GalleryNavLink>
              <GalleryNavLink href="/gallery/collapsible">Collapsible</GalleryNavLink>
              <GalleryNavLink href="/gallery/command-palette">Command Palette</GalleryNavLink>
              <GalleryNavLink href="/gallery/date-picker">Date Picker</GalleryNavLink>
              <GalleryNavLink href="/gallery/overlays/drawer">Drawer</GalleryNavLink>
              <GalleryNavLink href="/gallery/overlays/dialog">Dialog</GalleryNavLink>
              <GalleryNavLink href="/gallery/overlays/dialog/alert" indent>Alert Dialog</GalleryNavLink>
              <GalleryNavLink href="/gallery/overlays/dialog/responsive" indent>Responsive Dialog</GalleryNavLink>
              <GalleryNavLink href="/gallery/overlays/background">Overlay Background</GalleryNavLink>
              <GalleryNavLink href="/gallery/overlays/sheet">Sheet</GalleryNavLink>
              <GalleryNavLink href="/gallery/pagination">Pagination</GalleryNavLink>
              <GalleryNavLink href="/gallery/progress">Progress</GalleryNavLink>
              <GalleryNavLink href="/gallery/resizable">Resizable</GalleryNavLink>
              <GalleryNavLink href="/gallery/stats">Stats</GalleryNavLink>
              <GalleryNavLink href="/gallery/tables">Tables</GalleryNavLink>
              <GalleryNavLink href="/gallery/tabs">Tabs</GalleryNavLink>
              <GalleryNavLink href="/gallery/toggle">Toggle</GalleryNavLink>
            </GalleryNavGroup>

            <GalleryNavGroup label="Composed Patterns">
              <GalleryNavLink href="/gallery/data-table">Data Table</GalleryNavLink>
              <GalleryNavLink href="/gallery/empty-state">Empty State</GalleryNavLink>
              <GalleryNavLink href="/gallery/error-states">Error States</GalleryNavLink>
              <GalleryNavLink href="/gallery/forms">Forms</GalleryNavLink>
              <GalleryNavLink href="/gallery/full-screen-panel">Full Screen Sheet</GalleryNavLink>
              <GalleryNavLink href="/gallery/header">Header</GalleryNavLink>
              <GalleryNavLink href="/gallery/modules/metric-panel">Metric Panel</GalleryNavLink>
              <GalleryNavLink href="/gallery/pagination-toolbar">Pagination Toolbar</GalleryNavLink>
              <GalleryNavLink href="/gallery/side-panel">Side Panel</GalleryNavLink>
              <GalleryNavLink href="/gallery/sidebar">Sidebar</GalleryNavLink>
            </GalleryNavGroup>

            <GalleryNavGroup label="v0">
              <GalleryNavLink href="/gallery/v0/aspect-ratio">Aspect Ratio</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/avatar">Avatar</GalleryNavLink>


              <GalleryNavLink href="/gallery/v0/command">Command</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/form">Form</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/hover-card">Hover Card</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/input-otp">Input OTP</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/kbd">Kbd</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/scroll-area">Scroll Area</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/skeleton">Skeleton</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/spinner">Spinner</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/toast">Toast</GalleryNavLink>
              <GalleryNavLink href="/gallery/v0/tooltip">Tooltip</GalleryNavLink>
            </GalleryNavGroup>
          </nav>
        </div>

        <div className="px-6 py-4 shrink-0 border-t border-[var(--border)]">
          <ToggleGroup
            variant="outline"
            size="sm"
            type="single"
            value={theme}
            onValueChange={(value) => {
              if (!value) return
              setTheme(value as "light" | "dark")
            }}
            className="inline-flex"
          >
            <ToggleGroupItem value="light" className="gap-2">
              <Sun size={16} /> Light
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" className="gap-2">
              <Moon size={16} /> Dark
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-overlay backdrop-blur-overlay"
            onClick={() => setMobileOpen(false)}
          />

          {/* drawer */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-background border-r border-[var(--border)] shadow-[var(--elevation-overlay)] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
              <a href="/gallery" onClick={() => setMobileOpen(false)}>
                <img src="/logo.png" alt="Wyllo" className="h-8 w-auto" />
              </a>
              <button onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <nav className="space-y-0.5 pb-4">
                <GalleryNavGroup label="Primitives">
                  <GalleryNavLink href="/gallery/setup" onClick={() => setMobileOpen(false)}>Setup</GalleryNavLink>
                  <GalleryNavLink href="/gallery/logic" onClick={() => setMobileOpen(false)}>System Logic</GalleryNavLink>
                  <GalleryNavLink href="/gallery/tokens" onClick={() => setMobileOpen(false)}>Tokens</GalleryNavLink>
                </GalleryNavGroup>

                <GalleryNavGroup label="Components">
                  <GalleryNavLink href="/gallery/accordions" onClick={() => setMobileOpen(false)}>Accordions</GalleryNavLink>
                  <GalleryNavLink href="/gallery/badge" onClick={() => setMobileOpen(false)}>Badges</GalleryNavLink>
                  <GalleryNavLink href="/gallery/buttons" onClick={() => setMobileOpen(false)}>Buttons</GalleryNavLink>
                  <GalleryNavLink href="/gallery/chart" onClick={() => setMobileOpen(false)}>Chart</GalleryNavLink>
                  <GalleryNavLink href="/gallery/command-palette" onClick={() => setMobileOpen(false)}>Command Palette</GalleryNavLink>
                  <GalleryNavLink href="/gallery/date-picker" onClick={() => setMobileOpen(false)}>Date Picker</GalleryNavLink>
                  <GalleryNavLink href="/gallery/overlays/dialog" onClick={() => setMobileOpen(false)}>Dialog</GalleryNavLink>
                  <GalleryNavLink href="/gallery/overlays/dialog/alert" indent onClick={() => setMobileOpen(false)}>Alert Dialog</GalleryNavLink>
                  <GalleryNavLink href="/gallery/overlays/dialog/responsive" indent onClick={() => setMobileOpen(false)}>Responsive Dialog</GalleryNavLink>
                  <GalleryNavLink href="/gallery/overlays/background" onClick={() => setMobileOpen(false)}>Overlay Background</GalleryNavLink>
                  <GalleryNavLink href="/gallery/overlays/sheet" onClick={() => setMobileOpen(false)}>Sheet</GalleryNavLink>
                  <GalleryNavLink href="/gallery/progress" onClick={() => setMobileOpen(false)}>Progress</GalleryNavLink>
                  <GalleryNavLink href="/gallery/pagination" onClick={() => setMobileOpen(false)}>Pagination</GalleryNavLink>
                  <GalleryNavLink href="/gallery/resizable" onClick={() => setMobileOpen(false)}>Resizable</GalleryNavLink>
                  <GalleryNavLink href="/gallery/stats" onClick={() => setMobileOpen(false)}>Stats</GalleryNavLink>
                  <GalleryNavLink href="/gallery/tables" onClick={() => setMobileOpen(false)}>Tables</GalleryNavLink>
                  <GalleryNavLink href="/gallery/tabs" onClick={() => setMobileOpen(false)}>Tabs</GalleryNavLink>
                  <GalleryNavLink href="/gallery/toggle" onClick={() => setMobileOpen(false)}>Toggle</GalleryNavLink>
                </GalleryNavGroup>

                <GalleryNavGroup label="Composed Patterns">
                  <GalleryNavLink href="/gallery/data-table" onClick={() => setMobileOpen(false)}>Data Table</GalleryNavLink>
                  <GalleryNavLink href="/gallery/empty-state" onClick={() => setMobileOpen(false)}>Empty State</GalleryNavLink>
                  <GalleryNavLink href="/gallery/error-states" onClick={() => setMobileOpen(false)}>Error States</GalleryNavLink>
                  <GalleryNavLink href="/gallery/forms" onClick={() => setMobileOpen(false)}>Forms</GalleryNavLink>
                  <GalleryNavLink href="/gallery/full-screen-panel" onClick={() => setMobileOpen(false)}>Full Screen Sheet</GalleryNavLink>
                  <GalleryNavLink href="/gallery/header" onClick={() => setMobileOpen(false)}>Header</GalleryNavLink>
                  <GalleryNavLink href="/gallery/modules/metric-panel" onClick={() => setMobileOpen(false)}>Metric Panel</GalleryNavLink>
                  <GalleryNavLink href="/gallery/pagination-toolbar" onClick={() => setMobileOpen(false)}>Pagination Toolbar</GalleryNavLink>
                  <GalleryNavLink href="/gallery/side-panel" onClick={() => setMobileOpen(false)}>Side Panel</GalleryNavLink>
                  <GalleryNavLink href="/gallery/sidebar" onClick={() => setMobileOpen(false)}>Sidebar</GalleryNavLink>
                </GalleryNavGroup>

                <GalleryNavGroup label="v0">
                  <GalleryNavLink href="/gallery/v0/aspect-ratio" onClick={() => setMobileOpen(false)}>Aspect Ratio</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/avatar" onClick={() => setMobileOpen(false)}>Avatar</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/breadcrumb" onClick={() => setMobileOpen(false)}>Breadcrumb</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/collapsible" onClick={() => setMobileOpen(false)}>Collapsible</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/command" onClick={() => setMobileOpen(false)}>Command</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/form" onClick={() => setMobileOpen(false)}>Form</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/hover-card" onClick={() => setMobileOpen(false)}>Hover Card</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/input-otp" onClick={() => setMobileOpen(false)}>Input OTP</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/kbd" onClick={() => setMobileOpen(false)}>Kbd</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/scroll-area" onClick={() => setMobileOpen(false)}>Scroll Area</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/skeleton" onClick={() => setMobileOpen(false)}>Skeleton</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/spinner" onClick={() => setMobileOpen(false)}>Spinner</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/toast" onClick={() => setMobileOpen(false)}>Toast</GalleryNavLink>
                  <GalleryNavLink href="/gallery/v0/tooltip" onClick={() => setMobileOpen(false)}>Tooltip</GalleryNavLink>
                </GalleryNavGroup>
              </nav>
            </div>

            <div className="px-6 py-4 shrink-0 border-t border-[var(--border)]">
              <ToggleGroup
                variant="outline"
                size="sm"
                type="single"
                value={theme}
                onValueChange={(value) => {
                  if (!value) return
                  setTheme(value as "light" | "dark")
                }}
                className="inline-flex"
              >
                <ToggleGroupItem value="light" className="gap-2">
                  <Sun size={16} /> Light
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" className="gap-2">
                  <Moon size={16} /> Dark
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-background px-4 py-3">
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <a href="/gallery">
            <img src="/logo.png" alt="Wyllo" className="h-7 w-auto" />
          </a>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-x-clip">
          {children}
        </main>
      </div>
    </div>
  )
}
