"use client"

import { useState } from "react"
import {
  Badge,
  BadgeAvatar,
  BadgeAvatarGroup,
  BadgeDelta,
  BadgeIcon,
  BadgeIndicator,
  ComboBadge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"
import {
  CheckCircle,
  Tag,
  Folder,
  Globe,
  Users,
} from "lucide-react"

const BADGE_ROWS: PropRow[] = [
  { prop: "variant", type: '"default" | "destructive" | "outline" | "ghost" | "success" | "warning" | "brand" | "review"', default: '"default"', description: "Visual style of the badge." },
  { prop: "onDismiss", type: "() => void", description: "When provided, an X appears on hover to dismiss the badge." },
  { prop: "asChild", type: "boolean", default: "false", description: "Merges badge styling onto a child element." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

const BADGE_SUB_ROWS: PropRow[] = [
  { prop: "BadgeIcon", type: "component", description: "Renders a Lucide icon inside the badge. Props: icon (LucideIcon, required), className." },
  { prop: "BadgeAvatar", type: "component", description: "Renders a small avatar. Props: src, alt, fallback, size ('sm' | 'md', default 'md')." },
  { prop: "BadgeAvatarGroup", type: "component", description: "Wraps multiple BadgeAvatars with overlapping layout." },
  { prop: "BadgeIndicator", type: "component", description: "Colored dot status indicator. Props: variant ('default' | 'success' | 'error' | 'warning'), pulse (boolean)." },
  { prop: "BadgeDelta", type: "component", description: "Shows a numeric delta with automatic up/down color. Props: delta (number, required)." },
]

const baseVariants = [
  {
    name: "default",
    description:
      "Neutral badge for general labeling. Use for non-semantic metadata like tags, IDs, or categories.",
  },
  {
    name: "outline",
    description:
      "Subtle bordered badge for passive states or filter tokens.",
  },
  {
    name: "ghost",
    description:
      "Like outline but without the border. Subtle badge for low-emphasis labels.",
  },
]

const semanticVariants = [
  {
    name: "success",
    description:
      "Positive outcome badge used for approvals, passes, or healthy states.",
  },
  {
    name: "warning",
    description:
      "Cautionary badge used for review states or attention-needed conditions.",
  },
  {
    name: "destructive",
    description:
      "Critical badge used for errors, blocked states, or high-risk indicators.",
  },
]

const domainVariants = [
  {
    name: "brand",
    description:
      "Brand-colored badge for feature highlights, promotions, or branded labels.",
  },
  {
    name: "review",
    description:
      "Manual review badge for items awaiting human evaluation, approval queues, or audit workflows.",
  },
]

const COMBO_BADGE_ROWS: PropRow[] = [
  { prop: "icon", type: "React.ElementType", description: "Icon displayed in the prefix segment." },
  { prop: "prefix", type: "ReactNode", required: true, description: "Prefix label (e.g. category name)." },
  { prop: "children", type: "ReactNode", required: true, description: "Value label." },
  { prop: "variant", type: '"default" | "success" | "warning" | "destructive" | "brand"', default: '"default"', description: "Color scheme applied to both segments." },
  { prop: "onDismiss", type: "() => void", description: "When provided, an X appears on hover over the value segment." },
]

function ComboBadgeSection() {
  const [tags, setTags] = useState([
    { id: 1, prefix: "Category", value: "Fraud", icon: Folder },
    { id: 2, prefix: "Region", value: "EMEA", icon: Globe },
    { id: 3, prefix: "Label", value: "Priority", icon: Tag },
  ])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="h2">Combo Badge</h2>
        <p className="p text-muted-foreground">
          A two-segment fused badge for category:value tag patterns. The prefix
          gets a stronger background and the value segment uses a lighter wash
          of the same tone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Variants */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Variants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <ComboBadge icon={Tag} prefix="combo" variant="default">badge</ComboBadge>
            <ComboBadge icon={Tag} prefix="combo" variant="success">badge</ComboBadge>
            <ComboBadge icon={Tag} prefix="combo" variant="warning">badge</ComboBadge>
            <ComboBadge icon={Tag} prefix="combo" variant="destructive">badge</ComboBadge>
            <ComboBadge icon={Tag} prefix="combo" variant="brand">badge</ComboBadge>
          </CardContent>
        </Card>

        {/* Dismissible */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Dismissible</CardTitle>
            <CardDescription>Click the X to remove a tag.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <ComboBadge
                key={tag.id}
                icon={tag.icon}
                prefix={tag.prefix}
                onDismiss={() => setTags((prev) => prev.filter((t) => t.id !== tag.id))}
              >
                {tag.value}
              </ComboBadge>
            ))}
            {tags.length === 0 && (
              <span className="p-sm text-muted-foreground">All tags dismissed. Refresh to reset.</span>
            )}
          </CardContent>
        </Card>

        {/* Without icon */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Without icon</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <ComboBadge prefix="Status">Active</ComboBadge>
            <ComboBadge prefix="Tier" variant="brand">Enterprise</ComboBadge>
          </CardContent>
        </Card>

        {/* Real-world example */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Filter tags</CardTitle>
            <CardDescription>Common pattern for applied filters.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <ComboBadge icon={Folder} prefix="Category" onDismiss={() => {}}>Fraud</ComboBadge>
            <ComboBadge icon={Globe} prefix="Region" onDismiss={() => {}}>EMEA</ComboBadge>
            <ComboBadge icon={Users} prefix="Team" onDismiss={() => {}}>Risk Ops</ComboBadge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function BadgeGalleryPage() {
  return (
    <div className="space-y-16">
      {/* SECTION 1 — VARIANTS */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="h1">Badges</h1>
          <p className="p text-muted-foreground">
            Semantic and structural badges used for labeling, status, and metadata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {baseVariants.map((variant) => (
            <Card key={variant.name} level={1}>
              <CardHeader className="space-y-1">
                <CardTitle className="label-md">{variant.name}</CardTitle>
                <CardDescription className="p-sm text-card-foreground">{variant.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Badge variant={variant.name as any}>{variant.name}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Semantic Meaning */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Semantic Meaning</h2>
          <p className="p text-muted-foreground">
            Variants that carry inherent meaning — use these when the badge communicates a status or outcome.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {semanticVariants.map((variant) => (
            <Card key={variant.name} level={1}>
              <CardHeader className="space-y-1">
                <CardTitle className="label-md">{variant.name}</CardTitle>
                <CardDescription className="p-sm text-card-foreground">{variant.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Badge variant={variant.name as any}>{variant.name}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Domain */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Domain</h2>
          <p className="p text-muted-foreground">
            Variants tied to brand identity or product-specific contexts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {domainVariants.map((variant) => (
            <Card key={variant.name} level={1}>
              <CardHeader className="space-y-1">
                <CardTitle className="label-md">{variant.name}</CardTitle>
                <CardDescription className="p-sm text-card-foreground">{variant.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Badge variant={variant.name as any}>{variant.name}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 2 — COMPOSED TYPES */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Composed Badge Patterns</h2>
          <p className="p text-muted-foreground">
            Advanced badge compositions built using badge subcomponents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Avatar */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default">
                <BadgeAvatar fallback="WH" />
                @wyllo
              </Badge>
            </CardContent>
          </Card>

          {/* Status with icon */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="success">
                <BadgeIcon icon={CheckCircle} />
                Approved
              </Badge>
            </CardContent>
          </Card>

          {/* Indicator (pulse) */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Indicator (Pulse)</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">
                <BadgeIndicator variant="success" pulse />
                Live
              </Badge>
            </CardContent>
          </Card>

          {/* Delta */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Delta</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default">
                <BadgeDelta delta={12} />
                ↑ 12%
              </Badge>
            </CardContent>
          </Card>

          {/* Icon */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Icon</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default">
                <BadgeIcon icon={Users} />
                24 users
              </Badge>
            </CardContent>
          </Card>

          {/* Avatar Group */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Avatar Group</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default">
                <BadgeAvatarGroup>
                  <BadgeAvatar fallback="AB" />
                  <BadgeAvatar fallback="CD" />
                  <BadgeAvatar fallback="EF" />
                </BadgeAvatarGroup>
                3 reviewers
              </Badge>
            </CardContent>
          </Card>

          {/* Dismissible */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Dismissible</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge onDismiss={() => {}}>Filter tag</Badge>
              <Badge variant="warning" onDismiss={() => {}}>Pending</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 3 — COMBO BADGE */}
      <ComboBadgeSection />

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Badge" rows={BADGE_ROWS} />
        <PropTable title="Sub-components" rows={BADGE_SUB_ROWS} />
        <PropTable title="ComboBadge" rows={COMBO_BADGE_ROWS} />
      </section>
    </div>
  )
}