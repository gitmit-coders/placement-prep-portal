const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentClass: { type: String, required: true },
  school: { type: String, default: "" },
  schoolCode: { type: String, default: "" },
  // Layer 2 — manual approval by school admin
  status: { type: String, default: "pending" }, // "pending" | "approved" | "rejected"
  rejectedReason: { type: String, default: "" },
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)