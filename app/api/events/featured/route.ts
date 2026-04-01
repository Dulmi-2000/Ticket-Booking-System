import { NextResponse } from "next/server"
import { getFeaturedEvents } from "@/lib/api/events"

export async function GET() {
  try {
    const events = await getFeaturedEvents()
    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching featured events:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured events" },
      { status: 500 }
    )
  }
}
