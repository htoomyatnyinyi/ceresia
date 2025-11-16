"use server";

import prisma from "@/lib/prisma";
import z from "zod";

const CreateAddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalcode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const createShippingAddress = async (state: any, formData: FormData) => {
  const validatedData = CreateAddressSchema.parse({
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    country: formData.get("country"),
    postalcode: formData.get("postalcode"),
    isDefault: formData.get("isDefault") === "on" ? true : false,
  });
  console.log("Validated Data:", validatedData);

  //   try {
  //     await prisma.shippingAddress.create({
  //       data: {
  //         street: validatedData.street,
  //         city: validatedData.city,
  //         state: validatedData.state,
  //         country: validatedData.country,
  //         postalCode: validatedData.postalcode,
  //         isDefault: validatedData.isDefault || false,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error at createshipping address");
  //   }
};
