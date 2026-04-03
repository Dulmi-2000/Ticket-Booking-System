// "use client"

// import { useRouter, useSearchParams } from "next/navigation"
// import { useState, useTransition } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Search, X } from "lucide-react"

// interface EventsSearchProps {
//   categories: string[]
// }

// export function EventsSearch({ categories }: EventsSearchProps) {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const [isPending, startTransition] = useTransition()

//   const [query, setQuery] = useState(searchParams.get("q") || "")
//   const [category, setCategory] = useState(
//     searchParams.get("category") || "all"
//   )
//   const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "")
//   const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "")

//   const handleSearch = () => {
//     const params = new URLSearchParams()
//     if (query) params.set("q", query)
//     if (category && category !== "all") params.set("category", category)
//     if (dateFrom) params.set("dateFrom", dateFrom)
//     if (dateTo) params.set("dateTo", dateTo)

//     startTransition(() => {
//       router.push(`/events?${params.toString()}`)
//     })
//   }

//   const handleClear = () => {
//     setQuery("")
//     setCategory("all")
//     setDateFrom("")
//     setDateTo("")
//     startTransition(() => {
//       router.push("/events")
//     })
//   }

//   const hasFilters = query || category !== "all" || dateFrom || dateTo

//   return (
//     <div className="mb-8 space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
//       <div className="flex flex-col gap-4 md:flex-row">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search events, venues, or locations..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             className="pl-10"
//           />
//         </div>
//         <Select value={category} onValueChange={setCategory}>
//           <SelectTrigger className="w-full md:w-48">
//             <SelectValue placeholder="Category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Categories</SelectItem>
//             {categories.map((cat) => (
//               <SelectItem key={cat} value={cat}>
//                 {cat}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex flex-col gap-4 md:flex-row md:items-end">
//         <div className="flex flex-1 gap-4">
//           <div className="flex-1">
//             <label className="mb-1.5 block text-sm font-medium text-foreground">
//               From Date
//             </label>
//             <Input
//               type="date"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//             />
//           </div>
//           <div className="flex-1">
//             <label className="mb-1.5 block text-sm font-medium text-foreground">
//               To Date
//             </label>
//             <Input
//               type="date"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <Button onClick={handleSearch} disabled={isPending} className="flex-1 md:flex-none">
//             {isPending ? "Searching..." : "Search"}
//           </Button>
//           {hasFilters && (
//             <Button variant="outline" onClick={handleClear} className="gap-2">
//               <X className="h-4 w-4" />
//               Clear
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState, useTransition} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Search, X, SlidersHorizontal, Calendar, Tag, Loader2} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";

interface EventsSearchProps {
  categories: string[];
}

export function EventsSearch({categories}: EventsSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(
    !!(searchParams.get("dateFrom") || searchParams.get("dateTo") || searchParams.get("category")),
  );

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "all") params.set("category", category);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    startTransition(() => {
      router.push(`/events?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setQuery("");
    setCategory("all");
    setDateFrom("");
    setDateTo("");
    startTransition(() => {
      router.push("/events");
    });
  };

  const activeFilterCount = [query, category !== "all" ? category : "", dateFrom, dateTo].filter(
    Boolean,
  ).length;

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Main search row */}
      <div className="flex items-center gap-2 p-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events, venues, or locations..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="pl-10 h-11 border-0 bg-muted/50 rounded-xl focus-visible:ring-1 focus-visible:bg-background transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters toggle */}
        <Button
          variant="outline"
          size="sm"
          className={`h-11 min-w-[120px] gap-2 rounded-xl px-8 shrink-0 transition-colors ${
            showFilters || activeFilterCount > 0
              ? "border-primary/50 bg-primary/5 text-primary hover:bg-primary/10"
              : ""
          }`}
          onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Search button */}
        <Button
          onClick={handleSearch}
          disabled={isPending}
          className="h-11 min-w-[120px] rounded-xl px-5 shrink-0 gap-2">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{isPending ? "Searching..." : "Search"}</span>
        </Button>
      </div>

      {/* Expandable filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.2, ease: "easeInOut"}}>
            <div className="border-t border-border px-3 pb-3 pt-3 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" /> Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-10 w-full rounded-xl bg-muted/50 border-0 focus:ring-1">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* From date */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" text-muted-foreground /> From Date
                  </label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="h-10 w-full rounded-xl bg-muted/50 border-0 focus-visible:ring-1"
                  />
                </div>

                {/* To date */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> To Date
                  </label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="h-10 w-full rounded-xl bg-muted/50 border-0 focus-visible:ring-1"
                  />
                </div>
              </div>

              {/* Active filter chips + clear */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">Active:</span>
                  {query && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                      "{query}"
                      <button onClick={() => setQuery("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {category !== "all" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {category}
                      <button onClick={() => setCategory("all")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {dateFrom && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                      From: {dateFrom}
                      <button onClick={() => setDateFrom("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {dateTo && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                      To: {dateTo}
                      <button onClick={() => setDateTo("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={handleClear}
                    className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                    <X className="h-3 w-3" /> Clear all
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
