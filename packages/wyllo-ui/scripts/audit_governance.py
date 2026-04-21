#!/usr/bin/env python3
"""
Design System Governance Auditor for @chebert-pd/ui

Author: Cass Hebert
Questions or issues? Reach out to Cass.

Scans component source files and checks token usage against governance rules.
Goes beyond linting (does this token exist?) to check intent (are these tokens
used correctly together?).

Usage:
    python scripts/audit_governance.py
    python scripts/audit_governance.py --format json
    python scripts/audit_governance.py --file src/components/button.tsx
"""

import os
import re
import json
import sys
from pathlib import Path
from collections import defaultdict
from typing import List, Dict, Optional


# ─── Configuration ────────────────────────────────────────────────────────────

COMPONENTS_DIR = "src/components"
RULES_FILE = "governance-rules.json"

# Tailwind palette colors that bypass the design system
TAILWIND_PALETTE = [
    "slate", "gray", "zinc", "neutral", "stone",
    "red", "orange", "amber", "yellow", "lime", "green",
    "emerald", "teal", "cyan", "sky", "blue", "indigo",
    "violet", "purple", "fuchsia", "pink", "rose",
]

# Named font weights that should use numeric values instead
NAMED_WEIGHTS = [
    "font-thin", "font-extralight", "font-light", "font-normal",
    "font-medium", "font-semibold", "font-bold", "font-extrabold", "font-black",
]

# Semantic color schemes (3-token contracts)
SCHEMES = ["destructive", "success", "warning", "info", "brand", "review"]

# Status base tokens that should NOT be used for text/icons
STATUS_BASE_AS_TEXT = [f"text-{s}" for s in SCHEMES]

# Raw primitive patterns
PRIMITIVE_PATTERNS = [
    r"gray-\d+",
    r"violet-\d+",
    r"orange-\d+",
]

# Hardcoded color patterns
HARDCODED_COLOR_PATTERNS = [
    r"#[0-9a-fA-F]{3,8}\b",            # hex
    r"rgb\s*\(",                         # rgb()
    r"rgba\s*\(",                        # rgba()
    r"oklch\s*\(",                       # oklch()
    r"hsl\s*\(",                         # hsl()
    r"hsla\s*\(",                        # hsla()
]

# Elevation tokens by weight
HEAVY_ELEVATIONS = ["elevation-overlay", "elevation-popover"]
SMALL_COMPONENTS = ["badge", "button", "input", "checkbox", "switch", "toggle",
                    "radio", "label", "kbd", "spinner", "skeleton"]


# ─── Violation ────────────────────────────────────────────────────────────────

class Violation:
    def __init__(self, rule_id: str, file: str, line: int, message: str,
                 snippet: str = "", fix: str = ""):
        self.rule_id = rule_id
        self.file = file
        self.line = line
        self.message = message
        self.snippet = snippet.strip()
        self.fix = fix

    def to_dict(self):
        d = {
            "rule": self.rule_id,
            "file": self.file,
            "line": self.line,
            "message": self.message,
        }
        if self.snippet:
            d["snippet"] = self.snippet
        if self.fix:
            d["fix"] = self.fix
        return d

    def __str__(self):
        loc = f"{self.file}:{self.line}"
        s = f"  [{self.rule_id}] {loc}\n    {self.message}"
        if self.snippet:
            s += f"\n    → {self.snippet[:120]}"
        if self.fix:
            s += f"\n    Fix: {self.fix}"
        return s


# ─── Auditor ──────────────────────────────────────────────────────────────────

class GovernanceAuditor:
    def __init__(self, project_root: Path, target_file: Optional[str] = None):
        self.project_root = project_root
        self.target_file = target_file
        self.violations: List[Violation] = []
        self.files_scanned = 0
        self.rules_file = project_root / RULES_FILE

    def run(self):
        components_dir = self.project_root / COMPONENTS_DIR

        if self.target_file:
            target = self.project_root / self.target_file
            if target.exists():
                self._audit_file(target)
            else:
                print(f"File not found: {target}")
                sys.exit(1)
        else:
            if not components_dir.exists():
                print(f"Components directory not found: {components_dir}")
                sys.exit(1)

            for tsx_file in sorted(components_dir.glob("*.tsx")):
                # Skip metadata files
                if ".metadata." in tsx_file.name:
                    continue
                self._audit_file(tsx_file)

    def _audit_file(self, file_path: Path):
        try:
            content = file_path.read_text(encoding="utf-8")
        except Exception:
            return

        self.files_scanned += 1
        rel_path = str(file_path.relative_to(self.project_root))
        lines = content.split("\n")
        component_name = file_path.stem

        for i, line in enumerate(lines, 1):
            # Skip import lines and comments
            stripped = line.strip()
            if stripped.startswith("import ") or stripped.startswith("//") or stripped.startswith("*"):
                continue

            self._check_foreground_hierarchy(rel_path, i, line, lines, i - 1)
            self._check_semantic_color_pairing(rel_path, i, line)
            self._check_border_hierarchy(rel_path, i, line)
            self._check_typography(rel_path, i, line)
            self._check_primitive_leakage(rel_path, i, line)
            self._check_hardcoded_colors(rel_path, i, line)
            self._check_tailwind_palette(rel_path, i, line)
            self._check_elevation_coherence(rel_path, i, line, component_name)
            self._check_named_weights(rel_path, i, line)

    # ── Rule 1: Foreground hierarchy ──────────────────────────────────────────

    def _check_foreground_hierarchy(self, file: str, line_num: int, line: str,
                                     all_lines: List[str], line_idx: int):
        # Check for muted-foreground directly on h1/h2 elements (same line only)
        if "text-muted-foreground" not in line:
            return

        # Only flag if the muted-foreground is on the SAME element as h1/h2
        # (i.e., both the tag and the class appear on the same line or in the same JSX element)
        same_element_patterns = [
            r'<h1[^>]*text-muted-foreground',
            r'<h2[^>]*text-muted-foreground',
            r'text-muted-foreground[^"]*"[^>]*>.*</h1>',
            r'text-muted-foreground[^"]*"[^>]*>.*</h2>',
        ]

        # Also check if this line has an h1/h2 class applied alongside muted-foreground
        class_patterns = [
            r'["\s]h1["\s].*text-muted-foreground',
            r'text-muted-foreground.*["\s]h1["\s]',
            r'["\s]h2["\s].*text-muted-foreground',
            r'text-muted-foreground.*["\s]h2["\s]',
        ]

        for pattern in same_element_patterns + class_patterns:
            if re.search(pattern, line):
                self.violations.append(Violation(
                    "FG-001", file, line_num,
                    "muted-foreground on h1/h2 element — top-level headings require full emphasis",
                    snippet=line.strip(),
                    fix="Use text-foreground for h1 and h2"
                ))
                return

    # ── Rule 3: Border hierarchy ──────────────────────────────────────────────

    def _check_border_hierarchy(self, file: str, line_num: int, line: str):
        # ring token used outside focus state
        if "ring-ring" in line:
            # Allow if any focus-related selector is present on the line
            # (including complex selectors like has-[...:focus-visible] or data-[active=true])
            focus_indicators = [
                "focus-visible", "focus:", "focus-within:",
                ":focus-visible", ":focus",
                "data-[active=true]",  # OTP active slot is functionally focus
            ]
            if not any(indicator in line for indicator in focus_indicators):
                self.violations.append(Violation(
                    "BD-001", file, line_num,
                    "ring token used outside focus state",
                    snippet=line.strip(),
                    fix="ring is exclusively for focus indicators — use border or input for non-focus borders"
                ))

    # ── Rule 4: Elevation coherence ───────────────────────────────────────────

    def _check_elevation_coherence(self, file: str, line_num: int, line: str,
                                    component_name: str):
        # Heavy elevation on small components
        if component_name in SMALL_COMPONENTS:
            for heavy in HEAVY_ELEVATIONS:
                if heavy in line:
                    self.violations.append(Violation(
                        "EL-001", file, line_num,
                        f"{heavy} on small component '{component_name}' — heavy shadows break visual scale",
                        snippet=line.strip(),
                        fix="Use elevation-surface or elevation-floating for small components"
                    ))

        # Raw shadow primitives
        if re.search(r'shadow-y\d+', line) and "var(--shadow" not in line:
            self.violations.append(Violation(
                "EL-003", file, line_num,
                "Raw shadow primitive (shadow-y*) — use semantic elevation tokens",
                snippet=line.strip(),
                fix="Use elevation-surface, elevation-floating, elevation-overlay, or elevation-popover"
            ))

    # ── Rule 5: Semantic color pairing ────────────────────────────────────────

    def _check_semantic_color_pairing(self, file: str, line_num: int, line: str):
        # Base status token used as text (text-destructive instead of text-destructive-foreground)
        # Exception: bg-current pattern (e.g., BadgeIndicator) where text color is used as shape fill
        if "bg-current" in line:
            return

        # Exception: lines that are ternary variable assignments (not className props)
        # e.g., `? "text-success"` — these assign to a variable used with bg-current later
        stripped = line.strip()
        if stripped.startswith("?") or stripped.startswith(":"):
            # Check if this is in a variable assignment context (not a className)
            if "className" not in line and "cn(" not in line:
                return

        for scheme in SCHEMES:
            # Match text-{scheme} but NOT text-{scheme}-foreground or text-{scheme}-border
            pattern = rf'\btext-{scheme}\b(?!-)'
            if re.search(pattern, line):
                self.violations.append(Violation(
                    "SC-001", file, line_num,
                    f"text-{scheme} uses the background tint token for text — nearly invisible",
                    snippet=line.strip(),
                    fix=f"Use text-{scheme}-foreground instead"
                ))

        # Check for cross-scheme mixing on the same line
        schemes_on_line = set()
        for scheme in SCHEMES:
            if re.search(rf'\b(?:bg|text|border)-{scheme}(?:-|\b)', line):
                schemes_on_line.add(scheme)
        if len(schemes_on_line) > 1:
            mixed = " + ".join(sorted(schemes_on_line))
            self.violations.append(Violation(
                "SC-002", file, line_num,
                f"Cross-scheme mixing: {mixed} tokens on the same line",
                snippet=line.strip(),
                fix="Use tokens from a single scheme per element"
            ))

        # Check for solid/tinted mixing
        # Exception: tinted bg used as focus/hover state alongside solid text is acceptable
        # (e.g., focus:bg-destructive/10 with text-destructive-solid)
        for scheme in ["destructive", "brand"]:
            has_solid = f"{scheme}-solid" in line
            has_tinted_bg = re.search(rf'\bbg-{scheme}\b(?!-solid)', line)
            has_tinted_fg = f"text-{scheme}-foreground" in line
            if has_solid and has_tinted_bg:
                # Allow if the tinted bg is behind a state prefix (focus:, hover:, active:)
                tinted_bg_match = re.search(rf'(?:focus|hover|active):bg-{scheme}\b', line)
                if tinted_bg_match:
                    continue
            if has_solid and (has_tinted_bg or has_tinted_fg):
                self.violations.append(Violation(
                    "SC-003", file, line_num,
                    f"Mixing {scheme} solid and tinted variants on the same element",
                    snippet=line.strip(),
                    fix=f"Use either the tinted set ({scheme}/{scheme}-border/{scheme}-foreground) or the solid set ({scheme}-solid/{scheme}-solid-foreground)"
                ))

    # ── Rule 6: Typography conventions ────────────────────────────────────────

    # Accepted sub-scale font sizes for compact UI elements (counter badges, tiny labels)
    ACCEPTED_TINY_SIZES = {"10px", "11px"}

    def _check_typography(self, file: str, line_num: int, line: str):
        # Arbitrary font sizes
        match = re.search(r'text-\[(\d+\.?\d*(?:px|rem|em))\]', line)
        if match:
            size_value = match.group(1)
            # Allow accepted sub-scale sizes for compact UI (counter badges, tiny labels)
            if size_value in self.ACCEPTED_TINY_SIZES:
                return
            self.violations.append(Violation(
                "TY-002", file, line_num,
                f"Arbitrary font size text-[{size_value}] — use the type scale",
                snippet=line.strip(),
                fix="Use text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, or text-3xl"
            ))

    def _check_named_weights(self, file: str, line_num: int, line: str):
        for weight in NAMED_WEIGHTS:
            if re.search(rf'\b{weight}\b', line):
                self.violations.append(Violation(
                    "TY-001", file, line_num,
                    f"Named weight '{weight}' — use numeric weights",
                    snippet=line.strip(),
                    fix="Use font-[420] (body), font-[520] (label), font-[620] (heading), or font-[660] (data)"
                ))

    # ── Rule 7: Primitive leakage ─────────────────────────────────────────────

    def _check_primitive_leakage(self, file: str, line_num: int, line: str):
        # Raw design system primitives (gray-55, violet-58, etc.)
        for pattern in PRIMITIVE_PATTERNS:
            match = re.search(pattern, line)
            if match:
                # Skip if it's inside a CSS var definition (var(--gray-55))
                # or inside globals.css token definitions
                if "var(--" in line:
                    continue
                # Skip comments
                if line.strip().startswith("//") or line.strip().startswith("*"):
                    continue
                self.violations.append(Violation(
                    "PL-001", file, line_num,
                    f"Raw primitive token '{match.group()}' — use semantic tokens",
                    snippet=line.strip(),
                    fix="Replace with the appropriate semantic token"
                ))

    def _check_hardcoded_colors(self, file: str, line_num: int, line: str):
        # Skip lines that are clearly not styling (type definitions, comments)
        stripped = line.strip()
        if stripped.startswith("//") or stripped.startswith("*") or stripped.startswith("type "):
            return
        # Skip string content that isn't className-related
        if "className" not in line and "class=" not in line and "cn(" not in line and "style" not in line:
            return

        for pattern in HARDCODED_COLOR_PATTERNS:
            match = re.search(pattern, line)
            if match:
                self.violations.append(Violation(
                    "PL-002", file, line_num,
                    f"Hardcoded color value: {match.group()[:30]}",
                    snippet=line.strip(),
                    fix="Use a semantic color token from the design system"
                ))
                break  # One violation per line is enough

    def _check_tailwind_palette(self, file: str, line_num: int, line: str):
        # Tailwind default palette classes (text-blue-500, bg-red-400, etc.)
        for color in TAILWIND_PALETTE:
            pattern = rf'\b(?:text|bg|border|ring|outline|shadow|from|to|via)-{color}-\d+'
            match = re.search(pattern, line)
            if match:
                # Skip if inside a CSS var reference
                if "var(--" in line and f"--color-{color}" in line:
                    continue
                self.violations.append(Violation(
                    "PL-003", file, line_num,
                    f"Tailwind palette class '{match.group()}' bypasses design system",
                    snippet=line.strip(),
                    fix="Use semantic tokens from the design system"
                ))

    # ── Output ────────────────────────────────────────────────────────────────

    def report(self, format: str = "text") -> str:
        if format == "json":
            return self._report_json()
        return self._report_text()

    def _report_text(self) -> str:
        lines = []
        lines.append("=" * 60)
        lines.append("  Design System Governance Audit")
        lines.append("=" * 60)
        lines.append("")
        lines.append(f"Files scanned: {self.files_scanned}")
        lines.append(f"Violations found: {len(self.violations)}")
        lines.append("")

        if not self.violations:
            lines.append("✅ No violations found. All components follow governance rules.")
            return "\n".join(lines)

        # Group by rule
        by_rule = defaultdict(list)
        for v in self.violations:
            by_rule[v.rule_id].append(v)

        for rule_id in sorted(by_rule.keys()):
            violations = by_rule[rule_id]
            lines.append(f"── {rule_id} ({len(violations)} violation{'s' if len(violations) != 1 else ''}) ──")
            for v in violations:
                lines.append(str(v))
            lines.append("")

        # Summary by file
        by_file = defaultdict(int)
        for v in self.violations:
            by_file[v.file] += 1

        lines.append("── By file ──")
        for file, count in sorted(by_file.items(), key=lambda x: -x[1]):
            lines.append(f"  {count:3d}  {file}")
        lines.append("")

        return "\n".join(lines)

    def _report_json(self) -> str:
        data = {
            "summary": {
                "filesScanned": self.files_scanned,
                "totalViolations": len(self.violations),
                "byRule": {},
                "byFile": {},
            },
            "violations": [v.to_dict() for v in self.violations],
        }

        by_rule = defaultdict(int)
        by_file = defaultdict(int)
        for v in self.violations:
            by_rule[v.rule_id] += 1
            by_file[v.file] += 1

        data["summary"]["byRule"] = dict(sorted(by_rule.items()))
        data["summary"]["byFile"] = dict(sorted(by_file.items(), key=lambda x: -x[1]))

        return json.dumps(data, indent=2)


# ─── CLI ──────────────────────────────────────────────────────────────────────

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Design System Governance Auditor")
    parser.add_argument("--format", choices=["text", "json"], default="text",
                        help="Output format (default: text)")
    parser.add_argument("--file", type=str, default=None,
                        help="Audit a single file instead of all components")
    args = parser.parse_args()

    # Find project root (where governance-rules.json lives)
    project_root = Path(__file__).parent.parent
    if not (project_root / RULES_FILE).exists():
        # Try current directory
        project_root = Path.cwd()
        if not (project_root / RULES_FILE).exists():
            print(f"Cannot find {RULES_FILE}. Run from the package root.")
            sys.exit(1)

    auditor = GovernanceAuditor(project_root, target_file=args.file)
    auditor.run()
    print(auditor.report(format=args.format))

    # Exit with non-zero if violations found
    sys.exit(1 if auditor.violations else 0)


if __name__ == "__main__":
    main()
