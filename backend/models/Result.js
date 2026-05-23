const mongoose = require("mongoose")

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  studentClass: {
    type: String,
    required: true,
  },
  book: {
    type: String,
  },
  chapter: {
    type: String,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  totalTime: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    default: "Normal",   // ✅ FIX: was required:true — caused 500 error
  },
  accuracy: {
    type: Number,
    required: true,
  },
}, { timestamps: true })

module.exports = mongoose.model("Result", resultSchema)