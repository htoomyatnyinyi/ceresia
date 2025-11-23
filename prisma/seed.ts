// // prisma/seed.ts
// // NOTE: You will need 'ts-node' installed to run this script.

// import prisma from "@/lib/prisma";
// // Importing Decimal from the client runtime to correctly handle precise number types
// import { Decimal } from "@prisma/client/runtime/library";

// // The user ID hardcoded in your app/api/checkout/route.ts
// const MOCK_USER_ID = "clxi8v09c000008l414y5e36k";

// async function main() {
//   console.log("--- Start E-commerce Database Seeding ---");

//   // 1. Clean up existing data (good practice for a fresh start)
//   await prisma.orderItem.deleteMany();
//   await prisma.order.deleteMany();
//   await prisma.cartItem.deleteMany();
//   await prisma.cart.deleteMany();
//   await prisma.user.deleteMany();
//   await prisma.product.deleteMany();
//   console.log("Existing data cleaned.");

//   // 2. Create a User (compatible with the checkout route)
//   const user = await prisma.user.create({
//     data: {
//       id: MOCK_USER_ID,
//       email: "testuser@example.com",
//       name: "Test Customer",
//       password: "password",
//     },
//   });
//   console.log(`✅ Created user with ID: ${user.id}`);

//   // 3. Create Products
//   const product1 = await prisma.product.create({
//     data: {
//       name: "Next.js 16 Hoodie",
//       description: "The official comfy hoodie for the latest Next.js version.",
//       price: new Decimal(49.99),
//       stock: 15,
//       imageUrl: "https://placehold.co/400x400/000000/FFFFFF?text=NextJS+Hoodie",
//     },
//   });

//   const product2 = await prisma.product.create({
//     data: {
//       name: "Prisma Data Guide",
//       description:
//         "A comprehensive guide to modern database tooling with Prisma.",
//       price: new Decimal(24.5),
//       stock: 50,
//       imageUrl: "https://placehold.co/400x400/4096B0/FFFFFF?text=Prisma+Guide",
//     },
//   });

//   const product3 = await prisma.product.create({
//     data: {
//       name: "Stripe API Key Chain",
//       description: "A limited edition keychain shaped like a Stripe API key.",
//       price: new Decimal(12.0),
//       stock: 5,
//       imageUrl: "https://placehold.co/400x400/635BFF/FFFFFF?text=Stripe+Key",
//     },
//   });
//   console.log(`✅ Created 3 mock products.`);

//   // 4. Create a Cart for the user
//   const cart = await prisma.cart.create({
//     data: {
//       userId: user.id,
//     },
//   });
//   console.log(`✅ Created shopping cart with ID: ${cart.id}`);

//   // 5. Create Cart Items (for the mock user's current shopping cart)
//   await prisma.cartItem.createMany({
//     data: [
//       {
//         cartId: cart.id,
//         productId: product1.id,
//         quantity: 1, // 1 Hoodie
//         // price: 100,
//       },
//       {
//         cartId: cart.id,
//         productId: product2.id,
//         quantity: 2, // 2 Guides
//         // price: 120,
//       },
//     ],
//   });

//   // Total in cart: (1 * $49.99) + (2 * $24.50) = $49.99 + $49.00 = $98.99
//   console.log(`✅ Added products to the cart. Total value: $98.99.`);

//   console.log("--- Seeding finished successfully! ---");
// }

// // Execute the main function
// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// // // generator client {
// // //   provider = "prisma-client-js"
// // // }

// // // datasource db {
// // //   provider = "mysql"
// // //   url      = env("DATABASE_URL")
// // // }

// // // model User {
// // //   id        String   @id @default(uuid())
// // //   email     String   @unique
// // //   name      String?
// // //   password  String?  // Hashed
// // //   orders    Order[]
// // //   subscriptions Subscription[]
// // //   createdAt DateTime @default(now())
// // // }

// // // model Product {
// // //   id          String   @id @default(uuid())
// // //   name        String
// // //   description String
// // //   flavorNotes String?
// // //   origin      String?
// // //   process     String?
// // //   variants    Variant[]
// // //   category    Category @relation(fields: [categoryId], references: [id])
// // //   categoryId  String
// // //   createdAt   DateTime @default(now())
// // // }

// // // model Variant {
// // //   id        String   @id @default(uuid())
// // //   weight    Int      // e.g., 50, 100 (grams)
// // //   grind     String?  // e.g., "whole", "filter", "espresso"
// // //   price     Float
// // //   stock     Int
// // //   product   Product  @relation(fields: [productId], references: [id])
// // //   productId String
// // //   orderItem OrderItem[]
// // // }

// // // model Category {
// // //   id       String    @id @default(uuid())
// // //   name     String    // e.g., "Coffee", "Merchandise"
// // //   products Product[]
// // // }

// // // model Order {
// // //   id         String   @id @default(uuid())
// // //   userId     String
// // //   user       User     @relation(fields: [userId], references: [id])
// // //   items      OrderItem[]
// // //   total      Float
// // //   status     String   // e.g., "pending", "paid"
// // //   createdAt  DateTime @default(now())
// // // }

// // // model OrderItem {
// // //   id        String @id @default(uuid())
// // //   orderId   String
// // //   order     Order  @relation(fields: [orderId], references: [id])
// // //   variantId String
// // //   variant   Variant @relation(fields: [variantId], references: [id])
// // //   quantity  Int
// // // }

// // // model Subscription {
// // //   id         String   @id @default(uuid())
// // //   userId     String
// // //   user       User     @relation(fields: [userId], references: [id])
// // //   duration   Int      // e.g., 3 or 12 months
// // //   frequency  String   // e.g., "bi-weekly"
// // //   quantity   Int?     // Bags per delivery
// // //   grind      String?
// // //   status     String   // "active", "paused"
// // //   nextDelivery DateTime?
// // //   createdAt  DateTime @default(now())
// // // }
// // /*
// // import { PrismaClient } from "@prisma/client";
// // import bcrypt from "bcrypt";

// // const prisma = new PrismaClient();

// // async function main() {
// //   console.log("Seeding database...");

// //   // === 1. Clear existing data (optional, for fresh seed) ===
// //   await prisma.orderItem.deleteMany();
// //   await prisma.order.deleteMany();
// //   await prisma.subscription.deleteMany();
// //   await prisma.variant.deleteMany();
// //   await prisma.product.deleteMany();
// //   await prisma.category.deleteMany();
// //   await prisma.user.deleteMany();

// //   // === 2. Categories ===
// //   const coffeeCategory = await prisma.category.create({
// //     data: { name: "Coffee" },
// //   });

// //   const merchCategory = await prisma.category.create({
// //     data: { name: "Merchandise" },
// //   });

// //   // === 3. Products & Variants ===
// //   const products = [
// //     // Coffee 1: Mae Toey
// //     {
// //       name: "Mae Toey",
// //       description: "A bright and floral single-origin from Northern Thailand.",
// //       flavorNotes: "Lemon, Honey, Jasmine Tea",
// //       origin: "Chiang Mai, Thailand",
// //       process: "Washed, Anaerobic Fermentation",
// //       categoryId: coffeeCategory.id,
// //       variants: {
// //         create: [
// //           { weight: 50, grind: "whole", price: 432, stock: 50 },
// //           { weight: 100, grind: "whole", price: 780, stock: 100 },
// //           { weight: 250, grind: "whole", price: 1800, stock: 30 },
// //           { weight: 1000, grind: "whole", price: 6800, stock: 10 },
// //           { weight: 100, grind: "filter", price: 780, stock: 80 },
// //           { weight: 100, grind: "espresso", price: 780, stock: 70 },
// //         ],
// //       },
// //     },
// //     // Coffee 2: Yirgacheffe
// //     {
// //       name: "Yirgacheffe",
// //       description: "Ethiopian heirloom with vibrant fruit and tea-like body.",
// //       flavorNotes: "Bergamot, Peach, Black Tea",
// //       origin: "Guji Zone, Ethiopia",
// //       process: "Natural",
// //       categoryId: coffeeCategory.id,
// //       variants: {
// //         create: [
// //           { weight: 50, grind: "whole", price: 480, stock: 40 },
// //           { weight: 100, grind: "whole", price: 880, stock: 90 },
// //           { weight: 250, grind: "whole", price: 2050, stock: 25 },
// //           { weight: 100, grind: "filter", price: 880, stock: 60 },
// //         ],
// //       },
// //     },
// //     // Blend
// //     {
// //       name: "House Blend",
// //       description: "Balanced and versatile for daily brewing.",
// //       flavorNotes: "Chocolate, Caramel, Nutty",
// //       origin: "Blend of Brazil & Colombia",
// //       process: "Washed",
// //       categoryId: coffeeCategory.id,
// //       variants: {
// //         create: [
// //           { weight: 250, grind: "whole", price: 950, stock: 200 },
// //           { weight: 250, grind: "espresso", price: 950, stock: 180 },
// //         ],
// //       },
// //     },
// //     // Merchandise
// //     {
// //       name: "Ceresia Logo T-Shirt",
// //       description: "100% cotton, unisex fit. Perfect for coffee lovers.",
// //       flavorNotes: null,
// //       origin: null,
// //       process: null,
// //       categoryId: merchCategory.id,
// //       variants: {
// //         create: [
// //           { weight: 0, grind: null, price: 650, stock: 50 }, // Size M
// //           { weight: 0, grind: null, price: 650, stock: 30 }, // Size L
// //         ],
// //       },
// //     },
// //   ];

// //   for (const product of products) {
// //     await prisma.product.create({
// //       data: {
// //         ...product,
// //         variants: product.variants,
// //       },
// //     });
// //   }

// //   // === 4. Users (with Stripe Customer IDs) ===
// //   const hashedPassword = await bcrypt.hash("password123", 10);

// //   const user1 = await prisma.user.create({
// //     data: {
// //       email: "customer@ceresiacoffee.com",
// //       name: "Somchai Coffee",
// //       password: hashedPassword,
// //       stripeCustomerId: "cus_Nov2025_Somchai001", // Test Stripe Customer ID
// //     },
// //   });

// //   const user2 = await prisma.user.create({
// //     data: {
// //       email: "nida@bangkok.com",
// //       name: "Nida S.",
// //       password: hashedPassword,
// //       stripeCustomerId: "cus_Nov2025_Nida002", // Test Stripe Customer ID
// //     },
// //   });

// //   // === 5. Orders ===
// //   const maeToey = await prisma.product.findFirst({
// //     where: { name: "Mae Toey" },
// //   });
// //   const yirgacheffe = await prisma.product.findFirst({
// //     where: { name: "Yirgacheffe" },
// //   });
// //   const tshirt = await prisma.product.findFirst({
// //     where: { name: "Ceresia Logo T-Shirt" },
// //   });

// //   const variantMae100Whole = await prisma.variant.findFirst({
// //     where: { productId: maeToey?.id, weight: 100, grind: "whole" },
// //   });
// //   const variantYirga50 = await prisma.variant.findFirst({
// //     where: { productId: yirgacheffe?.id, weight: 50 },
// //   });
// //   const variantTshirt = await prisma.variant.findFirst({
// //     where: { productId: tshirt?.id, weight: 0 },
// //   });

// //   // Order 1: Paid (with Stripe Session ID for completeness)
// //   const order1 = await prisma.order.create({
// //     data: {
// //       userId: user1.id,
// //       total: 780 + 650,
// //       status: "paid",
// //       stripeSessionId: "cs_test_Nov2025_Order001", // Test Stripe Checkout Session ID
// //       items: {
// //         create: [
// //           { variantId: variantMae100Whole!.id, quantity: 1 },
// //           { variantId: variantTshirt!.id, quantity: 1 },
// //         ],
// //       },
// //     },
// //   });

// //   // Order 2: Pending
// //   await prisma.order.create({
// //     data: {
// //       userId: user2.id,
// //       total: 480,
// //       status: "pending",
// //       stripeSessionId: "cs_test_Nov2025_Order002", // Test Stripe Checkout Session ID
// //       items: {
// //         create: [{ variantId: variantYirga50!.id, quantity: 1 }],
// //       },
// //     },
// //   });

// //   // === 6. Subscriptions (with Stripe Subscription IDs for completeness) ===
// //   const sub1 = await prisma.subscription.create({
// //     data: {
// //       userId: user1.id,
// //       duration: 3,
// //       frequency: "bi-weekly",
// //       quantity: 2,
// //       grind: "filter",
// //       status: "active",
// //       stripeSubscriptionId: "sub_Nov2025_Sub001", // Test Stripe Subscription ID
// //       nextDelivery: new Date("2025-11-20"),
// //     },
// //   });

// //   const sub2 = await prisma.subscription.create({
// //     data: {
// //       userId: user2.id,
// //       duration: 12,
// //       frequency: "bi-weekly",
// //       quantity: 1,
// //       grind: "whole",
// //       status: "paused",
// //       stripeSubscriptionId: "sub_Nov2025_Sub002", // Test Stripe Subscription ID
// //       nextDelivery: new Date("2025-12-01"),
// //     },
// //   });

// //   console.log("Database seeded successfully!");
// //   console.log(
// //     `Seeded Users: ${user1.email} (ID: ${user1.stripeCustomerId}), ${user2.email} (ID: ${user2.stripeCustomerId})`
// //   );
// //   console.log(
// //     `Seeded Orders: ${order1.id} (Session: ${order1.stripeSessionId})`
// //   );
// //   console.log(
// //     `Seeded Subscriptions: ${sub1.id} (Sub ID: ${sub1.stripeSubscriptionId}), ${sub2.id} (Sub ID: ${sub2.stripeSubscriptionId})`
// //   );
// // }

// // main()
// //   .catch((e) => {
// //     console.error("Seeding failed:", e);
// //     process.exit(1);
// //   })
// //   .finally(async () => {
// //     await prisma.$disconnect();
// //   });

// // // // prisma/seed.ts
// // // import { PrismaClient } from "@prisma/client";
// // // import bcrypt from "bcrypt";

// // // const prisma = new PrismaClient();

// // // async function main() {
// // //   console.log("Seeding database...");

// // //   // === 1. Clear existing data (optional, for fresh seed) ===
// // //   await prisma.orderItem.deleteMany();
// // //   await prisma.order.deleteMany();
// // //   await prisma.subscription.deleteMany();
// // //   await prisma.variant.deleteMany();
// // //   await prisma.product.deleteMany();
// // //   await prisma.category.deleteMany();
// // //   await prisma.user.deleteMany();

// // //   // === 2. Categories ===
// // //   const coffeeCategory = await prisma.category.create({
// // //     data: { name: "Coffee" },
// // //   });

// // //   const merchCategory = await prisma.category.create({
// // //     data: { name: "Merchandise" },
// // //   });

// // //   // === 3. Products & Variants ===
// // //   const products = [
// // //     // Coffee 1: Mae Toey
// // //     {
// // //       name: "Mae Toey",
// // //       description: "A bright and floral single-origin from Northern Thailand.",
// // //       flavorNotes: "Lemon, Honey, Jasmine Tea",
// // //       origin: "Chiang Mai, Thailand",
// // //       process: "Washed, Anaerobic Fermentation",
// // //       categoryId: coffeeCategory.id,
// // //       variants: {
// // //         create: [
// // //           { weight: 50, grind: "whole", price: 432, stock: 50 },
// // //           { weight: 100, grind: "whole", price: 780, stock: 100 },
// // //           { weight: 250, grind: "whole", price: 1800, stock: 30 },
// // //           { weight: 1000, grind: "whole", price: 6800, stock: 10 },
// // //           { weight: 100, grind: "filter", price: 780, stock: 80 },
// // //           { weight: 100, grind: "espresso", price: 780, stock: 70 },
// // //         ],
// // //       },
// // //     },
// // //     // Coffee 2: Yirgacheffe
// // //     {
// // //       name: "Yirgacheffe",
// // //       description: "Ethiopian heirloom with vibrant fruit and tea-like body.",
// // //       flavorNotes: "Bergamot, Peach, Black Tea",
// // //       origin: "Guji Zone, Ethiopia",
// // //       process: "Natural",
// // //       categoryId: coffeeCategory.id,
// // //       variants: {
// // //         create: [
// // //           { weight: 50, grind: "whole", price: 480, stock: 40 },
// // //           { weight: 100, grind: "whole", price: 880, stock: 90 },
// // //           { weight: 250, grind: "whole", price: 2050, stock: 25 },
// // //           { weight: 100, grind: "filter", price: 880, stock: 60 },
// // //         ],
// // //       },
// // //     },
// // //     // Blend
// // //     {
// // //       name: "House Blend",
// // //       description: "Balanced and versatile for daily brewing.",
// // //       flavorNotes: "Chocolate, Caramel, Nutty",
// // //       origin: "Blend of Brazil & Colombia",
// // //       process: "Washed",
// // //       categoryId: coffeeCategory.id,
// // //       variants: {
// // //         create: [
// // //           { weight: 250, grind: "whole", price: 950, stock: 200 },
// // //           { weight: 250, grind: "espresso", price: 950, stock: 180 },
// // //         ],
// // //       },
// // //     },
// // //     // Merchandise
// // //     {
// // //       name: "Ceresia Logo T-Shirt",
// // //       description: "100% cotton, unisex fit. Perfect for coffee lovers.",
// // //       flavorNotes: null,
// // //       origin: null,
// // //       process: null,
// // //       categoryId: merchCategory.id,
// // //       variants: {
// // //         create: [
// // //           { weight: 0, grind: null, price: 650, stock: 50 }, // Size M
// // //           { weight: 0, grind: null, price: 650, stock: 30 }, // Size L
// // //         ],
// // //       },
// // //     },
// // //   ];

// // //   for (const product of products) {
// // //     await prisma.product.create({
// // //       data: {
// // //         ...product,
// // //         variants: product.variants,
// // //       },
// // //     });
// // //   }

// // //   // === 4. Users ===
// // //   const hashedPassword = await bcrypt.hash("password123", 10);

// // //   const user1 = await prisma.user.create({
// // //     data: {
// // //       email: "customer@ceresiacoffee.com",
// // //       name: "Somchai Coffee",
// // //       password: hashedPassword,
// // //     },
// // //   });

// // //   const user2 = await prisma.user.create({
// // //     data: {
// // //       email: "nida@bangkok.com",
// // //       name: "Nida S.",
// // //       password: hashedPassword,
// // //     },
// // //   });

// // //   // === 5. Orders ===
// // //   const maeToey = await prisma.product.findFirst({
// // //     where: { name: "Mae Toey" },
// // //   });
// // //   const yirgacheffe = await prisma.product.findFirst({
// // //     where: { name: "Yirgacheffe" },
// // //   });
// // //   const tshirt = await prisma.product.findFirst({
// // //     where: { name: "Ceresia Logo T-Shirt" },
// // //   });

// // //   const variantMae100Whole = await prisma.variant.findFirst({
// // //     where: { productId: maeToey?.id, weight: 100, grind: "whole" },
// // //   });
// // //   const variantYirga50 = await prisma.variant.findFirst({
// // //     where: { productId: yirgacheffe?.id, weight: 50 },
// // //   });
// // //   const variantTshirt = await prisma.variant.findFirst({
// // //     where: { productId: tshirt?.id, weight: 0 },
// // //   });

// // //   // Order 1: Paid
// // //   const order1 = await prisma.order.create({
// // //     data: {
// // //       userId: user1.id,
// // //       total: 780 + 650,
// // //       status: "paid",
// // //       items: {
// // //         create: [
// // //           { variantId: variantMae100Whole!.id, quantity: 1 },
// // //           { variantId: variantTshirt!.id, quantity: 1 },
// // //         ],
// // //       },
// // //     },
// // //   });

// // //   // Order 2: Pending
// // //   await prisma.order.create({
// // //     data: {
// // //       userId: user2.id,
// // //       total: 480,
// // //       status: "pending",
// // //       items: {
// // //         create: [{ variantId: variantYirga50!.id, quantity: 1 }],
// // //       },
// // //     },
// // //   });

// // //   // === 6. Subscriptions ===
// // //   await prisma.subscription.create({
// // //     data: {
// // //       userId: user1.id,
// // //       duration: 3,
// // //       frequency: "bi-weekly",
// // //       quantity: 2,
// // //       grind: "filter",
// // //       status: "active",
// // //       nextDelivery: new Date("2025-11-20"),
// // //     },
// // //   });

// // //   await prisma.subscription.create({
// // //     data: {
// // //       userId: user2.id,
// // //       duration: 12,
// // //       frequency: "bi-weekly",
// // //       quantity: 1,
// // //       grind: "whole",
// // //       status: "paused",
// // //       nextDelivery: new Date("2025-12-01"),
// // //     },
// // //   });

// // //   console.log("Database seeded successfully!");
// // // }

// // // main()
// // //   .catch((e) => {
// // //     console.error("Seeding failed:", e);
// // //     process.exit(1);
// // //   })
// // //   .finally(async () => {
// // //     await prisma.$disconnect();
// // //   });
