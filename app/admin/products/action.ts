// // Example: Server Action for deleting a product
// "use server";
// import { verifySession } from "@/lib/session";
// import prisma from "@/lib/prisma";

// export async function deleteProduct(productId: string) {
//   const session = await verifySession();

//   if (!session.success || session.role !== "ADMIN") {
//     // Assuming verifySession returns role
//     throw new Error("Unauthorized access");
//   }

//   await prisma.product.delete({
//     where: { id: productId },
//   });
//   // Optionally revalidate path here
// }
