export type ConfidenceBand = "high" | "medium" | "low"

export interface DiscoverCandidate {
  /** Path to the consumer file relative to the scope root. */
  file: string
  /** PascalCase name of the local component as declared in the file. */
  localName: string
  /** Name of the DS component this local one is most similar to. */
  dsName: string
  /** Weighted-Jaccard similarity score in [0, 1] after the name-overlap bonus. */
  confidence: number
  /** Confidence bucket — derived from `confidence` against fixed thresholds. */
  band: ConfidenceBand
  /** Prop names that appear in both the local component and the DS component. */
  overlappingProps: string[]
  /** True if the local component's PascalCase name contains the DS name as a
   *  substring at a PascalCase boundary (e.g. HeaderPage contains "Header"). */
  nameOverlap: boolean
  /** Files (relative to scope root) that import this local component. */
  importedBy: string[]
  /** Convenience: importedBy.length. Top-level field so JSON consumers don't have
   *  to compute it. */
  importCount: number
}

export interface DiscoverSummary {
  totalCandidates: number
  /** Count per confidence band. Always includes all three keys, zero-filled. */
  byBand: Record<ConfidenceBand, number>
  /** Count per DS component that was matched (e.g. {"Header": 3, "MetricStrip": 1}).
   *  Useful for the "DS coverage report" use case — see which DS components keep
   *  getting shadowed in consumer repos. Sorted by descending count. */
  byDsComponent: Record<string, number>
  /** Files scanned in the consumer. Includes files that yielded no candidates. */
  filesScanned: number
  /** Files where we found at least one exported React component. */
  componentsFound: number
}

export interface DiscoverResult {
  /** Stable across releases. Bump on breaking changes to this contract. */
  schemaVersion: "1.0"
  /** ISO-8601 timestamp of when the discover run started. */
  scannedAt: string
  tool: { name: string; version: string }
  scope: { root: string }
  /** Configuration the run was executed with — captured here so downstream
   *  consumers can reproduce the report. */
  config: { threshold: number; include: string[]; exclude: string[] }
  summary: DiscoverSummary
  /** Candidates sorted by descending confidence, then by ascending file path. */
  candidates: DiscoverCandidate[]
}

export interface DiscoverOptions {
  scope: string
  /** Output format. Default: "md". */
  format: "md" | "json"
  /** Output destination. If undefined, write to stdout. */
  out?: string
  /** Minimum confidence to include in the report. Default: 0.5. */
  threshold: number
  /** Force-include globs (repeatable). */
  include: string[]
  /** Exclude globs (repeatable). Adds to the default exclusion list. */
  exclude: string[]
}

/** Single DS component's prop info, the unit consumed by the scorer. */
export interface DsComponentProps {
  name: string
  /** Set of prop names declared on this component's props type. */
  props: Set<string>
}

/** Single local (consumer) component's prop info. */
export interface LocalComponent {
  /** Path relative to scope root. */
  file: string
  /** PascalCase name as declared. */
  name: string
  /** Set of prop names declared on this component's props type. */
  props: Set<string>
}
