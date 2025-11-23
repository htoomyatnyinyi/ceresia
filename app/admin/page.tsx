// import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

// --- 1. Data Fetching and Shaping ---

const getDashboardData = async () => {
  // Use Promise.all to fetch all data concurrently
  const [
    user_count,
    order_kpi,
    recent_orders, // We only need recent orders for the main list
    product_count,
    product_stock_kpi, // Renamed product_kpi to be more specific to stock/value
  ] = await Promise.all([
    // Total User Count
    prisma.user.count(),

    // Total Revenue
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),

    // Recent Orders List (Top 5 for the feed)
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      // Select only necessary fields and include the user's username
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        user: { select: { username: true } },
      },
    }),

    // Total Product Count
    prisma.product.count(),

    // Total Stock and Sum of Base Prices
    prisma.product.aggregate({
      _sum: { stock: true, price: true },
    }),
  ]);

  return {
    user_count,
    order_kpi,
    recent_orders,
    product_count,
    product_stock_kpi,
  };
};

// --- 2. Helper Functions ---

// Handles Prisma Decimal type and formats it as currency
const formatCurrency = (decimalValue: Decimal | null | undefined): string => {
  const amount = Number(decimalValue?.toNumber() ?? 0);
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

// --- 3. The Main Component ---

const AdminDashboardPage = async () => {
  // * AUTH/SESSION CHECK (uncomment when ready)
  // const session = await verifySession();
  // if (!session || session.role !== 'ADMIN') {
  //   return <h1 className="text-red-500 text-2xl p-4">Access Denied: Admin Required</h1>;
  // }

  const data = await getDashboardData();
  const {
    user_count,
    order_kpi,
    recent_orders,
    product_count,
    product_stock_kpi,
  } = data;

  // Since the original code was fetching ALL users and ALL products,
  // I'll keep a placeholder list structure but recommend pagination for real-world use.
  const all_users = await prisma.user.findMany({
    take: 10,
    select: { id: true, username: true, email: true },
  });
  const all_products = await prisma.product.findMany({
    take: 10,
    select: { id: true, name: true, price: true },
  });

  return (
    <div className="p-4 md:p-8  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 ">Admin Dashboard</h1>

      {/* KPI Cards Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* KPI Card: Total Revenue */}
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(order_kpi._sum.totalAmount)}
            color=" text-green-600"
            icon="💵"
          />

          {/* KPI Card: Total Orders */}
          <KpiCard
            title="Total Orders"
            value={
              Number(data.recent_orders.length) > 0
                ? Number(order_kpi._sum.totalAmount)
                : 0
            } // Using total amount of orders and checking for order presence
            color=" text-blue-600"
            icon="📦"
          />

          {/* KPI Card: Total Users */}
          <KpiCard
            title="Total Users"
            value={user_count.toLocaleString()}
            color=" text-pink-600"
            icon="👥"
          />

          {/* KPI Card: Total Products */}
          <KpiCard
            title="Total Products"
            value={product_count.toLocaleString()}
            color=" text-yellow-600"
            icon="🏷️"
          />

          {/* KPI Card: Total Stock */}
          <KpiCard
            title="Total Stock Qty"
            value={product_stock_kpi._sum.stock?.toLocaleString() ?? "0"}
            color="text-purple-600"
            icon="🏭"
          />
        </div>
      </section>

      <hr className="my-8" />

      {/* Lists Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List (Focus item) */}
        <div className="lg:col-span-2  p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-blue-500 mr-2">🛒</span> Recent Orders (
            {recent_orders.length})
          </h2>
          <div className="space-y-3">
            {recent_orders.length > 0 ? (
              recent_orders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition duration-150 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      Order #{order.id.substring(0, 8)}...
                    </span>
                    <span className="font-semibold text-xl">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>User: **{order.user?.username || "Guest"}**</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No recent orders to display.
              </p>
            )}
          </div>
        </div>

        {/* Quick Lists (Users and Products) */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Quick List */}
          <QuickListCard
            title="Recent Users"
            items={all_users.map((u) => ({
              id: u.id,
              primary: u.username,
              secondary: u.email,
            }))}
            icon="🧑"
            emptyMessage="No users found."
            color="text-pink-600"
          />

          {/* Product Quick List */}
          <QuickListCard
            title="Top Products (All)"
            items={all_products.map((p) => ({
              id: p.id,
              primary: p.name,
              secondary: formatCurrency(p.price),
            }))}
            icon="🛍️"
            emptyMessage="No products found."
            color="text-green-600"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;

// --- 4. Reusable Presentational Components ---

// KPI Card Component
const KpiCard = ({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: string | number;
  color: string;
  icon: string;
}) => (
  <div
    className={`p-6 rounded-xl shadow-lg border-l-4 border-t border-b border-r ${color.replace(
      "bg-",
      "border-"
    )} ${color}`}
  >
    <div className="flex items-center justify-between">
      <p className="text-lg font-medium text-gray-600">{title}</p>
      <span className="text-3xl">{icon}</span>
    </div>
    <p className="text-4xl font-extrabold mt-1">{value}</p>
  </div>
);

// Order Status Badge Component
const OrderStatusBadge = ({ status }: { status: string }) => {
  let style = "bg-gray-200 text-gray-800";
  if (status === "PAID" || status === "DELIVERED") {
    style = "bg-green-100 text-green-700 font-semibold";
  } else if (status === "PENDING") {
    style = "bg-yellow-100 text-yellow-700 font-semibold";
  } else if (status === "CANCELLED") {
    style = "bg-red-100 text-red-700 font-semibold";
  }

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${style}`}>
      {status}
    </span>
  );
};

// Quick List Card Component
const QuickListCard = ({
  title,
  items,
  icon,
  emptyMessage,
  color,
}: {
  title: string;
  items: { id: string; primary: string | null; secondary: string | null }[];
  icon: string;
  emptyMessage: string;
  color: string;
}) => (
  <div className=" p-6 rounded-lg shadow-lg border border-gray-100">
    <h2 className={`text-xl font-semibold mb-4 flex items-center ${color}`}>
      <span className="mr-2">{icon}</span> {title}
    </h2>
    <div className="space-y-2">
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm p-2 border-b last:border-b-0"
          >
            <span className="font-medium truncate">{item.primary}</span>
            <span className="text-gray-600">{item.secondary}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic text-sm">{emptyMessage}</p>
      )}
    </div>
  </div>
);

// #####
// import { verifySession } from "@/lib/session";
// import prisma from "@/lib/prisma";

// // --- Data Fetching Logic ---
// // Use a separate function for data fetching for clarity
// const getDashboardData = async () => {
//   const [
//     user_count,
//     order_kpi,
//     recent_orders,
//     order_count,
//     product_count,
//     product_kpi,
//   ] = await Promise.all([
//     // Total User Count
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

//     // Total Stock (If you need total value, you'd need price here too)
//     prisma.product.aggregate({
//       _sum: { stock: true, price: true }, // Added price back for total value
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

// // --- Component and Rendering ---
// const DashboardPage = async () => {
//   // 1. Session Check (Uncomment and implement verifySession/role check as needed)
//   /*
//   const session = await verifySession();
//   if (!session || session.role !== 'ADMIN') {
//     // Return an access denied message or redirect
//     return <div className="p-8 text-center text-red-500 text-xl">Access Denied: Admin role required.</div>;
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

//   // 3. Helper function for safe Decimal/Number formatting
//   const formatCurrency = (decimalValue: any) => {
//     // Converts value to a Number, handles null/undefined, and formats to 2 decimal places.
//     const amount = Number(decimalValue ?? 0);
//     return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   };

//   // Helper for KPI card content
//   interface Kpi {
//       icon: string; // Emoji for visual appeal
//       title: string;
//       value: string | number;
//       subtext: string;
//       color: string;
//   }

//   const kpis: Kpi[] = [
//     {
//       icon: '👥',
//       title: 'Total Users',
//       value: user_count.toLocaleString(),
//       subtext: 'Registered accounts',
//       color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
//     },
//     {
//       icon: '💰',
//       title: 'Total Revenue',
//       value: `$${formatCurrency(order_kpi._sum.totalAmount)}`,
//       subtext: 'All-time sales total',
//       color: 'bg-green-50 border-green-200 text-green-700'
//     },
//     {
//       icon: '🛒',
//       title: 'Total Orders',
//       value: order_count.toLocaleString(),
//       subtext: 'Completed & pending orders',
//       color: 'bg-blue-50 border-blue-200 text-blue-700'
//     },
//     {
//       icon: '📦',
//       title: 'Total Products',
//       value: product_count.toLocaleString(),
//       subtext: 'Active listings',
//       color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
//     },
//     {
//       icon: '📦',
//       title: 'Total Stock',
//       value: (product_kpi._sum.stock ?? 0).toLocaleString(),
//       subtext: 'Current inventory quantity',
//       color: 'bg-red-50 border-red-200 text-red-700'
//     },
//     {
//       icon: '💲',
//       title: 'Product Value',
//       value: `$${formatCurrency(product_kpi._sum.price)}`,
//       subtext: 'Sum of all product base prices',
//       color: 'bg-pink-50 border-pink-200 text-pink-700'
//     },
//   ];

//   return (
//     <div className="p-4 md:p-8 space-y-8">
//       <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
//         Admin Dashboard
//       </h1>

//       {/* --- KPI Grid Section --- */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Key Metrics</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//           {kpis.map((kpi) => (
//             <div
//               key={kpi.title}
//               className={`p-5 rounded-lg border-2 shadow-lg hover:shadow-xl transition-shadow ${kpi.color}`}
//             >
//               <div className="flex items-center space-x-3">
//                 <span className="text-2xl">{kpi.icon}</span>
//                 <p className="text-sm font-medium uppercase">{kpi.title}</p>
//               </div>
//               <p className="text-3xl font-extrabold mt-2">
//                 {kpi.value}
//               </p>
//               <p className="text-xs mt-1 opacity-80">{kpi.subtext}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* --- Recent Activity Section --- */}
//       <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//         {/* Recent Orders Panel */}
//         <div className="bg-white p-6 rounded-lg shadow-xl border">
//           <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
//             <span className="mr-2 text-blue-500">📦</span> Recent Orders
//           </h2>
//           <div className="h-[300px] overflow-y-auto">
//             {recent_orders.length > 0 ? (
//               <ul className="divide-y divide-gray-200">
//                 {recent_orders.map((order) => {
//                   const statusColor = {
//                     PENDING: 'text-yellow-600 bg-yellow-100',
//                     SHIPPED: 'text-blue-600 bg-blue-100',
//                     DELIVERED: 'text-green-600 bg-green-100',
//                     CANCELLED: 'text-red-600 bg-red-100',
//                   }[order.status] || 'text-gray-600 bg-gray-100';

//                   return (
//                     <li
//                       key={order.id}
//                       className="py-3 flex justify-between items-center"
//                     >
//                       <div>
//                         <span className="block font-medium text-gray-800">
//                           Order #{order.id.substring(0, 8)}...
//                         </span>
//                         <span className="text-sm text-gray-500">
//                           By: {order.user?.username || "Guest"}
//                         </span>
//                       </div>
//                       <div className="text-right">
//                         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor}`}>
//                           {order.status}
//                         </span>
//                         <span className="block font-bold text-lg mt-1 text-green-600">
//                           ${formatCurrency(order.totalAmount)}
//                         </span>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             ) : (
//               <p className="text-gray-500 pt-10 text-center">No recent orders to display.</p>
//             )}
//           </div>
//         </div>

//         {/* Placeholder/Other List Panel (e.g., Top Products, Activity Log) */}
//         <div className="bg-white p-6 rounded-lg shadow-xl border">
//           <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
//             <span className="mr-2 text-purple-500">⭐</span> Placeholder Panel
//           </h2>
//           <div className="text-gray-500 h-[300px] flex items-center justify-center">
//             <p>This space is ready for an activity log or top-performing products list.</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DashboardPage;
// // import { verifySession } from "@/lib/session";

// // import prisma from "@/lib/prisma";

// // const page = async () => {
// //   // const session = await verifySession();
// //   // if (!session) {
// //   //   return null;
// //   // }

// //   const [
// //     users,
// //     user_count,
// //     orders,
// //     order_kpi,
// //     orders_desc,
// //     order_count,
// //     products,
// //     product_count,
// //     product_kpi,
// //   ] = await Promise.all([
// //     prisma.user.findMany(),
// //     prisma.user.count(),
// //     // prisma.user.count({
// //     //   where: { role: "USER", createdAt: { gte: Date() } },
// //     // }),
// //     prisma.order.findMany(),
// //     prisma.order.aggregate({
// //       _sum: {
// //         totalAmount: true,
// //       },
// //     }),
// //     prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
// //     prisma.order.count(),
// //     prisma.product.findMany(),
// //     prisma.product.count(),
// //     prisma.product.aggregate({
// //       _sum: {
// //         price: true,
// //         stock: true,
// //       },
// //     }),
// //   ]);

// //   return (
// //     <div>
// //       <h1>Admin Dashboard KPI</h1>
// //       <p>User Count: {user_count}</p>
// //       <p>Order Count: {order_count}</p>
// //       <p>
// //         Total Sales Amount: $
// //         {Number(order_kpi._sum.totalAmount)
// //           ? Number(order_kpi._sum.totalAmount)
// //           : 0}
// //         {/* {order_kpi._sum.totalAmount ? order_kpi._sum.totalAmount : 0} */}
// //       </p>
// //       <p>Product Count: {product_count}</p>
// //       <p>
// //         Total Product Stock:{" "}
// //         {product_kpi._sum.stock ? product_kpi._sum.stock : 0}
// //       </p>
// //       <p>
// //         Total Product Value: $
// //         {Number(product_kpi._sum.price) ? Number(product_kpi._sum.price) : 0}
// //         {/* {product_kpi._sum.price ? product_kpi._sum.price : 0} */}
// //       </p>

// //       <div>
// //         <div className="p-2 m-1 border-b-4 text-pink-500 ">
// //           <h1>User</h1>
// //           {users?.map((user) => (
// //             <div key={user.id}>{user.username}</div>
// //           ))}
// //         </div>
// //         <div className="p-2 m-1 border-b-4 text-green-500 ">
// //           <h1>Product Lists</h1>
// //           {products?.map((product) => (
// //             <div key={product.id}>{product.name}</div>
// //           ))}
// //         </div>
// //         <div className="p-2 m-1 border-b-4  text-yellow-800">
// //           <p>OrderLists</p>
// //           {orders?.map((order) => (
// //             <div key={order.id}>{order.status}</div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default page;

// // // import prisma from "@/lib/prisma";

// // // // Use a separate function for data fetching for clarity and potential caching
// // // const getDashboardData = async () => {
// // //   // Fetch only the data required for the KPIs and recent lists
// // //   const [
// // //     user_count,
// // //     order_kpi,
// // //     recent_orders,
// // //     order_count,
// // //     product_count,
// // //     product_kpi,
// // //   ] = await Promise.all([
// // //     prisma.user.count(),

// // //     // Total Revenue
// // //     prisma.order.aggregate({
// // //       _sum: { totalAmount: true },
// // //     }),

// // //     // Recent Orders List (Used for a feed/list)
// // //     prisma.order.findMany({
// // //       orderBy: { createdAt: "desc" },
// // //       take: 5,
// // //       // Include user email/username for display
// // //       include: { user: { select: { username: true } } },
// // //     }),

// // //     // Total Order Count
// // //     prisma.order.count(),

// // //     // Total Product Count
// // //     prisma.product.count(),

// // //     // Total Stock and Value
// // //     prisma.product.aggregate({
// // //       _sum: { stock: true },
// // //       // _sum: { price: true, stock: true },
// // //     }),
// // //   ]);

// // //   return {
// // //     user_count,
// // //     order_kpi,
// // //     recent_orders,
// // //     order_count,
// // //     product_count,
// // //     product_kpi,
// // //   };
// // // };

// // // const Page = async () => {
// // //   // 1. Session Check (Assuming this is handled in dashboard/layout.tsx for all children)
// // //   // If you want to handle it here, uncomment and ensure verifySession handles roles/redirects.
// // //   /*
// // //   const session = await verifySession();
// // //   if (!session || session.role !== 'ADMIN') {
// // //     // Redirect or return an access denied message
// // //     return <h1>Access Denied</h1>;
// // //   }
// // //   */

// // //   // 2. Fetch Data
// // //   const data = await getDashboardData();
// // //   const {
// // //     user_count,
// // //     order_kpi,
// // //     recent_orders,
// // //     order_count,
// // //     product_count,
// // //     product_kpi,
// // //   } = data;

// // //   // 3. Helper function for safe Decimal to String conversion and formatting
// // //   const formatCurrency = (decimalValue: any) => {
// // //     // Checks if the value exists and converts it to a Number, handling Prisma's Decimal type
// // //     const amount = Number(decimalValue ?? 0);
// // //     return amount.toFixed(2);
// // //   };

// // //   return (
// // //     <div>
// // //       <h1>Admin Dashboard KPIs 📊</h1>

// // //       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
// // //         {/* KPI Card: User Count */}
// // //         <div className="p-4 border rounded shadow-md">
// // //           <p className="text-xl font-bold">{user_count}</p>
// // //           <p className="text-sm text-gray-500">Total Users</p>
// // //         </div>

// // //         {/* KPI Card: Order Count */}
// // //         <div className="p-4 border rounded shadow-md">
// // //           <p className="text-xl font-bold">{order_count}</p>
// // //           <p className="text-sm text-gray-500">Total Orders</p>
// // //         </div>

// // //         {/* KPI Card: Total Sales Amount */}
// // //         <div className="p-4 border rounded shadow-md">
// // //           <p className="text-xl font-bold">
// // //             ${formatCurrency(order_kpi._sum.totalAmount)}
// // //           </p>
// // //           <p className="text-sm text-gray-500">Total Revenue</p>
// // //         </div>

// // //         {/* KPI Card: Product Count */}
// // //         <div className="p-4 border rounded shadow-md">
// // //           <p className="text-xl font-bold">{product_count}</p>
// // //           <p className="text-sm text-gray-500">Total Products</p>
// // //         </div>

// // //         {/* KPI Card: Total Product Stock */}
// // //         <div className="p-4 border rounded shadow-md">
// // //           <p className="text-xl font-bold">{product_kpi._sum.stock ?? 0}</p>
// // //           <p className="text-sm text-gray-500">Total Stock Quantity</p>
// // //         </div>

// // //         {/* KPI Card: Total Product Value (Price * Stock is more accurate, but using price sum for simplicity here) */}
// // //         <div className="p-4 border rounded shadow-md">
// // //           <p className="text-xl font-bold">
// // //             ${formatCurrency(product_kpi._sum.price)}
// // //           </p>
// // //           <p className="text-sm text-gray-500">
// // //             Product Value (Sum of Base Prices)
// // //           </p>
// // //         </div>
// // //       </div>

// // //       <h2>Recent Orders 📦</h2>
// // //       <div className="p-4 border rounded">
// // //         {recent_orders.length > 0 ? (
// // //           <ul className="space-y-2">
// // //             {recent_orders.map((order) => (
// // //               <li
// // //                 key={order.id}
// // //                 className="p-2 border-b last:border-b-0 flex justify-between items-center"
// // //               >
// // //                 <span
// // //                   className={`font-medium ${
// // //                     order.status === "PENDING"
// // //                       ? "text-yellow-600"
// // //                       : "text-green-600"
// // //                   }`}
// // //                 >
// // //                   #{order.id.substring(0, 8)}... - {order.status}
// // //                 </span>
// // //                 <span>{order.user.username || "Guest"}</span>
// // //                 <span className="font-semibold">
// // //                   ${formatCurrency(order.totalAmount)}
// // //                 </span>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         ) : (
// // //           <p className="text-gray-500">No recent orders found.</p>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Page;
