import CheckoutButton from "./CheckoutButton";

export default function CartPage() {
  // 🧺 Hardcoded demo cart items
  const cartItems = [
    {
      id: "demo_1",
      name: "Sample T-Shirt",
      image: "https://via.placeholder.com/150",
      price: 40,
      quantity: 2,
    },
    {
      id: "demo_2",
      name: "Demo Sneakers",
      image: "https://via.placeholder.com/150",
      price: 60,
      quantity: 3,
    },
  ];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">🛒 Demo Cart</h1>
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
        <span>Total</span>
        <span>${total}</span>
      </div>

      <CheckoutButton cartItems={cartItems} />
    </div>
  );
}
