const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const resultRoutes = require("./routes/result");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

const app = express();

// ✅ FIX: Render assigns a dynamic PORT via environment variable
// Hardcoded 5000 was causing Render deployment to fail/crash
const PORT = process.env.PORT || 5000;

// ✅ MongoDB connection with better error handling
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err.message);
    // Don't crash the server — log and continue
  });

// ✅ CORS: Allow your Vercel frontend + localhost for dev
const allowedOrigins = [
  "https://placement-prep-portal.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/result", resultRoutes);

console.log("Result route loaded ✅");

// Keep-alive ping endpoint (frontend pings this to prevent sleep)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Test route
app.get("/api/result/test", (req, res) => {
  res.send("Direct result test working ✅");
});

// ✅ Global error handler — prevents unhandled errors from crashing the server
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});