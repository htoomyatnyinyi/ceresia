import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SheetCart() {
  const session = await verifySession();

  if (!session?.userId) {
    return <p className="p-4">Please login to view cart.</p>;
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { cart: { userId: session.userId } },
    include: { product: true },
  });

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  // SERVER ACTIONS
  const removeItem = async (itemId: string) => {
    "use server";
    await prisma.cartItem.delete({ where: { id: itemId } });
    revalidatePath("/");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Image
                  src={item.product.imageUrl || "/placeholder.png"}
                  width={50}
                  height={50}
                  alt={item.product.name}
                  className="rounded"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p>${Number(item.product.price)}</p>
                </div>
              </div>

              <form action={removeItem.bind(null, item.id)}>
                <Button variant="destructive" size="sm">
                  Remove
                </Button>
              </form>
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Button asChild className="w-full">
            <Link href="/checkout">Checkout</Link>
          </Button>
        </>
      )}
    </div>
  );
}

// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { revalidatePath } from "next/cache";

// export default async function SheetCart() {
//   const session = await verifySession();

//   if (!session?.userId) {
//     return (
//       <div className="p-4">
//         <p className="text-muted-foreground mb-4">Login to view your cart.</p>
//         <Button asChild>
//           <Link href="/login">Login</Link>
//         </Button>
//       </div>
//     );
//   }

//   const cartItems = await prisma.cartItem.findMany({
//     where: { cart: { userId: session.userId } },
//     include: { product: true },
//   });

//   const total = cartItems.reduce(
//     (sum, item) => sum + Number(item.product.price) * item.quantity,
//     0
//   );

//   // server actions
//   const removeFromCart = async (itemId: string) => {
//     "use server";
//     await prisma.cartItem.delete({ where: { id: itemId } });
//     revalidatePath("/"); // sheet refresh
//   };

//   const updateQuantity = async (itemId: string, delta: number) => {
//     "use server";
//     const item = await prisma.cartItem.findUnique({
//       where: { id: itemId },
//       include: { product: true },
//     });

//     if (!item) return;

//     let newQuantity = item.quantity + delta;

//     if (newQuantity < 1) {
//       await prisma.cartItem.delete({ where: { id: itemId } });
//     } else {
//       newQuantity = Math.min(newQuantity, item.product.stock);
//       await prisma.cartItem.update({
//         where: { id: itemId },
//         data: { quantity: newQuantity },
//       });
//     }

//     revalidatePath("/");
//   };

//   return (
//     <div className="p-5 space-y-5">
//       <h2 className="text-xl font-bold">Your Cart</h2>

//       {cartItems.length === 0 ? (
//         <p className="text-muted-foreground">Your cart is empty.</p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {cartItems.map((item) => (
//               <div key={item.id} className="flex justify-between items-start">
//                 <div className="flex gap-3 flex-1">
//                   <Image
//                     src={item.product.imageUrl || "/placeholder.png"}
//                     alt={item.product.name}
//                     width={60}
//                     height={60}
//                     className="rounded object-cover"
//                   />
//                   <div>
//                     <p className="font-medium">{item.product.name}</p>

//                     <div className="flex items-center gap-2 mt-2">
//                       <form action={updateQuantity.bind(null, item.id, -1)}>
//                         <Button variant="outline" size="sm">
//                           -
//                         </Button>
//                       </form>

//                       <span className="text-sm">{item.quantity}</span>

//                       <form action={updateQuantity.bind(null, item.id, 1)}>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           disabled={item.quantity >= item.product.stock}
//                         >
//                           +
//                         </Button>
//                       </form>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col items-end">
//                   <span className="font-semibold">
//                     ${(Number(item.product.price) * item.quantity).toFixed(2)}
//                   </span>

//                   <form action={removeFromCart.bind(null, item.id)}>
//                     <Button variant="destructive" size="sm" className="mt-2">
//                       Remove
//                     </Button>
//                   </form>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="border-t pt-4 flex justify-between font-bold">
//             <span>Total</span>
//             <span>${total.toFixed(2)}</span>
//           </div>

//           <Button asChild className="w-full mt-4">
//             <Link href="/checkout">Checkout</Link>
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }
