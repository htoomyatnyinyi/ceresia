import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { verifySession } from "@/lib/session";
import Link from "next/link"; // Use Link for client-side navigation
import { Decimal } from "@prisma/client/runtime/library";

// --- 1. Types and Constants ---

interface OrdersPageProps {
  searchParams: {
    status?: OrderStatus;
    page?: string;
  };
}

const TAKE_COUNT = 10;
const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// --- 2. Data Fetching ---

async function getOrders({
  status,
  page,
}: {
  status?: OrderStatus;
  page?: number;
}) {
  const skip = ((page || 1) - 1) * TAKE_COUNT;

  // Total count for pagination
  const totalOrders = await prisma.order.count({
    where: status ? { status } : {},
  });

  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    take: TAKE_COUNT,
    skip: skip,
    // Include the user details (username and email)
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  return {
    orders,
    totalOrders,
    currentPage: page || 1,
    totalPages: Math.ceil(totalOrders / TAKE_COUNT),
  };
}

// --- 3. Component (Page) ---

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // Authorization Check
  const session = await verifySession();
  // Assuming verifySession returns an object with a 'success' status and 'role'
  if (!session.success || session.role !== "ADMIN") {
    return (
      <h1 className="text-red-500 text-2xl p-8">
        Access Denied: Admin privileges required.
      </h1>
    );
  }

  const currentPage = parseInt(searchParams.page || "1");

  const { orders, totalOrders, totalPages } = await getOrders({
    status: searchParams.status,
    page: currentPage,
  });

  const currentStatus = searchParams.status;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📦 Order Management ({totalOrders})
      </h1>

      <OrderStatusFilters currentStatus={currentStatus} />

      <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <OrderTable orders={orders} />
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        currentStatus={currentStatus}
      />
    </div>
  );
}

// --- 4. Sub-Components for Design ---

// Reusable component to handle currency formatting (from dashboard fix)
const formatCurrency = (decimalValue: Decimal | null | undefined): string => {
  const amount = Number(decimalValue?.toNumber() ?? 0);
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

// Component for Status filtering links
const OrderStatusFilters = ({
  currentStatus,
}: {
  currentStatus?: OrderStatus;
}) => (
  <div className="flex flex-wrap gap-2 mb-6">
    <Link
      href={`/admin/orders`}
      className={`px-4 py-2 text-sm rounded-full transition duration-150 ${
        !currentStatus
          ? "bg-indigo-600 text-white shadow-md"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      ALL ({ORDER_STATUSES.length})
    </Link>
    {ORDER_STATUSES.map((status) => (
      <Link
        key={status}
        href={`/admin/orders?status=${status}`}
        className={`px-4 py-2 text-sm rounded-full transition duration-150 ${
          currentStatus === status
            ? "bg-indigo-600 text-white shadow-md"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {status}
      </Link>
    ))}
  </div>
);

// Component for Status Badge
const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  let style = "bg-gray-100 text-gray-800";
  if (status === "PAID" || status === "DELIVERED") {
    style = "bg-green-100 text-green-700";
  } else if (status === "PENDING") {
    style = "bg-yellow-100 text-yellow-700";
  } else if (status === "CANCELLED") {
    style = "bg-red-100 text-red-700";
  } else if (status === "SHIPPED") {
    style = "bg-blue-100 text-blue-700";
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${style}`}>
      {status}
    </span>
  );
};

// Component for the Order List/Table
const OrderTable = ({
  orders,
}: {
  orders: Awaited<ReturnType<typeof getOrders>>["orders"];
}) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Order ID
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Customer
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Total Amount
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Date
        </th>
        <th className="px-6 py-3"></th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {orders.length > 0 ? (
        orders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{order.id.substring(0, 8)}...
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {order.user.username || order.user.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
              {formatCurrency(order.totalAmount)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <OrderStatusBadge status={order.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-indigo-600 hover:text-indigo-900 transition duration-150"
              >
                View
              </Link>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
            No orders found for this status.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

// Component for Pagination links
const Pagination = ({
  totalPages,
  currentPage,
  currentStatus,
}: {
  totalPages: number;
  currentPage: number;
  currentStatus?: OrderStatus;
}) => {
  if (totalPages <= 1) return null;

  // Simple array generation for page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const statusQuery = currentStatus ? `&status=${currentStatus}` : "";

  return (
    <nav className="mt-6 flex justify-center" aria-label="Pagination">
      <div className="flex space-x-2">
        {pages.map((page) => (
          <Link
            key={page}
            href={`/admin/orders?page=${page}${statusQuery}`}
            className={`px-4 py-2 text-sm font-medium rounded-md transition duration-150 ${
              page === currentPage
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-700 border hover:bg-gray-100"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>
    </nav>
  );
};

// ##############
// // app/admin/orders/page.tsx
// import prisma from "@/lib/prisma";
// import { OrderStatus } from "@prisma/client";
// import { verifySession } from "@/lib/session"; // <-- Import added

// interface OrdersPageProps {
//   searchParams: {
//     status?: OrderStatus;
//     page?: string;
//   };
// }

// // ... getOrders function remains the same ...
// async function getOrders({ status }: { status?: OrderStatus }) {
//   const take = 10;
//   // const skip = ((parseInt(page) || 1) - 1) * take;

//   const orders = await prisma.order.findMany({
//     where: status ? { status } : {},
//     orderBy: { createdAt: "desc" },
//     take,
//     include: {
//       user: {
//         select: {
//           username: true,
//           email: true,
//         },
//       },
//     },
//   });

//   const totalOrders = await prisma.order.count({
//     where: status ? { status } : {},
//   });

//   return { orders, totalOrders };
// }

// export default async function OrdersPage({ searchParams }: OrdersPageProps) {
//   // 🚨 FIXED: Authorization Check
//   const session = await verifySession();
//   if (!session.success || session.role !== "ADMIN") {
//     // Assuming verifySession returns role
//     return <h1>Access Denied: Must be logged in as Admin.</h1>;
//     // In a real app, you would redirect them to login/home
//   }

//   const { orders, totalOrders } = await getOrders({
//     status: searchParams.status,
//   });

//   // (Component render logic remains the same)
//   return (
//     <div>
//       <h1>Order Management ({totalOrders})</h1>
//       {/* ... rest of the component ... */}
//       <p>Filter by Status: {searchParams.status || "ALL"}</p>

//       <div className="mt-6">
//         {orders.map((order) => (
//           <div key={order.id} className="border p-4 mb-2">
//             <h2 className="text-lg font-semibold">
//               Order #{order.id.substring(0, 8)}
//             </h2>
//             <p>
//               Status:{" "}
//               <span
//                 className={`font-bold ${
//                   order.status === "PENDING" ? "text-red-500" : "text-green-500"
//                 }`}
//               >
//                 {order.status}
//               </span>
//             </p>
//             <p>Customer: {order.user.username || order.user.email}</p>
//             <p>Total: ${Number(order.totalAmount).toFixed(2)}</p>
//             <a
//               href={`/admin/orders/${order.id}`}
//               className="text-blue-500 hover:underline"
//             >
//               View Details
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// // // app/dashboard/orders/page.tsx
// // import prisma from "@/lib/prisma";
// // import { OrderStatus } from "@prisma/client"; // Import the enum type

// // interface OrdersPageProps {
// //   searchParams: {
// //     status?: OrderStatus; // Filter by status
// //     page?: string;
// //   };
// // }

// // // Function to fetch paginated and filtered orders
// // async function getOrders({ status }: { status?: OrderStatus }) {
// //   const take = 10;
// //   // const skip = ((parseInt(page) || 1) - 1) * take; // For real pagination

// //   const orders = await prisma.order.findMany({
// //     where: status ? { status } : {}, // Apply status filter if provided
// //     orderBy: { createdAt: "desc" },
// //     take,
// //     // skip, // Uncomment for pagination
// //     include: {
// //       user: {
// //         select: {
// //           username: true,
// //           email: true,
// //         },
// //       },
// //     },
// //   });

// //   const totalOrders = await prisma.order.count({
// //     where: status ? { status } : {},
// //   });

// //   return { orders, totalOrders };
// // }

// // export default async function OrdersPage({ searchParams }: OrdersPageProps) {
// //   const { orders, totalOrders } = await getOrders({
// //     status: searchParams.status,
// //   });

// //   // (In a real app, you'd use a Client Component for the filter/table UI)

// //   return (
// //     <div>
// //       <h1>Order Management ({totalOrders})</h1>

// //       {/* Client Component: OrderStatusFilter and OrderTable */}
// //       <p>Filter by Status: {searchParams.status || "ALL"}</p>

// //       <div className="mt-6">
// //         {orders.map((order) => (
// //           <div key={order.id} className="border p-4 mb-2">
// //             <h2 className="text-lg font-semibold">
// //               Order #{order.id.substring(0, 8)}
// //             </h2>
// //             <p>
// //               Status:{" "}
// //               <span
// //                 className={`font-bold ${
// //                   order.status === "PENDING" ? "text-red-500" : "text-green-500"
// //                 }`}
// //               >
// //                 {order.status}
// //               </span>
// //             </p>
// //             <p>Customer: {order.user.username || order.user.email}</p>
// //             <p>Total: ${Number(order.totalAmount).toFixed(2)}</p>
// //             <a
// //               href={`/dashboard/orders/${order.id}`}
// //               className="text-blue-500 hover:underline"
// //             >
// //               View Details
// //             </a>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // // import prisma from "@/lib/prisma";
// // // import { verifySession } from "@/lib/session";

// // // const OrderPage = async () => {
// // //   const session = await verifySession();
// // //   // const userId = "clxi8v09c000008l414y5e36k";
// // //   // Check if user is authenticated
// // //   // if (!session?.userId) {
// // //   //   return {
// // //   //     success: false,
// // //   //     message: "User is not authenticated.",
// // //   //   };
// // //   // }

// // //   const orders = await prisma.order.findMany({
// // //     where: { userId: session.userId },
// // //     include: {
// // //       items: true,
// // //     },
// // //   });

// // //   // console.log(orders, "orders");

// // //   return (
// // //     <div>
// // //       <h1>OrderPage</h1>

// // //       {orders?.map((order) => (
// // //         <div key={order.id} className="border p-2 m-1">
// // //           <p>Order Status = {order?.status}</p>
// // //           <p>Total Cost = {Number(order?.totalAmount)}</p>
// // //           {/* <p>{order?.shippingAddress?.city}</p>
// // //           <p>{order?.shippingAddress?.state}</p> */}
// // //           {order?.items.map((item) => (
// // //             <div key={item.id} className="p-2 m-1 border-b-2">
// // //               <p>Name = {item.productName}</p>
// // //               <p>Price = {Number(item.price)}</p>
// // //               <p>Quantity = {item.quantity}</p>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // export default OrderPage;
