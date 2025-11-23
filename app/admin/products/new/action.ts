"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

interface ActionState {
  success: boolean;
  message: string;
}

// // --- Placeholder for File Upload (REPLACE ME) ---
// /**
//  * WARNING: This is a mock function.
//  * For a real application, you must replace this with a function
//  * that uploads the file stream to a cloud service (e.g., AWS S3, Cloudinary).
//  */
// async function uploadImageAndGetUrl(file: File | null): Promise<string | null> {
//   if (!file || file.size === 0) return null;

//   console.log(
//     `[MOCK UPLOAD] Processing file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`
//   );

//   // !!! Implement real cloud storage logic here !!!
//   // The implementation would typically involve:
//   // 1. Reading the file stream: const buffer = await file.arrayBuffer();
//   // 2. Sending the buffer/stream to your storage provider (e.g., S3 PutObjectCommand).
//   // 3. Returning the final public URL.

//   // Mock URL for demonstration:
//   const mockPublicUrl = `/uploads/${file.name.replace(
//     /[^a-z0-9.]/gi,
//     "_"
//   )}-${Date.now()}`;
//   return mockPublicUrl;
// }

// --- Cloudinary Setup ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- REAL Cloudinary Upload ---
async function uploadImageAndGetUrl(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result?.secure_url || null);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

// --- Form Data Validation and Extraction ---
function validateAndExtractData(formData: FormData):
  | {
      success: true;
      data: {
        name: string;
        description: string;
        price: number;
        stock: number;
        imageFile: File | null;
      };
    }
  | { success: false; message: string } {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const priceString = formData.get("price") as string;
  const stockString = formData.get("stock") as string;
  const imageFile = formData.get("image") as File | null;

  if (!name || !priceString || !stockString) {
    return {
      success: false,
      message: "Name, Price, and Stock are required fields.",
    };
  }

  const price = parseFloat(priceString);
  const stock = parseInt(stockString, 10);

  if (isNaN(price) || price <= 0) {
    return { success: false, message: "Price must be a positive number." };
  }
  if (isNaN(stock) || stock < 0) {
    return { success: false, message: "Stock must be a non-negative integer." };
  }

  return {
    success: true,
    data: { name, description, price, stock, imageFile },
  };
}

// --- Server Action for Product Creation ---
export async function createProduct(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const validation = validateAndExtractData(formData);
  if (!validation.success) {
    return { success: false, message: validation.message };
  }

  const { name, description, price, stock, imageFile } = validation.data;

  // 1. Upload Image (or get the mock URL)
  let imageUrl: string | null = null;
  try {
    imageUrl = await uploadImageAndGetUrl(imageFile);
  } catch (uploadError) {
    console.error("IMAGE UPLOAD FAILED:", uploadError);
    return { success: false, message: "Failed to upload product image." };
  }

  // 2. Save Data to Prisma
  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price: price,
        stock,
        imageUrl, // Save the returned URL
      },
    });

    // Revalidate the main products list page
    revalidatePath("/admin/products");

    return {
      success: true,
      message: `Product "${name}" created successfully!`,
    };
  } catch (error) {
    console.error("CREATE PRODUCT DATABASE ERROR:", error);
    return {
      success: false,
      message: "Failed to create product due to a server error.",
    };
  }
}

// ####
// // Helper function to extract and validate form data
// function validateAndExtractData(formData: FormData):
//   | {
//       success: true;
//       data: { name: string; description: string; price: number; stock: number };
//     }
//   | { success: false; message: string } {
//   const name = formData.get("name") as string;
//   const description = (formData.get("description") as string) || "";
//   const priceString = formData.get("price") as string;
//   const stockString = formData.get("stock") as string;

//   if (!name || !priceString || !stockString) {
//     return {
//       success: false,
//       message: "Name, Price, and Stock are required fields.",
//     };
//   }

//   const price = parseFloat(priceString);
//   const stock = parseInt(stockString, 10);

//   if (isNaN(price) || price <= 0) {
//     return { success: false, message: "Price must be a positive number." };
//   }
//   if (isNaN(stock) || stock < 0) {
//     return { success: false, message: "Stock must be a non-negative integer." };
//   }

//   return {
//     success: true,
//     data: { name, description, price, stock },
//   };
// }

// // Server Action for creating a new product
// export async function createProduct(
//   prevState: ActionState | null,
//   formData: FormData
// ): Promise<ActionState> {
//   const validation = validateAndExtractData(formData);
//   if (!validation.success) {
//     return { success: false, message: validation.message };
//   }
//   const { name, description, price, stock } = validation.data;

//   try {
//     await prisma.product.create({
//       data: {
//         name,
//         description,
//         price: price, // Prisma converts Number to Decimal internally
//         stock,
//         // Assuming imageUrl is handled separately or is optional
//       },
//     });

//     // Revalidate the main products list page
//     revalidatePath("/admin/products");

//     return {
//       success: true,
//       message: `Product "${name}" created successfully!`,
//     };
//   } catch (error) {
//     console.error("CREATE PRODUCT ERROR:", error);
//     return {
//       success: false,
//       message: "Failed to create product due to a server error.",
//     };
//   }
// }

// Server Action for updating an existing product
export async function updateProduct(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const productId = formData.get("id") as string;
  if (!productId) {
    return {
      success: false,
      message: "Error: Product ID is missing for update.",
    };
  }

  const validation = validateAndExtractData(formData);
  if (!validation.success) {
    return { success: false, message: validation.message };
  }
  const { name, description, price, stock } = validation.data;

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: price,
        stock,
      },
    });

    // Revalidate both the product list and the specific product detail page
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);

    return {
      success: true,
      message: `Product "${name}" updated successfully!`,
    };
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return {
      success: false,
      message: "Failed to update product due to a server error.",
    };
  }
}

// // Placeholder function for actual image upload
// // In a real app, this would stream the file to S3, Cloudinary, etc.
// async function uploadImageAndGetUrl(file: File | null): Promise<string | null> {
//   if (!file) return null;

//   // 1. **IMPLEMENT STORAGE LOGIC HERE**
//   // Example: const s3Client = new S3Client(...);
//   // const uploadCommand = new PutObjectCommand(...);
//   // await s3Client.send(uploadCommand);

//   // For local development or temporary use, you might save it to the /public folder
//   // or return a mock URL.

//   // *** Placeholder: Replace with real storage service logic ***
//   const mockPublicUrl = `https://storage.example.com/${
//     file.name
//   }-${Date.now()}`;
//   console.log(`[MOCK UPLOAD] File processed, returning URL: ${mockPublicUrl}`);
//   return mockPublicUrl;
//   // ************************************************************
// }

// ##############
// // old action can be deleted
// "use server";

// import prisma from "@/lib/prisma";
// import z from "zod";

// const CreateNewProductSchema = z.object({
//   name: z.string().min(1),
//   description: z.string().min(1),
//   price: z.number().min(0),
//   stock: z.number().min(0),
// });

// export const createNewProduct = async (state: any, formData: FormData) => {
//   console.log(formData, "check");

//   const validatedData = CreateNewProductSchema.parse({
//     name: formData.get("name"),
//     description: formData.get("description"),
//     price: Number(formData.get("price")),
//     stock: Number(formData.get("stock")),
//   });

//   console.log(validatedData);
//   const { name, description, price, stock } = validatedData;

//   try {
//     const inserted = await prisma.product.create({
//       data: {
//         name,
//         description,
//         price,
//         stock,
//       },
//     });

//     console.log(inserted);

//     return { success: true, message: "New Product Successfully Inserted!!" };
//   } catch (error) {
//     return { success: false, messag: "fail to creaet new products", error };
//   }
// };
