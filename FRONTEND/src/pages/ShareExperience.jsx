import { useState } from "react";
import { Star, Upload } from "lucide-react";
import Header from "../components/Header";
function ShareExperience() {
  const [rating, setRating] = useState(0);

  return (
    <>
      <Header />
    <div className="min-h-screen overflow-x-hidden bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">

      <div className="mx-auto w-full max-w-xl rounded-3xl border border-green-100 bg-white p-5 shadow-lg sm:p-8">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          Share Your <span className="text-green-500">Experience</span>
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500 sm:text-base">
          Tell the PureByte community how AI helped you make healthier food choices.
        </p>

        <form className="mt-6 space-y-4 sm:mt-8">
          <div>
            <label className="font-medium">
              Food Name
              <span className="text-sm text-gray-400"> (Optional)</span>
            </label>

            <input
              type="text"
              placeholder="Example: Veg Biryani"
              className="mt-2 w-full min-h-11 rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="font-medium">
              Food Image
              <span className="text-sm text-gray-400"> (Optional)</span>
            </label>

            <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-green-300 p-4 transition hover:bg-green-50 sm:p-6">
              <Upload className="text-green-500" />
              <span className="text-sm text-gray-600 sm:text-base">
                Upload Food Image
              </span>
              <input type="file" className="hidden" />
            </label>
          </div>

        
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Submit Experience
        </button>
          <div>
            <label className="font-medium">
              Rating
              <span className="text-red-500"> *</span>
            </label>


            <div className="mt-3 flex gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="inline-flex h-11 w-11 items-center justify-center"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={28}
                    className={`transition ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium">
              Your Experience
              <span className="text-red-500"> *</span>
            </label>

            <textarea
              rows="5"
              placeholder="Share your experience with PureByte..."
              className="mt-2 w-full resize-none rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="button"
            className="min-h-11 w-full rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
          >
            Submit Experience
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default ShareExperience;
