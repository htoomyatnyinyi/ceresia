// app/api/webhook/stripe/route.ts (updated for PaymentIntent events)
import { stripe } from "@/lib/stripe";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Disable body parsing
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
  const sigAwait = await headers();
  const sig = sigAwait.get("stipe-signature");
  // const sig = headers().get("stripe-signature");
  // const sig = (await headers()).get("stripe-signature");

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

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const userId = paymentIntent.metadata.userId;
    const shippingAddressStr = paymentIntent.metadata.shippingAddress;
    const cartItemsStr = paymentIntent.metadata.cartItems;

    if (!userId || !shippingAddressStr || !cartItemsStr) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const shippingAddress = JSON.parse(shippingAddressStr);
    const cartItems = JSON.parse(cartItemsStr);

    try {
      await prisma.$transaction(async (tx) => {
        // Calculate total from metadata to avoid discrepancies
        let totalAmount = new Prisma.Decimal(0);
        for (const item of cartItems) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          if (!product) throw new Error(`Product ${item.productId} not found`);
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.name}`);
          }
          const itemPrice = new Prisma.Decimal(item.price);
          totalAmount = totalAmount.add(itemPrice.mul(item.quantity));
        }

        // Create the Order
        const order = await tx.order.create({
          data: {
            userId: userId,
            status: "PAID",
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
          },
        });

        // Create OrderItems and update stock
        for (const item of cartItems) {
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              productName: item.name,
              price: new Prisma.Decimal(item.price),
              quantity: item.quantity,
            },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Clear the cart
        const cart = await tx.cart.findUnique({ where: { userId: userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      });

      console.log(`Order processed for PaymentIntent ${paymentIntent.id}`);
    } catch (error) {
      console.error("Webhook transaction error:", error);
      // TODO: Handle refund if necessary
      return NextResponse.json({ error: "Processing error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
// // app/api/webhooks/stripe/route.ts
// import { stripe } from "@/lib/stripe";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const payload = await req.text();
//   const sig = req.headers.get("stripe-signature")!;
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   try {
//     const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       console.log("✅ Payment successful:", session);
//       // TODO: update order in DB
//     }

//     return NextResponse.json({ received: true });
//   } catch (err: any) {
//     console.error(err);
//     return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
//   }
// }
