import { useEffect, useState } from "react";
import Header from "../components/Header";
import {Users,Leaf,Star,Trophy,ArrowRight,} from "lucide-react";
import {Link} from "react-router-dom";
import com from "../assets/com.png";
import { getCommunityStats } from "../lib/communityApi";

function Community(){
  const [stats, setStats] = useState({
    activeMembers: 0,
    foodsDetected: 0,
    mealsAnalyzed: 0,
    sharedExperiences: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const response = await getCommunityStats();
        if (isMounted && response?.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to load community stats", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatNumber = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M+`;
    if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K+`;
    return `${value}+`;
  };

  return (
   <>
    <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
        <Header />
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

      {/* Hero Section */}
      <div className="mb-10 grid items-center gap-8 lg:grid-cols-2 lg:mb-12 lg:gap-10">
        <div>
          <span className="inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-600">
            COMMUNITY
          </span>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Join the PureByte
            <span className="block text-green-500">Community</span>
          </h1>

          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Connect with food lovers, share your journey,
            and build healthier habits together.
          </p>
        </div>
        <div className="relative flex items-center justify-center">
          <img
            src={com}
            alt="community"
            className="h-auto w-full max-w-md object-contain lg:max-w-lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:mb-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">

        <div className="rounded-2xl border border-green-200 bg-white p-6 text-center shadow-lg sm:p-8">
          <Users className="mx-auto mb-3 text-green-500" size={34} />
          <h2 className="text-3xl font-bold text-green-500 sm:text-4xl">{loading ? "--" : formatNumber(stats.activeMembers)}</h2>
          <p className="text-gray-500 mt-2">Active Members</p>
        </div>

        <div className="bg-white border rounded-2xl p-8 text-center shadow-lg border-green-200">
          <Leaf className="mx-auto text-green-500 mb-3" size={34} />
          <h2 className="text-4xl font-bold text-green-500">{loading ? "--" : formatNumber(stats.foodsDetected)}</h2>
          <p className="text-gray-500 mt-2">Foods Detected</p>
        </div>

        <div className="bg-white border rounded-2xl p-8 text-center shadow-lg  border-green-200">
          <Star className="mx-auto text-green-500 mb-3" size={34} />
          <h2 className="text-4xl font-bold text-green-500">{loading ? "--" : formatNumber(stats.mealsAnalyzed)}</h2>
          <p className="text-gray-500 mt-2">Meals Analyzed</p>
        </div>

        <div className="bg-white border rounded-2xl p-8 text-center shadow-lg  border-green-200">
          <Trophy className="mx-auto text-green-500 mb-3" size={34} />
          <h2 className="text-4xl font-bold text-green-500">{loading ? "--" : formatNumber(stats.sharedExperiences)}</h2>
          <p className="text-gray-500 mt-2">Shared Experiences</p>
        </div>

      </div>
      
    <div className="mt-16">

  <div className="text-center mb-8 sm:mb-12">
    <h2 className="text-2xl font-bold sm:text-3xl">
      What Our Users Say
    </h2>

    <p className="text-gray-600 mt-3">
      Real experiences from people using PureByte to understand
      their food and nutrition better.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">

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

    <h3 className="text-xl font-bold sm:text-2xl">
      Want to Share Your Experience?
    </h3>

    <p className="text-gray-600 mt-3">
      Upload your food, tell us about your experience, and inspire others.
    </p>

    <div className="mt-3">
  <Link
    to="/shareExp"
    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600 sm:w-auto sm:px-8"
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
