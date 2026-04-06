"use client"

import { useState } from "react"
import {
  cn,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Separator,
  ToggleGroup,
  ToggleGroupItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  RotateCcw,
  ShieldAlert,
  Settings,
  CreditCard,
  Plug,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Building,
  Bell,
  Upload,
  UserCog,
  Monitor,
  Smartphone,
  Menu,
} from "lucide-react"

/* ─── API Reference Data ──────────────────────────────────────────────────── */

const SIDEBAR_PROVIDER_ROWS: PropRow[] = [
  { prop: "defaultOpen", type: "boolean", default: "true", description: "Initial open state of the sidebar." },
  { prop: "open", type: "boolean", description: "Controlled open state." },
  { prop: "onOpenChange", type: "(open: boolean) => void", description: "Callback when the open state changes." },
]

const SIDEBAR_ROWS: PropRow[] = [
  { prop: "side", type: '"left" | "right"', default: '"left"', description: "Which side of the viewport the sidebar appears on." },
  { prop: "variant", type: '"sidebar" | "floating" | "inset"', default: '"sidebar"', description: "Visual style. Sidebar: flush with border. Floating: detached with shadow. Inset: content area gets rounded corners." },
  { prop: "collapsible", type: '"offcanvas" | "icon" | "none"', default: '"offcanvas"', description: "Collapse behavior. Offcanvas: slides off-screen. Icon: shrinks to icon-only rail. None: always visible." },
]

const SIDEBAR_MENU_BUTTON_ROWS: PropRow[] = [
  { prop: "asChild", type: "boolean", default: "false", description: "Merge props onto a child element (e.g. a Link)." },
  { prop: "isActive", type: "boolean", default: "false", description: "Highlights the button as the current page." },
  { prop: "variant", type: '"default" | "outline"', default: '"default"', description: "Visual style of the menu button." },
  { prop: "size", type: '"default" | "sm" | "lg"', default: '"default"', description: "Button height. lg is useful for account switchers." },
  { prop: "tooltip", type: "string | TooltipContentProps", description: "Tooltip shown when sidebar is collapsed to icon mode." },
]

const SIDEBAR_SUB_ROWS: PropRow[] = [
  { prop: "SidebarHeader", type: "component", description: "Top section — typically holds a logo or app name." },
  { prop: "SidebarContent", type: "component", description: "Scrollable main area containing groups and menus." },
  { prop: "SidebarFooter", type: "component", description: "Bottom section — typically holds user/account info." },
  { prop: "SidebarGroup", type: "component", description: "Groups related menu items with optional label." },
  { prop: "SidebarGroupLabel", type: "component", description: "Section heading for a group. Hidden when collapsed to icon mode." },
  { prop: "SidebarGroupContent", type: "component", description: "Wrapper for the menu items within a group." },
  { prop: "SidebarMenu", type: "component", description: "Renders a <ul> for menu items." },
  { prop: "SidebarMenuItem", type: "component", description: "Renders a <li> for a single menu item." },
  { prop: "SidebarMenuButton", type: "component", description: "The clickable button within a menu item. Supports active state, tooltips, and asChild for Links." },
  { prop: "SidebarMenuBadge", type: "component", description: "Badge positioned inside a menu item (e.g. notification count)." },
  { prop: "SidebarMenuSub", type: "component", description: "Nested sub-menu with a left border indicator." },
  { prop: "SidebarMenuSubItem", type: "component", description: "Item within a sub-menu." },
  { prop: "SidebarMenuSubButton", type: "component", description: "Button within a sub-menu item. Supports asChild and isActive." },
  { prop: "SidebarRail", type: "component", description: "Invisible drag handle at the sidebar edge for resize/toggle." },
  { prop: "SidebarInset", type: "component", description: "Main content area that adjusts for sidebar width. Use as <main> wrapper." },
  { prop: "SidebarTrigger", type: "component", description: "Toggle button for opening/closing the sidebar. Uses the PanelLeft icon." },
  { prop: "SidebarInput", type: "component", description: "Search input styled for the sidebar context." },
  { prop: "SidebarSeparator", type: "component", description: "Horizontal rule with sidebar-appropriate margins." },
  { prop: "useSidebar", type: "hook", description: "Returns { state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }." },
]

/* ─── Demo Nav Data ───────────────────────────────────────────────────────── */

const platformNav = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Returns", icon: RotateCcw },
  { label: "Chargebacks", icon: ShieldAlert },
]

const accountTopLevel = [
  { label: "Policies", icon: FileText },
  { label: "Integrations", icon: Plug },
  { label: "Billing", icon: CreditCard },
  { label: "Account", icon: Settings, hasChildren: true },
]

const accountSubNav = [
  { label: "Organization Details", icon: Building },
  { label: "Team Access", icon: Users },
  { label: "Review Settings", icon: UserCog },
  { label: "Notification Settings", icon: Bell },
  { label: "Data Imports", icon: Upload },
]

/* ─── Static Sidebar Shell ────────────────────────────────────────────────── */

function DemoSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-56 shrink-0 border-r border-border bg-background flex flex-col h-full">
      {children}
    </div>
  )
}

/* ─── Shared sidebar nav content ──────────────────────────────────────────── */

function SidebarNavContent({
  view,
  setView,
}: {
  view: "main" | "account"
  setView: (v: "main" | "account") => void
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 p-3">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-[620]">
          W
        </div>
        <span className="label-md">wyllo</span>
      </div>

      {/* Nav content */}
      <div className="flex-1 overflow-auto p-2">
        {view === "main" ? (
          <>
            <div className="px-2 py-1.5">
              <span className="text-xs font-medium text-sidebar-foreground/70">Platform</span>
            </div>
            <SidebarMenu>
              {platformNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton isActive={item.label === "Orders"}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <div className="px-2 py-1.5 mt-4">
              <span className="text-xs font-medium text-sidebar-foreground/70">Account</span>
            </div>
            <SidebarMenu>
              {accountTopLevel.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={item.hasChildren ? () => setView("account") : undefined}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                    {item.hasChildren && (
                      <ChevronRight className="ml-auto size-4 text-muted-foreground" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        ) : (
          <>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setView("main")}>
                  <ChevronLeft className="size-4" />
                  <span>Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu className="mt-1">
              {accountSubNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-[520] text-muted-foreground">
                CH
              </div>
              <div className="flex flex-col gap-0.5 leading-none min-w-0">
                <span className="label-sm truncate">Time Freeze Vin...</span>
                <span className="p-sm text-muted-foreground truncate">cass.hebert@nofra...</span>
              </div>
              <ChevronUp className="ml-auto size-4 text-muted-foreground shrink-0" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function SidebarPage() {
  const [view, setView] = useState<"main" | "account">("main")
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="space-y-16">
      <div className="space-y-2">
        <h1 className="h1">Sidebar</h1>
        <p className="p text-muted-foreground">
          Collapsible navigation sidebar with icon-only mode, mobile sheet drawer, keyboard shortcut (Cmd+B), and grouped menu structure.
        </p>
      </div>

      {/* Live demo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="h2">Example</h2>
            <p className="p text-muted-foreground">
              A typical app sidebar with drill-down navigation. Click &ldquo;Account&rdquo; to see the sub-page pattern.
            </p>
          </div>
          <ToggleGroup
            variant="outline"
            size="sm"
            type="single"
            value={device}
            onValueChange={(v) => { if (v) setDevice(v as "desktop" | "mobile") }}
            className="inline-flex"
          >
            <ToggleGroupItem value="desktop" className="gap-1.5">
              <Monitor className="size-3.5" /> Desktop
            </ToggleGroupItem>
            <ToggleGroupItem value="mobile" className="gap-1.5">
              <Smartphone className="size-3.5" /> Mobile
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {device === "desktop" ? (
          <Card level={1} className="overflow-hidden">
            <CardContent className="p-0">
              <SidebarProvider defaultOpen={true} className="min-h-0 h-[540px]">
                <DemoSidebar>
                  <SidebarNavContent view={view} setView={setView} />
                </DemoSidebar>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <span className="label-sm text-muted-foreground">
                      {view === "main" ? "Orders" : "Account"}
                    </span>
                  </div>
                  <div className="flex-1 p-6">
                    <p className="p text-muted-foreground">Main content area. The sidebar adjusts this space automatically.</p>
                  </div>
                </div>
              </SidebarProvider>
            </CardContent>
          </Card>
        ) : (
          <div className="flex justify-center">
            <Card level={1} className="overflow-hidden w-[375px]">
              <CardContent className="p-0">
                <SidebarProvider defaultOpen={true} className="min-h-0 h-[667px] flex-col">
                  {/* Mobile fixed header bar */}
                  <div className="flex items-center justify-between border-b border-border px-4 h-14 bg-background shrink-0 z-20">
                    <button
                      onClick={() => setMobileOpen(!mobileOpen)}
                      className="flex items-center justify-center size-8 rounded-md hover:bg-accent"
                    >
                      <Menu className="size-5" />
                    </button>
                    <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-[620]">
                      W
                    </div>
                    <div className="size-8" />
                  </div>

                  {/* Content + drawer overlay */}
                  <div className="relative flex-1 overflow-hidden">
                    {/* Main content */}
                    <div className="absolute inset-0 p-6">
                      <p className="p text-muted-foreground">Tap the hamburger menu to open the sidebar drawer.</p>
                    </div>

                    {/* Scrim — only visible when drawer is open */}
                    {mobileOpen && (
                      <div
                        className="absolute inset-0 bg-foreground/10 z-10 transition-opacity"
                        onClick={() => setMobileOpen(false)}
                      />
                    )}

                    {/* Sidebar drawer — slides in/out */}
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 z-20 w-72 bg-background flex flex-col shadow-[var(--elevation-overlay)] transition-transform duration-200 ease-out",
                        mobileOpen ? "translate-x-0" : "-translate-x-full",
                      )}
                    >
                      <SidebarNavContent view={view} setView={setView} />
                    </div>
                  </div>
                </SidebarProvider>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Separator />

      {/* Variants */}
      <div className="space-y-6">
        <h2 className="h2">Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card level={1}>
            <CardHeader className="pb-4">
              <CardTitle className="label-md">sidebar</CardTitle>
              <CardDescription>Flush against the viewport edge with a border separator. Default variant.</CardDescription>
            </CardHeader>
          </Card>
          <Card level={1}>
            <CardHeader className="pb-4">
              <CardTitle className="label-md">floating</CardTitle>
              <CardDescription>Detached from the edge with rounded corners and a shadow. Good for dashboards.</CardDescription>
            </CardHeader>
          </Card>
          <Card level={1}>
            <CardHeader className="pb-4">
              <CardTitle className="label-md">inset</CardTitle>
              <CardDescription>Content area gets rounded corners and a shadow, creating a contained feel.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Collapse modes */}
      <div className="space-y-6">
        <h2 className="h2">Collapse Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card level={1}>
            <CardHeader className="pb-4">
              <CardTitle className="label-md">offcanvas</CardTitle>
              <CardDescription>Sidebar slides completely off-screen when collapsed. Default mode.</CardDescription>
            </CardHeader>
          </Card>
          <Card level={1}>
            <CardHeader className="pb-4">
              <CardTitle className="label-md">icon</CardTitle>
              <CardDescription>Shrinks to a narrow rail showing only icons. Tooltips appear on hover.</CardDescription>
            </CardHeader>
          </Card>
          <Card level={1}>
            <CardHeader className="pb-4">
              <CardTitle className="label-md">none</CardTitle>
              <CardDescription>Sidebar is always visible and cannot be collapsed.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Separator />

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="SidebarProvider" rows={SIDEBAR_PROVIDER_ROWS} />
        <PropTable title="Sidebar" rows={SIDEBAR_ROWS} />
        <PropTable title="SidebarMenuButton" rows={SIDEBAR_MENU_BUTTON_ROWS} />
        <PropTable title="Sub-components & Hooks" rows={SIDEBAR_SUB_ROWS} />
      </section>
    </div>
  )
}
