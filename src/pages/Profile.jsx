import { useEffect, useState } from "react"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function Profile() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {} }
    catch { return {} }
  })()

  useEffect(() => {
    if (!user?._id) { setLoading(false); return }

    fetch(`${BACKEND_URL}/api/result/${user._id}`)
      .then((res) => res.json())
      .then((data) => { setResults(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const totalQuizzes = results.length
  const bestScore = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0
  const avgAccuracy = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length)
    : 0

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        {/* Avatar + Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
          <div style={avatarStyle}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: "22px", color: "white" }}>
              {user?.name || "Guest User"}
            </h2>
            <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: "14px" }}>
              {user?.email || "No email found"}
            </p>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              Class {user?.studentClass || "—"} &nbsp;|&nbsp; {user?.school || "School not set"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: "14px", marginBottom: "36px" }}>
          <div style={statCard}>
            <p style={statLabel}>Total Quizzes</p>
            <h1 style={{ ...statNum, color: "#6366f1" }}>{loading ? "..." : totalQuizzes}</h1>
          </div>
          <div style={statCard}>
            <p style={statLabel}>Best Score</p>
            <h1 style={{ ...statNum, color: "#22c55e" }}>{loading ? "..." : bestScore}</h1>
          </div>
          <div style={statCard}>
            <p style={statLabel}>Avg Accuracy</p>
            <h1 style={{ ...statNum, color: "#f59e0b" }}>{loading ? "..." : `${avgAccuracy}%`}</h1>
          </div>
        </div>

        {/* Quiz History */}
        <h2 style={{ margin: "0 0 20px", fontSize: "18px", color: "white", borderBottom: "1px solid #1f2937", paddingBottom: "12px" }}>
          Quiz History
        </h2>

        {loading ? (
          <p style={{ color: "#64748b" }}>Loading history...</p>
        ) : results.length === 0 ? (
          <p style={{ color: "#64748b" }}>No quizzes attempted yet. Take your first quiz!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {results.map((quiz, index) => (
              <div key={quiz._id || index} style={historyCard}>
                <div>
                  <h3 style={{ margin: "0 0 6px", fontSize: "15px", color: "white" }}>
                    {quiz.book} — {quiz.chapter}
                  </h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Score: {quiz.score}/{quiz.totalQuestions} &nbsp;|&nbsp;
                    Accuracy: {quiz.accuracy}% &nbsp;|&nbsp;
                    Time: {quiz.totalTime}s
                  </p>
                </div>
                <div style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  background: quiz.accuracy >= 80
                    ? "rgba(34,197,94,0.12)"
                    : quiz.accuracy >= 50
                    ? "rgba(245,158,11,0.12)"
                    : "rgba(239,68,68,0.12)",
                  color: quiz.accuracy >= 80 ? "#22c55e"
                    : quiz.accuracy >= 50 ? "#f59e0b" : "#ef4444",
                }}>
                  {quiz.accuracy}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0b0b12",
  padding: "40px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
}
const cardStyle = {
  width: "100%",
  maxWidth: "720px",
  background: "#111827",
  border: "1px solid #1f2937",
  borderRadius: "20px",
  padding: "36px",
  color: "white",
}
const avatarStyle = {
  width: "80px", height: "80px", borderRadius: "50%",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "32px", fontWeight: "800", color: "white", flexShrink: 0,
}
const statCard = {
  background: "#0b0b12", border: "1px solid #1f2937",
  borderRadius: "14px", padding: "18px", textAlign: "center",
}
const statLabel = { margin: "0 0 8px", color: "#64748b", fontSize: "13px", fontWeight: "500" }
const statNum = { margin: 0, fontSize: "32px", fontWeight: "800" }
const historyCard = {
  background: "#0b0b12", border: "1px solid #1f2937",
  borderRadius: "12px", padding: "16px 20px",
  display: "flex", justifyContent: "space-between",
  alignItems: "center", gap: "12px",
}

export default Profile