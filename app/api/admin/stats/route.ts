import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getEventsCount, getUpcomingEventsCount } from "@/lib/api/events"
import {
  getBookingsCount,
  getConfirmedBookingsCount,
  getTotalRevenue,
  getRecentBookings,
} from "@/lib/api/bookings"
import { getAllUsers } from "@/lib/api/users"

export async function GET() {
  try {
    await requireAdmin()

    const [
      totalEvents,
      upcomingEvents,
      totalBookings,
      confirmedBookings,
      totalRevenue,
      recentBookings,
      users,
    ] = await Promise.all([
      getEventsCount(),
      getUpcomingEventsCount(),
      getBookingsCount(),
      getConfirmedBookingsCount(),
      getTotalRevenue(),
      getRecentBookings(10),
      getAllUsers(),
    ])

    return NextResponse.json({
      stats: {
        totalEvents,
        upcomingEvents,
        totalBookings,
        confirmedBookings,
        totalRevenue,
        totalUsers: users.length,
      },
      recentBookings,
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
