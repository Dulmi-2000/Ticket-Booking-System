import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import {
  getEventsCount,
  getUpcomingEventsCount,
  getAllEventsAdmin,
} from "@/lib/api/events"
import {
  getBookingsCount,
  getConfirmedBookingsCount,
  getTotalRevenue,
} from "@/lib/api/bookings"
import { getAllUsers } from "@/lib/api/users"
import type { Event } from "@/lib/types"

export async function GET() {
  try {
    const { token } = await requireAdmin()

    const [
      totalEvents,
      upcomingEvents,
      totalBookings,
      confirmedBookings,
      totalRevenue,
      allEvents,
      users,
    ] = await Promise.all([
      getEventsCount(token),
      getUpcomingEventsCount(token),
      getBookingsCount(token),
      getConfirmedBookingsCount(token),
      getTotalRevenue(token),
      getAllEventsAdmin(token),
      getAllUsers(token),
    ])

    const now = new Date()
    const recentEvents: Event[] = [...allEvents]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)

    const featuredEvents = allEvents.filter((e) => e.is_featured).length
    const activeListings = allEvents.filter((e) => new Date(e.date) >= now).length

    return NextResponse.json({
      stats: {
        totalEvents,
        upcomingEvents,
        activeListings,
        featuredEvents,
        totalBookings,
        confirmedBookings,
        totalRevenue,
        totalUsers: users.length,
      },
      recentEvents,
    })
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    )
  }
}
