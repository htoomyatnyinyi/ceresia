"use client";

import Link from "next/link";
import { signup } from "./actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const SignUpForm = () => {
  const [state, action, pending] = useActionState(signup, { errors: {} });
  console.log(state);

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message, {
        description: state.description,
      });
    }
    if (state?.errors?.email) {
      toast.error(state.errors.email);
    }
    if (state?.errors?.username) {
      toast.error(state.errors.username);
    }
    if (state?.errors?.email) {
      toast.error(state.errors.email);
    }
  }, [state]);

  return (
    <div>
      <form action={action} className="">
        <input
          type="text"
          name="username"
          placeholder="usernmae"
          className="text-sky-400 border-2 p-2 m-1"
          defaultValue="abc"
        />
        {/* {state?.errors?.username && <p>{state.errors.username}</p>} */}

        <input
          type="email"
          name="email"
          placeholder="email"
          className="text-sky-400 border-2 p-2 m-1"
          defaultValue="abc@mail.com"
        />
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="password"
          className="text-sky-400 border-2 p-2 m-1"
          defaultValue="abcd"
        />
        {/* {state?.errors?.password && <p>{state.errors.password}</p>} */}
        {state?.errors &&
          "password" in state.errors &&
          state.errors.password && <p>{state.errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="confirm password"
          className="text-sky-400 border-2 p-2 m-1"
          defaultValue="abcd"
        />
        {state?.errors &&
          "confirmPassword" in state.errors &&
          state?.errors?.confirmPassword && (
            <p>{state.errors.confirmPassword}</p>
          )}
        {/* {state?.errors?.confirmPassword && (
          <p>{state.errors.confirmPassword}</p>
        )} */}

        <button disabled={pending}>
          {pending ? "Submitting..." : "Sign Up"}
        </button>
      </form>
      <div>
        <p>If you do not have an account create here.. </p>
        <Link href="/signin">SignIn</Link>
      </div>
    </div>
  );
};

export default SignUpForm;
