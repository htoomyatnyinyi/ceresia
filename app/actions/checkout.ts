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

// // app/actions/checkout.ts (updated for payment integration)
// "use server";

// import prisma from "@/lib/prisma";
// import { Prisma } from "@prisma/client";
// import { stripe } from "@/lib/stripe"; // We'll create this file below
// import z from "zod";

// const checkoutSchema = z.object({
//   street: z.string().min(1, "Street address is required."),
//   city: z.string().min(1, "City is required."),
//   state: z.string().min(1, "State/Province is required."),
//   postalCode: z.string().min(1, "Postal code is required."),
//   country: z.string().min(1, "Country is required."),
// });

// // The Server Action for Checkout (now prepares payment session)
// export const checkout = async (state: any, formData: FormData) => {
//   const userId = "clxi8v09c000008l414y5e36k"; // Replace with auth logic

//   // 1. Validate shipping address
//   const rawData = {
//     street: formData.get("street"),
//     city: formData.get("city"),
//     state: formData.get("state"),
//     postalCode: formData.get("postalCode"),
//     country: formData.get("country"),
//   };
//   const validatedData = checkoutSchema.safeParse(rawData);
//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: "Validation failed.",
//       errors: validatedData.error.flatten().fieldErrors,
//     };
//   }
//   const shippingAddress = validatedData.data;

//   try {
//     // Find the user's cart with items and products
//     const cart = await prisma.cart.findUnique({
//       where: { userId: userId },
//       include: {
//         items: {
//           include: { product: true },
//         },
//       },
//     });

//     if (!cart || cart.items.length === 0) {
//       return { success: false, message: "Cart is empty or does not exist." };
//     }

//     // Check stock (preliminary; re-check in webhook if needed)
//     for (const item of cart.items) {
//       if (item.product.stock < item.quantity) {
//         return {
//           success: false,
//           message: `Insufficient stock for product ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`,
//         };
//       }
//     }

//     // Prepare line items for Stripe
//     const lineItems = cart.items.map((item) => ({
//       price_data: {
//         currency: "usd", // Adjust as needed
//         product_data: {
//           name: item.product.name,
//         },
//         unit_amount: Math.round(item.product.price.toNumber() * 100), // Convert to cents
//       },
//       quantity: item.quantity,
//       // Metadata per line item for productId
//       metadata: {
//         productId: item.productId,
//       },
//     }));

//     // Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"], // Add more if needed
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
//       // Metadata for userId and shippingAddress
//       metadata: {
//         userId: userId,
//         shippingAddress: JSON.stringify(shippingAddress),
//       },
//       // Optional: Collect billing address if required for taxes, etc.
//       billing_address_collection: "auto",
//     });

//     return {
//       success: true,
//       message: "Redirecting to payment...",
//       sessionUrl: session.url, // Redirect to this URL on frontend
//     };
//   } catch (error) {
//     console.error("Checkout error:", error);
//     return {
//       success: false,
//       message: "An error occurred during checkout.",
//     };
//   }
// };

// // This code is the previous code.

// // "use server";

// // import { stripe } from "@/lib/stripe";
// // import { redirect } from "next/navigation";

// // export async function createCheckoutSession(cartItems: any[]) {
// //   const session = await stripe.checkout.sessions.create({
// //     payment_method_types: ["card"],
// //     mode: "payment",
// //     line_items: cartItems.map((item) => ({
// //       price_data: {
// //         currency: "usd",
// //         product_data: {
// //           name: item.name,
// //           images: [item.image],
// //         },
// //         unit_amount: item.price * 100, // Stripe uses cents
// //       },
// //       quantity: item.quantity,
// //     })),
// //     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
// //     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
// //   });

// //   redirect(session.url!);
// // }
