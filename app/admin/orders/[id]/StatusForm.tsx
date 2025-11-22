"use client";
import { useActionState } from "react";
import { updateStatus } from "./action";

const StatusForm = ({ orderId }: { orderId: string }) => {
  const [state, action, pending] = useActionState(updateStatus, {
    success: false,
    message: "",
    errors: undefined,
    orderId,
  });

  return (
    <div>
      <form action={action}>
        <label>Please update status:</label>
        <select id="color-select" name="status">
          <option value="">-- Please select an option --</option>
          <option value="PENDING">PENDING</option>
          <option value="REJECT" selected>
            REJECT
          </option>
          <option value="PAID">PAID</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StatusForm;
