import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"
const CLASSES = ["6", "7", "8", "9", "10"]

function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    studentClass: "", schoolCode: "", schoolName: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [schools, setSchools] = useState([])
  const [loadingSchools, setLoadingSchools] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
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
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.studentClass || !form.schoolCode) {
      setError("Please fill in all required fields."); return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please check and try again."); return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, password: form.password,
          studentClass: form.studentClass, school: form.schoolName, schoolCode: form.schoolCode,
        }),
      })
      const data = await res.json()
      if (res.ok) { setSuccess(true) }
      else { setError(data.message || "Registration failed.") }
    } catch {
      setError("Cannot connect to server. Please try again.")
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ color: "white", margin: "0 0 12px" }}>Registration Submitted!</h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: "8px" }}>
            Your account has been created successfully.
          </p>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "24px" }}>
            Your school administrator will review and approve your account before you can login.
          </p>
          <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "12px", padding: "14px 18px", marginBottom: "24px" }}>
            <p style={{ margin: 0, color: "#a5b4fc", fontSize: "13px" }}>
              📌 Contact your class teacher or school admin to get approved quickly.
            </p>
          </div>
          <button onClick={() => navigate("/login")}
            style={{ padding: "12px 28px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>📚</div>
          <h1 style={{ margin: 0, fontSize: "24px", color: "white" }}>Create Account</h1>
          <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: "14px" }}>
            Join and start practicing today
          </p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <label style={lbl}>Full Name *</label>
        <input type="text" placeholder="Enter your full name"
          value={form.name} onChange={update("name")} style={inp} />

        <label style={lbl}>Email Address *</label>
        <input type="email" placeholder="student@gmail.com"
          value={form.email} onChange={update("email")} style={inp} />

        {/* Password with show/hide */}
        <label style={lbl}>Password *</label>
        <div style={{ position: "relative", marginBottom: "18px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={update("password")}
            style={{ ...inp, marginBottom: 0, paddingRight: "44px" }}
          />
          <button onClick={() => setShowPassword(!showPassword)}
            style={eyeBtn} type="button">
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Confirm Password */}
        <label style={lbl}>Confirm Password *</label>
        <div style={{ position: "relative", marginBottom: "18px" }}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            style={{
              ...inp, marginBottom: 0, paddingRight: "44px",
              borderColor: form.confirmPassword && form.password !== form.confirmPassword ? "#ef4444" : "#1f2937",
            }}
          />
          <button onClick={() => setShowConfirm(!showConfirm)}
            style={eyeBtn} type="button">
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>
        {form.confirmPassword && form.password !== form.confirmPassword && (
          <p style={{ margin: "-10px 0 14px", color: "#f87171", fontSize: "12px" }}>
            Passwords do not match.
          </p>
        )}
        {form.confirmPassword && form.password === form.confirmPassword && form.password.length >= 6 && (
          <p style={{ margin: "-10px 0 14px", color: "#22c55e", fontSize: "12px" }}>
            ✓ Passwords match.
          </p>
        )}

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

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
          <p style={{ margin: 0, color: "#fbbf24", fontSize: "13px" }}>
            ⏳ After registering, your school admin will approve your account before you can login.
          </p>
        </div>

        <button onClick={handleRegister} disabled={loading} style={btnStyle}>
          {loading ? "Creating account..." : "Register"}
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

const pageStyle = { minHeight: "100vh", background: "#0b0b12", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }
const cardStyle = { width: "100%", maxWidth: "440px", background: "#111827", padding: "36px", borderRadius: "20px", border: "1px solid #1f2937" }
const lbl = { display: "block", marginBottom: "6px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inp = { width: "100%", padding: "12px 14px", marginBottom: "18px", borderRadius: "10px", border: "1px solid #1f2937", outline: "none", background: "#1e293b", color: "white", fontSize: "15px", boxSizing: "border-box" }
const btnStyle = { width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer" }
const errorStyle = { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px", fontSize: "14px" }
const eyeBtn = { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "4px" }

export default Register