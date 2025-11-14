"use client";
import { useActionState } from "react";
import { signin } from "./actions";
import Link from "next/link";

const SignInForm = () => {
  const [state, action, pending] = useActionState(signin, { errors: {} });

  return (
    <div>
      <form action={action}>
        <input
          type="email"
          name="email"
          placeholder="email"
          className="p-2 m-1 border-2 "
        />
        {state?.errors?.email && <p>{state.errors.email}</p>}
        <input
          type="password"
          name="password"
          placeholder="password"
          className="p-2 m-1 border-2 "
        />
        {state?.errors?.password && <p>{state.errors.password}</p>}

        <button disabled={pending} className="p-2 m-1 border-2 border-sky-400">
          {pending ? "Loging ...In" : "Submit"}
        </button>
      </form>
      <div>
        <p>If you do not have an account create here.. </p>
        <Link href="/signup">SignUp</Link>
      </div>
    </div>
  );
};

export default SignInForm;
