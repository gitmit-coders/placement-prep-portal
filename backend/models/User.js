const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentClass: { type: String, required: true },
  school: { type: String, default: "" },
  schoolCode: { type: String, default: "" }, // optional for now
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)