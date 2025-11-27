// app/dashboard/users/[id]/verification-button.tsx
"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

interface VerificationButtonProps {
  userId: string;
  isVerified: boolean;
  // The Server Action is passed as a prop
  action: (
    userId: string,
    currentStatus: boolean
  ) => Promise<{ success: boolean; message: string }>;
}

export default function VerificationButton({
  userId,
  isVerified,
  action,
}: VerificationButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleClick = () => {
    setMessage("");
    startTransition(async () => {
      const result = await action(userId, isVerified);

      setMessage(result.message);
      if (result.success) {
        // Force a refresh of the Server Component data
        router.refresh();
      }
    });
  };

  const buttonText = isVerified ? "UNVERIFY User" : "VERIFY User";

  return (
    <div className="mt-4 space-y-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`px-4 py-2 rounded font-semibold text-white text-sm w-full transition-colors ${
          isPending
            ? "bg-gray-400"
            : isVerified
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isPending ? "Updating..." : buttonText}
      </button>
      {message && (
        <p
          className={`text-xs ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
