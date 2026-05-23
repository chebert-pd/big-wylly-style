#!/usr/bin/env node
import { cpSync, existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import {
  SHIPPED_SKILLS,
  readSkillVersion,
  resolveBundledSkillsRoot,
} from "./skill-utils.js"

const COMPOSER_BUNDLED_SINCE = "3.3.0" // First version where ai-ds-composer shipped with the package

const HELP = `bws-install-skills — Install Claude Code skills bundled with @big-wylly-style/ui

Usage:
  bws-install-skills

Copies the governance-auditor and ai-ds-composer skills from this package into
<cwd>/.claude/skills/. Overwrites existing skill files of the same name without
prompting. Leaves any other folders in .claude/skills/ untouched, including
ai-component-metadata and codebase-index (which are not yet bundled with the
package).

Run after a fresh install or after upgrading @big-wylly-style/ui to keep your
skills in sync with the package version. Restart Claude Code afterward so it
picks up the new SKILL.md frontmatter.
`

export interface InstallOptions {
  sourceRoot: string
  destRoot: string
  stdout: NodeJS.WritableStream
  stderr: NodeJS.WritableStream
}

export interface InstallResult {
  exitCode: 0 | 1
}

export function installSkills(opts: InstallOptions): InstallResult {
  const { sourceRoot, destRoot, stdout, stderr } = opts

  if (!existsSync(sourceRoot)) {
    stderr.write(
      `bws-install-skills: skills source not found at ${sourceRoot}.\n` +
        `The @big-wylly-style/ui package install may be corrupt — try reinstalling.\n`,
    )
    return { exitCode: 1 }
  }

  for (const skill of SHIPPED_SKILLS) {
    const srcSkillMd = join(sourceRoot, skill, "SKILL.md")
    if (!existsSync(srcSkillMd)) {
      const hint =
        skill === "ai-ds-composer"
          ? ` Upgrade to @big-wylly-style/ui >= ${COMPOSER_BUNDLED_SINCE} to install ai-ds-composer.`
          : ""
      stderr.write(
        `bws-install-skills: skill source missing required file at ${srcSkillMd}.` +
          ` The @big-wylly-style/ui package install may be corrupt — try reinstalling.${hint}\n`,
      )
      return { exitCode: 1 }
    }
  }

  for (const skill of SHIPPED_SKILLS) {
    const srcSkill = join(sourceRoot, skill)
    const destSkill = join(destRoot, skill)
    cpSync(srcSkill, destSkill, { recursive: true, force: true })
    const version = readSkillVersion(srcSkill)
    stdout.write(`✓ Copied ${skill} v${version}\n`)
  }

  stdout.write(`Installed ${SHIPPED_SKILLS.length} skills to ${destRoot}\n`)
  return { exitCode: 0 }
}

function main(): void {
  const arg = process.argv[2]
  if (arg === "--help" || arg === "-h") {
    process.stdout.write(HELP)
    process.exit(0)
  }
  if (arg !== undefined) {
    process.stderr.write(`bws-install-skills: unknown option: ${arg}\n`)
    process.exit(2)
  }

  const { exitCode } = installSkills({
    sourceRoot: resolveBundledSkillsRoot(import.meta.url),
    destRoot: resolve(process.cwd(), ".claude", "skills"),
    stdout: process.stdout,
    stderr: process.stderr,
  })
  process.exit(exitCode)
}

// Only run main() when invoked as a script, not when imported by tests.
const invokedHref = process.argv[1] ? pathToFileURL(process.argv[1]).href : ""
if (import.meta.url === invokedHref) {
  main()
}
