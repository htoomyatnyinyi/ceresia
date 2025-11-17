import { verifySession } from "@/lib/session";

import CreateNewPorduct from "./CreateNewPorduct";
import prisma from "@/lib/prisma";

const page = async () => {
  const session = await verifySession();
  if (!session) {
    return null;
  }

  const [users, products, orders] = await Promise.all([
    prisma.user.findMany(),
    prisma.product.findMany(),
    prisma.order.findMany(),
  ]);

  return (
    <div>
      <CreateNewPorduct />

      <div>
        <div className="p-2 m-1 border-b-4 text-pink-500 ">
          {users?.map((user) => (
            <div>{user.username}</div>
          ))}
        </div>
        <div className="p-2 m-1 border-b-4 text-green-500 ">
          {products?.map((product) => (
            <div>{product.name}</div>
          ))}
        </div>
        <div className="p-2 m-1 border-b-4  text-yellow-800">
          {orders?.map((order) => (
            <div>{order.status}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
