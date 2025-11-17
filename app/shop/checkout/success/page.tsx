import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold text-green-600">
        ✅ Payment Successful!
      </h1>
      <p>Thank you for testing Stripe Checkout.</p>
      <Link href="/products" className="p-2 m-1 underline underline-offset-2 ">
        Continue Shopping
      </Link>
    </div>
  );
}
