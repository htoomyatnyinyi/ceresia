"use client";

import { useActionState } from "react";
import { addtocart } from "./action";
import { success } from "zod";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
}

const AddToCart = (props: any) => {
  //   const [state, action, pending] = useActionState(addtocart, {
  //     message: "",
  //     success: false,
  //     productId: props.productId,
  //     price: props.price,
  //     // quantity: 1,
  //   });

  // Focus state ONLY on the action's result (message/status)
  const [state, action, pending] = useActionState(addtocart, null);

  return (
    <div className="p-2 m-1 text-sky-400">
      {/* // This is correct practice: */}
      <form action={action}>
        {/* Product ID and Price are carried as hidden form inputs */}
        <input
          type="text"
          name="productId"
          defaultValue={props.productId}
          hidden
        />
        <input type="number" name="price" defaultValue={props.price} hidden />

        {/* Quantity is an interactive input */}
        <input
          type="number"
          name="quantity"
          placeholder="quantity"
          defaultValue={1}
        />

        <button type="submit" disabled={pending}>
          {pending ? "Adding" : "AddToCart"}
        </button>
      </form>
    </div>
  );
};

export default AddToCart;
