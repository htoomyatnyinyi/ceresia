"use server";

import prisma from "@/lib/prisma";

import { z } from "zod";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";

const SignInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password must be at least 6 characters"),
});

export const signin = async (state: any, formData: any) => {
  // 1. validate fields
  const validateResult = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateResult.success) {
    return {
      errors: validateResult.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validateResult.data;

  // 2. Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      errors: { email: "No account found with this email" },
    };
  }

  // 3. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password!);

  if (!isPasswordValid) {
    return {
      errors: { password: "Incorrect password" },
    };
  }

  // 4. Create session
  try {
    await createSession(user.id);
    return {
      success: true,
      message: "SignIn Successfully!!",
    };
  } catch (error) {
    console.error("Error creating session:", error);
    return {
      errors: { general: "Failed to sign in. Please try again." },
    };
  }
};

// ###########
import { sendVerificationEmail } from "@/lib/email";

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
      // errors: validateResult.error.flatten().fieldErrors,
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
      errors: { username: "Username already in use" },
    };
  }

  // 3.Create User
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verified: false,
      },
    });

    // 4(a). Generate verification token
    const token = crypto.randomUUID();

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // 4(b). Store verifyToken at database for email verifcation
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // 5. Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/verify-email/${token}`;
    await sendVerificationEmail(email, verifyUrl);
    // ###$$$$ uncomment it ****
    // // toast noti
    // {
    //       description: "Sunday, December 03, 2023 at 9:00 AM",
    //       action: {
    //         label: "Undo",
    //         onClick: () => console.log("Undo"),
    //       },
    //     }
    // 6. Create Session
    await createSession(user.id);
    return {
      success: true,
      message: "Signup Successfully!",
      account: {
        time: user?.createdAt,
        status: user?.verified,
      },
      description: "Please blah..blah..!",
    };
  } catch (error) {
    return {
      errors: { general: "Something went wrong. Please try again." },
    };
  }
};
