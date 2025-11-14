// "use server";

// import prisma from "@/lib/prisma";
// import { Prisma } from "@prisma/client";
// import { stripe } from "@/lib/stripe";
// import z from "zod";

// // NOTE: You must have a separate file/endpoint to handle Stripe Webhooks
// // (e.g., /api/webhooks/stripe) which will process the 'payment_intent.succeeded'
// // event and perform the database mutations (create Order, update Stock, clear Cart).

// const checkoutSchema = z.object({
//   street: z.string().min(1, "Street address is required."),
//   city: z.string().min(1, "City is required."),
//   state: z.string().min(1, "State/Province is required."),
//   postalCode: z.string().min(1, "Postal code is required."),
//   country: z.string().min(1, "Country is required."),
// });

// export const checkout = async (state: any, formData: FormData) => {
//   const userId = "clxi8v09c000008l414y5e36k"; // Replace with your actual auth logic

//   // 1. Validate the data
//   // ... (validation logic remains the same)
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
//     // 2. Calculate total amount and snapshot cart (READ-ONLY)
//     const cart = await prisma.cart.findUnique({
//       where: { userId: userId },
//       include: {
//         items: {
//           include: { product: true },
//         },
//       },
//     });

//     if (!cart || cart.items.length === 0) {
//       throw new Error("Cart is empty or does not exist.");
//     }

//     let totalAmount = new Prisma.Decimal(0);
//     for (const item of cart.items) {
//       // Stock check is still useful here to prevent creating a PI for an impossible order
//       if (item.product.stock < item.quantity) {
//         throw new Error(`Insufficient stock for product ${item.product.name}.`);
//       }
//       totalAmount = totalAmount.add(item.product.price.mul(item.quantity));
//     }

//     // 3. Prepare METADATA
//     // This data is attached to the Payment Intent and is crucial for your
//     // Webhook handler to finalize the order later.
//     const metadata = {
//       userId,
//       shippingAddress: JSON.stringify(shippingAddress),
//       // Store cart contents (price snapshot is essential)
//       cartItems: JSON.stringify(
//         cart.items.map((item) => ({
//           productId: item.productId,
//           quantity: item.quantity,
//           name: item.product.name,
//           price: item.product.price.toString(),
//         }))
//       ),
//     };

//     // 4. Create PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(totalAmount.toNumber() * 100), // Convert to cents
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//       metadata,
//     });

//     // 5. Return clientSecret
//     return {
//       success: true,
//       message: "Order details confirmed. Ready for payment.",
//       clientSecret: paymentIntent.client_secret, // The client needs this!
//     };
//   } catch (error) {
//     console.error("Checkout error:", error);
//     return {
//       success: false,
//       message:
//         error instanceof Error
//           ? error.message
//           : "An error occurred during checkout.",
//     };
//   }
// };

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
export const checkout = async (state: any, formData: FormData) => {
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

// // // "use server";

// // // import prisma from "@/lib/prisma";
// // // import { Prisma } from "@prisma/client";
// // // import { stripe } from "@/lib/stripe";
// // // import z from "zod";

// // // const checkoutSchema = z.object({
// // //   // Assuming simple shipping address fields; adjust as needed for your form
// // //   street: z.string().min(1, "Street address is required."),
// // //   city: z.string().min(1, "City is required."),
// // //   state: z.string().min(1, "State/Province is required."),
// // //   postalCode: z.string().min(1, "Postal code is required."),
// // //   country: z.string().min(1, "Country is required."),
// // // });

// // // // The Server Action for Checkout
// // // export const checkout = async (state: any, formData: FormData) => {
// // //   const userId = "clxi8v09c000008l414y5e36k"; // Hardcoded for demo; replace with auth logic

// // //   // 1. Prepare data for Zod parsing
// // //   const rawData = {
// // //     street: formData.get("street"),
// // //     city: formData.get("city"),
// // //     state: formData.get("state"),
// // //     postalCode: formData.get("postalCode"),
// // //     country: formData.get("country"),
// // //   };

// // //   // 2. Validate the data
// // //   const validatedData = checkoutSchema.safeParse(rawData);

// // //   // 3. Handle validation errors
// // //   if (!validatedData.success) {
// // //     return {
// // //       success: false,
// // //       message: "Validation failed.",
// // //       errors: validatedData.error.flatten().fieldErrors,
// // //     };
// // //   }

// // //   // 4. If validation passes, proceed
// // //   const shippingAddress = validatedData.data; // This will be stored as JSON in the Order

// // //   try {
// // //     // Use a transaction for atomicity (create order, order items, update stock, clear cart)
// // //     const result = await prisma.$transaction(async (tx) => {
// // //       // Find the user's cart
// // //       const cart = await tx.cart.findUnique({
// // //         where: { userId: userId },
// // //         include: {
// // //           items: {
// // //             include: { product: true }, // Need product for price, name, stock
// // //           },
// // //         },
// // //       });

// // //       if (!cart || cart.items.length === 0) {
// // //         throw new Error("Cart is empty or does not exist.");
// // //       }

// // //       // Calculate total amount
// // //       let totalAmount = new Prisma.Decimal(0);
// // //       for (const item of cart.items) {
// // //         // Check stock
// // //         if (item.product.stock < item.quantity) {
// // //           throw new Error(
// // //             `Insufficient stock for product ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`
// // //           );
// // //         }
// // //         totalAmount = totalAmount.add(item.product.price.mul(item.quantity));
// // //       }

// // //       // Create the Order
// // //       const order = await tx.order.create({
// // //         data: {
// // //           userId: userId,
// // //           status: "PENDING", // Initial status; update after payment if needed
// // //           totalAmount: totalAmount,
// // //           shippingAddress: shippingAddress, // Stored as JSON
// // //         },
// // //       });

// // //       // Create OrderItems (snapshot data)
// // //       for (const item of cart.items) {
// // //         await tx.orderItem.create({
// // //           data: {
// // //             orderId: order.id,
// // //             productId: item.productId,
// // //             productName: item.product.name,
// // //             price: item.product.price,
// // //             quantity: item.quantity,
// // //           },
// // //         });

// // //         // Update product stock
// // //         await tx.product.update({
// // //           where: { id: item.productId },
// // //           data: { stock: { decrement: item.quantity } },
// // //         });
// // //       }

// // //       // // ADD ON BY HMNN
// // //       // // Prepare metadata
// // //       // const metadata = {
// // //       //   userId,
// // //       //   shippingAddress: JSON.stringify(shippingAddress),
// // //       //   cartItems: JSON.stringify(
// // //       //     cart.items.map((item) => ({
// // //       //       productId: item.productId,
// // //       //       quantity: item.quantity,
// // //       //       name: item.product.name, // For snapshot
// // //       //       price: item.product.price.toString(), // Decimal to string
// // //       //     }))
// // //       //   ),
// // //       // };

// // //       // // Create PaymentIntent
// // //       // const paymentIntent = await stripe.paymentIntents.create({
// // //       //   amount: Math.round(totalAmount.toNumber() * 100), // Convert to cents
// // //       //   currency: "usd", // Adjust as needed
// // //       //   automatic_payment_methods: { enabled: true },
// // //       //   metadata,
// // //       // });
// // //       // // END ADDON

// // //       // Clear the cart items (keep the cart itself)
// // //       await tx.cartItem.deleteMany({
// // //         where: { cartId: cart.id },
// // //       });

// // //       // ADD ON BY HMNN
// // //       // Prepare metadata
// // //       const metadata = {
// // //         userId,
// // //         shippingAddress: JSON.stringify(shippingAddress),
// // //         cartItems: JSON.stringify(
// // //           cart.items.map((item) => ({
// // //             productId: item.productId,
// // //             quantity: item.quantity,
// // //             name: item.product.name, // For snapshot
// // //             price: item.product.price.toString(), // Decimal to string
// // //           }))
// // //         ),
// // //       };

// // //       // Create PaymentIntent
// // //       const paymentIntent = await stripe.paymentIntents.create({
// // //         amount: Math.round(totalAmount.toNumber() * 100), // Convert to cents
// // //         currency: "usd", // Adjust as needed
// // //         automatic_payment_methods: { enabled: true },
// // //         metadata,
// // //       });
// // //       // END ADDON

// // //       return order;
// // //     });

// // //     console.log(`Order created successfully: ${result.id}`);

// // //     return {
// // //       success: true,
// // //       message: "Checkout successful! Order created.",
// // //       orderId: result.id,
// // //       clientSecret: paymentIntent.client_secret,
// // //     };
// // //   } catch (error) {
// // //     console.error("Checkout error:", error);
// // //     return {
// // //       success: false,
// // //       message:
// // //         error instanceof Error
// // //           ? error.message
// // //           : "An error occurred during checkout.",
// // //     };
// // //   }
// // // };
