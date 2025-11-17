"use server";

import z from "zod";

const UpdateOrderStatusSchema = z.object({});
const updateOrderStatus = async () => {
  const validatedData = UpdateOrderStatusSchema.parse({});
};
