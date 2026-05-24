const mongoose = require("mongoose")

// Your personal master account — only one exists
const masterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model("Master", masterSchema)