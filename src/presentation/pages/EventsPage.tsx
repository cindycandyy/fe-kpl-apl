"use client"

import { EventsFilter } from "../components/events/EventsFilter"
import { EventsGrid } from "../components/events/EventsGrid"
import { useEvents } from "../hooks/useEvents"

export function EventsPage() {
  const { events, loading, error, filters, updateFilters } = useEvents()

  const clearFilters = () => {
    updateFilters({
      search: undefined,
      category: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    })
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Jelajahi Event</h1>
        <p className="text-muted-foreground">
          Temukan event menarik di sekitar Anda - US-3: Lihat semua event yang tersedia
        </p>
      </div>

      {/* Filters */}
      <EventsFilter filters={filters} onFiltersChange={updateFilters} onClearFilters={clearFilters} />

      {/* Results */}
      <div>
        {!loading && events.length > 0 && (
          <p className="text-sm text-muted-foreground mb-4">Menampilkan {events.length} event</p>
        )}
        <EventsGrid events={events} loading={loading} />
      </div>
    </div>
  )
}
