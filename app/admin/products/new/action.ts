"use server";

import prisma from "@/lib/prisma";
import z from "zod";

const CreateNewProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().min(0),
});

export const createNewProduct = async (state: any, formData: FormData) => {
  console.log(formData, "check");

  const validatedData = CreateNewProductSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
  });

  console.log(validatedData);
  const { name, description, price, stock } = validatedData;

  try {
    const inserted = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
      },
    });

    console.log(inserted);

    return { success: true, message: "New Product Successfully Inserted!!" };
  } catch (error) {
    return { success: false, messag: "fail to creaet new products", error };
  }
};
