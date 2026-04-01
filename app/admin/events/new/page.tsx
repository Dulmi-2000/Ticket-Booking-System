import { EventForm } from "@/components/event-form"

export default function NewEventPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create Event</h1>
        <p className="mt-1 text-muted-foreground">
          Add a new event to your platform
        </p>
      </div>

      <EventForm />
    </div>
  )
}
