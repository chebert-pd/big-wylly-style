import { test } from "node:test"
import { strict as assert } from "node:assert"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { Writable } from "node:stream"
import { reportSkillFreshness } from "../freshness.js"

const frontmatter = (name: string, version: string) =>
  `---\nname: ${name}\nversion: ${version}\ndescription: test fixture\n---\n\n# ${name}\n`

function writeSkill(root: string, name: string, version: string): void {
  mkdirSync(join(root, name), { recursive: true })
  writeFileSync(join(root, name, "SKILL.md"), frontmatter(name, version))
}

interface FixtureOpts {
  governance?: string | false
  composer?: string | false
}

function makeSource(root: string, opts: FixtureOpts = {}): void {
  const govVersion = opts.governance === undefined ? "1.2.0" : opts.governance
  const compVersion = opts.composer === undefined ? "2.1.0" : opts.composer
  if (govVersion !== false) writeSkill(root, "governance-auditor", govVersion)
  if (compVersion !== false) writeSkill(root, "ai-ds-composer", compVersion)
}

function makeStreams() {
  let stderr = ""
  return {
    stderr: new Writable({
      write(chunk, _enc, cb) {
        stderr += chunk.toString()
        cb()
      },
    }),
    err: () => stderr,
  }
}

function withTempDirs(fn: (pkg: string, consumer: string) => void): void {
  const tmpRoot = mkdtempSync(join(tmpdir(), "bws-fresh-"))
  const pkg = join(tmpRoot, "pkg")
  const consumer = join(tmpRoot, "consumer", ".claude", "skills")
  mkdirSync(pkg, { recursive: true })
  try {
    fn(pkg, consumer)
  } finally {
    rmSync(tmpRoot, { recursive: true, force: true })
  }
}

test("freshness: both current → confirmation line with both versions", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg)
    mkdirSync(consumer, { recursive: true })
    makeSource(consumer)
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    assert.match(
      s.err(),
      /✓ Skills current \(governance-auditor v1\.2\.0, ai-ds-composer v2\.1\.0\)/,
    )
    assert.doesNotMatch(s.err(), /⚠/)
  })
})

test("freshness: one stale → warning only, no confirmation", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg)
    mkdirSync(consumer, { recursive: true })
    makeSource(consumer, { governance: "1.1.0" })
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    assert.match(s.err(), /⚠ governance-auditor is at v1\.1\.0 but BWS ships v1\.2\.0/)
    assert.doesNotMatch(s.err(), /✓/)
    assert.doesNotMatch(s.err(), /ai-ds-composer/)
  })
})

test("freshness: both stale → two warnings, no confirmation", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg)
    mkdirSync(consumer, { recursive: true })
    makeSource(consumer, { governance: "1.1.0", composer: "2.0.0" })
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    const lines = s.err().trim().split("\n")
    assert.equal(lines.length, 2)
    assert.match(lines[0], /governance-auditor.*v1\.1\.0.*v1\.2\.0/)
    assert.match(lines[1], /ai-ds-composer.*v2\.0\.0.*v2\.1\.0/)
    assert.doesNotMatch(s.err(), /✓/)
  })
})

test("freshness: one missing → not-found warning", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg)
    mkdirSync(consumer, { recursive: true })
    makeSource(consumer, { composer: false })
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    assert.match(s.err(), /⚠ ai-ds-composer skill not found in \.claude\/skills\//)
    assert.match(s.err(), /Run `npx bws-install-skills` to install/)
    assert.doesNotMatch(s.err(), /governance-auditor/)
  })
})

test("freshness: both missing → two not-found warnings", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg)
    // Consumer skills dir intentionally not created.
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    const lines = s.err().trim().split("\n")
    assert.equal(lines.length, 2)
    assert.match(lines[0], /governance-auditor skill not found/)
    assert.match(lines[1], /ai-ds-composer skill not found/)
  })
})

test("freshness: consumer version corrupt → 'may be corrupt' warning", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg)
    mkdirSync(consumer, { recursive: true })
    makeSource(consumer)
    writeFileSync(join(consumer, "governance-auditor", "SKILL.md"), "# no frontmatter\n")
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    assert.match(s.err(), /⚠ governance-auditor SKILL\.md is missing version metadata/)
    assert.match(s.err(), /try running `npx bws-install-skills` again/)
  })
})

test("freshness: package version corrupt → 'may be corrupt' warning", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg)
    writeFileSync(join(pkg, "ai-ds-composer", "SKILL.md"), "# no frontmatter\n")
    mkdirSync(consumer, { recursive: true })
    makeSource(consumer)
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    assert.match(s.err(), /⚠ ai-ds-composer SKILL\.md is missing version metadata/)
  })
})

test("freshness: maintainer mode → silent", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg)
    const s = makeStreams()
    reportSkillFreshness({
      mode: "ds",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    assert.equal(s.err(), "")
  })
})

test("freshness: consumer newer than package → treated as current, no warning", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg, { governance: "1.2.0", composer: "2.1.0" })
    mkdirSync(consumer, { recursive: true })
    makeSource(consumer, { governance: "1.3.0", composer: "2.2.0" })
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    assert.match(s.err(), /✓ Skills current/)
    assert.doesNotMatch(s.err(), /⚠/)
  })
})

test("freshness: mixed current + missing → warning only for missing", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg)
    mkdirSync(consumer, { recursive: true })
    writeSkill(consumer, "governance-auditor", "1.2.0")
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    assert.match(s.err(), /⚠ ai-ds-composer skill not found/)
    assert.doesNotMatch(s.err(), /✓/)
  })
})

test("freshness: numeric semver compares correctly (v2.9.0 < v2.10.0)", () => {
  withTempDirs((pkg, consumer) => {
    makeSource(pkg, { governance: "1.2.0", composer: "2.10.0" })
    mkdirSync(consumer, { recursive: true })
    makeSource(consumer, { governance: "1.2.0", composer: "2.9.0" })
    const s = makeStreams()
    reportSkillFreshness({
      mode: "consumer",
      packageSkillsRoot: pkg,
      consumerSkillsRoot: consumer,
      stderr: s.stderr,
    })
    // Would FAIL with lexicographic comparison ("2.9.0" > "2.10.0").
    assert.match(s.err(), /⚠ ai-ds-composer is at v2\.9\.0 but BWS ships v2\.10\.0/)
  })
})
