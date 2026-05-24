const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  schoolName: { type: String, required: true },
  schoolCode: { type: String, required: true }, // links teacher to a school
  role: {
    type: String,
    enum: ["school_admin", "teacher"],
    default: "teacher",
  },
}, { timestamps: true })

module.exports = mongoose.model("Admin", adminSchema)