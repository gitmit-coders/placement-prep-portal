const express = require("express")
const router = express.Router()
const Result = require("../models/Result")

router.get("/test", (req, res) => {
  res.send("Result route working ✅")
})

// ✅ FIX: Leaderboard routes MUST come BEFORE /:userId
// Otherwise Express matches "leaderboard" as a userId — this was the main bug!

// GET GLOBAL LEADERBOARD
router.get("/leaderboard/all", async (req, res) => {
  try {
    const leaderboard = await Result.find()
      .sort({ score: -1, accuracy: -1, totalTime: 1 })
      .limit(100)
    res.status(200).json(leaderboard)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// GET CLASS-WISE LEADERBOARD
router.get("/leaderboard/class/:studentClass", async (req, res) => {
  try {
    const leaderboard = await Result.find({
      studentClass: req.params.studentClass,
    }).sort({ score: -1, accuracy: -1, totalTime: 1 })
    res.status(200).json(leaderboard)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// SAVE RESULT
router.post("/save", async (req, res) => {
  try {
    const {
      userId, name, studentClass, book, chapter,
      score, totalQuestions, totalTime, difficulty, accuracy,
    } = req.body

    // Basic validation
    if (!userId || !name) {
      return res.status(400).json({ message: "userId aur name required hai" })
    }

    const newResult = new Result({
      userId, name, studentClass, book, chapter,
      score, totalQuestions, totalTime, difficulty, accuracy,
    })

    await newResult.save()
    res.status(201).json({ message: "Result saved ✅", result: newResult })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// GET USER RESULTS — /:userId must be LAST
router.get("/:userId", async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }) // latest first
    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router