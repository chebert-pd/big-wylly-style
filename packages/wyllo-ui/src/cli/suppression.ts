export interface FileSuppressions {
  fileWide: { rules: Set<string> | "all"; reason: string } | null
  nextLine: Map<number, { rules: Set<string> | "all"; reason: string }>
}

const NEXT_LINE_RE = /govern:disable-next-line(?:\s+([A-Z]{2}-\d{3}(?:\s*,\s*[A-Z]{2}-\d{3})*))?/
const FILE_WIDE_RE = /govern:disable-file(?:\s+([A-Z]{2}-\d{3}(?:\s*,\s*[A-Z]{2}-\d{3})*))?/

function parseRuleList(raw: string | undefined): Set<string> | "all" {
  if (!raw) return "all"
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))
}

export function parseSuppressions(content: string): FileSuppressions {
  const lines = content.split("\n")
  const result: FileSuppressions = { fileWide: null, nextLine: new Map() }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (i < 10 && result.fileWide === null) {
      const fileMatch = line.match(FILE_WIDE_RE)
      if (fileMatch) {
        result.fileWide = {
          rules: parseRuleList(fileMatch[1]),
          reason: line.trim(),
        }
        continue
      }
    }

    const nextMatch = line.match(NEXT_LINE_RE)
    if (nextMatch) {
      result.nextLine.set(i + 2, {
        rules: parseRuleList(nextMatch[1]),
        reason: line.trim(),
      })
    }
  }

  return result
}

export function isSuppressed(
  suppressions: FileSuppressions,
  ruleId: string,
  lineNum: number,
): { suppressed: boolean; reason: string } {
  if (suppressions.fileWide) {
    const { rules, reason } = suppressions.fileWide
    if (rules === "all" || rules.has(ruleId)) {
      return { suppressed: true, reason }
    }
  }
  const next = suppressions.nextLine.get(lineNum)
  if (next) {
    if (next.rules === "all" || next.rules.has(ruleId)) {
      return { suppressed: true, reason: next.reason }
    }
  }
  return { suppressed: false, reason: "" }
}
