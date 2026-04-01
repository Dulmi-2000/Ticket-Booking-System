import { NextRequest, NextResponse } from "next/server"
import {
  getAllEvents,
  searchEvents,
  getEventCategories,
} from "@/lib/api/events"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || undefined
    const category = searchParams.get("category") || undefined
    const dateFrom = searchParams.get("dateFrom") || undefined
    const dateTo = searchParams.get("dateTo") || undefined

    let events
    if (query || category || dateFrom || dateTo) {
      events = await searchEvents(query, category, dateFrom, dateTo)
    } else {
      events = await getAllEvents()
    }

    const categories = await getEventCategories()

    return NextResponse.json({ events, categories })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}
