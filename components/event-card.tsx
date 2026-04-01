import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Ticket } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/types"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const formattedPrice = (event.price_cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })

  const isSoldOut = event.available_tickets === 0
  const isLowStock = event.available_tickets > 0 && event.available_tickets <= 50

  return (
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 bg-card border-border hover:border-primary/50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.image_url || "/images/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {event.category}
          </Badge>
          {event.is_featured && (
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Badge variant="destructive" className="text-lg">
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground">
          {event.title}
        </h3>

        <div className="mb-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>
              {formattedDate} at {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{event.venue}, {event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">
              {formattedPrice}
            </span>
          </div>
          {isLowStock && !isSoldOut && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <Ticket className="h-4 w-4" />
              <span>Only {event.available_tickets} left</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full"
          disabled={isSoldOut}
          variant={isSoldOut ? "secondary" : "default"}
        >
          <Link href={`/events/${event.id}`}>
            {isSoldOut ? "View Details" : "Get Tickets"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
