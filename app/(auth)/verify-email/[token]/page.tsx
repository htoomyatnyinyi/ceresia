"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyEmail } from "./actions";

export default function VerifyEmailPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      try {
        const result = await verifyEmail(params.token);
        if (result.success) {
          setStatus("success");
          setMessage(
            "Email verified successfully! Redirecting to dashboard..."
          );
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          setStatus("error");
          setMessage(result.error || "Failed to verify email.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    }
    verify();
  }, [params.token, router]);

  return (
    <div className="">
      <h1>Verify Email</h1>
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && <p style={{ color: "green" }}>{message}</p>}
      {status === "error" && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
