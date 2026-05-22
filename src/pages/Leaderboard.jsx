import { useEffect, useState } from "react"

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [selectedClass, setSelectedClass] = useState("all")

  const fetchLeaderboard = () => {
    const url =
      selectedClass === "all"
        ? "http://localhost:5000/api/result/leaderboard/all"
        : `http://localhost:5000/api/result/leaderboard/class/${selectedClass}`

    fetch(url)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [selectedClass])

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b12",
        color: "white",
        padding: "40px",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>
        Leaderboard 🏆
      </h1>

      <div style={{ marginBottom: "30px" }}>
        <button onClick={() => setSelectedClass("all")} style={buttonStyle}>
          All
        </button>

        <button onClick={() => setSelectedClass("9")} style={buttonStyle}>
          Class 9
        </button>

        <button onClick={() => setSelectedClass("10")} style={buttonStyle}>
          Class 10
        </button>

        <button onClick={() => setSelectedClass("11")} style={buttonStyle}>
          Class 11
        </button>

        <button onClick={() => setSelectedClass("12")} style={buttonStyle}>
          Class 12
        </button>
      </div>

      <h2 style={{ marginBottom: "20px" }}>
        {selectedClass === "all"
          ? "Global Leaderboard"
          : `Class ${selectedClass} Leaderboard`}
      </h2>

      {leaderboard.length === 0 ? (
        <h2>No Scores Yet 🚀</h2>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {leaderboard.map((user, index) => (
            <div
              key={user._id}
              style={{
                background: "#111827",
                padding: "20px",
                borderRadius: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2>
                  #{index + 1} {user.name}
                </h2>

                <p>Class: {user.studentClass}</p>
                <p>Difficulty: {user.difficulty}</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <h2>
                  {user.score}/{user.totalQuestions}
                </h2>

                <p>Accuracy: {user.accuracy}%</p>
                <p>Time: {user.totalTime}s</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const buttonStyle = {
  marginRight: "10px",
  padding: "10px 15px",
  borderRadius: "8px",
  border: "none",
  background: "#6366f1",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
}

export default Leaderboard