const express = require("express")
const router = express.Router()
const Master = require("../models/Master")
const School = require("../models/School")
const bcrypt = require("bcryptjs")

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

// SETUP — create master account (run once)
router.post("/setup", async (req, res) => {
  try {
    const existing = await Master.countDocuments()
    if (existing > 0) {
      return res.status(400).json({ message: "Master account already exists." })
    }
    const { name, email, password } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const master = new Master({ name, email: email.toLowerCase(), password: hashed })
    await master.save()
    res.status(201).json({ message: "Master account created." })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// GET all schools (pending + approved + rejected)
router.get("/schools", async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 }).select("-password")
    res.status(200).json(schools)
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// APPROVE school
router.put("/approve/:id", async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      { status: "approved", approvedAt: new Date() },
      { new: true }
    )
    if (!school) return res.status(404).json({ message: "School not found." })
    res.status(200).json({ message: `${school.schoolName} approved.`, school })
  } catch (err) {
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

module.exports = router