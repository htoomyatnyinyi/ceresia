// app/dashboard/users/page.tsx
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { OrderStatus } from "@prisma/client"; // To check if roles are in schema

// Function to fetch all users (excluding sensitive password/token data)
async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      verified: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      // role: true, // Uncomment if you add 'role' to your User model
    },
  });
  return users;
}

export default async function UsersPage() {
  // 🚨 Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    return <h1>Access Denied: Must be logged in as Admin.</h1>;
  }

  const users = await getUsers();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        User Management ({users.length})
      </h1>

      <div className="border rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.verified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.verified ? "Yes" : "No"}
                  </span>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`/dashboard/users/${user.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
