// "use client";

// import { useActionState, useEffect } from "react";
// import Link from "next/link";
// import { signin } from "./actions";
// import { toast } from "sonner";

// const SignInForm = () => {
//   const [state, action, pending] = useActionState(signin, { errors: {} });

//   // 👇 The correct way to display a toast
//   useEffect(() => {
//     // Check if the state has a success message to display
//     if (state?.message) {
//       toast.success(state.message);
//     }
//     // You could also add error toasts here:
//     // if (state?.errors?.general) {
//     //   toast.error(state.errors.general);
//     // }
//   }, [state]); // 👈 Re-run this effect every time 'state' changes

//   return (
//     <div>
//       <form action={action}>
//         <input
//           type="email"
//           name="email"
//           placeholder="email"
//           className="p-2 m-1 border-2 "
//           defaultValue="abc@mail.com"
//         />
//         {state?.errors?.email && <p>{state.errors.email}</p>}
//         <input
//           type="password"
//           name="password"
//           placeholder="password"
//           className="p-2 m-1 border-2 "
//           defaultValue="abcd"
//         />
//         {state?.errors?.password && <p>{state.errors.password}</p>}

//         <button disabled={pending} className="p-2 m-1 border-2 border-sky-400">
//           {pending ? "Loging ...In" : "Submit"}
//         </button>
//       </form>
//       <div>
//         <p>If you do not have an account create here.. </p>
//         <Link href="/signup">SignUp</Link>
//       </div>
//     </div>
//   );
// };

// export default SignInForm;
