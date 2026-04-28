import { test } from "node:test"
import { strict as assert } from "node:assert"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { runAudit } from "../auditor.js"

const here = dirname(fileURLToPath(import.meta.url))
const consumerFixture = resolve(here, "__fixtures__/consumer-app")

test("integration: consumer-app fixture produces expected violations and suppressions", () => {
  const result = runAudit({
    scope: consumerFixture,
    include: [],
    exclude: [],
    all: false,
    changedOnly: false,
    format: "json",
    mode: "consumer",
  }, "test")

  assert.equal(result.scope.filesScanned, 1, "should scan the single fixture file")

  const activeRules = result.violations.map((v) => v.rule).sort()
  assert.deepEqual(activeRules, ["FG-001", "PL-003", "TY-001"], "expected one of each: FG-001, PL-003, TY-001")

  assert.equal(result.suppressed.length, 1, "one violation should be suppressed")
  assert.equal(result.suppressed[0].rule, "PL-003")
  assert.equal(result.suppressed[0].reason, "demonstrating suppression")
})

test("integration: --all=false skips files that don't import @chebert-pd/ui", () => {
  // The fixture imports @chebert-pd/ui, so it is included; this test just
  // confirms the result has the expected file (DS-importer detection works).
  const result = runAudit({
    scope: consumerFixture,
    include: [],
    exclude: [],
    all: false,
    changedOnly: false,
    format: "json",
    mode: "consumer",
  }, "test")
  assert.equal(result.scope.filesScanned, 1)
})
