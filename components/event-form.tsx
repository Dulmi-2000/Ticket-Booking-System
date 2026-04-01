"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { Event } from "@/lib/types"

interface EventFormProps {
  event?: Event
  isEditing?: boolean
}

const categories = [
  "Music",
  "Sports",
  "Theater",
  "Comedy",
  "Art",
  "Film",
  "Technology",
  "Food & Drink",
  "Wellness",
]

export function EventForm({ event, isEditing = false }: EventFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState(event?.title || "")
  const [description, setDescription] = useState(event?.description || "")
  const [venue, setVenue] = useState(event?.venue || "")
  const [location, setLocation] = useState(event?.location || "")
  const [date, setDate] = useState(
    event ? new Date(event.date).toISOString().split("T")[0] : ""
  )
  const [time, setTime] = useState(event?.time || "")
  const [priceStr, setPriceStr] = useState(
    event ? String(event.price_cents / 100) : ""
  )
  const [totalTickets, setTotalTickets] = useState(
    event ? String(event.total_tickets) : ""
  )
  const [imageUrl, setImageUrl] = useState(event?.image_url || "")
  const [category, setCategory] = useState(event?.category || "Music")
  const [isFeatured, setIsFeatured] = useState(event?.is_featured || false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const priceInCents = Math.round(parseFloat(priceStr) * 100)
      const payload = {
        title,
        description,
        venue,
        location,
        date,
        time,
        price_cents: priceInCents,
        total_tickets: parseInt(totalTickets, 10),
        image_url: imageUrl,
        category,
        is_featured: isFeatured,
      }

      const url = isEditing ? `/api/events/${event?.id}` : "/api/events"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save event")
      }

      toast.success(isEditing ? "Event updated!" : "Event created!")
      router.push("/admin/events")
      router.refresh()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Event Title</FieldLabel>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summer Music Festival"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event..."
                  rows={5}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </Field>

              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="featured">Featured Event</FieldLabel>
                <Switch
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Venue & Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="venue">Venue Name</FieldLabel>
                <Input
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Madison Square Garden"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="New York, NY"
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="time">Time</FieldLabel>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="price">Price ($)</FieldLabel>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={priceStr}
                    onChange={(e) => setPriceStr(e.target.value)}
                    placeholder="99.99"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tickets">Total Tickets</FieldLabel>
                  <Input
                    id="tickets"
                    type="number"
                    min="1"
                    value={totalTickets}
                    onChange={(e) => setTotalTickets(e.target.value)}
                    placeholder="500"
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/events")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEditing
              ? "Update Event"
              : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
