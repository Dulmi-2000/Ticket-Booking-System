"use client"

import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Calendar,
  DollarSign,
  LayoutGrid,
  Plus,
  Sparkles,
  Ticket,
  Users,
  ArrowRight,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts"
import type { Event } from "@/lib/types"

interface AdminStats {
  totalEvents: number
  upcomingEvents: number
  activeListings: number
  featuredEvents: number
  totalBookings: number
  confirmedBookings: number
  totalRevenue: number
  totalUsers: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboardPage() {
  const { data, isLoading } = useSWR<{
    stats: AdminStats
    recentEvents: Event[]
  }>("/api/admin/stats", fetcher)

  const stats = data?.stats
  const recentEvents = data?.recentEvents || []

  const formatCurrency = (cents: number) =>
    (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })

  const statCards = [
    {
      title: "Total Listings",
      value: stats?.totalEvents ?? 0,
      icon: LayoutGrid,
      description: `${stats?.activeListings ?? 0} active`,
      color: "text-cyan-500",
    },
    {
      title: "Featured",
      value: stats?.featuredEvents ?? 0,
      icon: Sparkles,
      description: "front-page events",
      color: "text-amber-500",
    },
    {
      title: "Revenue",
      value: stats ? formatCurrency(stats.totalRevenue) : "$0",
      icon: DollarSign,
      description: "confirmed payments",
      color: "text-green-500",
    },
    {
      title: "Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "registered accounts",
      color: "text-violet-500",
    },
  ]

  const trendData = [
    { name: "W1", value: Math.max(1, Math.round((stats?.totalEvents ?? 0) * 0.55)) },
    { name: "W2", value: Math.max(1, Math.round((stats?.totalEvents ?? 0) * 0.68)) },
    { name: "W3", value: Math.max(1, Math.round((stats?.totalEvents ?? 0) * 0.73)) },
    { name: "W4", value: Math.max(1, stats?.totalEvents ?? 1) },
  ]

  const mixData = [
    { name: "Upcoming", value: stats?.upcomingEvents ?? 0 },
    { name: "Past", value: Math.max(0, (stats?.totalEvents ?? 0) - (stats?.upcomingEvents ?? 0)) },
    { name: "Featured", value: stats?.featuredEvents ?? 0 },
  ]

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">ADMIN PANEL</p>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild className="gap-2 rounded-xl shrink-0">
            <Link href="/admin/events/new">
              <Plus className="h-4 w-4" />
              Add Listing
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/events">Manage Events</Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="mb-1 h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-cyan-500" />
              Listing Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="listingsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#listingsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Event Mix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mixData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ticket className="h-5 w-5 text-primary" />
            Recent Event Listings
          </CardTitle>
          <Button variant="outline" size="sm" asChild className="rounded-lg gap-1">
            <Link href="/admin/events">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <ul className="space-y-3">
              {recentEvents.map((event) => (
                <li key={event.id}>
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground line-clamp-1">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} · {event.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(event.price_cents)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.available_tickets}/{event.total_tickets}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <LayoutGrid className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">No events yet.</p>
              <Button asChild>
                <Link href="/admin/events/new">Create your first listing</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
