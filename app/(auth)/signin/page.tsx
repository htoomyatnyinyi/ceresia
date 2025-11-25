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
import { useActionState, useEffect } from "react";
import { signin } from "@/server-actions/auth";
// import { signin } from "./actions";
import { toast } from "sonner";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function page() {
  const [state, action, pending] = useActionState(signin, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      redirect("/products");
    }
  }, [state]);

  return (
    <div className="h-screen">
      <div className="flex justify-center align-middle items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              {/* <Button variant="link">Sign Up</Button> */}
              <Link href="/signup">Sign Up</Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form action={action}>
              <div className="flex flex-col gap-6">
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
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    defaultValue="abcd"
                  />
                </div>
              </div>
              <br />
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Loging ...In" : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {/* <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Loging ...In" : "Login"}
        </Button> */}
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// import SignInForm from "./form";
// import Link from "next/link";

// const page = () => {
//   return (
//     <div>
//       <SignInForm />
//       <Link href="/reset-password" className="underline p-2 m-1">
//         Reset Password
//       </Link>
//       <Link href="/verifyemail" className="underline p-2 m-1">
//         Re-send Email varification
//       </Link>
//     </div>
//   );
// };

// export default page;
