
import { ArrowRight, ScanLine } from "lucide-react";
import mobile from "../assets/mobile.png";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function Hero() {
  const { isAuthenticated } = useAuthContext();
  const scanLink = isAuthenticated ? "/scan" : "/login";

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8 lg:py-16">
      <div className="w-full max-w-xl text-center lg:text-left">
        <p className="text-sm font-semibold text-green-500 sm:text-base">
          AI Powered Food Quality Detection
        </p>

        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-[clamp(2.25rem,4vw,3.5rem)]">
          Eat Smart,
          <br />
          <span className="text-green-500">Live Better.</span>
        </h1>

        <p className="mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
          PureByte helps you analyze food quality and nutritional value
          using AI technology.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
          <Link to={scanLink} className="w-full sm:w-auto">
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto sm:text-base"
            >
              <ScanLine size={20} />
              Scan your food
            </button>
          </Link>

          <Link to="/features" className="w-full sm:w-auto">
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-green-600 bg-white px-5 py-3 text-sm font-semibold text-green-600 transition hover:bg-green-50 sm:w-auto sm:text-base"
            >
              Explore Features
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      <div className="flex w-full max-w-xs justify-center sm:max-w-sm lg:max-w-md lg:flex-shrink-0">
        <img
          src={mobile}
          alt="PureByte mobile app preview"
          className="h-auto w-full max-w-[240px] object-contain sm:max-w-[280px] md:max-w-[320px] lg:max-w-[380px]"
        />
      </div>
    </section>
  );
}

export default Hero;
