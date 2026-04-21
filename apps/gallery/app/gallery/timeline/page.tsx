"use client"

import {
  AlertTriangle,
  Search,
  FileText,
  Scale,
  CheckCircle,
  ShieldAlert,
  ScanSearch,
  Brain,
  ListChecks,
  Route,
} from "lucide-react"

import {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineHeader,
  TimelineDate,
  TimelineTitle,
  TimelineContent,
  Card,
  CardContent,
  Badge,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const TIMELINE_ROWS: PropRow[] = [
  { prop: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout direction." },
  { prop: "alternating", type: "boolean", default: "false", description: "Alternates content between left and right sides of the indicator." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

const TIMELINE_ITEM_ROWS: PropRow[] = [
  { prop: "step", type: "number", default: "1", description: "Position in the timeline (1-indexed). Used for alternating layout." },
  { prop: "last", type: "boolean", default: "false", description: "Hides the connector line after this item." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

const TIMELINE_INDICATOR_ROWS: PropRow[] = [
  { prop: "variant", type: '"dot"', description: 'Renders a tiny subtle dot. Omit for default behavior: small filled dot when empty, larger outline circle when children are provided.' },
  { prop: "children", type: "ReactNode", description: "Content inside the indicator (icons, numbers). Automatically sizes up to a 24px circle." },
  { prop: "className", type: "string", description: "Additional CSS classes. Use to override border/bg for colored indicators." },
]

export default function TimelinePage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="h1">Timeline</h1>
        <p className="p text-muted-foreground">
          Chronological sequence of events with flexible indicators, dates, and content.
        </p>
      </div>

      {/* -------------------------------- */}
      {/* Default */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Default</h2>
        <Timeline className="max-w-lg">
          <TimelineItem step={1}>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle>Transaction flagged</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Risk engine detected anomalous purchasing pattern on order #38,291.
              Device fingerprint mismatch triggered elevated risk score of 87.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={2}>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle>Automated review initiated</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Order entered screening queue. Velocity check and BIN validation
              passed. Address verification returned partial match.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={3}>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle>Escalated to analyst</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Automated review inconclusive due to conflicting signals.
              Assigned to senior fraud analyst for manual investigation.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={4} last>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle>Case resolved</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Transaction approved and released for fulfillment.
              Customer device added to trusted profile.
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      {/* -------------------------------- */}
      {/* Left-aligned dates */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Left-aligned dates</h2>
        <Timeline className="max-w-lg">
          <TimelineItem step={1}>
            <TimelineDate>Jan 15, 10:23 AM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle>Transaction flagged</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Risk engine detected anomalous purchasing pattern on order #38,291.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={2}>
            <TimelineDate>Jan 15, 10:45 AM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle>Automated review</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Velocity check and BIN validation passed. Address verification returned partial match.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={3}>
            <TimelineDate>Jan 16, 9:12 AM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle>Escalated to analyst</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Assigned to senior fraud analyst for manual investigation.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={4}>
            <TimelineDate>Jan 18, 2:30 PM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle>Customer verification</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Direct outreach confirmed legitimate purchase from a new device.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={5} last>
            <TimelineDate>Jan 19, 11:00 AM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle>Case resolved</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Transaction approved. Customer device added to trusted profile.
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      {/* -------------------------------- */}
      {/* With icons */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">With icons</h2>
        <Timeline className="max-w-lg">
          <TimelineItem step={1}>
            <TimelineIndicator className="border-destructive bg-destructive text-destructive-foreground">
              <AlertTriangle className="size-3.5" />
            </TimelineIndicator>
            <TimelineHeader>
              <TimelineTitle>Chargeback received</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Issuing bank filed dispute for $847.00 on order #41,205.
              Reason code: 10.4 — Fraud, Card-Absent Environment.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={2}>
            <TimelineIndicator>
              <Search className="size-3.5" />
            </TimelineIndicator>
            <TimelineHeader>
              <TimelineTitle>Evidence gathering</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Collecting delivery confirmation, AVS match, 3DS authentication
              result, and device fingerprint for representment.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={3}>
            <TimelineIndicator>
              <FileText className="size-3.5" />
            </TimelineIndicator>
            <TimelineHeader>
              <TimelineTitle>Response submitted</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Compelling evidence package sent to acquirer. Included signed
              delivery receipt and IP geolocation matching billing address.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={4}>
            <TimelineIndicator>
              <Scale className="size-3.5" />
            </TimelineIndicator>
            <TimelineHeader>
              <TimelineTitle>Pre-arbitration</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Issuer reviewed evidence and escalated to card network arbitration.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={5} last>
            <TimelineIndicator className="border-success bg-success text-success-foreground">
              <CheckCircle className="size-3.5" />
            </TimelineIndicator>
            <TimelineHeader>
              <TimelineTitle>Resolved — won</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Won in arbitration. $847.00 returned to merchant balance.
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      {/* -------------------------------- */}
      {/* With cards */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">With cards</h2>
        <Timeline className="max-w-lg">
          <TimelineItem step={1}>
            <TimelineIndicator>
              <ShieldAlert className="size-3.5" />
            </TimelineIndicator>
            <TimelineHeader>
              <TimelineTitle>Data ingestion</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <Card level={1} className="mt-2">
                <CardContent>
                  <p className="p-sm text-muted-foreground">
                    Collect transaction, device, and behavioral signals from checkout.
                    Includes IP address, device fingerprint, session duration, and cart composition.
                  </p>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={2}>
            <TimelineIndicator>
              <ScanSearch className="size-3.5" />
            </TimelineIndicator>
            <TimelineHeader>
              <TimelineTitle>Signal enrichment</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <Card level={1} className="mt-2">
                <CardContent>
                  <p className="p-sm text-muted-foreground">
                    Cross-reference IP geolocation, BIN data, email age,
                    and velocity checks against known fraud patterns.
                  </p>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={3}>
            <TimelineIndicator>
              <Brain className="size-3.5" />
            </TimelineIndicator>
            <TimelineHeader>
              <TimelineTitle>Model scoring</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <Card level={1} className="mt-2">
                <CardContent>
                  <p className="p-sm text-muted-foreground">
                    Run enriched signals through ensemble ML models to produce
                    a risk probability score between 0 and 100.
                  </p>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={4} last>
            <TimelineIndicator>
              <Route className="size-3.5" />
            </TimelineIndicator>
            <TimelineHeader>
              <TimelineTitle>Decision routing</TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <Card level={1} className="mt-2">
                <CardContent>
                  <p className="p-sm text-muted-foreground">
                    Route to approve, decline, or manual review queue based on
                    the final composite score and rule outcome.
                  </p>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      {/* -------------------------------- */}
      {/* Alternating */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Alternating</h2>
        <Timeline alternating className="max-w-2xl mx-auto">
          <TimelineItem step={1}>
            <TimelineDate>9:14 AM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader><TimelineTitle>Order placed</TimelineTitle></TimelineHeader>
            <TimelineContent>
              Customer completed checkout for $1,247.00.
              New account, first purchase, express shipping.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={2}>
            <TimelineDate>9:14 AM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader><TimelineTitle>Risk score: 72</TimelineTitle></TimelineHeader>
            <TimelineContent>
              Elevated risk due to new account + high value.
              Routed to manual review queue.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={3}>
            <TimelineDate>10:30 AM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader><TimelineTitle>Analyst review</TimelineTitle></TimelineHeader>
            <TimelineContent>
              Shipping address matches known reshipping service.
              Email domain registered 3 days ago.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={4}>
            <TimelineDate>10:48 AM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader><TimelineTitle>Order declined</TimelineTitle></TimelineHeader>
            <TimelineContent>
              Declined based on reshipping indicator
              and newly registered email domain.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={5} last>
            <TimelineDate>11:02 AM</TimelineDate>
            <TimelineIndicator />
            <TimelineHeader><TimelineTitle>Customer notified</TimelineTitle></TimelineHeader>
            <TimelineContent>
              Decline notification sent with instructions
              to contact support for verification.
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      {/* -------------------------------- */}
      {/* Pipeline with badges */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Pipeline with badges</h2>
        <Timeline className="max-w-lg">
          <TimelineItem step={1}>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle className="flex items-center gap-2">
                Velocity check <Badge variant="success">Passed</Badge>
              </TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Transaction velocity within normal range. 2 orders in 30 days.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={2}>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle className="flex items-center gap-2">
                Address verification <Badge variant="success">Passed</Badge>
              </TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              AVS returned full match on street address and ZIP code.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={3}>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle className="flex items-center gap-2">
                Device fingerprint <Badge variant="warning">Review</Badge>
              </TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Device not previously seen. Browser fingerprint associated with
              2 other accounts in the past 90 days.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={4} last>
            <TimelineIndicator />
            <TimelineHeader>
              <TimelineTitle className="flex items-center gap-2">
                3DS authentication <Badge variant="destructive">Failed</Badge>
              </TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              Cardholder failed 3D Secure challenge. Transaction routed to manual review.
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      {/* -------------------------------- */}
      {/* Dot indicators */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Dot indicators</h2>
        <Timeline className="max-w-lg">
          <TimelineItem step={1}>
            <TimelineDate>2 min ago</TimelineDate>
            <TimelineIndicator variant="dot" />
            <TimelineHeader><TimelineTitle>Rule threshold updated</TimelineTitle></TimelineHeader>
            <TimelineContent>
              Auto-decline threshold changed from 85 to 80 by admin@wyllo.com.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={2}>
            <TimelineDate>14 min ago</TimelineDate>
            <TimelineIndicator variant="dot" />
            <TimelineHeader><TimelineTitle>Batch review completed</TimelineTitle></TimelineHeader>
            <TimelineContent>
              42 orders reviewed, 38 approved, 4 declined.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={3}>
            <TimelineDate>1 hr ago</TimelineDate>
            <TimelineIndicator variant="dot" />
            <TimelineHeader><TimelineTitle>Webhook delivery failed</TimelineTitle></TimelineHeader>
            <TimelineContent>
              POST to merchant endpoint returned 503. Retry scheduled.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={4}>
            <TimelineDate>3 hr ago</TimelineDate>
            <TimelineIndicator variant="dot" />
            <TimelineHeader><TimelineTitle>Model retrained</TimelineTitle></TimelineHeader>
            <TimelineContent>
              Ensemble model v4.2 deployed. AUC improved from 0.94 to 0.96.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem step={5} last>
            <TimelineDate>5 hr ago</TimelineDate>
            <TimelineIndicator variant="dot" />
            <TimelineHeader><TimelineTitle>New merchant onboarded</TimelineTitle></TimelineHeader>
            <TimelineContent>
              Acme Electronics activated on the Starter plan.
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      {/* -------------------------------- */}
      {/* Horizontal */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Horizontal</h2>
        <Timeline orientation="horizontal">
          <TimelineItem step={1}>
            <TimelineIndicator>
              <span className="text-xs font-[620]">1</span>
            </TimelineIndicator>
            <TimelineTitle>Received</TimelineTitle>
            <TimelineContent>Dispute filed by issuer</TimelineContent>
          </TimelineItem>
          <TimelineItem step={2}>
            <TimelineIndicator>
              <span className="text-xs font-[620]">2</span>
            </TimelineIndicator>
            <TimelineTitle>Evidence</TimelineTitle>
            <TimelineContent>Gather compelling evidence</TimelineContent>
          </TimelineItem>
          <TimelineItem step={3}>
            <TimelineIndicator>
              <span className="text-xs font-[620]">3</span>
            </TimelineIndicator>
            <TimelineTitle>Submitted</TimelineTitle>
            <TimelineContent>Response sent to acquirer</TimelineContent>
          </TimelineItem>
          <TimelineItem step={4}>
            <TimelineIndicator>
              <span className="text-xs font-[620]">4</span>
            </TimelineIndicator>
            <TimelineTitle>Review</TimelineTitle>
            <TimelineContent>Issuer reviews evidence</TimelineContent>
          </TimelineItem>
          <TimelineItem step={5} last>
            <TimelineIndicator>
              <span className="text-xs font-[620]">5</span>
            </TimelineIndicator>
            <TimelineTitle>Resolved</TimelineTitle>
            <TimelineContent>Final decision rendered</TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      {/* -------------------------------- */}
      {/* API Reference */}
      {/* -------------------------------- */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Timeline" rows={TIMELINE_ROWS} />
        <PropTable title="TimelineItem" rows={TIMELINE_ITEM_ROWS} />
        <PropTable title="TimelineIndicator" rows={TIMELINE_INDICATOR_ROWS} />
      </section>
    </div>
  )
}
