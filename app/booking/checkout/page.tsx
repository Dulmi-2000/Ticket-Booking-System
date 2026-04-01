"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Checkout } from "@/components/checkout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, MapPin, Ticket } from "lucide-react"
import type { Event } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { session, isLoading: authLoading } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const eventId = searchParams.get("eventId")
  const quantity = parseInt(searchParams.get("quantity") || "1", 10)

  useEffect(() => {
    if (!authLoading && !session) {
      router.push(`/login?redirect=/events/${eventId}`)
      return
    }

    if (eventId) {
      fetch(`/api/events/${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          setEvent(data.event)
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
  }, [eventId, session, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <Skeleton className="mb-6 h-8 w-32" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (!event || !eventId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Event Not Found
          </h1>
          <Link href="/events" className="mt-4 text-primary hover:underline">
            Browse Events
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const totalPrice = ((event.price_cents * quantity) / 100).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  )

  const unitPrice = (event.price_cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        <Link
          href={`/events/${eventId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Checkout eventId={eventId} quantity={quantity} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={event.image_url || "/images/placeholder-event.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {event.title}
                    </h3>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {quantity} x {unitPrice}
                      </span>
                    </div>
                    <span>{totalPrice}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">{totalPrice}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  By completing this purchase, you agree to our terms of service
                  and refund policy. Cancellations are allowed up to 24 hours
                  before the event.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
