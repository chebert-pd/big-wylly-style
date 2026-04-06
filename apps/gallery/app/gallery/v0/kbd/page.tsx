"use client"

import {
  Kbd,
  KbdGroup,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const KBD_ROWS: PropRow[] = [
  { prop: "children", type: "ReactNode", required: true, description: "The key label text or icon to display." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

const KBD_GROUP_ROWS: PropRow[] = [
  { prop: "children", type: "ReactNode", required: true, description: "Multiple Kbd elements representing a key combination." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function KbdGalleryPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Kbd</h1>
        <p className="p text-muted-foreground">
          Inline keyboard key indicators for displaying keyboard shortcuts and
          key combinations. Pairs with KbdGroup for multi-key sequences.
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Examples</h2>
          <p className="p text-muted-foreground">
            Single keys, key combinations, and grouped shortcut displays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Single keys */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Single Keys</CardTitle>
              <CardDescription>Individual key indicators for standalone references.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Kbd>Esc</Kbd>
              <Kbd>Enter</Kbd>
              <Kbd>Tab</Kbd>
              <Kbd>Space</Kbd>
              <Kbd>K</Kbd>
            </CardContent>
          </Card>

          {/* Key combination */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Key Combination</CardTitle>
              <CardDescription>Use KbdGroup to show multi-key shortcuts.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
                <span className="p-sm text-muted-foreground">Command palette</span>
              </div>
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>S</Kbd>
                </KbdGroup>
                <span className="p-sm text-muted-foreground">Save</span>
              </div>
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>⇧</Kbd>
                  <Kbd>P</Kbd>
                </KbdGroup>
                <span className="p-sm text-muted-foreground">Quick open</span>
              </div>
            </CardContent>
          </Card>

          {/* Modifier keys */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Modifier Keys</CardTitle>
              <CardDescription>Common modifier key indicators across platforms.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Kbd>⌘</Kbd>
              <Kbd>⌥</Kbd>
              <Kbd>⇧</Kbd>
              <Kbd>⌃</Kbd>
              <Kbd>Ctrl</Kbd>
              <Kbd>Alt</Kbd>
            </CardContent>
          </Card>

          {/* Inline with text */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Inline Usage</CardTitle>
              <CardDescription>Kbd renders inline alongside regular text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="p-sm text-muted-foreground">
                Press <Kbd>Esc</Kbd> to close the dialog.
              </p>
              <p className="p-sm text-muted-foreground">
                Use{" "}
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>{" "}
                to open search.
              </p>
              <p className="p-sm text-muted-foreground">
                Navigate items with <Kbd>↑</Kbd> and <Kbd>↓</Kbd> arrows.
              </p>
            </CardContent>
          </Card>

          {/* Shortcut list */}
          <Card level={1} className="md:col-span-2 xl:col-span-4">
            <CardHeader>
              <CardTitle className="label-md">Shortcut Reference</CardTitle>
              <CardDescription>A list layout common in keyboard shortcut panels.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {[
                  { keys: ["⌘", "K"], label: "Open command palette" },
                  { keys: ["⌘", "B"], label: "Toggle sidebar" },
                  { keys: ["⌘", "⇧", "F"], label: "Search in project" },
                  { keys: ["⌘", "/"], label: "Toggle comment" },
                  { keys: ["⌘", "D"], label: "Duplicate line" },
                  { keys: ["⌘", "⇧", "L"], label: "Select all occurrences" },
                ].map(({ keys, label }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0"
                  >
                    <span className="p-sm text-muted-foreground">{label}</span>
                    <KbdGroup>
                      {keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Kbd" rows={KBD_ROWS} />
        <PropTable title="KbdGroup" rows={KBD_GROUP_ROWS} />
      </section>
    </div>
  )
}
