// A legitimate product composition — its single distinctive prop (`customer`)
// doesn't appear anywhere in the DS, so discover should produce no candidate
// for this file regardless of threshold.

interface CustomerHeadlineStatsProps {
  customer: { id: string; name: string }
}

export function CustomerHeadlineStats(props: CustomerHeadlineStatsProps) {
  void props
  return null
}
