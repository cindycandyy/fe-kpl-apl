"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { EventCategory } from "../../../domain/entities/Event"
import type { EventFilters } from "../../../domain/repositories/EventRepository"

interface EventsFilterProps {
  filters: EventFilters
  onFiltersChange: (filters: Partial<EventFilters>) => void
  onClearFilters: () => void
}

export function EventsFilter({ filters, onFiltersChange, onClearFilters }: EventsFilterProps) {
  const hasActiveFilters = !!(filters.search || filters.category || filters.dateFrom || filters.dateTo)

  const handleDateFromChange = (date: string) => {
    onFiltersChange({ dateFrom: date ? new Date(date) : undefined })
  }

  const handleDateToChange = (date: string) => {
    onFiltersChange({ dateTo: date ? new Date(date) : undefined })
  }

  return (
    <div className="space-y-4">
      {/* Search and main filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari event berdasarkan nama, lokasi, atau deskripsi..."
            className="pl-10"
            value={filters.search || ""}
            onChange={(e) => onFiltersChange({ search: e.target.value || undefined })}
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
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value={EventCategory.KONSER}>🎵 Konser</SelectItem>
              <SelectItem value={EventCategory.SEMINAR}>🎓 Seminar</SelectItem>
              <SelectItem value={EventCategory.WORKSHOP}>🛠️ Workshop</SelectItem>
              <SelectItem value={EventCategory.EXHIBITION}>🎨 Pameran</SelectItem>
              <SelectItem value={EventCategory.FESTIVAL}>🎉 Festival</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Date filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Tanggal Mulai</label>
          <Input
            type="date"
            value={filters.dateFrom?.toISOString().split("T")[0] || ""}
            onChange={(e) => handleDateFromChange(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Tanggal Akhir</label>
          <Input
            type="date"
            value={filters.dateTo?.toISOString().split("T")[0] || ""}
            onChange={(e) => handleDateToChange(e.target.value)}
          />
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filter aktif:</span>

          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Pencarian: "{filters.search}"
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => onFiltersChange({ search: undefined })}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}

          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Kategori: {filters.category}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => onFiltersChange({ category: undefined })}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}

          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="gap-1">
              Tanggal: {filters.dateFrom?.toLocaleDateString("id-ID")} - {filters.dateTo?.toLocaleDateString("id-ID")}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => onFiltersChange({ dateFrom: undefined, dateTo: undefined })}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Hapus Semua Filter
          </Button>
        </div>
      )}
    </div>
  )
}
