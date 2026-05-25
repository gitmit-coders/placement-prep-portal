const mongoose = require("mongoose")

const schoolSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  schoolCode: { type: String, default: "" },
  city: { type: String, required: true },
  state: { type: String, required: true },
  board: { type: String, default: "CBSE" },
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true },
  adminPhone: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: "pending" },
  approvedAt: { type: Date },
  rejectedReason: { type: String, default: "" },
}, { timestamps: true })

module.exports = mongoose.model("School", schoolSchema)