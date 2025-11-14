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
// "use client";

// import {
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { useActionState } from "react";

// const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   console.log(elements, "element", stripe, "stripe");

//   // const [state, action, pending] = useActionState(, null);
//   return (
//     <div>
//       <form action="">
//         <input type="text" />
//         <input type="text" />
//         <PaymentElement />
//         {/* <button disabled={!stripe || loading}>Pay</button> */}
//       </form>
//     </div>
//   );
// };

// export default CheckoutForm;

// // // components/CheckoutForm.tsx (new client component for embedded form)
// // "use client";

// // import {
// //   PaymentElement,
// //   useElements,
// //   useStripe,
// // } from "@stripe/react-stripe-js";

// // import { useState } from "react";

// // const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
// //   const stripe = useStripe();
// //   const elements = useElements();
// //   console.log(stripe, elements, "stripe function at checkout form");

// //   const [errorMessage, setErrorMessage] = useState<string | null>(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (event: React.FormEvent) => {
// //     event.preventDefault();

// //     if (!stripe || !elements) return;

// //     setLoading(true);

// //     const { error } = await stripe.confirmPayment({
// //       elements,
// //       confirmParams: {
// //         return_url: `${window.location.origin}/checkout/success`, // Redirect after payment
// //       },
// //     });

// //     if (error) {
// //       setErrorMessage(error.message || "An error occurred.");
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <PaymentElement />
// //       {errorMessage && <div>{errorMessage}</div>}
// //       <p className="text-sky-400">
// //         Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur
// //         veritatis pariatur aut error fugit ratione nesciunt odit placeat facilis
// //         ut saepe at dignissimos, quis dolor laborum voluptatum sed temporibus!
// //         Ea.
// //       </p>
// //       <button disabled={!stripe || loading}>Pay</button>
// //     </form>
// //   );
// // };

// // export default CheckoutForm;

// // // "use client";

// // // import { useActionState } from "react";
// // // import { checkout } from "./action"; // Assuming your server action is in ./actions.ts

// // // // Define the shape of the state returned by the Server Action
// // // interface CheckoutState {
// // //   success: boolean;
// // //   message: string;
// // //   orderId?: string;
// // //   errors?: { [key: string]: string[] | undefined };
// // // }

// // // // Initial state for the useActionState hook
// // // const initialState: CheckoutState = {
// // //   success: false,
// // //   message: "",
// // // };

// // // const CheckoutForm = () => {
// // //   // useActionState hook takes the Server Action and the initial state
// // //   const [state, action, isPending] = useActionState(checkout, initialState);

// // //   // Helper function to check if a specific field has an error
// // //   const getFieldError = (fieldName: keyof typeof initialState.errors) => {
// // //     return state.errors?.[fieldName]?.[0];
// // //   };

// // //   return (
// // //     <div className="max-w-xl mx-auto p-6 shadow-lg rounded-lg">
// // //       <h2 className="text-2xl font-bold mb-6 text-sky-500">Checkout</h2>

// // //       {/* 🔔 Feedback Message Display */}
// // //       {state.message && (
// // //         <div
// // //           className={`p-3 mb-4 rounded-md ${
// // //             state.success
// // //               ? "bg-green-100 text-green-700"
// // //               : "bg-red-100 text-red-700"
// // //           }`}
// // //         >
// // //           <p className="font-semibold">{state.message}</p>
// // //           {state.orderId && (
// // //             <p className="text-sm">Order ID: **{state.orderId}**</p>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* 🛒 The Form Element */}
// // //       <form action={action} className="space-y-4">
// // //         <h3 className="text-xl font-semibold mt-6 mb-4 border-b pb-2">
// // //           Shipping Address
// // //         </h3>

// // //         {/* --- Street Field --- */}
// // //         <div>
// // //           <label
// // //             htmlFor="street"
// // //             className="block text-sm font-medium text-sky-700"
// // //           >
// // //             Street Address
// // //           </label>
// // //           <input
// // //             type="text"
// // //             id="street"
// // //             name="street"
// // //             required
// // //             className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
// // //             disabled={isPending}
// // //           />
// // //           {/* {getFieldError("street") && (
// // //             <p className="text-red-500 text-xs mt-1">
// // //               {getFieldError("street")}
// // //             </p>
// // //           )} */}
// // //         </div>

// // //         {/* --- City Field --- */}
// // //         <div>
// // //           <label
// // //             htmlFor="city"
// // //             className="block text-sm font-medium text-sky-700"
// // //           >
// // //             City
// // //           </label>
// // //           <input
// // //             type="text"
// // //             id="city"
// // //             name="city"
// // //             required
// // //             className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
// // //             disabled={isPending}
// // //           />
// // //           {/* {getFieldError("city") && (
// // //             <p className="text-red-500 text-xs mt-1">{getFieldError("city")}</p>
// // //           )} */}
// // //         </div>

// // //         {/* --- State/Postal Code Row --- */}
// // //         <div className="grid grid-cols-2 gap-4">
// // //           {/* State Field */}
// // //           <div>
// // //             <label
// // //               htmlFor="state"
// // //               className="block text-sm font-medium text-sky-700"
// // //             >
// // //               State/Province
// // //             </label>
// // //             <input
// // //               type="text"
// // //               id="state"
// // //               name="state"
// // //               required
// // //               className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
// // //               disabled={isPending}
// // //             />
// // //             {/* {getFieldError("state") && (
// // //               <p className="text-red-500 text-xs mt-1">
// // //                 {getFieldError("state")}
// // //               </p>
// // //             )} */}
// // //           </div>

// // //           {/* Postal Code Field */}
// // //           <div>
// // //             <label
// // //               htmlFor="postalCode"
// // //               className="block text-sm font-medium text-sky-700"
// // //             >
// // //               Postal Code
// // //             </label>
// // //             <input
// // //               type="text"
// // //               id="postalCode"
// // //               name="postalCode"
// // //               required
// // //               className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
// // //               disabled={isPending}
// // //             />
// // //             {/* {getFieldError("postalCode") && (
// // //               <p className="text-red-500 text-xs mt-1">
// // //                 {getFieldError("postalCode")}
// // //               </p>
// // //             )} */}
// // //           </div>
// // //         </div>

// // //         {/* --- Country Field --- */}
// // //         <div>
// // //           <label
// // //             htmlFor="country"
// // //             className="block text-sm font-medium text-sky-700"
// // //           >
// // //             Country
// // //           </label>
// // //           <input
// // //             type="text"
// // //             id="country"
// // //             name="country"
// // //             required
// // //             className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
// // //             disabled={isPending}
// // //           />
// // //           {/* {getFieldError("country") && (
// // //             <p className="text-red-500 text-xs mt-1">
// // //               {getFieldError("country")}
// // //             </p>
// // //           )} */}
// // //         </div>

// // //         {/* 🚀 Submit Button */}
// // //         <button
// // //           type="submit"
// // //           disabled={isPending}
// // //           className={`w-full py-3 mt-6 rounded-md font-semibold text-white transition-colors ${
// // //             isPending
// // //               ? "bg-sky-400 cursor-not-allowed"
// // //               : "bg-indigo-600 hover:bg-indigo-700"
// // //           }`}
// // //         >
// // //           {isPending ? "Processing Order..." : "Place Order"}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // export default CheckoutForm;
