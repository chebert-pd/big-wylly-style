"use client"

import * as React from "react"
import {
  AlertCircle,
  Bot,
  CreditCard,
  Eye,
  Package,
  Receipt,
  RotateCcw,
  Shield,
  ShieldCheck,
  ShieldOff,
  Store,
  Zap,
} from "lucide-react"

import { EmptyState } from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const EMPTY_STATE_ROWS: PropRow[] = [
  { prop: "title", type: "string", required: true, description: "The primary heading shown below the icon(s)." },
  { prop: "description", type: "string", required: true, description: "Supporting text. Use \\n for manual line breaks." },
  { prop: "icons", type: "LucideIcon[]", description: "Pass 1 icon for a single centered card, or exactly 3 icons to enable the fan spread animation on hover." },
  { prop: "action", type: '{ label: string; onClick: () => void }', description: "Optional CTA rendered as a primary button below the description." },
  { prop: "className", type: "string", description: "Additional CSS classes applied to the outer dashed card." },
]

export default function EmptyStatePage() {
  return (
    <div className="space-y-16 pb-16">
      <div>
        <h2 className="h2 mb-1">Empty State</h2>
        <p className="p text-muted-foreground">
          Shown when a product or feature isn&apos;t activated yet. Communicates
          what&apos;s missing, why it matters, and what to do next. Hover the
          card to see the icon animation.
        </p>
      </div>

      {/* Account not activated */}
      <section className="space-y-4">
        <h3 className="h3">Account not activated</h3>
        <p className="p-sm text-muted-foreground">
          Shown when the merchant has created an account but hasn&apos;t
          connected their store or turned on any products yet.
        </p>
        <EmptyState
          icons={[Store, Zap, ShieldCheck]}
          title="Activate your account"
          description={
            "You're almost there. Connect your store to start screening orders for fraud,\nprotecting against chargebacks, and managing returns."
          }
          action={{
            label: "Get started",
            onClick: () => {},
          }}
        />
      </section>

      {/* Order screening not enabled */}
      <section className="space-y-4">
        <h3 className="h3">Order screening not enabled</h3>
        <p className="p-sm text-muted-foreground">
          Shown on the Orders page when the merchant has an account but
          hasn&apos;t activated order review.
        </p>
        <EmptyState
          icons={[Package, Eye, AlertCircle]}
          title="Order screening is off"
          description={
            "You're not screening orders yet. Enable order review to get\nreal-time risk scores and fraud decisions at checkout."
          }
          action={{
            label: "Enable order screening",
            onClick: () => {},
          }}
        />
      </section>

      {/* Returns not connected */}
      <section className="space-y-4">
        <h3 className="h3">Returns screening not connected</h3>
        <p className="p-sm text-muted-foreground">
          Shown on the Returns page when the returns portal hasn&apos;t been
          integrated.
        </p>
        <EmptyState
          icons={[RotateCcw, Package, ShieldOff]}
          title="Returns screening is off"
          description={
            "Your return portal isn't connected yet. Enable returns review\nto flag fraudulent requests before they're approved."
          }
          action={{
            label: "Connect returns portal",
            onClick: () => {},
          }}
        />
      </section>

      {/* Chargeback management */}
      <section className="space-y-4">
        <h3 className="h3">Chargeback protection not active</h3>
        <p className="p-sm text-muted-foreground">
          Shown on the Chargebacks page when the merchant hasn&apos;t enrolled
          in chargeback management or indemnity coverage.
        </p>
        <EmptyState
          icons={[CreditCard, Shield, Receipt]}
          title="You're not protected yet"
          description={
            "Enable chargeback management to fight disputes automatically\nand recover lost revenue — with or without full indemnity."
          }
          action={{
            label: "Activate protection",
            onClick: () => {},
          }}
        />
      </section>

      {/* Single icon */}
      <section className="space-y-4">
        <h3 className="h3">Single icon</h3>
        <p className="p-sm text-muted-foreground">
          Use one icon when the context is clear enough without a fan, or when
          no action is available yet.
        </p>
        <EmptyState
          icons={[Bot]}
          title="AI insights not available"
          description={
            "There's no data to analyze yet. Insights will appear here\nonce you've screened your first orders."
          }
        />
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="h2">API Reference</h2>
        <PropTable title="EmptyState" rows={EMPTY_STATE_ROWS} />
      </section>
    </div>
  )
}
