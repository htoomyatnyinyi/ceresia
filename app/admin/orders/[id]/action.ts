"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface ActionState {
  success: boolean;
  message: string;
}

// The action receives the previous state and the FormData object
export async function updateStatus(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const orderId = formData.get("orderId") as string;
  const newStatus = formData.get("status") as OrderStatus;

  if (!orderId || !newStatus) {
    return {
      success: false,
      message: "Error: Missing Order ID or new status.",
    };
  }

  // Basic validation that the status is a valid enum value
  const validStatuses: OrderStatus[] = [
    "PENDING",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, message: `Invalid status selected: ${newStatus}` };
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // Revalidate the page (e.g., the order details page or admin list)
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders`);

    return {
      success: true,
      message: `Status successfully updated to **${updatedOrder.status}**!`,
    };
  } catch (error) {
    console.error("Database Update Error:", error);
    return {
      success: false,
      message: "Failed to update status due to a server error.",
    };
  }
}
// "use server";

// import prisma from "@/lib/prisma";
// import z from "zod";

// const UpdateStatus = z.object({
//   orderId: z.string().min(1, "No order Id"),
//   status: z.enum(["PENDING", "SHIPPED", "DELIVERED", "CANCELED", "REJECT"]),
//   //   status: z.enum(["pending", "shipped", "delivered", "canceled"]),
// });

// // const updateStatus = async (
// //   orderId: string,
// //   status: z.infer<typeof UpdateStatus>["status"]
// // ) => {
// //   await prisma.order.update({
// //     where: { id: orderId },
// //     data: { status },
// //   });
// // };

// const updateStatus = async (state: any, formData: FormData) => {
//   console.log(state);
//   const { orderId } = state;
//   console.log(orderId, "orderId", formData);
//   // const status = formData.get("status");
//   const validatedData = UpdateStatus.parse({
//     // orderId: state.params.id,
//     status: formData.get("orderId"),
//     status: formData.get("status"),
//   });
//   console.log(validatedData, "update");
//   // const orderId = validatedData.orderId;
//   // const status = validatedData.status;
//   //   status: formData.get("status"),
//   // }
//   //   );

//   //   if (typeof status !== "string") {
//   //     throw new Error("Invalid status");
//   //   }

//   //   const parsed = UpdateStatus.safeParse({ status });

//   //   if (!parsed.success) {
//   //     throw new Error("Validation failed");
//   //   }

//   //   await prisma.order.update({
//   //     where: { id: orderId },
//   //     data: { status: parsed.data.status },
//   //   });
// };
// export { updateStatus };
