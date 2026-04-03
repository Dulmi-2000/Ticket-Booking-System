"use client";

import useSWR from "swr";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
  Ticket,
  Calendar,
  Clock,
  CheckCircle2,
  RefreshCcw,
  Ban,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {motion} from "framer-motion";
import type {BookingWithEvent} from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const formatCurrency = (cents: number) =>
  (cents / 100).toLocaleString("en-US", {style: "currency", currency: "USD"});

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
  },
  pending: {
    label: "Pending",
    icon: RefreshCcw,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
};

export default function AdminBookingsPage() {
  const {data, isLoading} = useSWR<{bookings: BookingWithEvent[]}>("/api/admin/bookings", fetcher);
  const bookings = data?.bookings || [];

  const totalRevenue = bookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + b.total_price_cents, 0);

  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4}}>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Ticket className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
        </div>
        <p className="text-muted-foreground ml-12">View and manage all ticket bookings</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4, delay: 0.1}}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Bookings",
            value: bookings.length,
            icon: Ticket,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Confirmed",
            value: confirmedCount,
            icon: CheckCircle2,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-500/10",
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: RefreshCcw,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Revenue",
            value: formatCurrency(totalRevenue),
            icon: DollarSign,
            color: "text-primary",
            bg: "bg-primary/10",
          },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4, delay: 0.2}}>
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              All Bookings
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {bookings.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-0 divide-y divide-border">
                {Array.from({length: 5}).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-4 flex-1 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Booking ID
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Event
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tickets
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Booked At
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking, i) => {
                      const status = statusConfig[booking.status];
                      const StatusIcon = status.icon;
                      return (
                        <TableRow key={booking.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <span className="font-mono text-xs bg-muted/60 rounded-md px-2 py-1 text-muted-foreground">
                              #{booking.id.slice(0, 8)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="font-medium text-foreground text-sm">
                                {booking.event.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 text-primary" />
                                {new Date(booking.event.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1 text-sm font-medium">
                              <Ticket className="h-3.5 w-3.5 text-primary" />
                              {booking.quantity}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-foreground">
                              {formatCurrency(booking.total_price_cents)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 text-primary" />
                              {new Date(booking.booked_at).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Ticket className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-foreground">No bookings yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bookings will appear here once customers start purchasing tickets.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
