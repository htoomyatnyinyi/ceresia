"use client";

import { useActionState } from "react";
import { createAddress } from "./action";

const AddressForm = () => {
  const [state, action, pending] = useActionState(createAddress, null);

  return (
    <div>
      <form action={action}>
        <input
          type="text"
          name="street"
          className="p-2 m-1 text-sky-400"
          placeholder="street"
        />
        <input
          type="text"
          name="city"
          className="p-2 m-1 text-sky-400"
          placeholder="city"
        />
        <input
          type="text"
          name="state"
          className="p-2 m-1 text-sky-400"
          placeholder="state"
        />
        <input
          type="text"
          name="country"
          className="p-2 m-1 text-sky-400"
          placeholder="country"
        />
        <input
          type="text"
          name="postalCode"
          className="p-2 m-1 text-sky-400"
          placeholder="postalCode"
        />
        <input type="checkbox" name="isDefault" value="true" /> Set as default
        {/* <select name="isDefault" className="p-2 m-1 text-sky-400">
          <option value="true">Set as default?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select> */}
        <button type="submit" disabled={pending}>
          {pending ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
