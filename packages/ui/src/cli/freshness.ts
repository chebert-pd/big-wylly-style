import { existsSync } from "node:fs"
import { join } from "node:path"
import {
  SHIPPED_SKILLS,
  compareSemver,
  readSkillVersion,
  type ShippedSkill,
} from "./skill-utils.js"
import type { Mode } from "./types.js"

export type FreshnessStatus = "current" | "stale" | "missing" | "corrupt"

export interface SkillFreshness {
  skill: ShippedSkill
  status: FreshnessStatus
  consumerVersion: string | null // null when status === "missing"
  packageVersion: string // "unknown" when package-side SKILL.md is corrupt
}

export function checkSkillFreshness(opts: {
  packageSkillsRoot: string
  consumerSkillsRoot: string
}): SkillFreshness[] {
  const results: SkillFreshness[] = []
  for (const skill of SHIPPED_SKILLS) {
    const packageSkillMd = join(opts.packageSkillsRoot, skill, "SKILL.md")
    const consumerSkillMd = join(opts.consumerSkillsRoot, skill, "SKILL.md")
    const packageVersion = existsSync(packageSkillMd)
      ? safeReadVersion(opts.packageSkillsRoot, skill)
      : "unknown"

    if (!existsSync(consumerSkillMd)) {
      results.push({ skill, status: "missing", consumerVersion: null, packageVersion })
      continue
    }
    const consumerVersion = safeReadVersion(opts.consumerSkillsRoot, skill)
    const cmp = compareSemver(consumerVersion, packageVersion)

    if (cmp === null) {
      results.push({ skill, status: "corrupt", consumerVersion, packageVersion })
    } else if (cmp < 0) {
      results.push({ skill, status: "stale", consumerVersion, packageVersion })
    } else {
      // cmp === 0 (current) OR cmp > 0 (consumer ahead of package).
      // Consumer-ahead is intentionally silent: bws-install-skills overwrites
      // consumer state with the package version, so warning would push the
      // consumer toward downgrading their own (newer) edits — the wrong
      // remediation. Don't "fix" this branch to emit a warning.
      results.push({ skill, status: "current", consumerVersion, packageVersion })
    }
  }
  return results
}

function safeReadVersion(skillsRoot: string, skill: ShippedSkill): string {
  try {
    return readSkillVersion(join(skillsRoot, skill))
  } catch {
    return "unknown"
  }
}

export function formatFreshnessReport(results: SkillFreshness[]): string {
  const warnings: string[] = []
  for (const r of results) {
    if (r.status === "missing") {
      warnings.push(
        `⚠ ${r.skill} skill not found in .claude/skills/. Run \`npx bws-install-skills\` to install.`,
      )
    } else if (r.status === "stale") {
      warnings.push(
        `⚠ ${r.skill} is at v${r.consumerVersion} but BWS ships v${r.packageVersion}. Run \`npx bws-install-skills\` to update.`,
      )
    } else if (r.status === "corrupt") {
      warnings.push(
        `⚠ ${r.skill} SKILL.md is missing version metadata. The skill may be corrupt — try running \`npx bws-install-skills\` again.`,
      )
    }
  }

  if (warnings.length > 0) {
    return warnings.join("\n") + "\n"
  }

  // All current: emit the confirmation line. Always-printed by design — silent
  // success hid an empty skill folder during earlier consumer validation, and
  // visible version state catches that class of bug immediately.
  const versions = results.map((r) => `${r.skill} v${r.consumerVersion}`).join(", ")
  return `✓ Skills current (${versions})\n`
}

// stderr placement is deliberate for BOTH warnings AND the ✓ confirmation line.
// Mirrors formatMetadataErrors() in audit-governance.ts — keeps structured
// formats (json / sarif / github) on stdout uncontaminated. Don't move the
// confirmation to stdout to "clean up" output; downstream parsers will break.
export function reportSkillFreshness(opts: {
  mode: Mode
  packageSkillsRoot: string
  consumerSkillsRoot: string
  stderr: NodeJS.WritableStream
}): void {
  // Maintainer mode: skip entirely. The repo's consumer-side .claude/skills/
  // symlinks point at the same files as the package, so the check would always
  // print ✓ with no actionable signal.
  if (opts.mode === "ds") return

  try {
    const results = checkSkillFreshness({
      packageSkillsRoot: opts.packageSkillsRoot,
      consumerSkillsRoot: opts.consumerSkillsRoot,
    })
    opts.stderr.write(formatFreshnessReport(results))
  } catch (err) {
    // Cardinal rule: the freshness check must never break the audit.
    opts.stderr.write(`⚠ Skill freshness check failed: ${(err as Error).message}\n`)
  }
}
