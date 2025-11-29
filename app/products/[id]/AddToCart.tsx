// Updated AddToCart component
"use client";

import { useActionState, useEffect, useState } from "react";
// import { addtocart, getCartItems } from "@/lib/actions";
import { getCartItems } from "@/server-actions/add-to-cart";
import { addtocart } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AddToCartProps = {
  productId: string;
  price: number;
};

type FormState = {
  message: string;
  success: boolean;
} | null;

// export default function AddToCart({ productData }: any) {
export default function AddToCart({ productId, price }: AddToCartProps) {
  // console.log(productId, price);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();

  // console.log(cartItems, "item");

  const [state, formAction, isPending] = useActionState(
    addtocart,
    null as FormState
  );

  useEffect(() => {
    if (state?.success) {
      toast(state.message);
      setOpen(true);
    }
  }, [state]);

  useEffect(() => {
    if (open) {
      // Use server action to get the latest cart data
      getCartItems()
        .then((data) => setCartItems(data || []))
        .catch((error) => {
          console.error("Failed to load cart:", error);
          toast("Failed to load cart information.");
        });
    }
  }, [open]);

  return (
    <div>
      <form action={formAction} className="flex flex-col space-y-4">
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="price" value={price} />
        {/* <input type="hidden" name="productId" value={productData.id} />
        <input type="hidden" name="price" value={productData.price} /> */}

        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={quantity}
            name="quantity"
            min={1}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20"
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </form>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          {/* <h2 className="text-lg font-semibold mb-4">Your Cart</h2> */}
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam
            excepturi a vel est officiis? Delectus molestiae natus, ut veritatis
            aperiam, nisi non doloremque odit sint libero maxime! Culpa, sit et.
          </SheetDescription>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <Image
                      src={item.product.imageUrl || "/coffee.png"}
                      alt="product_image"
                      width={40}
                      height={30}
                    />
                    <span>{item.product.name}</span>
                    <span>Qty: {item.quantity}</span>
                    {/* <span>Price: ${Number(item.product.price.toFixed(2))}</span> */}
                    <span>Price: ${item.product.price}</span>
                    <span>
                      {/* Subtotal: ${Number(item.product.price.toFixed(2))} */}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-bold">
                Total: $
                {cartItems
                  .reduce(
                    (acc, item) => acc + item.product.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
            </>
          )}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Continue Shopping
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                router.push("/cart");
              }}
            >
              View Cart Details
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// "use client";

// import { useActionState, useEffect, useState } from "react";
// import { addtocart } from "./action";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { Sheet, SheetContent } from "@/components/ui/sheet";

// type AddToCartProps = {
//   productId: string;
//   price: number;
// };

// type FormState = {
//   message: string;
//   success: boolean;
// } | null;

// export default function AddToCart({ productId, price }: AddToCartProps) {
//   const [quantity, setQuantity] = useState(1);
//   const [open, setOpen] = useState(false);

//   const [state, formAction, isPending] = useActionState(
//     addtocart,
//     null as FormState
//   );

//   useEffect(() => {
//     if (state?.success) {
//       toast(state.message);
//       setOpen(true); // open cart sheet
//     }
//   }, [state]);

//   return (
//     <div>
//       <Sheet open={open} onOpenChange={setOpen}>
//         <SheetContent side="right">
//           I want to display cart information here....
//         </SheetContent>

//         <form action={formAction} className="flex flex-col space-y-4">
//           <input type="hidden" name="productId" value={productId} />
//           <input type="hidden" name="price" value={price} />

//           <div className="flex items-center space-x-2">
//             <Input
//               type="number"
//               value={quantity}
//               name="quantity"
//               min={1}
//               onChange={(e) =>
//                 setQuantity(Math.max(1, parseInt(e.target.value) || 1))
//               }
//               className="w-20"
//             />

//             <Button type="submit" disabled={isPending}>
//               {isPending ? "Adding..." : "Add to Cart"}
//             </Button>
//           </div>
//         </form>
//       </Sheet>
//     </div>
//   );
// }
// // "use client";

// // import { useActionState, useEffect, useState } from "react";
// // import { addtocart } from "./action";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { toast } from "sonner";
// // import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
// // import prisma from "@/lib/prisma";

// // type FormState = {
// //   message: string;
// //   success: boolean;
// // } | null;

// // type AddToCartProps = {
// //   productId: string;
// //   price: number;
// // };

// // const AddToCart = async ({ productId, price }: AddToCartProps) => {
// //   const [quantity, setQuantity] = useState(1);
// //   const [open, setOpen] = useState(false);

// //   const [state, formAction, isPending] = useActionState(
// //     addtocart,
// //     null as FormState
// //   );

// //   useEffect(() => {
// //     if (state?.success) {
// //       toast(state.message);
// //       setOpen(true); // open cart sheet after success
// //     }
// //   }, [state]);

// //   const cartItems = await prisma.cartItem.findMany({
// //     where: { cart: { userId } },
// //     include: { product: true },
// //   });

// //   const total = cartItems.reduce(
// //     (sum, item) => sum + Number(item.product.price) * item.quantity,
// //     0
// //   );

// //   const removeFromCart = async (itemId: string) => {
// //     "use server";
// //     await prisma.cartItem.delete({
// //       where: { id: itemId },
// //     });
// //     revalidatePath("/cart");
// //   };

// //   return (
// //     <div>
// //       <Sheet open={open} onOpenChange={setOpen}>
// //         <SheetContent></SheetContent>

// //         <form action={formAction} className="flex flex-col space-y-4">
// //           <input type="hidden" name="productId" value={productId} />
// //           <input type="hidden" name="price" value={price} />

// //           <div className="flex items-center space-x-2">
// //             <Input
// //               type="number"
// //               name="quantity"
// //               value={quantity}
// //               onChange={(e) =>
// //                 setQuantity(Math.max(1, parseInt(e.target.value) || 1))
// //               }
// //               min={1}
// //               className="w-20"
// //             />

// //             <Button type="submit" disabled={isPending || quantity < 1}>
// //               {isPending ? "Adding..." : "Add to Cart"}
// //             </Button>
// //           </div>
// //         </form>
// //       </Sheet>
// //     </div>
// //   );
// // };

// // export default AddToCart;

// // // "use client";

// // // import { useActionState, useEffect, useState } from "react";
// // // import { addtocart } from "./action";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { toast } from "sonner";
// // // import SheetPage from "./SheetPage";
// // // import { Sheet, SheetTrigger } from "@/components/ui/sheet";

// // // type FormState = {
// // //   message: string;
// // //   success: boolean;
// // // } | null;

// // // type AddToCartProps = {
// // //   productId: string;
// // //   price: number;
// // // };

// // // const AddToCart = ({ productId, price }: AddToCartProps) => {
// // //   const [quantity, setQuantity] = useState(1);
// // //   const [state, formAction, isPending] = useActionState(
// // //     addtocart,
// // //     null as FormState
// // //   );

// // //   useEffect(() => {
// // //     if (state?.success) {
// // //       toast(state.message);
// // //     }
// // //   }, [state]);

// // //   return (
// // //     <div>
// // //       {/* <CounterForm /> */}
// // //       {/* <br /> */}
// // //       <form action={formAction} className="flex flex-col space-y-4">
// // //         <input type="hidden" name="productId" value={productId} />
// // //         <input type="hidden" name="price" value={price} />
// // //         <div className="flex items-center space-x-2">
// // //           <Input
// // //             type="number"
// // //             name="quantity"
// // //             value={quantity}
// // //             onChange={(e) =>
// // //               setQuantity(Math.max(1, parseInt(e.target.value) || 1))
// // //             }
// // //             min={1}
// // //             className="w-20"
// // //           />
// // //           {/* <Button type="submit" disabled={isPending || quantity < 1}>
// // //             {isPending ? "Adding..." : "Add to Cart"}
// // //           </Button> */}
// // //           <Sheet>
// // //             <SheetTrigger>
// // //               <Button type="submit" disabled={isPending || quantity < 1}>
// // //                 {isPending ? "Adding..." : "Add to Cart"}
// // //               </Button>
// // //             </SheetTrigger>
// // //           </Sheet>
// // //         </div>
// // //         {/* // replaced with toast */}
// // //         {/* {state?.message && (
// // //           <p className={state.success ? "text-green-600" : "text-red-600"}>
// // //             {state.message}
// // //           </p>
// // //         )} */}
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // export default AddToCart;

// // // // ################
// // // // This action handles both incrementing and decrementing
// // // const updateCount = async (previousState: number, formData: FormData) => {
// // //   // Read the value from the button named 'operation'
// // //   const operation = formData.get("operation");

// // //   if (operation === "increment") {
// // //     return previousState + 1;
// // //   } else if (operation === "decrement") {
// // //     return previousState - 1;
// // //   }

// // //   // Fallback to previous state if no valid operation is found
// // //   return previousState;
// // // };

// // // const CounterForm = () => {
// // //   // We only call useActionState once, linking the state (count)
// // //   // to the single action function (updateCount)
// // //   const [count, formAction] = useActionState(updateCount, 0);

// // //   return (
// // //     // The action prop on the form is set to the single action function
// // //     <form action={formAction}>
// // //       <h3>Counter: {count}</h3>

// // //       {/* Button 1: Signals 'decrement' to the action function */}
// // //       <button
// // //         name="operation"
// // //         value="decrement"
// // //         type="submit"
// // //         className="p-2 m-1 border"
// // //       >
// // //         Decrement
// // //       </button>

// // //       {/* Button 2: Signals 'increment' to the action function */}
// // //       <button
// // //         name="operation"
// // //         value="increment"
// // //         type="submit"
// // //         className="p-2 m-1 border"
// // //       >
// // //         Increment
// // //       </button>
// // //     </form>
// // //   );
// // // };
