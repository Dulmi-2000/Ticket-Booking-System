import { backendGet, backendPost } from "./client"
import type { Booking, BookingWithEvent, BookingStatus, Event } from "../types"

interface BackendBooking {
  id: number
  userId: number
  eventId: number
  eventTitle: string
  eventVenue: string
  eventLocation: string
  quantity: number
  totalPriceCents: number
  status: string
  stripePaymentIntentId: string | null
  bookedAt: string
  cancelledAt: string | null
  event: {
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
  } | null
}

function mapBooking(b: BackendBooking): Booking {
  return {
    id: String(b.id),
    user_id: String(b.userId),
    event_id: String(b.eventId),
    quantity: b.quantity,
    total_price_cents: b.totalPriceCents,
    status: b.status as BookingStatus,
    stripe_payment_intent_id: b.stripePaymentIntentId,
    booked_at: new Date(b.bookedAt),
    cancelled_at: b.cancelledAt ? new Date(b.cancelledAt) : null,
  }
}

function mapBookingWithEvent(b: BackendBooking): BookingWithEvent {
  const event: Event = b.event
    ? {
        id: String(b.event.id),
        title: b.event.title || "",
        description: b.event.description || "",
        venue: b.event.venue || "",
        location: b.event.location || "",
        date: new Date(b.event.date),
        time: b.event.time || "",
        price_cents: b.event.priceCents,
        total_tickets: b.event.totalTickets,
        available_tickets: b.event.availableTickets,
        image_url: b.event.imageUrl || "",
        category: b.event.category || "",
        is_featured: b.event.isFeatured || false,
        created_at: new Date(b.event.createdAt),
        updated_at: new Date(b.event.updatedAt),
      }
    : {
        id: String(b.eventId),
        title: b.eventTitle || "",
        description: "",
        venue: b.eventVenue || "",
        location: b.eventLocation || "",
        date: new Date(),
        time: "",
        price_cents: 0,
        total_tickets: 0,
        available_tickets: 0,
        image_url: "",
        category: "",
        is_featured: false,
        created_at: new Date(),
        updated_at: new Date(),
      }

  return {
    ...mapBooking(b),
    event,
  }
}

export async function createBooking(data: {
  userId: string
  eventId: string
  quantity: number
  totalPriceCents: number
  stripePaymentIntentId?: string
  status?: BookingStatus
}, token?: string): Promise<Booking> {
  const res = await backendPost<BackendBooking>("/api/bookings", {
    eventId: Number(data.eventId),
    quantity: data.quantity,
  }, token)
  return mapBooking(res)
}

export async function getBookingById(id: string, token?: string): Promise<Booking | null> {
  try {
    const res = await backendGet<BackendBooking>(`/api/bookings/${id}`, token)
    return mapBooking(res)
  } catch {
    return null
  }
}

export async function getBookingsByUserId(
  userId: string,
  token?: string
): Promise<BookingWithEvent[]> {
  const data = await backendGet<{ bookings: BackendBooking[] }>("/api/bookings/me", token)
  return data.bookings.map(mapBookingWithEvent)
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  token?: string
): Promise<void> {
  if (status === "cancelled") {
    await backendPost(`/api/bookings/${id}/cancel`, {}, token)
  }
}

export async function updateBookingPaymentIntent(
  id: string,
  paymentIntentId: string
): Promise<void> {
  // Handled by webhook on the backend
}

export async function getBookingByPaymentIntent(
  paymentIntentId: string
): Promise<Booking | null> {
  return null
}

export async function getAllBookings(token?: string): Promise<BookingWithEvent[]> {
  const data = await backendGet<{ bookings: BackendBooking[] }>("/api/bookings", token)
  return data.bookings.map(mapBookingWithEvent)
}

export async function getBookingsCount(token?: string): Promise<number> {
  const data = await backendGet<any>("/api/bookings/stats", token)
  return data.totalBookings || 0
}

export async function getConfirmedBookingsCount(token?: string): Promise<number> {
  const data = await backendGet<any>("/api/bookings/stats", token)
  return data.confirmedBookings || 0
}

export async function getTotalRevenue(token?: string): Promise<number> {
  const data = await backendGet<any>("/api/bookings/stats", token)
  return data.totalRevenue || 0
}

export async function getRecentBookings(
  limit: number = 10,
  token?: string
): Promise<BookingWithEvent[]> {
  const data = await backendGet<{ bookings: BackendBooking[] }>("/api/bookings/recent", token)
  return data.bookings.map(mapBookingWithEvent)
}

export async function canCancelBooking(bookingId: string): Promise<boolean> {
  return true
}
