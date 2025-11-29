import { verifySession } from "@/lib/session";
import Link from "next/link";
import SignOutForm from "../(auth)/signout/form";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const Account = async () => {
  const session = await verifySession();

  if (!session.success) {
    // ✅ Solution A: Redirect the user to the login page
    redirect("/signin");

    // ✅ Solution B: Render an error UI element instead
    // return <div>You must be logged in to view this page.</div>;
  }

  const data = await prisma.order.findMany({
    where: { userId: session?.userId },
  });
  console.log(data, "data");

  return (
    <div>
      <h1>Welcome, {session.userId}</h1>
      {/* <Link href="/account/address" className="p-2 m-1 border-b-2">
        Address
      </Link>
      <Link href="/account/order" className="p-2 m-1 border-b-2">
        Order
      </Link> */}
      <SignOutForm userId={session?.userId} />
    </div>
  );
};

export default Account;
