"use client";

import { useActionState } from "react";
import { createShippingAddress } from "./action";

const AddressForm = () => {
  const [state, action, pending] = useActionState(createShippingAddress, null);

  return (
    <div>
      <form action={action}>
        <input
          type="text"
          name="username"
          className="p-2 m-1 text-sky-400"
          placeholder="username"
        />
        <input
          type="mail"
          name="email"
          className="p-2 m-1 text-sky-400"
          placeholder="mail"
        />
        <input
          type="text"
          name="firstName"
          className="p-2 m-1 text-sky-400"
          placeholder="firstname"
        />
        <input
          type="text"
          name="lastName"
          className="p-2 m-1 text-sky-400"
          placeholder="last name"
        />
        <input
          type="tel"
          name="phoneNumber"
          className="p-2 m-1 text-sky-400"
          placeholder="phone"
        />
        <input
          type="date"
          name="birthDate"
          className="p-2 m-1 text-sky-400"
          placeholder="birthDate"
        />
        <input
          type="text"
          name="bio"
          className="p-2 m-1 text-sky-400"
          placeholder="bio"
        />

        <button type="submit" disabled={pending}>
          {pending ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
