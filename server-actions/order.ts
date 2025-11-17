// server-actions/order.ts
"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/session"; // <-- Assuming this is available

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
) {
  // 🚨 FIXED: Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Must be an ADMIN to update order status.");
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // Revalidate the cache
    revalidatePath(`/dashboard/orders/${orderId}`);
    revalidatePath(`/dashboard/orders`);

    return {
      success: true,
      message: `Order ${orderId} status updated to ${newStatus}`,
    };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, message: "Failed to update order status." };
  }
}
