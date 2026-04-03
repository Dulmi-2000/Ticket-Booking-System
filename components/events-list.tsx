// "use client";

// import useSWR from "swr";
// import {useSearchParams} from "next/navigation";
// import {EventCard} from "@/components/event-card";
// import {EventsSearch} from "@/components/events-search";
// import {Skeleton} from "@/components/ui/skeleton";
// import {Calendar} from "lucide-react";
// import type {Event} from "@/lib/types";

// const fetcher = (url: string) => fetch(url).then(res => res.json());

// export function EventsList() {
//   const searchParams = useSearchParams();
//   const queryString = searchParams.toString();
//   const url = queryString ? `/api/events?${queryString}` : "/api/events";

//   const {data, isLoading, error} = useSWR<{
//     events: Event[];
//     categories: string[];
//   }>(url, fetcher);

//   if (error) {
//     return (
//       <div className="py-16 text-center">
//         <p className="text-muted-foreground">Unable to load events. Please try again later.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <EventsSearch categories={data?.categories || []} />

//       {isLoading ? (
//         <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
//           {Array.from({length: 9}).map((_, i) => (
//             <div key={i} className="space-y-4">
//               <Skeleton className="aspect-[16/10] w-full rounded-lg" />
//               <Skeleton className="h-6 w-3/4" />
//               <Skeleton className="h-4 w-1/2" />
//               <Skeleton className="h-10 w-full" />
//             </div>
//           ))}
//         </div>
//       ) : data?.events && data.events.length > 0 ? (
//         <>
//           <p className="mb-6 text-sm text-muted-foreground">
//             Showing {data.events.length} event
//             {data.events.length !== 1 ? "s" : ""}
//           </p>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {data.events.map(event => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </div>
//         </>
//       ) : (
//         <div className="py-16 text-center">
//           <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
//           <h3 className="mb-2 text-lg font-semibold text-foreground">No Events Found</h3>
//           <p className="text-muted-foreground">
//             Try adjusting your search filters or check back later for new events.
//           </p>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import useSWR from "swr";
import {useSearchParams} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import {EventCard} from "@/components/event-card";
import {EventsSearch} from "@/components/events-search";
import {Skeleton} from "@/components/ui/skeleton";
import {Calendar, SearchX, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import type {Event} from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(res => res.json());

function EventCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-3 animate-pulse">
      <Skeleton className="aspect-[16/10] w-full rounded-lg" />
      <div className="space-y-2 px-1 pb-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  );
}

export function EventsList() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const url = queryString ? `/api/events?${queryString}` : "/api/events";
  const router = useRouter();

  const {data, isLoading, error} = useSWR<{
    events: Event[];
    categories: string[];
  }>(url, fetcher);

  const hasActiveFilters = queryString.length > 0;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <SearchX className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Something went wrong</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Unable to load events. Please try again later.
        </p>
        <Button variant="outline" onClick={() => router.refresh()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <>
      <EventsSearch categories={data?.categories || []} />

      {isLoading ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading events...
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({length: 6}).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : data?.events && data.events.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={queryString}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}>
            {/* Results count + active filter indicator */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{data.events.length}</span> event
                {data.events.length !== 1 ? "s" : ""} found
                {hasActiveFilters && <span className="ml-1 text-primary">· filtered</span>}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => router.push("/events")}>
                  Clear filters ✕
                </Button>
              )}
            </div>

            {/* Event grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.3, delay: i * 0.05}}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-muted p-5">
            <Calendar className="h-10 w-10 text-muted-foreground/60" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No Events Found</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            {hasActiveFilters
              ? "No events match your current filters. Try adjusting your search."
              : "There are no upcoming events right now. Check back soon!"}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={() => router.push("/events")}>
              Clear filters
            </Button>
          )}
        </motion.div>
      )}
    </>
  );
}
