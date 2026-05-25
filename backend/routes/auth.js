const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const dns = require("dns").promises

async function isEmailDomainValid(email) {
  try {
    const domain = email.split("@")[1]
    if (!domain) return false
    const records = await dns.resolveMx(domain)
    return records && records.length > 0
  } catch { return false }
}

function isValidEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, school, schoolCode, studentClass } = req.body

    if (!name || !email || !password || !studentClass || !schoolCode) {
      return res.status(400).json({ message: "All fields are required including school selection." })
    }
    if (!isValidEmailFormat(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." })
    }

    const domainValid = await isEmailDomainValid(email)
    if (!domainValid) {
      return res.status(400).json({ message: "Email domain does not exist. Please use a real email address." })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." })
    }

    const hashed = await bcrypt.hash(password, 10)
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      school: school || "",
      schoolCode,
      studentClass,
      status: "pending", // requires school admin approval
    })

    await newUser.save()
    res.status(201).json({
      message: "Registration submitted! Your school administrator will approve your account shortly.",
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ message: "Server error. Please try again." })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." })
    }

    // Layer 2 check — must be approved by school admin
    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your account is pending approval. Please wait for your school administrator to approve you.",
      })
    }
    if (user.status === "rejected") {
      return res.status(403).json({
        message: `Your registration was rejected. Reason: ${user.rejectedReason || "Contact your school admin."}`,
      })
    }

    res.status(200).json({
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentClass: user.studentClass,
        school: user.school,
        schoolCode: user.schoolCode,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error. Please try again." })
  }
})

module.exports = router