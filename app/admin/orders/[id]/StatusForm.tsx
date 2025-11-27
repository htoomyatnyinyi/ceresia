"use client";

import { useActionState, useEffect } from "react";
// Assuming updateStatus is imported from a separate server action file
// import { updateStatus } from "./actions";
import { updateStatus } from "./action";
import { OrderStatus } from "@prisma/client"; // Use the enum type for better safety
import { toast } from "sonner";

// Define the shape of the result state from the server action
interface ActionState {
  success: boolean;
  message: string;
}

const StatusForm = ({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) => {
  // Use null as the initial state, or an object like { success: false, message: "" }
  const [state, action, pending] = useActionState<ActionState | null, FormData>(
    updateStatus,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.message(state.message);
    }
  });

  return (
    <div className="p-4 border rounded-lg shadow-sm  max-w-sm">
      <h3 className="text-lg font-semibold mb-3">Update Order Status</h3>

      {/* Display Feedback change to toast
      // {state && (
      //   <p
      //     className={`p-2 mb-3 rounded text-sm font-medium ${
      //       state.success
      //         ? "bg-green-100 text-green-700"
      //         : "bg-red-100 text-red-700"
      //     }`}
      //   >
      //     {state.message}
      //   </p>
      // )} */}

      <form action={action} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="status" className="mb-1 text-sm font-medium">
            Current Status: **{currentStatus}**
          </label>

          {/* 1. Correctly set the value of the hidden input */}
          <input type="hidden" name="orderId" value={orderId} />

          <select
            id="status"
            name="status"
            className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            // Set the default value to the current status for a better user experience
            defaultValue={currentStatus}
            disabled={pending}
          >
            <option value="">-- Select New Status --</option>
            <option value="PENDING">PENDING</option>
            {/* Note: 'REJECT' is not in your schema's OrderStatus enum, 
               I'll assume it should be CANCELLED or a new enum value if needed. 
               Using CANCELLED here based on your provided schema. */}
            <option value="CANCELLED">CANCELLED</option>
            <option value="PAID">PAID</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={pending}
          className={`w-full py-2 px-4 rounded-md font-semibold text-white transition duration-150 ${
            pending
              ? "bg-gray-400 cursor-not-allowed"
              : "dark:bg-white dark:text-black dark:hover:bg-slate-200 hover:bg-slate-900 bg-black text-white shadow-md"
          }`}
        >
          {pending ? "Updating..." : "Update Status"}
        </button>
      </form>
    </div>
  );
};

export default StatusForm;
// "use client";

// import { useActionState } from "react";
// import { updateStatus } from "./action";

// const StatusForm = ({ orderId }: { orderId: string }) => {
//   const [state, action, pending] = useActionState(updateStatus, null);

//   return (
//     <div>
//       <form action={action}>
//         <label>Please update status:</label>
//         <input type="hidden" name="orderId" />
//         <select id="color-select" name="status">
//           <option value="">-- Please select an option --</option>
//           <option value="PENDING">PENDING</option>
//           <option value="REJECT" selected>
//             REJECT
//           </option>
//           <option value="PAID">PAID</option>
//         </select>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default StatusForm;
