import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Image from "next/image";
import { revalidatePath } from "next/cache";

const CartPage = async () => {
  const session = await verifySession();
  console.log(session, "session at cart");

  if (!session.success) {
    // await deleteSession(); // not working need to import
    redirect("/signin"); // Redirect to login if not authenticated; adjust path as needed
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { cart: { userId: session.userId } },
    include: { product: true },
  });

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const removeFromCart = async (itemId: string) => {
    "use server";
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
    revalidatePath("/cart");
  };

  const updateQuantity = async (itemId: string, delta: number) => {
    "use server";
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!item) return;

    let newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      if (newQuantity > item.product.stock) {
        newQuantity = item.product.stock;
      }
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: newQuantity },
      });
    }
    revalidatePath("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative w-16 h-16 overflow-hidden rounded">
                      <Image
                        src={item.product.imageUrl || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-medium">{item.product.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <form action={updateQuantity.bind(null, item.id, -1)}>
                          <Button type="submit" variant="outline" size="sm">
                            -
                          </Button>
                        </form>
                        <span className="text-sm font-medium">
                          {item.quantity}
                        </span>
                        <form action={updateQuantity.bind(null, item.id, 1)}>
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-semibold">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                    <form action={removeFromCart.bind(null, item.id)}>
                      <Button type="submit" variant="destructive" size="sm">
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="mt-6 text-center">
              <Button asChild size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { redirect } from "next/navigation";
// import Image from "next/image";
// import { revalidatePath } from "next/cache";

// const CartPage = async () => {
//   const session = await verifySession();

//   if (!session?.userId) {
//     redirect("/login"); // Redirect to login if not authenticated; adjust path as needed
//   }

//   const cartItems = await prisma.cartItem.findMany({
//     where: { cart: { userId: session.userId } },
//     include: { product: true },
//   });

//   const total = cartItems.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );

//   const removeFromCart = async (itemId: string) => {
//     "use server";
//     await prisma.cartItem.delete({
//       where: { id: itemId },
//     });
//     revalidatePath("/cart");
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
//         {cartItems.length === 0 ? (
//           <div className="text-center">
//             <p className="text-muted-foreground mb-4">Your cart is empty.</p>
//             <Button asChild>
//               <Link href="/products">Browse Products</Link>
//             </Button>
//           </div>
//         ) : (
//           <>
//             <div className="space-y-4">
//               {cartItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex items-center justify-between border-b pb-4"
//                 >
//                   <div className="flex items-center space-x-4 flex-1">
//                     <div className="relative w-16 h-16 overflow-hidden rounded">
//                       <Image
//                         src={item.product.imageUrl || "/placeholder.png"}
//                         alt={item.product.name}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h2 className="font-medium">{item.product.name}</h2>
//                       <p className="text-sm text-muted-foreground">
//                         Quantity: {item.quantity}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <p className="font-semibold">
//                       ${(item.product.price * item.quantity).toFixed(2)}
//                     </p>
//                     <form action={removeFromCart.bind(null, item.id)}>
//                       <Button type="submit" variant="destructive" size="sm">
//                         Remove
//                       </Button>
//                     </form>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-6 border-t pt-4 flex justify-between font-bold text-lg">
//               <span>Total</span>
//               <span>${total.toFixed(2)}</span>
//             </div>
//             <div className="mt-6 text-center">
//               <Button asChild size="lg">
//                 <Link href="/checkout">Proceed to Checkout</Link>
//               </Button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;
// // import prisma from "@/lib/prisma";
// // import { verifySession } from "@/lib/session";
// // import Link from "next/link";

// // const CartPage = async () => {
// //   const session = await verifySession();

// //   const cartItems = await prisma.cartItem.findMany({
// //     where: { cart: { userId: session?.userId } }, // Hardcoded userId for demo
// //     // where: { cart: { userId: "clxi8v09c000008l414y5e36k" } }, // Hardcoded userId for demo

// //     include: {
// //       product: true,
// //     },
// //   });
// //   // console.log(cartItems, "cartItems");

// //   const total = cartItems.reduce(
// //     (sum, item) => sum + Number(item.product.price) * item.quantity,
// //     0
// //   );

// //   return (
// //     <div className="">
// //       <h1 className="text-2xl font-bold mb-4"> Cart</h1>
// //       <div className="space-y-3">
// //         {cartItems.map((item) => (
// //           <div key={item.id} className="flex justify-between">
// //             <span>
// //               {item.product.name} × {item.quantity}
// //             </span>
// //             <span>${Number(item.product.price) * item.quantity}</span>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
// //         <span>Total</span>
// //         <span>${total}</span>
// //       </div>

// //       {total ? (
// //         <div>
// //           <Link href="/checkout" className="underline p-2 m-1 text-sky-500 ">
// //             Proceed To Checkout
// //           </Link>
// //         </div>
// //       ) : (
// //         <div>
// //           <Link href="/products" className="underline p-2 m-1 text-sky-400">
// //             Let's check products
// //           </Link>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CartPage;
