const express = require("express")
const router = express.Router()
const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")

// REGISTER ADMIN (superadmin only — call this once manually or via Postman)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, schoolName, role } = req.body

    if (!name || !email || !password || !schoolName) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: "Admin already exists." })
    }

    const hashed = await bcrypt.hash(password, 10)
    const admin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashed,
      schoolName,
      role: role || "teacher",
    })

    await admin.save()
    res.status(201).json({ message: "Admin registered successfully." })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// LOGIN ADMIN
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

    res.status(200).json({
      message: "Login successful.",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        schoolName: admin.schoolName,
        role: admin.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

module.exports = router