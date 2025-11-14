"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { stripe } from "@/lib/stripe";
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
export const checkout = async (
  state: any,
  formData: FormData
): Promise<any> => {
  const userId = "clxi8v09c000008l414y5e36k"; // Hardcoded for demo; replace with auth logic

  // 1. Prepare and Validate Data
  const rawData = {
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
  };

  const validatedData = checkoutSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const shippingAddress = validatedData.data;

  try {
    // Use a transaction for atomicity (create order, order items, update stock, clear cart, create PaymentIntent)
    const { order, paymentIntent } = await prisma.$transaction(async (tx) => {
      // Find the user's cart
      const cart = await tx.cart.findUnique({
        where: { userId: userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty or does not exist.");
      }

      // Calculate total amount and check stock
      let totalAmount = new Prisma.Decimal(0);
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`
          );
        }
        totalAmount = totalAmount.add(item.product.price.mul(item.quantity));
      }

      // 1. Create the Order
      const order = await tx.order.create({
        data: {
          userId: userId,
          status: "PENDING",
          totalAmount: totalAmount,
          shippingAddress: shippingAddress,
        },
      });

      // 2. Create OrderItems & Update stock
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

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 3. Clear the cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // 4. Create PaymentIntent
      const metadata = {
        userId,
        orderId: order.id, // Link the PaymentIntent to the Order
        shippingAddress: JSON.stringify(shippingAddress),
        // ... other cart snapshot data
      };

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount.toNumber() * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata,
      });

      // *** KEY FIX: Return BOTH the order and the paymentIntent from the transaction ***
      return { order, paymentIntent };
    });

    console.log(`Order created successfully: ${order.id}`);

    // *** FINAL RETURN: Now 'paymentIntent' is available to return the clientSecret ***
    return {
      success: true,
      message: "Checkout successful! Order created. Proceed to payment.",
      orderId: order.id,
      clientSecret: paymentIntent.client_secret, // This is what the client form needs
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
