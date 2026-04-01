"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Share2,
  ArrowLeft,
  Minus,
  Plus,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import type { Event } from "@/lib/types"

interface EventDetailProps {
  event: Event
}

export function EventDetail({ event }: EventDetailProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { session } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const wasCancelled = searchParams.get("cancelled") === "true"

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedPrice = (event.price_cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })

  const totalPrice = ((event.price_cents * quantity) / 100).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  )

  const isSoldOut = event.available_tickets === 0
  const isLowStock =
    event.available_tickets > 0 && event.available_tickets <= 50
  const maxQuantity = Math.min(event.available_tickets, 10)

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (!session) {
      router.push(`/login?redirect=/events/${event.id}`)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, quantity }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to start checkout")
      }

      const { bookingId } = await res.json()
      router.push(`/booking/checkout?bookingId=${bookingId}&eventId=${event.id}&quantity=${quantity}`)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: `Check out ${event.title} on EventTix!`,
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      {wasCancelled && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Payment was cancelled. No charges were made.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={event.image_url || "/images/placeholder-event.jpg"}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                {event.category}
              </Badge>
              {event.is_featured && (
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>

            <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>
                  {event.venue}, {event.location}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                About This Event
              </h2>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl">{formattedPrice}</CardTitle>
              <p className="text-sm text-muted-foreground">per ticket</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {isSoldOut ? (
                <div className="rounded-lg bg-destructive/10 p-4 text-center">
                  <Ticket className="mx-auto mb-2 h-8 w-8 text-destructive" />
                  <p className="font-semibold text-destructive">Sold Out</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This event is no longer available
                  </p>
                </div>
              ) : (
                <>
                  {isLowStock && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      Only {event.available_tickets} tickets left!
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Number of Tickets
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10)
                          if (val >= 1 && val <= maxQuantity) {
                            setQuantity(val)
                          }
                        }}
                        min={1}
                        max={maxQuantity}
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= maxQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Max {maxQuantity} tickets per order
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="mb-4 flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{totalPrice}</span>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Buy Tickets"}
                    </Button>
                  </div>
                </>
              )}

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share Event
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
