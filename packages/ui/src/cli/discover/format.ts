import type { ConfidenceBand, DiscoverCandidate, DiscoverResult } from "./types.js"

const BANDS: ConfidenceBand[] = ["high", "medium", "low"]
const BAND_TITLE: Record<ConfidenceBand, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
}

/** Recommended action per band — written so a maintainer can act without
 *  re-reading the spec. Mirrored across both md and json output. */
const BAND_SUGGESTION: Record<ConfidenceBand, string> = {
  high: "migrate",
  medium: "verify",
  low: "review or suppress",
}

export function formatMarkdown(result: DiscoverResult): string {
  const lines: string[] = []
  const date = result.scannedAt.slice(0, 10)
  lines.push(`# Shadow Candidates — ${shortScopeLabel(result.scope.root)} (${date})`)
  lines.push("")
  if (result.summary.totalCandidates === 0) {
    lines.push("_No shadow candidates found above the configured threshold._")
    lines.push("")
    lines.push(`Scanned ${result.summary.filesScanned} file(s); found ${result.summary.componentsFound} candidate component(s); threshold ${result.config.threshold}.`)
    return lines.join("\n") + "\n"
  }

  const grouped = new Map<ConfidenceBand, DiscoverCandidate[]>()
  for (const band of BANDS) grouped.set(band, [])
  for (const c of result.candidates) {
    grouped.get(c.band)!.push(c)
  }

  for (const band of BANDS) {
    const bucket = grouped.get(band)!
    if (bucket.length === 0) continue
    lines.push(`## ${BAND_TITLE[band]} (${bucket.length})`)
    lines.push("")
    for (const c of bucket) {
      // Lead with the local component name — it's what readers triage on —
      // and keep the file path as a parenthetical so the click-through is
      // still right there.
      lines.push(`- \`${c.localName}\` (${c.file})`)
      lines.push(`  Suspected shadow of: \`${c.dsName}\``)
      const overlap = c.overlappingProps.length > 0
        ? c.overlappingProps.join(", ")
        : "(none)"
      const nameNote = c.nameOverlap ? "yes" : "no"
      lines.push(`  Confidence: ${c.confidence.toFixed(2)}  (prop overlap: ${overlap}; name overlap: ${nameNote})`)
      const importers = formatImporters(c)
      lines.push(`  Imported by: ${importers}`)
      lines.push(`  Suggested action: ${BAND_SUGGESTION[band]}`)
      lines.push("")
    }
  }

  // DS-coverage summary — which DS components are getting shadowed most.
  const byDs = Object.entries(result.summary.byDsComponent).sort((a, b) => b[1] - a[1])
  if (byDs.length > 0) {
    lines.push(`## DS components getting shadowed`)
    lines.push("")
    for (const [name, count] of byDs) {
      lines.push(`- \`${name}\` — ${count} candidate${count === 1 ? "" : "s"}`)
    }
    lines.push("")
  }

  lines.push(`---`)
  lines.push(`_Scanned ${result.summary.filesScanned} file(s); found ${result.summary.componentsFound} candidate component(s); threshold ${result.config.threshold}. Tool: ${result.tool.name}@${result.tool.version}._`)
  return lines.join("\n") + "\n"
}

function formatImporters(c: DiscoverCandidate): string {
  if (c.importCount === 0) return "(no importers found)"
  const head = c.importedBy.slice(0, 5).map((p) => `\`${p}\``).join(", ")
  if (c.importCount <= 5) return `${c.importCount} file(s): ${head}`
  return `${c.importCount} file(s): ${head}, …`
}

function shortScopeLabel(absPath: string): string {
  // Strip trailing slash and show the last two path components — enough to
  // identify which repo/subpath was scanned without leaking the user's
  // absolute home directory into the report header.
  const cleaned = absPath.replace(/\/$/, "")
  const parts = cleaned.split("/").filter(Boolean)
  if (parts.length <= 2) return cleaned
  return parts.slice(-2).join("/")
}

export function formatJson(result: DiscoverResult): string {
  return JSON.stringify(result, null, 2) + "\n"
}
