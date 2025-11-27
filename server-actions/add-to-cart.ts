// lib/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// export async function addtocart(formData: FormData) {
//   const session = await verifySession();
//   if (!session?.userId) {
//     return { message: "You must be logged in to add to cart.", success: false };
//   }

//   const productId = formData.get("productId") as string;
//   const quantity = parseInt(formData.get("quantity") as string) || 1;
//   const price = parseFloat(formData.get("price") as string);

//   // Find or create cart
//   let cart = await prisma.cart.findUnique({
//     where: { userId: session.userId },
//   });
//   if (!cart) {
//     cart = await prisma.cart.create({ data: { userId: session.userId } });
//   }

//   // Check existing item
//   const existingItem = await prisma.cartItem.findUnique({
//     where: { cartId_productId: { cartId: cart.id, productId } },
//   });

//   const product = await prisma.product.findUnique({ where: { id: productId } });
//   if (!product || product.stock < (existingItem?.quantity || 0) + quantity) {
//     return { message: "Insufficient stock.", success: false };
//   }

//   if (existingItem) {
//     await prisma.cartItem.update({
//       where: { id: existingItem.id },
//       data: { quantity: existingItem.quantity + quantity },
//     });
//   } else {
//     await prisma.cartItem.create({
//       data: { cartId: cart.id, productId, quantity, price },
//     });
//   }

//   revalidatePath("/cart");
//   return { message: "Added to cart successfully!", success: true };
// }

export async function getCartItems() {
  const session = await verifySession();
  if (!session?.userId) {
    return [];
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { cart: { userId: session.userId } },
    include: { product: true },
    // include: {
    //   product: {
    //     select: { id: true, name: true, price: true, imageUrl: true },
    //   },
    // },
  });
  //   return cartItems; // normally returning this directly would cause serialization issues

  // 1. cartItems is fetched successfully, but may contain Decimal types

  // 2. Transform the data to make it serializable
  const serializableCart = cartItems.map((item) => ({
    ...item,
    // Ensure the main item (if it has Decimal properties) is serializable
    // The key issue is within the nested 'product' object:
    product: {
      ...item.product,
      // CONVERT THE DECIMAL TO A SERIALIZABLE TYPE (string is safest for money)
      price: item.product.price.toString(),
      // Use .toNumber() if you absolutely must have a number, but be cautious of precision
    },
  }));

  // 3. Return the serializable data
  return serializableCart;
}

export async function removeFromCart(itemId: string) {
  const session = await verifySession();
  if (!session?.userId) {
    redirect("/login");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });
  revalidatePath("/cart");
}

export async function updateQuantity(itemId: string, delta: number) {
  const session = await verifySession();
  if (!session?.userId) {
    redirect("/login");
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  });

  if (!item) return;

  let newQuantity = item.quantity + delta;

  if (newQuantity < 1) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    if (newQuantity > item.product.stock) {
      newQuantity = item.product.stock;
    }
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity },
    });
  }
  revalidatePath("/cart");
}
