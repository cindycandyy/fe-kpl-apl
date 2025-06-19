"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Event } from "../../../domain/entities/Event"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const availableTickets = event.capacity - event.sold
  const isAlmostSoldOut = availableTickets <= event.capacity * 0.1

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 left-2" variant="secondary">
          {event.category}
        </Badge>
        {isAlmostSoldOut && (
          <Badge className="absolute top-2 right-2" variant="destructive">
            <Star className="w-3 h-3 mr-1" />
            Hampir Habis
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {event.date.toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{event.time} WIB</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {availableTickets} tiket tersisa dari {event.capacity}
          </span>
        </div>

        {/* Progress bar for ticket sales */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Tiket Terjual</span>
            <span>{Math.round((event.sold / event.capacity) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${isAlmostSoldOut ? "bg-red-500" : "bg-primary"}`}
              style={{ width: `${(event.sold / event.capacity) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" disabled={availableTickets === 0}>
          <Link href={`/events/${event.id}`}>{availableTickets === 0 ? "Tiket Habis" : "Lihat Detail"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
