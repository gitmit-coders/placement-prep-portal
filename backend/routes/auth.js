const express = require("express")
const router = express.Router()

const User = require("../models/User")
const bcrypt = require("bcryptjs")

// REGISTER API
router.post("/register", async (req, res) => {
  try {
    const {
  name,
  email,
  password,
  school,
  studentClass,
} = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

   const newUser = new User({
  name,
  email,
  password: hashedPassword,
  school,
  studentClass,
})

    await newUser.save()

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
})


// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      })
    }

    const isMatch = await bcrypt.compare(
  password,
  user.password
)

if (!isMatch) {
  return res.status(400).json({
    message: "Invalid email or password",
  })
}

    res.status(200).json({
  message: "Login successful",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    studentClass: user.studentClass,
  },
})
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
})


module.exports = router