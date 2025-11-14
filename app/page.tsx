import { SonnerTypes } from "@/components/general/SonnerTypes";
import Weather from "@/components/weather/Weather";

const page = () => {
  return (
    <div className="">
      <Weather />
      <SonnerTypes />
    </div>
  );
};

export default page;
