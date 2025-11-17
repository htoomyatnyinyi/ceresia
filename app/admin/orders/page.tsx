// app/dashboard/orders/page.tsx
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { verifySession } from "@/lib/session"; // <-- Import added

interface OrdersPageProps {
  searchParams: {
    status?: OrderStatus;
    page?: string;
  };
}

// ... getOrders function remains the same ...
async function getOrders({ status }: { status?: OrderStatus }) {
  const take = 10;
  // const skip = ((parseInt(page) || 1) - 1) * take;

  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    take,
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  const totalOrders = await prisma.order.count({
    where: status ? { status } : {},
  });

  return { orders, totalOrders };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // 🚨 FIXED: Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    // Assuming verifySession returns role
    return <h1>Access Denied: Must be logged in as Admin.</h1>;
    // In a real app, you would redirect them to login/home
  }

  const { orders, totalOrders } = await getOrders({
    status: searchParams.status,
  });

  // (Component render logic remains the same)
  return (
    <div>
      <h1>Order Management ({totalOrders})</h1>
      {/* ... rest of the component ... */}
      <p>Filter by Status: {searchParams.status || "ALL"}</p>

      <div className="mt-6">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 mb-2">
            <h2 className="text-lg font-semibold">
              Order #{order.id.substring(0, 8)}
            </h2>
            <p>
              Status:{" "}
              <span
                className={`font-bold ${
                  order.status === "PENDING" ? "text-red-500" : "text-green-500"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p>Customer: {order.user.username || order.user.email}</p>
            <p>Total: ${Number(order.totalAmount).toFixed(2)}</p>
            <a
              href={`/admin/orders/${order.id}`}
              className="text-blue-500 hover:underline"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
// // app/dashboard/orders/page.tsx
// import prisma from "@/lib/prisma";
// import { OrderStatus } from "@prisma/client"; // Import the enum type

// interface OrdersPageProps {
//   searchParams: {
//     status?: OrderStatus; // Filter by status
//     page?: string;
//   };
// }

// // Function to fetch paginated and filtered orders
// async function getOrders({ status }: { status?: OrderStatus }) {
//   const take = 10;
//   // const skip = ((parseInt(page) || 1) - 1) * take; // For real pagination

//   const orders = await prisma.order.findMany({
//     where: status ? { status } : {}, // Apply status filter if provided
//     orderBy: { createdAt: "desc" },
//     take,
//     // skip, // Uncomment for pagination
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
//   const { orders, totalOrders } = await getOrders({
//     status: searchParams.status,
//   });

//   // (In a real app, you'd use a Client Component for the filter/table UI)

//   return (
//     <div>
//       <h1>Order Management ({totalOrders})</h1>

//       {/* Client Component: OrderStatusFilter and OrderTable */}
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
//               href={`/dashboard/orders/${order.id}`}
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

// // import prisma from "@/lib/prisma";
// // import { verifySession } from "@/lib/session";

// // const OrderPage = async () => {
// //   const session = await verifySession();
// //   // const userId = "clxi8v09c000008l414y5e36k";
// //   // Check if user is authenticated
// //   // if (!session?.userId) {
// //   //   return {
// //   //     success: false,
// //   //     message: "User is not authenticated.",
// //   //   };
// //   // }

// //   const orders = await prisma.order.findMany({
// //     where: { userId: session.userId },
// //     include: {
// //       items: true,
// //     },
// //   });

// //   // console.log(orders, "orders");

// //   return (
// //     <div>
// //       <h1>OrderPage</h1>

// //       {orders?.map((order) => (
// //         <div key={order.id} className="border p-2 m-1">
// //           <p>Order Status = {order?.status}</p>
// //           <p>Total Cost = {Number(order?.totalAmount)}</p>
// //           {/* <p>{order?.shippingAddress?.city}</p>
// //           <p>{order?.shippingAddress?.state}</p> */}
// //           {order?.items.map((item) => (
// //             <div key={item.id} className="p-2 m-1 border-b-2">
// //               <p>Name = {item.productName}</p>
// //               <p>Price = {Number(item.price)}</p>
// //               <p>Quantity = {item.quantity}</p>
// //             </div>
// //           ))}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default OrderPage;
