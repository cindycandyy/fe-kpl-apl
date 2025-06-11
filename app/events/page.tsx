import { EventsGrid } from "@/components/events/events-grid"
import { EventsHeader } from "@/components/events/events-header"
import { AppLayout } from "@/components/layout/app-layout"

export default function EventsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <EventsHeader />
        <EventsGrid />
      </div>
    </AppLayout>
  )
}
