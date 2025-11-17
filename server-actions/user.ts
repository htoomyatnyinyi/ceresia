// server-actions/user.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/session";

// 1. TOGGLE User Verification Status
export async function toggleUserVerification(
  userId: string,
  currentStatus: boolean
) {
  // Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    return { success: false, message: "Unauthorized access." };
  }

  try {
    const newStatus = !currentStatus;

    await prisma.user.update({
      where: { id: userId },
      data: { verified: newStatus },
    });

    // Revalidate the list and the detail page
    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${userId}`);

    return {
      success: true,
      message: `User verification set to ${
        newStatus ? "Verified" : "Unverified"
      }.`,
    };
  } catch (error) {
    console.error("Toggle Verification Error:", error);
    return {
      success: false,
      message: "Failed to update user verification status.",
    };
  }
}
