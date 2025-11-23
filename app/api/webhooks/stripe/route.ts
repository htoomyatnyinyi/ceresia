// app/api/webhook/stripe/route.ts (updated with idempotency)
import { stripe } from "@/lib/stripe";
import { Prisma, PrismaClient } from "@prisma/client"; // Import PrismaClient for error typing
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// // Disable body parsing
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

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

  console.log(rawBody, "checkRawbody data in routes webhooks");
  // const sig = headers().get("stripe-signature");
  const sigAwait = await headers();
  const sig = sigAwait.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(event, " event");
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
        // Idempotency: Try to insert the event ID first
        await tx.processedWebhookEvent.create({
          data: { id: event.id },
        });

        // If insert succeeds (event not processed), proceed

        // Calculate total from metadata
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        // Unique constraint violation: Event already processed
        console.log(`Event ${event.id} already processed. Skipping.`);
        return NextResponse.json({ received: true });
      }

      console.error("Webhook transaction error:", error);
      // TODO: Handle refund if necessary (e.g., if partial processing occurred, but transaction prevents that)
      return NextResponse.json({ error: "Processing error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// // app/api/webhook/stripe/route.ts (updated for PaymentIntent events)
// import { stripe } from "@/lib/stripe";
// import { Prisma } from "@prisma/client";
// import prisma from "@/lib/prisma";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// // Disable body parsing
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// async function getRawBody(request: Request) {
//   const chunks = [];
//   const reader = request.body?.getReader();
//   if (!reader) return Buffer.from("");
//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     chunks.push(value);
//   }
//   return Buffer.concat(chunks);
// }

// export async function POST(request: Request) {
//   const rawBody = await getRawBody(request);
//   // const sig = headers().get("stripe-signature");
//   const sigAwait = await headers();
//   const sig = sigAwait.get("stipe-signature");

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       rawBody,
//       sig!,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );
//   } catch (err: any) {
//     console.error("Webhook signature verification failed:", err.message);
//     return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
//   }

//   if (event.type === "payment_intent.succeeded") {
//     const paymentIntent = event.data.object as Stripe.PaymentIntent;

//     // Inside the if (event.type === "payment_intent.succeeded") block, before the transaction:
//     console.log("Received payment_intent.succeeded:", paymentIntent.id);
//     console.log("Metadata:", paymentIntent.metadata);

//     const userId = paymentIntent.metadata.userId;
//     const shippingAddressStr = paymentIntent.metadata.shippingAddress;
//     const cartItemsStr = paymentIntent.metadata.cartItems;

//     if (!userId || !shippingAddressStr || !cartItemsStr) {
//       return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
//     }

//     const shippingAddress = JSON.parse(shippingAddressStr);
//     const cartItems = JSON.parse(cartItemsStr);

//     try {
//       // Inside try block:
//       console.log("Parsed shippingAddress:", shippingAddress);
//       console.log("Parsed cartItems:", cartItems);

//       await prisma.$transaction(async (tx) => {
//         // Calculate total from metadata to avoid discrepancies
//         let totalAmount = new Prisma.Decimal(0);

//         for (const item of cartItems) {
//           const product = await tx.product.findUnique({
//             where: { id: item.productId },
//           });
//           if (!product) throw new Error(`Product ${item.productId} not found`);
//           if (product.stock < item.quantity) {
//             throw new Error(`Insufficient stock for ${item.name}`);
//           }
//           const itemPrice = new Prisma.Decimal(item.price);
//           totalAmount = totalAmount.add(itemPrice.mul(item.quantity));
//         }

//         // Create the Order
//         const order = await tx.order.create({
//           data: {
//             userId: userId,
//             status: "PAID",
//             totalAmount: totalAmount,
//             shippingAddress: shippingAddress,
//           },
//         });

//         // Create OrderItems and update stock
//         for (const item of cartItems) {
//           await tx.orderItem.create({
//             data: {
//               orderId: order.id,
//               productId: item.productId,
//               productName: item.name,
//               price: new Prisma.Decimal(item.price),
//               quantity: item.quantity,
//             },
//           });

//           await tx.product.update({
//             where: { id: item.productId },
//             data: { stock: { decrement: item.quantity } },
//           });
//         }

//         // Clear the cart
//         const cart = await tx.cart.findUnique({ where: { userId: userId } });
//         if (cart) {
//           await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
//         }
//       });
//       // After transaction:
//       console.log("Order created successfully for user:", userId);

//       console.log(`Order processed for PaymentIntent ${paymentIntent.id}`);
//     } catch (error) {
//       console.error("Webhook transaction error:", error);
//       // TODO: Handle refund if necessary
//       return NextResponse.json({ error: "Processing error" }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ received: true });
// }
