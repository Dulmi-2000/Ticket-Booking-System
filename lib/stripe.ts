import "server-only"

import Stripe from "stripe"

let client: Stripe | null = null

/** Lazy init so importing API routes does not require env at module parse time. */
export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Add it to .env.local for Stripe refunds and webhooks."
      )
    }
    client = new Stripe(key)
  }
  return client
}
