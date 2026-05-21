import type { ConfidenceBand, DsComponentProps, LocalComponent } from "./types.js"

/** Props that show up on almost every component because they come from
 *  React's HTML attribute base types. These add no shadow-detection signal —
 *  the propFrequency map already down-weights them, but we floor the
 *  weighting at a small constant so they barely matter. */
const NEAR_UNIVERSAL_FLOOR_WEIGHT = 0.1

/** Confidence thresholds for the three bands. Tuned conservatively: the
 *  default `--threshold 0.5` includes all three; a stricter `--threshold 0.75`
 *  shows only high-confidence hits. Bands themselves are independent of the
 *  threshold — the threshold filters; the band labels. */
const BAND_HIGH = 0.75
const BAND_MEDIUM = 0.6

/** Bonus added to similarity when the local component's PascalCase name
 *  contains a DS export name as a substring at a PascalCase boundary
 *  (so `HeaderPage` matches `Header` but `OtherWordHeader` does not contain
 *  `Header` as a separable token after `Other`). 0.15 is enough to bump a
 *  borderline medium into high without being able to single-handedly create
 *  a high-confidence hit. */
const NAME_OVERLAP_BONUS = 0.15

export interface ScoreInputs {
  local: LocalComponent
  dsCatalog: DsComponentProps[]
  /** propName → number of DS components declaring that prop. */
  propFrequency: Map<string, number>
  /** Minimum similarity (after bonus) for the match to be reported. */
  threshold: number
}

export interface Match {
  dsName: string
  /** Similarity in [0,1] after name-overlap bonus and capping. */
  confidence: number
  overlappingProps: string[]
  nameOverlap: boolean
}

/** Compute a similarity score between a local component and a single DS
 *  component. We blend two metrics in equal parts:
 *
 *    1. Weighted Jaccard      — intersection / union
 *    2. Weighted containment  — intersection / local
 *
 *  Jaccard alone penalizes subset matches: if the local declares 3 of the DS
 *  component's 5 props exactly, Jaccard caps at 0.6 even though the local
 *  fully implements the DS's core API. Containment alone false-positives on
 *  small locals: a 1-prop local that happens to share that prop with a DS
 *  component scores 1.0. The average of the two captures the common-case
 *  shadow shape (local is a subset of the DS's API surface) without
 *  rewarding accidental single-prop overlaps.
 *
 *  Weights are 1/dsComponentCountForProp, floored at
 *  NEAR_UNIVERSAL_FLOOR_WEIGHT — universal props (className, children, …)
 *  contribute a tenth as much as a distinctive one. */
function similarityScore(
  local: Set<string>,
  ds: Set<string>,
  propFrequency: Map<string, number>,
  dsCatalogSize: number,
): { score: number; overlap: string[] } {
  if (local.size === 0 || ds.size === 0) {
    return { score: 0, overlap: [] }
  }

  const propWeight = (name: string): number => {
    const freq = propFrequency.get(name) ?? 1
    const rawWeight = dsCatalogSize > 0 ? 1 / freq : 1
    return Math.max(rawWeight, NEAR_UNIVERSAL_FLOOR_WEIGHT)
  }

  let intersectionWeight = 0
  let unionWeight = 0
  let localWeight = 0
  const overlap: string[] = []

  const union = new Set<string>([...local, ...ds])
  for (const name of union) {
    const w = propWeight(name)
    unionWeight += w
    if (local.has(name) && ds.has(name)) {
      intersectionWeight += w
      overlap.push(name)
    }
    if (local.has(name)) localWeight += w
  }

  if (unionWeight === 0 || localWeight === 0) {
    return { score: 0, overlap: [] }
  }
  const jaccard = intersectionWeight / unionWeight
  const containment = intersectionWeight / localWeight
  return {
    score: (jaccard + containment) / 2,
    overlap: overlap.sort(),
  }
}

/** Returns true if `local` contains `dsName` as a PascalCase substring.
 *  `HeaderPage` contains `Header` (prefix). `PageHeader` contains `Header`
 *  (suffix at a PascalCase boundary). `MetricStripCustomer` contains
 *  `MetricStrip` (prefix). `Headerless` does NOT, because `less` doesn't
 *  start at a PascalCase boundary. Reasoning: the boundary check stops
 *  `Cardinal` from registering a "Card" overlap. */
export function hasNameOverlap(local: string, dsName: string): boolean {
  if (local === dsName) return true
  const idx = local.indexOf(dsName)
  if (idx < 0) return false
  const after = local.charAt(idx + dsName.length)
  // Either at end-of-string, or followed by an uppercase letter (PascalCase
  // boundary). Followed by a lowercase letter means the DS name is just a
  // prefix of a longer word ("Card" inside "Cardinal").
  if (after === "") return true
  return after >= "A" && after <= "Z"
}

export function classifyBand(confidence: number): ConfidenceBand {
  if (confidence >= BAND_HIGH) return "high"
  if (confidence >= BAND_MEDIUM) return "medium"
  return "low"
}

/** Score a single local component against the entire DS catalog and return
 *  its best match (above the threshold), or null if nothing clears it. */
export function bestMatch(inputs: ScoreInputs): Match | null {
  const { local, dsCatalog, propFrequency, threshold } = inputs
  if (dsCatalog.length === 0) return null

  let best: Match | null = null
  for (const ds of dsCatalog) {
    const { score, overlap } = similarityScore(local.props, ds.props, propFrequency, dsCatalog.length)
    const nameOverlap = hasNameOverlap(local.name, ds.name)
    // Cap at 1.0 so a score of 0.9 + 0.15 bonus doesn't blow past the band
    // ceiling and break the band classifier's monotonicity.
    const confidence = Math.min(score + (nameOverlap ? NAME_OVERLAP_BONUS : 0), 1)
    if (confidence < threshold) continue
    if (best === null || confidence > best.confidence) {
      best = { dsName: ds.name, confidence, overlappingProps: overlap, nameOverlap }
    }
  }
  return best
}
