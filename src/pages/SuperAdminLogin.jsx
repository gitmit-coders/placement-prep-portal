import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function SuperAdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError("")
    if (!email || !password) { setError("Please enter email and password."); return }
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        // Only superadmin can access this panel
        if (data.admin.role !== "superadmin") {
          setError("Access denied. This login is for school administrators only.")
          setLoading(false)
          return
        }
        localStorage.setItem("superadmin", JSON.stringify(data.admin))
        navigate("/super-admin/panel")
      } else {
        setError(data.message || "Login failed.")
      }
    } catch {
      setError("Cannot connect to server. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "42px", marginBottom: "10px" }}>🔑</div>
          <h1 style={{ margin: "0 0 6px", fontSize: "22px", color: "white" }}>School Administrator</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
            Super Admin Login — Manage teacher accounts
          </p>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <label style={lbl}>Email Address</label>
        <input type="email" placeholder="admin@school.com" value={email}
          onChange={(e) => setEmail(e.target.value)} style={inp}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />

        <label style={lbl}>Password</label>
        <input type="password" placeholder="Enter password" value={password}
          onChange={(e) => setPassword(e.target.value)} style={inp}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />

        <button onClick={handleLogin} disabled={loading} style={btn}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#475569", fontSize: "12px" }}>
          Are you a teacher?{" "}
          <a href="/admin/login" style={{ color: "#818cf8", textDecoration: "none" }}>
            Teacher Login →
          </a>
        </p>
      </div>
    </div>
  )
}

const pageStyle = { minHeight: "100vh", background: "#0b0b12", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }
const cardStyle = { width: "100%", maxWidth: "400px", background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "36px" }
const lbl = { display: "block", marginBottom: "6px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inp = { width: "100%", padding: "12px 14px", marginBottom: "16px", borderRadius: "10px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "15px", boxSizing: "border-box", outline: "none" }
const btn = { width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer" }
const errorBox = { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: "10px", padding: "12px", marginBottom: "16px", fontSize: "14px" }

export default SuperAdminLogin