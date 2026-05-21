// A low-overlap case — `columns` collides with DataTable but `orders` and
// `onSort` do not. The local name "OrdersTable" picks up a name-overlap
// bonus against DS Table (not DataTable), but the combined score stays
// well under the default 0.5 threshold and the candidate should be filtered
// out of the report.

interface OrdersTableProps {
  orders: unknown[]
  columns: unknown[]
  onSort?: (column: string) => void
}

export function OrdersTable(props: OrdersTableProps) {
  void props
  return null
}
