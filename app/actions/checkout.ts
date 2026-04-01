"use server"

import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
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
  const booking = await createBooking({
    userId: session.user.id,
    eventId,
    quantity,
    totalPriceCents,
    status: "pending",
  })

  const headersList = await headers()
  const origin = headersList.get("origin") || "http://localhost:3000"

  // Create Stripe Checkout Session
  const checkoutSession = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: event.title,
            description: `${quantity} ticket(s) for ${event.title}`,
          },
          unit_amount: event.price_cents,
        },
        quantity,
      },
    ],
    metadata: {
      bookingId: booking.id,
      eventId,
      userId: session.user.id,
      quantity: String(quantity),
    },
    return_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
  })

  if (!checkoutSession.client_secret) {
    throw new Error("Failed to create checkout session")
  }

  return checkoutSession.client_secret
}
