"use client"

import { useCallback } from "react"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startEventCheckoutSession } from "@/app/actions/checkout"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutProps {
  eventId: string
  quantity: number
}

export function Checkout({ eventId, quantity }: CheckoutProps) {
  const fetchClientSecret = useCallback(
    () => startEventCheckoutSession(eventId, quantity),
    [eventId, quantity]
  )

  return (
    <div id="checkout" className="rounded-lg bg-background">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
