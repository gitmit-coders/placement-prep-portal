import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { questions as bank } from "../data/questions"

// ✅ FIX: Use production backend URL, not localhost
const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

const TOTAL_TIME = 300

function Quiz() {
  const [searchParams] = useSearchParams()
  const selectedBook = searchParams.get("book")
  const selectedChapter = searchParams.get("chapter")

  const questions = bank.filter(
    (q) => q.book === selectedBook && q.chapter === selectedChapter
  )

  const [current, setCurrent] = useState(0)
  const [time, setTime] = useState(TOTAL_TIME)
  const [totalTime, setTotalTime] = useState(0)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState("")
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false)

  const historyRef = useRef([])

  if (!selectedBook || !selectedChapter || questions.length === 0) {
    return (
      <div className="root">
        <style>{style}</style>
        <div className="card">
          <h1>Select a chapter first 📚</h1>
          <p>Please go to Books page and choose a chapter before starting test.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    setCurrent(0)
    setTime(TOTAL_TIME)
    setScore(0)
    setTotalTime(0)
    setAnswered(false)
    setSelected(null)
    setResult("")
    setFinished(false)
    historyRef.current = []
    localStorage.removeItem("history")
  }, [])

  /* QUESTION TIMER */
  useEffect(() => {
    if (finished || answered) return
    const interval = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(interval)
          setAnswered(true)
          setResult("Time Up ⏰")
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [current, finished, answered])

  /* TOTAL TIMER */
  useEffect(() => {
    if (finished) return
    const interval = setInterval(() => {
      setTotalTime((t) => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [finished])

  const checkAnswer = (opt) => {
    if (answered) return
    setAnswered(true)
    setSelected(opt)
    const isCorrect = opt === questions[current]?.answer
    if (isCorrect) {
      setScore((s) => s + 1)
      setResult("Correct ✅")
    } else {
      setWrong((w) => w + 1)
      setResult("Wrong ❌")
    }
    historyRef.current.push({
      q: current + 1,
      result: isCorrect ? "correct" : "wrong",
      timeTaken: TOTAL_TIME - time,
    })
  }

  const nextQuestion = async () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1)
      setTime(TOTAL_TIME)
      setAnswered(false)
      setSelected(null)
      setResult("")
    } else {
      setSaving(true)
      localStorage.setItem("history", JSON.stringify(historyRef.current))

      const currentUser = JSON.parse(localStorage.getItem("user"))

      const quizResult = {
        name: currentUser?.name || "Guest",
        studentClass: currentUser?.studentClass,
        book: selectedBook,
        chapter: selectedChapter,
        score,
        total: questions.length,
        accuracy: Math.round((score / questions.length) * 100),
        totalTime,
      }

      localStorage.setItem("lastQuiz", JSON.stringify(quizResult))

      // ✅ FIX: Save to production backend
      try {
        const response = await fetch(`${BACKEND_URL}/api/result/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser?._id,
            name: currentUser?.name || "Guest",
            studentClass: currentUser?.studentClass,
            book: selectedBook,
            chapter: selectedChapter,
            score,
            totalQuestions: questions.length,
            totalTime,
            accuracy: Math.round((score / questions.length) * 100),
          }),
        })

        if (!response.ok) {
          console.error("Failed to save result:", response.status)
        } else {
          console.log("Result saved ✅")
        }
      } catch (error) {
        console.error("Save error:", error)
      }

      setSaving(false)
      setFinished(true)
    }
  }

  const accuracy = Math.round((score / questions.length) * 100)
  let performance = ""
  if (accuracy >= 80) performance = "Excellent Performance 🔥"
  else if (accuracy >= 50) performance = "Good Job 👍"
  else performance = "Need Improvement 📚"

  if (finished) {
    return (
      <div className="root">
        <style>{style}</style>
        <div className="card">
          <h1>Quiz Finished 🎉</h1>
          <h2>Score: {score}/{questions.length}</h2>
          <h3>Correct: {score} ✅</h3>
          <h3>Wrong: {wrong} ❌</h3>
          <h3>Accuracy: {accuracy}%</h3>
          <h3>Total Time: {totalTime}s</h3>
          <h2 style={{ marginTop: "20px", color: "#22c55e" }}>{performance}</h2>
          <p style={{ color: "#94a3b8", marginTop: "10px" }}>
            Dashboard aur Leaderboard update ho gaya hai ✅
          </p>
        </div>
      </div>
    )
  }

  if (saving) {
    return (
      <div className="root">
        <style>{style}</style>
        <div className="card" style={{ textAlign: "center" }}>
          <h2>Result save ho raha hai... ⏳</h2>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{style}</style>
      <div className="top-bar">Total Time: {totalTime}s</div>
      <div className="root">
        <div className="card">
          <div className="q-timer">{time}s</div>
          <h2>{selectedBook} → {selectedChapter}</h2>
          <h3>Question {current + 1} / {questions.length}</h3>
          <div className="question">{questions[current]?.question}</div>
          <div className="options">
            {questions[current]?.options?.map((opt) => {
              let cls = "btn"
              if (answered) {
                if (opt === questions[current].answer) cls += " correct"
                else if (opt === selected) cls += " wrong"
              }
              return (
                <button key={opt} className={cls} onClick={() => checkAnswer(opt)} disabled={answered}>
                  {opt}
                </button>
              )
            })}
          </div>
          <h3 style={{ marginTop: "15px" }}>{result}</h3>
          <button className="next" onClick={nextQuestion} disabled={!answered}>
            {current === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      </div>
    </>
  )
}

const style = `
  body { margin:0; font-family: Arial; background:#0b0b12; }
  .top-bar {
    position: fixed; top: 80px; right: 20px;
    background: rgba(255,255,255,0.08);
    padding: 10px 16px; border-radius: 12px;
    color: white; font-weight: bold;
    backdrop-filter: blur(10px);
  }
  .root { min-height:100vh; display:flex; justify-content:center; align-items:center; padding:40px 20px; }
  .card {
    width:100%; max-width:700px;
    background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:20px; padding:40px; color:white; position:relative;
  }
  .q-timer { position:absolute; top:20px; right:20px; background:rgba(99,102,241,0.25); padding:8px 14px; border-radius:10px; font-weight:bold; }
  .question { font-size:26px; margin:60px 0 30px; }
  .options { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .btn { padding:14px; border-radius:10px; border:none; cursor:pointer; background:#1e1e2e; color:white; font-size:16px; }
  .btn.correct { background:#16a34a; }
  .btn.wrong { background:#dc2626; }
  .next { width:100%; margin-top:20px; padding:14px; border-radius:10px; background:#6366f1; border:none; color:white; font-weight:bold; font-size:16px; cursor:pointer; }
  .next:disabled { opacity:0.5; cursor:not-allowed; }
`

export default Quiz