import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/books"

  const handleLogin = async () => {
    setError("")
    if (!email || !password) { setError("Please enter your email and password."); return }
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate(from)
      } else {
        setError(data.message || "Login failed. Please try again.")
      }
    } catch {
      setError("Cannot connect to server. Please try again later.")
    }
    setLoading(false)
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔐</div>
          <h1 style={{ margin: 0, fontSize: "26px", color: "white" }}>Welcome Back</h1>
          <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: "14px" }}>
            Sign in to your account
          </p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <label style={lbl}>Email Address</label>
        <input type="email" placeholder="student@gmail.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={inp} />

        <label style={lbl}>Password</label>
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ ...inp, marginBottom: 0, paddingRight: "44px" }}
          />
          <button onClick={() => setShowPassword(!showPassword)}
            style={eyeBtn} type="button">
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button onClick={handleLogin} disabled={loading} style={btnStyle}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#818cf8", fontWeight: "600", textDecoration: "none" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

const pageStyle = { minHeight: "100vh", background: "#0b0b12", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }
const cardStyle = { width: "100%", maxWidth: "420px", background: "#111827", padding: "36px", borderRadius: "20px", border: "1px solid #1f2937" }
const lbl = { display: "block", marginBottom: "6px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inp = { width: "100%", padding: "13px 14px", marginBottom: "18px", borderRadius: "10px", border: "1px solid #1f2937", outline: "none", background: "#1e293b", color: "white", fontSize: "15px", boxSizing: "border-box" }
const btnStyle = { width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer" }
const errorStyle = { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px", fontSize: "14px" }
const eyeBtn = { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "4px" }

export default Login