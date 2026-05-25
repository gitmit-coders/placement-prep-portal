const express = require("express")
const router = express.Router()
const School = require("../models/School")
const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")

// SCHOOL REGISTER
router.post("/register", async (req, res) => {
  try {
    const { schoolName, city, state, board, adminName, adminEmail, adminPhone, password } = req.body

    if (!schoolName || !city || !state || !adminName || !adminEmail || !adminPhone || !password) {
      return res.status(400).json({ message: "All fields are required." })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." })
    }

    const existing = await School.findOne({ adminEmail: adminEmail.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: "A school with this email already exists." })
    }

    const hashed = await bcrypt.hash(password, 10)
    const school = new School({
      schoolName, city, state,
      board: board || "CBSE",
      adminName,
      adminPhone,
      adminEmail: adminEmail.toLowerCase(),
      password: hashed,
      status: "pending",
    })
    await school.save()

    res.status(201).json({
      message: "Registration submitted successfully. You will be notified once approved.",
    })
  } catch (err) {
    console.error("School register error:", err.message)
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// SCHOOL LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." })
    }

    const school = await School.findOne({ adminEmail: email.toLowerCase() })
    if (!school) {
      return res.status(400).json({ message: "Invalid email or password." })
    }
    if (school.status === "pending") {
      return res.status(403).json({ message: "Your registration is pending approval. Please wait." })
    }
    if (school.status === "rejected") {
      return res.status(403).json({ message: `Registration rejected. Reason: ${school.rejectedReason || "Not specified."}` })
    }

    const match = await bcrypt.compare(password, school.password)
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password." })
    }

    res.status(200).json({
      message: "Login successful.",
      school: {
        _id: school._id,
        schoolName: school.schoolName,
        schoolCode: school.schoolCode,
        adminName: school.adminName,
        adminEmail: school.adminEmail,
        city: school.city,
        state: school.state,
        board: school.board,
      },
    })
  } catch (err) {
    console.error("School login error:", err.message)
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// GET approved schools list (for student registration dropdown)
router.get("/list", async (req, res) => {
  try {
    const schools = await School.find({ status: "approved" })
      .select("schoolName schoolCode city state board")
      .sort({ schoolName: 1 })
    res.status(200).json(schools)
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// ADD TEACHER (by school admin)
router.post("/add-teacher", async (req, res) => {
  try {
    const { schoolCode, schoolName, name, email, password } = req.body
    if (!schoolCode || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." })
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: "A teacher with this email already exists." })
    }

    const hashed = await bcrypt.hash(password, 10)
    const teacher = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashed,
      schoolName,
      schoolCode,
      role: "teacher",
    })
    await teacher.save()
    res.status(201).json({ message: "Teacher account created successfully." })
  } catch (err) {
    console.error("Add teacher error:", err.message)
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// GET teachers of a school
router.get("/teachers/:schoolCode", async (req, res) => {
  try {
    const teachers = await Admin.find({ schoolCode: req.params.schoolCode })
      .select("-password")
      .sort({ createdAt: -1 })
    res.status(200).json(teachers)
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// DELETE teacher
router.delete("/teacher/:id", async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Teacher not found." })
    res.status(200).json({ message: "Teacher deleted." })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

module.exports = router