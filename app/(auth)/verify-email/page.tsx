const page = () => {
  return <div>Comming Soon for verify-email.</div>;
};

export default page;
// "use client";

// import { useFormState, useFormStatus } from "react-dom";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { resendVerificationEmail } from "./action";

// function SubmitButton() {
//   const { pending } = useFormStatus();
//   return (
//     <button type="submit" disabled={pending}>
//       {pending ? "Sending..." : "Resend Verification Email"}
//     </button>
//   );
// }

// export default function ResendVerificationPage() {
//   const router = useRouter();
//   const [state, formAction] = useFormState(resendVerificationEmail, {
//     errors: {},
//   });

//   useEffect(() => {
//     if (state.success) {
//       setTimeout(() => router.push("/signin"), 5000);
//     }
//   }, [state.success, router]);

//   return (
//     <div className="max-w-[400px] m-auto p-2">
//       <h1
//         style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
//       >
//         Resend Verification Email
//       </h1>
//       {state.success ? (
//         <p className="text-green-500">
//           If an account exists and is unverified, a verification email has been
//           sent.
//         </p>
//       ) : (
//         <form action={formAction} className="flex">
//           <div>
//             <label htmlFor="email" className="block">
//               Email
//             </label>
//             <input id="email" name="email" type="email" className="p-2 m-1" />
//             {state.errors?.email && (
//               <p className="text-red-500">{state.errors.email}</p>
//             )}
//           </div>
//           {state.errors?.general && (
//             <p className="text-red-500">{state.errors.general}</p>
//           )}
//           <SubmitButton />
//         </form>
//       )}
//     </div>
//   );
// }

// // "use client";

// // import { useFormState, useFormStatus } from "react-dom";
// // import { useRouter } from "next/navigation";
// // import { useEffect } from "react";
// // import { sendVerificationEmail } from "@/lib/email";
// // import prisma from "@/lib/prisma";
// // import crypto from "crypto";
// // import z from "zod";

// // async function resendVerificationEmail(_: any, formData: FormData) {
// //   "use server";

// //   const email = formData.get("email")?.toString();
// //   if (!email || !z.email().safeParse(email).success) {
// //     return { errors: { email: "Invalid email address" } };
// //   }

// //   const user = await prisma.user.findUnique({
// //     where: { email },
// //   });

// //   if (!user || user.verified) {
// //     return { success: true }; // Don't leak user existence or verification status
// //   }

// //   try {
// //     const token = crypto.randomBytes(32).toString("hex");
// //     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

// //     await prisma.verificationToken.create({
// //       data: {
// //         userId: user.id,
// //         token,
// //         expiresAt,
// //       },
// //     });

// //     const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`;
// //     await sendVerificationEmail(email, verifyUrl);
// //     return { success: true };
// //   } catch (error) {
// //     console.error("Error resending verification email:", error);
// //     return {
// //       errors: {
// //         general: "Failed to send verification email. Please try again.",
// //       },
// //     };
// //   }
// // }

// // function SubmitButton() {
// //   const { pending } = useFormStatus();
// //   return (
// //     <button
// //       type="submit"
// //       disabled={pending}
// //       style={{
// //         background: "blue",
// //         color: "white",
// //         padding: "0.75rem 1.5rem",
// //         borderRadius: "8px",
// //         border: "none",
// //         cursor: pending ? "not-allowed" : "pointer",
// //         opacity: pending ? 0.6 : 1,
// //       }}
// //     >
// //       {pending ? "Sending..." : "Resend Verification Email"}
// //     </button>
// //   );
// // }

// // export default function ResendVerificationPage() {
// //   const router = useRouter();
// //   const [state, formAction] = useFormState(resendVerificationEmail, {
// //     errors: {},
// //   });

// //   useEffect(() => {
// //     if (state.success) {
// //       setTimeout(() => router.push("/signin"), 2000);
// //     }
// //   }, [state.success, router]);

// //   return (
// //     <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
// //       <h1
// //         style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
// //       >
// //         Resend Verification Email
// //       </h1>
// //       {state.success ? (
// //         <p style={{ color: "green" }}>
// //           If an account exists and is unverified, a verification email has been
// //           sent.
// //         </p>
// //       ) : (
// //         <form
// //           action={formAction}
// //           style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
// //         >
// //           <div>
// //             <label
// //               htmlFor="email"
// //               style={{ display: "block", marginBottom: "0.5rem" }}
// //             >
// //               Email
// //             </label>
// //             <input
// //               id="email"
// //               name="email"
// //               type="email"
// //               style={{
// //                 border: "1px solid #ccc",
// //                 padding: "0.5rem",
// //                 borderRadius: "4px",
// //               }}
// //             />
// //             {state.errors?.email && (
// //               <p style={{ color: "red", marginTop: "0.25rem" }}>
// //                 {state.errors.email}
// //               </p>
// //             )}
// //           </div>
// //           {state.errors?.general && (
// //             <p style={{ color: "red", marginTop: "0.5rem" }}>
// //               {state.errors.general}
// //             </p>
// //           )}
// //           <SubmitButton />
// //         </form>
// //       )}
// //     </div>
// //   );
// // }
