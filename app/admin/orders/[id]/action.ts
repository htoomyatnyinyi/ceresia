"use server";

import prisma from "@/lib/prisma";
import z from "zod";

const UpdateStatus = z.object({
  status: z.enum(["PENDING", "SHIPPED", "DELIVERED", "CANCELED", "REJECT"]),
  //   status: z.enum(["pending", "shipped", "delivered", "canceled"]),
});

// const updateStatus = async (
//   orderId: string,
//   status: z.infer<typeof UpdateStatus>["status"]
// ) => {
//   await prisma.order.update({
//     where: { id: orderId },
//     data: { status },
//   });
// };

const updateStatus = async (state: any, formData: FormData) => {
  console.log(state);
  const { orderId } = state;
  console.log(orderId, "orderId", formData);
  // const status = formData.get("status");
  const validatedData = UpdateStatus.parse({
    // orderId: state.params.id,
    status: formData.get("status"),
  });
  console.log(validatedData, "update");
  // const orderId = validatedData.orderId;
  // const status = validatedData.status;
  //   status: formData.get("status"),
  // }
  //   );

  //   if (typeof status !== "string") {
  //     throw new Error("Invalid status");
  //   }

  //   const parsed = UpdateStatus.safeParse({ status });

  //   if (!parsed.success) {
  //     throw new Error("Validation failed");
  //   }

  //   await prisma.order.update({
  //     where: { id: orderId },
  //     data: { status: parsed.data.status },
  //   });
};
export { updateStatus };
