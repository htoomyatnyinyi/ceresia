// components/forms/ProductForm.tsx
"use client";

import React, { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/server-actions/product";

// TypeScript interface for product data passed to the form
interface ProductFormProps {
  productId?: string;
  isNew: boolean;
  initialData?: {
    name: string;
    description?: string | null;
    price: string;
    stock: string;
    imageUrl?: string | null;
  };
}

export default function ProductForm({
  productId,
  isNew,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for form inputs
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    stock: initialData?.stock || "",
    imageUrl: initialData?.imageUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null); // Clear errors on change
    setSuccess(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Input validation (basic check)
    if (!formData.name || !formData.price || !formData.stock) {
      setError("Name, Price, and Stock are required.");
      return;
    }

    const action = isNew
      ? createProduct(formData)
      : updateProduct(productId!, formData); // '!' asserts productId exists if not new

    startTransition(async () => {
      const result = await action;

      if (result.success) {
        setSuccess(result.message);
        // Redirect on successful creation, or stay on page for editing
        if (isNew) {
          router.push("/dashboard/products");
        } else {
          router.refresh(); // Refresh data after update
        }
      } else {
        setError(result.message);
      }
    });
  };

  // Handle Delete Action
  const handleDelete = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProduct(productId!);
      if (result.success) {
        alert(result.message);
        router.push("/dashboard/products");
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Feedback Messages */}
      {error && (
        <p className="text-red-600 border border-red-200 p-2 rounded">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 border border-green-200 p-2 rounded">
          {success}
        </p>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isPending}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isPending}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            disabled={isPending}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Stock */}
        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Stock Quantity
          </label>
          <input
            type="number"
            name="stock"
            id="stock"
            value={formData.stock}
            onChange={handleChange}
            disabled={isPending}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="text"
          name="imageUrl"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          disabled={isPending}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* Submit & Delete Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="submit"
          disabled={isPending}
          className={`px-4 py-2 rounded font-semibold text-white ${
            isPending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPending
            ? "Processing..."
            : isNew
            ? "Create Product"
            : "Save Changes"}
        </button>

        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className={`px-4 py-2 rounded font-semibold text-white ${
              isPending ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isPending ? "Deleting..." : "Delete Product"}
          </button>
        )}
      </div>
    </form>
  );
}
