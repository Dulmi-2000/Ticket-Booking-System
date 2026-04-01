import { backendGet, backendPost, backendPut, backendDelete } from "./client"
import type { Event } from "../types"

interface BackendEvent {
  id: number
  title: string
  description: string
  venue: string
  location: string
  date: string
  time: string
  priceCents: number
  totalTickets: number
  availableTickets: number
  imageUrl: string
  category: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

function mapEvent(e: BackendEvent): Event {
  return {
    id: String(e.id),
    title: e.title || "",
    description: e.description || "",
    venue: e.venue || "",
    location: e.location || "",
    date: new Date(e.date),
    time: e.time || "",
    price_cents: e.priceCents,
    total_tickets: e.totalTickets,
    available_tickets: e.availableTickets,
    image_url: e.imageUrl || "",
    category: e.category || "",
    is_featured: e.isFeatured || false,
    created_at: new Date(e.createdAt),
    updated_at: new Date(e.updatedAt),
  }
}

export async function getAllEvents(): Promise<Event[]> {
  const data = await backendGet<{ events: BackendEvent[] }>("/api/events")
  return data.events.map(mapEvent)
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const data = await backendGet<{ events: BackendEvent[] }>("/api/events/featured")
  return data.events.map(mapEvent)
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const e = await backendGet<BackendEvent>(`/api/events/${id}`)
    return mapEvent(e)
  } catch {
    return null
  }
}

export async function searchEvents(
  searchQuery?: string,
  category?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<Event[]> {
  const params = new URLSearchParams()
  if (searchQuery) params.set("q", searchQuery)
  if (category) params.set("category", category)
  if (dateFrom) params.set("dateFrom", dateFrom)
  if (dateTo) params.set("dateTo", dateTo)
  const data = await backendGet<{ events: BackendEvent[] }>(`/api/events?${params.toString()}`)
  return data.events.map(mapEvent)
}

export async function getEventCategories(): Promise<string[]> {
  const data = await backendGet<{ events: BackendEvent[]; categories: string[] }>("/api/events")
  return data.categories
}

export async function createEvent(data: {
  title: string
  description: string
  venue: string
  location: string
  date: string
  time: string
  priceCents: number
  totalTickets: number
  imageUrl: string
  category: string
  isFeatured?: boolean
}, token?: string): Promise<Event> {
  const res = await backendPost<{ event: BackendEvent }>("/api/events", {
    title: data.title,
    description: data.description,
    venue: data.venue,
    location: data.location,
    date: data.date,
    time: data.time,
    priceCents: data.priceCents,
    totalTickets: data.totalTickets,
    imageUrl: data.imageUrl,
    category: data.category,
    isFeatured: data.isFeatured || false,
  }, token)
  return mapEvent(res.event)
}

export async function updateEvent(
  id: string,
  data: Record<string, unknown>,
  token?: string
): Promise<Event | null> {
  try {
    const res = await backendPut<{ event: BackendEvent }>(`/api/events/${id}`, data, token)
    return mapEvent(res.event)
  } catch {
    return null
  }
}

export async function deleteEvent(id: string, token?: string): Promise<void> {
  await backendDelete(`/api/events/${id}`, token)
}

export async function decrementAvailableTickets(
  eventId: string,
  quantity: number
): Promise<boolean> {
  // This is handled server-side during booking creation
  return true
}

export async function incrementAvailableTickets(
  eventId: string,
  quantity: number
): Promise<void> {
  // This is handled server-side during booking cancellation
}

export async function getEventsCount(): Promise<number> {
  const events = await getAllEvents()
  return events.length
}

export async function getUpcomingEventsCount(): Promise<number> {
  const events = await getAllEvents()
  return events.length
}
