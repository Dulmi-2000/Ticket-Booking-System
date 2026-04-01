import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getAllBookings } from "@/lib/api/bookings"

export async function GET() {
  try {
    await requireAdmin()

    const bookings = await getAllBookings()

    return NextResponse.json({ bookings })
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    console.error("Error fetching admin bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
