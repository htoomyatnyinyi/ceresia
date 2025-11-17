// app/dashboard/products/page.tsx
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

// Function to fetch all products
async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export default async function ProductsPage() {
  // 🚨 Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    return <h1>Access Denied: Must be logged in as Admin.</h1>;
  }

  const products = await getProducts();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Product Catalog ({products.length})
      </h1>

      {/* Link to create new product (using a dummy ID for now, will link to a form) */}
      <a
        href="/admin/products/new"
        className="inline-block bg-blue-500  px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        + Add New Product
      </a>

      <div className="border rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y ">
          <thead className="">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">
                  {product.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`/admin/products/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
