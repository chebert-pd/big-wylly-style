import { test } from "node:test"
import { strict as assert } from "node:assert"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { runDiscover } from "../discover/index.js"
import { formatMarkdown } from "../discover/format.js"
import { hasNameOverlap, classifyBand } from "../discover/score.js"
import { __resetDsCatalogCacheForTests } from "../discover/ds-catalog.js"

const here = dirname(fileURLToPath(import.meta.url))
const fixtureRoot = resolve(here, "__fixtures__/discover-consumer")

async function run(overrides: { threshold?: number } = {}) {
  // The DS catalog is cached across calls; reset for tests so each one starts
  // fresh and changes to the DS source between sessions don't leak across.
  __resetDsCatalogCacheForTests()
  return runDiscover(
    {
      scope: fixtureRoot,
      format: "md",
      threshold: overrides.threshold ?? 0.5,
      include: [],
      exclude: [],
    },
    "test",
  )
}

test("discover: HeaderPage shadow matches DS Header", async () => {
  const result = await run()
  const candidate = result.candidates.find((c) => c.localName === "HeaderPage")
  assert.ok(candidate, "expected a candidate for HeaderPage")
  assert.equal(candidate!.dsName, "Header")
  // Six overlapping distinctive props + name-overlap bonus should put this
  // in either high or medium band — don't pin to an exact number so the
  // assertion stays robust if DS Header's prop set shifts in future releases.
  assert.ok(
    candidate!.confidence >= 0.6,
    `expected HeaderPage confidence >= 0.6 against DS Header, got ${candidate!.confidence}`,
  )
  assert.ok(candidate!.nameOverlap, "expected HeaderPage to register name overlap with Header")
  for (const expected of ["title", "back", "actions", "badge", "metadata", "subsection"]) {
    assert.ok(
      candidate!.overlappingProps.includes(expected),
      `expected overlappingProps to include ${expected}`,
    )
  }
})

test("discover: LifetimeMetrics shadow matches DS MetricPanel by prop signature alone", async () => {
  const result = await run()
  const candidate = result.candidates.find((c) => c.localName === "LifetimeMetrics")
  assert.ok(candidate, "expected a candidate for LifetimeMetrics")
  assert.equal(candidate!.dsName, "MetricPanel")
  // No PascalCase substring "MetricPanel" inside "LifetimeMetrics" — the
  // match must come entirely from prop overlap.
  assert.equal(candidate!.nameOverlap, false)
  for (const expected of ["title", "subtitle", "items"]) {
    assert.ok(
      candidate!.overlappingProps.includes(expected),
      `expected overlappingProps to include ${expected}`,
    )
  }
})

test("discover: CustomerHeadlineStats produces no candidate (no DS prop overlap)", async () => {
  const result = await run()
  const candidate = result.candidates.find((c) => c.localName === "CustomerHeadlineStats")
  assert.equal(candidate, undefined, "CustomerHeadlineStats should not appear in candidates")
})

test("discover: OrdersTable falls under the default 0.5 threshold", async () => {
  const result = await run()
  const candidate = result.candidates.find((c) => c.localName === "OrdersTable")
  assert.equal(candidate, undefined, "OrdersTable should be filtered out by the default threshold")
})

test("discover: importedBy graph counts importers below the min-line threshold", async () => {
  const result = await run()
  const headerPage = result.candidates.find((c) => c.localName === "HeaderPage")
  assert.ok(headerPage)
  // pages/customer-detail-page.tsx imports HeaderPage. It's a short file (well
  // under MIN_LINES_TO_SCAN) but the import graph still picks it up.
  assert.ok(
    headerPage!.importedBy.some((p) => p.includes("customer-detail-page")),
    `expected importedBy to include customer-detail-page; got ${JSON.stringify(headerPage!.importedBy)}`,
  )
  assert.ok(headerPage!.importCount >= 1)
})

test("discover JSON contract: required fields and shape are stable", async () => {
  const result = await run()
  // Top-level contract — these are the fields downstream Slack tooling reads.
  assert.equal(result.schemaVersion, "1.0")
  assert.equal(typeof result.scannedAt, "string")
  assert.match(result.scannedAt, /^\d{4}-\d{2}-\d{2}T/)
  assert.equal(typeof result.tool.name, "string")
  assert.equal(typeof result.tool.version, "string")
  assert.equal(typeof result.scope.root, "string")
  // Summary block
  assert.equal(typeof result.summary.totalCandidates, "number")
  assert.equal(result.summary.totalCandidates, result.candidates.length)
  assert.ok(["high", "medium", "low"].every((b) => typeof result.summary.byBand[b as "high"] === "number"))
  // Candidates
  for (const c of result.candidates) {
    assert.equal(typeof c.file, "string")
    assert.equal(typeof c.localName, "string")
    assert.equal(typeof c.dsName, "string")
    assert.equal(typeof c.confidence, "number")
    assert.ok(["high", "medium", "low"].includes(c.band))
    assert.ok(Array.isArray(c.overlappingProps))
    assert.equal(typeof c.nameOverlap, "boolean")
    assert.ok(Array.isArray(c.importedBy))
    assert.equal(c.importCount, c.importedBy.length)
  }
})

test("discover markdown: rendered report contains the high-confidence section and a DS-coverage tail", async () => {
  const result = await run()
  const md = formatMarkdown(result)
  // Header with date and scope label
  assert.match(md, /^# Shadow Candidates —/)
  // HeaderPage candidate is reported with its DS match
  assert.match(md, /HeaderPage/)
  assert.match(md, /Suspected shadow of: `Header`/)
  // DS-coverage tail summarizing which DS components are getting shadowed
  assert.match(md, /## DS components getting shadowed/)
})

test("classifyBand maps confidence to the documented thresholds", () => {
  assert.equal(classifyBand(0.9), "high")
  assert.equal(classifyBand(0.75), "high")
  assert.equal(classifyBand(0.74), "medium")
  assert.equal(classifyBand(0.6), "medium")
  assert.equal(classifyBand(0.59), "low")
  assert.equal(classifyBand(0), "low")
})

test("hasNameOverlap requires a PascalCase boundary", () => {
  // Exact match
  assert.equal(hasNameOverlap("Header", "Header"), true)
  // Prefix at end-of-name (HeaderPage → starts with Header)
  assert.equal(hasNameOverlap("HeaderPage", "Header"), true)
  // Suffix (PageHeader → ends with Header)
  assert.equal(hasNameOverlap("PageHeader", "Header"), true)
  // Inside word — would only match if followed by uppercase (PascalCase boundary)
  assert.equal(hasNameOverlap("HeaderlessFoo", "Header"), false, "Headerless should not match Header (no uppercase boundary)")
  // Substring at PascalCase boundary
  assert.equal(hasNameOverlap("OrdersTableBar", "Table"), true)
  // No match
  assert.equal(hasNameOverlap("CustomerCard", "Header"), false)
})

test("discover threshold filtering: 0.0 admits more candidates than 0.5", async () => {
  const at05 = await run({ threshold: 0.5 })
  const at00 = await run({ threshold: 0 })
  assert.ok(
    at00.summary.totalCandidates >= at05.summary.totalCandidates,
    `lowering the threshold should admit at least as many candidates (got ${at00.summary.totalCandidates} vs ${at05.summary.totalCandidates})`,
  )
})
