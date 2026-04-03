import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getAllEventsAdmin } from "@/lib/api/events"
import { getDashboardStats } from "@/lib/api/dashboard"
import type { Event } from "@/lib/types"

export async function GET() {
  try {
    const { token } = await requireAdmin()

    const [dashboard, allEvents] = await Promise.all([
      getDashboardStats(token),
      getAllEventsAdmin(token),
    ])

    const featuredEvents = allEvents.filter((e) => e.is_featured).length
    const pastEvents = Math.max(0, dashboard.events - dashboard.upcomingEvents)

    // Recent = newest listings by created_at (matches “recently added” in admin).
    const recentEvents: Event[] = [...allEvents]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, 8)

    return NextResponse.json({
      stats: {
        totalEvents: dashboard.events,
        upcomingEvents: dashboard.upcomingEvents,
        // Same definition as backend: event date >= today (calendar).
        activeListings: dashboard.upcomingEvents,
        pastEvents,
        featuredEvents,
        totalBookings: dashboard.totalBookings,
        confirmedBookings: dashboard.confirmedBookings,
        totalRevenue: dashboard.totalRevenue,
        totalUsers: dashboard.users,
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
