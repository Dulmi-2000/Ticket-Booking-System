import { notFound } from "next/navigation"
import { EventForm } from "@/components/event-form"
import { getEventById } from "@/lib/api/events"

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
        <p className="mt-1 text-muted-foreground">
          Update event details and ticket availability
        </p>
      </div>

      <EventForm event={event} isEditing />
    </div>
  )
}
