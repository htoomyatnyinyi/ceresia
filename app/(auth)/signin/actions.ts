// "use server";

// import prisma from "@/lib/prisma";

// import { z } from "zod";
// import bcrypt from "bcrypt";
// import { createSession } from "@/lib/session";

// const SignInFormSchema = z.object({
//   email: z.email("Invalid email address"),
//   password: z.string().min(1, "Password must be at least 6 characters"),
// });

// export const signin = async (state: any, formData: any) => {
//   // 1. validate fields
//   const validateResult = SignInFormSchema.safeParse({
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });

//   if (!validateResult.success) {
//     return {
//       errors: validateResult.error.flatten().fieldErrors,
//     };
//   }

//   const { email, password } = validateResult.data;

//   // 2. Check if user exists
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     return {
//       errors: { email: "No account found with this email" },
//     };
//   }

//   // 3. Verify password
//   const isPasswordValid = await bcrypt.compare(password, user.password!);

//   if (!isPasswordValid) {
//     return {
//       errors: { password: "Incorrect password" },
//     };
//   }

//   // 4. Create session
//   try {
//     await createSession(user.id);
//     return {
//       success: true,
//       message: "SignIn Successfully!!",
//     };
//   } catch (error) {
//     console.error("Error creating session:", error);
//     return {
//       errors: { general: "Failed to sign in. Please try again." },
//     };
//   }
// };
