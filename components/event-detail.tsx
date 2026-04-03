// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { useRouter, useSearchParams } from "next/navigation"
// import { useAuth } from "@/lib/auth-context"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Ticket,
//   Share2,
//   ArrowLeft,
//   Minus,
//   Plus,
//   AlertCircle,
// } from "lucide-react"
// import { toast } from "sonner"
// import type { Event } from "@/lib/types"

// interface EventDetailProps {
//   event: Event
// }

// export function EventDetail({ event }: EventDetailProps) {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const { session } = useAuth()
//   const [quantity, setQuantity] = useState(1)
//   const [isLoading, setIsLoading] = useState(false)

//   const wasCancelled = searchParams.get("cancelled") === "true"

//   const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   })

//   const formattedPrice = (event.price_cents / 100).toLocaleString("en-US", {
//     style: "currency",
//     currency: "USD",
//   })

//   const totalPrice = ((event.price_cents * quantity) / 100).toLocaleString(
//     "en-US",
//     {
//       style: "currency",
//       currency: "USD",
//     }
//   )

//   const isSoldOut = event.available_tickets === 0
//   const isLowStock =
//     event.available_tickets > 0 && event.available_tickets <= 50
//   const maxQuantity = Math.min(event.available_tickets, 10)

//   const handleQuantityChange = (delta: number) => {
//     const newQuantity = quantity + delta
//     if (newQuantity >= 1 && newQuantity <= maxQuantity) {
//       setQuantity(newQuantity)
//     }
//   }

//   const handleCheckout = async () => {
//     if (!session) {
//       router.push(`/login?redirect=/events/${event.id}`)
//       return
//     }

//     setIsLoading(true)
//     try {
//       const res = await fetch("/api/checkout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ eventId: event.id, quantity }),
//       })

//       if (!res.ok) {
//         const data = await res.json()
//         throw new Error(data.error || "Failed to start checkout")
//       }

//       const { bookingId } = await res.json()
//       router.push(`/booking/checkout?bookingId=${bookingId}&eventId=${event.id}&quantity=${quantity}`)
//     } catch (error) {
//       toast.error((error as Error).message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleShare = async () => {
//     const url = window.location.href
//     if (navigator.share) {
//       await navigator.share({
//         title: event.title,
//         text: `Check out ${event.title} on EventTix!`,
//         url,
//       })
//     } else {
//       await navigator.clipboard.writeText(url)
//       toast.success("Link copied to clipboard!")
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Link
//         href="/events"
//         className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
//       >
//         <ArrowLeft className="h-4 w-4" />
//         Back to Events
//       </Link>

//       {wasCancelled && (
//         <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
//           <AlertCircle className="h-4 w-4" />
//           Payment was cancelled. No charges were made.
//         </div>
//       )}

//       <div className="grid gap-8 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
//             <Image
//               src={event.image_url || "/images/placeholder-event.jpg"}
//               alt={event.title}
//               fill
//               className="object-cover"
//               priority
//               sizes="(max-width: 1024px) 100vw, 66vw"
//             />
//             <div className="absolute left-4 top-4 flex gap-2">
//               <Badge variant="secondary" className="bg-background/90 backdrop-blur">
//                 {event.category}
//               </Badge>
//               {event.is_featured && (
//                 <Badge className="bg-primary text-primary-foreground">
//                   Featured
//                 </Badge>
//               )}
//             </div>
//           </div>

//           <div className="mt-6">
//             <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>

//             <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-5 w-5" />
//                 <span>{formattedDate}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 <span>{event.time}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-5 w-5" />
//                 <span>
//                   {event.venue}, {event.location}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <h2 className="mb-3 text-lg font-semibold text-foreground">
//                 About This Event
//               </h2>
//               <p className="whitespace-pre-wrap text-muted-foreground">
//                 {event.description}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-1">
//           <Card className="sticky top-24">
//             <CardHeader>
//               <CardTitle className="text-2xl">{formattedPrice}</CardTitle>
//               <p className="text-sm text-muted-foreground">per ticket</p>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {isSoldOut ? (
//                 <div className="rounded-lg bg-destructive/10 p-4 text-center">
//                   <Ticket className="mx-auto mb-2 h-8 w-8 text-destructive" />
//                   <p className="font-semibold text-destructive">Sold Out</p>
//                   <p className="mt-1 text-sm text-muted-foreground">
//                     This event is no longer available
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   {isLowStock && (
//                     <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                       <AlertCircle className="h-4 w-4" />
//                       Only {event.available_tickets} tickets left!
//                     </div>
//                   )}

//                   <div>
//                     <label className="mb-2 block text-sm font-medium text-foreground">
//                       Number of Tickets
//                     </label>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => handleQuantityChange(-1)}
//                         disabled={quantity <= 1}
//                       >
//                         <Minus className="h-4 w-4" />
//                       </Button>
//                       <Input
//                         type="number"
//                         value={quantity}
//                         onChange={(e) => {
//                           const val = parseInt(e.target.value, 10)
//                           if (val >= 1 && val <= maxQuantity) {
//                             setQuantity(val)
//                           }
//                         }}
//                         min={1}
//                         max={maxQuantity}
//                         className="w-20 text-center"
//                       />
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => handleQuantityChange(1)}
//                         disabled={quantity >= maxQuantity}
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <p className="mt-1 text-xs text-muted-foreground">
//                       Max {maxQuantity} tickets per order
//                     </p>
//                   </div>

//                   <div className="border-t border-border pt-4">
//                     <div className="mb-4 flex justify-between text-lg font-semibold">
//                       <span>Total</span>
//                       <span>{totalPrice}</span>
//                     </div>
//                     <Button
//                       className="w-full"
//                       size="lg"
//                       onClick={handleCheckout}
//                       disabled={isLoading}
//                     >
//                       {isLoading ? "Processing..." : "Buy Tickets"}
//                     </Button>
//                   </div>
//                 </>
//               )}

//               <Button
//                 variant="outline"
//                 className="w-full gap-2"
//                 onClick={handleShare}
//               >
//                 <Share2 className="h-4 w-4" />
//                 Share Event
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useAuth} from "@/lib/auth-context";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Share2,
  ArrowLeft,
  Minus,
  Plus,
  AlertCircle,
  Users,
  Tag,
  CheckCircle2,
} from "lucide-react";
import {toast} from "sonner";
import {motion} from "framer-motion";
import type {Event} from "@/lib/types";

interface EventDetailProps {
  event: Event;
}

export function EventDetail({event}: EventDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {session} = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const wasCancelled = searchParams.get("cancelled") === "true";

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedPrice = (event.price_cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const totalPrice = ((event.price_cents * quantity) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const isSoldOut = event.available_tickets === 0;
  const isLowStock = event.available_tickets > 0 && event.available_tickets <= 50;
  const maxQuantity = Math.min(event.available_tickets, 10);

  // ticket availability percentage for progress bar
  const availabilityPercent = Math.min(
    100,
    Math.round((event.available_tickets / (event.total_tickets || 500)) * 100),
  );

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!session) {
      router.push(`/login?redirect=/events/${event.id}`);
      return;
    }
    setIsLoading(true);
    try {
      // Move to checkout page; booking is created only after payment confirmation.
      router.push(`/booking/checkout?eventId=${event.id}&quantity=${quantity}`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({title: event.title, text: `Check out ${event.title}!`, url});
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero image banner */}
      <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src={event.image_url || "/images/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-transparent justify-between" />

        {/* Back button on image */}
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full bg-background/60 backdrop-blur-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-background/80 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>

        {/* Badges on image */}
        <div className="absolute right-4 md:right-8 top-4 md:top-8 flex gap-2">
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-2 rounded-full bg-background backdrop-blur-md border border-border px-5 py-1.5 text-foreground text-md font-medium transition-all">
            {event.category}
          </Badge>
          {event.is_featured && (
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        {wasCancelled && (
          <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            className="mb-6 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Payment was cancelled. No charges were made.
          </motion.div>
        )}
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left — event info */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="lg:col-span-2 space-y-8">
            {/* Title + meta */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4">
                {[
                  {icon: Calendar, label: formattedDate},
                  {icon: Clock, label: event.time},
                  {icon: MapPin, label: `${event.venue}, ${event.location}`},
                ].map(({icon: Icon, label}) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/70 rounded-full px-3 py-1.5">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* About */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">About This Event</h2>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* What's included */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "General venue access",
                  "Live entertainment",
                  "Event program booklet",
                  "Access to all stages",
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Location card */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Location</h2>
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">{event.venue}</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — booking card */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.15}}
            className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl border-border">
              <CardHeader className="pb-4">
                <div className="flex items-baseline justify-between">
                  <CardTitle className="text-3xl font-bold">{formattedPrice}</CardTitle>
                  <span className="text-sm text-muted-foreground">per ticket</span>
                </div>

                {/* Availability bar */}
                {!isSoldOut && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.available_tickets} tickets left
                      </span>
                      <span>{availabilityPercent}% available</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          availabilityPercent < 20
                            ? "bg-destructive"
                            : availabilityPercent < 50
                              ? "bg-amber-500"
                              : "bg-primary"
                        }`}
                        style={{width: `${availabilityPercent}%`}}
                      />
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-5">
                {isSoldOut ? (
                  <div className="rounded-xl bg-destructive/10 p-5 text-center">
                    <Ticket className="mx-auto mb-2 h-8 w-8 text-destructive" />
                    <p className="font-semibold text-destructive">Sold Out</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This event is no longer available
                    </p>
                  </div>
                ) : (
                  <>
                    {isLowStock && (
                      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Only {event.available_tickets} tickets left — book soon!
                      </div>
                    )}

                    {/* Quantity selector */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Number of Tickets
                      </label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= maxQuantity}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Max {maxQuantity} tickets per order
                      </p>
                    </div>

                    {/* Price breakdown */}
                    <div className="rounded-xl bg-muted/50 p-4 space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          {formattedPrice} × {quantity}
                        </span>
                        <span>{totalPrice}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground text-base">
                        <span>Total</span>
                        <span>{totalPrice}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Ticket className="h-4 w-4" />
                          Buy Tickets
                        </span>
                      )}
                    </Button>
                  </>
                )}

                <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Share Event
                </Button>

                {/* Trust badges */}
                <div className="flex justify-center gap-4 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-primary" /> Secure checkout
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-primary" /> Instant confirmation
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <br /> <br /> <br />
      </div>
    </div>
  );
}
