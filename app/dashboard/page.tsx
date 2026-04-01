"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingCard } from "@/components/booking-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Ticket } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { BookingWithEvent } from "@/lib/types"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const router = useRouter()
  const { session, isLoading: authLoading } = useAuth()
  const { data, isLoading, mutate } = useSWR<{ bookings: BookingWithEvent[] }>(
    session ? "/api/bookings" : null,
    fetcher
  )

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login?redirect=/dashboard")
    }
  }, [session, authLoading, router])

  if (authLoading || !session) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="mb-8 h-10 w-48" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const bookings = data?.bookings || []
  const now = new Date()
  
  const upcomingBookings = bookings.filter(
    (b) => b.status !== "cancelled" && new Date(b.event.date) >= now
  )
  const pastBookings = bookings.filter(
    (b) => b.status !== "cancelled" && new Date(b.event.date) < now
  )
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
              <p className="mt-1 text-muted-foreground">
                Welcome back, {session.user.name}
              </p>
            </div>
            <Button asChild>
              <Link href="/events">
                <Ticket className="mr-2 h-4 w-4" />
                Browse Events
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={() => mutate()}
                  />
                ))
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    No Upcoming Events
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    You don&apos;t have any upcoming events booked yet.
                  </p>
                  <Button asChild>
                    <Link href="/events">Explore Events</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">
                    No past events to show.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {cancelledBookings.length > 0 ? (
                cancelledBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">
                    No cancelled bookings.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
