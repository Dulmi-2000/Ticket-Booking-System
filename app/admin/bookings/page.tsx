"use client";

import useSWR from "swr";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Ticket, Calendar, Clock} from "lucide-react";
import type {BookingWithEvent} from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminBookingsPage() {
  const {data, isLoading} = useSWR<{bookings: BookingWithEvent[]}>("/api/admin/bookings", fetcher);

  const bookings = data?.bookings || [];

  const formatCurrency = (cents: number) =>
    (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const statusVariant = {
    confirmed: "default" as const,
    pending: "secondary" as const,
    cancelled: "destructive" as const,
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
        <p className="mt-1 text-muted-foreground">View and manage all ticket bookings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            All Bookings ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({length: 5}).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Booked At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">
                        {booking.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{booking.event.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(booking.event.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Ticket className="h-4 w-4 text-muted-foreground" />
                          {booking.quantity}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(booking.total_price_cents)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(booking.booked_at).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Ticket className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No bookings yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
