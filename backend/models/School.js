const mongoose = require("mongoose")

const schoolSchema = new mongoose.Schema({
  // School identity
  schoolName: { type: String, required: true },
  schoolCode: { type: String, unique: true }, // auto-generated short code e.g. "DPS001"
  city: { type: String, required: true },
  state: { type: String, required: true },
  board: { type: String, enum: ["CBSE", "ICSE", "State Board", "Other"], default: "CBSE" },

  // School admin contact
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true },
  adminPhone: { type: String, required: true },
  password: { type: String, required: true },

  // Approval status — YOU control this
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedAt: { type: Date },
  rejectedReason: { type: String },

}, { timestamps: true })

// Auto-generate school code before saving
schoolSchema.pre("save", async function (next) {
  if (!this.schoolCode) {
    const count = await mongoose.model("School").countDocuments()
    const prefix = this.schoolName.substring(0, 3).toUpperCase().replace(/\s/g, "")
    this.schoolCode = `${prefix}${String(count + 1).padStart(3, "0")}`
  }
  next()
})

module.exports = mongoose.model("School", schoolSchema)