"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { resetPassword } from "../action";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: "blue",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "8px",
        border: "none",
        cursor: pending ? "not-allowed" : "pointer",
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? "Resetting..." : "Reset Password"}
    </button>
  );
}

export default function PasswordResetPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const [state, formAction] = useFormState(resetPassword, { errors: {} });

  // Redirect to sign-in on success
  useEffect(() => {
    if (state.success) {
      router.push("/signin");
    }
  }, [state.success, router]);

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}
      >
        Set New Password
      </h1>
      <form
        action={formAction}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input type="hidden" name="token" value={params.token} />
        <div>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            style={{
              border: "1px solid #ccc",
              padding: "0.5rem",
              borderRadius: "4px",
            }}
          />
          {/* {state.errors?.password && (
            <p style={{ color: "red", marginTop: "0.25rem" }}>
              {state.errors.password}
            </p>
          )} */}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            style={{
              border: "1px solid #ccc",
              padding: "0.5rem",
              borderRadius: "4px",
            }}
          />
          {/* {state.errors?.confirmPassword && (
            <p style={{ color: "red", marginTop: "0.25rem" }}>
              {state.errors.confirmPassword}
            </p>
          )} */}
        </div>
        {state.errors?.token && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>
            {state.errors.token}
          </p>
        )}
        {/* {state.errors?.general && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>
            {state.errors.general}
          </p>
        )} */}
        <SubmitButton />
      </form>
    </div>
  );
}
