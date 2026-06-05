 import foodIcon from "../assets/foodIcon.png"
 import Analysis from "../assets/Analysis.png"
 import Health from "../assets/Health.png"
 import History from "../assets/History.png"
 function Features() {
  return (
    <div className=" px-6 mt-2">
      <h1 className="text-5xl font-bold text-center text-Black ">
        Smart <h1 className="text-green-500"> Features</h1>
      </h1>

      <p className="text-center mt-4 text-xl">
        Poweful tools to help you understand Your Fod Better
      </p>

      <div className="grid grid-cols-4 gap-15 mt-8 pt-12">

        <div className="border rounded-xl border-yellow-50 shadow-md w-80 h-45 p-4 bg-green-200 ">
            <img src={foodIcon} alt="food detection" className="w-10 h-10 rounded-2xl"/>
          <h3 className="text-xl font-bold ">
            Food Detection
          </h3>

          <p className="mt-2 ">
            Instantly identify food items using Ai image recognisation.Just scan your food and get results in Seconds.
          </p>
        </div>

        <div className="border rounded-xl p-4 bg-green-200 w-80 h-45 border-yellow-50 shadow-md ">
            <img src={Analysis} alt="food detection" className="w-10 h-10 rounded-2xl"/>
          <h3 className="text-xl font-bold">
            Nutrition Analysis
          </h3>

          <p className="mt-2">
            Get detailed nutritional insights.
          </p>
        </div>

        <div className="border rounded-xl p-4  bg-green-200 w-80 h-45 border-yellow-50 shadow-md">
            <img src={Health} alt="food detection" className="w-10 h-10 rounded-2xl"/>
          <h3 className="text-xl font-bold">
            Health Score
          </h3>

          <p className="mt-2">
            Understand how healthy your food is.
          </p>
        </div>
        <div className="border rounded-xl p-4  bg-green-200 w-80 h-45 border-yellow-50 shadow-md">
            <img src={History} alt="food detection" className="w-10 h-10 rounded-2xl"/>
          <h3 className="text-xl font-bold">
            History
          </h3>

          <p className="mt-2">
            Track and analyse Your food History.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Features;