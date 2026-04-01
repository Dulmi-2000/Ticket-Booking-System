import { query, queryOne, execute } from "../db"
import type { Event } from "../types"
import { v4 as uuidv4 } from "uuid"

interface EventRow {
  id: string
  title: string
  description: string
  venue: string
  location: string
  date: string
  time: string
  price_cents: number
  total_tickets: number
  available_tickets: number
  image_url: string
  category: string
  is_featured: number
  created_at: string
  updated_at: string
}

function rowToEvent(row: EventRow): Event {
  return {
    ...row,
    date: new Date(row.date),
    is_featured: Boolean(row.is_featured),
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }
}

export async function getAllEvents(): Promise<Event[]> {
  const rows = await query<EventRow>(
    "SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC"
  )
  return rows.map(rowToEvent)
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const rows = await query<EventRow>(
    "SELECT * FROM events WHERE is_featured = 1 AND date >= CURDATE() ORDER BY date ASC LIMIT 6"
  )
  return rows.map(rowToEvent)
}

export async function getEventById(id: string): Promise<Event | null> {
  const row = await queryOne<EventRow>(
    "SELECT * FROM events WHERE id = ?",
    [id]
  )
  return row ? rowToEvent(row) : null
}

export async function searchEvents(
  searchQuery?: string,
  category?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<Event[]> {
  let sql = "SELECT * FROM events WHERE date >= CURDATE()"
  const params: unknown[] = []

  if (searchQuery) {
    sql += " AND (title LIKE ? OR description LIKE ? OR venue LIKE ? OR location LIKE ?)"
    const like = `%${searchQuery}%`
    params.push(like, like, like, like)
  }

  if (category && category !== "all") {
    sql += " AND category = ?"
    params.push(category)
  }

  if (dateFrom) {
    sql += " AND date >= ?"
    params.push(dateFrom)
  }

  if (dateTo) {
    sql += " AND date <= ?"
    params.push(dateTo)
  }

  sql += " ORDER BY date ASC"

  const rows = await query<EventRow>(sql, params)
  return rows.map(rowToEvent)
}

export async function getEventCategories(): Promise<string[]> {
  const rows = await query<{ category: string }>(
    "SELECT DISTINCT category FROM events ORDER BY category"
  )
  return rows.map((r) => r.category)
}

export async function createEvent(data: {
  title: string
  description: string
  venue: string
  location: string
  date: string
  time: string
  price_cents: number
  total_tickets: number
  image_url: string
  category: string
  is_featured?: boolean
}): Promise<Event> {
  const id = uuidv4()
  const now = new Date().toISOString().slice(0, 19).replace("T", " ")

  await execute(
    `INSERT INTO events (id, title, description, venue, location, date, time, price_cents, total_tickets, available_tickets, image_url, category, is_featured, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.title,
      data.description,
      data.venue,
      data.location,
      data.date,
      data.time,
      data.price_cents,
      data.total_tickets,
      data.total_tickets,
      data.image_url,
      data.category,
      data.is_featured ? 1 : 0,
      now,
      now,
    ]
  )

  const event = await getEventById(id)
  if (!event) throw new Error("Failed to create event")
  return event
}

export async function updateEvent(
  id: string,
  data: Partial<{
    title: string
    description: string
    venue: string
    location: string
    date: string
    time: string
    price_cents: number
    total_tickets: number
    available_tickets: number
    image_url: string
    category: string
    is_featured: boolean
  }>
): Promise<Event | null> {
  const updates: string[] = []
  const params: unknown[] = []

  if (data.title !== undefined) {
    updates.push("title = ?")
    params.push(data.title)
  }
  if (data.description !== undefined) {
    updates.push("description = ?")
    params.push(data.description)
  }
  if (data.venue !== undefined) {
    updates.push("venue = ?")
    params.push(data.venue)
  }
  if (data.location !== undefined) {
    updates.push("location = ?")
    params.push(data.location)
  }
  if (data.date !== undefined) {
    updates.push("date = ?")
    params.push(data.date)
  }
  if (data.time !== undefined) {
    updates.push("time = ?")
    params.push(data.time)
  }
  if (data.price_cents !== undefined) {
    updates.push("price_cents = ?")
    params.push(data.price_cents)
  }
  if (data.total_tickets !== undefined) {
    updates.push("total_tickets = ?")
    params.push(data.total_tickets)
  }
  if (data.available_tickets !== undefined) {
    updates.push("available_tickets = ?")
    params.push(data.available_tickets)
  }
  if (data.image_url !== undefined) {
    updates.push("image_url = ?")
    params.push(data.image_url)
  }
  if (data.category !== undefined) {
    updates.push("category = ?")
    params.push(data.category)
  }
  if (data.is_featured !== undefined) {
    updates.push("is_featured = ?")
    params.push(data.is_featured ? 1 : 0)
  }

  if (updates.length === 0) return getEventById(id)

  const now = new Date().toISOString().slice(0, 19).replace("T", " ")
  updates.push("updated_at = ?")
  params.push(now)
  params.push(id)

  await execute(`UPDATE events SET ${updates.join(", ")} WHERE id = ?`, params)

  return getEventById(id)
}

export async function deleteEvent(id: string): Promise<void> {
  await execute("DELETE FROM events WHERE id = ?", [id])
}

export async function decrementAvailableTickets(
  eventId: string,
  quantity: number
): Promise<boolean> {
  const result = await execute(
    "UPDATE events SET available_tickets = available_tickets - ? WHERE id = ? AND available_tickets >= ?",
    [quantity, eventId, quantity]
  )
  return result.affectedRows > 0
}

export async function incrementAvailableTickets(
  eventId: string,
  quantity: number
): Promise<void> {
  await execute(
    "UPDATE events SET available_tickets = available_tickets + ? WHERE id = ?",
    [quantity, eventId]
  )
}

export async function getEventsCount(): Promise<number> {
  const rows = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM events"
  )
  return rows[0]?.count || 0
}

export async function getUpcomingEventsCount(): Promise<number> {
  const rows = await query<{ count: number }>(
    "SELECT COUNT(*) as count FROM events WHERE date >= CURDATE()"
  )
  return rows[0]?.count || 0
}
