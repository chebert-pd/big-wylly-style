"use client"

/**
 * Last-resort error boundary. Catches errors in the root layout itself.
 * Must render its own <html> and <body> because the root layout may have
 * failed. Cannot use @chebert-pd/ui or design system tokens here — they may
 * be part of the error.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#fafafa",
          color: "#1a1a1a",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 480 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#fee2e2",
              color: "#dc2626",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              fontSize: 24,
            }}
          >
            !
          </div>

          <h1 style={{ fontSize: 20, fontWeight: 620, marginBottom: 8 }}>
            Application Error
          </h1>
          <p style={{ fontSize: 14, color: "#737373", marginBottom: 24 }}>
            The application encountered a fatal error and couldn't recover.
          </p>

          <button
            onClick={reset}
            style={{
              fontSize: 13,
              fontWeight: 520,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #e5e5e5",
              background: "white",
              cursor: "pointer",
              color: "#1a1a1a",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
