// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import Link from "next/link";

// const CartPage = async () => {
//   const session = await verifySession();

//   const cartItems = await prisma.cartItem.findMany({
//     where: { cart: { userId: session?.userId } }, // Hardcoded userId for demo
//     // where: { cart: { userId: "clxi8v09c000008l414y5e36k" } }, // Hardcoded userId for demo

//     include: {
//       product: true,
//     },
//   });
//   // console.log(cartItems, "cartItems");

//   const total = cartItems.reduce(
//     (sum, item) => sum + Number(item.product.price) * item.quantity,
//     0
//   );

//   return (
//     <div className="">
//       <h1 className="text-2xl font-bold mb-4"> Cart</h1>
//       <div className="space-y-3">
//         {cartItems.map((item) => (
//           <div key={item.id} className="flex justify-between">
//             <span>
//               {item.product.name} × {item.quantity}
//             </span>
//             <span>${Number(item.product.price) * item.quantity}</span>
//           </div>
//         ))}
//       </div>

//       <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
//         <span>Total</span>
//         <span>${total}</span>
//       </div>

//       {total ? (
//         <div>
//           <Link href="/checkout" className="underline p-2 m-1 text-sky-500 ">
//             Proceed To Checkout
//           </Link>
//         </div>
//       ) : (
//         <div>
//           <Link href="/products" className="underline p-2 m-1 text-sky-400">
//             Let's check products
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;
