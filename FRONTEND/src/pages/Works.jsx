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
    <section className="min-h-screen overflow-x-hidden bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* LEFT SIDE */}
          <div>

            {/* Header */}
            <div className="mb-10 sm:mb-14">
              <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-600">
                HOW IT WORKS
              </span>

              <h1 className="mt-5 text-3xl font-bold leading-tight sm:mt-6 sm:text-4xl md:text-5xl">
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
                    className="flex gap-4 sm:gap-6"
                  >

                    {/* Icon + Line */}
                    <div className="relative flex flex-col items-center">

                      <div className="relative">

                        <div className="absolute inset-0 bg-green-200 blur-xl opacity-50 rounded-full"></div>

                        <div className="relative w-16 h-16 rounded-3xl bg-green-50 flex items-center justify-center border border-green-200 sm:w-20 sm:h-20">
                          <Icon
                            size={32}
                            className="text-green-500 sm:hidden"
                          />
                          <Icon
                            size={36}
                            className="hidden text-green-500 sm:block"
                          />
                        </div>

                      </div>

                      {index !== steps.length - 1 && (
                        <div className="mt-4 h-16 w-[2px] bg-green-200 sm:h-24"></div>
                      )}

                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 font-semibold text-white">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold sm:text-xl md:text-2xl">
                          {step.title}
                        </h3>
                      </div>

                      <p className="mt-3 text-sm text-gray-600 sm:mt-4 sm:text-base md:max-w-md md:ml-14">
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
            <div className="w-full max-w-[260px] rounded-[32px] border-[8px] border-black bg-white p-4 shadow-2xl sm:max-w-[280px] sm:rounded-[40px] sm:border-[10px] sm:p-5">

              <div className="text-center">

                <h3 className="font-semibold text-xl">
                  Nutrition Facts
                </h3>

                {/* Circle */}
                <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-green-500 sm:mt-8 sm:h-40 sm:w-40 sm:border-[12px]">
                  <div>
                    <h2 className="text-3xl font-bold sm:text-4xl">
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

                <button
                  type="button"
                  className="mt-6 min-h-11 w-full rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 sm:mt-8"
                >
                  Save Result
                </button>

              </div>

            </div>

          </div>

        </div>
       <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-6 md:grid-cols-4">

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold sm:text-xl">
          Fresh Salad 🥗
        </h3>

        <span className="w-fit rounded-full bg-green-500 px-3 py-2 text-xs font-medium text-white sm:px-4 sm:text-sm">
          Healthy Choice
        </span>
      </div>

      <img
        src={Salad}
        alt="Salad"
        className="mx-auto mt-4 h-auto w-full max-h-64 rounded-2xl object-cover sm:max-h-72"
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
    <div className="bg-green-50 border border-green-300 rounded-3xl p-6 hover:scale-101 duration-30">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold sm:text-xl">
          Cheeseburger 🍔
        </h3>

        <span className="w-fit rounded-full bg-green-500 px-3 py-2 text-xs font-medium text-white sm:px-4 sm:text-sm">
          Consume in Moderation
        </span>
      </div>

      <img
        src={Burger}
        alt="Burger"
        className="mx-auto mt-4 h-auto w-full max-h-64 rounded-2xl object-cover sm:max-h-72"
      />

      <div className="mt-5 space-y-3">

        <div className="flex justify-between">
          <span>Calories</span>
          <span className="font-semibold">850 kcal</span>
        </div>

        <div className="flex justify-between">
          <span>Fat</span>
          <span className="text-green-600 font-semibold">
            High ✕
          </span>
        </div>

        <div className="flex justify-between">
          <span>Sodium</span>
          <span className="text-green-600 font-semibold">
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