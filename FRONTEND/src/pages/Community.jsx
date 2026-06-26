import Header from "../components/Header";
import {Users,Leaf,Star,Trophy,ArrowRight,} from "lucide-react";
import {Link} from "react-router-dom";
import com from "../assets/com.png";
function Community(){
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
      
    <div className="mt-16">

  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold">
      What Our Users Say
    </h2>

    <p className="text-gray-600 mt-3">
      Real experiences from people using PureByte to understand
      their food and nutrition better.
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

    {/* Card 1 */}
    <div className="bg-white border border-green-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
          A
        </div>

        <div>
          <h3 className="font-semibold">Ananya</h3>
          <p className="text-sm text-gray-500">
            Fitness Enthusiast
          </p>
        </div>
      </div>

      <p className="mt-5 text-gray-600">
        "PureByte helped me understand my daily calorie intake.
        The nutrition insights are quick and easy to understand."
      </p>

      <div className="mt-4 text-green-500">
        ⭐⭐⭐⭐⭐
      </div>

    </div>

    {/* Card 2 */}
    <div className="bg-white border border-green-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
          R
        </div>

        <div>
          <h3 className="font-semibold">Rahul</h3>
          <p className="text-sm text-gray-500">
            Student
          </p>
        </div>
      </div>

      <p className="mt-5 text-gray-600">
        "I love how fast the food detection works.
        Just upload a photo and get nutrition details instantly."
      </p>

      <div className="mt-4 text-green-500">
        ⭐⭐⭐⭐⭐
      </div>

    </div>

    {/* Card 3 */}
    <div className="bg-white border border-green-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition">

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
          S
        </div>

        <div>
          <h3 className="font-semibold">Sneha</h3>
          <p className="text-sm text-gray-500">
            Health Conscious User
          </p>
        </div>
      </div>

      <p className="mt-5 text-gray-600">
        "The calorie estimation and nutrition breakdown help me
        make healthier food choices every day."
      </p>

      <div className="mt-4 text-green-500">
        ⭐⭐⭐⭐⭐
      </div>

    </div>
</div>

  {/* Share Experience CTA */}
  <div className="mt-14 text-center">

    <h3 className="text-2xl font-bold">
      Want to Share Your Experience?
    </h3>

    <p className="text-gray-600 mt-3">
      Upload your food, tell us about your experience, and inspire others.
    </p>

    <div className="mt-3">
  <Link
    to="/shareExp"
    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition"
  >
    Share Your Experience
    <ArrowRight size={18} />
  </Link>
</div>

  </div>
</div>
</div>
  </>
    );
}
    

export default Community;
