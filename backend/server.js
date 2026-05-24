const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth")
const resultRoutes = require("./routes/result")
const mongoose = require("mongoose")
require("dotenv").config({ path: "./config.env" })

const app = express()
const PORT = process.env.PORT || 5000

// ✅ Allow ALL origins temporarily to fix CORS issue
// We will restrict this again once the site is working
app.use(cors())

app.use(express.json())

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB failed ❌", err.message))

app.use("/api/auth", authRoutes)
app.use("/api/result", resultRoutes)

app.get("/", (req, res) => {
  res.send("Backend is running 🚀")
})

app.use((err, req, res, next) => {
  console.error("Server error:", err.message)
  res.status(500).json({ message: "Something went wrong." })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`)
})