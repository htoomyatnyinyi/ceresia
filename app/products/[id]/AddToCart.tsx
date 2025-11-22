"use client";

import { useActionState, useEffect, useState } from "react";
import { addtocart } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

  useEffect(() => {
    if (state?.success) {
      toast(state.message);
    }
  }, [state]);

  return (
    <div>
      <CounterForm />
      <br />
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
        {/* // replaced with toast */}
        {/* {state?.message && (
          <p className={state.success ? "text-green-600" : "text-red-600"}>
            {state.message}
          </p>
        )} */}
      </form>
    </div>
  );
};

export default AddToCart;

// ################
// This action handles both incrementing and decrementing
const updateCount = async (previousState: number, formData: FormData) => {
  // Read the value from the button named 'operation'
  const operation = formData.get("operation");

  if (operation === "increment") {
    return previousState + 1;
  } else if (operation === "decrement") {
    return previousState - 1;
  }

  // Fallback to previous state if no valid operation is found
  return previousState;
};

const CounterForm = () => {
  // We only call useActionState once, linking the state (count)
  // to the single action function (updateCount)
  const [count, formAction] = useActionState(updateCount, 0);

  return (
    // The action prop on the form is set to the single action function
    <form action={formAction}>
      <h3>Counter: {count}</h3>

      {/* Button 1: Signals 'decrement' to the action function */}
      <button
        name="operation"
        value="decrement"
        type="submit"
        className="p-2 m-1 border"
      >
        Decrement
      </button>

      {/* Button 2: Signals 'increment' to the action function */}
      <button
        name="operation"
        value="increment"
        type="submit"
        className="p-2 m-1 border"
      >
        Increment
      </button>
    </form>
  );
};

// #######################

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
