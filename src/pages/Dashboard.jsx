import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"

function Dashboard() {
  const [results, setResults] = useState([])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    if (!user?._id) return

    fetch(`http://localhost:5000/api/result/${user._id}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.log(err))
  }, [])

  const totalQuizzes = results.length

  const bestScore =
    results.length > 0
      ? Math.max(...results.map((r) => r.score))
      : 0

  const avgAccuracy =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.accuracy, 0) /
            results.length
        )
      : 0

  const avgTime =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.totalTime, 0) /
            results.length
        )
      : 0

  const chartData = results.map((r, index) => ({
    attempt: `Attempt ${index + 1}`,
    score: r.score,
    accuracy: r.accuracy,
    time: r.totalTime,
  }))

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b12",
        color: "white",
        padding: "40px",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>
        Dashboard 📊
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Quizzes</h3>
          <h1>{totalQuizzes}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Best Score</h3>
          <h1>{bestScore}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Avg Accuracy</h3>
          <h1>{avgAccuracy}%</h1>
        </div>

        <div style={cardStyle}>
          <h3>Avg Time</h3>
          <h1>{avgTime}s</h1>
        </div>
      </div>

      <div style={boxStyle}>
        <h2 style={{ marginBottom: "20px" }}>
          Score Progress
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey="attempt" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={boxStyle}>
        <h2 style={{ marginBottom: "20px" }}>
          Accuracy Analysis
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey="attempt" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="accuracy"
              fill="#8b5cf6"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={boxStyle}>
        <h2 style={{ marginBottom: "20px" }}>
          Time Analysis ⏱
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey="attempt" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="time"
              fill="#22c55e"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

            <div style={boxStyle}>
        <h2 style={{ marginBottom: "20px" }}>
          Recent Chapter Attempts 📚
        </h2>

        {results.length === 0 ? (
          <p>No attempts yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {results.map((item, index) => (
              <div
                key={item._id || index}
                style={{
                  background: "#0b0b12",
                  padding: "18px",
                  borderRadius: "14px",
                  border: "1px solid #1f2937",
                }}
              >
                <h3>
                  {item.book || "Book"} → {item.chapter || "Chapter"}
                </h3>

                <p>Score: {item.score}/{item.totalQuestions}</p>
                <p>Accuracy: {item.accuracy}%</p>
                <p>Time: {item.totalTime}s</p>
                <p>Difficulty: {item.difficulty}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
  )
}

const cardStyle = {
  background: "#111827",
  padding: "20px",
  borderRadius: "20px",
}

const boxStyle = {
  background: "#111827",
  padding: "20px",
  borderRadius: "20px",
  marginBottom: "30px",
}

export default Dashboard