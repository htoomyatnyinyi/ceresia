"use client";

import { useActionState } from "react";
import { signout } from "./actions";
// import { verifySession } from "@/lib/session";

const SignOutForm = ({ userId }: { userId: string | undefined }) => {
  // const SignOutForm = async () => {
  //   const session = await verifySession();
  //   console.log(session?.userId, "userId id to delete");

  const [state, signoutaction, pending] = useActionState(signout, {
    success: false,
    message: "",
    errors: false,
  });

  return (
    <div>
      <div>
        <form action={signoutaction}>
          <input
            type="text"
            name="userId"
            hidden
            defaultValue={userId}
            // defaultValue={session?.userId}
          />
          <button
            type="submit"
            disabled={pending}
            className="border text-red-500 p-2 m-1"
          >
            SignOUt
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignOutForm;
