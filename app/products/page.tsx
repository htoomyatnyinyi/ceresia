import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

const ProductsPage = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }, // Order by most recent; adjust as needed
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* <h1 className="text-3xl font-bold mb-6">Our Products</h1> */}
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No products available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="block rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
              >
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded">
                  <Image
                    src={product.imageUrl || "/coffee.png"} // Use product image or fallback
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {product.description}
                </p>
                <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
// import prisma from "@/lib/prisma";
// import Link from "next/link";

// const page = async () => {
//   const products = await prisma.product.findMany();
//   console.log(products);

//   return (
//     <div className="h-full">
//       <div className="container mx-auto">
//         <div className="grid grid-cols-2 xl:grid-cols-5  xl:pt-8 xl:pb-24">
//           {/* <div className="flex flex-col xl:flex-row  justify-between  xl:pt-8 xl:pb-24"> */}
//           {products.map((product) => (
//             <Link
//               href={`/products/${product.id}`}
//               key={product.id}
//               className="border p-2 m-1"
//             >
//               <p>{product.name}</p>
//               <p>{product.description}</p>
//               <p>{Number(product.price)}</p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default page;

// // import prisma from "@/lib/prisma";
// // import Link from "next/link";

// // const page = async () => {
// //   const products = await prisma.product.findMany();
// //   return (
// //     <div>
// //       {products.map((product) => (
// //         <div
// //           key={product.id}
// //           className="mx-auto border px-4 sm:px-6 lg:px-8 py-24 "
// //         >
// //           <Link href={`/products/${product.id}`}>
// //             <p>{product.name}</p>
// //             <p>{product.description}</p>
// //             <p>{Number(product.price)}</p>
// //             <p>{product.stock}</p>
// //             <p>{product.imageUrl}</p>
// //           </Link>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default page;
// // import prisma from "@/lib/prisma";

// // const page = async () => {
// //   const products = await prisma.product.findMany();
// //   console.log(products);
// //   return (
// //     <div className="h-full">
// //       <div className="container mx-auto bg-neutral-50/10">
// //         <div className="flex flex-col xl:flex-row  justify-between items-center xl:pt-8 xl:pb-24">
// //           <div className="text-center xl:text-left order-2 xl:order-0 ">
// //             <div className="  aspect-square border">
// //               Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum
// //               animi fugit facere labore aliquid repellendus nisi debitis
// //               laboriosam at non nesciunt, assumenda ad aliquam omnis modi illo
// //               possimus! At, nulla!
// //             </div>
// //             <div className="aspect-square border">
// //               Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum
// //               animi fugit facere labore aliquid repellendus nisi debitis
// //               laboriosam at non nesciunt, assumenda ad aliquam omnis modi illo
// //               possimus! At, nulla!
// //             </div>
// //           </div>
// //         </div>
// //         <div className="text-pink-300">
// //           Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit
// //           delectus sit earum molestiae magni aut recusandae atque, dolore
// //           laudantium quis! Praesentium maiores culpa dicta eum dolore minus
// //           labore fugit deserunt.
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default page;

// // // import prisma from "@/lib/prisma";
// // // import Link from "next/link";

// // // const page = async () => {
// // //   const products = await prisma.product.findMany();
// // //   return (
// // //     <div>
// // //       {products.map((product) => (
// // //         <div
// // //           key={product.id}
// // //           className="mx-auto border px-4 sm:px-6 lg:px-8 py-24 "
// // //         >
// // //           <Link href={`/products/${product.id}`}>
// // //             <p>{product.name}</p>
// // //             <p>{product.description}</p>
// // //             <p>{Number(product.price)}</p>
// // //             <p>{product.stock}</p>
// // //             <p>{product.imageUrl}</p>
// // //           </Link>
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // export default page;
