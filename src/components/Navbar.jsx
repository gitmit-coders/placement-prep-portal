import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.removeItem("user")

    alert("Logged Out 🚪")

    navigate("/login")
  }

  return (
    <nav
      style={{
        padding: "15px 30px",
        background: "#111827",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #1f2937",
      }}
    >
      <h2
        style={{
          color: "#6366f1",
        }}
      >
        Placement Prep Portal
      </h2>

      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
        }}
      >
        <Link style={linkStyle} to="/">
          Home
        </Link>

        <Link style={linkStyle} to="/quiz">
          Quiz
        </Link>

        <Link style={linkStyle} to="/dashboard">
          Dashboard
        </Link>

        <Link style={linkStyle} to="/profile">
  Profile
</Link>


        <Link style={linkStyle} to="/leaderboard">
          Leaderboard
        </Link>

        {!user ? (
          <>
            <Link style={linkStyle} to="/login">
              Login
            </Link>

            <Link style={linkStyle} to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span
              style={{
                color: "#cbd5e1",
                fontWeight: "bold",
              }}
            >
              {user.name}
            </span>

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
          </>
        )}
      </div>
    </nav>
  )
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
}

export default Navbar