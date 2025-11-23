"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import bcrypt from "bcrypt";

// Schema for password reset request form
const PasswordResetRequestSchema = z.object({
  email: z.email("Invalid email address"),
});

// Schema for password reset form
const PasswordResetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    token: z.string().min(1, "Invalid token"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export async function requestPasswordReset(_: any, formData: FormData) {
  // 1. Validate email
  const validateResult = PasswordResetRequestSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validateResult.success) {
    return {
      errors: validateResult.error.flatten().fieldErrors,
    };
  }

  const { email } = validateResult.data;

  // 2. Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Return success to avoid leaking user existence
    return { success: true };
  }

  // 3. Generate reset token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  // 4. Store token in database
  try {
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // 5. Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;
    await sendPasswordResetEmail(email, resetUrl);
    return { success: true };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return {
      errors: { general: "Failed to send reset email. Please try again." },
    };
  }
}

export async function resetPassword(_: any, formData: FormData) {
  // 1. Validate input
  const validateResult = PasswordResetSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    token: formData.get("token"),
  });

  if (!validateResult.success) {
    return {
      errors: validateResult.error.flatten().fieldErrors,
    };
  }

  const { password, token } = validateResult.data;

  // 2. Find and validate token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return {
      errors: { token: "Invalid or expired reset token" },
    };
  }

  // 3. Update user's password
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // 4. Delete used token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      errors: { general: "Failed to reset password. Please try again." },
    };
  }
}

// "use server";

// import { z } from "zod";
// import prisma from "@/lib/prisma";
// import { sendPasswordResetEmail } from "@/lib/email";
// import crypto from "crypto";
// import bcrypt from "bcrypt";

// // Schema for password reset request form
// const PasswordResetRequestSchema = z.object({
//   email: z.email("Invalid email address"),
// });

// // Schema for password reset form
// const PasswordResetSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     confirmPassword: z
//       .string()
//       .min(6, "Password must be at least 6 characters"),
//     token: z.string().min(1, "Invalid token"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords must match",
//     path: ["confirmPassword"],
//   });

// export async function requestPasswordReset(_: any, formData: FormData) {
//   // 1. Validate email
//   const validateResult = PasswordResetRequestSchema.safeParse({
//     email: formData.get("email"),
//   });

//   if (!validateResult.success) {
//     return {
//       errors: validateResult.error.flatten().fieldErrors,
//     };
//   }

//   const { email } = validateResult.data;

//   // 2. Check if user exists
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     // Return success to avoid leaking user existence
//     return { success: true };
//   }
//   console.log("User found:", user);

//   // 3. Generate reset token
//   const token = crypto.randomBytes(32).toString("hex");
//   const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

//   // 4. Store token in database
//   try {
//     // await prisma.passwordResetToken.create({
//     //   data: {
//     //     userId: user.id,
//     //     token,
//     //     expiresAt,
//     //   },
//     // });
//     await prisma.passwordResetToken.create({
//       data: {
//         userId: user.id,
//         token,
//         expiresAt,
//       },
//     });

//     // 5. Send reset email
//     const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;
//     await sendPasswordResetEmail(email, resetUrl);
//     return { success: true };
//   } catch (error) {
//     console.error("Error requesting password reset:", error);
//     return {
//       errors: { general: "Failed to send reset email. Please try again." },
//     };
//   }
// }

// export async function resetPassword(_: any, formData: FormData) {
//   // 1. Validate input
//   const validateResult = PasswordResetSchema.safeParse({
//     password: formData.get("password"),
//     confirmPassword: formData.get("confirmPassword"),
//     token: formData.get("token"),
//   });

//   if (!validateResult.success) {
//     return {
//       errors: validateResult.error.flatten().fieldErrors,
//     };
//   }

//   const { password, token } = validateResult.data;

//   // 2. Find and validate token
//   const resetToken = await prisma.passwordResetToken.findUnique({
//     where: { token },
//     include: { user: true },
//   });

//   if (!resetToken || resetToken.expiresAt < new Date()) {
//     return {
//       errors: { token: "Invalid or expired reset token" },
//     };
//   }

//   // 3. Update user's password
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await prisma.user.update({
//       where: { id: resetToken.userId },
//       data: { hashedPassword },
//     });

//     // 4. Delete used token
//     await prisma.passwordResetToken.delete({
//       where: { id: resetToken.id },
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error resetting password:", error);
//     return {
//       errors: { general: "Failed to reset password. Please try again." },
//     };
//   }
// }
