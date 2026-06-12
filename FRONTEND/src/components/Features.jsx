import foodIcon from "../assets/foodIcon.png"
import Health from "../assets/Health.png"
import Analysis from "../assets/Analysis.png"
import History from "../assets/History.png"
import { ScanLine , Users, Salad, Target, ArrowRight} from "lucide-react"
function Features() {
  return (
    <div className=" px-6 py-8 ">
      <h1 className="text-5xl font-bold text-center -mt-1">
        Smart <h1 className=" text-green-500 mb-10"> Features</h1>
      </h1>

      <p className="text-center  font-semibold">
        Powerful tools to help you Understand Your Food Better.
      </p>
      <div className="pl-5 pr-7">
      <div className="grid md:grid-cols-4 gap-14 mt-12 ">

        <div className="border rounded-xl p-4 w-80 border-blue-100 bg-green-200 h-45 hover:scale-101">
          <h3 className="text-xl font-bold ">
            <img src={foodIcon} className="w-10 h-10 rounded-2xl" />
            Food Detection
          </h3>

          <p className="mt-2 text-left">
           Instantly identify food items using Ai image recognisation.Just scan your food and get results in Seconds.
          </p>
        </div>

        <div className="border rounded-xl p-4 w-80  border-blue-100 bg-green-200 h-45 hover:scale-101">
          <h3 className="text-xl font-bold">
            <img src={Analysis} className="w-10 h-10 rounded-2xl" />
            Nutrition Analysis
          </h3>

          <p className="mt-2 text-left">
          Get detailed Breakdown of calories,protiens,and fats.Helps you understand what's really in Your food.
          </p>
        </div>

        <div className="border rounded-xl p-4 w-80 border-blue-100 bg-green-200 h-45 hover:scale-101">
          <h3 className="text-xl font-bold">
            <img src={Health} className="w-10 h-10 rounded-2xl" />
            Health Score
          </h3>

          <p className="mt-2 text-left ">
            Ai-generated score that shows how helathy your food is. Make better food choices for a healthier lifestyle.
          </p>
        </div>
        <div className="border rounded-xl p-4 w-80  border-blue-100 bg-green-200 h-45 hover:scale-101">
          <h3 className="text-xl font-bold">
            <img src={History} className="w-10 h-10 rounded-2xl" />
            History
          </h3>

          <p className="mt-2 text-left ">
            View all your previously scanned food anytime.Track and analyze Your eating habits early.
          </p>
        </div>
        </div>
        </div>
       <div className="flex gap-15 mt-20">
       <div className="max-w-5xl flex-1 pl-5">
      
      <div className="bg-gradient-to-r from-green-50 via-white to-green-50
                      shadow-xl rounded-2xl border border-green-300 
                      backdrop-blur-md ">

        <div className="flex text-center divide-x  divide-green-300">

          <div className="flex-1 p-6 hover:scale-105 transition duration-300">
            <Users size={32} className="mx-auto mb- "/>
            <h2 className="text-2xl font-bold text-green-600 pl-2 ">25K+</h2>
            <p className="text-gray-600 text-sm">Happy Users</p>
          </div>

          <div className="flex-1 p-6 hover:scale-105 transition duration-300">
            <ScanLine size={32} className="mx-auto mb- "/>
            <h2 className="text-2xl font-bold text-green-600 pl-2">1M+</h2>
            <p className="text-gray-600 text-sm">Scanned</p>
          </div>

          <div className="flex-1 p-6 hover:scale-105 transition duration-300">
            <Target size={32} className="mx-auto mb- "/>
            <h2 className="text-2xl font-bold text-green-600 pl-2">98%</h2>
            <p className="text-gray-600 text-sm">Accuracy Rate</p>
          </div>

          <div className="flex-1 p-6 hover:scale-105 transition duration-300">
            <Salad size={32} className="mx-auto mb- "/>
            <h2 className="text-2xl font-bold text-green-600 pl-2">500K+</h2>
            <p className="text-gray-600 text-sm">Healthy Choices</p>
          </div>
        
        
      </div>
       </div>
       </div>
       
      <div className=" rounded-2xl border bg-green-50 w-91 h-38 p-2 border-green-300">
        <h1 className="font-semibold text-xl pb-2"> Ready to make smarter food Choices?</h1>
        <p className="font-normal pb-2"> Scan your  first food and get instatnt  Nutrition Results.</p>
        <button className="bg-green-500 rounded flex px-3 py-2 text-white font-semibold">Get Started <ArrowRight size={25} className="align-middle "></ArrowRight>
        </button>
         </div>

          
      </div>
       </div>
        );
      }
  export default Features;

