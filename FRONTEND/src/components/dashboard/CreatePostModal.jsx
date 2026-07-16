import { useEffect, useRef, useState } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import SegmentedTabs from "./SegmentedTabs";
import { showError } from "../../lib/toast";

const TABS = [
  { id: "camera", label: "Camera" },
  { id: "upload", label: "Upload" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";

export default function CreatePostModal({ open, onClose, onSubmit, submitting }) {
  const [mode, setMode] = useState("camera");
  const [caption, setCaption] = useState("");
  
  // Camera state
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [capturedPreview, setCapturedPreview] = useState(null);
  
  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open || mode !== "camera") {
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
  }, [open, mode]);

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
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      showError("Please select an image file.");
      return;
    }
    setUploadFile(selected);
    setUploadPreview(URL.createObjectURL(selected));
  };

  const resetCapture = () => {
    setCapturedBlob(null);
    setCapturedPreview(null);
  };

  const resetAndClose = () => {
    stopCamera();
    setMode("camera");
    setCaption("");
    setCapturedBlob(null);
    setCapturedPreview(null);
    setUploadFile(null);
    setUploadPreview(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let fileToSend = null;
    if (mode === "camera") {
      if (!capturedBlob) {
        showError("Please capture a photo first.");
        return;
      }
      fileToSend = new File([capturedBlob], "capture.jpg", { type: "image/jpeg" });
    } else {
      if (!uploadFile) {
        showError("Please upload a photo first.");
        return;
      }
      fileToSend = uploadFile;
    }

    if (!caption.trim()) {
      showError("Please write a caption for your post.");
      return;
    }

    await onSubmit(fileToSend, caption.trim());
    resetAndClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6 shadow-xl"
        style={{ backgroundColor: "var(--dash-surface)" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>
            Create post
          </h2>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <SegmentedTabs tabs={TABS} active={mode} onChange={(m) => {
            setMode(m);
            if (m !== "camera") stopCamera();
          }} />

          {mode === "camera" && (
            <div className="space-y-3">
              {cameraError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {cameraError}
                </p>
              ) : (
                <>
                  {!capturedPreview ? (
                    <div className="overflow-hidden rounded-xl border bg-black" style={{ borderColor: "var(--dash-border)" }}>
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
                      alt="Captured post"
                      className="aspect-[4/3] w-full rounded-xl border object-cover"
                      style={{ borderColor: "var(--dash-border)" }}
                    />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-2">
                    {!capturedPreview ? (
                      <button
                        type="button"
                        onClick={capturePhoto}
                        disabled={!cameraReady}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                        style={{ borderColor: "var(--dash-border)", color: "var(--dash-accent)", backgroundColor: "var(--dash-surface-muted)" }}
                      >
                        <Camera size={16} />
                        Capture photo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={resetCapture}
                        className="flex-1 rounded-xl border py-2.5 text-sm font-semibold transition hover:opacity-90"
                        style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)", backgroundColor: "var(--dash-surface-muted)" }}
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
                    alt="Uploaded post"
                    className="aspect-[4/3] w-full rounded-xl border object-cover"
                    style={{ borderColor: "var(--dash-border)" }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm font-semibold transition hover:opacity-85"
                    style={{ color: "var(--dash-accent)" }}
                  >
                    Choose a different file
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 transition hover:bg-emerald-50/20"
                  style={{ borderColor: "var(--dash-accent-soft)", color: "var(--dash-text-muted)" }}
                >
                  <Upload size={24} style={{ color: "var(--dash-accent)" }} />
                  <span className="text-sm font-semibold">Click to upload a product photo</span>
                  <span className="text-xs text-slate-400">PNG, JPG, or WEBP</span>
                </button>
              )}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Caption</label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What do you think of this product's ingredients?..."
              className={`${inputClass} resize-y`}
              style={{ borderColor: "var(--dash-border)" }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "var(--dash-accent)" }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sharing…
              </>
            ) : (
              "Share post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
