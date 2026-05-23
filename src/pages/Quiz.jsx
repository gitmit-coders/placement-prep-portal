import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { questions as bank } from "../data/questions"

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
  const [saveError, setSaveError] = useState(false)

  // ✅ FIX: Use refs to track score/time accurately.
  // React setState is async — inside nextQuestion(), score state
  // would show the OLD value. Refs always hold the current value.
  const scoreRef = useRef(0)
  const wrongRef = useRef(0)
  const totalTimeRef = useRef(0)
  const historyRef = useRef([])

  if (!selectedBook || !selectedChapter || questions.length === 0) {
    return (
      <div className="root">
        <style>{style}</style>
        <div className="card" style={{ textAlign: "center" }}>
          <h1>Select a Chapter First</h1>
          <p style={{ color: "#94a3b8" }}>
            Please go to the Books page and choose a chapter before starting the test.
          </p>
        </div>
      </div>
    )
  }

  // Question countdown timer
  useEffect(() => {
    if (finished || answered) return
    const interval = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(interval)
          setAnswered(true)
          setResult("Time Up!")
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [current, finished, answered])

  // Total elapsed timer
  useEffect(() => {
    if (finished) return
    const interval = setInterval(() => {
      setTotalTime((t) => {
        totalTimeRef.current = t + 1
        return t + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [finished])

  const checkAnswer = (opt) => {
    if (answered) return
    setAnswered(true)
    setSelected(opt)
    const isCorrect = opt === questions[current]?.answer
    if (isCorrect) {
      scoreRef.current += 1
      setScore(scoreRef.current)
      setResult("Correct!")
    } else {
      wrongRef.current += 1
      setWrong(wrongRef.current)
      setResult("Wrong!")
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
      // Use refs — not state — for guaranteed accurate final values
      const finalScore = scoreRef.current
      const finalWrong = wrongRef.current
      const finalTime = totalTimeRef.current
      const finalAccuracy = Math.round((finalScore / questions.length) * 100)

      setSaving(true)
      setSaveError(false)

      const currentUser = JSON.parse(localStorage.getItem("user"))

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
            score: finalScore,
            totalQuestions: questions.length,
            totalTime: finalTime,
            accuracy: finalAccuracy,
          }),
        })
        if (!response.ok) {
          console.error("Save failed with status:", response.status)
          setSaveError(true)
        }
      } catch (error) {
        console.error("Network error while saving result:", error)
        setSaveError(true)
      }

      setScore(finalScore)
      setWrong(finalWrong)
      setSaving(false)
      setFinished(true)
    }
  }

  if (saving) {
    return (
      <div className="root">
        <style>{style}</style>
        <div className="card" style={{ textAlign: "center" }}>
          <h2>Saving your result...</h2>
          <p style={{ color: "#94a3b8" }}>Please wait a moment.</p>
        </div>
      </div>
    )
  }

  if (finished) {
    const finalAccuracy = Math.round((score / questions.length) * 100)
    let performance = ""
    if (finalAccuracy >= 80) performance = "Excellent Performance!"
    else if (finalAccuracy >= 50) performance = "Good Job! Keep it up."
    else performance = "Needs Improvement. Practice more!"

    return (
      <div className="root">
        <style>{style}</style>
        <div className="card">
          <h1 style={{ marginBottom: "24px", textAlign: "center" }}>Quiz Complete!</h1>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Score</span>
              <span className="result-value">{score}/{questions.length}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Correct</span>
              <span className="result-value correct">{score}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Wrong</span>
              <span className="result-value wrong">{wrong}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Accuracy</span>
              <span className="result-value">{finalAccuracy}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Time Taken</span>
              <span className="result-value">{totalTimeRef.current}s</span>
            </div>
          </div>
          <h2 style={{ marginTop: "24px", color: "#22c55e", textAlign: "center" }}>
            {performance}
          </h2>
          {saveError ? (
            <p style={{ color: "#f87171", textAlign: "center", marginTop: "12px", fontSize: "14px" }}>
              Result could not be saved. Please check your internet connection.
            </p>
          ) : (
            <p style={{ color: "#64748b", textAlign: "center", marginTop: "12px", fontSize: "14px" }}>
              Result saved successfully. Dashboard and Leaderboard have been updated.
            </p>
          )}
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
          <p style={{ margin: "0 0 4px", fontSize: "15px", color: "#94a3b8", fontWeight: "500" }}>
            {selectedBook} — {selectedChapter}
          </p>
          <p style={{ margin: "0 0 28px", color: "#475569", fontSize: "13px" }}>
            Question {current + 1} of {questions.length}
          </p>
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
          {result && (
            <h3 style={{
              marginTop: "16px", marginBottom: "0",
              color: result === "Correct!" ? "#22c55e" : result === "Wrong!" ? "#ef4444" : "#f59e0b"
            }}>
              {result}
            </h3>
          )}
          <button className="next" onClick={nextQuestion} disabled={!answered}>
            {current === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      </div>
    </>
  )
}

const style = `
  body { margin:0; font-family: system-ui, sans-serif; background:#0b0b12; }
  .top-bar {
    position: fixed; top: 70px; right: 20px;
    background: rgba(255,255,255,0.08);
    padding: 8px 16px; border-radius: 10px;
    color: white; font-weight: 600; font-size: 14px;
    backdrop-filter: blur(10px); z-index: 100;
  }
  .root { min-height:100vh; display:flex; justify-content:center; align-items:center; padding:40px 20px; }
  .card {
    width:100%; max-width:700px;
    background:#111827; border:1px solid #1f2937;
    border-radius:20px; padding:40px; color:white; position:relative;
  }
  .q-timer {
    position:absolute; top:20px; right:20px;
    background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3);
    padding:8px 14px; border-radius:10px; font-weight:700; color:#818cf8;
  }
  .question { font-size:22px; font-weight:600; margin:0 0 28px; line-height:1.45; }
  .options { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .btn {
    padding:16px 14px; border-radius:12px; border:1px solid #1f2937;
    cursor:pointer; background:#1e293b; color:white; font-size:15px;
    text-align:left; transition:border-color 0.15s, background 0.15s;
  }
  .btn:hover:not(:disabled) { border-color:#6366f1; background:rgba(99,102,241,0.1); }
  .btn:disabled { cursor:not-allowed; }
  .btn.correct { background:rgba(22,163,74,0.2); border-color:#16a34a; color:#4ade80; }
  .btn.wrong   { background:rgba(220,38,38,0.2);  border-color:#dc2626; color:#f87171; }
  .next {
    width:100%; margin-top:20px; padding:16px; border-radius:12px;
    background:#6366f1; border:none; color:white;
    font-weight:700; font-size:16px; cursor:pointer; transition:background 0.2s;
  }
  .next:hover:not(:disabled) { background:#5154cc; }
  .next:disabled { opacity:0.4; cursor:not-allowed; }
  .result-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(120px,1fr)); gap:12px; }
  .result-item {
    background:#1e293b; border:1px solid #1f2937; border-radius:12px;
    padding:16px; display:flex; flex-direction:column; gap:6px; align-items:center;
  }
  .result-label { font-size:12px; color:#64748b; font-weight:500; }
  .result-value { font-size:24px; font-weight:700; color:white; }
  .result-value.correct { color:#22c55e; }
  .result-value.wrong   { color:#ef4444; }
`

export default Quiz