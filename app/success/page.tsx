export default function SuccessPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold text-green-600">
        ✅ Payment Successful!
      </h1>
      <p>Thank you for testing Stripe Checkout.</p>
    </div>
  );
}

// // app/success/page.tsx
// export default function SuccessPage() {
//   return (
//     <div className="text-center py-20">
//       <h1 className="text-2xl font-bold">✅ Payment successful!</h1>
//       <p>Thank you for your purchase.</p>
//     </div>
//   );
// }
