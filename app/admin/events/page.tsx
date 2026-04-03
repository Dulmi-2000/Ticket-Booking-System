"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Calendar, Ticket, Search, Clock, Sparkles } from "lucide-react"
import { toast } from "sonner"
import type { Event } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminEventsPage() {
  const { data, isLoading, mutate } = useSWR<{ events: Event[] }>(
    "/api/admin/events",
    fetcher
  )
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const { session } = await (await fetch("/api/auth/session")).json()
      const token = session?.token

      const res = await fetch(`/api/events/${deleteId}`, { 
        method: "DELETE",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      })
      if (!res.ok) throw new Error("Failed to delete event")

      toast.success("Event deleted successfully")
      mutate()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const events = data?.events || []
  const now = new Date()

  const formatCurrency = (cents: number) =>
    (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })

  const upcomingEvents = events.filter((event) => new Date(event.date) >= now)
  const pastEvents = events.filter((event) => new Date(event.date) < now)
  const featuredEvents = events.filter((event) => event.is_featured)

  const EventListingSkeleton = () => (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="h-44 w-full shrink-0 sm:h-auto sm:w-44 rounded-none" />
        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-5 w-2/3 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-1/4 rounded-md" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <Skeleton className="h-5 w-32 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const EmptyState = ({
    title,
    description,
    action,
  }: {
    title: string
    description: string
    action?: React.ReactNode
  }) => (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 px-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Calendar className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  )

  const renderEventList = (list: Event[]) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <EventListingSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (list.length === 0) {
      return (
        <EmptyState
          title="No Events Found"
          description="No events in this section yet. Create one to get started."
          action={
            <Button asChild className="rounded-xl gap-2">
              <Link href="/admin/events/new">
                <Plus className="h-4 w-4" />
                Create Event
              </Link>
            </Button>
          }
        />
      )
    }

    return (
      <div className="space-y-4">
        {list.map((event) => {
          const isPast = new Date(event.date) < now
          const soldOut = event.available_tickets === 0

          return (
            <Card
              key={event.id}
              className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                isPast ? "opacity-80" : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-44">
                    <Image
                      src={event.image_url || "/images/placeholder-event.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 176px"
                    />
                    <div className="absolute left-2 top-2">
                      <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground border border-border">
                        {event.category}
                      </span>
                    </div>
                    {soldOut && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                        <Badge variant="destructive">Sold Out</Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5 min-w-0">
                    <div>
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {event.is_featured && (
                            <Badge className="gap-1">
                              <Sparkles className="h-3 w-3" />
                              Featured
                            </Badge>
                          )}
                          {isPast ? (
                            <Badge variant="secondary">Past</Badge>
                          ) : soldOut ? (
                            <Badge variant="destructive">Sold Out</Badge>
                          ) : (
                            <Badge variant="outline">Active</Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </p>
                        <p className="line-clamp-1">
                          {event.venue}, {event.location}
                        </p>
                        <p>
                          {event.available_tickets}/{event.total_tickets} tickets available
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(event.price_cents)}
                      </span>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/events/${event.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteId(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="mt-1 text-muted-foreground">
            Manage event listings with user-style content preview
          </p>
        </div>
        <Button asChild className="gap-2 rounded-xl">
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "All Listings", value: events.length, icon: Search },
          { label: "Upcoming", value: upcomingEvents.length, icon: Calendar },
          { label: "Past", value: pastEvents.length, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-muted/60 px-4 py-3 text-center">
            <Icon className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 rounded-xl h-11 p-1 w-full">
          <TabsTrigger value="all" className="gap-2 rounded-lg">
            <Search className="h-4 w-4" />
            All ({events.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2 rounded-lg">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="featured" className="gap-2 rounded-lg">
            <Sparkles className="h-4 w-4" />
            Featured ({featuredEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderEventList(events)}</TabsContent>
        <TabsContent value="upcoming">{renderEventList(upcomingEvents)}</TabsContent>
        <TabsContent value="featured">{renderEventList(featuredEvents)}</TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event and all associated
              bookings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
