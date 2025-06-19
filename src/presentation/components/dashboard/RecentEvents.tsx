"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Eye } from "lucide-react"
import type { Event } from "../../../domain/entities/Event"
import Link from "next/link"

interface RecentEventsProps {
  events: Event[]
}

export function RecentEvents({ events }: RecentEventsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Event Terbaru</CardTitle>
        <Button variant="outline" asChild>
          <Link href="/dashboard/events">Lihat Semua</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge variant={event.status === "active" ? "default" : "secondary"}>
                    {event.status === "active" ? "Aktif" : "Draft"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{event.date.toLocaleDateString("id-ID")}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span>
                    <Users className="w-4 h-4 inline mr-1" />
                    {event.sold}/{event.capacity}
                  </span>
                  <span>
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Rp {((event.sold * 150000) / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/events/${event.id}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
