"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, MapPin, Ticket, X } from "lucide-react"
import { toast } from "sonner"
import type { BookingWithEvent } from "@/lib/types"

interface BookingCardProps {
  booking: BookingWithEvent
  onCancel?: () => void
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false)

  const event = booking.event
  const isPast = new Date(event.date) < new Date()
  const hoursUntilEvent =
    (new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60)
  const canCancel =
    booking.status === "confirmed" && !isPast && hoursUntilEvent >= 24

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const totalPrice = (booking.total_price_cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: "POST",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to cancel booking")
      }

      toast.success("Booking cancelled successfully. Refund will be processed.")
      onCancel?.()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsCancelling(false)
    }
  }

  const statusVariant = {
    confirmed: "default" as const,
    pending: "secondary" as const,
    cancelled: "destructive" as const,
  }

  const statusLabel = {
    confirmed: "Confirmed",
    pending: "Pending Payment",
    cancelled: "Cancelled",
  }

  return (
    <Card className={`overflow-hidden ${isPast ? "opacity-75" : ""}`}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-32 w-full sm:h-auto sm:w-40 md:w-48">
            <Image
              src={event.image_url || "/images/placeholder-event.jpg"}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 200px"
            />
            {isPast && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Badge variant="secondary">Past Event</Badge>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <Link
                  href={`/events/${event.id}`}
                  className="text-lg font-semibold text-foreground hover:text-primary"
                >
                  {event.title}
                </Link>
                <Badge variant={statusVariant[booking.status]}>
                  {statusLabel[booking.status]}
                </Badge>
              </div>

              <div className="mb-3 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">
                    {event.venue}, {event.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
                  </span>
                </div>
                <span className="font-semibold text-foreground">
                  {totalPrice}
                </span>
              </div>

              {canCancel && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      disabled={isCancelling}
                    >
                      <X className="h-4 w-4" />
                      Cancel Booking
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this booking? A full
                        refund will be processed to your original payment
                        method. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancel}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isCancelling ? "Cancelling..." : "Cancel Booking"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
