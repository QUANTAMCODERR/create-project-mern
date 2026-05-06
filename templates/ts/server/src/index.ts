import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose.set("strictQuery", true);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔌 MongoDB Connection (Safe + Production Ready)
async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.log("⚠️ No MongoDB URI provided (Running without DB)");
    return;
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB Connected");
    }

  } catch (err: any) {
    console.log("❌ MongoDB connection failed");
    console.log(err.message);
    console.log("⚠️ Running without database");
  }
}

// Call DB (non-blocking)
connectDB();

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("MERN API is running (TypeScript) 🚀");
});

// ✅ Health Route (IMPORTANT)
app.get("/health", (req: Request, res: Response) => {
  res.json({
    server: true,
    database: mongoose.connection.readyState === 1,
  });
});

// Always start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});