"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
// import { signup } from "./actions"; // Keeping this commented out as per your original
import { signup } from "@/server-actions/auth";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function page() {
  const [state, action, pending] = useActionState(signup, { errors: {} });
  // console.log(state); // Keeping this commented out for cleaner console

  useEffect(() => {
    // Handle successful signup and redirect
    if (state?.success) {
      toast.success(state.message, {
        description: state.description,
      });
      redirect("/products"); // Assuming redirect to /products after successful signup, similar to signin
    }

    // Handle errors and display toast notifications
    if (state?.errors?.username) {
      toast.error(state.errors.username);
    }
    if (state?.errors?.email) {
      toast.error(state.errors.email);
    }
    // if (state?.errors?.password) {
    //   toast.error(state.errors.password);
    // }
    // if (state?.errors?.confirmPassword) {
    //   toast.error(state.errors.confirmPassword);
    // }
  }, [state]);

  return (
    <div className="h-screen">
      <div className="flex justify-center align-middle items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Enter your information below to create a new account
            </CardDescription>
            <CardAction>
              <Link href="/signin">Sign In</Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form action={action}>
              <div className="flex flex-col gap-4">
                {/* Username Input */}
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="JohnDoe"
                    required
                    defaultValue="abc"
                  />
                </div>

                {/* Email Input */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    defaultValue="abc@mail.com"
                  />
                </div>

                {/* Password Input */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    defaultValue="abcd"
                  />
                </div>

                {/* Confirm Password Input */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    required
                    defaultValue="abcd"
                  />
                </div>
              </div>
              <br />
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Sign Up with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
// import SignUpForm from "./form";

// const page = () => {
//   return (
//     <div className="py-4 px-4 backdrop-blur-3xl shadow-2xl ">
//       <div className="container mx-auto flex flex-col justify-between items-center">
//         <h1>let's connect!</h1>
//         <SignUpForm />
//         <br />
//         <p>
//           Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto,
//           praesentium distinctio quis voluptates voluptatum sapiente et incidunt
//           velit deserunt! Ducimus beatae eum placeat amet facere nihil possimus
//           odit corrupti aliquid?
//         </p>
//       </div>
//     </div>
//   );
// };

// export default page;
