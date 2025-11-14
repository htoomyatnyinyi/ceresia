// app/checkout/page.tsx
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useActionState } from "react";
import CheckoutForm from "./CheckoutForm"; // The Stripe-specific component
import { checkout } from "./action"; // The FIXED Server Action

// --- Interfaces for Type Safety ---
interface CheckoutState {
  success: boolean;
  message: string;
  orderId?: string;
  clientSecret?: string;
  errors?: { [key: string]: string[] | undefined };
}

// Initial state
const initialState: CheckoutState = {
  success: false,
  message: "",
};

// --- Load Stripe Promise ---
// Ensure this key is available in your .env file
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// --- Main Page Component ---
export default function CheckoutPage() {
  const [state, action, isPending] = useActionState(checkout, initialState);

  // Helper for error display (adjust keys to match your schema)
  const getFieldError = (
    fieldName: "street" | "city" | "state" | "postalCode" | "country"
  ) => {
    return state.errors?.[fieldName]?.[0];
  };

  // 1. If we have a clientSecret, render the Stripe Payment View
  if (state.clientSecret && stripePromise) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">
          Secure Payment
        </h2>
        {/* The clientSecret configures the Elements provider */}
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: state.clientSecret }}
        >
          <CheckoutForm />
        </Elements>
      </div>
    );
  }

  // 2. Otherwise, render the initial Shipping Form View
  return (
    <div className="max-w-xl mx-auto p-6 shadow-lg rounded-lg ">
      <h2 className="text-3xl font-extrabold mb-6 text-sky-700">
        Shipping Details
      </h2>

      {/* 🔔 Feedback Message Display */}
      {state.message && (
        <div
          className={`p-3 mb-4 rounded-md ${
            state.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <p className="font-semibold">{state.message}</p>
        </div>
      )}

      {/* 🛒 Shipping Form (Calls the Server Action) */}
      <form action={action} className="space-y-4">
        {/* --- Street Field --- */}
        <div>
          <label htmlFor="street" className="block text-sm font-medium ">
            Street Address
          </label>
          <input
            type="text"
            id="street"
            name="street"
            required
            disabled={isPending}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
          {getFieldError("street") && (
            <p className="text-red-500 text-xs mt-1">
              {getFieldError("street")}
            </p>
          )}
        </div>

        {/* --- City Field --- */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-sky-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            disabled={isPending}
            className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
          />
          {getFieldError("city") && (
            <p className="text-red-500 text-xs mt-1">{getFieldError("city")}</p>
          )}

          <label
            htmlFor="state"
            className="block text-sm font-medium text-sky-700"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            required
            disabled={isPending}
            className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
          />
          {getFieldError("state") && (
            <p className="text-red-500 text-xs mt-1">
              {getFieldError("state")}
            </p>
          )}

          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-sky-700"
          >
            postalCode
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            required
            disabled={isPending}
            className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
          />

          <label
            htmlFor="country"
            className="block text-sm font-medium text-sky-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            required
            disabled={isPending}
            className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* --- State/Postal/Country fields would follow here --- */}
        {/* (Add fields for state, postalCode, and country to match your schema) */}

        {/* 🚀 Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 mt-6 rounded-md font-bold text-white transition-colors ${
            isPending
              ? "bg-sky-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isPending ? "Creating Payment Intent..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}

// // app/checkout/page.tsx (example page component; adjust to your app)
// "use client";

// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { useEffect, useState } from "react";
// // import CheckoutForm from "@/components/CheckoutForm"; // Adjust path
// import CheckoutForm from "./CheckoutForm";
// import { initiateCheckout } from "@/app/actions/checkout"; // Adjust path

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// export default function CheckoutPage() {
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Assume shipping form here; for demo, hardcode or use a form
//   useEffect(() => {
//     // Simulate submitting shipping form
//     const formData = new FormData();
//     formData.append("street", "123 Example St");
//     formData.append("city", "Example City");
//     formData.append("state", "EX");
//     formData.append("postalCode", "12345");
//     formData.append("country", "US");

//     initiateCheckout(null, formData).then((result) => {
//       // console.log(result, "result", result);
//       if (result.success) {
//         setClientSecret(result.clientSecret!);
//       } else {
//         setError(result.message!);
//       }
//     });
//   }, []);

//   if (error) return <div>Error: {error}</div>;
//   if (!clientSecret) return <div>Loading...</div>;

//   return (
//     <Elements stripe={stripePromise} options={{ clientSecret }}>
//       <CheckoutForm clientSecret={clientSecret} />
//     </Elements>
//   );
// }
