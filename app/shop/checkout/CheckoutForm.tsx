// app/checkout/CheckoutForm.tsx (Client Component)
"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

// This component relies on the <Elements> provider for the clientSecret.
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // 1. Confirm the Payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe redirects here after successful payment or 3DS verification
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    // 2. Handle immediate errors (e.g., card declined)
    if (error) {
      setErrorMessage(
        error.message || "An unexpected error occurred during payment."
      );
    }
    // If successful, Stripe automatically handles the redirect.

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* The Stripe Payment Element UI */}
      <div className="border p-4 rounded-lg bg-gray-50">
        <PaymentElement />
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="p-3 text-sm font-medium text-red-700 bg-red-100 border border-red-200 rounded">
          {errorMessage}
        </div>
      )}

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 rounded-md font-bold text-white transition-colors ${
          !stripe || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-md"
        }`}
      >
        {loading ? "Completing Order..." : "Confirm & Pay"}
      </button>
    </form>
  );
};

export default CheckoutForm;
