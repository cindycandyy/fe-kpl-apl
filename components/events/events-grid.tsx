"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data
const events = [
  {
    id: "1",
    title: "Konser Musik Jazz Malam",
    description: "Nikmati malam yang penuh dengan alunan musik jazz dari musisi terbaik Indonesia",
    image: "/placeholder.svg?height=200&width=400",
    date: "2024-02-15",
    time: "19:00",
    location: "Jakarta Convention Center",
    category: "Konser",
    price: 150000,
    capacity: 500,
    sold: 320,
    organizer: "Jazz Indonesia",
  },
  {
    id: "2",
    title: "Workshop Digital Marketing",
    description: "Pelajari strategi digital marketing terkini untuk mengembangkan bisnis Anda",
    image: "/placeholder.svg?height=200&width=400",
    date: "2024-02-20",
    time: "09:00",
    location: "Bandung Creative Hub",
    category: "Workshop",
    price: 250000,
    capacity: 100,
    sold: 75,
    organizer: "Digital Academy",
  },
  {
    id: "3",
    title: "Seminar Teknologi AI",
    description: "Diskusi mendalam tentang perkembangan AI dan dampaknya terhadap industri",
    image: "/placeholder.svg?height=200&width=400",
    date: "2024-02-25",
    time: "13:00",
    location: "Surabaya Tech Center",
    category: "Seminar",
    price: 100000,
    capacity: 200,
    sold: 150,
    organizer: "Tech Community",
  },
  {
    id: "4",
    title: "Festival Kuliner Nusantara",
    description: "Jelajahi cita rasa kuliner tradisional dari berbagai daerah di Indonesia",
    image: "/placeholder.svg?height=200&width=400",
    date: "2024-03-01",
    time: "10:00",
    location: "Yogyakarta Cultural Park",
    category: "Festival",
    price: 50000,
    capacity: 1000,
    sold: 600,
    organizer: "Culinary Indonesia",
  },
]

export function EventsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
          </div>

          <CardHeader className="pb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(event.date).toLocaleDateString("id-ID", {
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
                {event.sold}/{event.capacity} tiket terjual
              </span>
            </div>

            <div className="pt-2">
              <p className="text-lg font-bold text-primary">Rp {event.price.toLocaleString("id-ID")}</p>
            </div>
          </CardContent>

          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/events/${event.id}`}>Lihat Detail</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
