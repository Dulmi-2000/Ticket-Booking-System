"use client";

import useSWR from "swr";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
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
  CheckCircle2,
  Clock,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {motion} from "framer-motion";
import type {Event} from "@/lib/types";

interface AdminStats {
  totalEvents: number;
  upcomingEvents: number;
  activeListings: number;
  pastEvents: number;
  featuredEvents: number;
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalUsers: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());
const formatCurrency = (cents: number) =>
  (cents / 100).toLocaleString("en-US", {style: "currency", currency: "USD"});

export default function AdminDashboardPage() {
  const {data, isLoading} = useSWR<{stats: AdminStats; recentEvents: Event[]}>(
    "/api/admin/stats",
    fetcher,
  );

  const stats = data?.stats;
  const recentEvents = data?.recentEvents || [];

  const statCards = [
    {
      title: "Total Listings",
      value: stats?.totalEvents ?? 0,
      icon: LayoutGrid,
      description: `${stats?.activeListings ?? 0} upcoming`,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      title: "Featured",
      value: stats?.featuredEvents ?? 0,
      icon: Sparkles,
      description: "front-page events",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Revenue",
      value: stats ? formatCurrency(stats.totalRevenue) : "$0",
      icon: DollarSign,
      description: "confirmed payments",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      title: "Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "registered accounts",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
  ];

  const pastCount =
    stats?.pastEvents ?? Math.max(0, (stats?.totalEvents ?? 0) - (stats?.upcomingEvents ?? 0));

  const eventBreakdownData = [
    {name: "Total", value: stats?.totalEvents ?? 0},
    {name: "Upcoming", value: stats?.upcomingEvents ?? 0},
    {name: "Past", value: pastCount},
    {name: "Featured", value: stats?.featuredEvents ?? 0},
  ];

  const mixData = [
    {name: "Upcoming", value: stats?.upcomingEvents ?? 0},
    {name: "Past", value: pastCount},
    {name: "Featured", value: stats?.featuredEvents ?? 0},
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4}}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1.5 w-6 rounded-full bg-primary" />
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Admin Panel
            </p>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back — here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild className="gap-2 rounded-xl">
            <Link href="/admin/events/new">
              <Plus className="h-4 w-4" /> Add Listing
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/events">Manage Events</Link>
          </Button>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4, delay: 0.1}}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({length: 4}).map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-3 w-32 rounded-lg" />
                </CardContent>
              </Card>
            ))
          : statCards.map(stat => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className={`border shadow-sm hover:shadow-md transition-all ${stat.border}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${stat.bg.replace("/10", "")}`} />
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </motion.div>

      {/* Booking summary strip */}
      {!isLoading && stats && (
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.4, delay: 0.15}}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Bookings",
              value: stats.totalBookings,
              icon: Ticket,
              color: "text-primary",
              bg: "bg-primary/10",
              sub: "all time",
            },
            {
              label: "Confirmed",
              value: stats.confirmedBookings,
              icon: CheckCircle2,
              color: "text-green-600 dark:text-green-400",
              bg: "bg-green-500/10",
              sub: "paid bookings",
            },
            {
              label: "Upcoming Events",
              value: stats.upcomingEvents,
              icon: Clock,
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-500/10",
              sub: "scheduled",
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/30 transition-colors">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Charts */}
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4, delay: 0.2}}
        className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Events overview
              </CardTitle>
              <span className="text-xs text-muted-foreground bg-muted/60 rounded-full px-2.5 py-1">
                Live counts
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={eventBreakdownData}
                  margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--primary))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(153, 64, 13, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#primaryGradient)"
                    dot={{fill: "hsl(var(--primary))", r: 4, strokeWidth: 0}}
                    activeDot={{r: 6, strokeWidth: 0}}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                Event Mix
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mixData} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent events */}
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4, delay: 0.25}}>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <Ticket className="h-4 w-4 text-primary" />
              </div>
              Recently added listings
            </CardTitle>
            <Button variant="outline" size="sm" asChild className="rounded-xl gap-1.5">
              <Link href="/admin/events">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({length: 4}).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-48 rounded-lg" />
                        <Skeleton className="h-3 w-32 rounded-lg" />
                      </div>
                    </div>
                    <div className="space-y-1.5 text-right">
                      <Skeleton className="h-4 w-16 rounded-lg" />
                      <Skeleton className="h-3 w-20 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentEvents.length > 0 ? (
              <ul className="space-y-2">
                {recentEvents.map(event => (
                  <li key={event.id}>
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="flex items-center justify-between rounded-xl border border-border bg-card p-3 transition-all hover:bg-primary/5 hover:border-primary/30 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground line-clamp-1 text-sm">
                            {event.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            · {event.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(event.price_cents)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.available_tickets}/{event.total_tickets} left
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-border py-14 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <LayoutGrid className="h-6 w-6 text-primary/50" />
                </div>
                <p className="font-medium text-foreground mb-1">No events yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first listing to get started.
                </p>
                <Button asChild className="rounded-xl gap-2">
                  <Link href="/admin/events/new">
                    <Plus className="h-4 w-4" /> Create Listing
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
