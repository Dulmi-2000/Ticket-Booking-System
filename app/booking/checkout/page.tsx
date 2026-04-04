// "use client"

// import { useSearchParams, useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Checkout } from "@/components/checkout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { ArrowLeft, Calendar, MapPin, Ticket } from "lucide-react"
// import type { Event } from "@/lib/types"
// import { useAuth } from "@/lib/auth-context"

// export default function CheckoutPage() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const { session, isLoading: authLoading } = useAuth()
//   const [event, setEvent] = useState<Event | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   const eventId = searchParams.get("eventId")
//   const quantity = parseInt(searchParams.get("quantity") || "1", 10)

//   useEffect(() => {
//     if (!authLoading && !session) {
//       router.push(`/login?redirect=/events/${eventId}`)
//       return
//     }

//     if (eventId) {
//       fetch(`/api/events/${eventId}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setEvent(data.event)
//           setIsLoading(false)
//         })
//         .catch(() => {
//           setIsLoading(false)
//         })
//     }
//   }, [eventId, session, authLoading, router])

//   if (authLoading || isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
//         <div className="container mx-auto max-w-4xl">
//           <Skeleton className="mb-6 h-8 w-32" />
//           <div className="grid gap-6 lg:grid-cols-2">
//             <Skeleton className="h-96" />
//             <Skeleton className="h-96" />
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!event || !eventId) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-foreground">
//             Event Not Found
//           </h1>
//           <Link href="/events" className="mt-4 text-primary hover:underline">
//             Browse Events
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   })

//   const totalPrice = ((event.price_cents * quantity) / 100).toLocaleString(
//     "en-US",
//     {
//       style: "currency",
//       currency: "USD",
//     }
//   )

//   const unitPrice = (event.price_cents / 100).toLocaleString("en-US", {
//     style: "currency",
//     currency: "USD",
//   })

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
//       <div className="container mx-auto max-w-5xl">
//         <Link
//           href={`/events/${eventId}`}
//           className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Event
//         </Link>

//         <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>

//         <div className="grid gap-8 lg:grid-cols-5">
//           <div className="lg:col-span-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Payment Details</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Checkout eventId={eventId} quantity={quantity} />
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex gap-4">
//                   <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md">
//                     <Image
//                       src={event.image_url || "/images/placeholder-event.jpg"}
//                       alt={event.title}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-foreground">
//                       {event.title}
//                     </h3>
//                     <div className="mt-1 text-sm text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <Calendar className="h-3 w-3" />
//                         <span>{formattedDate}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <MapPin className="h-3 w-3" />
//                         <span className="line-clamp-1">{event.venue}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t border-border pt-4">
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center gap-2">
//                       <Ticket className="h-4 w-4 text-muted-foreground" />
//                       <span>
//                         {quantity} x {unitPrice}
//                       </span>
//                     </div>
//                     <span>{totalPrice}</span>
//                   </div>
//                 </div>

//                 <div className="border-t border-border pt-4">
//                   <div className="flex items-center justify-between font-semibold">
//                     <span>Total</span>
//                     <span className="text-lg">{totalPrice}</span>
//                   </div>
//                 </div>

//                 <p className="text-xs text-muted-foreground">
//                   By completing this purchase, you agree to our terms of service
//                   and refund policy. Cancellations are allowed up to 24 hours
//                   before the event.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import {useSearchParams, useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {Checkout} from "@/components/checkout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Badge} from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  ShieldCheck,
  Clock,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";
import {motion} from "framer-motion";
import type {Event} from "@/lib/types";
import {useAuth} from "@/lib/auth-context";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {session, isLoading: authLoading} = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const eventId = searchParams.get("eventId");
  const quantity = useMemo(() => {
    const n = parseInt(searchParams.get("quantity") || "1", 10);
    if (Number.isNaN(n) || n < 1) return 1;
    return Math.min(n, 100);
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      const params = new URLSearchParams();
      if (eventId) params.set("eventId", eventId);
      params.set("quantity", String(quantity));
      const dest = `/booking/checkout?${params.toString()}`;
      router.push(`/login?redirect=${encodeURIComponent(dest)}`);
      return;
    }

    if (!eventId) {
      setEvent(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/events/${eventId}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setEvent(data.event ?? null);
      })
      .catch(() => {
        setEvent(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [eventId, quantity, session, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
        <div className="container mx-auto max-w-5xl">
          <Skeleton className="mb-6 h-5 w-28 rounded-full" />
          <Skeleton className="mb-8 h-9 w-48" />
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event || !eventId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Ticket className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Event Not Found</h1>
          <p className="text-sm text-muted-foreground">This event may no longer be available.</p>
          <Link href="/events" className="inline-block mt-2 text-sm text-primary hover:underline">
            Browse Events →
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const totalPrice = ((event.price_cents * quantity) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const unitPrice = (event.price_cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        {/* Back link */}
        <Link
          href={`/events/${eventId}`}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-background/60 backdrop-blur border border-border px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-all">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Event
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete your purchase securely below
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left — payment */}
          <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
            className="lg:col-span-3 space-y-4">
            {/* Security badge */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>

            <Card className="shadow-sm">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Ticket className="h-5 w-5 text-primary" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <Checkout eventId={eventId} quantity={quantity} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Right — order summary */}
          <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, delay: 0.1}}
            className="lg:col-span-2 space-y-4">
            {/* Event summary card */}
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                {/* Event image + info */}
                <div className="flex gap-3">
                  <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={event.image_url || "/images/placeholder-event.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" className="mb-1.5 text-xs">
                      {event.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                </div>

                {/* Event meta */}
                <div className="space-y-2 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="h-3.5 w-3.5" />
                      {quantity} ticket{quantity > 1 ? "s" : ""} × {unitPrice}
                    </span>
                    <span>{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Service fee</span>
                    <span className="text-primary text-xs font-medium">Free</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">{totalPrice}</span>
                </div>
              </CardContent>
            </Card>

            {/* Trust / policy card */}
            <Card className="shadow-sm">
              <CardContent className="pt-4 space-y-3">
                {[
                  {icon: ShieldCheck, text: "Secure & encrypted payment"},
                  {icon: CheckCircle2, text: "Instant booking confirmation"},
                  {icon: Clock, text: "Free cancellation up to 24h before"},
                  {icon: RefreshCcw, text: "Easy refund if event is cancelled"},
                ].map(({icon: Icon, text}) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Terms */}
            <p className="text-xs text-muted-foreground px-1 leading-relaxed">
              By completing this purchase you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                terms of service
              </Link>{" "}
              and{" "}
              <Link href="/refunds" className="text-primary hover:underline">
                refund policy
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
