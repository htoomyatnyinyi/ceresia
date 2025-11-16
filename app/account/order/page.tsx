import prisma from "@/lib/prisma";

const OrderPage = async () => {
  const userId = "clxi8v09c000008l414y5e36k";

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
  });

  console.log(orders, "orders");

  return (
    <div>
      <h1>OrderPage</h1>

      {orders?.map((order) => (
        <div key={order.id}>
          <p>{order?.status}</p>
          <p>{Number(order?.totalAmount)}</p>
          {/* <p>{order?.shippingAddress?.city}</p>
          <p>{order?.shippingAddress?.state}</p> */}
          {order?.items.map((item) => (
            <div key={item.id}>
              {item.productName}
              {Number(item.price)}
              {item.quantity}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OrderPage;
