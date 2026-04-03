import { NextRequest, NextResponse } from "next/server"
import {
  getAllEvents,
  searchEvents,
  getEventCategories,
  createEvent,
} from "@/lib/api/events"
import { requireAdmin } from "@/lib/auth"

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

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await request.json()

    const event = await createEvent(
      {
        title: String(body.title ?? ""),
        description: String(body.description ?? ""),
        venue: String(body.venue ?? ""),
        location: String(body.location ?? ""),
        date: String(body.date ?? ""),
        time: String(body.time ?? ""),
        priceCents: Number(body.priceCents),
        totalTickets: Number(body.totalTickets),
        imageUrl: String(body.imageUrl ?? ""),
        category: String(body.category ?? ""),
        isFeatured: Boolean(body.isFeatured),
      },
      session.token
    )

    return NextResponse.json({ event })
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    console.error("Error creating event:", error)
    const message =
      error instanceof Error ? error.message : "Failed to create event"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
