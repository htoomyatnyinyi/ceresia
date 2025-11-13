// app/api/webhooks/stripe/route.ts
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("✅ Payment successful:", session);
      // TODO: update order in DB
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
