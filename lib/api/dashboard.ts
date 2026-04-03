import { backendGet } from "./client"

/** Matches Spring `DashboardController` / `GET /api/dashboard/stats`. */
export interface DashboardStats {
  users: number
  events: number
  upcomingEvents: number
  totalBookings: number
  confirmedBookings: number
  totalRevenue: number
}

export async function getDashboardStats(token?: string): Promise<DashboardStats> {
  const data = await backendGet<Record<string, unknown>>("/api/dashboard/stats", token)
  return {
    users: Number(data.users ?? 0),
    events: Number(data.events ?? 0),
    upcomingEvents: Number(data.upcomingEvents ?? 0),
    totalBookings: Number(data.totalBookings ?? 0),
    confirmedBookings: Number(data.confirmedBookings ?? 0),
    totalRevenue: Number(data.totalRevenue ?? 0),
  }
}
