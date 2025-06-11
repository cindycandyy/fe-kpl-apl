import { EventDetail } from "@/components/events/event-detail"
import { AppLayout } from "@/components/layout/app-layout"

interface EventDetailPageProps {
  params: {
    id: string
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <AppLayout>
      <EventDetail eventId={params.id} />
    </AppLayout>
  )
}
