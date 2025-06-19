"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { EventCategory } from "../../../domain/entities/Event"
import type { EventFilters } from "../../../domain/repositories/EventRepository"

interface EventsHeaderProps {
  filters: EventFilters
  onFiltersChange: (filters: Partial<EventFilters>) => void
}

export function EventsHeader({ filters, onFiltersChange }: EventsHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Jelajahi Event</h1>
        <p className="text-muted-foreground">Temukan event menarik di sekitar Anda</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari event berdasarkan nama, lokasi, atau kategori..."
            className="pl-10"
            value={filters.search || ""}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.category || "all"}
            onValueChange={(value) =>
              onFiltersChange({ category: value === "all" ? undefined : (value as EventCategory) })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value={EventCategory.KONSER}>Konser</SelectItem>
              <SelectItem value={EventCategory.SEMINAR}>Seminar</SelectItem>
              <SelectItem value={EventCategory.WORKSHOP}>Workshop</SelectItem>
              <SelectItem value={EventCategory.EXHIBITION}>Pameran</SelectItem>
              <SelectItem value={EventCategory.FESTIVAL}>Festival</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
