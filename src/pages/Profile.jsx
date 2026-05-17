import { useMemo } from "react";

function Profile() {
  // Safe parsing helper (crash avoid karega)
  const getFromStorage = (key, fallback) => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return data || fallback;
    } catch (err) {
      return fallback;
    }
  };

  const user = getFromStorage("user", {});
  const leaderboard = getFromStorage("leaderboard", []);

  // Current user scores
  const userScores = useMemo(() => {
    if (!user?.name) return [];
    return leaderboard.filter(
      (item) => item?.name === user.name
    );
  }, [user, leaderboard]);

  // Total quizzes
  const totalQuizzes = userScores.length;

  // Best score
  const bestScore = useMemo(() => {
    if (userScores.length === 0) return 0;
    return Math.max(...userScores.map((q) => q?.score || 0));
  }, [userScores]);

  // Average accuracy
  const avgAccuracy = useMemo(() => {
    if (userScores.length === 0) return 0;

    const total = userScores.reduce(
      (acc, curr) => acc + (curr?.accuracy || 0),
      0
    );

    return Math.round(total / userScores.length);
  }, [userScores]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f172a, #111827)",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      {/* Heading */}
      <h1 style={{ textAlign: "center", marginBottom: "40px", fontSize: "40px" }}>
        👤 User Profile
      </h1>

      {/* Profile Card */}
      <div
        style={{
          background: "#1f2937",
          padding: "35px",
          borderRadius: "25px",
          maxWidth: "750px",
          margin: "auto",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* User Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "35px",
              fontWeight: "bold",
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h2 style={{ marginBottom: "10px" }}>
              {user?.name || "Guest User"}
            </h2>

            <p style={{ color: "#9ca3af" }}>
              {user?.email || "No Email Found"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Total Quizzes */}
          <div
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h3>Total Quizzes</h3>
            <h1 style={{ color: "#3b82f6" }}>{totalQuizzes}</h1>
          </div>

          {/* Best Score */}
          <div
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h3>Best Score</h3>
            <h1 style={{ color: "#22c55e" }}>{bestScore}</h1>
          </div>

          {/* Accuracy */}
          <div
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h3>Accuracy</h3>
            <h1 style={{ color: "#facc15" }}>{avgAccuracy}%</h1>
          </div>
        </div>

        {/* Quiz History */}
        <div>
          <h2
            style={{
              marginBottom: "20px",
              borderBottom: "2px solid #374151",
              paddingBottom: "10px",
            }}
          >
            📜 Quiz History
          </h2>

          {userScores.length === 0 ? (
            <p style={{ color: "#9ca3af" }}>No Quiz Attempted Yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {userScores.map((quiz, index) => (
                <div
                  key={index}
                  style={{
                    background: "#111827",
                    padding: "20px",
                    borderRadius: "15px",
                    borderLeft: "5px solid #3b82f6",
                  }}
                >
                  <h3>🧠 Quiz: {quiz?.category || "General Quiz"}</h3>

                  <p style={{ marginTop: "10px", color: "#d1d5db" }}>
                    ✅ Score: {quiz?.score || 0}
                  </p>

                  <p style={{ marginTop: "5px", color: "#d1d5db" }}>
                    🎯 Accuracy: {quiz?.accuracy || 0}%
                  </p>

                  <p style={{ marginTop: "5px", color: "#9ca3af" }}>
                    📅 Date: {quiz?.date || "Recently Played"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;