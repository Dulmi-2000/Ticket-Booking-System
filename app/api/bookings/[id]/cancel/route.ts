import { NextRequest, NextResponse } from "next/server"
import {
  getBookingById,
  canCancelBooking,
  updateBookingStatus,
} from "@/lib/api/bookings"
import { requireAuth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params

    const booking = await getBookingById(id)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.user_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const canCancel = await canCancelBooking(id)
    if (!canCancel) {
      return NextResponse.json(
        {
          error:
            "Cannot cancel this booking. Cancellations must be made at least 24 hours before the event.",
        },
        { status: 400 }
      )
    }

    // Process refund if payment was made
    if (booking.stripe_payment_intent_id) {
      try {
        await stripe.refunds.create({
          payment_intent: booking.stripe_payment_intent_id,
        })
      } catch (refundError) {
        console.error("Refund failed:", refundError)
        return NextResponse.json(
          { error: "Failed to process refund" },
          { status: 500 }
        )
      }
    }

    // Cancel via backend API
    await updateBookingStatus(id, "cancelled")

    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error cancelling booking:", error)
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    )
  }
}
