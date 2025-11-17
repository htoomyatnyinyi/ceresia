import SignInForm from "./form";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <SignInForm />
      <Link href="/reset-password" className="underline p-2 m-1">
        Reset Password
      </Link>
      <Link href="/verifyemail" className="underline p-2 m-1">
        Re-send Email varification
      </Link>
    </div>
  );
};

export default page;
