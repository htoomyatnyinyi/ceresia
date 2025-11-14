"use client";

import { useActionState } from "react";
import { checkout } from "./action"; // Assuming your server action is in ./actions.ts

// Define the shape of the state returned by the Server Action
interface CheckoutState {
  success: boolean;
  message: string;
  orderId?: string;
  errors?: { [key: string]: string[] | undefined };
}

// Initial state for the useActionState hook
const initialState: CheckoutState = {
  success: false,
  message: "",
};

const CheckoutForm = () => {
  // useActionState hook takes the Server Action and the initial state
  const [state, action, isPending] = useActionState(checkout, initialState);

  // Helper function to check if a specific field has an error
  const getFieldError = (fieldName: keyof typeof initialState.errors) => {
    return state.errors?.[fieldName]?.[0];
  };

  return (
    <div className="max-w-xl mx-auto p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-sky-500">Checkout</h2>

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
          {state.orderId && (
            <p className="text-sm">Order ID: **{state.orderId}**</p>
          )}
        </div>
      )}

      {/* 🛒 The Form Element */}
      <form action={action} className="space-y-4">
        <h3 className="text-xl font-semibold mt-6 mb-4 border-b pb-2">
          Shipping Address
        </h3>

        {/* --- Street Field --- */}
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-sky-700"
          >
            Street Address
          </label>
          <input
            type="text"
            id="street"
            name="street"
            required
            className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
            disabled={isPending}
          />
          {/* {getFieldError("street") && (
            <p className="text-red-500 text-xs mt-1">
              {getFieldError("street")}
            </p>
          )} */}
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
            className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
            disabled={isPending}
          />
          {/* {getFieldError("city") && (
            <p className="text-red-500 text-xs mt-1">{getFieldError("city")}</p>
          )} */}
        </div>

        {/* --- State/Postal Code Row --- */}
        <div className="grid grid-cols-2 gap-4">
          {/* State Field */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-sky-700"
            >
              State/Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              required
              className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
              disabled={isPending}
            />
            {/* {getFieldError("state") && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError("state")}
              </p>
            )} */}
          </div>

          {/* Postal Code Field */}
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-sky-700"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              required
              className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
              disabled={isPending}
            />
            {/* {getFieldError("postalCode") && (
              <p className="text-red-500 text-xs mt-1">
                {getFieldError("postalCode")}
              </p>
            )} */}
          </div>
        </div>

        {/* --- Country Field --- */}
        <div>
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
            className="mt-1 block w-full border border-sky-300 rounded-md shadow-sm p-2"
            disabled={isPending}
          />
          {/* {getFieldError("country") && (
            <p className="text-red-500 text-xs mt-1">
              {getFieldError("country")}
            </p>
          )} */}
        </div>

        {/* 🚀 Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 mt-6 rounded-md font-semibold text-white transition-colors ${
            isPending
              ? "bg-sky-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isPending ? "Processing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
// "use client";

// import { useActionState } from "react";
// import { checkout } from "./action";

// const CheckoutForm = () => {
//   const [state, action, pending] = useActionState(checkout, null);
//   return (
//     <div>
//       <form action={action}>
//         <input type="text" />
//         <input type="text" />
//         <input type="text" />
//       </form>
//     </div>
//   );
// };

// export default CheckoutForm;
