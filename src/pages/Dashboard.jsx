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
  const history =
    JSON.parse(localStorage.getItem("history")) || []

  const data = history.map((item) => ({
    question: `Q${item.q}`,
    score: item.result === "correct" ? 1 : 0,
    time: item.timeTaken,
  }))

  const correct = history.filter(
    (item) => item.result === "correct"
  ).length

  const wrong = history.filter(
    (item) => item.result === "wrong"
  ).length

  const accuracy =
    history.length > 0
      ? Math.round((correct / history.length) * 100)
      : 0

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

      {/* STATS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Questions</h3>
          <h1>{history.length}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Correct</h3>
          <h1>{correct}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Wrong</h3>
          <h1>{wrong}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Accuracy</h3>
          <h1>{accuracy}%</h1>
        </div>
      </div>

      {/* PERFORMANCE GRAPH */}
      <div
        style={{
          background: "#111827",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Performance Graph
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#333" />

            <XAxis dataKey="question" />

            <YAxis domain={[0, 1]} />

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

      {/* TIME ANALYSIS */}
      <div
        style={{
          background: "#111827",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Time Analysis ⏱
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid stroke="#333" />

            <XAxis dataKey="question" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="time"
              fill="#8b5cf6"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const cardStyle = {
  background: "#111827",
  padding: "20px",
  borderRadius: "20px",
}

export default Dashboard