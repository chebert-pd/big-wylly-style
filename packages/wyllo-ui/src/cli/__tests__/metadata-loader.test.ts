import { test } from "node:test"
import { strict as assert } from "node:assert"
import { mkdtempSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { readRule } from "../metadata-loader.js"

/** Write a fixture .metadata.json to a temp dir and return its absolute path.
 *  Each test gets its own tmpdir so they don't collide on parallel runs. */
function fixture(name: string, body: string): string {
  const dir = mkdtempSync(join(tmpdir(), "metadata-loader-test-"))
  const path = join(dir, name)
  writeFileSync(path, body, "utf-8")
  return path
}

function cleanup(path: string): void {
  try {
    rmSync(path.replace(/\/[^/]+$/, ""), { recursive: true, force: true })
  } catch {}
}

test("readRule parses a well-formed metadata.json", () => {
  const path = fixture("button.metadata.json", JSON.stringify({
    component: { name: "Button" },
    variants: {
      visual: { forbidden: ["secondary"] },
      size: { options: ["xs", "sm", "md"] },
    },
  }))
  try {
    const result = readRule(path)
    assert.ok(result.rule)
    assert.equal(result.rule!.name, "Button")
    assert.deepEqual(result.rule!.rule.forbiddenVariants, ["secondary"])
    assert.deepEqual(result.rule!.rule.allowedSizes, ["xs", "sm", "md"])
    assert.equal(result.errors.length, 0)
  } finally {
    cleanup(path)
  }
})

test("readRule errors on invalid JSON", () => {
  const path = fixture("broken.metadata.json", "{ not valid json")
  try {
    const result = readRule(path)
    assert.equal(result.rule, null)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].severity, "error")
    assert.equal(result.errors[0].field, "(json)")
    assert.match(result.errors[0].message, /Invalid JSON/)
  } finally {
    cleanup(path)
  }
})

test("readRule errors when component.name is missing", () => {
  const path = fixture("nameless.metadata.json", JSON.stringify({
    component: { category: "atoms" },
    variants: { visual: { forbidden: ["bad"] } },
  }))
  try {
    const result = readRule(path)
    assert.equal(result.rule, null)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].severity, "error")
    assert.equal(result.errors[0].field, "component.name")
  } finally {
    cleanup(path)
  }
})

test("readRule errors when component block is missing entirely", () => {
  const path = fixture("no-component.metadata.json", JSON.stringify({
    variants: { visual: { forbidden: ["x"] } },
  }))
  try {
    const result = readRule(path)
    assert.equal(result.rule, null)
    assert.equal(result.errors[0].field, "component")
    assert.equal(result.errors[0].severity, "error")
  } finally {
    cleanup(path)
  }
})

test("readRule errors on non-object root (array)", () => {
  const path = fixture("array-root.metadata.json", "[1, 2, 3]")
  try {
    const result = readRule(path)
    assert.equal(result.rule, null)
    assert.equal(result.errors[0].field, "(root)")
    assert.equal(result.errors[0].severity, "error")
  } finally {
    cleanup(path)
  }
})

test("readRule warns when variants.visual.forbidden is the wrong type", () => {
  // Typo: the value should be string[], not a string. The auditor used to silently
  // ignore this and skip forbidden-variant enforcement for the component.
  const path = fixture("typo.metadata.json", JSON.stringify({
    component: { name: "Button" },
    variants: {
      visual: { forbidden: "secondary" }, // <-- should be ["secondary"]
    },
  }))
  try {
    const result = readRule(path)
    // The rule still loads — just without forbidden-variant data.
    assert.ok(result.rule)
    assert.equal(result.rule!.name, "Button")
    assert.deepEqual(result.rule!.rule.forbiddenVariants, [])
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].severity, "warning")
    assert.equal(result.errors[0].field, "variants.visual.forbidden")
  } finally {
    cleanup(path)
  }
})

test("readRule warns when variants.size.options is the wrong type", () => {
  const path = fixture("size-typo.metadata.json", JSON.stringify({
    component: { name: "Switch" },
    variants: {
      size: { options: { xs: true, sm: true } }, // <-- should be array
    },
  }))
  try {
    const result = readRule(path)
    assert.ok(result.rule)
    assert.equal(result.rule!.rule.allowedSizes, null)
    assert.equal(result.errors[0].field, "variants.size.options")
    assert.equal(result.errors[0].severity, "warning")
  } finally {
    cleanup(path)
  }
})

test("readRule warns when variants.visual is not an object", () => {
  const path = fixture("visual-string.metadata.json", JSON.stringify({
    component: { name: "Bad" },
    variants: { visual: "primary" }, // <-- should be an object
  }))
  try {
    const result = readRule(path)
    assert.ok(result.rule)
    assert.equal(result.errors[0].field, "variants.visual")
  } finally {
    cleanup(path)
  }
})

test("readRule loads a minimal valid metadata (component.name only)", () => {
  const path = fixture("minimal.metadata.json", JSON.stringify({
    component: { name: "Spinner" },
  }))
  try {
    const result = readRule(path)
    assert.ok(result.rule)
    assert.equal(result.rule!.name, "Spinner")
    assert.deepEqual(result.rule!.rule.forbiddenVariants, [])
    assert.equal(result.rule!.rule.allowedSizes, null)
    assert.equal(result.errors.length, 0)
  } finally {
    cleanup(path)
  }
})

test("readRule tolerates extra unknown fields", () => {
  // Files may include fields the auditor doesn't use yet (aiHints, antiPatterns, …).
  // Those must not produce false-positive warnings.
  const path = fixture("rich.metadata.json", JSON.stringify({
    component: { name: "Card" },
    usage: { antiPatterns: [{ scenario: "x" }] },
    aiHints: { context: "y" },
    composition: { slots: ["header", "content"] },
  }))
  try {
    const result = readRule(path)
    assert.ok(result.rule)
    assert.equal(result.errors.length, 0)
  } finally {
    cleanup(path)
  }
})
