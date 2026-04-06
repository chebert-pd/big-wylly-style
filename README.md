# big-wylly-style
Design system based on shadcn mapping for AI tooling.

## Structure

```
big-wylly-style/
├── packages/wyllo-ui/       # @wyllo/ui — design system package
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

A token governance auditor lives at `packages/wyllo-ui/scripts/audit_governance.py`. It checks components against seven rule categories that encode design intent (not just token existence). Rules are defined in `packages/wyllo-ui/governance-rules.json`.

```bash
# Audit all components
python3 packages/wyllo-ui/scripts/audit_governance.py

# Audit a single file
python3 packages/wyllo-ui/scripts/audit_governance.py --file src/components/button.tsx
```

### Regenerating the Index

```bash
python3 .claude/skills/codebase-index/scripts/index_codebase.py ./packages/wyllo-ui
```

This is also automated via GitHub Actions on pushes to main that touch component files.
