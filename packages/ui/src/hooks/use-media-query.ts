"use client"

import { useState, useEffect } from "react"

/**
 * Returns true if the given CSS media query currently matches.
 * Starts as false on the server and updates after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    const result = window.matchMedia(query)
    result.addEventListener("change", onChange)
    setMatches(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return matches
}
