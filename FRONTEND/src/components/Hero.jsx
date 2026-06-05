import mobile from "../assets/mobile.png";
function Hero() {
  return (
    <section className="flex items-center justify-between px-6 py-2 ">

    <div className="min-h-screen flex flex-col  px-6 py-45">
      <p className="text-green-500 font-semibold px-10 ">
        AI Powered Food Quality Detection
      </p>

      <h1 className="text-5xl font-bold mt-4  px-10">
        Eat Smart,
        <br />
        <h1 className="text-green-500"> Live Better.</h1>
      </h1>

      <p className="mt-4 max-w-xl px-10 ">
        PureByte helps you analyze food quality and nutritional value
        using AI technology.
      </p>

      <div className="mt-6 flex gap-4 px-10">
        <button className="bg-green-500 text-white px-3 py-3 rounded-full">
          Scan Your Food
        </button>

        <button className="border px-3 py-3 rounded-full">
          Explore Features
        </button>
        </div>
  </div>
        <div className="pt-1 pb-12 flex gap-100">
        <img src={mobile} alt="mobile" className="w-150 h-150"/>
        </div>
       
    </section>
  
  );
}

export default Hero;