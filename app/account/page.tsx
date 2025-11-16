import { verifySession } from "@/lib/session";
import Link from "next/link";
import SignOutForm from "../(auth)/signout/form";

const Account = async () => {
  const session = await verifySession();
  console.log(session);

  return (
    <div>
      <Link href="/account/address" className="p-2 m-1 border-b-2">
        Address
      </Link>
      <Link href="/account/order" className="p-2 m-1 border-b-2">
        Order
      </Link>
      <SignOutForm userId={session?.userId} />
    </div>
  );
};

export default Account;
