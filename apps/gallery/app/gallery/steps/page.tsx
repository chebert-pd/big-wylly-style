"use client"

import {
  Card,
  CardContent,
  Steps,
  Step,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const STEPS_ROWS: PropRow[] = [
  { prop: "children", type: "ReactNode", required: true, description: "Step elements." },
  { prop: "className", type: "string", description: "Additional CSS classes on the <ol> container." },
]

const STEP_ROWS: PropRow[] = [
  { prop: "status", type: '"complete" | "current" | "upcoming"', required: true, description: "Controls the visual treatment of the indicator dot and connector line." },
  { prop: "number", type: "number", description: "Step number displayed in the dot when not complete." },
  { prop: "last", type: "boolean", default: "false", description: "Hides the connector line below this step." },
  { prop: "className", type: "string", description: "Additional CSS classes on the <li> element." },
  { prop: "children", type: "ReactNode", description: "Step content rendered to the right of the indicator." },
]

export default function StepsPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="h1">Steps</h1>
        <p className="p text-muted-foreground">
          Vertical progress indicator with numbered dots, check marks, and a
          continuous connector line.
        </p>
      </div>

      {/* -------------------------------- */}
      {/* All complete */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">All complete</h2>
        <Card level={1}>
          <CardContent>
            <Steps>
              <Step status="complete" number={1}>
                <Card level={2}>
                  <CardContent>
                    <span className="label-sm">Account created</span>
                    <p className="p-sm text-muted-foreground">Your account has been set up.</p>
                  </CardContent>
                </Card>
              </Step>
              <Step status="complete" number={2}>
                <Card level={2}>
                  <CardContent>
                    <span className="label-sm">Profile configured</span>
                    <p className="p-sm text-muted-foreground">Name, email, and preferences saved.</p>
                  </CardContent>
                </Card>
              </Step>
              <Step status="complete" number={3} last>
                <Card level={2}>
                  <CardContent>
                    <span className="label-sm">Workspace ready</span>
                    <p className="p-sm text-muted-foreground">Your workspace is live.</p>
                  </CardContent>
                </Card>
              </Step>
            </Steps>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* In progress */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">In progress — level 1 cards</h2>
        <Steps>
          <Step status="complete" number={1}>
            <Card level={1}>
              <CardContent>
                <span className="label-sm">Choose a plan</span>
                <p className="p-sm text-muted-foreground">Starter plan selected.</p>
              </CardContent>
            </Card>
          </Step>
          <Step status="current" number={2}>
            <Card level={1}>
              <CardContent>
                <span className="label-sm">Payment details</span>
                <p className="p-sm text-muted-foreground">Enter your billing information.</p>
              </CardContent>
            </Card>
          </Step>
          <Step status="upcoming" number={3}>
            <Card level={1}>
              <CardContent>
                <span className="label-sm">Confirm and activate</span>
                <p className="p-sm text-muted-foreground">Review your order and go live.</p>
              </CardContent>
            </Card>
          </Step>
          <Step status="upcoming" number={4} last>
            <Card level={1}>
              <CardContent>
                <span className="label-sm">Invite your team</span>
                <p className="p-sm text-muted-foreground">Add collaborators to your workspace.</p>
              </CardContent>
            </Card>
          </Step>
        </Steps>
      </section>

      {/* -------------------------------- */}
      {/* All upcoming */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">All upcoming</h2>
        <Card level={1}>
          <CardContent>
            <Steps>
              <Step status="current" number={1}>
                <Card level={2}>
                  <CardContent>
                    <span className="label-sm">Connect data source</span>
                    <p className="p-sm text-muted-foreground">Link your database or API.</p>
                  </CardContent>
                </Card>
              </Step>
              <Step status="upcoming" number={2}>
                <Card level={2}>
                  <CardContent>
                    <span className="label-sm">Configure schema</span>
                    <p className="p-sm text-muted-foreground">Map fields and set types.</p>
                  </CardContent>
                </Card>
              </Step>
              <Step status="upcoming" number={3} last>
                <Card level={2}>
                  <CardContent>
                    <span className="label-sm">Run first sync</span>
                    <p className="p-sm text-muted-foreground">Pull initial data into your workspace.</p>
                  </CardContent>
                </Card>
              </Step>
            </Steps>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* Minimal (no cards) */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Minimal — no card wrappers</h2>
        <Steps>
          <Step status="complete" number={1}>
            <div>
              <h2 className="h2">Order placed</h2>
              <p className="p-sm text-muted-foreground">Apr 12, 2026</p>
            </div>
          </Step>
          <Step status="complete" number={2}>
            <div>
              <h2 className="h2">Payment confirmed</h2>
              <p className="p-sm text-muted-foreground">Apr 12, 2026</p>
            </div>
          </Step>
          <Step status="current" number={3}>
            <div>
              <h2 className="h2">Shipped</h2>
              <p className="p-sm text-muted-foreground">In transit — estimated Apr 18</p>
            </div>
          </Step>
          <Step status="upcoming" number={4} last>
            <div>
              <h2 className="h2">Delivered</h2>
              <p className="p-sm text-muted-foreground">Pending</p>
            </div>
          </Step>
        </Steps>
      </section>

      {/* -------------------------------- */}
      {/* API Reference */}
      {/* -------------------------------- */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Steps" rows={STEPS_ROWS} />
        <PropTable title="Step" rows={STEP_ROWS} />
      </section>
    </div>
  )
}
