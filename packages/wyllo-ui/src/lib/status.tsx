"use client"

import { Badge } from "../components/badge"

type StatusVariant =
  | "success"
  | "warning"
  | "destructive"
  | "default"
  | "outline"

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
      return "default"

    case "failed":
    case "blocked":
    case "declined":
      return "destructive"

    default:
      return "outline"
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