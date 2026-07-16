import { useEffect, useRef, useState } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import SegmentedTabs from "../../components/dashboard/SegmentedTabs";
import ScanResults from "../../components/dashboard/ScanResults";
import { analyzeText, analyzeImage, getErrorMessage } from "../../lib/mlApi";
import { showError, showSuccess } from "../../lib/toast";

const TABS = [
  { id: "text", label: "Text" },
  { id: "camera", label: "Camera" },
  { id: "upload", label: "Upload" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";

export default function ScanPage() {
  const [mode, setMode] = useState("text");
  const [productName, setProductName] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [capturedPreview, setCapturedPreview] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (mode !== "camera") {
      stopCamera();
      return;
    }

    let cancelled = false;

    const startCamera = async () => {
      setCameraError("");
      setCameraReady(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraReady(true);
      } catch {
        setCameraError("Camera access denied or unavailable. Try the Upload tab instead.");
      }
    };

    startCamera();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [mode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      setCapturedBlob(blob);
      setCapturedPreview(URL.createObjectURL(blob));
    }, "image/jpeg", 0.92);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (mode === "text" && !ingredientsText.trim()) {
      showError("Please paste an ingredient list to analyze.");
      return;
    }
    if (mode === "camera" && !capturedBlob) {
      showError("Please capture a photo of the ingredient label first.");
      return;
    }
    if (mode === "upload" && !uploadFile) {
      showError("Please select a label photo to upload first.");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (mode === "text") {
        response = await analyzeText(ingredientsText.trim(), productName.trim() || null);
      } else if (mode === "camera") {
        const file = new File([capturedBlob], "capture.jpg", { type: "image/jpeg" });
        response = await analyzeImage(file, productName.trim() || null);
      } else {
        response = await analyzeImage(uploadFile, productName.trim() || null);
      }

      setResult(response.data);
      showSuccess("Ingredients analyzed successfully!");
    } catch (err) {
      const errMsg = getErrorMessage(err, "Analysis failed. Please try again.");
      setError(errMsg);
      showError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetCapture = () => {
    setCapturedBlob(null);
    setCapturedPreview(null);
  };

  if (result) {
    return (
      <div>
        <ScanResults
          result={result}
          onClose={() => {
            setResult(null);
            resetCapture();
            setUploadFile(null);
            setUploadPreview(null);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Scan a product</h1>
      <p className="mt-1 text-sm text-slate-500">
        Paste or photograph an ingredient list to get a safety score.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Product name <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Organic Granola Bar"
            className={inputClass}
          />
        </div>

        <SegmentedTabs tabs={TABS} active={mode} onChange={setMode} />

        {mode === "text" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Ingredient list
            </label>
            <textarea
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              rows={6}
              placeholder="Paste ingredients here, e.g. Water, Sugar, High Fructose Corn Syrup, Sodium Benzoate..."
              className={`${inputClass} resize-y`}
            />
          </div>
        )}

        {mode === "camera" && (
          <div className="space-y-3">
            {cameraError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {cameraError}
              </p>
            ) : (
              <>
                {!capturedPreview ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                ) : (
                  <img
                    src={capturedPreview}
                    alt="Captured label"
                    className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-2">
                  {!capturedPreview ? (
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!cameraReady}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Camera size={16} />
                      Capture photo
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={resetCapture}
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Retake
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {mode === "upload" && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            {uploadPreview ? (
              <div className="space-y-3">
                <img
                  src={uploadPreview}
                  alt="Uploaded label"
                  className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-emerald-800 hover:text-emerald-900"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-white px-4 py-10 text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50/30"
              >
                <Upload size={24} className="text-emerald-700" />
                <span className="text-sm font-medium">Click to upload a label photo</span>
                <span className="text-xs text-slate-400">PNG, JPG, or WEBP</span>
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 text-base font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing…
            </>
          ) : (
            "Analyze ingredients"
          )}
        </button>
      </div>
    </div>
  );
}
