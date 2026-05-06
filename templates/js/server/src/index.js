const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true);

const app = express();
const PORT = process.env.PORT || 5000;

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
      serverSelectionTimeoutMS: 5000
    });

    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB Connected");
    }

  } catch (err) {
    console.log("❌ MongoDB connection failed");
    console.log(err.message);
    console.log("⚠️ Running without database");
  }
}

// Call DB (non-blocking)
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Always start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});