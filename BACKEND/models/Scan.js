import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  barcode: String,
  matched_product: String,
  score: { type: Number, min: 0, max: 100 },
  verdict: String,
  flags: [String],
  scannedAt: { type: Date, default: Date.now },
});

const Scan = mongoose.models.Scan || mongoose.model("Scan", ScanSchema);

export default Scan;
