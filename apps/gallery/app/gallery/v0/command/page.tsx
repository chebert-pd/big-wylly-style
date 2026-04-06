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
