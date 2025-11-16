"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createNewProduct } from "./action";

const CreateNewPorduct = () => {
  const [state, action, pending] = useActionState(createNewProduct, {
    success: false,
    messag: "",
    error: undefined,
  });

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
    }
  });

  return (
    <div>
      <form action={action}>
        <input
          type="text"
          name="name"
          className="p-2 m-1 border-b-2"
          defaultValue="this is name"
        />
        <input
          type="text"
          name="description"
          className="p-2 m-1 border-b-2"
          defaultValue="this is descriptions"
        />
        <input
          type="number"
          name="price"
          className="p-2 m-1 border-b-2"
          defaultValue={24}
        />
        <input
          type="number"
          name="stock"
          className="p-2 m-1 border-b-2"
          defaultValue={100}
        />
        <button disabled={pending} className="p-2 m-1 border-b-2">
          Add{" "}
        </button>
      </form>
    </div>
  );
};

export default CreateNewPorduct;
