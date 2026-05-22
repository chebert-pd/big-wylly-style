import { test } from "node:test"
import { strict as assert } from "node:assert"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { discoverFiles } from "../discover.js"

const BWS_IMPORT = `import { Button } from "@big-wylly-style/ui"\n`

function makeFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "audit-discover-files-"))

  mkdirSync(join(root, "src"), { recursive: true })
  writeFileSync(join(root, "src", "page.tsx"), BWS_IMPORT)

  // Simulate a deeply nested vendored DS in node_modules — mirrors the
  // real-world bug pattern that motivated issue #149.
  const vendoredDs = join(
    root, "node_modules", "@big-wylly-style", "ui",
    "src", "components", "alert-dialog",
  )
  mkdirSync(vendoredDs, { recursive: true })
  writeFileSync(join(vendoredDs, "alert-dialog.tsx"), BWS_IMPORT)

  // Generic third-party package — proves the exclusion is universal, not
  // BWS-specific. This file doesn't import BWS at all; it should still be
  // skipped because node_modules is structurally off-limits.
  const vendoredGeneric = join(root, "node_modules", "some-other-package")
  mkdirSync(vendoredGeneric, { recursive: true })
  writeFileSync(join(vendoredGeneric, "index.tsx"), "export const x = 1\n")

  // .git directory with a .tsx — paranoid: nobody should ever put a .tsx
  // here, but if they do, the auditor must skip it.
  const gitDir = join(root, ".git", "hooks")
  mkdirSync(gitDir, { recursive: true })
  writeFileSync(join(gitDir, "should-not-be-audited.tsx"), BWS_IMPORT)

  return root
}

test("discoverFiles excludes node_modules and .git under --all", () => {
  const root = makeFixture()
  const files = discoverFiles({
    scope: root,
    include: [],
    exclude: [],
    all: true,
    changedOnly: false,
  })

  assert.equal(
    files.length, 1,
    `expected 1 file, got ${files.length}: ${files.join(", ")}`,
  )
  assert.ok(
    files[0].endsWith("/src/page.tsx"),
    `expected src/page.tsx, got ${files[0]}`,
  )
  assert.ok(
    !files.some((f) => f.includes("node_modules")),
    "no file under node_modules should be audited",
  )
  assert.ok(
    !files.some((f) => f.includes("/.git/")),
    "no file under .git should be audited",
  )
})

test("discoverFiles excludes node_modules in default mode (no --all)", () => {
  const root = makeFixture()
  const files = discoverFiles({
    scope: root,
    include: [],
    exclude: [],
    all: false,
    changedOnly: false,
  })

  assert.equal(
    files.length, 1,
    `expected 1 file, got ${files.length}: ${files.join(", ")}`,
  )
  assert.ok(!files.some((f) => f.includes("node_modules")))
})

test("discoverFiles excludes node_modules even with --include override", () => {
  const root = makeFixture()
  const files = discoverFiles({
    scope: root,
    include: ["**/*.tsx"],
    exclude: [],
    all: true,
    changedOnly: false,
  })

  assert.ok(
    !files.some((f) => f.includes("node_modules")),
    "user --include must not override the hard node_modules exclusion",
  )
})
