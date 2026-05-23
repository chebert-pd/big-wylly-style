import { test } from "node:test"
import { strict as assert } from "node:assert"
import { spawnSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { Writable } from "node:stream"
import { fileURLToPath } from "node:url"
import { installSkills } from "../install-skills.js"
import { readSkillVersion } from "../skill-utils.js"

const HERE = dirname(fileURLToPath(import.meta.url))
const DIST_INSTALL_SKILLS = resolve(HERE, "..", "..", "..", "dist", "cli", "install-skills.js")

const SKILL_MD_GOVERNANCE = `---
name: governance-auditor
version: 1.2.0
description: test fixture
---

# Governance Auditor
`

const SKILL_MD_COMPOSER = `---
name: ai-ds-composer
version: 2.1.0
description: test fixture
---

# Composer
`

function makeFakeSource(
  root: string,
  opts: { omitComposer?: boolean; omitGovernance?: boolean } = {},
): void {
  if (!opts.omitGovernance) {
    mkdirSync(join(root, "governance-auditor"), { recursive: true })
    writeFileSync(join(root, "governance-auditor", "SKILL.md"), SKILL_MD_GOVERNANCE)
  }
  if (!opts.omitComposer) {
    mkdirSync(join(root, "ai-ds-composer"), { recursive: true })
    writeFileSync(join(root, "ai-ds-composer", "SKILL.md"), SKILL_MD_COMPOSER)
    writeFileSync(join(root, "ai-ds-composer", "LICENSE.txt"), "MIT\n")
  }
}

function makeStreams() {
  let stdout = ""
  let stderr = ""
  return {
    stdout: new Writable({
      write(chunk, _enc, cb) {
        stdout += chunk.toString()
        cb()
      },
    }),
    stderr: new Writable({
      write(chunk, _enc, cb) {
        stderr += chunk.toString()
        cb()
      },
    }),
    out: () => stdout,
    err: () => stderr,
  }
}

function withTempDirs(fn: (source: string, dest: string) => void): void {
  const tmpRoot = mkdtempSync(join(tmpdir(), "bws-install-"))
  const source = join(tmpRoot, "source")
  const dest = join(tmpRoot, "dest", ".claude", "skills")
  mkdirSync(source, { recursive: true })
  try {
    fn(source, dest)
  } finally {
    rmSync(tmpRoot, { recursive: true, force: true })
  }
}

test("install-skills: first-time install creates destination with both skills", () => {
  withTempDirs((source, dest) => {
    makeFakeSource(source)
    const s = makeStreams()
    const { exitCode } = installSkills({
      sourceRoot: source,
      destRoot: dest,
      stdout: s.stdout,
      stderr: s.stderr,
    })
    assert.equal(exitCode, 0)
    assert.ok(existsSync(join(dest, "governance-auditor", "SKILL.md")))
    assert.ok(existsSync(join(dest, "ai-ds-composer", "SKILL.md")))
    assert.ok(existsSync(join(dest, "ai-ds-composer", "LICENSE.txt")))
    assert.match(s.out(), /✓ Copied governance-auditor v1\.2\.0/)
    assert.match(s.out(), /✓ Copied ai-ds-composer v2\.1\.0/)
    assert.match(s.out(), /Installed 2 skills to /)
  })
})

test("install-skills: update overwrites existing skill files", () => {
  withTempDirs((source, dest) => {
    makeFakeSource(source)
    mkdirSync(join(dest, "governance-auditor"), { recursive: true })
    writeFileSync(join(dest, "governance-auditor", "SKILL.md"), "STALE")
    const s = makeStreams()
    installSkills({ sourceRoot: source, destRoot: dest, stdout: s.stdout, stderr: s.stderr })
    const written = readFileSync(join(dest, "governance-auditor", "SKILL.md"), "utf-8")
    assert.ok(!written.includes("STALE"))
    assert.match(written, /version: 1\.2\.0/)
  })
})

test("install-skills: non-destruction of ai-component-metadata", () => {
  withTempDirs((source, dest) => {
    makeFakeSource(source)
    mkdirSync(join(dest, "ai-component-metadata"), { recursive: true })
    const consumerFile = join(dest, "ai-component-metadata", "SKILL.md")
    const marker = "CONSUMER_MARKER_v1"
    writeFileSync(consumerFile, marker)
    const s = makeStreams()
    installSkills({ sourceRoot: source, destRoot: dest, stdout: s.stdout, stderr: s.stderr })
    assert.equal(readFileSync(consumerFile, "utf-8"), marker)
    assert.doesNotMatch(s.out(), /ai-component-metadata/)
  })
})

test("install-skills: non-destruction of unrelated folder", () => {
  withTempDirs((source, dest) => {
    makeFakeSource(source)
    mkdirSync(join(dest, "my-custom-skill"), { recursive: true })
    const customFile = join(dest, "my-custom-skill", "notes.md")
    writeFileSync(customFile, "my custom notes")
    const s = makeStreams()
    installSkills({ sourceRoot: source, destRoot: dest, stdout: s.stdout, stderr: s.stderr })
    assert.ok(existsSync(customFile))
    assert.equal(readFileSync(customFile, "utf-8"), "my custom notes")
  })
})

test("install-skills: non-destruction of unrelated file inside a known-skill folder", () => {
  withTempDirs((source, dest) => {
    makeFakeSource(source)
    mkdirSync(join(dest, "governance-auditor"), { recursive: true })
    const sideFile = join(dest, "governance-auditor", "MY_NOTES.md")
    writeFileSync(sideFile, "side file from consumer")
    const s = makeStreams()
    installSkills({ sourceRoot: source, destRoot: dest, stdout: s.stdout, stderr: s.stderr })
    assert.ok(existsSync(sideFile))
    assert.equal(readFileSync(sideFile, "utf-8"), "side file from consumer")
    assert.match(
      readFileSync(join(dest, "governance-auditor", "SKILL.md"), "utf-8"),
      /version: 1\.2\.0/,
    )
  })
})

test("install-skills: error when source skills root missing", () => {
  withTempDirs((source, dest) => {
    rmSync(source, { recursive: true, force: true })
    const s = makeStreams()
    const { exitCode } = installSkills({
      sourceRoot: source,
      destRoot: dest,
      stdout: s.stdout,
      stderr: s.stderr,
    })
    assert.equal(exitCode, 1)
    assert.match(s.err(), /skills source not found/)
    assert.match(s.err(), /may be corrupt/)
  })
})

test("install-skills: error when ai-ds-composer source SKILL.md missing — hints at version", () => {
  withTempDirs((source, dest) => {
    makeFakeSource(source, { omitComposer: true })
    const s = makeStreams()
    const { exitCode } = installSkills({
      sourceRoot: source,
      destRoot: dest,
      stdout: s.stdout,
      stderr: s.stderr,
    })
    assert.equal(exitCode, 1)
    assert.match(s.err(), /skill source missing required file/)
    assert.match(s.err(), /ai-ds-composer/)
    assert.match(s.err(), />= 3\.3\.0/)
  })
})

test("install-skills: version reported as 'unknown' when frontmatter missing", () => {
  withTempDirs((source, dest) => {
    mkdirSync(join(source, "governance-auditor"), { recursive: true })
    writeFileSync(join(source, "governance-auditor", "SKILL.md"), "# No frontmatter here\n")
    mkdirSync(join(source, "ai-ds-composer"), { recursive: true })
    writeFileSync(join(source, "ai-ds-composer", "SKILL.md"), SKILL_MD_COMPOSER)
    const s = makeStreams()
    const { exitCode } = installSkills({
      sourceRoot: source,
      destRoot: dest,
      stdout: s.stdout,
      stderr: s.stderr,
    })
    assert.equal(exitCode, 0)
    assert.match(s.out(), /✓ Copied governance-auditor vunknown/)
  })
})

test("install-skills: readSkillVersion returns 'unknown' when version line is absent", () => {
  withTempDirs((source) => {
    mkdirSync(join(source, "x"), { recursive: true })
    writeFileSync(join(source, "x", "SKILL.md"), "---\nname: x\n---\n")
    assert.equal(readSkillVersion(join(source, "x")), "unknown")
  })
})

test("install-skills: invoking the built CLI via a symlink runs main() (npm-bin shape)", () => {
  // Regression test. npm installs CLI bins as symlinks in node_modules/.bin/.
  // The entry guard must realpath both sides of the URL comparison, or main()
  // silently skips when invoked through a symlink — caught during pre-merge
  // consumer-app validation. This test invokes the built dist file through a
  // tempdir symlink and confirms the HELP banner prints (proving main() ran).
  if (!existsSync(DIST_INSTALL_SKILLS)) {
    // Built dist isn't present in this run (e.g. test invoked before build).
    // CI runs build before test, so this skip only fires in dev shortcuts.
    return
  }
  const tmpRoot = mkdtempSync(join(tmpdir(), "bws-symlink-"))
  const symlinkPath = join(tmpRoot, "bws-install-skills")
  symlinkSync(DIST_INSTALL_SKILLS, symlinkPath)
  try {
    const result = spawnSync("node", [symlinkPath, "--help"], { encoding: "utf-8" })
    assert.equal(
      result.status,
      0,
      `expected exit 0, got ${result.status}; stderr: ${result.stderr}`,
    )
    assert.match(
      result.stdout,
      /bws-install-skills — Install Claude Code skills/,
      "HELP banner not printed — main() likely did not run via symlink",
    )
  } finally {
    rmSync(tmpRoot, { recursive: true, force: true })
  }
})
