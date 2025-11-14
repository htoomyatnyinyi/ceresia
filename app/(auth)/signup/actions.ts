"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendVerificationEmail } from "@/lib/email";
import { createSession } from "@/lib/session";

const SignUpFormSchema = z
  .object({
    username: z.string().min(1, "Min 2 letter"),
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "confirmPassword must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

// export type SessionPayload = {
//   userId: string | number;
//   expiresAt: Date;
// };

export const signup = async (state: any, formData: any) => {
  //   const username = formData.get("username");
  //   console.log(username, " action");
  //   console.log(state, formData, " check at action signpu");

  // 1. validate
  const validateResult = SignUpFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validateResult.success) {
    return {
      errors: validateResult.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validateResult.data;

  // 2. Check for existing user by email or name
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUserByEmail) {
    return {
      errors: { email: "Email already in use" },
    };
  }

  const existingUserByUserName = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUserByUserName) {
    return {
      errors: { name: "Username already in use" },
    };
  }

  // 3.Create User
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
        verified: false,
      },
    });
    console.log(user, " inserted");

    // 4(a). Generate verification token
    const token = crypto.randomUUID();
    console.log(token, "generate from uuid");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // 4(b). Store verifyToken at database for email verifcation
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // 5. Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/verify-email/${token}`;
    await sendVerificationEmail(email, verifyUrl);

    // 6. Create Session
    await createSession(user.id);
    return { success: true };
  } catch (error) {
    console.error(error);
  }
};
