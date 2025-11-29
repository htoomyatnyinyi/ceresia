// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// import "dotenv/config";
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// // import { PrismaClient } from "@/prisma/generated/prisma/client";
// import { PrismaClient } from "@prisma/client";
// // const adapter = new PrismaMariaDb({
// //   host: process.env.DATABASE_HOST,
// //   user: process.env.DATABASE_USER,
// //   password: process.env.DATABASE_PASSWORD,
// //   database: process.env.DATABASE_NAME,
// //   connectionLimit: 10,
// // });
// const prisma = new PrismaClient();

// export default prisma;

// // // lib/prisma.ts

// // import { PrismaClient } from "@prisma/client";
// // // import { PrismaMariaDb } from "@prisma/adapter-mariadb"; // Assuming you are still using the adapter

// // // Use 'global' to store the PrismaClient instance in development
// // // This prevents multiple connections during hot reloading.
// // const globalForPrisma = global as unknown as {
// //   prisma: PrismaClient | undefined;
// // };

// // // const adapter = new PrismaMariaDb({
// // //   host: process.env.DATABASE_HOST,
// // //   user: process.env.DATABASE_USER,
// // //   password: process.env.DATABASE_PASSWORD,
// // //   database: process.env.DATABASE_NAME,
// // //   // Ensure connection limit is reasonable, e.g., 10-20
// // //   connectionLimit: 15,
// // // });

// // export const prisma =
// //   globalForPrisma.prisma ??
// //   new PrismaClient({
// //     // Add logging to see when queries are executed/closed
// //     log: ["query", "info", "warn", "error"],
// //   });

// // // Only set the global instance in development (not production)
// // if (process.env.NODE_ENV !== "production") {
// //   globalForPrisma.prisma = prisma;
// // }

// // export default prisma;
