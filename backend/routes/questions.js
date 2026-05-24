const express = require("express")
const router = express.Router()
const Question = require("../models/Question")

// GET all questions (optionally filter by book/chapter/class)
router.get("/", async (req, res) => {
  try {
    const filter = {}
    if (req.query.book) filter.book = req.query.book
    if (req.query.chapter) filter.chapter = req.query.chapter
    if (req.query.class) filter.class = req.query.class

    const questions = await Question.find(filter).sort({ createdAt: -1 })
    res.status(200).json(questions)
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// GET questions by book+chapter (used by Quiz page)
router.get("/fetch", async (req, res) => {
  try {
    const { book, chapter } = req.query
    if (!book || !chapter) {
      return res.status(400).json({ message: "book and chapter required." })
    }
    const questions = await Question.find({ book, chapter })
    res.status(200).json(questions)
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// ADD single question
router.post("/add", async (req, res) => {
  try {
    const { addedBy, schoolName, book, chapter, class: cls, question, options, answer } = req.body

    if (!book || !chapter || !cls || !question || !options || !answer || !addedBy || !schoolName) {
      return res.status(400).json({ message: "All fields are required." })
    }
    if (options.length !== 4) {
      return res.status(400).json({ message: "Exactly 4 options required." })
    }
    if (!options.includes(answer)) {
      return res.status(400).json({ message: "Answer must be one of the options." })
    }

    const newQ = new Question({ addedBy, schoolName, book, chapter, class: cls, question, options, answer })
    await newQ.save()
    res.status(201).json({ message: "Question added successfully.", question: newQ })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// BULK ADD questions (from Excel import)
router.post("/bulk-add", async (req, res) => {
  try {
    const { questions, addedBy, schoolName } = req.body

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "No questions provided." })
    }

    // Validate each question
    const errors = []
    const valid = []

    questions.forEach((q, i) => {
      if (!q.book || !q.chapter || !q.class || !q.question || !q.answer) {
        errors.push(`Row ${i + 2}: Missing required fields.`)
        return
      }
      const opts = [q.option1, q.option2, q.option3, q.option4]
      if (opts.some((o) => !o)) {
        errors.push(`Row ${i + 2}: All 4 options required.`)
        return
      }
      if (!opts.includes(q.answer)) {
        errors.push(`Row ${i + 2}: Answer must match one of the 4 options.`)
        return
      }
      valid.push({
        addedBy,
        schoolName,
        book: q.book,
        chapter: q.chapter,
        class: q.class,
        question: q.question,
        options: opts,
        answer: q.answer,
      })
    })

    if (valid.length > 0) {
      await Question.insertMany(valid)
    }

    res.status(201).json({
      message: `${valid.length} question(s) imported successfully.`,
      errors,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

// EDIT question
router.put("/edit/:id", async (req, res) => {
  try {
    const { book, chapter, class: cls, question, options, answer } = req.body

    if (options && options.length !== 4) {
      return res.status(400).json({ message: "Exactly 4 options required." })
    }
    if (options && answer && !options.includes(answer)) {
      return res.status(400).json({ message: "Answer must be one of the options." })
    }

    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { book, chapter, class: cls, question, options, answer },
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
    res.status(200).json({ message: "Question deleted successfully." })
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message })
  }
})

module.exports = router