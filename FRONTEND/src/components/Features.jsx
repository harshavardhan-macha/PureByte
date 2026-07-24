import foodIcon from "../assets/foodIcon.png"
import Health from "../assets/Health.png"
import Analysis from "../assets/Analysis.png"
import History from "../assets/History.png"
import { ScanLine, Users, Salad, Target, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function Features() {
  const { isAuthenticated } = useAuthContext();
  const actionLink = isAuthenticated ? "/scan" : "/login";

  return (
    <div className="w-full overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="-mt-1 text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
        Smart <span className="mb-6 block text-green-500 sm:mb-10 sm:inline">Features</span>
      </h2>

      <p className="mt-4 text-center text-sm font-semibold sm:text-base">
        Powerful tools to help you Understand Your Food Better.
      </p>

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-10">
        <div className="w-full rounded-xl border border-blue-100 bg-green-200 p-4 transition hover:scale-[1.01] sm:p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
            <img src={foodIcon} alt="" className="h-10 w-10 shrink-0 rounded-2xl" />
            Food Detection
          </h3>
          <p className="mt-2 text-left text-sm sm:text-base">
            Instantly identify food items using Ai image recognisation.Just scan your food and get results in Seconds.
          </p>
        </div>

        <div className="w-full rounded-xl border border-blue-100 bg-green-200 p-4 transition hover:scale-[1.01] sm:p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
            <img src={Analysis} alt="" className="h-10 w-10 shrink-0 rounded-2xl" />
            Nutrition Analysis
          </h3>
          <p className="mt-2 text-left text-sm sm:text-base">
            Get detailed Breakdown of calories,protiens,and fats.Helps you understand what's really in Your food.
          </p>
        </div>

        <div className="w-full rounded-xl border border-blue-100 bg-green-200 p-4 transition hover:scale-[1.01] sm:p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
            <img src={Health} alt="" className="h-10 w-10 shrink-0 rounded-2xl" />
            Health Score
          </h3>
          <p className="mt-2 text-left text-sm sm:text-base">
            Ai-generated score that shows how helathy your food is. Make better food choices for a healthier lifestyle.
          </p>
        </div>

        <div className="w-full rounded-xl border border-blue-100 bg-green-200 p-4 transition hover:scale-[1.01] sm:p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
            <img src={History} alt="" className="h-10 w-10 shrink-0 rounded-2xl" />
            History
          </h3>
          <p className="mt-2 text-left text-sm sm:text-base">
            View all your previously scanned food anytime.Track and analyze Your eating habits early.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-6 lg:mt-20 lg:flex-row lg:items-stretch lg:gap-8">
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-green-300 bg-gradient-to-r from-green-50 via-white to-green-50 shadow-xl backdrop-blur-md">
            <div className="grid grid-cols-2 divide-x divide-y divide-green-300 lg:grid-cols-4 lg:divide-y-0">
              <div className="p-4 text-center transition duration-300 hover:scale-105 sm:p-6">
                <Users size={28} className="mx-auto mb-2 sm:mb-3" />
                <h3 className="text-xl font-bold text-green-600 sm:text-2xl">25K+</h3>
                <p className="text-xs text-gray-600 sm:text-sm">Happy Users</p>
              </div>

              <div className="p-4 text-center transition duration-300 hover:scale-105 sm:p-6">
                <ScanLine size={28} className="mx-auto mb-2 sm:mb-3" />
                <h3 className="text-xl font-bold text-green-600 sm:text-2xl">1M+</h3>
                <p className="text-xs text-gray-600 sm:text-sm">Scanned</p>
              </div>

              <div className="p-4 text-center transition duration-300 hover:scale-105 sm:p-6">
                <Target size={28} className="mx-auto mb-2 sm:mb-3" />
                <h3 className="text-xl font-bold text-green-600 sm:text-2xl">98%</h3>
                <p className="text-xs text-gray-600 sm:text-sm">Accuracy Rate</p>
              </div>

              <div className="p-4 text-center transition duration-300 hover:scale-105 sm:p-6">
                <Salad size={28} className="mx-auto mb-2 sm:mb-3" />
                <h3 className="text-xl font-bold text-green-600 sm:text-2xl">500K+</h3>
                <p className="text-xs text-gray-600 sm:text-sm">Healthy Choices</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full shrink-0 rounded-2xl border border-green-300 bg-green-50 p-4 sm:p-5 lg:max-w-sm">
          <h3 className="pb-2 text-lg font-semibold sm:text-xl">
            Ready to make smarter food Choices?
          </h3>
          <p className="pb-3 text-sm font-normal sm:text-base">
            Scan your first food and get instatnt Nutrition Results.
          </p>
          <Link to={actionLink} className="w-full sm:w-auto">
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded bg-green-500 px-3 py-2 text-sm font-semibold text-white sm:w-auto"
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Features;
