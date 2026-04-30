"use client"

import { useEffect, useState } from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@chebert-pd/ui"
import { GallerySidebar } from "@/app/gallery/_components/gallery-sidebar"

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light")

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
    <SidebarProvider>
      <GallerySidebar theme={theme} setTheme={setTheme} />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background px-4 py-3 md:hidden">
          <SidebarTrigger />
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-x-clip">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
