import { defineConfig } from "tsup"
import { writeFileSync, readFileSync } from "fs"

const USE_CLIENT_BANNER = '"use client";\n'

export default defineConfig({
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
    // Peer dependencies — don't bundle these
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
    // Prepend "use client" directive — tsup's banner gets stripped by Rollup,
    // so we inject it after the build completes.
    for (const file of ["dist/index.js", "dist/index.cjs"]) {
      const content = readFileSync(file, "utf-8")
      if (!content.startsWith('"use client"')) {
        writeFileSync(file, USE_CLIENT_BANNER + content)
      }
    }
  },
})
