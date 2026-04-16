"use client"

import { FileQuestion } from "lucide-react"
import { Button, ErrorState } from "@wyllo/ui"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground">
      <ErrorState
        title="404"
        description="This page doesn't exist. It may have been moved or the URL is wrong."
        icon={FileQuestion}
        tone="neutral"
      >
        <Button variant="link" size="sm" asChild>
          <a href="/gallery">Back to gallery</a>
        </Button>
      </ErrorState>
    </div>
  )
}
