import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
  // const products = await prisma.product.findMany();
  const products = await prisma.product.findMany();
  // console.log(products, "check");
  return (
    <div className="">
      <div className="flex justify-around">
        <h1 className="text-3xl">Ceresia Coffee Roaster</h1>
        <Link href="/cart" className="p-2 m-1 border border-b-2 border-white">
          Cart
        </Link>
      </div>
      <p className=" ">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio esse
        quidem maxime, voluptate mollitia harum ratione recusandae, perspiciatis
        voluptatibus quos dolor placeat nostrum adipisci dolorem quaerat culpa
        corrupti consequuntur. Tempore?
      </p>
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
              {/* <Image
              alt={product.name}
              src={product.imageUrl}
              width={100}
              height={100}
              /> */}
            </Link>
          </div>
        ))}
      </div>
      <br />
    </div>
  );
};

export default page;
