// app/checkout/page.tsx (example page component; adjust to your app)
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
// import CheckoutForm from "@/components/CheckoutForm"; // Adjust path
import { initiateCheckout } from "@/app/actions/checkout"; // Adjust path
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Assume shipping form here; for demo, hardcode or use a form
  useEffect(() => {
    // Simulate submitting shipping form
    const formData = new FormData();
    formData.append("street", "123 Example St");
    formData.append("city", "Example City");
    formData.append("state", "EX");
    formData.append("postalCode", "12345");
    formData.append("country", "US");

    initiateCheckout(null, formData).then((result) => {
      console.log(result, "result", result.clientSecret);
      if (result.success) {
        setClientSecret(result.clientSecret!);
      } else {
        setError(result.message!);
      }
    });
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!clientSecret) return <div>Loading...</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
// import prisma from "@/lib/prisma";
// import CheckoutForm from "./CheckoutForm";

// const CheckoutPage = async () => {
//   // const cart = await prisma.cart.findFirst({
//   //   where: {
//   //     items: true,
//   //   },
//   // });

//   const cart = await prisma.cartItem.findMany();

//   if (!cart) {
//     return (
//       <div>
//         <h1>There is no cart!.</h1>
//       </div>
//     );
//   }
//   return (
//     <div>
//       <h1>CheckoutPage</h1>
//       <div className="text-sky-400">
//         {cart.map((c) => (
//           <div key={c.id}>
//             <p>CartId - {c.cartId}</p>
//             <p>Quantity - {c.quantity}</p>
//             <p>ProductId - {c.productId}</p>
//           </div>
//         ))}
//       </div>
//       <CheckoutForm />
//     </div>
//   );
// };

// export default CheckoutPage;
