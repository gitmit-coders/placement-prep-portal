function Leaderboard() {
  const leaderboard =
    JSON.parse(localStorage.getItem("leaderboard")) || []

  const sortedLeaderboard = [...leaderboard].sort(
    (a, b) => {
      if (b.score === a.score) {
        return a.totalTime - b.totalTime
      }

      return b.score - a.score
    }
  )

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
        Leaderboard 🏆
      </h1>

      {sortedLeaderboard.length === 0 ? (
        <h2>No Scores Yet 🚀</h2>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {sortedLeaderboard.map((user, index) => (
            <div
              key={index}
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

                <p>
                  Category: {user.category}
                </p>

                <p>
                  Difficulty: {user.difficulty}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <h2>
                  {user.score}/{user.total}
                </h2>

                <p>
                  Accuracy: {user.accuracy}%
                </p>

                <p>
                  Time: {user.totalTime}s
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