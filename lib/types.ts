export type UserRole = "user" | "admin"

export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  role: UserRole
  created_at: Date
  updated_at: Date
}

export interface Event {
  id: string
  title: string
  description: string
  venue: string
  location: string
  date: Date
  time: string
  price_cents: number
  total_tickets: number
  available_tickets: number
  image_url: string
  category: string
  is_featured: boolean
  created_at: Date
  updated_at: Date
}

export type BookingStatus = "confirmed" | "cancelled" | "pending"

export interface Booking {
  id: string
  user_id: string
  event_id: string
  quantity: number
  total_price_cents: number
  status: BookingStatus
  stripe_payment_intent_id: string | null
  booked_at: Date
  cancelled_at: Date | null
}

export interface BookingWithEvent extends Booking {
  event: Event
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  exp: number
  iat: number
}

export interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
  }
  token: string
}
