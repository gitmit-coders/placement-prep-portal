import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"
const CLASSES = ["6", "7", "8", "9", "10"]

function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", school: "", studentClass: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleRegister = async () => {
    setError("")

    // Client-side validation
    if (!form.name || !form.email || !form.password || !form.studentClass) {
      setError("Please fill in all required fields.")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        navigate("/login")
      } else {
        setError(data.message || "Registration failed. Please try again.")
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
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>📚</div>
          <h1 style={{ margin: 0, fontSize: "26px", color: "white" }}>Create Account</h1>
          <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: "14px" }}>
            Join EduExam and start practicing today
          </p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <label style={labelStyle}>Full Name *</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={form.name}
          onChange={update("name")}
          style={inputStyle}
        />

        <label style={labelStyle}>Email Address *</label>
        <input
          type="email"
          placeholder="student@school.com"
          value={form.email}
          onChange={update("email")}
          style={inputStyle}
        />
        <p style={hintStyle}>Must be a real email address — fake domains are blocked.</p>

        <label style={labelStyle}>Password *</label>
        <input
          type="password"
          placeholder="Minimum 6 characters"
          value={form.password}
          onChange={update("password")}
          style={inputStyle}
        />

        <label style={labelStyle}>Class *</label>
        <select value={form.studentClass} onChange={update("studentClass")} style={selectStyle}>
          <option value="">Select your class</option>
          {CLASSES.map((c) => (
            <option key={c} value={c}>Class {c}</option>
          ))}
        </select>

        <label style={labelStyle}>School Name (optional)</label>
        <input
          type="text"
          placeholder="Enter your school name"
          value={form.school}
          onChange={update("school")}
          style={{ ...inputStyle, marginBottom: "24px" }}
        />

        <button onClick={handleRegister} disabled={loading} style={buttonStyle}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#818cf8", fontWeight: "600", textDecoration: "none" }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: "100vh", background: "#0b0b12",
  display: "flex", justifyContent: "center", alignItems: "center", padding: "20px",
}
const cardStyle = {
  width: "100%", maxWidth: "440px",
  background: "#111827", padding: "36px",
  borderRadius: "20px", border: "1px solid #1f2937",
}
const labelStyle = {
  display: "block", marginBottom: "6px",
  color: "#94a3b8", fontSize: "13px", fontWeight: "500",
}
const inputStyle = {
  width: "100%", padding: "13px 14px", marginBottom: "18px",
  borderRadius: "10px", border: "1px solid #1f2937",
  outline: "none", background: "#1e293b", color: "white",
  fontSize: "15px", boxSizing: "border-box",
}
const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
}
const buttonStyle = {
  width: "100%", padding: "14px", borderRadius: "10px",
  border: "none", background: "#6366f1", color: "white",
  fontSize: "16px", fontWeight: "700", cursor: "pointer",
}
const errorStyle = {
  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
  color: "#f87171", borderRadius: "10px", padding: "12px 14px",
  marginBottom: "20px", fontSize: "14px",
}
const hintStyle = {
  margin: "-12px 0 18px", color: "#475569", fontSize: "12px",
}

export default Register