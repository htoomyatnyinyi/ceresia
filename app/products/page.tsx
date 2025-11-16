import { SonnerTypes } from "@/components/general/SonnerTypes";
import Weather from "@/components/weather/Weather";
import prisma from "@/lib/prisma";
import Link from "next/link";

const ProductPage = async () => {
  const products = await prisma.product.findMany();

  return (
    <div className="">
      <div>
        {products?.map((product) => (
          <div key={product.id} className="p-2 m-1 border-b-2">
            <Link href={`/products/${product.id}`}>
              {/* <p>{product.id}</p> */}
              <p>{product.name}</p>
              <p>{product.description}</p>
              <p>{Number(product.price)}</p>
              <p>{product.stock}</p>
              <p>{product.imageUrl}</p>
            </Link>
          </div>
        ))}
      </div>
      <br />
      <div>
        <SonnerTypes />
        <Weather />
      </div>
    </div>
  );
};

export default ProductPage;
