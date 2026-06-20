import Header from "../components/Header";
import { Target, Eye, Lightbulb, CheckCircle, Heart, Users, ArrowRight,} from "lucide-react";
import abt from "../assets/abt.png";
function About() {
  return (
    <>
       <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
        <Header />
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-10 items-center mb-6">

        <div>
          <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
            ABOUT US
          </span>

          <h1 className="text-5xl font-bold mt-5">
            About PureByte
          </h1>

          <p className="text-gray-600 mt-6 text-lg">
            We're on a mission to make nutrition information
            accessible to everyone using the power of AI.
          </p>
        </div>

        <div className="relative flex justify-center">
          

          <img
            src={abt}
            alt="Food Bowl"
            className="relative z-10 w-[450]"
          />
        </div>

      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">

        <div className="border rounded-3xl p-8 shadow-lg border-green-200">
          <Target className="text-green-500 mb-4" size={40} />

          <h3 className="text-3xl font-bold mb-4">
            Our Mission
          </h3>

          <p className="text-gray-600">
            To empower individuals to make healthier food
            choices by providing instant, accurate,
            and AI-powered nutrition insights.
          </p>
        </div>

        <div className="bg-green-600 text-white rounded-3xl p-8 shadow-lg border-green-100 ">
          <Eye className="mb-4" size={40} />

          <h3 className="text-3xl font-bold mb-4">
            Our Vision
          </h3>

          <p>
            A world where everyone understands their food
            and lives a healthier, happier life with the
            help of smart technology.
          </p>
        </div>

      </div>

      {/* Core Values */}
      <h2 className="text-4xl font-bold mb-8">
        Our Core Values
      </h2>

      <div className="grid md:grid-cols-4 gap-6 mb-16">

        <div className="border rounded-2xl p-6 text-center shadow-green-300 border-green-200">
          <Lightbulb
            className="mx-auto text-green-500 mb-4"
            size={40}
          />
          <h4 className="font-bold text-xl mb-3">
            Innovation
          </h4>
          <p className="text-gray-500">
            We constantly innovate to bring the best AI solutions.
          </p>
        </div>

        <div className="border rounded-2xl p-6 text-center shadow-greeen-300 border-green-200">
          <CheckCircle
            className="mx-auto text-green-500 mb-4"
            size={40}
          />
          <h4 className="font-bold text-xl mb-3">
            Accuracy
          </h4>
          <p className="text-gray-500">
            We are committed to providing accurate and reliable information.
          </p>
        </div>

        <div className="border rounded-2xl p-6 text-center shadow-green-300 border-green-200">
          <Heart
            className="mx-auto text-green-500 mb-4"
            size={40}
          />
          <h4 className="font-bold text-xl mb-3">
            Health
          </h4>
          <p className="text-gray-500">
            We put health and well-being at the center of everything.
          </p>
        </div>

        <div className="border rounded-2xl p-6 text-center shadow-green-300 border-green-200">
          <Users
            className="mx-auto text-green-500 mb-4"
            size={40}
          />
          <h4 className="font-bold text-xl mb-3">
            Accessibility
          </h4>
          <p className="text-gray-500">
            We make nutrition insights simple and accessible for all.
          </p>
        </div>

      </div>

      {/* Team */}
      <h2 className="text-4xl font-bold mb-8">
        Meet Our Team
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mb-16">

        <div className="border rounded-2xl overflow-hidden shadow-sm">
          <img
            src="/member1.png"
            alt=""
            className="w-full h-64 object-cover"
          />

          <div className="p-5 text-center">
            <h4 className="font-bold text-xl">
              Arjun Kumar
            </h4>

            <p className="text-green-500 mt-2">
              Developer
            </p>
          </div>
        </div>

        <div className="border rounded-2xl overflow-hidden shadow-sm">
          <img
            src="/member2.png"
            alt=""
            className="w-full h-64 object-cover"
          />

          <div className="p-5 text-center">
            <h4 className="font-bold text-xl">
              Neha Sharma
            </h4>

            <p className="text-green-500 mt-2">
              AI Engineer
            </p>
          </div>
        </div>

        <div className="border rounded-2xl overflow-hidden shadow-sm">
          <img
            src="/member3.png"
            alt=""
            className="w-full h-64 object-cover"
          />

          <div className="p-5 text-center">
            <h4 className="font-bold text-xl">
              Rahul Verma
            </h4>

            <p className="text-green-500 mt-2">
              UI/UX Designer
            </p>
          </div>
        </div>

      </div>

      {/* CTA */}
      <div className="bg-green-600 rounded-3xl p-8 flex flex-col lg:flex-row justify-between items-center text-white">

        <div>
          <h2 className="text-3xl font-bold">
            Building a healthier future,
            one meal at a time.
          </h2>
        </div>

        <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 mt-4 lg:mt-0">
          Get Started with PureByte
          <ArrowRight size={20} />
        </button>

      </div>

    </div>
    </>
  );
}

export default About;
// function About(){
//     return(
//         <>
//        <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
//         <Header />
//         <div className="text-bold justify-between">
//             About
//         </div>
//         </>
//     );
// }
// export default About;