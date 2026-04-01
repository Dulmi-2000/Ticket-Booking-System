import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { requireAuth } from "@/lib/auth"
import { getEventById } from "@/lib/api/events"
import { createBooking } from "@/lib/api/bookings"

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { eventId, quantity } = await request.json()

    if (!eventId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Event ID and quantity are required" },
        { status: 400 }
      )
    }

    const event = await getEventById(eventId)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.available_tickets < quantity) {
      return NextResponse.json(
        { error: "Not enough tickets available" },
        { status: 400 }
      )
    }

    const totalPriceCents = event.price_cents * quantity

    // Create booking via backend
    const booking = await createBooking(
      {
        userId: session.user.id,
        eventId: eventId.toString(),
        quantity,
        totalPriceCents,
      },
      session.token
    )

    return NextResponse.json({
      clientSecret: "mock_secret_" + Math.random().toString(36).substring(7),
      bookingId: booking.id,
    })
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
