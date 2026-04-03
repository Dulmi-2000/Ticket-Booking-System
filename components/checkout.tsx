"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {CreditCard, Lock, Sparkles} from "lucide-react";
import {startEventCheckoutSession} from "@/app/actions/checkout";
import {toast} from "sonner";

interface CheckoutProps {
  eventId: string;
  quantity: number;
}

export function Checkout({eventId, quantity}: CheckoutProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.cardNumber.length < 16) {
      toast.error("Please enter a valid card number");
      return;
    }

    setIsLoading(true);
    try {
      // Create the booking in the backend via server action
      const bookingId = await startEventCheckoutSession(eventId, quantity);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success("Payment successful! Redirecting...");

      // Redirect to the success page
      router.push(`/booking/success?bookingId=${bookingId}`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex rounded-lg bg-primary/5 p-4 text-sm text-primary flex-row gap-2">
        <Sparkles className="mb-1 h-4 w-4" />
        This is a <strong>Mock Checkout</strong>. No real payment will be processed.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name on Card</Label>
          <Input
            id="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              placeholder="4242 4242 4242 4242"
              required
              maxLength={19}
              value={formData.cardNumber}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "");
                setFormData({...formData, cardNumber: val});
              }}
            />
            <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              required
              maxLength={5}
              value={formData.expiry}
              onChange={e => setFormData({...formData, expiry: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <div className="relative">
              <Input
                id="cvc"
                placeholder="123"
                required
                maxLength={3}
                value={formData.cvc}
                onChange={e => setFormData({...formData, cvc: e.target.value})}
              />
              <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {isLoading ? "Processing..." : "Confirm Payment"}
        </Button>

        <p className="flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          Secure SSL encrypted payment
        </p>
      </form>
    </div>
  );
}
