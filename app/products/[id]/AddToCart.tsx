"use client";

import { useActionState } from "react";
import { addtocart } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type FormState = {
  message: string;
  success: boolean;
} | null;

type AddToCartProps = {
  productId: string;
  price: number;
};

const AddToCart = ({ productId, price }: AddToCartProps) => {
  const [quantity, setQuantity] = useState(1);
  const [state, formAction, isPending] = useActionState(
    addtocart,
    null as FormState
  );

  return (
    <form action={formAction} className="flex flex-col space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="price" value={price} />

      <div className="flex items-center space-x-2">
        <Input
          type="number"
          name="quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
          min={1}
          className="w-20"
        />
        <Button type="submit" disabled={isPending || quantity < 1}>
          {isPending ? "Adding..." : "Add to Cart"}
        </Button>
      </div>

      {state?.message && (
        <p className={state.success ? "text-green-600" : "text-red-600"}>
          {state.message}
        </p>
      )}
    </form>
  );
};

export default AddToCart;
// "use client";

// import { useActionState } from "react";
// import { addtocart } from "./action";
// import { success } from "zod";

// interface Product {
//   id: string;
//   name: string;
//   description: string | null;
//   price: number;
//   stock: number;
//   imageUrl: string | null;
// }

// const AddToCart = (props: any) => {
//   //   const [state, action, pending] = useActionState(addtocart, {
//   //     message: "",
//   //     success: false,
//   //     productId: props.productId,
//   //     price: props.price,
//   //     // quantity: 1,
//   //   });

//   // Focus state ONLY on the action's result (message/status)
//   const [state, action, pending] = useActionState(addtocart, null);

//   return (
//     <div className="p-2 m-1 text-sky-400">
//       {/* // This is correct practice: */}
//       <form action={action}>
//         {/* Product ID and Price are carried as hidden form inputs */}
//         <input
//           type="text"
//           name="productId"
//           defaultValue={props.productId}
//           hidden
//         />
//         <input type="number" name="price" defaultValue={props.price} hidden />

//         {/* Quantity is an interactive input */}
//         <input
//           type="number"
//           name="quantity"
//           placeholder="quantity"
//           defaultValue={1}
//         />

//         <button type="submit" disabled={pending}>
//           {pending ? "Adding" : "AddToCart"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddToCart;
