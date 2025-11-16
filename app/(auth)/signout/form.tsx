"use client";

import { useActionState, useEffect } from "react";
import { signout } from "./actions";
import { toast } from "sonner";

const SignOutForm = ({ userId }: { userId: string | undefined }) => {
  // const SignOutForm = () => {
  const [state, signoutaction, pending] = useActionState(signout, null);

  // 👇 The correct way to display a toast
  useEffect(() => {
    // Check if the state has a success message to display
    if (state?.message) {
      toast.success(state.message, {
        description: "We will see again.!",
        action: {
          label: "Let's get signin!",
          onClick: () => {
            window.location.href = "/signin";
          },
        },
      });
    }
    // You could also add error toasts here:
    // if (state?.errors?.general) {
    //   toast.error(state.errors.general);
    // }
  }, [state]); // 👈 Re-run this effect every time 'state' changes

  return (
    <form action={signoutaction}>
      <button
        type="submit"
        disabled={!userId || pending}
        className="border text-red-500 p-2 m-1"
      >
        {userId ? (pending ? "Signing Out..." : "Sign Out") : "Not Signed In"}
      </button>
      {/* {state?.message} */}
    </form>
  );
};

export default SignOutForm;
