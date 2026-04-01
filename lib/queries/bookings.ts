import { query, queryOne, execute } from "../db"
import type { Booking, BookingWithEvent, BookingStatus, Event } from "../types"
import { v4 as uuidv4 } from "uuid"

interface BookingRow {
  id: string
  user_id: string
  event_id: string
  quantity: number
  total_price_cents: number
  status: BookingStatus
  stripe_payment_intent_id: string | null
  booked_at: string
  cancelled_at: string | null
}

interface BookingWithEventRow extends BookingRow {
  event_title: string
  event_description: string
  event_venue: string
  event_location: string
  event_date: string
  event_time: string
  event_price_cents: number
  event_total_tickets: number
  event_available_tickets: number
  event_image_url: string
  event_category: string
  event_is_featured: number
  event_created_at: string
  event_updated_at: string
}

function rowToBooking(row: BookingRow): Booking {
  return {
    ...row,
    booked_at: new Date(row.booked_at),
    cancelled_at: row.cancelled_at ? new Date(row.cancelled_at) : null,
  }
}

function rowToBookingWithEvent(row: BookingWithEventRow): BookingWithEvent {
  const event: Event = {
    id: row.event_id,
    title: row.event_title,
    description: row.event_description,
    venue: row.event_venue,
    location: row.event_location,
    date: new Date(row.event_date),
    time: row.event_time,
    price_cents: row.event_price_cents,
    total_tickets: row.event_total_tickets,
    available_tickets: row.event_available_tickets,
    image_url: row.event_image_url,
    category: row.event_category,
    is_featured: Boolean(row.event_is_featured),
    created_at: new Date(row.event_created_at),
    updated_at: new Date(row.event_updated_at),
  }

  return {
    id: row.id,
    user_id: row.user_id,
    event_id: row.event_id,
    quantity: row.quantity,
    total_price_cents: row.total_price_cents,
    status: row.status,
    stripe_payment_intent_id: row.stripe_payment_intent_id,
    booked_at: new Date(row.booked_at),
    cancelled_at: row.cancelled_at ? new Date(row.cancelled_at) : null,
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
}): Promise<Booking> {
  const id = uuidv4()
  const now = new Date().toISOString().slice(0, 19).replace("T", " ")

  await execute(
    `INSERT INTO bookings (id, user_id, event_id, quantity, total_price_cents, status, stripe_payment_intent_id, booked_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.userId,
      data.eventId,
      data.quantity,
      data.totalPriceCents,
      data.status || "pending",
      data.stripePaymentIntentId || null,
      now,
    ]
  )

  const booking = await getBookingById(id)
  if (!booking) throw new Error("Failed to create booking")
  return booking
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const row = await queryOne<BookingRow>(
    "SELECT * FROM bookings WHERE id = ?",
    [id]
  )
  return row ? rowToBooking(row) : null
}

export async function getBookingsByUserId(
  userId: string
): Promise<BookingWithEvent[]> {
  const rows = await query<BookingWithEventRow>(
    `SELECT 
      b.*,
      e.title as event_title,
      e.description as event_description,
      e.venue as event_venue,
      e.location as event_location,
      e.date as event_date,
      e.time as event_time,
      e.price_cents as event_price_cents,
      e.total_tickets as event_total_tickets,
      e.available_tickets as event_available_tickets,
      e.image_url as event_image_url,
      e.category as event_category,
      e.is_featured as event_is_featured,
      e.created_at as event_created_at,
      e.updated_at as event_updated_at
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    WHERE b.user_id = ?
    ORDER BY b.booked_at DESC`,
    [userId]
  )
  return rows.map(rowToBookingWithEvent)
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<void> {
  const updates: string[] = ["status = ?"]
  const params: unknown[] = [status]

  if (status === "cancelled") {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ")
    updates.push("cancelled_at = ?")
    params.push(now)
  }

  params.push(id)

  await execute(`UPDATE bookings SET ${updates.join(", ")} WHERE id = ?`, params)
}

export async function updateBookingPaymentIntent(
  id: string,
  paymentIntentId: string
): Promise<void> {
  await execute(
    "UPDATE bookings SET stripe_payment_intent_id = ? WHERE id = ?",
    [paymentIntentId, id]
  )
}

export async function getBookingByPaymentIntent(
  paymentIntentId: string
): Promise<Booking | null> {
  const row = await queryOne<BookingRow>(
    "SELECT * FROM bookings WHERE stripe_payment_intent_id = ?",
    [paymentIntentId]
  )
  return row ? rowToBooking(row) : null
}

export async function getAllBookings(): Promise<BookingWithEvent[]> {
  const rows = await query<BookingWithEventRow>(
    `SELECT 
      b.*,
      e.title as event_title,
      e.description as event_description,
      e.venue as event_venue,
      e.location as event_location,
      e.date as event_date,
      e.time as event_time,
      e.price_cents as event_price_cents,
      e.total_tickets as event_total_tickets,
      e.available_tickets as event_available_tickets,
      e.image_url as event_image_url,
      e.category as event_category,
      e.is_featured as event_is_featured,
      e.created_at as event_created_at,
      e.updated_at as event_updated_at
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    ORDER BY b.booked_at DESC`
  )
  return rows.map(rowToBookingWithEvent)
}

export async function getBookingsCount(): Promise<number> {
  const rows = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM bookings"
  )
  return rows[0]?.count || 0
}

export async function getConfirmedBookingsCount(): Promise<number> {
  const rows = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'"
  )
  return rows[0]?.count || 0
}

export async function getTotalRevenue(): Promise<number> {
  const rows = await query<{ total: number | null }>(
    "SELECT SUM(total_price_cents) as total FROM bookings WHERE status = 'confirmed'"
  )
  return rows[0]?.total || 0
}

export async function getRecentBookings(
  limit: number = 10
): Promise<BookingWithEvent[]> {
  const rows = await query<BookingWithEventRow>(
    `SELECT 
      b.*,
      e.title as event_title,
      e.description as event_description,
      e.venue as event_venue,
      e.location as event_location,
      e.date as event_date,
      e.time as event_time,
      e.price_cents as event_price_cents,
      e.total_tickets as event_total_tickets,
      e.available_tickets as event_available_tickets,
      e.image_url as event_image_url,
      e.category as event_category,
      e.is_featured as event_is_featured,
      e.created_at as event_created_at,
      e.updated_at as event_updated_at
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    ORDER BY b.booked_at DESC
    LIMIT ?`,
    [limit]
  )
  return rows.map(rowToBookingWithEvent)
}

export async function canCancelBooking(bookingId: string): Promise<boolean> {
  const row = await queryOne<BookingWithEventRow>(
    `SELECT b.*, e.date as event_date
     FROM bookings b
     JOIN events e ON b.event_id = e.id
     WHERE b.id = ?`,
    [bookingId]
  )

  if (!row) return false
  if (row.status !== "confirmed") return false

  const eventDate = new Date(row.event_date)
  const now = new Date()
  const hoursUntilEvent =
    (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  return hoursUntilEvent >= 24
}
