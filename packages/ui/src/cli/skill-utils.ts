import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const SHIPPED_SKILLS = ["governance-auditor", "ai-ds-composer"] as const
export type ShippedSkill = (typeof SHIPPED_SKILLS)[number]

export function readSkillVersion(skillRoot: string): string {
  const md = readFileSync(join(skillRoot, "SKILL.md"), "utf-8")
  const fm = md.match(/^---\n([\s\S]*?)\n---/)
  if (!fm) return "unknown"
  const v = fm[1].match(/^version:\s*(\S+)\s*$/m)
  return v ? v[1] : "unknown"
}

// Numeric semver split-and-compare. Returns -1 / 0 / 1, or null if either
// side can't be parsed as dot-separated integers (covers "unknown", partial
// versions, and any pre-release suffix the skill versioning scheme doesn't use).
export function compareSemver(a: string, b: string): number | null {
  if (a === "unknown" || b === "unknown") return null
  const pa = a.split(".").map((x) => Number.parseInt(x, 10))
  const pb = b.split(".").map((x) => Number.parseInt(x, 10))
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const ai = pa[i] ?? 0
    const bi = pb[i] ?? 0
    if (Number.isNaN(ai) || Number.isNaN(bi)) return null
    if (ai !== bi) return ai < bi ? -1 : 1
  }
  return 0
}

// Resolves <pkg>/.claude/skills/ from a CLI's compiled dist/cli/<entry>.js.
// Pass `import.meta.url` so each CLI's own module location is the anchor.
export function resolveBundledSkillsRoot(importMetaUrl: string): string {
  const here = dirname(fileURLToPath(importMetaUrl))
  return resolve(here, "..", "..", ".claude", "skills")
}
