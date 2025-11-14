"use server";

import { deleteSession } from "@/lib/session";
import z from "zod";

const SignOutSchema = z.object({
  userId: z.string(),
});

export const signout = async (state: any, formData: FormData) => {
  //   console.log(formData, "formData");
  const validatedData = SignOutSchema.parse({
    userId: formData.get("userId"),
  });

  console.log(validatedData, "validated");
  try {
    await deleteSession();

    return { success: true, message: "Signout Successfully!!" };
  } catch (error) {
    console.error("Error signout", error);
    return { success: false, message: "Failed to Signout" };
  }
};
