"use client"

import React, { useState } from "react"
import { AlertTriangle, FileQuestion } from "lucide-react"
import { Button, ErrorState, CodeSnippet } from "@wyllo/ui"

// ---------------------------------------------------------------------------
// Intentionally broken component — throws on render to trigger error.tsx
// ---------------------------------------------------------------------------
function BrokenComponent(): React.ReactNode {
  throw new Error("HardHat is not defined (simulated component error)")
}

const SIMULATED_ERROR = `ReferenceError: HardHat is not defined
    at CustomersStats (customers-stats.tsx:171:13)
    at renderWithHooks (react-dom_client.js:5654:24)
    at updateFunctionComponent (react-dom_client.js:7475:21)
    at beginWork (react-dom_client.js:8525:20)`

export default function ErrorStatesPage() {
  const [showBroken, setShowBroken] = useState(false)

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="h1">Error States</h1>
        <p className="p text-muted-foreground max-w-2xl">
          Three error pages handle different failure modes. The gallery layout
          stays intact for route-level errors so users can navigate away.
        </p>
      </div>

      {/* -------------------------------- */}
      {/* Runtime Error (error.tsx) */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Runtime Error</h2>
          <p className="p-sm text-muted-foreground max-w-2xl">
            Caught by <code className="label-sm">app/gallery/error.tsx</code>.
            Handles component-level errors like undefined references, failed
            API calls, or bad data. The sidebar stays intact so you can
            navigate to another page.
          </p>
        </div>

        {/* Static preview */}
        <div className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-14">
          <ErrorState
            title="Something went wrong"
            description="This page hit an error while rendering. This usually means a component referenced something that doesn't exist."
            icon={AlertTriangle}
            errorDetail={
              <CodeSnippet title="Error">{SIMULATED_ERROR}</CodeSnippet>
            }
          >
            <Button variant="link" size="sm" disabled>
              Go back
            </Button>
            <Button variant="primary" size="sm" disabled>
              Try again
            </Button>
          </ErrorState>
        </div>

        {/* Live trigger */}
        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            size="xs"
            onClick={() => setShowBroken(true)}
          >
            Trigger a real error
          </Button>
          <span className="p-sm text-muted-foreground">
            This will crash this page and show the actual error.tsx boundary.
            Use the sidebar to navigate back.
          </span>
        </div>
        {showBroken && <BrokenComponent />}
      </section>

      {/* -------------------------------- */}
      {/* 404 (not-found.tsx) */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">404 — Not Found</h2>
          <p className="p-sm text-muted-foreground max-w-2xl">
            Caught by <code className="label-sm">app/not-found.tsx</code>.
            Shown when a route doesn't exist. Renders outside the gallery
            layout (full-page).
          </p>
        </div>

        <div className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-14">
          <ErrorState
            title="404"
            description="This page doesn't exist. It may have been moved or the URL is wrong."
            icon={FileQuestion}
            tone="neutral"
          >
            <Button variant="link" size="sm" disabled>
              Back to gallery
            </Button>
          </ErrorState>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="xs"
            onClick={() => window.open("/gallery/this-page-does-not-exist", "_blank")}
          >
            Open a 404 in a new tab
          </Button>
          <span className="p-sm text-muted-foreground">
            Opens a non-existent route so you can see the real not-found page.
          </span>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Global Error (global-error.tsx) */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Global Error</h2>
          <p className="p-sm text-muted-foreground max-w-2xl">
            Caught by <code className="label-sm">app/global-error.tsx</code>.
            Last-resort fallback when the root layout itself crashes. Renders
            its own <code className="label-sm">{"<html>"}</code> and{" "}
            <code className="label-sm">{"<body>"}</code> with zero dependencies
            — no design system tokens, no imports — because the root layout
            may be the thing that broke.
          </p>
        </div>

        {/* Static preview — approximates the inline-styled global-error */}
        <div className="rounded-xl border border-border bg-[#fafafa] dark:bg-[#1a1a1a]">
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-6 px-4 text-center">
            <div
              className="inline-flex size-14 items-center justify-center rounded-xl text-2xl font-[620]"
              style={{ background: "#fee2e2", color: "#dc2626" }}
            >
              !
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-[620]" style={{ color: "#1a1a1a" }}>
                Application Error
              </h3>
              <p className="text-sm" style={{ color: "#737373" }}>
                The application encountered a fatal error and couldn't recover.
              </p>
            </div>
            <button
              disabled
              className="cursor-not-allowed opacity-50"
              style={{
                fontSize: 13,
                fontWeight: 520,
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #e5e5e5",
                background: "white",
                color: "#1a1a1a",
              }}
            >
              Try again
            </button>
          </div>
        </div>

        <p className="p-sm text-muted-foreground max-w-2xl">
          This error cannot be triggered from inside the app without breaking
          the root layout. The preview above is a static recreation using
          hardcoded inline styles — intentionally no design system dependencies.
        </p>
      </section>
    </div>
  )
}
