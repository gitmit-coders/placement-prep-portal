const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth")
const resultRoutes = require("./routes/result")
const mongoose = require("mongoose")
require("dotenv").config({ path: "./config.env" })

const app = express()
mongoose.connect(process.env.MONGO_URI, {
  family: 4
})
.then(() => {
  console.log("MongoDB Connected ✅")
})
.catch((err) => {
  console.log(err)
})

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/result", resultRoutes)


console.log("Result route loaded ✅")

app.get("/api/result/test", (req, res) => {
  res.send("Direct result test working ✅")
})


app.get("/", (req, res) => {
  res.send("Backend is running 🚀")
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})