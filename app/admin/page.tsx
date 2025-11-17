import { verifySession } from "@/lib/session";

import prisma from "@/lib/prisma";

const page = async () => {
  // const session = await verifySession();
  // if (!session) {
  //   return null;
  // }

  const [
    users,
    user_count,
    orders,
    order_kpi,
    orders_desc,
    order_count,
    products,
    product_count,
    product_kpi,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.user.count(),
    // prisma.user.count({
    //   where: { role: "USER", createdAt: { gte: Date() } },
    // }),
    prisma.order.findMany(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.order.count(),
    prisma.product.findMany(),
    prisma.product.count(),
    prisma.product.aggregate({
      _sum: {
        price: true,
        stock: true,
      },
    }),
  ]);

  return (
    <div>
      <h1>Admin Dashboard KPI</h1>
      <p>User Count: {user_count}</p>
      <p>Order Count: {order_count}</p>
      <p>
        Total Sales Amount: $
        {Number(order_kpi._sum.totalAmount)
          ? Number(order_kpi._sum.totalAmount)
          : 0}
        {/* {order_kpi._sum.totalAmount ? order_kpi._sum.totalAmount : 0} */}
      </p>
      <p>Product Count: {product_count}</p>
      <p>
        Total Product Stock:{" "}
        {product_kpi._sum.stock ? product_kpi._sum.stock : 0}
      </p>
      <p>
        Total Product Value: $
        {Number(product_kpi._sum.price) ? Number(product_kpi._sum.price) : 0}
        {/* {product_kpi._sum.price ? product_kpi._sum.price : 0} */}
      </p>

      <div>
        <div className="p-2 m-1 border-b-4 text-pink-500 ">
          <h1>User</h1>
          {users?.map((user) => (
            <div key={user.id}>{user.username}</div>
          ))}
        </div>
        <div className="p-2 m-1 border-b-4 text-green-500 ">
          <h1>Product Lists</h1>
          {products?.map((product) => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
        <div className="p-2 m-1 border-b-4  text-yellow-800">
          <p>OrderLists</p>
          {orders?.map((order) => (
            <div key={order.id}>{order.status}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

// import prisma from "@/lib/prisma";

// // Use a separate function for data fetching for clarity and potential caching
// const getDashboardData = async () => {
//   // Fetch only the data required for the KPIs and recent lists
//   const [
//     user_count,
//     order_kpi,
//     recent_orders,
//     order_count,
//     product_count,
//     product_kpi,
//   ] = await Promise.all([
//     prisma.user.count(),

//     // Total Revenue
//     prisma.order.aggregate({
//       _sum: { totalAmount: true },
//     }),

//     // Recent Orders List (Used for a feed/list)
//     prisma.order.findMany({
//       orderBy: { createdAt: "desc" },
//       take: 5,
//       // Include user email/username for display
//       include: { user: { select: { username: true } } },
//     }),

//     // Total Order Count
//     prisma.order.count(),

//     // Total Product Count
//     prisma.product.count(),

//     // Total Stock and Value
//     prisma.product.aggregate({
//       _sum: { stock: true },
//       // _sum: { price: true, stock: true },
//     }),
//   ]);

//   return {
//     user_count,
//     order_kpi,
//     recent_orders,
//     order_count,
//     product_count,
//     product_kpi,
//   };
// };

// const Page = async () => {
//   // 1. Session Check (Assuming this is handled in dashboard/layout.tsx for all children)
//   // If you want to handle it here, uncomment and ensure verifySession handles roles/redirects.
//   /*
//   const session = await verifySession();
//   if (!session || session.role !== 'ADMIN') {
//     // Redirect or return an access denied message
//     return <h1>Access Denied</h1>;
//   }
//   */

//   // 2. Fetch Data
//   const data = await getDashboardData();
//   const {
//     user_count,
//     order_kpi,
//     recent_orders,
//     order_count,
//     product_count,
//     product_kpi,
//   } = data;

//   // 3. Helper function for safe Decimal to String conversion and formatting
//   const formatCurrency = (decimalValue: any) => {
//     // Checks if the value exists and converts it to a Number, handling Prisma's Decimal type
//     const amount = Number(decimalValue ?? 0);
//     return amount.toFixed(2);
//   };

//   return (
//     <div>
//       <h1>Admin Dashboard KPIs 📊</h1>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//         {/* KPI Card: User Count */}
//         <div className="p-4 border rounded shadow-md">
//           <p className="text-xl font-bold">{user_count}</p>
//           <p className="text-sm text-gray-500">Total Users</p>
//         </div>

//         {/* KPI Card: Order Count */}
//         <div className="p-4 border rounded shadow-md">
//           <p className="text-xl font-bold">{order_count}</p>
//           <p className="text-sm text-gray-500">Total Orders</p>
//         </div>

//         {/* KPI Card: Total Sales Amount */}
//         <div className="p-4 border rounded shadow-md">
//           <p className="text-xl font-bold">
//             ${formatCurrency(order_kpi._sum.totalAmount)}
//           </p>
//           <p className="text-sm text-gray-500">Total Revenue</p>
//         </div>

//         {/* KPI Card: Product Count */}
//         <div className="p-4 border rounded shadow-md">
//           <p className="text-xl font-bold">{product_count}</p>
//           <p className="text-sm text-gray-500">Total Products</p>
//         </div>

//         {/* KPI Card: Total Product Stock */}
//         <div className="p-4 border rounded shadow-md">
//           <p className="text-xl font-bold">{product_kpi._sum.stock ?? 0}</p>
//           <p className="text-sm text-gray-500">Total Stock Quantity</p>
//         </div>

//         {/* KPI Card: Total Product Value (Price * Stock is more accurate, but using price sum for simplicity here) */}
//         <div className="p-4 border rounded shadow-md">
//           <p className="text-xl font-bold">
//             ${formatCurrency(product_kpi._sum.price)}
//           </p>
//           <p className="text-sm text-gray-500">
//             Product Value (Sum of Base Prices)
//           </p>
//         </div>
//       </div>

//       <h2>Recent Orders 📦</h2>
//       <div className="p-4 border rounded">
//         {recent_orders.length > 0 ? (
//           <ul className="space-y-2">
//             {recent_orders.map((order) => (
//               <li
//                 key={order.id}
//                 className="p-2 border-b last:border-b-0 flex justify-between items-center"
//               >
//                 <span
//                   className={`font-medium ${
//                     order.status === "PENDING"
//                       ? "text-yellow-600"
//                       : "text-green-600"
//                   }`}
//                 >
//                   #{order.id.substring(0, 8)}... - {order.status}
//                 </span>
//                 <span>{order.user.username || "Guest"}</span>
//                 <span className="font-semibold">
//                   ${formatCurrency(order.totalAmount)}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No recent orders found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Page;
