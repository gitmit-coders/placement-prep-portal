import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function MasterLogin() {
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
      const res = await fetch(`${BACKEND_URL}/api/master/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("master", JSON.stringify(data.master))
        navigate("/master/panel")
      } else { setError(data.message || "Login failed.") }
    } catch { setError("Cannot connect to server.") }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "380px", background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🔑</div>
          <h1 style={{ margin: "0 0 6px", fontSize: "20px", color: "white" }}>Master Login</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Platform Administrator Only</p>
        </div>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: "10px", padding: "11px", marginBottom: "16px", fontSize: "13px" }}>{error}</div>}
        <label style={{ display: "block", marginBottom: "5px", color: "#94a3b8", fontSize: "13px" }}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", padding: "11px 13px", marginBottom: "14px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
        <label style={{ display: "block", marginBottom: "5px", color: "#94a3b8", fontSize: "13px" }}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", padding: "11px 13px", marginBottom: "20px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
        <button onClick={handleLogin} disabled={loading}
          style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  )
}

export default MasterLogin