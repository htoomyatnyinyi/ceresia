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
      <h1 className="text-3xl font-bold mb-6 ">Ceresia Dashboard</h1>

      {/* KPI Cards Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* KPI Card: Total Revenue */}
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(order_kpi._sum.totalAmount)}
            color=" text-green-600"
            icon=""
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
            icon=""
          />

          {/* KPI Card: Total Users */}
          <KpiCard
            title="Total Users"
            value={user_count.toLocaleString()}
            color=" text-pink-600"
            icon=""
          />

          {/* KPI Card: Total Products */}
          <KpiCard
            title="Total Products"
            value={product_count.toLocaleString()}
            color=" text-yellow-600"
            icon=""
          />

          {/* KPI Card: Total Stock */}
          <KpiCard
            title="Total Stock Qty"
            value={product_stock_kpi._sum.stock?.toLocaleString() ?? "0"}
            color="text-purple-600"
            icon=""
          />
        </div>
      </section>

      <hr className="my-8" />

      {/* Lists Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List (Focus item) */}
        <div className="lg:col-span-2  p-6 rounded-lg shadow-lg border ">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-blue-500 mr-2">🛒</span> Recent Orders (
            {recent_orders.length})
          </h2>
          <div className="space-y-3">
            {recent_orders.length > 0 ? (
              recent_orders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 border-b last:border-b-0 hover:border-slate-900 transition duration-150 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Order #{order.id.substring(0, 8)}...
                    </span>
                    <span className="font-semibold text-xl">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>User - {order.user?.username || "Guest"}</span>
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
            icon="X"
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
            icon="Y"
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
  <div className=" p-6 rounded-lg shadow-lg border border-l-4  ">
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
