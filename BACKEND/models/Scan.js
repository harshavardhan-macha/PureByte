import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  analysisMode: {
    type: String,
    enum: ["food_only", "label_only", "both"],
  },
  score: { type: Number, min: 0, max: 10 },
  verdict: { type: String, enum: ["Safe", "Unsafe"] },
  confidence: Number,
  flags: [String],
  ingredients: [String],
  spoilage: {
    detected: Boolean,
    score: Number,
    confidence: Number,
    flags: [String],
  },
  safety: {
    risk_level: String,
    ingredient_risk: Number,
    spoilage_risk: Number,
    combined_risk: Number,
    critical: Boolean,
    flags: [String],
  },
  ocrRawText: String,
  scannedAt: { type: Date, default: Date.now },
});

const Scan = mongoose.models.Scan || mongoose.model("Scan", ScanSchema);

export default Scan;
