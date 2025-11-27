// app/dashboard/users/[id]/page.tsx
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { toggleUserVerification } from "@/server-actions/user";
import VerificationButton from "./verification-button"; // <-- Client component to be created next

async function getUserDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      verified: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      birthdate: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      // role: true,
      orders: {
        take: 10, // Show recent orders
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
        },
      },
    },
  });
  return user;
}

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 🚨 Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    return <h1>Access Denied: Must be logged in as Admin.</h1>;
  }
  const awaitUserId = await params;
  const userId = awaitUserId.id;

  if (!userId) {
    return <h1>Error: User ID is missing from the URL.</h1>;
  }

  const user = await getUserDetails(userId);

  if (!user) {
    return <h1>User Not Found</h1>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        User: {user.username || user.email}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile & Actions */}
        <div className="md:col-span-1 space-y-4">
          <div className="border p-4 rounded shadow ">
            <h2 className="text-xl font-semibold mb-2">Profile Status</h2>
            <p>
              Status:{" "}
              <span
                className={`font-bold ${
                  user.verified ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.verified ? "Verified" : "Unverified"}
              </span>
            </p>

            {/* The client component for the button */}
            <VerificationButton
              userId={user.id}
              isVerified={user.verified}
              // Pass the Server Action reference
              action={toggleUserVerification}
            />
          </div>

          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Contact Details</h2>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phoneNumber || "N/A"}</p>
            <p>Joined: {user.createdAt.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="md:col-span-2 space-y-4">
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">
              Recent Orders ({user.orders.length})
            </h2>
            {user.orders.length > 0 ? (
              <ul>
                {user.orders.map((order) => (
                  <li
                    key={order.id}
                    className="border-b py-2 flex justify-between"
                  >
                    <span>Order #{order.id.substring(0, 8)}...</span>
                    <span
                      className={`font-medium ${
                        order.status === "PENDING"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-semibold">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
