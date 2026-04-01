"use client"

import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { EventCard } from "@/components/event-card"
import { EventsSearch } from "@/components/events-search"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "lucide-react"
import type { Event } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function EventsList() {
  const searchParams = useSearchParams()
  const queryString = searchParams.toString()
  const url = queryString ? `/api/events?${queryString}` : "/api/events"

  const { data, isLoading, error } = useSWR<{
    events: Event[]
    categories: string[]
  }>(url, fetcher)

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">
          Unable to load events. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <>
      <EventsSearch categories={data?.categories || []} />

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[16/10] w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : data?.events && data.events.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            Showing {data.events.length} event
            {data.events.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            No Events Found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters or check back later for new
            events.
          </p>
        </div>
      )}
    </>
  )
}
