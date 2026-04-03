// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import useSWR from "swr"
// import { Header } from "@/components/header"
// import { Footer } from "@/components/footer"
// import { BookingCard } from "@/components/booking-card"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Calendar, Ticket } from "lucide-react"
// import { useAuth } from "@/lib/auth-context"
// import type { BookingWithEvent } from "@/lib/types"
// import Link from "next/link"

// const fetcher = (url: string) => fetch(url).then((res) => res.json())

// export default function DashboardPage() {
//   const router = useRouter()
//   const { session, isLoading: authLoading } = useAuth()
//   const { data, isLoading, mutate } = useSWR<{ bookings: BookingWithEvent[] }>(
//     session ? "/api/bookings" : null,
//     fetcher
//   )

//   useEffect(() => {
//     if (!authLoading && !session) {
//       router.push("/login?redirect=/dashboard")
//     }
//   }, [session, authLoading, router])

//   if (authLoading || !session) {
//     return (
//       <div className="flex min-h-screen flex-col">
//         <Header />
//         <main className="flex-1">
//           <div className="container mx-auto px-4 py-8">
//             <Skeleton className="mb-8 h-10 w-48" />
//             <div className="space-y-4">
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <Skeleton key={i} className="h-40 w-full" />
//               ))}
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     )
//   }

//   const bookings = data?.bookings || []
//   const now = new Date()

//   const upcomingBookings = bookings.filter(
//     (b) => b.status !== "cancelled" && new Date(b.event.date) >= now
//   )
//   const pastBookings = bookings.filter(
//     (b) => b.status !== "cancelled" && new Date(b.event.date) < now
//   )
//   const cancelledBookings = bookings.filter((b) => b.status === "cancelled")

//   return (
//     <div className="flex min-h-screen flex-col">
//       <Header />
//       <main className="flex-1 bg-muted/30">
//         <div className="container mx-auto px-4 py-8">
//           <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
//               <p className="mt-1 text-muted-foreground">
//                 Welcome back, {session.user.name}
//               </p>
//             </div>
//             <Button asChild>
//               <Link href="/events">
//                 <Ticket className="mr-2 h-4 w-4" />
//                 Browse Events
//               </Link>
//             </Button>
//           </div>

//           <Tabs defaultValue="upcoming" className="w-full">
//             <TabsList className="mb-6">
//               <TabsTrigger value="upcoming" className="gap-2">
//                 <Calendar className="h-4 w-4" />
//                 Upcoming ({upcomingBookings.length})
//               </TabsTrigger>
//               <TabsTrigger value="past">
//                 Past ({pastBookings.length})
//               </TabsTrigger>
//               <TabsTrigger value="cancelled">
//                 Cancelled ({cancelledBookings.length})
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="upcoming" className="space-y-4">
//               {isLoading ? (
//                 Array.from({ length: 3 }).map((_, i) => (
//                   <Skeleton key={i} className="h-40 w-full" />
//                 ))
//               ) : upcomingBookings.length > 0 ? (
//                 upcomingBookings.map((booking) => (
//                   <BookingCard
//                     key={booking.id}
//                     booking={booking}
//                     onCancel={() => mutate()}
//                   />
//                 ))
//               ) : (
//                 <div className="rounded-lg border border-border bg-card p-8 text-center">
//                   <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
//                   <h3 className="mb-2 text-lg font-semibold text-foreground">
//                     No Upcoming Events
//                   </h3>
//                   <p className="mb-4 text-muted-foreground">
//                     You don&apos;t have any upcoming events booked yet.
//                   </p>
//                   <Button asChild>
//                     <Link href="/events">Explore Events</Link>
//                   </Button>
//                 </div>
//               )}
//             </TabsContent>

//             <TabsContent value="past" className="space-y-4">
//               {pastBookings.length > 0 ? (
//                 pastBookings.map((booking) => (
//                   <BookingCard key={booking.id} booking={booking} />
//                 ))
//               ) : (
//                 <div className="rounded-lg border border-border bg-card p-8 text-center">
//                   <p className="text-muted-foreground">
//                     No past events to show.
//                   </p>
//                 </div>
//               )}
//             </TabsContent>

//             <TabsContent value="cancelled" className="space-y-4">
//               {cancelledBookings.length > 0 ? (
//                 cancelledBookings.map((booking) => (
//                   <BookingCard key={booking.id} booking={booking} />
//                 ))
//               ) : (
//                 <div className="rounded-lg border border-border bg-card p-8 text-center">
//                   <p className="text-muted-foreground">
//                     No cancelled bookings.
//                   </p>
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }

"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import useSWR from "swr";
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";
import {BookingCard} from "@/components/booking-card";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Calendar, Ticket, Clock, XCircle, PartyPopper, Search, TrendingUp} from "lucide-react";
import {useAuth} from "@/lib/auth-context";
import {motion, AnimatePresence} from "framer-motion";
import type {BookingWithEvent} from "@/lib/types";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then(res => res.json());

function BookingSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 animate-pulse">
      <div className="flex gap-4">
        <Skeleton className="h-44 w-44 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full shrink-0" />
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 px-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const {session, isLoading: authLoading} = useAuth();
  const {data, isLoading, mutate} = useSWR<{bookings: BookingWithEvent[]}>(
    session ? "/api/bookings" : null,
    fetcher,
  );

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login?redirect=/dashboard");
    }
  }, [session, authLoading, router]);

  if (authLoading || !session) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Skeleton className="mb-2 h-9 w-52 rounded-xl" />
            <Skeleton className="mb-8 h-4 w-36 rounded-lg" />
            <div className="space-y-4">
              {Array.from({length: 3}).map((_, i) => (
                <BookingSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const bookings = data?.bookings || [];
  const now = new Date();

  const upcomingBookings = bookings.filter(
    b => b.status !== "cancelled" && new Date(b.event.date) >= now,
  );
  const pastBookings = bookings.filter(
    b => b.status !== "cancelled" && new Date(b.event.date) < now,
  );
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");

  // get first name only
  const firstName = session.user.name?.split(" ")[0] || "there";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        {/* Hero header strip */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.4}}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                  <PartyPopper className="h-3.5 w-3.5 text-primary" />
                  Welcome back
                </p>
                <h1 className="text-3xl font-bold text-foreground">{firstName}'s Bookings</h1>
              </div>
              <Button asChild className="gap-2 rounded-xl shrink-0">
                <Link href="/events">
                  <Search className="h-4 w-4" />
                  Browse Events
                </Link>
              </Button>
            </motion.div>

            {/* Stats row */}
            {!isLoading && bookings.length > 0 && (
              <motion.div
                initial={{opacity: 0, y: 8}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: 0.1}}
                className="mt-6 grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Upcoming",
                    value: upcomingBookings.length,
                    icon: Calendar,
                    color: "text-primary",
                  },
                  {
                    label: "Attended",
                    value: pastBookings.length,
                    icon: TrendingUp,
                    color: "text-green-500",
                  },
                  {
                    label: "Cancelled",
                    value: cancelledBookings.length,
                    icon: XCircle,
                    color: "text-destructive",
                  },
                ].map(({label, value, icon: Icon, color}) => (
                  <div key={label} className="rounded-xl bg-muted/60 px-4 py-3 text-center">
                    <Icon className={`mx-auto mb-1 h-4 w-4 ${color}`} />
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Tabs content */}
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6 rounded-xl h-11 p-1 w-full">
              <TabsTrigger value="upcoming" className="gap-2 rounded-lg">
                <Calendar className="h-4 w-4" />
                Upcoming
                {upcomingBookings.length > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {upcomingBookings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="past" className="gap-2 rounded-lg">
                <Clock className="h-4 w-4" />
                Past ({pastBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="gap-2 rounded-lg">
                <XCircle className="h-4 w-4" />
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming */}
            <TabsContent value="upcoming">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({length: 3}).map((_, i) => (
                      <BookingSkeleton key={i} />
                    ))}
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-4">
                    {upcomingBookings.map((booking, i) => (
                      <motion.div
                        key={booking.id}
                        initial={{opacity: 0, y: 12}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: i * 0.06}}>
                        <BookingCard booking={booking} onCancel={() => mutate()} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    icon={Calendar}
                    title="No Upcoming Events"
                    description="You don't have any upcoming events booked yet. Explore what's on and grab your tickets!"
                    action={
                      <Button asChild className="rounded-xl gap-2">
                        <Link href="/events">
                          <Search className="h-4 w-4" /> Explore Events
                        </Link>
                      </Button>
                    }
                  />
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Past */}
            <TabsContent value="past">
              {pastBookings.length > 0 ? (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-4">
                  {pastBookings.map((booking, i) => (
                    <motion.div
                      key={booking.id}
                      initial={{opacity: 0, y: 12}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: i * 0.06}}>
                      <BookingCard booking={booking} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No Past Events"
                  description="Events you've attended will appear here."
                />
              )}
            </TabsContent>

            {/* Cancelled */}
            <TabsContent value="cancelled">
              {cancelledBookings.length > 0 ? (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-4">
                  {cancelledBookings.map((booking, i) => (
                    <motion.div
                      key={booking.id}
                      initial={{opacity: 0, y: 12}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: i * 0.06}}>
                      <BookingCard booking={booking} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon={XCircle}
                  title="No Cancelled Bookings"
                  description="You haven't cancelled any bookings — great!"
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
