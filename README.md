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
      package-manager: npm  # or pnpm, yarn
```

For a step-by-step adoption walkthrough — including baseline mode and the suppression workflow — see the [Setup Guide](apps/gallery/app/gallery/skills/governance-auditor/setup/page.tsx) in the gallery (also published to the docs site at `/gallery/skills/governance-auditor/setup`).

#### Versioning policy

This package follows semantic versioning, with these specific commitments around governance rules:

- **Patch bumps (2.x.y)** — bug fixes, false-positive fixes, performance improvements. Safe to take automatically.
- **Minor bumps (2.X.0)** — new rules ship as `severity: "warning"` first. They appear in audit output but don't fail CI. Consumers have at least one minor release to adjust before any new rule is promoted to `error`.
- **Major bumps (X.0.0)** — breaking changes to the rule set, the suppression syntax, the JSON schema, or the CLI surface. Migration notes published in the changelog.

**Recommendation for consumer repos:** pin a major version (`"@chebert-pd/ui": "^2"`) and let your dependency bot take minor + patch bumps automatically. New rules will land as warnings; you'll see them in audit output and can fix or suppress at your pace before the next minor that promotes them to errors.

If a minor release does promote a rule from warning to error and you're not ready, you can pass `--no-baseline` and re-run `--baseline write` to grandfather the new violations into the baseline. The promotion is never silent — it's announced in the changelog.

### Regenerating the Index

```bash
python3 .claude/skills/codebase-index/scripts/index_codebase.py ./packages/wyllo-ui
```

This is also automated via GitHub Actions on pushes to main that touch component files.
