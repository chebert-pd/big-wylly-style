// A shadow of the DS MetricPanel — same three core props (title, subtitle,
// items) with a product-prefixed local name (no name overlap with the DS
// component, so the match must come from prop-signature similarity alone).

interface LifetimeMetricsProps {
  title: string
  subtitle?: string
  items: Array<{ label: string; value: string }>
}

export function LifetimeMetrics(props: LifetimeMetricsProps) {
  void props
  return null
}
