"use client";

export default function CheckoutButton({ cartItems }: { cartItems: any[] }) {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    });

    const { url } = await res.json();
    console.log(url, "at checkout button");
    window.location.href = url; // Redirect to Stripe Checkout
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-black text-white px-6 py-2 rounded-lg mt-6 w-full"
    >
      Proceed to Checkout
    </button>
  );
}

// "use client";

// import { loadStripe } from "@stripe/stripe-js";
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// export default function CheckoutButton({ cartItems }: { cartItems: any[] }) {
//   const handleCheckout = async () => {
//     const res = await fetch("/api/checkout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ items: cartItems }),
//     });
//     const data = await res.json();
//     const stripe = await stripePromise;
//     // stripe?.redirectToCheckout({ sessionId: data.id });
//   };

//   return (
//     <button
//       onClick={handleCheckout}
//       className="bg-black text-white px-6 py-2 rounded-lg"
//     >
//       Checkout
//     </button>
//   );
// }
