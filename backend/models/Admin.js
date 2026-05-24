const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  schoolName: { type: String, required: true },
  role: {
    type: String,
    enum: ["superadmin", "teacher"],
    default: "teacher",
  },
}, { timestamps: true })

module.exports = mongoose.model("Admin", adminSchema)