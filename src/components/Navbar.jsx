import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("user")

    alert("Logged Out 🚪")

    navigate("/login")
  }

  return (
    <nav
      style={{
        padding: "15px 30px",
        background: "#2563eb",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>Placement Prep Portal</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <Link
          style={{ color: "white", textDecoration: "none" }}
          to="/"
        >
          Home
        </Link>

        <Link
          style={{ color: "white", textDecoration: "none" }}
          to="/quiz"
        >
          Quiz
        </Link>

        <Link
          style={{ color: "white", textDecoration: "none" }}
          to="/dashboard"
        >
          Dashboard
        </Link>

        <Link
  style={{ color: "white", textDecoration: "none" }}
  to="/leaderboard"
>
  Leaderboard
</Link>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "8px",
            background: "#dc2626",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar