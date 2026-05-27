import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import Scan from "./models/Scan.js";

const app = express();
app.use(express.json());

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000/analyze";
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
}
app.get('/', (req, res) => {
  res.send('Pure');
})

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID is ${userId}`);
});

app.post("/scan", async (req, res) => {
  try {
    const { barcode, product_name, ingredients = [], nutrients = {} } = req.body;

    const aiResponse = await axios.post(AI_SERVICE_URL, {
      barcode,
      product_name,
      ingredients,
      nutrients,
    });

    const { score, verdict, flags, matched_product } = aiResponse.data;

    if (mongoose.connection.readyState === 1) {
      const scan = new Scan({
        userId: req.body.userId || null,
        barcode,
        score,
        verdict,
        flags,
        matched_product,
        scannedAt: new Date(),
      });
      await scan.save();
    }

    res.json({ score, verdict, flags, matched_product });
  } catch (error) {
    const upstreamMessage =
      error.response?.data?.detail || error.message || "Scan analysis failed";
    res.status(502).json({ error: upstreamMessage });
  }
});

// const app = require('./app');
const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});