export type Severity = "error" | "warning"
export type Mode = "ds" | "consumer"
export type AppliesTo = readonly Mode[] | readonly ["both"]

export interface RuleMeta {
  appliesTo: AppliesTo
  severity: Severity
}

export interface Violation {
  rule: string
  severity: Severity
  file: string
  line: number
  endLine: number
  column: number | null
  message: string
  snippet?: string
  fix?: string
}

export interface SuppressedViolation extends Violation {
  reason: string
}

export interface AuditSummary {
  totalViolations: number
  totalSuppressed: number
  byRule: Record<string, number>
  byFile: Record<string, number>
  bySeverity: Record<Severity, number>
}

export interface AuditResult {
  schemaVersion: "1.0"
  tool: { name: string; version: string }
  scope: { root: string; filesScanned: number }
  summary: AuditSummary
  violations: Violation[]
  suppressed: SuppressedViolation[]
}

export interface AuditOptions {
  scope: string
  rulesPath?: string
  include: string[]
  exclude: string[]
  all: boolean
  changedOnly: boolean
  baseRef?: string
  format: "text" | "json" | "github"
  mode: Mode
}
