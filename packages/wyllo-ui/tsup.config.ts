import { defineConfig } from "tsup"
import { writeFileSync, readFileSync, chmodSync } from "fs"

const USE_CLIENT_BANNER = '"use client";\n'

export default defineConfig([
  {
    name: "lib",
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    // TODO: Enable DTS once pre-existing type errors in components are fixed.
    // Consumers should use `transpilePackages: ["@chebert-pd/ui"]` in the meantime.
    dts: false,
    sourcemap: true,
    clean: true,
    splitting: false,
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
    ],
    async onSuccess() {
      for (const file of ["dist/index.js", "dist/index.cjs"]) {
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
