const express = require("express")
const router = express.Router()
const Result = require("../models/Result")

router.get("/test", (req, res) => {
  res.send("Result route working ✅")
})

// ── LEADERBOARD ROUTES FIRST (before /:userId) ──

// GET GLOBAL LEADERBOARD
// Logic: For each student, sum their best score per unique chapter.
// If tie on total score → higher accuracy wins. If still tie → lower time wins.
router.get("/leaderboard/all", async (req, res) => {
  try {
    const allResults = await Result.find()
    const aggregated = aggregateLeaderboard(allResults)
    res.status(200).json(aggregated)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// GET CLASS-WISE LEADERBOARD
router.get("/leaderboard/class/:studentClass", async (req, res) => {
  try {
    const allResults = await Result.find({ studentClass: req.params.studentClass })
    const aggregated = aggregateLeaderboard(allResults)
    res.status(200).json(aggregated)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// ── LEADERBOARD AGGREGATION LOGIC ──
// For each student:
//   1. Group attempts by chapter
//   2. Take best score per chapter
//   3. Sum all best scores = final score
//   4. Sort: totalScore DESC → avgAccuracy DESC → avgTime ASC
function aggregateLeaderboard(results) {
  // Group by userId
  const studentMap = {}

  for (const r of results) {
    const uid = r.userId?.toString()
    if (!uid) continue

    if (!studentMap[uid]) {
      studentMap[uid] = {
        userId: uid,
        name: r.name,
        studentClass: r.studentClass,
        // chapterKey → best result for that chapter
        chapters: {},
      }
    }

    const chapterKey = `${r.book}__${r.chapter}`
    const existing = studentMap[uid].chapters[chapterKey]

    // Keep best score per chapter; tie → better accuracy; tie → lower time
    if (
      !existing ||
      r.score > existing.score ||
      (r.score === existing.score && r.accuracy > existing.accuracy) ||
      (r.score === existing.score && r.accuracy === existing.accuracy && r.totalTime < existing.totalTime)
    ) {
      studentMap[uid].chapters[chapterKey] = {
        book: r.book,
        chapter: r.chapter,
        score: r.score,
        totalQuestions: r.totalQuestions,
        accuracy: r.accuracy,
        totalTime: r.totalTime,
      }
    }
  }

  // Build leaderboard rows
  const leaderboard = Object.values(studentMap).map((student) => {
    const chapterBests = Object.values(student.chapters)
    const totalScore = chapterBests.reduce((sum, c) => sum + c.score, 0)
    const avgAccuracy = chapterBests.length > 0
      ? Math.round(chapterBests.reduce((sum, c) => sum + c.accuracy, 0) / chapterBests.length)
      : 0
    const avgTime = chapterBests.length > 0
      ? Math.round(chapterBests.reduce((sum, c) => sum + c.totalTime, 0) / chapterBests.length)
      : 0
    const totalChapters = chapterBests.length

    return {
      userId: student.userId,
      name: student.name,
      studentClass: student.studentClass,
      totalScore,
      avgAccuracy,
      avgTime,
      totalChapters,
      chapterBests,
    }
  })

  // Sort: totalScore DESC → avgAccuracy DESC → avgTime ASC
  leaderboard.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore
    if (b.avgAccuracy !== a.avgAccuracy) return b.avgAccuracy - a.avgAccuracy
    return a.avgTime - b.avgTime
  })

  return leaderboard
}

// ── SAVE RESULT ──
router.post("/save", async (req, res) => {
  try {
    const {
      userId, name, studentClass, book, chapter,
      score, totalQuestions, totalTime, accuracy,
    } = req.body

    if (!userId || !name) {
      return res.status(400).json({ message: "userId and name are required." })
    }

    const newResult = new Result({
      userId, name, studentClass, book, chapter,
      score, totalQuestions, totalTime, accuracy,
    })

    await newResult.save()
    res.status(201).json({ message: "Result saved successfully ✅", result: newResult })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// ── GET USER RESULTS (must be last) ──
router.get("/:userId", async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router