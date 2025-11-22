import prisma from "@/lib/prisma";
import AddToCart from "./AddToCart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { notFound } from "next/navigation";

const ProductPage = async ({ params }: { params: { id: string } }) => {
  // const id = params.id;
  const awaitId = await params;
  const id = awaitId.id;

  const [product, relatedProducts] = await Promise.all([
    prisma.product.findFirst({
      where: { id },
      // include: { variants: true }, // Uncomment if variants are needed
    }),
    prisma.product.findMany({
      where: { id: { not: id } }, // Exclude current product
      take: 4, // Limit to 4 related products for performance
      orderBy: { createdAt: "desc" }, // Order by most recent; adjust as needed (e.g., by popularity if available)
    }),
  ]);

  if (!product) {
    notFound(); // Use Next.js notFound() for 404 handling
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* <Link href="/products">
          <Button variant="outline" className="mb-6">
            Back to Products
          </Button>
        </Link> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
            {/* <Image
              src={product.imageUrl || "/coffee.png"} // Use product image or fallback
              alt={product.name}
              fill
              className="object-cover dark:invert"
              priority // For better LCP on product pages
            /> */}
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-xl text-muted-foreground">
              {product.description}
            </p>
            <p className="text-3xl font-semibold">
              ${product.price.toFixed(2)} {/* Format price properly */}
            </p>
            <p className="text-sm text-green-600">
              In Stock: {product.stock} {/* Color for better UX */}
            </p>
            <AddToCart productId={product.id} price={Number(product.price)} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            {/* <h2 className="text-2xl font-semibold mb-4">You  Might Also Like</h2> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <Link
                  href={`/products/${prod.id}`}
                  key={prod.id}
                  className="block rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full h-40 mb-2 overflow-hidden rounded">
                    {/* <Image
                      src={prod.imageUrl || "/coffee.png"}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    /> */}
                  </div>
                  <h3 className="font-medium">{prod.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {prod.description}
                  </p>
                  <p className="text-lg font-semibold mt-1">
                    ${prod.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
// import prisma from "@/lib/prisma";

// import AddToCart from "./AddToCart";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// const ProductPage = async ({ params }: { params: { id: string } }) => {
//   const paramsId = await params;
//   const id = paramsId.id;

//   // const product = await prisma.product.findUnique({
//   //   where: { id },
//   //   // include: { variants: true },
//   // });

//   const [products, product] = await Promise.all([
//     prisma.product.findMany(),
//     prisma.product.findUnique({
//       where: { id },
//     }),
//   ]);

//   return (
//     <div className="">
//       <div className="container mx-auto ">
//         <Link href="/products" className=" hidden md:block">
//           <Button>Back To Products</Button>
//         </Link>
//         <br />

//         <div className="flex flex-col xl:flex-row justify-between items-center align-middle   ">
//           <div className=" w-lg h-lg">
//             <Image
//               src="/coffee.png"
//               alt="coffee"
//               width={500}
//               height={500}
//               className="dark:invert"
//             />
//           </div>
//           <div className="border mx-auto px-4 py-6 w-lg h-lg">
//             <p className="text-5xl ">{product?.name}</p>
//             <p className="text-xl text-yellow-200">{product?.description}</p>
//             <br />
//             <p className="text-3xl font-semibold">
//               Price - {Number(product?.price)}
//             </p>
//             <br />
//             <p className="underline">In-Stock -{product?.stock}</p>
//             <p>{product?.imageUrl}</p>
//             <AddToCart productId={product?.id} price={Number(product?.price)} />
//             <br />
//           </div>
//           <div>
//             <Link href="/products" className="  block xl:hidden">
//               <Button>Back To Products</Button>
//             </Link>
//           </div>
//         </div>

//         <div className="flex justify-around mt-10 p-4 flex-wrap gap-4">
//           {products.map((prod) => (
//             <Link href={`/products/${prod.id}`} key={prod.id}>
//               <p>{prod.name}</p>
//               <p>{prod.description}</p>
//               <p>{Number(prod.price)}</p>
//               <hr />
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;

// // import prisma from "@/lib/prisma";
// // import AddToCart from "./AddToCart";
// // import Link from "next/link";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// // // import { Badge } from "@/components/ui/badge";
// // import { ShoppingCart, ArrowLeft, Package } from "lucide-react";

// // // Assuming a basic Product structure for type clarity (adjust if needed)
// // interface Product {
// //   id: string;
// //   name: string;
// //   description: string;
// //   price: number;
// //   stock: number;
// //   imageUrl: string;
// // }

// // // ------------------------------------------------------------
// // // --- Component to display a list of other products        ---
// // // ------------------------------------------------------------

// // interface OtherProductsListProps {
// //   currentProductId: string;
// //   count?: number;
// // }

// // const OtherProductsList = async ({
// //   currentProductId,
// //   count = 3,
// // }: OtherProductsListProps) => {
// //   // Fetch up to 'count' other products, excluding the current one
// //   const otherProducts: Product[] = await prisma.product.findMany({
// //     where: {
// //       id: { not: currentProductId },
// //     },
// //     take: count, // Limit the number of products shown
// //   });

// //   if (otherProducts.length === 0) {
// //     return null;
// //   }

// //   return (
// //     <div className="mt-12">
// //       <h2 className="text-2xl font-bold mb-4">You might also like...</h2>
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {otherProducts.map((product) => (
// //           <Link key={product.id} href={`/products/${product.id}`} passHref>
// //             <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
// //               <CardHeader className="p-0">
// //                 {/* Simulated Image area */}
// //                 <div className="bg-gray-100 h-40 flex items-center justify-center rounded-t-lg">
// //                   <Package className="w-10 h-10 text-gray-400" />
// //                 </div>
// //               </CardHeader>
// //               <CardContent className="pt-4">
// //                 <CardTitle className="text-lg truncate">
// //                   {product.name}
// //                 </CardTitle>
// //                 <p className="text-xl font-semibold mt-2 text-primary">
// //                   ${Number(product.price).toFixed(2)}
// //                 </p>
// //                 <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
// //                   {product.description}
// //                 </p>
// //                 <Button variant="outline" size="sm" className="w-full mt-3">
// //                   View Details
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           </Link>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // // ------------------------------------------------------------
// // // --- Main Product Page Component                          ---
// // // ------------------------------------------------------------

// // const ProductPage = async ({ params }: { params: { id: string } }) => {
// //   const awaitId = await params;
// //   const id = awaitId.id;

// //   // Ensure 'product' is typed or handled for null
// //   const product: Product | null = (await prisma.product.findUnique({
// //     where: { id },
// //   })) as Product | null;

// //   if (!product) {
// //     return (
// //       <div className="container mx-auto p-8">
// //         <h1 className="text-3xl font-bold text-center text-destructive">
// //           Product Not Found
// //         </h1>
// //         <p className="text-center mt-4">
// //           The product with ID: {id} could not be found.
// //         </p>
// //         <div className="text-center mt-6">
// //           <Link href="/products">
// //             <Button variant="outline">
// //               <ArrowLeft className="w-4 h-4 mr-2" /> Back To Products
// //             </Button>
// //           </Link>
// //           <a href="/" className="ml-4 text-sm text-muted-foreground">
// //             Return to Home
// //           </a>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const isOutOfStock = product.stock <= 0;
// //   const formattedPrice = Number(product.price).toFixed(2);

// //   return (
// //     <div className="container mx-auto p-4 md:p-8">
// //       <Link href="/products">
// //         <Button variant="outline" className="mb-6">
// //           <ArrowLeft className="w-4 h-4 mr-2" />
// //           Back To Products
// //         </Button>
// //       </Link>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
// //         {/* --- Left Column: Image/Visuals --- */}
// //         <div className="bg-gray-100 p-6 rounded-xl shadow-inner flex items-center justify-center aspect-square">
// //           {/* Simulated Image Component */}
// //           <div className="text-center">
// //             <Package className="w-20 h-20 text-gray-400 mx-auto mb-2" />
// //             <p className="text-sm text-gray-500">Image Placeholder</p>
// //           </div>
// //           {/* Use Next/Image here with product.imageUrl */}
// //           {/* <Image src={product.imageUrl} alt={product.name} width={500} height={500} className="rounded-lg object-cover" /> */}
// //         </div>

// //         {/* --- Right Column: Product Details & CTA --- */}
// //         <Card className="p-6">
// //           <CardHeader className="p-0 mb-4">
// //             <CardTitle className="text-4xl font-extrabold tracking-tight">
// //               {product.name}
// //             </CardTitle>
// //           </CardHeader>
// //           <p className="text-3xl font-bold text-primary mb-4">
// //             ${formattedPrice}
// //           </p>

// //           <Separator className="my-4" />

// //           {/* Description */}
// //           <h3 className="text-xl font-semibold mb-2">Description</h3>
// //           <p className="text-muted-foreground leading-relaxed mb-6">
// //             {product.description}
// //           </p>

// //           {/* Stock Info */}
// //           <div className="flex items-center space-x-2 mb-6">
// //             <Package className="w-5 h-5 text-gray-500" />
// //             {isOutOfStock ? (
// //               // <Badge variant="destructive" className="text-base py-1 px-3">
// //               //   Out of Stock
// //               // </Badge>
// //               <div>Out of Stock</div>
// //             ) : (
// //               <p className="text-lg font-medium text-green-600">
// //                 {product.stock} In Stock
// //               </p>
// //             )}
// //           </div>

// //           {/* Add To Cart Component */}
// //           <div className="mt-6">
// //             <AddToCart
// //               productId={product.id}
// //               price={Number(product.price)}
// //               disabled={isOutOfStock}
// //               className="w-full text-lg"
// //             >
// //               <ShoppingCart className="w-5 h-5 mr-2" />
// //               {isOutOfStock ? "Notify Me" : "Add to Cart"}
// //             </AddToCart>
// //           </div>
// //         </Card>
// //       </div>

// //       {/* --- Other Products Section --- */}
// //       <OtherProductsList currentProductId={product.id} />
// //     </div>
// //   );
// // };

// // export default ProductPage;
