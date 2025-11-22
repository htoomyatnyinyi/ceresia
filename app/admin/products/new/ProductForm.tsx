// app/admin/products/ProductForm.tsx
"use client";

import { useActionState } from "react";
// import { createProduct } from "./actions"; // Import server action
import { createProduct } from "./action";

// Define the shape of the result state from the server action
interface ActionState {
  success: boolean;
  message: string;
}

const ProductForm = () => {
  const initialState: ActionState = { success: false, message: "" };

  // Initialize useActionState
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createProduct,
    initialState
  );

  return (
    <div className="p-6 border rounded-lg shadow-xl  max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Product
      </h1>

      {/* Feedback Message */}
      {state.message && (
        <div
          className={`p-3 mb-4 rounded-md text-sm font-medium ${
            state.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <form action={action} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={pending}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Price Field */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            disabled={pending}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Stock Field */}
        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Stock Quantity
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            required
            disabled={pending}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Product Image (Optional)
          </label>
          <input
            id="image"
            name="image" // <-- Key used in the Server Action
            type="file"
            accept="image/*"
            disabled={pending}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            disabled={pending}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={pending}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ${
            pending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          }`}
        >
          {pending ? "Creating Product..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm; //
