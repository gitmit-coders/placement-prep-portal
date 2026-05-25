const express = require("express")
const router = express.Router()
const Master = require("../models/Master")
const School = require("../models/School")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

// Generate random 6-char uppercase join code e.g. "DPS4X2"
function generateJoinCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase()
}

// MASTER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const master = await Master.findOne({ email: email.toLowerCase() })
    if (!master) return res.status(400).json({ message: "Invalid credentials." })
    const match = await bcrypt.compare(password, master.password)
    if (!match) return res.status(400).json({ message: "Invalid credentials." })
    res.status(200).json({
      message: "Login successful.",
      master: { _id: master._id, name: master.name, email: master.email },
    })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// SETUP master account (one time only)
router.post("/setup", async (req, res) => {
  try {
    const existing = await Master.countDocuments()
    if (existing > 0) {
      return res.status(400).json({ message: "Master account already exists." })
    }
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required." })
    }
    const hashed = await bcrypt.hash(password, 10)
    const master = new Master({ name, email: email.toLowerCase(), password: hashed })
    await master.save()
    res.status(201).json({ message: "Master account created." })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// GET all schools
router.get("/schools", async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 }).select("-password")
    res.status(200).json(schools)
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// APPROVE school — generate schoolCode + joinCode
router.put("/approve/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
    if (!school) return res.status(404).json({ message: "School not found." })

    // Generate school code
    if (!school.schoolCode) {
      const count = await School.countDocuments({ status: "approved" })
      const prefix = school.schoolName.substring(0, 3).toUpperCase().replace(/\s/g, "")
      school.schoolCode = `${prefix}${String(count + 1).padStart(3, "0")}`
    }

    // Generate unique join code — students use this to register
    if (!school.joinCode) {
      school.joinCode = generateJoinCode()
    }

    school.status = "approved"
    school.approvedAt = new Date()
    await school.save()

    res.status(200).json({ message: `${school.schoolName} approved.`, school })
  } catch (err) {
    console.error("Approve error:", err.message)
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// REJECT school
router.put("/reject/:id", async (req, res) => {
  try {
    const { reason } = req.body
    const school = await School.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectedReason: reason || "Not specified." },
      { new: true }
    )
    if (!school) return res.status(404).json({ message: "School not found." })
    res.status(200).json({ message: `${school.schoolName} rejected.` })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// REGENERATE join code (if school wants to reset it)
router.put("/regenerate-code/:id", async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      { joinCode: generateJoinCode() },
      { new: true }
    )
    if (!school) return res.status(404).json({ message: "School not found." })
    res.status(200).json({ message: "Join code regenerated.", joinCode: school.joinCode })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

module.exports = router