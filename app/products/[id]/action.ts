"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import z from "zod";

const addtocartSchema = z.object({
  productId: z.string().min(1, "Product ID is required."),
  price: z.coerce.number().positive("Price must be a positive number."),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1."),
});

// The Server Action
export const addtocart = async (state: any, formData: FormData) => {
  const session = await verifySession();

  if (!session.success) {
    redirect("/signin");
  }

  // 1. Prepare data for Zod parsing
  const rawData = {
    productId: formData.get("productId"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
  };

  // 2. Validate the data
  const validatedData = addtocartSchema.safeParse(rawData);

  // 3. Handle validation errors
  if (!validatedData.success) {
    return {
      success: false,
      message: "Validation failed.",
      //   errors: validatedData.error.flatten().fieldErrors,
    };
  }

  // 4. If validation passes, proceed with business logic
  const { productId, price, quantity } = validatedData.data;

  // Check if user is authenticated
  if (!session?.userId) {
    return {
      success: false,
      message: "User is not authenticated.",
    };
  }

  // --- Start Business Logic ---
  console.log(
    `Adding ${quantity} of product ${productId} at $${price} to cart.`
  );

  try {
    // 1. Find or create the user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.userId },
      });
      console.log(`Created new cart for user ${session?.userId}.`);
    }

    // 2. Check if the product is already in the cart.
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    console.log(existingCartItem, "  existing");

    if (existingCartItem) {
      // 3. If it exists, UPDATE the quantity.
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: {
            increment: quantity, // Add the new quantity to the existing one
          },
        },
      });

      console.log(`Updated quantity for product ${productId} in cart.`);
    } else {
      // 4. If it does not exist, CREATE a new cart item.
      await prisma.cartItem.create({
        data: {
          cartId: cart.id, // Link to the user's cart
          productId: productId,
          quantity: quantity,
          // Store the price at the time of purchase for historical record
          // price: price, // Uncomment if you add a price field to CartItem in schema
        },
      });
      console.log(`Created new cart item for product ${productId}.`);
    }

    return {
      success: true,
      message: `${quantity} item(s) of the product added to cart!`,
    };
  } catch (error) {
    console.error(error, "error");
    return {
      success: false,
      message: "An error occurred while adding to cart.",
    };
  }
};
