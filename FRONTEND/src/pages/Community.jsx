import Header from "../components/Header";
import {Users,Leaf,Star,Trophy,ArrowRight,} from "lucide-react";
import hydration from "../assets/hydration.png";
import healthy from "../assets/healthy.png";
import diet from "../assets/diet.png";
import com from "../assets/com.png";
function Community() {
  return (
    <>
    <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
        <Header />
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-10 items-center mb-12">
        <div>
          <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full font-semibold text-sm">
            COMMUNITY
          </span>

          <h1 className="text-5xl font-bold mt-4">
            Join the PureByte
            <span className="text-green-500 block">Community</span>
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            Connect with food lovers, share your journey,
            and build healthier habits together.
          </p>
        </div>
        <div className="relative flex justify-center items-center">
       <img
            src={ com }
            alt="community"
            className=" w-full h-full object-cover"
          />
        
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">

        <div className="bg-white border rounded-2xl p-8 text-center shadow-lg  border-green-200">
          <Users className="mx-auto text-green-500 mb-3" size={34} />
          <h2 className="text-4xl font-bold text-green-500">15K+</h2>
          <p className="text-gray-500 mt-2">Active Members</p>
        </div>

        <div className="bg-white border rounded-2xl p-8 text-center shadow-lg border-green-200">
          <Leaf className="mx-auto text-green-500 mb-3" size={34} />
          <h2 className="text-4xl font-bold text-green-500">2.5M+</h2>
          <p className="text-gray-500 mt-2">Foods Detected</p>
        </div>

        <div className="bg-white border rounded-2xl p-8 text-center shadow-lg  border-green-200">
          <Star className="mx-auto text-green-500 mb-3" size={34} />
          <h2 className="text-4xl font-bold text-green-500">1.2M+</h2>
          <p className="text-gray-500 mt-2">Meals Analyzed</p>
        </div>

        <div className="bg-white border rounded-2xl p-8 text-center shadow-lg  border-green-200">
          <Trophy className="mx-auto text-green-500 mb-3" size={34} />
          <h2 className="text-4xl font-bold text-green-500">8K+</h2>
          <p className="text-gray-500 mt-2">Challenges Completed</p>
        </div>

      </div>

      {/* Popular Challenges */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold">
          Popular Challenges
        </h2>

        <button className="text-green-500 font-semibold flex items-center gap-2">
          View All <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">

        {/* Card 1 */}
        <div className="border border-green-200 overflow-hidden  shadow-lg rounded-2xl">
          <img
            src={healthy}
            className="h-56 w-full object-cover"
            alt=""
          />

          <div className="p-6">
            <h3 className="text-2xl font-bold">
              Healthy Week Challenge
            </h3>

            <p className="text-gray-500 mt-3">
              Eat healthy for 7 days and track your meals.
            </p>

            <p className="text-green-500 font-semibold mt-4">
              👥 1.2K Participants
            </p>

            <button className="w-full mt-5 border border-green-500 text-green-500 py-3 rounded-xl font-semibold hover:bg-green-500 hover:text-white transition">
              Join Challenge
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border  overflow-hidden shadow-lg   border-green-200 rounded-2xl">
          <img
            src={hydration}
            className="h-56 w-full object-cover"
            alt=""
          />

          <div className="p-6">
            <h3 className="text-2xl font-bold">
              Hydration Challenge
            </h3>

            <p className="text-gray-500 mt-3">
              Stay hydrated and feel your best.
            </p>

            <p className="text-green-500 font-semibold mt-4">
              👥 2.1K Participants
            </p>

            <button className="w-full mt-5 border border-green-500 text-green-500 py-3 rounded-xl font-semibold hover:bg-green-500 hover:text-white transition">
              Join Challenge
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border rounded-2xl overflow-hidden shadow-lg  border-green-200">
          <img
            src={diet}
            className="h-56 w-full object-cover"
            alt=""
          />

          <div className="p-6">
            <h3 className="text-2xl font-bold">
              Balanced Diet Challenge
            </h3>

            <p className="text-gray-500 mt-3">
              Build balanced meals every day.
            </p>

            <p className="text-green-500 font-semibold mt-4">
              👥 4.5K Participants
            </p>

            <button className="w-full mt-5 border border-green-500 text-green-500 py-3 rounded-xl font-semibold hover:bg-green-500 hover:text-white transition">
              Join Challenge
            </button>
          </div>
        </div>

      </div>

      {/* Testimonials */}
      <h2 className="text-4xl font-bold mb-8">
        What Our Community Says
      </h2>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">

        <div className="border rounded-2xl p-6 shadow-lg border-amber-50">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              className="w-14 h-14 rounded-full"
              alt=""
            />
            <div>
              <h4 className="font-bold">Sarah W.</h4>
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          <p className="text-gray-600">
            "PureByte helps me make better choices every day.
            The accuracy is amazing!"
          </p>
        </div>

        <div className="border rounded-2xl p-6 shadow-lg border-amber-50">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-14 h-14 rounded-full"
              alt=""
            />
            <div>
              <h4 className="font-bold">Jason K.</h4>
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          <p className="text-gray-600">
            "I love how easy it is to track my meals
            and understand nutrition."
          </p>
        </div>

        <div className="border rounded-2xl p-6 shadow-lg border-amber-50">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              className="w-14 h-14 rounded-full"
              alt=""
            />
            <div>
              <h4 className="font-bold">Priya M.</h4>
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          <p className="text-gray-600">
            "This app has become my daily companion
            for a healthier lifestyle."
          </p>
        </div>

      </div>

      {/* CTA */}
      <div className="bg-green-600 rounded-2xl p-8 flex flex-col lg:flex-row justify-between items-center text-white">
        <div>
          <h3 className="text-3xl font-bold">
            Be a part of a community that cares
          </h3>
          <p className="mt-2 text-green-100">
            About health and smart choices.
          </p>
        </div>

        <button className="mt-4 lg:mt-0 bg-white text-green-600 px-8 py-4 rounded-xl font-bold flex items-center gap-2">
          Join PureByte Community
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
    </>
  );
}

export default Community;
// function Community(){
//     return(
//         <>
//          <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
//         <Header />
//         <div className="text-green-500">
//             <h1> Communtiy </h1>
//             </div>
//             </>
//     );
// }
// export default Community;