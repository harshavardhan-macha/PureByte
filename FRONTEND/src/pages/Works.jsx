import Header from "../components/Header";
import {Camera,Brain,BarChart3,CheckCircle,} from "lucide-react";
import Salad from "../assets/saladImg.png";
import Burger from "../assets/BurgerImg.png";

function HowItWorks() {
  const steps = [
    {
      icon: Camera,
      title: "Upload Food Image",
      desc: "Capture a photo or upload an image of the food you want to analyze.",
    },
    {
      icon: Brain,
      title: "AI Analyzes Food",
      desc: "Our advanced AI model scans the image and identifies the food and ingredients.",
    },
    {
      icon: BarChart3,
      title: "View Nutrition & Calories",
      desc: "Get detailed nutritional breakdown including calories, macros, and key nutrients.",
    },
    {
      icon: CheckCircle,
      title: "Make Better Choices",
      desc: "Use the insights to track your diet and make healthier food choices every day.",
    },
  ];

  return (
    <>
    <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div> 
           <Header />
    <section className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div>

            {/* Header */}
            <div className="mb-14">
              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                HOW IT WORKS
              </span>

              <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                Simple Steps,
                <br />
                <span className="text-green-500">
                  Powerful Results
                </span>
              </h1>

              <p className="mt-6 text-gray-600 max-w-md">
                PureByte makes food detection and nutrition analysis
                easy in just a few simple steps.
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-10">

              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={index}
                    className="flex gap-6"
                  >

                    {/* Icon + Line */}
                    <div className="relative flex flex-col items-center">

                      <div className="relative">

                        <div className="absolute inset-0 bg-green-200 blur-xl opacity-50 rounded-full"></div>

                        <div className="relative w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center border border-green-200">
                          <Icon
                            size={36}
                            className="text-green-500"
                          />
                        </div>

                      </div>

                      {index !== steps.length - 1 && (
                        <div className="w-[2px] h-24 bg-green-200 mt-4"></div>
                      )}

                    </div>

                    {/* Content */}
                    <div>

                      <div className="flex items-center gap-4">

                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-semibold">
                          {step.title}
                        </h3>

                      </div>

                      <p className="mt-4 text-gray-600 max-w-md ml-14">
                        {step.desc}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex justify-center">

            <div className="w-[280px] sm:w-[320px] rounded-[40px] border-[10px] border-black bg-white shadow-2xl p-5">

              <div className="text-center">

                <h3 className="font-semibold text-xl">
                  Nutrition Facts
                </h3>

                {/* Circle */}
                <div className="w-40 h-40 rounded-full border-[12px] border-green-500 mx-auto mt-8 flex items-center justify-center">

                  <div>
                    <h2 className="text-4xl font-bold">
                      450
                    </h2>

                    <p className="text-gray-500">
                      kcal
                    </p>
                  </div>

                </div>

                {/* Nutrition Details */}
                <div className="mt-8 space-y-4 text-left">

                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span>18g</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Carbohydrates</span>
                    <span>45g</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Fat</span>
                    <span>22g</span>
                  </div>

                </div>

                <button className="mt-8 w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition">
                  Save Result
                </button>

              </div>

            </div>

          </div>

        </div>
       <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">

  <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
    <h3 className="text-3xl font-bold text-green-500">⚡</h3>
    <p className="mt-3 font-semibold">Fast</p>
    <p className="text-sm text-gray-600 mt-1">
      Instant AI-powered food recognition.
    </p>
  </div>

  <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
    <h3 className="text-3xl font-bold text-green-500">🎯</h3>
    <p className="mt-3 font-semibold">Accurate</p>
    <p className="text-sm text-gray-600 mt-1">
      Reliable nutrition and calorie analysis.
    </p>
  </div>

  <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
    <h3 className="text-3xl font-bold text-green-500">🧠</h3>
    <p className="mt-3 font-semibold">Smart</p>
    <p className="text-sm text-gray-600 mt-1">
      Advanced AI understands your meals.
    </p>
  </div>

  <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
    <h3 className="text-3xl font-bold text-green-500">🔒</h3>
    <p className="mt-3 font-semibold">Secure</p>
    <p className="text-sm text-gray-600 mt-1">
      Your data stays safe and protected.
    </p>
  </div>

</div>
{/* Nutrition Insight Ex */}
<div className="mt-24">

  <div className="text-center mb-12">
    <h2 className="text-3xl sm:text-4xl font-bold">
      Understand Your Nutrition
      <span className="text-green-500"> Instantly</span>
    </h2>

    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
      PureByte not only detects food but also helps you understand
      whether your meal is a healthy choice or should be consumed in moderation.
    </p>
  </div>

  <div className="grid md:grid-cols-2 gap-8 ">

    {/* Healthy Food Card */}
    <div className="bg-green-50 border border-green-300 rounded-3xl p-6 hover:scale-101">

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold">
          Fresh Salad 🥗
        </h3>

        <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          Healthy Choice
        </span>
      </div>

      <img
        src={Salad}
        alt="Salad"
        className=" mx-auto w-85 h-85 md:h-72  object-cover rounded-2xl "
      />

      <div className="mt-5 space-y-3">

        <div className="flex justify-between">
          <span className="font-semibold">Calories</span>
          <span className="font-semibold">180 kcal</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Protein</span>
          <span className="font-semibold">12g</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Fiber</span>
          <span className="text-green-600 font-semibold">
            High ✓
          </span>
        </div>

      </div>
    </div>

    {/* Warning Food Card */}
    <div className="bg-red-50 border border-red-300 rounded-3xl p-6 hover:scale-101 duration-30">

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-semibold">
          Cheeseburger 🍔
        </h3>

        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          Consume in Moderation
        </span>
      </div>

      <img
        src={Burger}
        alt="Burger"
        className=" mx-auto  w-85 h-85 md:h-72 object-cover rounded-2xl"
      />

      <div className="mt-5 space-y-3">

        <div className="flex justify-between">
          <span>Calories</span>
          <span className="font-semibold">850 kcal</span>
        </div>

        <div className="flex justify-between">
          <span>Fat</span>
          <span className="text-red-600 font-semibold">
            High ✕
          </span>
        </div>

        <div className="flex justify-between">
          <span>Sodium</span>
          <span className="text-red-600 font-semibold">
            High ✕
          </span>
        </div>

      </div>
    </div>

  </div>

</div>
      </div>
    </section>
    </>
  );
}

export default HowItWorks;

// function Works(){
//     return(
//         <>
//         <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
//         <Header />
        
//         </>
//     );
// }
// export default Works;