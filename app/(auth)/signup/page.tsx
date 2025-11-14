import SignUpForm from "./form";

const page = () => {
  return (
    <div className="py-4 px-4 backdrop-blur-3xl shadow-2xl ">
      <div className="container mx-auto flex flex-col justify-between items-center">
        <h1>let's connect!</h1>
        <SignUpForm />
        <br />
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto,
          praesentium distinctio quis voluptates voluptatum sapiente et incidunt
          velit deserunt! Ducimus beatae eum placeat amet facere nihil possimus
          odit corrupti aliquid?
        </p>
      </div>
    </div>
  );
};

export default page;
