import { defineConfig } from "tsup"
import { writeFileSync, readFileSync, chmodSync, readdirSync } from "fs"
import { join } from "path"

const USE_CLIENT_BANNER = '"use client";\n'

const componentEntries = readdirSync("src/components")
  .filter((f) => f.endsWith(".tsx"))
  .reduce<Record<string, string>>((acc, f) => {
    acc[f.replace(/\.tsx$/, "")] = `src/components/${f}`
    return acc
  }, {})

function* walkDist(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "cli") continue
      yield* walkDist(path)
    } else {
      yield path
    }
  }
}

export default defineConfig([
  {
    name: "lib",
    entry: {
      index: "src/index.ts",
      ...componentEntries,
      "hooks/use-media-query": "src/hooks/use-media-query.ts",
      "lib/utils": "src/lib/utils.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: true,
    treeshake: true,
    external: [
      "react",
      "react-dom",
      "next",
      "radix-ui",
      "@radix-ui/react-accordion",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-tabs",
      "@base-ui/react",
      "@tanstack/react-table",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
      "recharts",
      "react-day-picker",
      "date-fns",
      "vaul",
      "sonner",
      "cmdk",
      "input-otp",
      "react-resizable-panels",
      "react-hook-form",
    ],
    async onSuccess() {
      for (const file of walkDist("dist")) {
        if (!file.endsWith(".js") && !file.endsWith(".cjs")) continue
        const content = readFileSync(file, "utf-8")
        if (!content.startsWith('"use client"')) {
          writeFileSync(file, USE_CLIENT_BANNER + content)
        }
      }
    },
  },
  {
    name: "cli",
    entry: { "cli/audit-governance": "src/cli/audit-governance.ts" },
    format: ["esm"],
    outExtension: () => ({ js: ".js" }),
    dts: false,
    sourcemap: false,
    clean: false,
    splitting: false,
    treeshake: true,
    target: "node20",
    platform: "node",
    async onSuccess() {
      try {
        chmodSync("dist/cli/audit-governance.js", 0o755)
      } catch {}
    },
  },
])
