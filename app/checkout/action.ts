"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import z from "zod";

const checkoutSchema = z.object({
  // Assuming simple shipping address fields; adjust as needed for your form
  street: z.string().min(1, "Street address is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State/Province is required."),
  postalCode: z.string().min(1, "Postal code is required."),
  country: z.string().min(1, "Country is required."),
});

// The Server Action for Checkout
export const checkout = async (state: any, formData: FormData) => {
  const userId = "clxi8v09c000008l414y5e36k"; // Hardcoded for demo; replace with auth logic

  // 1. Prepare data for Zod parsing
  const rawData = {
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
  };

  // 2. Validate the data
  const validatedData = checkoutSchema.safeParse(rawData);

  // 3. Handle validation errors
  if (!validatedData.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  // 4. If validation passes, proceed
  const shippingAddress = validatedData.data; // This will be stored as JSON in the Order

  try {
    // Use a transaction for atomicity (create order, order items, update stock, clear cart)
    const result = await prisma.$transaction(async (tx) => {
      // Find the user's cart
      const cart = await tx.cart.findUnique({
        where: { userId: userId },
        include: {
          items: {
            include: { product: true }, // Need product for price, name, stock
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty or does not exist.");
      }

      // Calculate total amount
      let totalAmount = new Prisma.Decimal(0);
      for (const item of cart.items) {
        // Check stock
        if (item.product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`
          );
        }
        totalAmount = totalAmount.add(item.product.price.mul(item.quantity));
      }

      // Create the Order
      const order = await tx.order.create({
        data: {
          userId: userId,
          status: "PENDING", // Initial status; update after payment if needed
          totalAmount: totalAmount,
          shippingAddress: shippingAddress, // Stored as JSON
        },
      });

      // Create OrderItems (snapshot data)
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          },
        });

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear the cart items (keep the cart itself)
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    console.log(`Order created successfully: ${result.id}`);

    return {
      success: true,
      message: "Checkout successful! Order created.",
      orderId: result.id,
    };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred during checkout.",
    };
  }
};
