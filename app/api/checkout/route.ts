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
    const booking = await createBooking({
      userId: session.user.id,
      eventId,
      quantity,
      totalPriceCents,
      status: "pending",
    })

    // Create Stripe Checkout Session
    const origin = request.headers.get("origin") || "http://localhost:3000"

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: event.title,
              description: `${quantity} ticket(s) for ${event.title} on ${new Date(event.date).toLocaleDateString()}`,
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
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/events/${eventId}?cancelled=true`,
    })

    return NextResponse.json({
      clientSecret: checkoutSession.client_secret,
      bookingId: booking.id,
    })
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
