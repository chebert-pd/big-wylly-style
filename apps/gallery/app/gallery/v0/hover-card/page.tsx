"use client"

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wyllo/ui"
import { CalendarDays } from "lucide-react"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const HOVER_CARD_ROWS: PropRow[] = [
  { prop: "openDelay", type: "number", default: "700", description: "Milliseconds before the card opens on hover." },
  { prop: "closeDelay", type: "number", default: "300", description: "Milliseconds before the card closes after leaving." },
  { prop: "open", type: "boolean", description: "Controlled open state." },
  { prop: "onOpenChange", type: "(open: boolean) => void", description: "Callback fired when the open state changes." },
]

const HOVER_CARD_TRIGGER_ROWS: PropRow[] = [
  { prop: "asChild", type: "boolean", default: "false", description: "Merge trigger behavior onto a child element." },
  { prop: "children", type: "ReactNode", required: true, description: "The element that activates the hover card on hover." },
]

const HOVER_CARD_CONTENT_ROWS: PropRow[] = [
  { prop: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Horizontal alignment relative to the trigger." },
  { prop: "sideOffset", type: "number", default: "4", description: "Distance in pixels from the trigger." },
  { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred side of the trigger to render on." },
  { prop: "className", type: "string", description: "Additional CSS classes. Default width is w-64." },
]

export default function HoverCardGalleryPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Hover Card</h1>
        <p className="p text-muted-foreground">
          A floating content panel that appears when hovering over a trigger
          element. Ideal for previewing user profiles, link details, or
          supplemental information without navigating away.
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Examples</h2>
          <p className="p text-muted-foreground">
            Hover card patterns with various trigger elements and content layouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic - user profile */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">User Profile Preview</CardTitle>
              <CardDescription>
                Hover over the link to preview user details in a floating card.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0 h-auto">@wyllo</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/vercel.png" alt="@wyllo" />
                      <AvatarFallback>WY</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="label-sm">@wyllo</h4>
                      <p className="p-sm text-muted-foreground">
                        The design system for building consistent, accessible
                        interfaces.
                      </p>
                      <div className="flex items-center pt-2">
                        <CalendarDays className="mr-2 size-4 opacity-70" />
                        <span className="p-sm text-muted-foreground">
                          Joined December 2021
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardContent>
          </Card>

          {/* Simple text trigger */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Text Trigger</CardTitle>
              <CardDescription>
                A plain text trigger with a simple content panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="p-sm text-muted-foreground">
                Read more about the{" "}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      design tokens
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-2">
                      <h4 className="label-sm">Design Tokens</h4>
                      <p className="p-sm text-muted-foreground">
                        Tokens define the visual foundation of the design
                        system: colors, spacing, typography, and radii.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>{" "}
                in the documentation.
              </p>
            </CardContent>
          </Card>

          {/* With button trigger */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Button Trigger</CardTitle>
              <CardDescription>
                Attach a hover card to a button for contextual information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline">View Details</Button>
                </HoverCardTrigger>
                <HoverCardContent align="start">
                  <div className="space-y-2">
                    <h4 className="label-sm">Project Summary</h4>
                    <p className="p-sm text-muted-foreground">
                      12 components, 3 contributors, last updated 2 hours ago.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardContent>
          </Card>

          {/* Rich content */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Rich Content</CardTitle>
              <CardDescription>
                The content panel supports any layout including avatars and metadata.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0 h-auto">acme-corp/ui</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback>AC</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="label-sm">acme-corp/ui</h4>
                        <p className="p-sm text-muted-foreground">Component library</p>
                      </div>
                    </div>
                    <p className="p-sm text-muted-foreground">
                      A shared component library used by 14 internal projects.
                      Built with React 19 and Tailwind CSS v4.
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>142 stars</span>
                      <span>28 forks</span>
                      <span>TypeScript</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="HoverCard" rows={HOVER_CARD_ROWS} />
        <PropTable title="HoverCardTrigger" rows={HOVER_CARD_TRIGGER_ROWS} />
        <PropTable title="HoverCardContent" rows={HOVER_CARD_CONTENT_ROWS} />
      </section>
    </div>
  )
}
