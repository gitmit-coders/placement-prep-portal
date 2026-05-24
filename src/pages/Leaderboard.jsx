import { useEffect, useState } from "react"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"
const CLASSES = ["all", "6", "7", "8", "9", "10"]

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [selectedClass, setSelectedClass] = useState("all")
  const [loading, setLoading] = useState(true)

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {} }
    catch { return {} }
  })()

  useEffect(() => {
    setLoading(true)
    const url = selectedClass === "all"
      ? `${BACKEND_URL}/api/result/leaderboard/all`
      : `${BACKEND_URL}/api/result/leaderboard/class/${selectedClass}`

    fetch(url)
      .then((res) => res.json())
      .then((data) => { setLeaderboard(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [selectedClass])

  const medals = ["🥇", "🥈", "🥉"]
  const medalColors = ["#ffd700", "#c0c0c0", "#cd7f32"]

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", padding: "40px 32px" }}>
      <h1 style={{ marginBottom: "6px", fontSize: "28px" }}>Leaderboard 🏆</h1>
      <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>
        Ranked by total score across all chapters. Same chapter attempted multiple times — only the best score counts.
      </p>

      {/* Class Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "32px", flexWrap: "wrap" }}>
        {CLASSES.map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            style={{
              padding: "9px 18px", borderRadius: "10px", cursor: "pointer",
              fontWeight: "600", fontSize: "14px", border: "none",
              background: selectedClass === cls ? "#6366f1" : "#111827",
              color: selectedClass === cls ? "white" : "#64748b",
              outline: selectedClass === cls ? "none" : "1px solid #1f2937",
            }}
          >
            {cls === "all" ? "All Classes" : `Class ${cls}`}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading rankings...</p>
      ) : leaderboard.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "#111827", borderRadius: "20px", border: "1px solid #1f2937" }}>
          <h2>No scores yet</h2>
          <p style={{ color: "#64748b" }}>Complete a quiz to appear on the leaderboard.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {leaderboard.map((student, index) => {
            const isCurrentUser = student.userId === currentUser?._id?.toString()
            return (
              <div
                key={student.userId}
                style={{
                  background: isCurrentUser ? "rgba(99,102,241,0.1)" : index < 3 ? "rgba(255,255,255,0.03)" : "#111827",
                  border: isCurrentUser
                    ? "1px solid rgba(99,102,241,0.5)"
                    : index === 0 ? "1px solid rgba(255,215,0,0.25)"
                    : index === 1 ? "1px solid rgba(192,192,192,0.2)"
                    : index === 2 ? "1px solid rgba(205,127,50,0.2)"
                    : "1px solid #1f2937",
                  borderRadius: "14px",
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {/* Rank */}
                <div style={{
                  width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0,
                  background: index < 3 ? `${medalColors[index]}18` : "#1f2937",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: index < 3 ? "22px" : "15px",
                  fontWeight: "800",
                  color: index < 3 ? medalColors[index] : "#475569",
                }}>
                  {index < 3 ? medals[index] : `#${index + 1}`}
                </div>

                {/* Name + Class */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontWeight: "700", fontSize: "16px", color: isCurrentUser ? "#a5b4fc" : "white" }}>
                    {student.name} {isCurrentUser && <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "500" }}>(You)</span>}
                  </p>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Class {student.studentClass} &nbsp;·&nbsp; {student.totalChapters} chapter{student.totalChapters !== 1 ? "s" : ""} attempted
                  </p>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: "24px", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: "0 0 2px", fontSize: "20px", fontWeight: "800", color: "white" }}>
                      {student.totalScore}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Total Score</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: "0 0 2px", fontSize: "16px", fontWeight: "700", color: "#22c55e" }}>
                      {student.avgAccuracy}%
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Avg Accuracy</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: "0 0 2px", fontSize: "16px", fontWeight: "700", color: "#94a3b8" }}>
                      {student.avgTime}s
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Avg Time</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Leaderboard