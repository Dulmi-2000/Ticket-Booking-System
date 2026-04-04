import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { canCancelBooking } from "@/lib/api/bookings"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params
    const ok = await canCancelBooking(id, session.token)
    return NextResponse.json({ canCancel: ok })
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error checking cancel eligibility:", error)
    return NextResponse.json(
      { canCancel: false, error: "Failed to check cancellation" },
      { status: 500 }
    )
  }
}
