import Header from "../components/Header";
import {
  Camera,
  Brain,
  BarChart3,
  CheckCircle,
} from "lucide-react";

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