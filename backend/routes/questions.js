const express = require("express")
const router = express.Router()
const Question = require("../models/Question")

// GET DPP questions for a student
// Usage: /api/questions/dpp?subject=Mathematics&chapter=Real Numbers&studentClass=10
router.get("/dpp", async (req, res) => {
  try {
    const { subject, chapter, studentClass } = req.query
    if (!subject || !chapter || !studentClass) {
      return res.status(400).json({ message: "subject, chapter, and studentClass required." })
    }

    // Get all DPP days for this chapter+class, grouped by dayNumber
    const questions = await Question.find({ type: "dpp", subject, chapter, studentClass })
      .sort({ dayNumber: 1, createdAt: 1 })

    // Group by dayNumber
    const grouped = {}
    for (const q of questions) {
      const day = q.dayNumber
      if (!grouped[day]) {
        grouped[day] = {
          dayNumber: day,
          title: q.title || `DPP Day ${day}`,
          questions: [],
        }
      }
      grouped[day].questions.push(q)
    }

    const days = Object.values(grouped).sort((a, b) => a.dayNumber - b.dayNumber)
    res.status(200).json(days)
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// GET all DPP questions for admin panel (by school)
router.get("/admin-list", async (req, res) => {
  try {
    const { schoolName, subject, chapter, studentClass } = req.query
    const filter = { type: "dpp" }
    if (schoolName) filter.schoolName = schoolName
    if (subject) filter.subject = subject
    if (chapter) filter.chapter = chapter
    if (studentClass) filter.studentClass = studentClass

    const questions = await Question.find(filter).sort({ studentClass: 1, subject: 1, chapter: 1, dayNumber: 1 })
    res.status(200).json(questions)
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// ADD single DPP question
router.post("/add", async (req, res) => {
  try {
    const { addedBy, schoolName, subject, chapter, studentClass, dayNumber, title, question, options, answer } = req.body

    if (!addedBy || !schoolName || !subject || !chapter || !studentClass || !dayNumber || !question || !options || !answer) {
      return res.status(400).json({ message: "All fields are required." })
    }
    if (options.length !== 4) return res.status(400).json({ message: "Exactly 4 options required." })
    if (!options.includes(answer)) return res.status(400).json({ message: "Answer must match one of the 4 options." })

    const newQ = new Question({ addedBy, schoolName, subject, chapter, studentClass, dayNumber, title: title || `DPP Day ${dayNumber}`, question, options, answer, type: "dpp" })
    await newQ.save()
    res.status(201).json({ message: "DPP question added successfully.", question: newQ })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// BULK ADD from Excel
router.post("/bulk-add", async (req, res) => {
  try {
    const { questions, addedBy, schoolName } = req.body
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "No questions provided." })
    }

    const errors = []
    const valid = []

    questions.forEach((q, i) => {
      const row = i + 2
      if (!q.subject || !q.chapter || !q.studentClass || !q.dayNumber || !q.question || !q.answer) {
        errors.push(`Row ${row}: Missing required fields (subject, chapter, studentClass, dayNumber, question, answer).`)
        return
      }
      const opts = [q.option1, q.option2, q.option3, q.option4]
      if (opts.some((o) => !o)) { errors.push(`Row ${row}: All 4 options required.`); return }
      if (!opts.includes(String(q.answer))) { errors.push(`Row ${row}: Answer must match one of the 4 options exactly.`); return }

      valid.push({
        addedBy, schoolName, type: "dpp",
        subject: q.subject, chapter: q.chapter,
        studentClass: String(q.studentClass),
        dayNumber: Number(q.dayNumber),
        title: q.title || `DPP Day ${q.dayNumber}`,
        question: q.question,
        options: opts,
        answer: String(q.answer),
      })
    })

    if (valid.length > 0) await Question.insertMany(valid)
    res.status(201).json({ message: `${valid.length} DPP question(s) imported successfully.`, errors })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// EDIT question
router.put("/edit/:id", async (req, res) => {
  try {
    const { subject, chapter, studentClass, dayNumber, title, question, options, answer } = req.body
    if (options && options.length !== 4) return res.status(400).json({ message: "Exactly 4 options required." })
    if (options && answer && !options.includes(answer)) return res.status(400).json({ message: "Answer must be one of the options." })

    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { subject, chapter, studentClass, dayNumber, title, question, options, answer },
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: "Question not found." })
    res.status(200).json({ message: "Question updated.", question: updated })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// DELETE question
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Question not found." })
    res.status(200).json({ message: "Question deleted." })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

module.exports = router