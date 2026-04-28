import { Button } from "@chebert-pd/ui"

export function Bad() {
  return (
    <div>
      <h1 className="text-muted-foreground">Heading</h1>
      <span className="font-medium">Named weight</span>
      <span className="text-blue-500">Tailwind palette</span>
      {/* govern:disable-next-line PL-003 -- demonstrating suppression */}
      <span className="text-red-500">Suppressed palette use</span>
      <Button>Click</Button>
    </div>
  )
}
