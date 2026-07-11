import { useState } from "react";
import { Star, Upload } from "lucide-react";

function ShareExperience() {
  const [rating, setRating] = useState(0);

  return (
    <div className=" mt-3 max-w-xl mx-auto bg-white rounded-3xl shadow-lg border border-green-100 p-8">

      <h2 className="text-3xl font-bold text-center">
        Share Your <span className="text-green-500">Experience</span>
      </h2>

      <p className="text-gray-500 text-center mt-2">
        Tell the PureByte community how AI helped you make healthier food choices.
      </p>

      <form className="mt-8 space-y-2">
        <div>
          <label className="font-medium">
            Food Name
            <span className="text-gray-400 text-sm"> (Optional)</span>
          </label>

          <input
            type="text"
            placeholder="Example: Veg Biryani"
            className="w-full mt-2 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="font-medium">
            Food Image
            <span className="text-gray-400 text-sm"> (Optional)</span>
          </label>

          <label className="mt-2 flex items-center justify-center gap-3 border-2 border-dashed border-green-300 rounded-xl p-6 cursor-pointer hover:bg-green-50 transition">

            <Upload className="text-green-500" />

            <span className="text-gray-600">
              Upload Food Image
            </span>

            <input
              type="file"
              className="hidden"
            />

          </label>
        </div>

        <div>
          <label className="font-medium">
            Rating
            <span className="text-red-500"> *</span>
          </label>

          <div className="flex gap-2 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={30}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
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
            className="w-full mt-2 border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Submit Experience
        </button>

      </form>

    </div>
  );
}

export default ShareExperience;