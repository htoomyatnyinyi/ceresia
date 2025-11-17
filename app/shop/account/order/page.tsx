import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

const OrderPage = async () => {
  const session = await verifySession();
  // const userId = "clxi8v09c000008l414y5e36k";
  // Check if user is authenticated
  // if (!session?.userId) {
  //   return {
  //     success: false,
  //     message: "User is not authenticated.",
  //   };
  // }

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: {
      items: true,
    },
  });

  // console.log(orders, "orders");

  return (
    <div>
      <h1>OrderPage</h1>

      {orders?.map((order) => (
        <div key={order.id} className="border p-2 m-1">
          <p>Order Status = {order?.status}</p>
          <p>Total Cost = {Number(order?.totalAmount)}</p>
          {/* <p>{order?.shippingAddress?.city}</p>
          <p>{order?.shippingAddress?.state}</p> */}
          {order?.items.map((item) => (
            <div key={item.id} className="p-2 m-1 border-b-2">
              <p>Name = {item.productName}</p>
              <p>Price = {Number(item.price)}</p>
              <p>Quantity = {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OrderPage;
