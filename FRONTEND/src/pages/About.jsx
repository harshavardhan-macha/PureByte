import Header from "../components/Header";
import { Target, Eye, Lightbulb, CheckCircle, Heart, Users, ArrowRight,} from "lucide-react";
import abt from "../assets/abt.png";
function About() {
  return (
    <>
       <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
        <Header />
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

      {/* Hero Section */}
      <div className="mb-6 grid items-center gap-8 lg:grid-cols-2 lg:gap-10">

        <div>
          <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-600">
            ABOUT US
          </span>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl lg:text-5xl">
            About PureByte
          </h1>

          <p className="mt-4 text-base text-gray-600 sm:mt-6 sm:text-lg">
            We're on a mission to make nutrition information
            accessible to everyone using the power of AI.
          </p>
        </div>

        <div className="relative flex justify-center">
          <img
            src={abt}
            alt="Food Bowl"
            className="relative z-10 h-auto w-full max-w-xs object-contain sm:max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>

      </div>

      {/* Mission & Vision */}
      <div className="mb-12 grid gap-6 sm:mb-16 md:grid-cols-2">

        <div className="rounded-3xl border border-green-200 p-6 shadow-lg sm:p-8">
          <Target className="text-green-500 mb-4" size={40} />

          <h3 className="mb-4 text-2xl font-bold sm:text-3xl">
            Our Mission
          </h3>

          <p className="text-gray-600">
            To empower individuals to make healthier food
            choices by providing instant, accurate,
            and AI-powered nutrition insights.
          </p>
        </div>

        <div className="rounded-3xl border border-green-100 bg-green-600 p-6 text-white shadow-lg sm:p-8">
          <Eye className="mb-4" size={40} />

          <h3 className="mb-4 text-2xl font-bold sm:text-3xl">
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
      <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl lg:text-4xl">
        Our Core Values
      </h2>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:mb-16 lg:grid-cols-4">

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
      <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl lg:text-4xl">
        Meet Our Team
      </h2>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:mb-16 sm:gap-8 lg:grid-cols-3">

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
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-green-600 p-6 text-white sm:p-8 lg:flex-row lg:gap-8">

        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Building a healthier future,
            one meal at a time.
          </h2>
        </div>

        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-green-600 sm:w-auto sm:px-8 sm:py-4"
        >
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