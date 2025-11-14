// app/actions/checkout.ts (updated for embedded Payment Element)
"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import z from "zod";

const checkoutSchema = z.object({
  street: z.string().min(1, "Street address is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State/Province is required."),
  postalCode: z.string().min(1, "Postal code is required."),
  country: z.string().min(1, "Country is required."),
});

// Server Action to initiate checkout and create PaymentIntent
export const initiateCheckout = async (state: any, formData: FormData) => {
  const userId = "clxi8v09c000008l414y5e36k"; // Replace with auth logic

  // 1. Validate shipping address
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
    // Find the user's cart with items and products
    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, message: "Cart is empty or does not exist." };
    }

    // Calculate total and check stock preliminarily
    let totalAmount = new Prisma.Decimal(0);
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for product ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`,
        };
      }
      totalAmount = totalAmount.add(item.product.price.mul(item.quantity));
    }

    // Prepare metadata
    const metadata = {
      userId,
      shippingAddress: JSON.stringify(shippingAddress),
      cartItems: JSON.stringify(
        cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.product.name, // For snapshot
          price: item.product.price.toString(), // Decimal to string
        }))
      ),
    };

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount.toNumber() * 100), // Convert to cents
      currency: "usd", // Adjust as needed
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Initiate checkout error:", error);
    return {
      success: false,
      message: "An error occurred during checkout initiation.",
    };
  }
};
