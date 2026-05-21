// A shadow of the DS Header component with a renamed local identifier.
// Props chosen to maximize overlap with Header's distinctive prop set
// (back, badge, metadata, subsection are all Header-only in the DS).

interface HeaderPageProps {
  title: string
  back?: { label?: string; href?: string }
  actions?: unknown
  badge?: unknown
  metadata?: unknown
  subsection?: unknown
}

export function HeaderPage(props: HeaderPageProps) {
  // Returning null keeps the fixture parseable without needing React/JSX
  // resolution; the discover scanner only cares about the prop type, not
  // the implementation.
  void props
  return null
}
