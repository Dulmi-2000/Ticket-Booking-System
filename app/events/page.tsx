import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventsList } from "@/components/events-list"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Browse Events - EventTix",
  description:
    "Discover concerts, sports, theater, and more. Find your next unforgettable experience.",
}

function EventsLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-40 w-full rounded-lg" />
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
    </div>
  )
}

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Browse Events
            </h1>
            <p className="mt-2 text-muted-foreground">
              Find your next unforgettable experience
            </p>
          </div>

          <Suspense fallback={<EventsLoading />}>
            <EventsList />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
