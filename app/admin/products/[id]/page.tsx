// app/dashboard/products/[id]/page.tsx
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import ProductForm from "@/components/form/ProductForm";
// import ProductForm from '@/components/forms/ProductForm'; // You would create this client component

// Fetch product data for editing (or null for new product)
async function getProduct(productId: string | "new") {
  if (productId === "new") {
    return null;
  }
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  return product;
}

export default async function ProductEditPage({
  params,
}: {
  params: { id: string };
}) {
  // 🚨 Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    return <h1>Access Denied: Must be logged in as Admin.</h1>;
  }
  const awaitProductId = await params;
  const productId = awaitProductId.id;

  const product = await getProduct(productId);
  const isNew = productId === "new";

  if (!isNew && !product) {
    return <h1>Product Not Found</h1>;
  }

  // Convert Decimal and Int types to string for form compatibility
  const initialData = product
    ? {
        ...product,
        price: Number(product.price).toFixed(2),
        stock: String(product.stock),
      }
    : undefined;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isNew ? "Create New Product" : `Edit Product: ${product?.name}`}
      </h1>

      {/* You will need a Client Component (ProductForm) to handle the actual form
            inputs and call the Server Actions (createProduct or updateProduct)
            */}
      <div className="border p-6 rounded shadow max-w-lg">
        <p>[Product Form Component Placeholder]</p>
        <ProductForm
          initialData={initialData}
          isNew={isNew}
          productId={productId}
        />
      </div>
    </div>
  );
}
