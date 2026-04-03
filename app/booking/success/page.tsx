"use client";

import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CheckCircle, Calendar, Ticket, Search} from "lucide-react";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("bookingId");
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  useEffect(() => {
    if (!hasTriggeredConfetti && (sessionId || bookingId)) {
      setHasTriggeredConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {y: 0.6},
      });
    }
  }, [sessionId, bookingId, hasTriggeredConfetti]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your tickets have been booked successfully. A confirmation email has been sent to your
            registered email address.
          </p>

          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Ticket className="h-4 w-4" />
              <span>Your e-tickets will be available in your dashboard</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full gap-2">
              <Link href="/dashboard">
                <Calendar className="h-4 w-4" />
                View My Bookings
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full gap-2">
              <Link href="/events">
                <Search className="h-4 w-4" />
                Browse More Events
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team at support@eventtix.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
