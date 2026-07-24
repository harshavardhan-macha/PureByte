import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not defined; using fallback auth mode");
    globalThis.__PUREBYTE_FALLBACK_MODE = true;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    globalThis.__PUREBYTE_FALLBACK_MODE = false;
  } catch (error) {
    console.warn("MongoDB connection failed, falling back to in-memory auth mode:", error.message);
    globalThis.__PUREBYTE_FALLBACK_MODE = true;
  }
};

export default connectDB;
