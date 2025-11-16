import { verifySession } from "@/lib/session";
import CreateNewPorduct from "./CreateNewPorduct";

const page = async () => {
  const session = await verifySession();
  if (!session) {
    return null;
  }

  return (
    <div>
      <CreateNewPorduct />
    </div>
  );
};

export default page;
