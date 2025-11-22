// app/admin/products/new/page.tsx
import { verifySession } from "@/lib/session";
// import ProductForm from "../ProductForm";
import ProductForm from "./ProductForm";

export default async function NewProductPage() {
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    return <h1>Access Denied: Admin privileges required.</h1>;
  }

  // When creating, we pass no initialProduct data
  return (
    <div className="p-8">
      <ProductForm />
    </div>
  );
} //
