// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// // Define the expected structure of the result from the Server Action
// type VerificationResult = {
//   success: boolean;
//   error?: string;
// };

// const VerifyEmailClient = ({ result }: { result: any }) => {
//   // const VerifyEmailClient = ({ result }: { result: VerificationResult }) => {
//   const router = useRouter();

//   // Set the message state based on the server result (no 'loading' state needed)
//   const [message] = useState(
//     result.success
//       ? "Email verified successfully! Redirecting to dashboard..."
//       : result.error || "Failed to verify email."
//   );

//   // Use useEffect ONLY for the necessary side effect of redirection,
//   // which runs after the component renders and needs client-side APIs.
//   useEffect(() => {
//     if (result.success) {
//       // Perform client-side redirection after a delay
//       const redirectTimer = setTimeout(() => router.push("/products"), 2000);

//       // Cleanup function to clear the timeout if the component unmounts
//       return () => clearTimeout(redirectTimer);
//     }
//   }, [result.success, router]);

//   // Determine status for styling
//   const status = result.success ? "success" : "error";

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-3xl font-bold mb-4">Verify Email</h1>
//       <p>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ipsa
//         consequatur eligendi repudiandae ullam eos odit, quidem modi minus
//         possimus odio unde sit, aliquam autem rerum magnam. Eveniet,
//         perspiciatis doloribus?
//       </p>
//       {status === "success" ? (
//         <p className="text-green-500 font-medium">{message}</p>
//       ) : (
//         <p className="text-red-500 font-medium">{message}</p>
//       )}
//     </div>
//   );
// };

// export default VerifyEmailClient;
