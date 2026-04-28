# big-wylly-style
Design system based on shadcn mapping for AI tooling.

## Structure

```
big-wylly-style/
├── packages/wyllo-ui/       # @chebert-pd/ui — design system package
├── apps/gallery/            # Next.js showcase app
└── .claude/skills/          # Agentic design system skills (patched)
```

## Agentic Skills

Three Claude Code skills provide AI-readable infrastructure for the design system. They are installed in `.claude/skills/` and committed to the repo.

**Do not reinstall these from the package.** The versions in this repo contain patches that fix issues with our monorepo structure. Reinstalling from `npx giorris-claude-skills install` will overwrite the fixes.

| Skill | Purpose | Patched? |
|-------|---------|----------|
| `codebase-index` | Relationship graph of all components | Yes — fixed relative import detection for monorepo sibling imports |
| `ai-component-metadata` | Structured metadata for each component | No |
| `ai-ds-composer` | Component selection reasoning | No |

### Governance Auditor

A token governance auditor ships with `@chebert-pd/ui` as the `audit-governance` CLI. It checks components against seven rule categories that encode design intent (not just token existence). Rules are defined in `packages/wyllo-ui/governance-rules.json`.

```bash
# Audit the design system source (from repo root)
npm run audit --workspace=packages/wyllo-ui

# Audit a consumer app — only files that import @chebert-pd/ui
npx audit-governance --scope apps/gallery

# Only files changed in this PR (used by CI)
npx audit-governance --scope apps/gallery --changed-only --base-ref origin/main

# JSON output (for CI or dashboards)
npx audit-governance --scope apps/gallery --format json

# Suppress a single line in source: add a comment above the offending line
# // govern:disable-next-line PL-003
# (or `govern:disable-file PL-003` near the top of the file for file-wide)
```

Consumer repos can plug in via the reusable workflow at `.github/workflows/governance-audit.yml`:

```yaml
jobs:
  audit:
    uses: chebert-pd/big-wylly-style/.github/workflows/governance-audit.yml@main
    with:
      scope: .
```

### Regenerating the Index

```bash
python3 .claude/skills/codebase-index/scripts/index_codebase.py ./packages/wyllo-ui
```

This is also automated via GitHub Actions on pushes to main that touch component files.
