import { Link } from "react-router-dom"

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b12",
        color: "white",
        padding: "50px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          Get Yourself Exam Ready
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#cbd5e1",
            marginBottom: "35px",
          }}
        >
          A smart test platform for school students to practice,
          improve, and compete through live quizzes, dashboard analytics,
          and class-wise leaderboards.
        </p>

        <div style={{ marginBottom: "50px" }}>
          <Link to="/register">
            <button style={primaryBtn}>
              Get Started
            </button>
          </Link>

          <Link to="/leaderboard">
            <button style={secondaryBtn}>
              View Leaderboard
            </button>
          </Link>
        </div>

        <h2 style={{ marginTop: "30px", marginBottom: "15px" }}>
  What We Have For Your Assessment
</h2>



        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <div style={cardStyle}>
            <h2>📝 Online Tests</h2>
            <p>
              Students can attempt aptitude, reasoning, and technical quizzes.
            </p>
          </div>

          <div style={cardStyle}>
            <h2>📊 Smart Dashboard</h2>
            <p>
              Track score, accuracy, time, and performance improvement.
            </p>
          </div>

          <div style={cardStyle}>
            <h2>🏆 Leaderboard</h2>
            <p>
              Class-wise ranking motivates students to improve daily.
            </p>
          </div>

          <div style={cardStyle}>
            <h2>🏫 For Schools</h2>
            <p>
              Helps schools improve student engagement and test performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const primaryBtn = {
  padding: "14px 24px",
  marginRight: "15px",
  borderRadius: "10px",
  border: "none",
  background: "#6366f1",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
}

const secondaryBtn = {
  padding: "14px 24px",
  borderRadius: "10px",
  border: "1px solid #6366f1",
  background: "transparent",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
}

const cardStyle = {
  background: "#111827",
  padding: "25px",
  borderRadius: "18px",
  textAlign: "left",
}

export default Home