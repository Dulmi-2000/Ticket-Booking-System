"use server"

import { getSession } from "@/lib/auth"
import { getEventById } from "@/lib/api/events"
import { createBooking } from "@/lib/api/bookings"

export async function startEventCheckoutSession(
  eventId: string,
  quantity: number
): Promise<string> {
  const session = await getSession()
  if (!session) {
    throw new Error("You must be logged in to purchase tickets")
  }

  const event = await getEventById(eventId)
  if (!event) {
    throw new Error("Event not found")
  }

  if (event.available_tickets < quantity) {
    throw new Error("Not enough tickets available")
  }

  const totalPriceCents = event.price_cents * quantity

  // Create booking via backend (tickets are decremented server-side)
  // The backend already sets status to "confirmed"
  const booking = await createBooking(
    {
      userId: session.user.id,
      eventId,
      quantity,
      totalPriceCents,
    },
    session.token
  )

  // Return the booking ID to the frontend to complete the mock flow
  return String(booking.id)
}
