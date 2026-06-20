import { useEffect, useRef, useState } from "react";

function FoodScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const nutrition ={
    Food:"pizza", 
    Calories: 285,
    Protein: "12g",
    Carbs:"36g",
    fat:"10g",

  }

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access denied:", error);
      }
    };

    startCamera();
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Scan Your Food
      </h1>

      {/* Camera Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md rounded-xl shadow-lg"
      />

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Capture Button */}
      <button
        onClick={capturePhoto}
        className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Capture Food
      </button>

      {/* Captured Image */}
      {capturedImage && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">
            Captured Food Image
          </h2>

          <img
            src={capturedImage}
            alt="Captured Food"
            className="max-w-md rounded-xl shadow-lg"
          />
          
          <div className="mt-6 w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Nutrition Details
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Food</span>
          <span>{nutrition.Food}</span>
        </div>

        <div className="flex justify-between">
          <span>Calories</span>
          <span>{nutrition.Calories} kcal</span>
        </div>

        <div className="flex justify-between">
          <span>Protein</span>
          <span>{nutrition.Protein}</span>
        </div>

        <div className="flex justify-between">
          <span>Carbs</span>
          <span>{nutrition.Carbs}</span>
        </div>

        <div className="flex justify-between">
          <span>Fat</span>
          <span>{nutrition.fat}</span>
        </div>
      </div>
    </div>
 </div>
      )}
      
    </div>
  );
}

export default FoodScanner;