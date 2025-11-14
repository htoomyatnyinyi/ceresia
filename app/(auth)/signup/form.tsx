"use client";

import Link from "next/link";
import { signup } from "./actions";
import { useActionState } from "react";

const SignUpForm = () => {
  const [state, action, pending] = useActionState(signup, { errors: {} });

  return (
    <div>
      <form action={action} className="">
        <input
          type="text"
          name="username"
          placeholder="usernmae"
          className="text-sky-400 border-2 p-2 m-1"
        />
        {state?.errors?.username && <p>{state.errors.username}</p>}

        <input
          type="email"
          name="email"
          placeholder="email"
          className="text-sky-400 border-2 p-2 m-1"
        />
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="password"
          className="text-sky-400 border-2 p-2 m-1"
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

// "use client";
// import { useActionState } from "react";
// import { signup } from "./actions";

// const SignUpForm = () => {
//   const [state, action, pending] = useActionState<any>(signup, {
//     error: {},
//   });

//   console.log(state?.error, " state at signup", state?.success);

//   return (
//     <div>
//       <form action={action} className="flex flex-col ">
//         <input
//           type="text"
//           name="username"
//           placeholder="username"
//           className="p-2 m-1 "
//         />
//         {state?.errors?.username && <p>{state.errors.username}</p>}
//         <input
//           type="email"
//           name="email"
//           placeholder="email"
//           className="p-2 m-1 "
//         />
//         {state?.errors?.email && <p>{state.errors.email}</p>}

//         <input
//           type="password"
//           name="password"
//           placeholder="password"
//           className="p-2 m-1 "
//         />
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="confirPassword"
//           className="p-2 m-1 "
//         />
//         <button
//           type="submit"
//           className="p-2 m-1 bg-green-500"
//           disabled={pending}
//         >
//           {pending ? "Signing Up" : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUpForm;
