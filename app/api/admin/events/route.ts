import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getAllEventsAdmin } from "@/lib/api/events"

export async function GET() {
  try {
    const { token } = await requireAdmin()
    const events = await getAllEventsAdmin(token)
    return NextResponse.json({ events })
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    console.error("Error fetching admin events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}
