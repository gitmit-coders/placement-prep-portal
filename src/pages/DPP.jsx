import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function DPP() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const subject = searchParams.get("subject")
  const chapter = searchParams.get("chapter")

  const user = (() => { try { return JSON.parse(localStorage.getItem("user")) } catch { return null } })()

  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(null)
  const [quizMode, setQuizMode] = useState(false)

 useEffect(() => {
  if (!subject || !chapter || !user?.studentClass) return
  const cleanSubject = subject.replace(/ \(Class \d+\)/g, "").trim()
  fetch(`${BACKEND_URL}/api/questions/dpp?subject=${encodeURIComponent(cleanSubject)}&chapter=${encodeURIComponent(chapter)}&studentClass=${user.studentClass}`)
    .then((r) => r.json())
    .then((d) => { setDays(Array.isArray(d) ? d : []); setLoading(false) })
    .catch(() => setLoading(false))
}, [])

  if (!subject || !chapter) {
    return (
      <div style={page}>
        <div style={card}><h2>No chapter selected.</h2><p style={{ color: "#64748b" }}>Please go back and select a chapter.</p></div>
      </div>
    )
  }

  if (quizMode && selectedDay) {
    return <DPPQuiz day={selectedDay} subject={subject} chapter={chapter} user={user} onBack={() => { setQuizMode(false); setSelectedDay(null) }} />
  }

  return (
    <div style={page}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>
        <h1 style={{ margin: "16px 0 4px", fontSize: "26px" }}>DPP — {chapter}</h1>
        <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "14px" }}>{subject} · Class {user?.studentClass}</p>

        {loading ? <p style={{ color: "#64748b" }}>Loading DPP...</p>
          : days.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: "60px" }}>
              <h3>No DPP available yet</h3>
              <p style={{ color: "#64748b" }}>Your teacher has not added DPP for this chapter yet. Check back later.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {days.map((day) => (
                <div key={day.dayNumber} style={dayCard}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: "700", fontSize: "16px", color: "white" }}>{day.title}</p>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>{day.questions.length} question{day.questions.length !== 1 ? "s" : ""}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedDay(day); setQuizMode(true) }}
                    style={{ padding: "9px 20px", borderRadius: "9px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}
                  >
                    Start →
                  </button>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

// ── DPP QUIZ MODE ──
function DPPQuiz({ day, subject, chapter, user, onBack }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const questions = day.questions
  const q = questions[current]

  const checkAnswer = (opt) => {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    if (opt === q.answer) setScore((s) => s + 1)
  }

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1); setSelected(null); setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  if (finished) {
    const acc = Math.round((score / questions.length) * 100)
    return (
      <div style={page}>
        <div style={{ ...card, maxWidth: "600px", margin: "60px auto", textAlign: "center", padding: "40px" }}>
          <h1>DPP Complete! 🎉</h1>
          <h2 style={{ color: "#6366f1" }}>{day.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", margin: "28px 0" }}>
            <div style={rItem}><span style={rLabel}>Score</span><span style={rVal}>{score}/{questions.length}</span></div>
            <div style={rItem}><span style={rLabel}>Correct</span><span style={{ ...rVal, color: "#22c55e" }}>{score}</span></div>
            <div style={rItem}><span style={rLabel}>Accuracy</span><span style={rVal}>{acc}%</span></div>
          </div>
          <p style={{ color: acc >= 80 ? "#22c55e" : acc >= 50 ? "#f59e0b" : "#ef4444", fontWeight: "700", fontSize: "18px" }}>
            {acc >= 80 ? "Excellent! 🔥" : acc >= 50 ? "Good Job! 👍" : "Keep Practicing! 📚"}
          </p>
          <button onClick={onBack} style={{ marginTop: "20px", padding: "12px 24px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>
            Back to DPP List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={page}>
      <div style={{ ...card, maxWidth: "700px", margin: "40px auto", padding: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <p style={{ margin: 0, color: "#6366f1", fontWeight: "600", fontSize: "14px" }}>{day.title}</p>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Question {current + 1} of {questions.length}</p>
        </div>

        {/* Progress bar */}
        <div style={{ height: "4px", background: "#1f2937", borderRadius: "2px", marginBottom: "28px" }}>
          <div style={{ height: "100%", background: "#6366f1", borderRadius: "2px", width: `${((current + 1) / questions.length) * 100}%`, transition: "width 0.3s" }} />
        </div>

        <h2 style={{ margin: "0 0 24px", fontSize: "20px", lineHeight: 1.5 }}>{q.question}</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {q.options.map((opt) => {
            let bg = "#1e293b", border = "1px solid #1f2937", color = "white"
            if (answered) {
              if (opt === q.answer) { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; color = "#4ade80" }
              else if (opt === selected) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; color = "#f87171" }
            }
            return (
              <button key={opt} onClick={() => checkAnswer(opt)} disabled={answered}
                style={{ padding: "14px", borderRadius: "11px", border, background: bg, color, fontSize: "14px", cursor: answered ? "not-allowed" : "pointer", textAlign: "left", fontWeight: "500", transition: "all 0.15s" }}>
                {opt}
              </button>
            )
          })}
        </div>

        {answered && (
          <div style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "10px", background: selected === q.answer ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
            <p style={{ margin: 0, fontWeight: "600", color: selected === q.answer ? "#22c55e" : "#f87171" }}>
              {selected === q.answer ? "Correct!" : `Wrong! Correct answer: ${q.answer}`}
            </p>
          </div>
        )}

        <button onClick={next} disabled={!answered}
          style={{ width: "100%", marginTop: "18px", padding: "14px", borderRadius: "11px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "15px", cursor: answered ? "pointer" : "not-allowed", opacity: answered ? 1 : 0.4 }}>
          {current === questions.length - 1 ? "Finish DPP" : "Next Question"}
        </button>
      </div>
    </div>
  )
}

const page = { minHeight: "100vh", background: "#0b0b12", color: "white" }
const card = { background: "#111827", border: "1px solid #1f2937", borderRadius: "18px", padding: "28px" }
const dayCard = { background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }
const backBtn = { background: "none", border: "1px solid #1f2937", color: "#64748b", padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }
const rItem = { background: "#1e293b", border: "1px solid #1f2937", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }
const rLabel = { fontSize: "11px", color: "#64748b" }
const rVal = { fontSize: "22px", fontWeight: "800", color: "white" }

export default DPP