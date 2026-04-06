"use client"

import { useEffect } from "react"

/**
 * Registers the smooth-corners Houdini paint worklet.
 * Works in Chromium-based browsers; silently no-ops elsewhere.
 */
export function SmoothCornersInit() {
  useEffect(() => {
    if (typeof CSS !== "undefined" && "paintWorklet" in CSS) {
      // @ts-expect-error — paintWorklet is not in the TS DOM types yet
      CSS.paintWorklet.addModule("/smooth-corners.js")
    }
  }, [])

  return null
}
