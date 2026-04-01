import { NextResponse } from "next/server"
import { getBookingsByUserId } from "@/lib/api/bookings"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await requireAuth()
    const bookings = await getBookingsByUserId(session.user.id, session.token)

    return NextResponse.json({ bookings })
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
