import { CreateEventForm } from "@/components/dashboard/create-event-form"
import { AppLayout } from "@/components/layout/app-layout"

export default function CreateEventPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Buat Event Baru</h1>
          <p className="text-muted-foreground">Isi detail event yang akan Anda selenggarakan</p>
        </div>
        <CreateEventForm />
      </div>
    </AppLayout>
  )
}
