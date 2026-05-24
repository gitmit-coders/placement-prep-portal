const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  // Who added this question
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },

  // Question location
  book: { type: String, required: true },
  chapter: { type: String, required: true },
  class: { type: String, required: true },

  // Question content
  question: { type: String, required: true },
  options: {
    type: [String],
    validate: [(arr) => arr.length === 4, "Exactly 4 options required"],
    required: true,
  },
  answer: { type: String, required: true },

}, { timestamps: true })

module.exports = mongoose.model("Question", questionSchema)