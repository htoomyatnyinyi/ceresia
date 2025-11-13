import Link from "next/link";
import Checkout from "./cart/CheckoutButton";

const page = () => {
  return (
    <div>
      <h1 className="text-3xl">Ceresia Coffee Roaster</h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio esse
        quidem maxime, voluptate mollitia harum ratione recusandae, perspiciatis
        voluptatibus quos dolor placeat nostrum adipisci dolorem quaerat culpa
        corrupti consequuntur. Tempore?
      </p>
      <br />
      <Link href="/cart" className="p-2 m-1 border border-b-2 border-white">
        Cart
      </Link>
    </div>
  );
};

export default page;
