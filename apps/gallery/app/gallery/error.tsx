"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button, ErrorState, CodeSnippet } from "@wyllo/ui"

export default function GalleryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <ErrorState
        title="Something went wrong"
        description="This page hit an error while rendering. This usually means a component referenced something that doesn't exist."
        icon={AlertTriangle}
        errorDetail={
          <CodeSnippet title="Error">{error.message}</CodeSnippet>
        }
      >
        <Button variant="link" size="sm" asChild>
          <a href="#" onClick={(e) => { e.preventDefault(); window.history.back() }}>
            Go back
          </a>
        </Button>
        <Button variant="primary" size="sm" onClick={reset}>
          Try again
        </Button>
      </ErrorState>
    </div>
  )
}
