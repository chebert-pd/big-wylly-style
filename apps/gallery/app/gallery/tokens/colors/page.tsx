"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@wyllo/ui"
import { ContrastChecker } from "@/app/gallery/_components/contrast-checker"
import { WylloSymbol } from "@/app/gallery/_components/wyllo-symbol"

/* ─────────────────────────────────────────────
 * DATA
 * ───────────────────────────────────────────── */

type ColorEntry = {
  name: string
  oklch: string
  vsCard: number
  vsCardApca: number
  vsBg: number
  vsBgApca: number
  vsFoundation?: number
  vsFoundationApca?: number
}

const grayScale: ColorEntry[] = [
  { name: "gray-98", oklch: "oklch(0.9824 0.0013 288)", vsCard: 1.05, vsCardApca: 0, vsBg: 1.0, vsBgApca: 0 },
  { name: "gray-96", oklch: "oklch(0.9677 0.0027 288)", vsCard: 1.1, vsCardApca: 0, vsBg: 1.04, vsBgApca: 0 },
  { name: "gray-94", oklch: "oklch(0.9412 0.0053 288)", vsCard: 1.19, vsCardApca: 8.6, vsBg: 1.13, vsBgApca: 0 },
  { name: "gray-91", oklch: "oklch(0.9179 0.0094 288)", vsCard: 1.28, vsCardApca: 12.9, vsBg: 1.21, vsBgApca: 9.6 },
  { name: "gray-88", oklch: "oklch(0.8818 0.0123 288)", vsCard: 1.43, vsCardApca: 19.5, vsBg: 1.36, vsBgApca: 16.1 },
  { name: "gray-83", oklch: "oklch(0.8304 0.0138 288)", vsCard: 1.69, vsCardApca: 28.5, vsBg: 1.61, vsBgApca: 25.1 },
  { name: "gray-73", oklch: "oklch(0.7395 0.0214 288)", vsCard: 2.32, vsCardApca: 43.4, vsBg: 2.21, vsBgApca: 40.1 },
  { name: "gray-64", oklch: "oklch(0.6498 0.0281 288)", vsCard: 3.26, vsCardApca: 57.0, vsBg: 3.1, vsBgApca: 53.6 },
  { name: "gray-55", oklch: "oklch(0.5557 0.0308 288)", vsCard: 4.77, vsCardApca: 69.8, vsBg: 4.54, vsBgApca: 66.4 },
  { name: "gray-48", oklch: "oklch(0.4815 0.0269 288)", vsCard: 6.54, vsCardApca: 78.8, vsBg: 6.22, vsBgApca: 75.4 },
  { name: "gray-43", oklch: "oklch(0.4335 0.0244 288)", vsCard: 8.04, vsCardApca: 84.2, vsBg: 7.64, vsBgApca: 80.8 },
  { name: "gray-40", oklch: "oklch(0.4040 0.0229 288)", vsCard: 9.11, vsCardApca: 87.2, vsBg: 8.66, vsBgApca: 83.9 },
  { name: "gray-33", oklch: "oklch(0.3334 0.0192 288)", vsCard: 12.11, vsCardApca: 94.0, vsBg: 11.51, vsBgApca: 90.6 },
  { name: "gray-29", oklch: "oklch(0.2875 0.012 288)", vsCard: 14.27, vsCardApca: 97.8, vsBg: 13.56, vsBgApca: 94.5 },
  { name: "gray-26", oklch: "oklch(0.2625 0.011 288)", vsCard: 15.45, vsCardApca: 99.8, vsBg: 14.68, vsBgApca: 96.4 },
  { name: "gray-22", oklch: "oklch(0.2165 0.009 288)", vsCard: 17.48, vsCardApca: 103.0, vsBg: 16.61, vsBgApca: 99.6 },
  { name: "gray-19", oklch: "oklch(0.1975 0.008 288)", vsCard: 18.21, vsCardApca: 104.2, vsBg: 17.31, vsBgApca: 100.8 },
]

const violetScale: ColorEntry[] = [
  { name: "violet-99", oklch: "oklch(0.9867 0.012 298.61)", vsCard: 1.04, vsCardApca: 0, vsBg: 1.01, vsBgApca: 0, vsFoundation: 4.57, vsFoundationApca: -72.1 },
  { name: "violet-97", oklch: "oklch(0.9753 0.0136 299.8)", vsCard: 1.08, vsCardApca: 0, vsBg: 1.02, vsBgApca: 0, vsFoundation: 4.43, vsFoundationApca: -69.8 },
  { name: "violet-95", oklch: "oklch(0.9552 0.0245 298.61)", vsCard: 1.15, vsCardApca: 0, vsBg: 1.09, vsBgApca: 0, vsFoundation: 4.16, vsFoundationApca: -65.5 },
  { name: "violet-89", oklch: "oklch(0.8943 0.058 296.12)", vsCard: 1.39, vsCardApca: 17.9, vsBg: 1.32, vsBgApca: 14.5, vsFoundation: 3.43, vsFoundationApca: -53.0 },
  { name: "violet-80", oklch: "oklch(0.8099 0.1073 295.38)", vsCard: 1.86, vsCardApca: 33.2, vsBg: 1.77, vsBgApca: 29.9, vsFoundation: 2.56, vsFoundationApca: -36.7 },
  { name: "violet-72", oklch: "oklch(0.7247 0.1585 293.67)", vsCard: 2.56, vsCardApca: 47.7, vsBg: 2.44, vsBgApca: 44.3, vsFoundation: 1.86, vsFoundationApca: -21.7 },
  { name: "violet-64", oklch: "oklch(0.6478 0.204954 291.1021)", vsCard: 3.52, vsCardApca: 59.8, vsBg: 3.35, vsBgApca: 56.5, vsFoundation: 1.35, vsFoundationApca: -9.3 },
  { name: "violet-58", oklch: "oklch(0.5803 0.2448 287.66)", vsCard: 4.77, vsCardApca: 69.7, vsBg: 4.53, vsBgApca: 66.4, vsFoundation: 1.0, vsFoundationApca: 0 },
  { name: "violet-51", oklch: "oklch(0.5165 0.2153 288)", vsCard: 6.17, vsCardApca: 77.2, vsBg: 5.86, vsBgApca: 73.8, vsFoundation: 1.29, vsFoundationApca: 0 },
  { name: "violet-45", oklch: "oklch(0.4538 0.1861 288)", vsCard: 7.96, vsCardApca: 83.9, vsBg: 7.57, vsBgApca: 80.6, vsFoundation: 1.67, vsFoundationApca: 12.2 },
  { name: "violet-39", oklch: "oklch(0.39 0.1556 288.5)", vsCard: 10.27, vsCardApca: 90.1, vsBg: 9.76, vsBgApca: 86.7, vsFoundation: 2.15, vsFoundationApca: 18.4 },
  { name: "violet-33", oklch: "oklch(0.3342 0.1287 288.4)", vsCard: 12.63, vsCardApca: 95.0, vsBg: 12.01, vsBgApca: 91.6, vsFoundation: 2.65, vsFoundationApca: 23.3 },
  { name: "violet-20", oklch: "oklch(0.2099 0.1211 288)", vsCard: 18.31, vsCardApca: 104.4, vsBg: 17.41, vsBgApca: 101.0, vsFoundation: 3.84, vsFoundationApca: 32.7 },
]

const orangeScale: ColorEntry[] = [
  { name: "orange-96", oklch: "oklch(0.9643 0.02105 56.1325)", vsCard: 1.11, vsCardApca: 0, vsBg: 1.06, vsBgApca: 0, vsFoundation: 2.64, vsFoundationApca: -50.6 },
  { name: "orange-91", oklch: "oklch(0.9133 0.0523 54.89)", vsCard: 1.31, vsCardApca: 14.3, vsBg: 1.24, vsBgApca: 11.0, vsFoundation: 2.25, vsFoundationApca: -39.9 },
  { name: "orange-84", oklch: "oklch(0.849 0.095869 54.721)", vsCard: 1.62, vsCardApca: 26.3, vsBg: 1.54, vsBgApca: 23.0, vsFoundation: 1.81, vsFoundationApca: -27.1 },
  { name: "orange-78", oklch: "oklch(0.7879 0.14 53.34)", vsCard: 2.02, vsCardApca: 37.3, vsBg: 1.92, vsBgApca: 33.9, vsFoundation: 1.45, vsFoundationApca: -15.6 },
  { name: "orange-73", oklch: "oklch(0.7365 0.1768 49.65)", vsCard: 2.48, vsCardApca: 46.2, vsBg: 2.35, vsBgApca: 42.8, vsFoundation: 1.19, vsFoundationApca: 0 },
  { name: "orange-69", oklch: "oklch(0.6958 0.204259 43.491)", vsCard: 2.94, vsCardApca: 53.1, vsBg: 2.79, vsBgApca: 49.7, vsFoundation: 1.0, vsFoundationApca: 0 },
  { name: "orange-61", oklch: "oklch(0.6178 0.1797 44)", vsCard: 3.95, vsCardApca: 63.7, vsBg: 3.76, vsBgApca: 60.4, vsFoundation: 1.35, vsFoundationApca: 8.7 },
  { name: "orange-54", oklch: "oklch(0.5405 0.1563 44.33)", vsCard: 5.4, vsCardApca: 73.4, vsBg: 5.13, vsBgApca: 70.1, vsFoundation: 1.84, vsFoundationApca: 18.4 },
  { name: "orange-46", oklch: "oklch(0.4618 0.1312 45.37)", vsCard: 7.48, vsCardApca: 82.3, vsBg: 7.11, vsBgApca: 79.0, vsFoundation: 2.55, vsFoundationApca: 27.2 },
  { name: "orange-39", oklch: "oklch(0.3932 0.1096 46.5)", vsCard: 9.91, vsCardApca: 89.2, vsBg: 9.41, vsBgApca: 85.9, vsFoundation: 3.37, vsFoundationApca: 34.2 },
]

const pinkScale: ColorEntry[] = [
  { name: "pink-97", oklch: "oklch(0.9682 0.0254 325.61)", vsCard: 1.11, vsCardApca: 0, vsBg: 1.05, vsBgApca: 0, vsFoundation: 2.43, vsFoundationApca: -47.4 },
  { name: "pink-92", oklch: "oklch(0.9245 0.0643 325.21)", vsCard: 1.28, vsCardApca: 13.0, vsBg: 1.21, vsBgApca: 9.6, vsFoundation: 2.10, vsFoundationApca: -37.7 },
  { name: "pink-87", oklch: "oklch(0.8674 0.1148 325.99)", vsCard: 1.56, vsCardApca: 24.3, vsBg: 1.48, vsBgApca: 20.9, vsFoundation: 1.72, vsFoundationApca: -25.6 },
  { name: "pink-81", oklch: "oklch(0.8120 0.1688 326.26)", vsCard: 1.92, vsCardApca: 34.9, vsBg: 1.83, vsBgApca: 31.5, vsFoundation: 1.40, vsFoundationApca: -14.4 },
  { name: "pink-77", oklch: "oklch(0.7674 0.2166 326.83)", vsCard: 2.31, vsCardApca: 43.2, vsBg: 2.19, vsBgApca: 39.8, vsFoundation: 1.17, vsFoundationApca: 0 },
  { name: "pink-73", oklch: "oklch(0.7315 0.2546 327.00)", vsCard: 2.69, vsCardApca: 49.6, vsBg: 2.55, vsBgApca: 46.2, vsFoundation: 1.0, vsFoundationApca: 0 },
  { name: "pink-65", oklch: "oklch(0.6483 0.2241 326.86)", vsCard: 3.65, vsCardApca: 61.1, vsBg: 3.47, vsBgApca: 57.7, vsFoundation: 1.36, vsFoundationApca: 9.5 },
  { name: "pink-57", oklch: "oklch(0.5688 0.1945 327.03)", vsCard: 4.98, vsCardApca: 71.1, vsBg: 4.74, vsBgApca: 67.7, vsFoundation: 1.85, vsFoundationApca: 19.5 },
  { name: "pink-48", oklch: "oklch(0.4849 0.1631 326.83)", vsCard: 7.01, vsCardApca: 80.6, vsBg: 6.66, vsBgApca: 77.3, vsFoundation: 2.61, vsFoundationApca: 29.0 },
  { name: "pink-41", oklch: "oklch(0.4118 0.1353 327.12)", vsCard: 9.43, vsCardApca: 88.1, vsBg: 8.96, vsBgApca: 84.7, vsFoundation: 3.51, vsFoundationApca: 36.5 },
]

const cyanScale: ColorEntry[] = [
  { name: "cyan-97", oklch: "oklch(0.9733 0.0144 213.36)", vsCard: 1.08, vsCardApca: 0, vsBg: 1.02, vsBgApca: 0, vsFoundation: 1.86, vsFoundationApca: -35.8 },
  { name: "cyan-94", oklch: "oklch(0.9393 0.0353 209.92)", vsCard: 1.18, vsCardApca: 8.2, vsBg: 1.12, vsBgApca: 0, vsFoundation: 1.69, vsFoundationApca: -29.3 },
  { name: "cyan-89", oklch: "oklch(0.8920 0.0607 210.60)", vsCard: 1.36, vsCardApca: 16.4, vsBg: 1.29, vsBgApca: 13.1, vsFoundation: 1.48, vsFoundationApca: -20.5 },
  { name: "cyan-85", oklch: "oklch(0.8461 0.0853 210.91)", vsCard: 1.56, vsCardApca: 24.2, vsBg: 1.48, vsBgApca: 20.8, vsFoundation: 1.29, vsFoundationApca: -12.2 },
  { name: "cyan-80", oklch: "oklch(0.8042 0.1044 211.93)", vsCard: 1.78, vsCardApca: 31.1, vsBg: 1.69, vsBgApca: 27.7, vsFoundation: 1.13, vsFoundationApca: 0 },
  { name: "cyan-77", oklch: "oklch(0.7689 0.1180 213.51)", vsCard: 2.0, vsCardApca: 36.8, vsBg: 1.90, vsBgApca: 33.4, vsFoundation: 1.0, vsFoundationApca: 0 },
  { name: "cyan-68", oklch: "oklch(0.6811 0.1039 213.35)", vsCard: 2.77, vsCardApca: 50.8, vsBg: 2.63, vsBgApca: 47.4, vsFoundation: 1.38, vsFoundationApca: 11.8 },
  { name: "cyan-60", oklch: "oklch(0.5969 0.0904 213.85)", vsCard: 3.87, vsCardApca: 63.0, vsBg: 3.67, vsBgApca: 59.6, vsFoundation: 1.93, vsFoundationApca: 24.1 },
  { name: "cyan-51", oklch: "oklch(0.5093 0.0759 213.46)", vsCard: 5.60, vsCardApca: 74.5, vsBg: 5.32, vsBgApca: 71.1, vsFoundation: 2.79, vsFoundationApca: 35.5 },
  { name: "cyan-43", oklch: "oklch(0.4339 0.0634 211.85)", vsCard: 7.77, vsCardApca: 83.3, vsBg: 7.38, vsBgApca: 79.9, vsFoundation: 3.88, vsFoundationApca: 44.4 },
]

const limeScale: ColorEntry[] = [
  { name: "lime-99", oklch: "oklch(0.9875 0.0211 115.53)", vsCard: 1.03, vsCardApca: 0, vsBg: 1.02, vsBgApca: 0, vsFoundation: 1.28, vsFoundationApca: -14.7 },
  { name: "lime-97", oklch: "oklch(0.9719 0.0527 116.63)", vsCard: 1.07, vsCardApca: 0, vsBg: 1.02, vsBgApca: 0, vsFoundation: 1.23, vsFoundationApca: -11.9 },
  { name: "lime-95", oklch: "oklch(0.9518 0.0932 117.19)", vsCard: 1.13, vsCardApca: 0, vsBg: 1.08, vsBgApca: 0, vsFoundation: 1.17, vsFoundationApca: -8.2 },
  { name: "lime-93", oklch: "oklch(0.9298 0.1318 117.90)", vsCard: 1.20, vsCardApca: 9.5, vsBg: 1.14, vsBgApca: 0, vsFoundation: 1.10, vsFoundationApca: 0 },
  { name: "lime-91", oklch: "oklch(0.9117 0.1644 119.15)", vsCard: 1.27, vsCardApca: 13.4, vsBg: 1.21, vsBgApca: 10.0, vsFoundation: 1.04, vsFoundationApca: 0 },
  { name: "lime-90", oklch: "oklch(0.8959 0.1882 120.17)", vsCard: 1.32, vsCardApca: 15.7, vsBg: 1.26, vsBgApca: 12.4, vsFoundation: 1.0, vsFoundationApca: 0 },
  { name: "lime-79", oklch: "oklch(0.7923 0.1655 120.11)", vsCard: 1.93, vsCardApca: 35.5, vsBg: 1.84, vsBgApca: 32.1, vsFoundation: 1.32, vsFoundationApca: 11.4 },
  { name: "lime-69", oklch: "oklch(0.6945 0.1438 119.86)", vsCard: 2.83, vsCardApca: 51.5, vsBg: 2.69, vsBgApca: 48.2, vsFoundation: 1.94, vsFoundationApca: 24.8 },
  { name: "lime-59", oklch: "oklch(0.5924 0.1216 120.00)", vsCard: 4.24, vsCardApca: 65.6, vsBg: 4.03, vsBgApca: 62.2, vsFoundation: 2.91, vsFoundationApca: 38.5 },
  { name: "lime-50", oklch: "oklch(0.4994 0.1004 119.94)", vsCard: 6.22, vsCardApca: 77.4, vsBg: 5.91, vsBgApca: 74.0, vsFoundation: 4.27, vsFoundationApca: 50.3 },
]

/* Brand foundation steps — the mid-tone "solid" anchor for each chromatic scale */
const brandFoundations: Record<string, string> = {
  violet: "violet-58",
  orange: "orange-69",
  pink: "pink-73",
  cyan: "cyan-77",
  lime: "lime-90",
}

/* ─────────────────────────────────────────────
 * SEMANTIC COLOR TOKENS
 * ───────────────────────────────────────────── */

const semanticColors: { section: string; tokens: { name: string; cssVar: string }[] }[] = [
  {
    section: "Surfaces",
    tokens: [
      { name: "background", cssVar: "--background" },
      { name: "foreground", cssVar: "--foreground" },
      { name: "card", cssVar: "--card" },
      { name: "card-foreground", cssVar: "--card-foreground" },
      { name: "popover", cssVar: "--popover" },
      { name: "popover-foreground", cssVar: "--popover-foreground" },
      { name: "secondary", cssVar: "--secondary" },
      { name: "secondary-foreground", cssVar: "--secondary-foreground" },
      { name: "muted", cssVar: "--muted" },
      { name: "muted-foreground", cssVar: "--muted-foreground" },
      { name: "accent", cssVar: "--accent" },
      { name: "accent-foreground", cssVar: "--accent-foreground" },
    ],
  },
  {
    section: "Interactive",
    tokens: [
      { name: "primary", cssVar: "--primary" },
      { name: "primary-foreground", cssVar: "--primary-foreground" },
      { name: "link", cssVar: "--link" },
      { name: "link-hover", cssVar: "--link-hover" },
    ],
  },
  {
    section: "Borders",
    tokens: [
      { name: "border", cssVar: "--border" },
      { name: "border-subtle", cssVar: "--border-subtle" },
      { name: "input", cssVar: "--input" },
      { name: "ring", cssVar: "--ring" },
    ],
  },
  {
    section: "Feedback",
    tokens: [
      { name: "success", cssVar: "--success" },
      { name: "success-border", cssVar: "--success-border" },
      { name: "success-foreground", cssVar: "--success-foreground" },
      { name: "warning", cssVar: "--warning" },
      { name: "warning-border", cssVar: "--warning-border" },
      { name: "warning-foreground", cssVar: "--warning-foreground" },
      { name: "destructive", cssVar: "--destructive" },
      { name: "destructive-border", cssVar: "--destructive-border" },
      { name: "destructive-foreground", cssVar: "--destructive-foreground" },
      { name: "destructive-solid", cssVar: "--destructive-solid" },
      { name: "destructive-solid-foreground", cssVar: "--destructive-solid-foreground" },
      { name: "info", cssVar: "--info" },
      { name: "info-border", cssVar: "--info-border" },
      { name: "info-foreground", cssVar: "--info-foreground" },
    ],
  },
  {
    section: "Domain",
    tokens: [
      { name: "brand", cssVar: "--brand" },
      { name: "brand-border", cssVar: "--brand-border" },
      { name: "brand-foreground", cssVar: "--brand-foreground" },
      { name: "brand-solid", cssVar: "--brand-solid" },
      { name: "brand-solid-foreground", cssVar: "--brand-solid-foreground" },
      { name: "review", cssVar: "--review" },
      { name: "review-border", cssVar: "--review-border" },
      { name: "review-foreground", cssVar: "--review-foreground" },
    ],
  },
  {
    section: "Charts",
    tokens: [
      { name: "chart-1", cssVar: "--chart-1" },
      { name: "chart-2", cssVar: "--chart-2" },
      { name: "chart-3", cssVar: "--chart-3" },
      { name: "chart-4", cssVar: "--chart-4" },
      { name: "chart-5", cssVar: "--chart-5" },
    ],
  },
  {
    section: "Sidebar",
    tokens: [
      { name: "sidebar", cssVar: "--sidebar" },
      { name: "sidebar-foreground", cssVar: "--sidebar-foreground" },
      { name: "sidebar-primary", cssVar: "--sidebar-primary" },
      { name: "sidebar-primary-foreground", cssVar: "--sidebar-primary-foreground" },
      { name: "sidebar-accent", cssVar: "--sidebar-accent" },
      { name: "sidebar-accent-foreground", cssVar: "--sidebar-accent-foreground" },
      { name: "sidebar-border", cssVar: "--sidebar-border" },
      { name: "sidebar-ring", cssVar: "--sidebar-ring" },
    ],
  },
]

/* ─────────────────────────────────────────────
 * HELPER: Swatch + PaletteGrid (IIFE)
 * ───────────────────────────────────────────── */

const { Swatch, PaletteGrid } = (() => {
  function contrastBadge(value: number, isApca: boolean) {
    if (isApca) {
      const abs = Math.abs(value)
      const color =
        abs >= 75 ? "text-success-foreground" :
        abs >= 60 ? "text-warning-foreground" :
        abs >= 45 ? "text-muted-foreground" :
        "text-destructive-foreground"
      return <span className={`tabular-nums ${color}`}>{value}</span>
    }
    const color =
      value >= 7 ? "text-success-foreground" :
      value >= 4.5 ? "text-success-foreground" :
      value >= 3 ? "text-warning-foreground" :
      "text-destructive-foreground"
    return <span className={`tabular-nums ${color}`}>{value}:1</span>
  }

  function Swatch({ entry, showFoundation, foundationName }: { entry: ColorEntry; showFoundation?: boolean; foundationName?: string }) {
    const isFoundation = foundationName === entry.name
    const lightness = parseInt(entry.name.split("-")[1])
    const isLight = lightness >= 65
    return (
      <div className="space-y-1">
        <div
          className={"relative h-10 w-full rounded-md border border-border-subtle" + (isFoundation ? " ring-2 ring-foreground ring-offset-2 ring-offset-background" : "")}
          style={{ backgroundColor: entry.oklch }}
        >
          {isFoundation && (
            <WylloSymbol
              className="absolute top-1 right-1 size-4 opacity-60"
              style={{ color: isLight ? "var(--gray-19)" : "var(--gray-98)" }}
            />
          )}
        </div>
        <div className="label-sm">{entry.name}</div>
        <div className="p-sm text-muted-foreground font-mono">{entry.oklch}</div>
        <div className="grid grid-cols-2 gap-x-2 text-[10px] leading-relaxed">
          <span className="text-muted-foreground">vs card</span>
          {contrastBadge(entry.vsCard, false)}
          <span className="text-muted-foreground">APCA card</span>
          {contrastBadge(entry.vsCardApca, true)}
          <span className="text-muted-foreground">vs bg</span>
          {contrastBadge(entry.vsBg, false)}
          <span className="text-muted-foreground">APCA bg</span>
          {contrastBadge(entry.vsBgApca, true)}
          {showFoundation && entry.vsFoundation != null && (
            <>
              <span className="text-muted-foreground">vs found.</span>
              {contrastBadge(entry.vsFoundation, false)}
              <span className="text-muted-foreground">APCA found.</span>
              {contrastBadge(entry.vsFoundationApca!, true)}
            </>
          )}
        </div>
      </div>
    )
  }

  function PaletteGrid({ label, entries, foundation }: { label: string; entries: ColorEntry[]; foundation?: string }) {
    return (
      <div className="space-y-3">
        <h3 className="label-lg">{label}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {entries.map((e) => (
            <Swatch key={e.name} entry={e} showFoundation={!!foundation} foundationName={foundation} />
          ))}
        </div>
      </div>
    )
  }

  return { Swatch, PaletteGrid }
})()

/* ─────────────────────────────────────────────
 * PAGE
 * ───────────────────────────────────────────── */

export default function ColorsPage() {
  /* Live-resolved CSS values for the semantic token table */
  const [liveValues, setLiveValues] = useState<Record<string, string>>({})

  useEffect(() => {
    function readTokens() {
      if (typeof window === "undefined") return
      const style = getComputedStyle(document.documentElement)
      const next: Record<string, string> = {}
      for (const section of semanticColors) {
        for (const token of section.tokens) {
          next[token.cssVar] = style.getPropertyValue(token.cssVar).trim()
        }
      }
      setLiveValues(next)
    }

    readTokens()

    // Re-read when the theme (class on <html>) changes
    const observer = new MutationObserver(() => {
      // Small delay so CSS variables settle after class toggle
      requestAnimationFrame(readTokens)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Also re-read on media-query changes (system theme)
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    mq.addEventListener("change", readTokens)

    return () => {
      observer.disconnect()
      mq.removeEventListener("change", readTokens)
    }
  }, [])

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Colors</h1>
        <p className="p-lg text-muted-foreground">Primitive palettes, semantic mappings, and a contrast checker tool.</p>
      </div>

      {/* ── Section: CONTRAST CHECKER ─────────────────────────────── */}
      <ContrastChecker />

      {/* ── Section: COLOR PRIMITIVES ──────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Color Primitives</CardTitle>
          <CardDescription className="p">
            OKLCH-based palettes named by perceptual lightness. Each swatch shows
            WCAG 2.x and APCA contrast against <code className="font-mono text-[0.85em]">card</code> and{" "}
            <code className="font-mono text-[0.85em]">background</code> surfaces.
            Chromatic scales also show contrast against their foundation step.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Legend */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-muted-foreground">
            <span><span className="text-success-foreground">green</span> = WCAG AA (4.5:1+) or APCA 75+</span>
            <span><span className="text-warning-foreground">amber</span> = WCAG AA-Large (3:1+) or APCA 60+</span>
            <span><span className="text-destructive-foreground">red</span> = below thresholds</span>
          </div>

          <PaletteGrid label="Gray" entries={grayScale} />
          <PaletteGrid label="Violet" entries={violetScale} foundation={brandFoundations.violet} />
          <PaletteGrid label="Orange" entries={orangeScale} foundation={brandFoundations.orange} />
          <PaletteGrid label="Pink" entries={pinkScale} foundation={brandFoundations.pink} />
          <PaletteGrid label="Cyan" entries={cyanScale} foundation={brandFoundations.cyan} />
          <PaletteGrid label="Lime" entries={limeScale} foundation={brandFoundations.lime} />
        </CardContent>
      </Card>

      {/* ── Section: SEMANTIC COLOR TOKENS ─────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Semantic Color Tokens</CardTitle>
          <CardDescription className="p">
            Resolved values update live when you toggle between light and dark mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {semanticColors.map((group) => (
            <div key={group.section} className="mb-6 last:mb-0">
              <h3 className="label-md mb-2">{group.section}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10" />
                    <TableHead>Token</TableHead>
                    <TableHead>CSS Variable</TableHead>
                    <TableHead>Live Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.tokens.map((token) => (
                    <TableRow key={token.cssVar}>
                      <TableCell>
                        <span
                          className="inline-block size-4 rounded-sm border border-border-subtle"
                          style={{ backgroundColor: `var(${token.cssVar})` }}
                        />
                      </TableCell>
                      <TableCell className="label-sm">{token.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{token.cssVar}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {liveValues[token.cssVar] || "\u2014"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
