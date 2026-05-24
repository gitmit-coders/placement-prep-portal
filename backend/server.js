const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth")
const resultRoutes = require("./routes/result")
const mongoose = require("mongoose")
require("dotenv").config({ path: "./config.env" })

const app = express()

// ✅ CORS fix — exact Vercel URL + localhost for development
app.use(cors({
  origin: [
    "https://placement-prep-portal.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

// Handle preflight requests for all routes
app.options("*", cors())

app.use(express.json())

// ✅ PORT from environment — Render sets this automatically
const PORT = process.env.PORT || 5000

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB connection failed ❌", err.message))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/result", resultRoutes)

// Health check / keep-alive endpoint
app.get("/", (req, res) => {
  res.send("Backend is running 🚀")
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message)
  res.status(500).json({ message: "Something went wrong on the server." })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`)
})