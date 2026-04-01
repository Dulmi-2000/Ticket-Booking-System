"use client"

import useSWR from "swr"
import Link from "next/link"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight } from "lucide-react"
import type { Event } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function FeaturedEvents() {
  const { data, isLoading, error } = useSWR<{ events: Event[] }>(
    "/api/events/featured",
    fetcher
  )

  if (error) {
    return null
  }

  if (!isLoading && (!data?.events || data.events.length === 0)) {
    return null
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Latest Events
            </h2>
            <p className="mt-2 text-muted-foreground">
              Don&apos;t miss out on these popular experiences
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden gap-2 md:flex">
            <Link href="/events">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : data?.events && data.events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No featured events available at the moment.
          </p>
        )}

        <div className="mt-8 text-center md:hidden">
          <Button asChild className="gap-2">
            <Link href="/events">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
