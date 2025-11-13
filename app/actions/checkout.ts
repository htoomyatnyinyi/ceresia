"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function createCheckoutSession(cartItems: any[]) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100, // Stripe uses cents
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
  });

  redirect(session.url!);
}
