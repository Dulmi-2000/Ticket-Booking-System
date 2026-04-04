// "use client";

// import {useState} from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {Card, CardContent} from "@/components/ui/card";
// import {Badge} from "@/components/ui/badge";
// import {Button} from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {Calendar, Clock, MapPin, Ticket, X} from "lucide-react";
// import {toast} from "sonner";
// import type {BookingWithEvent} from "@/lib/types";

// interface BookingCardProps {
//   booking: BookingWithEvent;
//   onCancel?: () => void;
// }

// export function BookingCard({booking, onCancel}: BookingCardProps) {
//   const [isCancelling, setIsCancelling] = useState(false);

//   const event = booking.event;
//   const isPast = new Date(event.date) < new Date();
//   const hoursUntilEvent =
//     (new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60);
//   const canCancel = booking.status === "confirmed" && !isPast && hoursUntilEvent >= 24;

//   const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });

//   const totalPrice = (booking.total_price_cents / 100).toLocaleString("en-US", {
//     style: "currency",
//     currency: "USD",
//   });

//   const handleCancel = async () => {
//     setIsCancelling(true);
//     try {
//       const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
//         method: "POST",
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.error || "Failed to cancel booking");
//       }

//       toast.success("Booking cancelled successfully. Refund will be processed.");
//       onCancel?.();
//     } catch (error) {
//       toast.error((error as Error).message);
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   const statusVariant = {
//     confirmed: "default" as const,
//     pending: "secondary" as const,
//     cancelled: "destructive" as const,
//   };

//   const statusLabel = {
//     confirmed: "Confirmed",
//     pending: "Pending Payment",
//     cancelled: "Cancelled",
//   };

//   return (
//     <Card className={`overflow-hidden ${isPast ? "opacity-75" : ""}`}>
//       <CardContent className="p-0">
//         <div className="flex flex-col sm:flex-row">
//           <div className="relative h-32 w-full sm:h-auto sm:w-40 md:w-48">
//             <Image
//               src={event.image_url || "/images/placeholder-event.jpg"}
//               alt={event.title}
//               fill
//               className="object-cover"
//               sizes="(max-width: 640px) 100vw, 200px"
//             />
//             {isPast && (
//               <div className="absolute inset-0 flex items-center justify-center bg-background/60">
//                 <Badge variant="secondary">Past Event</Badge>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-1 flex-col justify-between p-4">
//             <div>
//               <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
//                 <Link
//                   href={`/events/${event.id}`}
//                   className="text-lg font-semibold text-foreground hover:text-primary">
//                   {event.title}
//                 </Link>
//                 <Badge variant={statusVariant[booking.status]}>{statusLabel[booking.status]}</Badge>
//               </div>

//               <div className="mb-3 space-y-1 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4" />
//                   <span>{formattedDate}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Clock className="h-4 w-4" />
//                   <span>{event.time}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <MapPin className="h-4 w-4" />
//                   <span className="line-clamp-1">
//                     {event.venue}, {event.location}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div className="flex items-center gap-4 text-sm">
//                 <div className="flex items-center gap-1">
//                   <Ticket className="h-4 w-4 text-muted-foreground" />
//                   <span>
//                     {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
//                   </span>
//                 </div>
//                 <span className="font-semibold text-foreground">{totalPrice}</span>
//               </div>

//               {canCancel && (
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="gap-1 text-destructive hover:text-destructive"
//                       disabled={isCancelling}>
//                       <X className="h-4 w-4" />
//                       Cancel Booking
//                     </Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         Are you sure you want to cancel this booking? A full refund will be
//                         processed to your original payment method. This action cannot be undone.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Keep Booking</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={handleCancel}
//                         className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
//                         {isCancelling ? "Cancelling..." : "Cancel Booking"}
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               )}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Calendar, Clock, MapPin, Ticket, X, CheckCircle2, RefreshCcw, Ban} from "lucide-react";
import {toast} from "sonner";
import {motion} from "framer-motion";
import type {BookingWithEvent} from "@/lib/types";

interface BookingCardProps {
  booking: BookingWithEvent;
  onCancel?: () => void;
}

export function BookingCard({booking, onCancel}: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  const event = booking.event;
  const isPast = new Date(event.date) < new Date();
  const [canCancel, setCanCancel] = useState(false);

  useEffect(() => {
    if (booking.status !== "confirmed" || isPast) {
      setCanCancel(false);
      return;
    }
    let cancelled = false;
    fetch(`/api/bookings/${booking.id}/can-cancel`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setCanCancel(Boolean(data.canCancel));
      })
      .catch(() => {
        if (!cancelled) setCanCancel(false);
      });
    return () => {
      cancelled = true;
    };
  }, [booking.id, booking.status, isPast]);

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const totalPrice = (booking.total_price_cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const unitPrice = (booking.total_price_cents / booking.quantity / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, {method: "POST"});
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel booking");
      }
      toast.success("Booking cancelled. Refund will be processed.");
      onCancel?.();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsCancelling(false);
    }
  };

  const statusConfig = {
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle2,
      className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    },
    pending: {
      label: "Pending Payment",
      icon: RefreshCcw,
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    cancelled: {
      label: "Cancelled",
      icon: Ban,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}>
      <Card
        className={`overflow-hidden border-border transition-all duration-200 hover:shadow-md ${
          isPast ? "opacity-70" : ""
        } ${booking.status === "cancelled" ? "border-destructive/20 bg-destructive/5" : ""}`}>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-44">
              <Image
                src={event.image_url || "/images/placeholder-event.jpg"}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 176px"
              />
              {/* Category pill on image */}
              <div className="absolute left-2 top-2">
                <span className="rounded-full bg-background/80 backdrop-blur px-2.5 py-0.5 text-xs font-medium text-foreground border border-border">
                  {event.category}
                </span>
              </div>
              {isPast && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                    Past Event
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between p-6 min-w-0 pl-10">
              {/* Top row */}
              <div className="pb-3">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {event.title}
                  </Link>

                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shrink-0 ${status.className}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>

                {/* Meta info pills */}
                <div className="flex flex-wrap gap-4 mb-3">
                  {[
                    {icon: Calendar, label: formattedDate},
                    {icon: Clock, label: event.time},
                    {icon: MapPin, label: `${event.venue}, ${event.location}`},
                  ].map(({icon: Icon, label}) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground">
                      <Icon className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                {/* Ticket + price info */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-1.5 text-sm">
                    <Ticket className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">
                      {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground text-xs">{unitPrice} each · </span>
                    <span className="font-semibold text-foreground">{totalPrice}</span>
                  </div>
                </div>

                {/* Cancel button */}
                {canCancel && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
                        disabled={isCancelling}>
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <span className="block">
                            You're about to cancel <strong>{event.title}</strong> on {formattedDate}
                            .
                          </span>
                          <span className="block text-xs bg-muted/60 rounded-lg px-3 py-2">
                            A full refund of <strong>{totalPrice}</strong> will be returned to your
                            original payment method within 5–10 business days.
                          </span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Keep Booking</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancel}
                          className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          {isCancelling ? (
                            <span className="flex items-center gap-2">
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Cancelling...
                            </span>
                          ) : (
                            "Yes, Cancel Booking"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
