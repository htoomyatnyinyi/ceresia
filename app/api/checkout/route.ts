//  // un-used already
// import { NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";

// export async function POST(req: Request) {
//   const { items } = await req.json();
//   // console.log(items, "items at checkout");

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",

//     line_items: items.map((item: any) => ({
//       price_data: {
//         currency: "usd",
//         product_data: { name: item.name, images: [item.image] },
//         unit_amount: item.price * 100, // cents
//       },
//       quantity: item.quantity,
//     })),

//     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
//     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
//   });

//   return NextResponse.json({ url: session.url });
// }

// // import { NextResponse } from "next/server";
// // import { stripe } from "@/lib/stripe";

// // export async function POST(req: Request) {
// //   const body = await req.json();

// //   const session = await stripe.checkout.sessions.create({
// //     payment_method_types: ["card"],
// //     mode: "payment",
// //     line_items: body.items.map((item: any) => ({
// //       price_data: {
// //         currency: "usd",
// //         product_data: { name: item.name, images: [item.image] },
// //         unit_amount: item.price * 100,
// //       },
// //       quantity: item.quantity,
// //     })),
// //     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
// //     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
// //   });

// //   return NextResponse.json({ url: session.url });
// // }
