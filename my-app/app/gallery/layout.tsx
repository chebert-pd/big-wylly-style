"use client"

import { useEffect, useState } from "react"
import { Sun, Moon, Menu, X } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [colorTheme, setColorTheme] = useState<"violet" | "black">("violet")
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

  // Initialize colorTheme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("color-theme") as "violet" | "black" | null
    if (stored === "violet" || stored === "black") {
      setColorTheme(stored)
    }
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

  // Sync colorTheme to <html> data-theme + persist
  useEffect(() => {
    const root = document.documentElement

    if (colorTheme === "black") {
      root.setAttribute("data-theme", "black")
    } else {
      root.removeAttribute("data-theme")
    }

    localStorage.setItem("color-theme", colorTheme)
  }, [colorTheme])

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-[var(--border)] bg-card sticky top-0 h-screen flex-col">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <a href="/gallery">
            <img src="/logo.png" alt="Wyllo" className="h-8 w-auto" />
          </a>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <nav className="space-y-2 p-sm pb-4">
            <div className="space-y-1">
              <div className="label-sm text-muted-foreground">Primitives</div>
              <a href="/gallery/tokens" className="block hover:text-primary">Tokens</a>
              <a href="/gallery/logic" className="block hover:text-primary">System Logic</a>
            </div>

            <div className="pt-4 space-y-1">
              <div className="label-sm text-muted-foreground">Components</div>
              <a href="/gallery/core" className="block hover:text-primary">Core</a>
              <a href="/gallery/buttons" className="block hover:text-primary">Buttons</a>
              <a href="/gallery/badge" className="block hover:text-primary">Badges</a>
              <a href="/gallery/forms" className="block hover:text-primary">Forms</a>
              <a href="/gallery/date-picker" className="block hover:text-primary">Date Picker</a>
              <a href="/gallery/date-range-picker" className="block hover:text-primary text-muted-foreground text-xs pl-2">↳ Range (legacy)</a>
              <a href="/gallery/tables" className="block hover:text-primary">Tables</a>
              <a href="/gallery/data-table" className="block hover:text-primary">Data Table</a>
              <a href="/gallery/tabs" className="block hover:text-primary">Tabs</a>
              <a href="/gallery/toggle" className="block hover:text-primary">Toggle</a>
              <a href="/gallery/accordions" className="block hover:text-primary">Accordions</a>
              <a href="/gallery/command-palette" className="block hover:text-primary">Command Palette</a>
              <a href="/gallery/sidebar" className="block hover:text-primary">Sidebar</a>
              <a href="/gallery/header" className="block hover:text-primary">Header</a>
              <a href="/gallery/stats" className="block hover:text-primary">Stats</a>
              <a href="/gallery/overlays/background" className="block hover:text-primary">Overlay Background</a>
              <a href="/gallery/overlays/dialog" className="block hover:text-primary">Dialog</a>
              <a href="/gallery/overlays/sheet" className="block hover:text-primary">Sheet</a>
            </div>

            <div className="pt-4 space-y-1">
              <div className="label-sm text-muted-foreground">Composed Patterns</div>
              <a href="/gallery/modules/metric-panel" className="block hover:text-primary">Metric Panel</a>
              <a href="/gallery/empty-state" className="block hover:text-primary">Empty State</a>
            </div>
          </nav>
        </div>

        <div className="px-6 py-4 shrink-0 border-t border-[var(--border)] flex flex-col gap-3">
          <ToggleGroup
            variant="outline"
            size="sm"
            type="single"
            value={colorTheme}
            onValueChange={(value) => {
              if (!value) return
              setColorTheme(value as "violet" | "black")
            }}
            className="inline-flex"
          >
            <ToggleGroupItem value="violet">Violet</ToggleGroupItem>
            <ToggleGroupItem value="black">Black</ToggleGroupItem>
          </ToggleGroup>
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
          <aside className="absolute left-0 top-0 h-full w-64 bg-card border-r border-[var(--border)] shadow-[var(--elevation-overlay)] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
              <a href="/gallery" onClick={() => setMobileOpen(false)}>
                <img src="/logo.png" alt="Wyllo" className="h-8 w-auto" />
              </a>
              <button onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <nav className="space-y-2 p-sm pb-4">
                <div className="space-y-1">
                  <div className="label-sm text-muted-foreground">Primitives</div>
                  <a href="/gallery/tokens" className="block" onClick={() => setMobileOpen(false)}>Tokens</a>
                  <a href="/gallery/logic" className="block" onClick={() => setMobileOpen(false)}>System Logic</a>
                </div>

                <div className="pt-4 space-y-1">
                  <div className="label-sm text-muted-foreground">Components</div>
                  <a href="/gallery/core" className="block" onClick={() => setMobileOpen(false)}>Core</a>
                  <a href="/gallery/buttons" className="block" onClick={() => setMobileOpen(false)}>Buttons</a>
                  <a href="/gallery/badge" className="block" onClick={() => setMobileOpen(false)}>Badges</a>
                  <a href="/gallery/forms" className="block" onClick={() => setMobileOpen(false)}>Forms</a>
                  <a href="/gallery/date-picker" className="block" onClick={() => setMobileOpen(false)}>Date Picker</a>
                  <a href="/gallery/date-range-picker" className="block text-muted-foreground text-xs pl-2" onClick={() => setMobileOpen(false)}>↳ Range (legacy)</a>
                  <a href="/gallery/tables" className="block" onClick={() => setMobileOpen(false)}>Tables</a>
                  <a href="/gallery/data-table" className="block" onClick={() => setMobileOpen(false)}>Data Table</a>
                  <a href="/gallery/tabs" className="block" onClick={() => setMobileOpen(false)}>Tabs</a>
                  <a href="/gallery/toggle" className="block" onClick={() => setMobileOpen(false)}>Toggle</a>
                  <a href="/gallery/accordions" className="block" onClick={() => setMobileOpen(false)}>Accordions</a>
                  <a href="/gallery/command-palette" className="block" onClick={() => setMobileOpen(false)}>Command Palette</a>
                  <a href="/gallery/sidebar" className="block" onClick={() => setMobileOpen(false)}>Sidebar</a>
                  <a href="/gallery/header" className="block" onClick={() => setMobileOpen(false)}>Header</a>
                  <a href="/gallery/stats" className="block" onClick={() => setMobileOpen(false)}>Stats</a>
                  <a href="/gallery/overlays/background" className="block" onClick={() => setMobileOpen(false)}>Overlay Background</a>
                  <a href="/gallery/overlays/dialog" className="block" onClick={() => setMobileOpen(false)}>Dialog</a>
                  <a href="/gallery/overlays/sheet" className="block" onClick={() => setMobileOpen(false)}>Sheet</a>
                </div>

                <div className="pt-4 space-y-1">
                  <div className="label-sm text-muted-foreground">Composed Patterns</div>
                  <a href="/gallery/modules/metric-panel" className="block" onClick={() => setMobileOpen(false)}>Metric Panel</a>
                  <a href="/gallery/empty-state" className="block" onClick={() => setMobileOpen(false)}>Empty State</a>
                </div>
              </nav>
            </div>

            <div className="px-6 py-4 shrink-0 border-t border-[var(--border)] flex flex-col gap-3">
              <ToggleGroup
                variant="outline"
                size="sm"
                type="single"
                value={colorTheme}
                onValueChange={(value) => {
                  if (!value) return
                  setColorTheme(value as "violet" | "black")
                }}
                className="inline-flex"
              >
                <ToggleGroupItem value="violet">Violet</ToggleGroupItem>
                <ToggleGroupItem value="black">Black</ToggleGroupItem>
              </ToggleGroup>
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