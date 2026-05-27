const express = require("express")
const router = express.Router()
const Admin = require("../models/Admin")
const School = require("../models/School")
const bcrypt = require("bcryptjs")

// REGISTER (used by school admin to create teacher accounts)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, schoolName, schoolCode, role } = req.body
    if (!name || !email || !password || !schoolName || !schoolCode) {
      return res.status(400).json({ message: "All fields are required." })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." })
    }
    const existing = await Admin.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." })
    }
    const hashed = await bcrypt.hash(password, 10)
    const admin = new Admin({
      name, email: email.toLowerCase(),
      password: hashed, schoolName, schoolCode,
      role: role || "teacher",
    })
    await admin.save()
    res.status(201).json({ message: "Account created successfully." })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// LOGIN (teacher login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password." })
    }

    const match = await bcrypt.compare(password, admin.password)
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password." })
    }

    // ✅ FIX: Check if school is still approved
    const schoolActive = await School.findOne({
      schoolCode: admin.schoolCode,
      status: "approved",
    })
    if (!schoolActive) {
      return res.status(403).json({
        message: "Your school is no longer active on this platform. Please contact the platform administrator.",
      })
    }

    res.status(200).json({
      message: "Login successful.",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        schoolName: admin.schoolName,
        schoolCode: admin.schoolCode,
        role: admin.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// GET all teachers for a school
router.get("/teachers", async (req, res) => {
  try {
    const { schoolName } = req.query
    const filter = { role: "teacher" }
    if (schoolName) filter.schoolName = schoolName
    const teachers = await Admin.find(filter).select("-password").sort({ createdAt: -1 })
    res.status(200).json(teachers)
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// DELETE teacher account
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Account not found." })
    res.status(200).json({ message: "Teacher account deleted." })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

module.exports = router