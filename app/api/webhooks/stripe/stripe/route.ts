// app/api/webhook/stripe/route.ts (API Route for webhook)
import { stripe } from "@/lib/stripe";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Disable body parsing to get raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(request: Request) {
  const chunks = [];
  const reader = request.body?.getReader();
  if (!reader) return Buffer.from("");
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(request: Request) {
  const rawBody = await getRawBody(request);
  const sig = headers().get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve the session with expanded line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    const userId = fullSession.metadata?.userId;
    const shippingAddressStr = fullSession.metadata?.shippingAddress;

    if (!userId || !shippingAddressStr) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const shippingAddress = JSON.parse(shippingAddressStr);

    try {
      await prisma.$transaction(async (tx) => {
        // Calculate total (from session to avoid discrepancies)
        const totalAmount = new Prisma.Decimal(fullSession.amount_total! / 100);

        // Create the Order
        const order = await tx.order.create({
          data: {
            userId: userId,
            status: "PAID", // Since payment succeeded
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
          },
        });

        // Create OrderItems and update stock
        for (const lineItem of fullSession.line_items?.data || []) {
          const productId = lineItem.metadata?.productId;
          if (!productId) throw new Error("Missing productId in metadata");

          // Get current product for name and stock check
          const product = await tx.product.findUnique({
            where: { id: productId },
          });
          if (!product) throw new Error(`Product ${productId} not found`);

          if (product.stock < lineItem.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: productId,
              productName: product.name,
              price: new Prisma.Decimal(
                lineItem.amount_total / 100 / lineItem.quantity
              ),
              quantity: lineItem.quantity,
            },
          });

          // Decrement stock
          await tx.product.update({
            where: { id: productId },
            data: { stock: { decrement: lineItem.quantity } },
          });
        }

        // Clear the cart
        const cart = await tx.cart.findUnique({ where: { userId: userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      });

      console.log(`Order processed for session ${session.id}`);
    } catch (error) {
      console.error("Webhook transaction error:", error);
      // Optionally, initiate refund here if needed
      return NextResponse.json({ error: "Processing error" }, { status: 500 });
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
