"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ==================== Schemas ====================

const AddressBaseSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(), // some countries don't have states
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  isDefault: z.coerce.boolean().optional(),
});

const CreateAddressSchema = AddressBaseSchema;
const UpdateAddressSchema = AddressBaseSchema.partial().extend({
  id: z.string().min(1),
});

// ==================== Helper: Get Current User ID ====================

async function getUserId() {
  const session = await verifySession();
  if (!session.success || !session.userId) {
    redirect("/signin");
  }
  return session.userId as string;
}

// ==================== CREATE Address ====================

export async function createAddress(_prevState: any, formData: FormData) {
  const userId = await getUserId();

  const validated = CreateAddressSchema.safeParse({
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state") || undefined,
    country: formData.get("country"),
    postalCode: formData.get("postalCode"),
    isDefault: formData.get("isDefault"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }
  console.log(validated, "validated");

  try {
    // If this is set as default → unset others
    if (validated.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }
    console.log(validated, " crateaddress");

    await prisma.address.create({
      data: {
        ...validated.data,
        userId,
        postalCode: validated.data.postalCode,
      },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("Create address error:", error);
    return {
      success: false,
      errors: { _global: ["Failed to create address"] },
    };
  }
}

// ==================== UPDATE Address ====================

export async function updateAddress(_prevState: any, formData: FormData) {
  const userId = await getUserId();

  const validated = UpdateAddressSchema.safeParse({
    id: formData.get("id"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state") || undefined,
    country: formData.get("country"),
    postalCode: formData.get("postalCode"),
    isDefault: formData.get("isDefault") === "on",
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { id, ...data } = validated.data;

  try {
    // Check ownership
    const existing = await prisma.address.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== userId) {
      return { success: false, errors: { _global: ["Address not found"] } };
    }

    // Handle default logic
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    await prisma.address.update({
      where: { id },
      data: {
        ...data,
        postalCode: data.postalCode,
      },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("Update address error:", error);
    return {
      success: false,
      errors: { _global: ["Failed to update address"] },
    };
  }
}

// ==================== DELETE Address ====================

export async function deleteAddress(addressId: string) {
  const userId = await getUserId();

  if (!addressId) {
    return { success: false, message: "Address ID is required" };
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
      select: { userId: true, isDefault: true },
    });

    if (!address || address.userId !== userId) {
      return { success: false, message: "Address not found or unauthorized" };
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default → promote another one
    if (address.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: true },
      });
    }

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("Delete address error:", error);
    return { success: false, message: "Failed to delete address" };
  }
}

// ==================== SET Default Address (Bonus) ====================

export async function setDefaultAddress(addressId: string) {
  const userId = await getUserId();

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
      select: { userId: true },
    });

    if (!address || address.userId !== userId) {
      return { success: false };
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("Set default error:", error);
    return { success: false };
  }
}
