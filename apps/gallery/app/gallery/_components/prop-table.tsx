import { cn } from "@wyllo/ui"

export type PropRow = {
  prop: string
  type: string
  default?: string
  required?: boolean
  description: string
}

export function PropTable({
  title = "Props",
  rows,
}: {
  title?: string
  rows: PropRow[]
}) {
  const hasRequired = rows.some((r) => r.required)

  return (
    <section className="space-y-3">
      <h3 className="h3">{title}</h3>
      <div className="rounded-[var(--radius)] border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary border-b border-border">
              <th className="px-4 py-2.5 label-sm text-muted-foreground font-normal w-40">
                Prop
              </th>
              <th className="px-4 py-2.5 label-sm text-muted-foreground font-normal w-56">
                Type
              </th>
              <th className="px-4 py-2.5 label-sm text-muted-foreground font-normal w-28">
                Default
              </th>
              <th className="px-4 py-2.5 label-sm text-muted-foreground font-normal">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.prop}
                className={cn(
                  "border-b border-border-subtle last:border-0",
                  i % 2 === 1 && "bg-muted/20"
                )}
              >
                {/* Prop name */}
                <td className="px-4 py-3 align-top">
                  <code className="p-sm font-mono">
                    {row.prop}
                    {row.required && (
                      <span className="text-destructive-foreground ml-0.5">*</span>
                    )}
                  </code>
                </td>

                {/* Type */}
                <td className="px-4 py-3 align-top">
                  <code className="p-sm font-mono text-muted-foreground break-all">
                    {row.type}
                  </code>
                </td>

                {/* Default */}
                <td className="px-4 py-3 align-top">
                  {row.default ? (
                    <code className="p-sm font-mono text-muted-foreground">
                      {row.default}
                    </code>
                  ) : (
                    <span className="p-sm text-border">—</span>
                  )}
                </td>

                {/* Description */}
                <td className="px-4 py-3 align-top">
                  <p className="p-sm text-muted-foreground">{row.description}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasRequired && (
        <p className="p-sm text-muted-foreground">
          <span className="text-destructive-foreground font-mono">*</span> Required
        </p>
      )}
    </section>
  )
}
