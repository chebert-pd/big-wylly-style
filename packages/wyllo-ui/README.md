# @chebert-pd/ui

The Wyllo Design System — a production-grade component library built on shadcn/ui, Radix UI, and Tailwind CSS v4.

## Install

```bash
npm install @chebert-pd/ui
```

## Setup

Three things need to happen in your consuming app:

### 1. Add peer dependencies

The package expects these to already be in your app. Install any you don't have:

```bash
npm install react react-dom radix-ui class-variance-authority clsx tailwind-merge lucide-react
```

Optional (only needed if you use the components that require them):

| Package | Used by |
|---------|---------|
| `recharts` | Chart |
| `@tanstack/react-table` | DataTable |
| `react-day-picker` + `date-fns` | Calendar, DatePicker |
| `vaul` | Drawer |
| `@base-ui/react` | Combobox |

### 2. Configure Next.js

In your `next.config.ts`, add `@chebert-pd/ui` to `transpilePackages` so Next.js compiles it from source:

```ts
const nextConfig: NextConfig = {
  transpilePackages: ["@chebert-pd/ui"],
};
```

### 3. Set up CSS

This is the most important step. Two things go in your `globals.css`:

**a) Add a `@source` directive** so Tailwind can find the utility classes used inside the components:

```css
@source "../../node_modules/@chebert-pd/ui/src";
```

The exact path depends on where your `globals.css` lives relative to `node_modules`. Adjust accordingly.

**b) Import the design tokens and dark mode variant:**

```css
@custom-variant dark (&:is(.dark *));
@import "@chebert-pd/ui/globals.css";
```

This gives you all the color tokens, radius scale, elevation shadows, typography utilities, and dark mode definitions. Token updates ship automatically with new package versions.

### 4. Load the Inter font

The design system is built around [Inter](https://rsms.me/inter/). Load it however you prefer (next/font, CDN, self-hosted) and set the `--font-sans` CSS variable:

```tsx
// layout.tsx
import localFont from "next/font/local";

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-sans",
});

<html className={inter.variable}>
```

## Usage

Import components from `@chebert-pd/ui`:

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@chebert-pd/ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## What's included

- **41 components** — atoms, molecules, and organisms
- **Design tokens** — color scales (gray, violet, orange), semantic tokens, elevation, radius
- **Light and dark mode** — via `.dark` class on `<html>`
- **Typography utilities** — heading, paragraph, label, and data display classes
- **Metadata files** — structured `.metadata.json` for each component (useful for AI tooling and documentation)

## Publishing

Releases are automated via [Release Please](https://github.com/googleapis/release-please). Commits on `main` using [Conventional Commits](https://www.conventionalcommits.org/) format are aggregated into a release PR that bumps the version and updates `CHANGELOG.md`. Merging the release PR creates the tag and triggers the publish workflow.

To cut a release, merge the open `chore: release main` PR.
