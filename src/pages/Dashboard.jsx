import { useEffect, useState } from "react"
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend,
} from "recharts"

// ✅ FIX: Production backend URL
const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function Dashboard() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user?._id) {
      setLoading(false)
      setError("User not found. Please login again.")
      return
    }

    // ✅ FIX: Correct production URL
    fetch(`${BACKEND_URL}/api/result/${user._id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setResults(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Data load nahi ho paya. Backend check karo.")
        setLoading(false)
      })
  }, [])

  const totalQuizzes = results.length
  const bestScore = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0
  const avgAccuracy = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length)
    : 0
  const avgTime = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.totalTime, 0) / results.length)
    : 0

  // Reverse so graph shows oldest → newest (left to right)
  const chartData = [...results].reverse().map((r, index) => ({
    attempt: `#${index + 1}`,
    score: r.score,
    accuracy: r.accuracy,
    time: r.totalTime,
  }))

  if (loading) {
    return (
      <div style={pageStyle}>
        <h2 style={{ color: "white" }}>Loading dashboard... ⏳</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <h2 style={{ color: "#f87171" }}>{error}</h2>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <h1 style={{ marginBottom: "8px", color: "white" }}>Dashboard 📊</h1>
      <p style={{ color: "#64748b", marginBottom: "30px" }}>
        Aapki quiz performance ka overview
      </p>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px", marginBottom: "30px" }}>
        <div style={cardStyle}>
          <p style={labelStyle}>Total Quizzes</p>
          <h1 style={numberStyle}>{totalQuizzes}</h1>
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}>Best Score</p>
          <h1 style={numberStyle}>{bestScore}</h1>
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}>Avg Accuracy</p>
          <h1 style={numberStyle}>{avgAccuracy}%</h1>
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}>Avg Time</p>
          <h1 style={numberStyle}>{avgTime}s</h1>
        </div>
      </div>

      {results.length === 0 ? (
        <div style={{ ...boxStyle, textAlign: "center", padding: "60px 20px" }}>
          <h2 style={{ color: "white" }}>Abhi tak koi quiz nahi diya 🎯</h2>
          <p style={{ color: "#64748b" }}>Quiz do toh yahan graph dikhega!</p>
        </div>
      ) : (
        <>
          <div style={boxStyle}>
            <h2 style={chartTitle}>Score Progress</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1f2937" />
                <XAxis dataKey="attempt" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "10px" }} />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={boxStyle}>
            <h2 style={chartTitle}>Accuracy Analysis</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="#1f2937" />
                <XAxis dataKey="attempt" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "10px" }} />
                <Legend />
                <Bar dataKey="accuracy" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={boxStyle}>
            <h2 style={chartTitle}>Time Analysis ⏱</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="#1f2937" />
                <XAxis dataKey="attempt" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "10px" }} />
                <Legend />
                <Bar dataKey="time" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={boxStyle}>
            <h2 style={chartTitle}>Recent Attempts 📚</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {results.slice().reverse().map((item, index) => (
                <div key={item._id || index} style={attemptCard}>
                  <div>
                    <h3 style={{ margin: "0 0 6px", color: "white", fontSize: "16px" }}>
                      {item.book} → {item.chapter}
                    </h3>
                    <p style={mutedText}>Score: {item.score}/{item.totalQuestions} &nbsp;|&nbsp; Accuracy: {item.accuracy}% &nbsp;|&nbsp; Time: {item.totalTime}s</p>
                  </div>
                  <div style={{
                    background: item.accuracy >= 80 ? "rgba(34,197,94,0.15)" : item.accuracy >= 50 ? "rgba(234,179,8,0.15)" : "rgba(239,68,68,0.15)",
                    color: item.accuracy >= 80 ? "#22c55e" : item.accuracy >= 50 ? "#eab308" : "#ef4444",
                    padding: "6px 12px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", whiteSpace: "nowrap"
                  }}>
                    {item.accuracy}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const pageStyle = { minHeight: "100vh", background: "#0b0b12", color: "white", padding: "40px" }
const cardStyle = { background: "#111827", padding: "20px 24px", borderRadius: "16px", border: "1px solid #1f2937" }
const labelStyle = { margin: "0 0 8px", color: "#64748b", fontSize: "14px", fontWeight: "500" }
const numberStyle = { margin: 0, fontSize: "36px", fontWeight: "700", color: "white" }
const boxStyle = { background: "#111827", padding: "24px", borderRadius: "20px", marginBottom: "24px", border: "1px solid #1f2937" }
const chartTitle = { margin: "0 0 20px", fontSize: "18px", color: "white" }
const attemptCard = { background: "#0b0b12", padding: "16px 20px", borderRadius: "12px", border: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }
const mutedText = { margin: 0, color: "#64748b", fontSize: "13px" }

export default Dashboard