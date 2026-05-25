import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"
const CLASSES = ["6", "7", "8", "9", "10"]

function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", studentClass: "",
    schoolCode: "", schoolName: "",
  })
  const [schools, setSchools] = useState([])
  const [loadingSchools, setLoadingSchools] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/school/list`)
      .then((r) => r.json())
      .then((d) => { setSchools(Array.isArray(d) ? d : []); setLoadingSchools(false) })
      .catch(() => setLoadingSchools(false))
  }, [])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSchoolSelect = (e) => {
    const selected = schools.find((s) => s.schoolCode === e.target.value)
    if (selected) {
      setForm({ ...form, schoolCode: selected.schoolCode, schoolName: selected.schoolName })
    } else {
      setForm({ ...form, schoolCode: "", schoolName: "" })
    }
  }

  const handleRegister = async () => {
    setError("")
    if (!form.name || !form.email || !form.password || !form.studentClass || !form.schoolCode) {
      setError("Please fill in all required fields including your school."); return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long."); return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          studentClass: form.studentClass,
          school: form.schoolName,
          schoolCode: form.schoolCode,
        }),
      })
      const data = await res.json()
      if (res.ok) { navigate("/login") }
      else { setError(data.message || "Registration failed. Please try again.") }
    } catch {
      setError("Cannot connect to server. Please try again later.")
    }
    setLoading(false)
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>📚</div>
          <h1 style={{ margin: 0, fontSize: "24px", color: "white" }}>Create Account</h1>
          <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: "14px" }}>
            Join EduExam and start practicing today
          </p>
        </div>

        {/* Approval notice */}
        <div style={infoStyle}>
          ℹ️ After registering, your school teacher will review and approve your account before you can log in.
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <label style={lbl}>Full Name *</label>
        <input type="text" placeholder="Enter your full name" value={form.name} onChange={update("name")} style={inp} />

        <label style={lbl}>Email Address *</label>
        <input type="email" placeholder="student@school.com" value={form.email} onChange={update("email")} style={inp} />
        <p style={{ margin: "-12px 0 18px", color: "#475569", fontSize: "12px" }}>Must be a real email address.</p>

        <label style={lbl}>Password *</label>
        <input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={update("password")} style={inp} />

        <label style={lbl}>Class *</label>
        <select value={form.studentClass} onChange={update("studentClass")} style={inp}>
          <option value="">Select your class</option>
          {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
        </select>

        <label style={lbl}>Select Your School *</label>
        {loadingSchools ? (
          <div style={{ ...inp, color: "#64748b" }}>Loading schools...</div>
        ) : schools.length === 0 ? (
          <div style={{ ...inp, color: "#f87171", fontSize: "13px" }}>No schools registered yet.</div>
        ) : (
          <select value={form.schoolCode} onChange={handleSchoolSelect} style={inp}>
            <option value="">Select your school</option>
            {schools.map((s) => (
              <option key={s.schoolCode} value={s.schoolCode}>
                {s.schoolName} — {s.city}, {s.state}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleRegister}
          disabled={loading || !form.schoolCode}
          style={{ ...btnStyle, opacity: form.schoolCode ? 1 : 0.5, marginTop: "4px" }}
        >
          {loading ? "Submitting..." : "Submit Registration"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#818cf8", fontWeight: "600", textDecoration: "none" }}>Sign in here</Link>
        </p>
      </div>
    </div>
  )
}

const pageStyle = { minHeight: "100vh", background: "#0b0b12", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }
const cardStyle = { width: "100%", maxWidth: "440px", background: "#111827", padding: "36px", borderRadius: "20px", border: "1px solid #1f2937" }
const lbl = { display: "block", marginBottom: "6px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inp = { width: "100%", padding: "12px 14px", marginBottom: "18px", borderRadius: "10px", border: "1px solid #1f2937", outline: "none", background: "#1e293b", color: "white", fontSize: "15px", boxSizing: "border-box", cursor: "auto" }
const btnStyle = { width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer" }
const errorStyle = { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px", fontSize: "14px" }
const infoStyle = { background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px", fontSize: "13px" }

export default Register