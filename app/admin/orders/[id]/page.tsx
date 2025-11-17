import prisma from "@/lib/prisma";
// import { OrderStatus } from "@prisma/client";
import { verifySession } from "@/lib/session";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const awaitParams = await params;
  const orderId = awaitParams.id;

  const session = await verifySession();

  if (!session.success || session.role !== "ADMIN") {
    return <h1>Access Denied: Must be logged in as Admin.</h1>;
  }

  const order = await getOrder(orderId);

  if (!order) {
    return <h1>Order Not Found</h1>;
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Order Details #{order.id.substring(0, 10)}...
      </h1>

      {/* ... rest of the component remains the same ... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary Card */}
        <div className="md:col-span-2 space-y-4">
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p>
              Current Status:
              <span className="font-bold text-lg">{order.status}</span>
            </p>
            <p>Order Date: {order.createdAt.toLocaleDateString()}</p>
            <p>
              Total Amount:
              <span className="text-green-600 font-bold">
                ${Number(order.totalAmount).toFixed(2)}
              </span>
            </p>
            <p>Total Items: {totalItems}</p>

            {/* Update Status Form goes here */}
            <div className="mt-4">
              {/* <UpdateStatusForm orderId={order.id} currentStatus={order.status} /> */}
              <p>[Status Update Form Placeholder]</p>
            </div>
          </div>

          {/* Order Items List */}
          <div className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Items Purchased</h2>
            {order.items.map((item) => (
              <div key={item.id} className="border-b py-2 flex justify-between">
                <span>
                  {item.quantity} x {item.productName}
                </span>
                <span className="font-medium">
                  ${Number(item.price).toFixed(2)} each
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="space-y-4">
          <div className="border p-4 rounded shadow ">
            <h2 className="text-xl font-semibold mb-2">Customer Info</h2>
            <p>Username: {order.user.username}</p>
            <p>Email: {order.user.email}</p>
            <p>Phone: {order.user.phoneNumber || "N/A"}</p>
            <a
              href={`/admin/users/${order.userId}`}
              className="text-sm text-blue-500 hover:underline"
            >
              View Customer Profile
            </a>
          </div>

          <div className="border p-4 rounded shadow ">
            <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(order.shippingAddress, null, 2) || "N/A"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          username: true,
          email: true,
          phoneNumber: true,
        },
      },
      items: true,
    },
  });

  return order;
}

// // app/dashboard/orders/[id]/page.tsx
// import prisma from "@/lib/prisma";
// import { OrderStatus } from "@prisma/client";

// async function getOrder(orderId: string) {
//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     include: {
//       user: {
//         select: {
//           username: true,
//           email: true,
//           phoneNumber: true,
//         },
//       },
//       items: true, // Fetch the OrderItem snapshots
//     },
//   });

//   if (!order) {
//     throw new Error("Order not found");
//   }

//   return order;
// }

// export default async function OrderDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const order = await getOrder(params.id);
//   const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

//   // Note: The Update Status form (UpdateStatusForm) should be a Client Component
//   // that calls a Server Action (updateOrderStatus)

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">
//         Order Details #{order.id.substring(0, 10)}...
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Order Summary Card */}
//         <div className="md:col-span-2 space-y-4">
//           <div className="border p-4 rounded shadow">
//             <h2 className="text-xl font-semibold mb-2">Summary</h2>
//             <p>
//               Current Status:
//               <span className="font-bold text-lg">{order.status}</span>
//             </p>
//             <p>Order Date: {order.createdAt.toLocaleDateString()}</p>
//             <p>
//               Total Amount:
//               <span className="text-green-600 font-bold">
//                 ${Number(order.totalAmount).toFixed(2)}
//               </span>
//             </p>
//             <p>Total Items: {totalItems}</p>

//             {/* Update Status Form goes here */}
//             <div className="mt-4">
//               {/* <UpdateStatusForm orderId={order.id} currentStatus={order.status} /> */}
//               <p>[Status Update Form Placeholder]</p>
//             </div>
//           </div>

//           {/* Order Items List */}
//           <div className="border p-4 rounded shadow">
//             <h2 className="text-xl font-semibold mb-2">Items Purchased</h2>
//             {order.items.map((item) => (
//               <div key={item.id} className="border-b py-2 flex justify-between">
//                 <span>
//                   {item.quantity} x {item.productName}
//                 </span>
//                 <span className="font-medium">
//                   ${Number(item.price).toFixed(2)} each
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Customer & Shipping Info */}
//         <div className="space-y-4">
//           <div className="border p-4 rounded shadow bg-gray-50">
//             <h2 className="text-xl font-semibold mb-2">Customer Info</h2>
//             <p>Username: {order.user.username}</p>
//             <p>Email: {order.user.email}</p>
//             <p>Phone: {order.user.phoneNumber || "N/A"}</p>
//             <a
//               href={`/dashboard/users/${order.userId}`}
//               className="text-sm text-blue-500 hover:underline"
//             >
//               View Customer Profile
//             </a>
//           </div>

//           <div className="border p-4 rounded shadow bg-gray-50">
//             <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
//             {/* Since shippingAddress is Json?, you need to handle it */}
//             <pre className="whitespace-pre-wrap text-sm">
//               {JSON.stringify(order.shippingAddress, null, 2) || "N/A"}
//             </pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
