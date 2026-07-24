import Header from "../components/Header"
import {Camera,Search,Smartphone,Zap, HeartPulse, ShieldAlert, } from "lucide-react";
import {Link } from "react-router-dom";

function Features() {
  const features = [
    {
      icon: <Camera size={32}  />,
      title: "Product Scanning",
      desc: "Scan or upload a packaged food product for instant AI processing.",
    },
    {
      icon: <Search size={32} />,
      title: "OCR Ingredient Extraction",
      desc: "Automatically extracts ingredients and nutrition details from the product label using OCR.",
    },
    {
      icon: <HeartPulse size={32} />,
      title: "Personalized Health Assessment",
      desc: "Select your health conditions to receive recommendations tailored specifically to you",
    },
    {
      icon: <ShieldAlert size={32} />,
      title: "AI Risk Analysis",
      desc: "AI evaluates ingredients and highlights potential health risks based on your medical profile.",
    },
    {
      icon: <Smartphone size={32} />,
      title: "Mobile Friendly",
      desc: "Designed for quick and easy use on any device.",
    },
    {
      icon: <Zap size={32} />,
      title: "Real-Time Results",
      desc: "Receive nutrition insights in seconds.",
    },
  ];

  return (
   <>
   <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
         <Header />
    <section className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center">
        <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
          FEATURES
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-6">
          Powerful AI Features for
          <span className="text-green-500">Personalized Health Analysis</span>
        </h1>

        <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-sm sm:text-base">
          PureByte combines OCR technology and AI to extract ingredients from packaged food products and generate personalized health recommendations based on your selected medical conditions.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white border border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-lg hover:scale-101 transition"
          >
            <div className="mb-5"> 
            <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-green-200 blur-xl opacity-40"></div>
            <div className="relative w-16 h-16 rounded-full bg-white border border-green-100 flex items-center justify-center">
            <div className="text-green-500 ">
              {feature.icon}
            </div>
            </div>
            </div>
            </div>
             
            <h3 className="text-xl font-semibold mb-3 text-black">
              {feature.title}
            </h3>

            <p className="text-gray-600">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="bg-green-500 rounded-3xl p-6 sm:p-8 lg:p-10 gap-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl text-center md:text-left font-bold text-white">
              Experience the Future of Food Understanding
            </h2>

            <p className="text-green-100 mt-3">
              Start your AI-powered nutrition journey with PureByte.
            </p>
          </div>
          <Link to="/login">
          <button className="w-full min-h-11 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-green-600 transition hover:scale-105 sm:w-auto sm:text-base">
            Try PureByte Now →
          </button>
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}

export default Features;