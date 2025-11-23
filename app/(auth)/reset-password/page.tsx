"use client";

import { useFormState, useFormStatus } from "react-dom";
import { requestPasswordReset } from "./action";
import { useActionState, useEffect } from "react";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="p-2 m-1 bg-sky-400 text-white"
    >
      {pending ? "Sending..." : "Send Reset Link"}
    </button>
  );
};

export default function PasswordResetRequestPage() {
  const [state, action] = useActionState(requestPasswordReset, {
    errors: {},
  });
  //   const [state, formAction] = useFormState(requestPasswordReset, {
  //     errors: {},
  //   });

  return (
    <div className="">
      <h1>Reset Password</h1>
      {state.success ? (
        <p className="">
          If an account exists for the provided email, a reset link has been
          sent.
        </p>
      ) : (
        <form
          action={action}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              style={{
                border: "1px solid #ccc",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            />
            {/* {state.errors?.email && (
              <p style={{ color: "red", marginTop: "0.25rem" }}>
                {state.errors.email}
              </p>
            )} */}
          </div>
          {/* {state.errors?.general && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>
              {state.errors.general}
            </p>
          )} */}
          <SubmitButton />
        </form>
      )}
    </div>
  );
}
