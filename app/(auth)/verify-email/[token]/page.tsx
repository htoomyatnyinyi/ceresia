import { verifyEmail } from "./actions"; // Import your server action
// import VerifyEmailClient from "./VerifyEmailClient";
import VerifyEmailClient from "@/components/general/VerifyEmailClient";

// This is an Async Server Component (SC)
const VerifyEmailPage = async ({ params }: { params: { token: string } }) => {
  // const { token } = params;

  const awaitToken = await params;
  const token = awaitToken.token;

  if (!token) {
    // Handle case where token is missing early
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Verification Error</h1>
        <p className="text-red-500 font-medium">
          Verification token is missing.
        </p>
      </div>
    );
  }

  // 1. Perform the verification directly on the server
  const result = await verifyEmail(token);

  // 2. Pass the result to the Client Component for display/redirection
  return <VerifyEmailClient result={result} />;
};

export default VerifyEmailPage;
