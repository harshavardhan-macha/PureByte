import express from "express";
import axios from "axios";
import cors from "cors";
import FormData from "form-data";
import mongoose from "mongoose";
import multer from "multer";
import Scan from "./models/Scan.js";

const app = express();

const API_VERSION = "2.1.0"; // supports food-only, label-only, or both images
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000/analyze";
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 2 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype?.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

app.use(cors());
app.use(express.json());

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection failed:", error.message));
}

app.get("/", (_req, res) => {
  res.json({ service: "PureByte API", status: "ok" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: API_VERSION, accepts: "food_image | label_image | both" });
});

app.post(
  "/scan",
  upload.fields([
    { name: "food_image", maxCount: 1 },
    { name: "label_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const foodFile = req.files?.food_image?.[0];
      const labelFile = req.files?.label_image?.[0];

      if (!foodFile && !labelFile) {
        res.status(400).json({
          error: "Provide at least one image: food_image and/or label_image",
        });
        return;
      }

      const form = new FormData();
      if (foodFile) {
        form.append("food_image", foodFile.buffer, {
          filename: foodFile.originalname || "food.jpg",
          contentType: foodFile.mimetype,
        });
      }
      if (labelFile) {
        form.append("label_image", labelFile.buffer, {
          filename: labelFile.originalname || "label.jpg",
          contentType: labelFile.mimetype,
        });
      }

      const aiResponse = await axios.post(AI_SERVICE_URL, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000,
      });

      const data = aiResponse.data;

      if (mongoose.connection.readyState === 1) {
        const scan = new Scan({
          userId: req.body?.userId || null,
          analysisMode: data.analysis_mode,
          score: data.score,
          verdict: data.verdict,
          confidence: data.confidence,
          flags: data.flags,
          ingredients: data.ingredients,
          spoilage: data.spoilage,
          safety: data.safety,
          ocrRawText: data.ocr?.raw_text,
          scannedAt: new Date(),
        });
        await scan.save();
      }

      res.json(data);
    } catch (error) {
      const upstreamMessage =
        error.response?.data?.detail ||
        (Array.isArray(error.response?.data?.detail)
          ? error.response.data.detail.map((d) => d.msg).join(", ")
          : null) ||
        error.message ||
        "Scan analysis failed";
      res.status(error.response?.status || 502).json({ error: upstreamMessage });
    }
  },
);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
});

app.listen(PORT, () => {
  console.log(`PureByte API v${API_VERSION} on port ${PORT} (food and/or label image)`);
});
