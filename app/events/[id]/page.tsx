import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventDetail } from "@/components/event-detail"
import { getEventById } from "@/lib/api/events"

interface EventPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EventPageProps) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    return {
      title: "Event Not Found - EventTix",
    }
  }

  return {
    title: `${event.title} - EventTix`,
    description: event.description,
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <EventDetail event={event} />
      </main>
      <Footer />
    </div>
  )
}
