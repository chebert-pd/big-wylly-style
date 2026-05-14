// TEST: Slack alert verification — this page deliberately violates PL-003
// to confirm the notify-slack job fires after the jq parens fix in #126.
// PR is closed without merging once the Slack message lands.
import { Button } from "@chebert-pd/ui"

export default function TestSlackAlertPage() {
  return (
    <div className="p-8">
      <div className="text-blue-500">slack alert test</div>
      <Button>Trigger</Button>
    </div>
  )
}
