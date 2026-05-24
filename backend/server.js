const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth")
const resultRoutes = require("./routes/result")
const adminRoutes = require("./routes/admin")
const questionRoutes = require("./routes/questions")
const mongoose = require("mongoose")
require("dotenv").config({ path: "./config.env" })

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB failed ❌", err.message))

app.use("/api/auth", authRoutes)
app.use("/api/result", resultRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/questions", questionRoutes)

app.get("/", (req, res) => res.send("Backend is running 🚀"))

app.use((err, req, res, next) => {
  console.error("Server error:", err.message)
  res.status(500).json({ message: "Something went wrong." })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`))