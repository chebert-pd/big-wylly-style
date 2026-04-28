"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Circle, ExternalLink, Moon, Sun } from "lucide-react"
import {
  Button,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSearchTrigger,
  SidebarTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@chebert-pd/ui"
import { WylloSymbol } from "@/app/gallery/_components/wyllo-symbol"

const FIGMA_FILE_URL =
  "https://www.figma.com/design/4znvIjTFi15R2x4QoiaPdf/Big-Wylly-Style"

type NavItem = {
  href: string
  label: string
  children?: { href: string; label: string }[]
}

type NavGroup = { label: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    label: "Primitives",
    items: [
      { href: "/gallery/setup", label: "Setup" },
      { href: "/gallery/logic", label: "System Logic" },
      {
        href: "/gallery/tokens",
        label: "Tokens",
        children: [
          { href: "/gallery/tokens/typography", label: "Typography" },
          { href: "/gallery/tokens/colors", label: "Colors" },
          { href: "/gallery/tokens/surfaces", label: "Surfaces & Elevation" },
        ],
      },
      { href: "/gallery/process", label: "Process" },
      {
        href: "/gallery/skills",
        label: "Agentic Skills",
        children: [
          { href: "/gallery/skills/codebase-index-fix", label: "Codebase Index Fix" },
          { href: "/gallery/skills/governance-auditor", label: "Governance Auditor" },
          { href: "/gallery/skills/governance-auditor/setup", label: "Auditor — Setup Guide" },
        ],
      },
    ],
  },
  {
    label: "Components",
    items: [
      { href: "/gallery/accordions", label: "Accordions" },
      { href: "/gallery/badge", label: "Badges" },
      { href: "/gallery/breadcrumb", label: "Breadcrumb" },
      { href: "/gallery/buttons", label: "Buttons" },
      { href: "/gallery/chart", label: "Chart" },
      { href: "/gallery/collapsible", label: "Collapsible" },
      { href: "/gallery/command-palette", label: "Command Palette" },
      { href: "/gallery/date-picker", label: "Date Picker" },
      { href: "/gallery/overlays/drawer", label: "Drawer" },
      {
        href: "/gallery/overlays/dialog",
        label: "Dialog",
        children: [
          { href: "/gallery/overlays/dialog/alert", label: "Alert Dialog" },
          { href: "/gallery/overlays/dialog/responsive", label: "Responsive Dialog" },
        ],
      },
      { href: "/gallery/overlays/background", label: "Overlay Background" },
      { href: "/gallery/overlays/sheet", label: "Sheet" },
      { href: "/gallery/pagination", label: "Pagination" },
      { href: "/gallery/progress", label: "Progress" },
      { href: "/gallery/resizable", label: "Resizable" },
      { href: "/gallery/stats", label: "StatBlock" },
      { href: "/gallery/steps", label: "Steps" },
      { href: "/gallery/tables", label: "Tables" },
      { href: "/gallery/tabs", label: "Tabs" },
      { href: "/gallery/timeline", label: "Timeline" },
      { href: "/gallery/toggle", label: "Toggle" },
    ],
  },
  {
    label: "Composed Patterns",
    items: [
      { href: "/gallery/data-table", label: "Data Table" },
      { href: "/gallery/empty-state", label: "Empty State" },
      { href: "/gallery/error-states", label: "Error States" },
      { href: "/gallery/forms", label: "Forms" },
      { href: "/gallery/full-screen-panel", label: "Full Screen Sheet" },
      { href: "/gallery/header", label: "Header" },
      { href: "/gallery/modules/metric-panel", label: "Metric Panel" },
      { href: "/gallery/pagination-toolbar", label: "Pagination Toolbar" },
      { href: "/gallery/side-panel", label: "Side Panel" },
      { href: "/gallery/sidebar", label: "Sidebar" },
    ],
  },
  {
    label: "v0",
    items: [
      { href: "/gallery/v0/aspect-ratio", label: "Aspect Ratio" },
      { href: "/gallery/v0/avatar", label: "Avatar" },
      { href: "/gallery/v0/breadcrumb", label: "Breadcrumb" },
      { href: "/gallery/v0/collapsible", label: "Collapsible" },
      { href: "/gallery/v0/command", label: "Command" },
      { href: "/gallery/v0/form", label: "Form" },
      { href: "/gallery/v0/hover-card", label: "Hover Card" },
      { href: "/gallery/v0/input-otp", label: "Input OTP" },
      { href: "/gallery/v0/kbd", label: "Kbd" },
      { href: "/gallery/v0/scroll-area", label: "Scroll Area" },
      { href: "/gallery/v0/skeleton", label: "Skeleton" },
      { href: "/gallery/v0/spinner", label: "Spinner" },
      { href: "/gallery/v0/toast", label: "Toast" },
      { href: "/gallery/v0/tooltip", label: "Tooltip" },
    ],
  },
]

export function GallerySidebar({
  theme,
  setTheme,
}: {
  theme: "light" | "dark"
  setTheme: (t: "light" | "dark") => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)

  const navigate = (href: string) => {
    setSearchOpen(false)
    router.push(href)
  }
  const openFigma = () => {
    setSearchOpen(false)
    window.open(FIGMA_FILE_URL, "_blank", "noopener,noreferrer")
  }
  const toggleTheme = () => {
    setSearchOpen(false)
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2 pt-2 pb-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:px-0">
          <a href="/gallery" className="flex items-center">
            <img
              src="/logo.png"
              alt="Wyllo"
              className="h-8 w-auto group-data-[collapsible=icon]:hidden"
            />
            <WylloSymbol className="hidden size-7 text-foreground group-data-[collapsible=icon]:block" />
          </a>
          <div className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
            <SidebarSearchTrigger
              open={searchOpen}
              onOpenChange={setSearchOpen}
              label="Search the gallery"
            >
              <CommandInput placeholder="Search pages, sections, actions…" />
              <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-3 py-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={toggleTheme}
                  className="gap-1.5"
                >
                  {theme === "light" ? <Moon /> : <Sun />}
                  {theme === "light" ? "Dark" : "Light"}
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={openFigma}
                  className="gap-1.5"
                >
                  <ExternalLink /> Figma
                </Button>
                <Button
                  variant="link"
                  size="xs"
                  onClick={() => navigate("/gallery/process")}
                  className="gap-1.5"
                >
                  <Circle /> Process
                </Button>
                <Button
                  variant="link"
                  size="xs"
                  onClick={() => navigate("/gallery/skills")}
                  className="gap-1.5"
                >
                  <Circle /> Skills
                </Button>
              </div>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {NAV.map((group) => (
                  <CommandGroup key={group.label} heading={group.label}>
                    {group.items.flatMap((item) => [
                      <CommandItem
                        key={item.href}
                        value={item.label}
                        onSelect={() => navigate(item.href)}
                      >
                        <Circle />
                        <span>{item.label}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {group.label}
                        </span>
                      </CommandItem>,
                      ...(item.children ?? []).map((child) => (
                        <CommandItem
                          key={child.href}
                          value={`${item.label} ${child.label}`}
                          onSelect={() => navigate(child.href)}
                        >
                          <Circle />
                          <span>{child.label}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {item.label}
                          </span>
                        </CommandItem>
                      )),
                    ])}
                  </CommandGroup>
                ))}
              </CommandList>
            </SidebarSearchTrigger>
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <a href={item.href}>
                      <Circle />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.children && (
                    <SidebarMenuSub>
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === child.href}
                          >
                            <a href={child.href}>
                              <Circle />
                              <span>{child.label}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <ToggleGroup
          variant="outline"
          size="sm"
          type="single"
          value={theme}
          onValueChange={(value) => {
            if (!value) return
            setTheme(value as "light" | "dark")
          }}
          className="inline-flex group-data-[collapsible=icon]:hidden"
        >
          <ToggleGroupItem value="light" className="gap-2">
            <Sun size={16} /> Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" className="gap-2">
            <Moon size={16} /> Dark
          </ToggleGroupItem>
        </ToggleGroup>
        <Button
          variant="ghost"
          size="xs"
          iconOnly
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="hidden size-7 group-data-[collapsible=icon]:flex"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
