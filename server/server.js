import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({ service: "PureByte Auth API", status: "ok" });
});

app.use((err, _req, res, _next) => {
  if (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
  return res.status(404).json({ message: "Not found" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Auth server running on port ${PORT}`);
      if (globalThis.__PUREBYTE_FALLBACK_MODE) {
        console.log("Auth server running in fallback mode without MongoDB");
      }
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
