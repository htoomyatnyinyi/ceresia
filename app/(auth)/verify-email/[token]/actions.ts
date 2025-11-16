"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function verifyEmail(token: string) {
  // 1. Find and validate token
  const emailVerificationToken = await prisma.emailVerificationToken.findUnique(
    {
      where: { token },
      include: { user: true },
    }
  );

  if (
    !emailVerificationToken ||
    emailVerificationToken.expiresAt < new Date()
  ) {
    return {
      error: "Invalid or expired verification token",
    };
  }

  // 2. Update user's verified status
  try {
    await prisma.user.update({
      where: { id: emailVerificationToken.userId },
      data: { verified: true },
    });

    // 3. Delete used token
    await prisma.emailVerificationToken.delete({
      where: { id: emailVerificationToken.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error verifying email:", error);
    return {
      error: "Failed to verify email. Please try again.",
    };
  }
}

export async function resendVerificationEmail(_: any, formData: FormData) {
  const email = formData.get("email")?.toString();

  if (!email || !z.email().safeParse(email).success) {
    return { errors: { email: "Invalid email address" } };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.verified) {
    return { success: true }; // Don't leak user existence or verification status
  }

  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`;
    await sendVerificationEmail(email, verifyUrl);
    return { success: true };
  } catch (error) {
    console.error("Error resending verification email:", error);
    return {
      errors: {
        general: "Failed to send verification email. Please try again.",
      },
    };
  }
}
// "use server";

// import prisma from "@/lib/prisma";
// import { redirect } from "next/navigation";

// export async function verifyEmail(token: string) {
//   // 1. Find and validate token
//   const emailVerificationToken = await prisma.emailVerificationToken.findUnique({
//     where: { token },
//     include: { user: true },
//   });

//   if (!emailVerificationToken || emailVerificationToken.expiresAt < new Date()) {
//     return {
//       error: "Invalid or expired verification token",
//     };
//   }

//   // 2. Update user's verified status
//   try {
//     await prisma.user.update({
//       where: { id: emailVerificationToken.userId },
//       data: { verified: true },
//     });

//     // 3. Delete used token
//     await prisma.emailVerificationToken.delete({
//       where: { id: emailVerificationToken.id },
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error verifying email:", error);
//     return {
//       error: "Failed to verify email. Please try again.",
//     };
//   }
// }
