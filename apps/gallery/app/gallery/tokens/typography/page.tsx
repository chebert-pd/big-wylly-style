"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@wyllo/ui"

/* ─────────────────────────────────────────────
 * DATA
 * ───────────────────────────────────────────── */

const typographyTokens = [
  { class: ".h1", size: "text-2xl (24px)", weight: "620", usage: "Page title" },
  { class: ".h2", size: "text-base (16px)", weight: "620", usage: "Section title" },
  { class: ".h3", size: "text-sm (14px)", weight: "620", usage: "Subsection title" },
  { class: ".h4", size: "text-xs (12px)", weight: "620", usage: "Minor heading" },
  { class: ".p-lg", size: "text-base (16px)", weight: "420", usage: "Large body text" },
  { class: ".p", size: "text-sm (14px)", weight: "420", usage: "Default body text" },
  { class: ".p-sm", size: "text-xs (12px)", weight: "420", usage: "Small / caption text" },
  { class: ".label-lg", size: "text-base (16px)", weight: "520", usage: "Large label / UI" },
  { class: ".label-md", size: "text-sm (14px)", weight: "520", usage: "Default label / UI" },
  { class: ".label-sm", size: "text-xs (12px)", weight: "520", usage: "Small label / UI" },
  { class: ".form-label", size: "text-sm (14px)", weight: "420", usage: "Form field label (muted)" },
  { class: ".form-control", size: "text-sm (14px)", weight: "420", usage: "Form input value" },
  { class: ".form-data", size: "text-sm (14px)", weight: "520", usage: "Form displayed data" },
  { class: ".data-lg", size: "text-3xl (30px)", weight: "660", usage: "Hero metric" },
  { class: ".data-md", size: "text-xl (20px)", weight: "660", usage: "Metric value" },
  { class: ".data-sm", size: "text-base (16px)", weight: "660", usage: "Compact metric value" },
]

/* ─────────────────────────────────────────────
 * PAGE
 * ───────────────────────────────────────────── */

export default function TypographyTokensPage() {
  return (
    <div className="space-y-12">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="h1">Typography</h1>
        <p className="p-lg text-muted-foreground">
          Type system utilities and font configuration — classes, weights, OpenType features, and character variants.
        </p>
      </div>

      {/* ═══════════════════════════════════════
       * 1. TYPOGRAPHY
       * ═══════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Typography</CardTitle>
          <CardDescription className="p">
            Utility classes for the type system. Font: Inter variable.
            Feature settings: tnum, dlig, frac, ccmp, ss03, cv01–cv05, cv08, cv09, cv11–cv13. calt off.
            Font optical sizing: auto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Live preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card level={2}>
              <CardContent className="space-y-3">
                <div className="label-sm text-muted-foreground">Headings</div>
                <div className="h1">h1 — 24px / 620</div>
                <div className="h2">h2 — 16px / 620</div>
                <div className="h3">h3 — 14px / 620</div>
                <div className="h4">h4 — 12px / 620</div>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-3">
                <div className="label-sm text-muted-foreground">Body</div>
                <p className="p-lg">p-lg — 16px / 420</p>
                <p className="p">p — 14px / 420</p>
                <p className="p-sm">p-sm — 12px / 420</p>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-3">
                <div className="label-sm text-muted-foreground">Labels</div>
                <div className="label-lg">label-lg — 16px / 520</div>
                <div className="label-md">label-md — 14px / 520</div>
                <div className="label-sm">label-sm — 12px / 520</div>
              </CardContent>
            </Card>
            <Card level={2}>
              <CardContent className="space-y-3">
                <div className="label-sm text-muted-foreground">Data</div>
                <div className="data-lg">data-lg — 30px / 660</div>
                <div className="data-md">data-md — 20px / 660</div>
                <div className="data-sm">data-sm — 16px / 660</div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead size="sm" className="text-muted-foreground">Class</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Size</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Weight</TableHead>
                <TableHead size="sm" className="text-muted-foreground">Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typographyTokens.map((t) => (
                <TableRow key={t.class}>
                  <TableCell><code className="p-sm font-mono">{t.class}</code></TableCell>
                  <TableCell><span className="p-sm">{t.size}</span></TableCell>
                  <TableCell><span className="p-sm">{t.weight}</span></TableCell>
                  <TableCell><span className="p-sm text-muted-foreground">{t.usage}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════
       * 2. FONT SETTINGS
       * ═══════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Font Configuration</CardTitle>
          <CardDescription className="p">
            Inter variable — our primary typeface. We use Inter with a deliberately curated set of
            OpenType features for data clarity, character disambiguation, and brand personality.
            Inter has become ubiquitous in AI tools, which has given it an association with "AI slop."
            By using custom values on the weight axis and customizing the features—such as enabling
            specific character variants and stylistic sets—we preserve Inter&apos;s clarity and
            approachability while establishing our own typographic identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">

          {/* Base metadata */}
          <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
            <span className="p-sm text-muted-foreground">Family</span>
            <span className="p-sm">Inter (variable)</span>
            <span className="p-sm text-muted-foreground">Base weight</span>
            <span className="p-sm">420</span>
            <span className="p-sm text-muted-foreground">Optical sizing</span>
            <span className="p-sm">auto</span>
            <span className="p-sm text-muted-foreground">calt</span>
            <span className="p-sm text-muted-foreground">off — contextual alternates disabled to prevent unintended substitutions in UI text</span>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* NUMBERS & DATA */}
          <div className="space-y-4">
            <div>
              <p className="label-md">Numbers &amp; Data</p>
              <p className="p-sm text-muted-foreground mt-0.5">Alternate digit forms and numeric layout features that reduce ambiguity and improve precision in data-heavy UI.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">

              {/* tnum */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6">
                    <div>
                      <div style={{ fontFeatureSettings: '"tnum" 0', fontSize: 28, lineHeight: 1.4 }}>
                        <div>1111</div>
                        <div>8888</div>
                      </div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground self-center">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"tnum" 1', fontSize: 28, lineHeight: 1.4 }}>
                        <div>1111</div>
                        <div>8888</div>
                      </div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">tnum</code>
                    <span className="label-sm">Tabular Numbers</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Every digit takes the same horizontal space. Numbers in tables and dashboards stay perfectly column-aligned — essential for any product where users scan and compare numeric data.</p>
                </CardContent>
              </Card>

              {/* cv01 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv01" 0', fontSize: 48, lineHeight: 1 }}>1</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv01" 1', fontSize: 48, lineHeight: 1 }}>1</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv01</code>
                    <span className="label-sm">Alternate One</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Adds a horizontal serif foot to the digit 1, clearly distinguishing it from lowercase l and capital I. In codes, IDs, and alphanumeric strings, this single change eliminates the most common misread in sans-serif type.</p>
                </CardContent>
              </Card>

              {/* cv09 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv09" 0', fontSize: 48, lineHeight: 1 }}>3</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv09" 1', fontSize: 48, lineHeight: 1 }}>3</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv09</code>
                    <span className="label-sm">Flat-top Three</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Replaces the curved top of 3 with a flat horizontal stroke. In data-dense UI, the flat top reads more crisply and reduces split-second confusion with 8 — especially at small label and table cell sizes.</p>
                </CardContent>
              </Card>

              {/* cv02 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv02" 0', fontSize: 48, lineHeight: 1 }}>4</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv02" 1', fontSize: 48, lineHeight: 1 }}>4</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv02</code>
                    <span className="label-sm">Open Four</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Opens the enclosed counter of the 4, giving the numeral a more open aperture. Significantly more legible at small sizes — axis labels, table cells, footnotes — where the default closed form can look like a filled shape.</p>
                </CardContent>
              </Card>

              {/* cv03 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv03" 0', fontSize: 48, lineHeight: 1 }}>6</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv03" 1', fontSize: 48, lineHeight: 1 }}>6</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv03</code>
                    <span className="label-sm">Open Six</span>
                  </div>
                  <p className="p-sm text-muted-foreground">A more open aperture at the top of 6. The humanist form reads comfortably at every scale — from a 12px table cell to a 48px hero metric — without ambiguity with 0 or 8.</p>
                </CardContent>
              </Card>

              {/* cv04 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv04" 0', fontSize: 48, lineHeight: 1 }}>9</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv04" 1', fontSize: 48, lineHeight: 1 }}>9</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv04</code>
                    <span className="label-sm">Open Nine</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Mirrors the open six with a wider aperture at the bottom of 9. The two variants form a matched pair — consistent visual rhythm across the digit set, and faster recognition in dense numeric sequences.</p>
                </CardContent>
              </Card>

              {/* frac */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"frac" 0', fontSize: 40, lineHeight: 1 }}>1/4</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"frac" 1', fontSize: 40, lineHeight: 1 }}>1/4</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">frac</code>
                    <span className="label-sm">Fractions</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Automatically typesets number/slash/number sequences as proper fractions. Elevates measurements, ratios, and data annotations from crude slash-separated text to precise, professional typographic values.</p>
                </CardContent>
              </Card>

            </div>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* DISAMBIGUATION */}
          <div className="space-y-4">
            <div>
              <p className="label-md">Disambiguation</p>
              <p className="p-sm text-muted-foreground mt-0.5">Alternate letterforms that solve the I/l/1 problem — the most persistent legibility failure in sans-serif typefaces.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* cv08 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv08" 0', fontSize: 48, lineHeight: 1, letterSpacing: "0.05em" }}>I l 1</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv08" 1', fontSize: 48, lineHeight: 1, letterSpacing: "0.05em" }}>I l 1</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv08</code>
                    <span className="label-sm">Capital I with Serifs</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Serifs on uppercase I immediately set it apart from lowercase l and digit 1. In a product where users read serial numbers, handles, codes, and keys, this isn&apos;t a stylistic choice — it&apos;s a safety feature.</p>
                </CardContent>
              </Card>

              {/* cv05 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv05" 0', fontSize: 48, lineHeight: 1, letterSpacing: "0.05em" }}>l I 1</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv05" 1', fontSize: 48, lineHeight: 1, letterSpacing: "0.05em" }}>l I 1</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv05</code>
                    <span className="label-sm">Lowercase l with Tail</span>
                  </div>
                  <p className="p-sm text-muted-foreground">A curved upswing tail gives lowercase l a unique baseline anchor. Combined with cv08 (I with serifs) and cv01 (1 with foot), all three visually similar characters become individually distinct at every size.</p>
                </CardContent>
              </Card>

            </div>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* STYLE & PERSONALITY */}
          <div className="space-y-4">
            <div>
              <p className="label-md">Style &amp; Personality</p>
              <p className="p-sm text-muted-foreground mt-0.5">Letterform choices that shape tone — contemporary, approachable, and distinctly ours.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

              {/* cv11 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv11" 0', fontSize: 48, lineHeight: 1 }}>a</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv11" 1', fontSize: 48, lineHeight: 1 }}>a</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv11</code>
                    <span className="label-sm">Single-story a</span>
                  </div>
                  <p className="p-sm text-muted-foreground">The single-bowl a matches handwritten letterforms — open, friendly, modern. Where the double-story default reads formal and mechanical, the single-story form reads contemporary and human. One character shifts Inter&apos;s entire tone.</p>
                </CardContent>
              </Card>

              {/* cv12 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv12" 0', fontSize: 48, lineHeight: 1 }}>f</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv12" 1', fontSize: 48, lineHeight: 1 }}>f</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv12</code>
                    <span className="label-sm">Compact f</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Reduces the overhang of the f ascender, creating a cleaner silhouette in body text. A detail most readers won&apos;t consciously notice — but combined with cv13, it makes the overall text texture calmer and more even.</p>
                </CardContent>
              </Card>

              {/* cv13 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"cv13" 0', fontSize: 48, lineHeight: 1 }}>t</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"cv13" 1', fontSize: 48, lineHeight: 1 }}>t</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">cv13</code>
                    <span className="label-sm">Compact t</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Tightens the t crossbar, reducing visual noise at text sizes. Pairs with cv12 to create a consistent compact aesthetic across the most visually complex letterforms in the Latin alphabet.</p>
                </CardContent>
              </Card>

              {/* ss03 */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"ss03" 0', fontSize: 36, lineHeight: 1 }}>{"\u201CHi,\u201D"}</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"ss03" 1', fontSize: 36, lineHeight: 1 }}>{"\u201CHi,\u201D"}</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">ss03</code>
                    <span className="label-sm">Round Quotes &amp; Commas</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Replaces angular quotation marks and commas with softer, rounder forms. Adds warmth to UI copy, tooltips, empty states, and error messages — anywhere the product speaks directly to the user.</p>
                </CardContent>
              </Card>

            </div>
          </div>

          <div className="h-px bg-border-subtle" />

          {/* TYPOGRAPHIC POLISH */}
          <div className="space-y-4">
            <div>
              <p className="label-md">Typographic Polish</p>
              <p className="p-sm text-muted-foreground mt-0.5">Low-level rendering improvements for text texture, ligatures, and international support.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* dlig */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-6 items-end">
                    <div>
                      <div style={{ fontFeatureSettings: '"dlig" 0', fontSize: 40, lineHeight: 1, letterSpacing: "0.02em" }}>fi fl fj</div>
                      <div className="label-sm text-muted-foreground mt-1">default</div>
                    </div>
                    <div className="text-muted-foreground mb-2">&rarr;</div>
                    <div>
                      <div style={{ fontFeatureSettings: '"dlig" 1', fontSize: 40, lineHeight: 1, letterSpacing: "0.02em" }}>fi fl fj</div>
                      <div className="label-sm text-muted-foreground mt-1">active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">dlig</code>
                    <span className="label-sm">Discretionary Ligatures</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Merges fi, fl, and fj into single optimized glyphs — the f&apos;s hook no longer collides with the adjacent character. Creates a smoother, more cohesive text texture, most noticeable in headings and display sizes.</p>
                </CardContent>
              </Card>

              {/* ccmp */}
              <Card level={2}>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <div style={{ fontFeatureSettings: '"ccmp" 1', fontSize: 40, lineHeight: 1, letterSpacing: "0.05em" }}>&eacute; &uuml; &ntilde;</div>
                    <div className="label-sm text-muted-foreground mt-1">active</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="label-sm font-mono bg-muted px-1.5 py-0.5 rounded-sm">ccmp</code>
                    <span className="label-sm">Glyph Composition</span>
                  </div>
                  <p className="p-sm text-muted-foreground">Ensures composite glyphs — accented characters, diacritical marks — are rendered with precisely positioned components. Foundational for multilingual UI: without it, diacritics can collide or misalign across browsers and rendering contexts.</p>
                </CardContent>
              </Card>

            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
