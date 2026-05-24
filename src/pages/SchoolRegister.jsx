import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"
const BOARDS = ["CBSE", "ICSE", "State Board", "Other"]

function SchoolRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ schoolName: "", city: "", state: "", board: "CBSE", adminName: "", adminEmail: "", adminPhone: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const upd = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleRegister = async () => {
    setError("")
    const required = ["schoolName", "city", "state", "adminName", "adminEmail", "adminPhone", "password"]
    if (required.some((f) => !form[f])) {
      setError("Please fill in all required fields."); return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return
    }
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/school/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) { setSuccess(true) }
      else { setError(data.message || "Registration failed.") }
    } catch {
      setError("Cannot connect to server.")
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div style={page}>
        <div style={{ ...card, textAlign: "center", maxWidth: "480px" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ color: "white", marginBottom: "12px" }}>Registration Submitted!</h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: "24px" }}>
            Your school registration has been submitted successfully. The platform administrator
            will review and approve your account. You will be able to login once approved.
          </p>
          <p style={{ color: "#64748b", fontSize: "13px" }}>
            Typically approved within 24 hours.
          </p>
          <Link to="/" style={{ display: "inline-block", marginTop: "20px", padding: "11px 24px", background: "#6366f1", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "700" }}>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={page}>
      <div style={{ ...card, maxWidth: "560px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "38px", marginBottom: "8px" }}>🏫</div>
          <h1 style={{ margin: "0 0 6px", fontSize: "22px", color: "white" }}>Register Your School</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
            Fill in the details below. Your account will be activated after approval.
          </p>
        </div>

        {error && <div style={errBox}>{error}</div>}

        <div style={section}>
          <p style={sectionTitle}>School Details</p>
          <label style={lbl}>School Name *</label>
          <input placeholder="e.g. Delhi Public School" value={form.schoolName} onChange={upd("schoolName")} style={inp} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={lbl}>City *</label><input placeholder="e.g. Delhi" value={form.city} onChange={upd("city")} style={inp} /></div>
            <div><label style={lbl}>State *</label><input placeholder="e.g. Delhi" value={form.state} onChange={upd("state")} style={inp} /></div>
          </div>
          <label style={lbl}>Board *</label>
          <select value={form.board} onChange={upd("board")} style={inp}>
            {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div style={section}>
          <p style={sectionTitle}>Administrator Details</p>
          <label style={lbl}>Admin Name *</label>
          <input placeholder="Principal or HOD name" value={form.adminName} onChange={upd("adminName")} style={inp} />
          <label style={lbl}>Admin Email *</label>
          <input type="email" placeholder="admin@school.com" value={form.adminEmail} onChange={upd("adminEmail")} style={inp} />
          <label style={lbl}>Admin Phone *</label>
          <input placeholder="10-digit phone number" value={form.adminPhone} onChange={upd("adminPhone")} style={inp} />
          <label style={lbl}>Password * <span style={{ color: "#475569", fontWeight: "400" }}>(min 6 characters)</span></label>
          <input type="password" placeholder="Set your login password" value={form.password} onChange={upd("password")} style={inp} />
        </div>

        <button onClick={handleRegister} disabled={loading} style={btn}>
          {loading ? "Submitting..." : "Submit Registration"}
        </button>

        <p style={{ textAlign: "center", marginTop: "16px", color: "#64748b", fontSize: "13px" }}>
          Already registered?{" "}
          <Link to="/school/login" style={{ color: "#818cf8", textDecoration: "none" }}>Sign in here</Link>
        </p>
      </div>
    </div>
  )
}

const page = { minHeight: "100vh", background: "#0b0b12", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 20px" }
const card = { width: "100%", background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "36px" }
const lbl = { display: "block", marginBottom: "5px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inp = { width: "100%", padding: "11px 13px", marginBottom: "14px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }
const btn = { width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer" }
const errBox = { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: "10px", padding: "12px", marginBottom: "16px", fontSize: "14px" }
const section = { marginBottom: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid #1f2937", borderRadius: "12px", padding: "18px" }
const sectionTitle = { margin: "0 0 14px", fontSize: "13px", fontWeight: "700", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px" }

export default SchoolRegister