// After tsc emits .d.ts files mirroring the src/ tree, flatten the
// component declarations from `dist/components/<name>/<name>.d.ts` to
// `dist/<name>.d.ts` so they sit next to tsup's flat .js outputs and
// resolve correctly for both deep imports (@big-wylly-style/ui/button) and
// the wildcard `./*` exports entry. Also writes `.d.cts` companions
// for CJS consumers, since the exports field declares both formats.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const DIST = "dist"
const COMPONENTS = join(DIST, "components")

function copyIfExists(src, dest) {
  if (existsSync(src)) copyFileSync(src, dest)
}

if (existsSync(COMPONENTS)) {
  for (const folder of readdirSync(COMPONENTS)) {
    const folderPath = join(COMPONENTS, folder)
    if (!statSync(folderPath).isDirectory()) continue
    const dts = join(folderPath, `${folder}.d.ts`)
    const dtsMap = `${dts}.map`
    if (!existsSync(dts)) continue
    copyFileSync(dts, join(DIST, `${folder}.d.ts`))
    copyFileSync(dts, join(DIST, `${folder}.d.cts`))
    copyIfExists(dtsMap, join(DIST, `${folder}.d.ts.map`))
    copyIfExists(dtsMap, join(DIST, `${folder}.d.cts.map`))
  }
}

copyIfExists(join(DIST, "index.d.ts"), join(DIST, "index.d.cts"))
copyIfExists(join(DIST, "index.d.ts.map"), join(DIST, "index.d.cts.map"))
