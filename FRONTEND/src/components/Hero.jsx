import { ArrowRight, ScanLine } from "lucide-react";
import mobile from "../assets/mobile.png";
function Hero() {
  return (
    <section className="flex items-center justify-between px-6 py-2 ">

    <div className="min-h-screen flex flex-col  px-6 py-45">
      <p className="text-green-500 font-semibold px-10">
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
        <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full hover:bg-green-700 transition">
        <ScanLine size={20} />
        Scan your food
        </button>
      

        <button className=" flex items-center gap-2 bg-white text-green-600 border border-green-600 hover:bg-green-50 transition px-5 py-3 rounded-full">
          
          Explore Features
          <ArrowRight size={18}/>
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