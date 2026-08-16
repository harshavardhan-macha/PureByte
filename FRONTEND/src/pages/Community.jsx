import { useEffect, useState } from "react";
import Header from "../components/Header";
import {Users,Leaf,Star,Trophy,ArrowRight,Loader2,} from "lucide-react";
import {Link} from "react-router-dom";
import com from "../assets/com.png";
import { getCommunityStats, getCommunityPosts } from "../lib/communityApi";
import CommunityPostCard from "../components/dashboard/CommunityPostCard";
import { showError } from "../lib/toast";

function Community(){
  const [stats, setStats] = useState({
    activeMembers: 0,
    foodsDetected: 0,
    mealsAnalyzed: 0,
    sharedExperiences: 0,
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

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

    const loadPosts = async () => {
      try {
        const response = await getCommunityPosts();
        if (isMounted && response?.data) {
          setPosts(Array.isArray(response.data.items) ? response.data.items : []);
        }
      } catch (error) {
        console.error("Failed to load community posts", error);
        showError("Could not load posts. Please try again later.");
      } finally {
        if (isMounted) {
          setPostsLoading(false);
        }
      }
    };

    loadStats();
    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLikeUpdate = (postId, updatedData) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: updatedData.likedByMe, likeCount: updatedData.likeCount }
          : p
      )
    );
  };

  const formatNumber = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M+`;
    if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K+`;
    return `${value}+`;
  };

  return (
   <>
    <div className="sm:h-10 h-8 bg-linear-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
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
      Community Feed
    </h2>

    <p className="text-gray-600 mt-3">
      Discover what other food lovers in the PureByte community are sharing.
      Like, comment, and connect with others on their healthy eating journey.
    </p>
  </div>

  {/* Community Posts Grid - Instagram Style */}
  <div className="mx-auto max-w-5xl">
    {postsLoading ? (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="animate-spin text-green-500" />
          <p className="text-gray-600">Loading community posts...</p>
        </div>
      </div>
    ) : posts.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No posts yet. Be the first to share your experience!</p>
        <Link
          to="/shareExp"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
        >
          Share Your Experience
          <ArrowRight size={18} />
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <CommunityPostCard 
            key={post.id} 
            post={post} 
            onLikeUpdate={handleLikeUpdate}
          />
        ))}
      </div>
    )}
  </div>

  {/* Share Experience CTA */}
  <div className="mt-16 text-center">

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
