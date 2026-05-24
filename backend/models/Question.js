const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  // Who added
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  schoolName: { type: String, required: true },

  // Type: dpp only (pyq stays in frontend static file)
  type: { type: String, enum: ["dpp"], default: "dpp" },

  // Location
  subject: { type: String, required: true },   // e.g. "Mathematics"
  chapter: { type: String, required: true },   // e.g. "Real Numbers"
  studentClass: { type: String, required: true }, // e.g. "10"

  // DPP specific
  dayNumber: { type: Number, required: true },  // Day 1, Day 2...
  title: { type: String, default: "" },         // e.g. "DPP Day 1 - Basic Concepts"

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