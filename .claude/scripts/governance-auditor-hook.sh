#!/usr/bin/env bash
# PostToolUse hook for Edit|Write — emits a system-reminder pointing Claude at
# the governance-auditor skill when a governance-relevant file is modified.
#
# Reads stdin JSON of shape { "tool_input": { "file_path": "..." }, ... }.
# When the file matches a governance-relevant path, prints a JSON object with
# hookSpecificOutput.additionalContext. Otherwise prints nothing and exits 0.
set -euo pipefail

# Extract the file path from the hook input. Empty if not present.
file_path="$(jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"
[[ -z "$file_path" ]] && exit 0

# Match the governance-relevant paths.
matched=""
if [[ "$file_path" =~ /packages/ui/src/components/.+\.(tsx|metadata\.json)$ ]]; then
  matched="component"
elif [[ "$file_path" =~ /packages/ui/governance-rules\.json$ ]]; then
  matched="governance"
elif [[ "$file_path" =~ /apps/[^/]+/app/.+\.tsx$ ]]; then
  matched="page"
fi
[[ -z "$matched" ]] && exit 0

# Tail the file path to keep the reminder short, then emit the JSON.
short_path="${file_path#*/big-wylly-style/}"

# Build the reminder. Tip the relevant CLI invocations.
reminder="Governance-relevant file modified (${short_path}). Invoke the governance-auditor skill: run \`npx audit-governance --scope <enclosing-app-or-package> --changed-only --base-ref origin/main\` and triage any violations."
if [[ "$matched" == "component" || "$matched" == "governance" ]]; then
  reminder+=" If this was a metadata edit, also consider \`npx audit-governance --check-drift\` to verify metadata still matches each component's TS signature."
fi

jq -n --arg ctx "$reminder" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $ctx
  }
}'
