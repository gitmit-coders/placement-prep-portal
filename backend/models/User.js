const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentClass: { type: String, required: true },
  school: { type: String },
  schoolCode: { type: String, required: true }, // links student to a school
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)