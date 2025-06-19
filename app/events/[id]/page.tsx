import { EventDetail } from "@/src/presentation/components/events/EventDetail"

interface EventDetailPageProps {
  params: {
    id: string
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <EventDetail eventId={params.id} />
      </div>
    </div>
  )
}
