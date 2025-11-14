import prisma from "@/lib/prisma";

import AddToCart from "./AddToCart";

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const paramsId = await params;
  const id = paramsId.id;

  const product = await prisma.product.findUnique({
    where: { id },
    // include: { variants: true },
  });

  return (
    <div className="p-2 m-1">
      <p>{product?.name}</p>
      <p>{product?.description}</p>
      <p>Price - {Number(product?.price)}</p>
      <p>In-Stock -{product?.stock}</p>
      <p>{product?.imageUrl}</p>
      <AddToCart productId={product?.id} price={Number(product?.price)} />
      {/* <AddToCart product={product} /> */}
    </div>
  );
};

export default ProductPage;
