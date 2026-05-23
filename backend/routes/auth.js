const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const dns = require("dns").promises

// Helper: verify email domain actually exists via DNS MX lookup
// This catches fake domains like "abc@fakeemail123.com" without
// sending any actual email — fast and free.
async function isEmailDomainValid(email) {
  try {
    const domain = email.split("@")[1]
    if (!domain) return false
    const records = await dns.resolveMx(domain)
    return records && records.length > 0
  } catch {
    return false
  }
}

// Helper: basic email format check
function isValidEmailFormat(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return regex.test(email)
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, school, studentClass } = req.body

    // Validate required fields
    if (!name || !email || !password || !studentClass) {
      return res.status(400).json({ message: "All fields are required." })
    }

    // Validate email format
    if (!isValidEmailFormat(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." })
    }

    // ✅ Validate email domain exists (catches fake emails like abc@xyz123fake.com)
    const domainValid = await isEmailDomainValid(email)
    if (!domainValid) {
      return res.status(400).json({
        message: "Email domain does not exist. Please use a real email address.",
      })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      school: school?.trim(),
      studentClass,
    })

    await newUser.save()

    res.status(201).json({
      message: "Account created successfully. Please log in.",
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

    res.status(200).json({
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentClass: user.studentClass,
        school: user.school,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error. Please try again." })
  }
})

module.exports = router