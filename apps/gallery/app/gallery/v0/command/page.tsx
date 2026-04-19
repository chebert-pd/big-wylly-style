"use client"

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wyllo/ui"
import {
  ArrowUpRight,
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const COMMAND_ROWS: PropRow[] = [
  { prop: "className", type: "string", description: "Additional CSS classes on the root command container." },
  { prop: "children", type: "ReactNode", required: true, description: "CommandInput, CommandList, and other sub-components." },
]

const COMMAND_SUB_ROWS: PropRow[] = [
  { prop: "CommandInput", type: "component", description: "Search input with a built-in search icon. Props: placeholder (string), className." },
  { prop: "CommandList", type: "component", description: "Scrollable container for command results. Max height 300px by default." },
  { prop: "CommandEmpty", type: "component", description: "Shown when no results match the search query." },
  { prop: "CommandGroup", type: "component", description: "Groups related items under a heading. Props: heading (string)." },
  { prop: "CommandItem", type: "component", description: "A single selectable item. Props: onSelect, disabled, value, keywords." },
  { prop: "CommandShortcut", type: "component", description: "Keyboard shortcut hint displayed on the trailing edge of an item." },
  { prop: "CommandSeparator", type: "component", description: "Visual divider between groups." },
  { prop: "CommandDialog", type: "component", description: "Command wrapped in a Dialog for modal palette usage. Props: title, description, showCloseButton." },
]

export default function CommandGalleryPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Command</h1>
        <p className="p text-muted-foreground">
          A searchable command palette for quick actions and navigation. Built on
          cmdk, it provides fast keyboard-driven interaction with grouped items,
          search filtering, and shortcut hints.
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Examples</h2>
          <p className="p text-muted-foreground">
            Inline command menus demonstrating groups, search, shortcuts, and
            empty states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full palette */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Command Palette</CardTitle>
              <CardDescription>
                A complete command palette with grouped items, keyboard shortcuts,
                and search.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <Calendar className="mr-2 size-4" />
                      <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <Smile className="mr-2 size-4" />
                      <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                      <Calculator className="mr-2 size-4" />
                      <span>Calculator</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem>
                      <User className="mr-2 size-4" />
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <CreditCard className="mr-2 size-4" />
                      <span>Billing</span>
                      <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <Settings className="mr-2 size-4" />
                      <span>Settings</span>
                      <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>

          {/* Simple list */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Simple List</CardTitle>
              <CardDescription>
                A minimal command list without groups or shortcuts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search actions..." />
                <CommandList>
                  <CommandEmpty>No actions found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem>New file</CommandItem>
                    <CommandItem>Open file</CommandItem>
                    <CommandItem>Save</CommandItem>
                    <CommandItem>Export as PDF</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>

          {/* With shortcuts only */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Keyboard Shortcuts</CardTitle>
              <CardDescription>
                Highlight keyboard shortcuts alongside each item for power users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search shortcuts..." />
                <CommandList>
                  <CommandEmpty>No shortcuts found.</CommandEmpty>
                  <CommandGroup heading="Navigation">
                    <CommandItem>
                      <span>Go to Dashboard</span>
                      <CommandShortcut>⌘D</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <span>Go to Settings</span>
                      <CommandShortcut>⌘,</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <span>Search</span>
                      <CommandShortcut>⌘K</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Actions">
                    <CommandItem>
                      <span>Create new project</span>
                      <CommandShortcut>⌘N</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <span>Invite team member</span>
                      <CommandShortcut>⌘I</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>

          {/* With footer */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">With Footer</CardTitle>
              <CardDescription>
                A command palette with a contextual footer for hints, status, or
                navigation breadcrumbs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Actions">
                    <CommandItem>
                      <Calendar className="mr-2 size-4" />
                      <span>Open Calendar</span>
                      <CommandShortcut>⌘O</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <User className="mr-2 size-4" />
                      <span>Switch Account</span>
                      <CommandShortcut>⌘U</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <Settings className="mr-2 size-4" />
                      <span>Preferences</span>
                      <CommandShortcut>⌘,</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
                <div className="flex items-center justify-between border-t bg-secondary px-3 py-2">
                  <span className="p-sm text-muted-foreground">
                    3 results
                  </span>
                  <span className="p-sm text-muted-foreground">
                    ↑↓ navigate &middot; ↵ select &middot; esc close
                  </span>
                </div>
              </Command>
            </CardContent>
          </Card>

          {/* With promotional footer */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">With Promotional Footer</CardTitle>
              <CardDescription>
                A slot below the command list for promotional content — upgrade
                CTAs, feature announcements, or contextual tips.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Quick Actions">
                    <CommandItem>
                      <Calendar className="mr-2 size-4" />
                      <span>Open Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <Calculator className="mr-2 size-4" />
                      <span>Calculator</span>
                    </CommandItem>
                    <CommandItem>
                      <Settings className="mr-2 size-4" />
                      <span>Settings</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
                <div className="border-t bg-brand rounded-b-md px-4 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <svg viewBox="0 0 295.28 295.28" fill="currentColor" aria-hidden className="size-5 shrink-0 text-brand-solid">
                      <path d="M175.39,11.25l5.54,5.38c9.61,9.33,22.42,14.63,35.81,14.83l7.72.12c21.54.32,38.93,17.71,39.25,39.25l.12,7.72c.2,13.39,5.51,26.2,14.83,35.81l5.38,5.54c15,15.46,15,40.04,0,55.51l-5.38,5.54c-9.33,9.61-14.63,22.42-14.83,35.81l-.12,7.72c-.32,21.54-17.71,38.93-39.25,39.25l-7.72.12c-13.39.2-26.2,5.51-35.81,14.83l-5.54,5.38c-15.46,15-40.04,15-55.51,0l-5.54-5.38c-9.61-9.33-22.42-14.63-35.81-14.83l-7.72-.12c-21.54-.32-38.93-17.71-39.25-39.25l-.12-7.72c-.2-13.39-5.51-26.2-14.83-35.81l-5.38-5.54c-15-15.46-15-40.04,0-55.51l5.38-5.54c9.33-9.61,14.63-22.42,14.83-35.81l.12-7.72c.32-21.54,17.71-38.93,39.25-39.25l7.72-.12c13.39-.2,26.2-5.51,35.81-14.83l5.54-5.38c15.46-15,40.04-15,55.51,0Z" opacity=".15"/>
                      <path d="M129.62,46.85c12.04,8.69,28.21,9.01,40.59.81,25.11-16.64,58.26,3.4,55.21,33.36-1.5,14.77,6.3,28.94,19.59,35.56,26.96,13.43,26.19,52.15-1.29,64.49-13.55,6.08-21.91,19.92-21,34.75,1.85,30.06-32.07,48.76-56.5,31.13-12.04-8.69-28.21-9.01-40.59-.81-25.11,16.64-58.26-3.4-55.21-33.36,1.5-14.77-6.3-28.94-19.59-35.56-26.96-13.43-26.19-52.15,1.29-64.49,13.55-6.08,21.91-19.92,21-34.75-1.85-30.06,32.07-48.76,56.5-31.13Z" opacity=".4"/>
                      <path d="M170.72,78.73c4.49,9.49,14.39,15.2,24.85,14.35,21.22-1.73,34.9,21.97,22.79,39.48-5.97,8.63-5.97,20.06,0,28.69,12.11,17.51-1.58,41.21-22.79,39.48-10.46-.85-20.36,4.86-24.85,14.35-9.11,19.24-36.48,19.24-45.59,0-4.49-9.49-14.39-15.2-24.85-14.35-21.22,1.73-34.9-21.97-22.79-39.48,5.97-8.63,5.97-20.06,0-28.69-12.11-17.51,1.58-41.21,22.79-39.48,10.46.85,20.36-4.86,24.85-14.35,9.11-19.24,36.48-19.24,45.59,0Z"/>
                    </svg>
                    <span className="p-sm text-brand-foreground truncate">
                      Unlock advanced search with <span className="font-[520]">Wyllo Pro</span>
                    </span>
                  </div>
                  <a
                    href="#"
                    className="p-sm font-[520] text-brand-foreground hover:underline whitespace-nowrap"
                  >
                    Learn more <ArrowUpRight className="inline size-3.5" />
                  </a>
                </div>
              </Command>
            </CardContent>
          </Card>

          {/* Disabled items */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Disabled Items</CardTitle>
              <CardDescription>
                Individual items can be disabled to prevent selection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Account">
                    <CommandItem>
                      <User className="mr-2 size-4" />
                      <span>Edit profile</span>
                    </CommandItem>
                    <CommandItem disabled>
                      <CreditCard className="mr-2 size-4" />
                      <span>Upgrade plan (unavailable)</span>
                    </CommandItem>
                    <CommandItem>
                      <Settings className="mr-2 size-4" />
                      <span>Preferences</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Command" rows={COMMAND_ROWS} />
        <PropTable title="Sub-components" rows={COMMAND_SUB_ROWS} />
      </section>
    </div>
  )
}
