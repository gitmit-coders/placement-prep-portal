import { useEffect, useState } from "react"

// ✅ FIX: Production backend URL
const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

const CLASSES = ["all", "6", "7", "8", "9", "10"]

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [selectedClass, setSelectedClass] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    // ✅ FIX: Correct production URLs
    const url =
      selectedClass === "all"
        ? `${BACKEND_URL}/api/result/leaderboard/all`
        : `${BACKEND_URL}/api/result/leaderboard/class/${selectedClass}`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setLeaderboard(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [selectedClass])

  const getMedalColor = (index) => {
    if (index === 0) return "#ffd700"
    if (index === 1) return "#c0c0c0"
    if (index === 2) return "#cd7f32"
    return "#64748b"
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", padding: "40px" }}>
      <h1 style={{ marginBottom: "8px" }}>Leaderboard 🏆</h1>
      <p style={{ color: "#64748b", marginBottom: "28px" }}>
        Top performers — Class wise ranking
      </p>

      {/* Class Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        {CLASSES.map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            style={{
              padding: "9px 18px",
              borderRadius: "10px",
              border: selectedClass === cls ? "none" : "1px solid #1f2937",
              background: selectedClass === cls ? "#6366f1" : "#111827",
              color: selectedClass === cls ? "white" : "#94a3b8",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
          >
            {cls === "all" ? "All Classes" : `Class ${cls}`}
          </button>
        ))}
      </div>

      <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
        {selectedClass === "all" ? "Global Leaderboard" : `Class ${selectedClass} Leaderboard`}
      </h2>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading... ⏳</p>
      ) : leaderboard.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#111827", borderRadius: "20px", border: "1px solid #1f2937" }}>
          <h2 style={{ color: "white" }}>Abhi koi score nahi hai 🚀</h2>
          <p style={{ color: "#64748b" }}>Pehle quiz do, phir yahan rank dikhega!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {leaderboard.map((user, index) => (
            <div
              key={user._id || index}
              style={{
                background: index < 3 ? "rgba(99,102,241,0.08)" : "#111827",
                padding: "20px 24px",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: index === 0
                  ? "1px solid rgba(255,215,0,0.3)"
                  : index === 1
                  ? "1px solid rgba(192,192,192,0.25)"
                  : index === 2
                  ? "1px solid rgba(205,127,50,0.25)"
                  : "1px solid #1f2937",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Rank */}
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: index < 3 ? `${getMedalColor(index)}22` : "#1f2937",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "700", fontSize: "16px",
                  color: getMedalColor(index),
                  flexShrink: 0,
                }}>
                  {index < 3 ? ["🥇", "🥈", "🥉"][index] : `#${index + 1}`}
                </div>

                {/* Name + Class */}
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "17px", color: "white" }}>
                    {user.name}
                  </h2>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Class {user.studentClass} &nbsp;|&nbsp; {user.book} → {user.chapter}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ textAlign: "right" }}>
                <h2 style={{ margin: "0 0 4px", fontSize: "20px", color: "white" }}>
                  {user.score}/{user.totalQuestions}
                </h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                  {user.accuracy}% acc &nbsp;|&nbsp; {user.totalTime}s
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Leaderboard