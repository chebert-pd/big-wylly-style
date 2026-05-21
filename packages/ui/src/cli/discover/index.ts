import { resolve } from "node:path"
import { loadTypescript } from "./ts-program.js"
import { loadDsCatalog } from "./ds-catalog.js"
import { scanConsumer } from "./scan-consumer.js"
import { bestMatch, classifyBand } from "./score.js"
import { buildImportedByMap } from "./imported-by.js"
import type {
  ConfidenceBand,
  DiscoverCandidate,
  DiscoverOptions,
  DiscoverResult,
} from "./types.js"

export type { DiscoverOptions, DiscoverResult, DiscoverCandidate } from "./types.js"

/** Main entry — orchestrates the discover run end-to-end. Returns the
 *  DiscoverResult; callers print/format it via the format module. Pulled out
 *  of the CLI shell so tests can drive runDiscover directly without going
 *  through stdout. */
export async function runDiscover(
  options: DiscoverOptions,
  toolVersion: string,
): Promise<DiscoverResult> {
  const tsApi = await loadTypescript()
  const scopeRoot = resolve(options.scope)

  // Step 1: build (or pull from cache) the DS prop catalog. This is expensive
  // (one TS Program per call, but cached across calls in-process), so we do
  // it once up front before doing per-component scoring work.
  const catalog = loadDsCatalog(tsApi)

  // Step 2: walk the consumer scope and extract every exported React
  // component's prop set.
  const scan = scanConsumer(tsApi, scopeRoot, {
    include: options.include,
    exclude: options.exclude,
  })

  // Step 3: score every local component against the DS catalog. Keep only the
  // best match per component if it clears the threshold.
  interface InternalMatch {
    file: string
    localName: string
    dsName: string
    confidence: number
    band: ConfidenceBand
    overlappingProps: string[]
    nameOverlap: boolean
  }
  const matches: InternalMatch[] = []
  for (const local of scan.components) {
    const best = bestMatch({
      local,
      dsCatalog: catalog.components,
      propFrequency: catalog.propFrequency,
      threshold: options.threshold,
    })
    if (!best) continue
    matches.push({
      file: local.file,
      localName: local.name,
      dsName: best.dsName,
      confidence: best.confidence,
      band: classifyBand(best.confidence),
      overlappingProps: best.overlappingProps,
      nameOverlap: best.nameOverlap,
    })
  }

  // Step 4: build the reverse-import map — for each candidate file, which
  // consumer files import it. Powers the "Imported by: 4 files" line in the
  // markdown report. We use the broader allCandidateImporters set (no
  // min-line filter) so a short page file still counts as an importer.
  const candidateFiles = [...new Set(matches.map((m) => m.file))]
  const importedBy = buildImportedByMap({
    scopeRoot,
    candidateFiles,
    scannedFiles: scan.allCandidateImporters,
  })

  // Step 5: hydrate final candidates with the import counts. Sort by
  // descending confidence, then ascending file path for tie-break stability —
  // makes snapshot tests deterministic.
  const candidates: DiscoverCandidate[] = matches
    .map((m) => {
      const importers = importedBy.get(m.file) ?? []
      return {
        file: m.file,
        localName: m.localName,
        dsName: m.dsName,
        confidence: round2(m.confidence),
        band: m.band,
        overlappingProps: m.overlappingProps,
        nameOverlap: m.nameOverlap,
        importedBy: importers,
        importCount: importers.length,
      }
    })
    .sort((a, b) => {
      if (b.confidence !== a.confidence) return b.confidence - a.confidence
      return a.file.localeCompare(b.file)
    })

  const byBand: Record<ConfidenceBand, number> = { high: 0, medium: 0, low: 0 }
  const byDsComponent: Record<string, number> = {}
  for (const c of candidates) {
    byBand[c.band] += 1
    byDsComponent[c.dsName] = (byDsComponent[c.dsName] ?? 0) + 1
  }

  return {
    schemaVersion: "1.0",
    scannedAt: new Date().toISOString(),
    tool: { name: "audit-governance discover", version: toolVersion },
    scope: { root: scopeRoot },
    config: {
      threshold: options.threshold,
      include: options.include,
      exclude: options.exclude,
    },
    summary: {
      totalCandidates: candidates.length,
      byBand,
      byDsComponent: sortByValueDesc(byDsComponent),
      filesScanned: scan.scannedFiles.length,
      componentsFound: scan.components.length,
    },
    candidates,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function sortByValueDesc(m: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])))
}
