"use client"

import { Badge } from "../components/badge"

type StatusVariant =
  | "success"
  | "warning"
  | "info"
  | "destructive"
  | "secondary"

export function getStatusVariant(status: string): StatusVariant {
  switch (status.toLowerCase()) {
    case "approved":
    case "passed":
    case "success":
      return "success"

    case "pending":
    case "in review":
      return "warning"

    case "info":
      return "info"

    case "failed":
    case "blocked":
    case "declined":
      return "destructive"

    default:
      return "secondary"
  }
}

export function StatusBadge({ status }: { status: string }) {
  const formatted = status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <Badge
      variant={getStatusVariant(status)}
      className="rounded-[var(--radius)]"
    >
      {formatted}
    </Badge>
  )
}