"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/session";

// Define a type for product form data
type ProductFormData = {
  name: string;
  description: string;
  price: string; // Price comes as string from form
  stock: string; // Stock comes as string from form
  imageUrl: string;
};

// =========================================================
// 1. CREATE Product
// =========================================================

export async function createProduct(data: ProductFormData) {
  // Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized access. Must be an ADMIN.",
    };
  }

  try {
    const priceValue = parseFloat(data.price);
    const stockValue = parseInt(data.stock);

    if (isNaN(priceValue) || isNaN(stockValue)) {
      return {
        success: false,
        message: "Invalid Price or Stock value provided.",
      };
    }

    await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: priceValue, // Convert string price to Decimal
        stock: stockValue, // Convert string stock to Int
        imageUrl: data.imageUrl || null,
      },
    });

    // Revalidate the product list page
    revalidatePath("/dashboard/products");
    return {
      success: true,
      message: `Product "${data.name}" created successfully.`,
    };
  } catch (error) {
    console.error("Create Product Error:", error);
    return {
      success: false,
      message: "Failed to create product due to a server error.",
    };
  }
}

// =========================================================
// 2. UPDATE Product
// =========================================================

export async function updateProduct(productId: string, data: ProductFormData) {
  // Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized access. Must be an ADMIN.",
    };
  }

  try {
    const priceValue = parseFloat(data.price);
    const stockValue = parseInt(data.stock);

    if (isNaN(priceValue) || isNaN(stockValue)) {
      return {
        success: false,
        message: "Invalid Price or Stock value provided.",
      };
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        price: priceValue,
        stock: stockValue,
      },
    });

    // Revalidate cache for the list and the detail view
    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${productId}`);

    return {
      success: true,
      message: `Product "${data.name}" updated successfully.`,
    };
  } catch (error) {
    console.error("Update Product Error:", error);
    return {
      success: false,
      message: "Failed to update product due to a server error.",
    };
  }
}

// =========================================================
// 3. DELETE Product
// =========================================================

export async function deleteProduct(productId: string) {
  // Authorization Check
  const session = await verifySession();
  if (!session.success || session.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized access. Must be an ADMIN.",
    };
  }

  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    // Revalidate the product list page
    revalidatePath("/dashboard/products");

    return { success: true, message: "Product deleted successfully." };
  } catch (error) {
    console.error("Delete Product Error:", error);
    // Note: If deleting fails due to related OrderItems or CartItems (which shouldn't happen
    // with your current schema but is possible), you might need CASCADE deletes or manual cleanup.
    return {
      success: false,
      message: "Failed to delete product. Check for related records.",
    };
  }
}

// // server-actions/product.ts
// "use server";

// import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { verifySession } from "@/lib/session";

// // Define a type for product form data (matches the data sent from the client form)
// type ProductFormData = {
//   name: string;
//   description: string;
//   price: string; // Price comes as string from form
//   stock: string; // Stock comes as string from form
//   imageUrl: string;
// };

// export async function updateProduct(productId: string, data: ProductFormData) {
//   // 1. Authorization Check (Crucial for Admin Dashboard)
//   const session = await verifySession();
//   if (!session.success || session.role !== "ADMIN") {
//     return {
//       success: false,
//       message: "Unauthorized access. Must be an ADMIN.",
//     };
//   }

//   try {
//     // Input validation and conversion
//     const priceValue = parseFloat(data.price);
//     const stockValue = parseInt(data.stock);

//     if (isNaN(priceValue) || isNaN(stockValue)) {
//       return {
//         success: false,
//         message: "Invalid Price or Stock value provided.",
//       };
//     }

//     // 2. Prisma Database Update
//     await prisma.product.update({
//       where: { id: productId },
//       data: {
//         name: data.name,
//         // Handle optional/nullable fields explicitly
//         description: data.description || null,
//         imageUrl: data.imageUrl || null,

//         // Convert JavaScript numbers back to Prisma's Decimal/Int types
//         price: priceValue,
//         stock: stockValue,
//       },
//     });

//     // 3. Cache Revalidation
//     revalidatePath("/dashboard/products"); // Revalidate the list view
//     revalidatePath(`/dashboard/products/${productId}`); // Revalidate the detail view

//     return {
//       success: true,
//       message: `Product "${data.name}" updated successfully.`,
//     };
//   } catch (error) {
//     console.error("Update Product Error:", error);
//     return {
//       success: false,
//       message: "Failed to update product due to a server error.",
//     };
//   }
// }
