import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function SuperAdminPanel() {
  const navigate = useNavigate()
  const superadmin = (() => { try { return JSON.parse(localStorage.getItem("superadmin")) } catch { return null } })()

  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", email: "", password: "", schoolName: superadmin?.schoolName || "" })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")
  const [toastColor, setToastColor] = useState("#22c55e")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!superadmin) { navigate("/super-admin/login"); return }
    fetchTeachers()
  }, [])

  const showToast = (msg, color = "#22c55e") => {
    setToast(msg); setToastColor(color)
    setTimeout(() => setToast(""), 3000)
  }

  const fetchTeachers = () => {
    setLoading(true)
    fetch(`${BACKEND_URL}/api/admin/teachers?schoolName=${encodeURIComponent(superadmin?.schoolName || "")}`)
      .then((r) => r.json())
      .then((d) => { setTeachers(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const upd = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password || !form.schoolName) {
      showToast("Please fill in all fields.", "#ef4444"); return
    }
    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters.", "#ef4444"); return
    }
    setSaving(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "teacher" }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast("Teacher account created successfully!")
        setForm({ name: "", email: "", password: "", schoolName: superadmin?.schoolName || "" })
        setShowForm(false)
        fetchTeachers()
      } else {
        showToast(data.message || "Failed to create account.", "#ef4444")
      }
    } catch {
      showToast("Cannot connect to server.", "#ef4444")
    }
    setSaving(false)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete teacher account for "${name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/delete/${id}`, { method: "DELETE" })
      if (res.ok) { showToast("Teacher account deleted."); fetchTeachers() }
      else showToast("Failed to delete.", "#ef4444")
    } catch {
      showToast("Cannot connect to server.", "#ef4444")
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", fontFamily: "system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px" }}>🔑 Super Admin Panel</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>{superadmin?.schoolName} — {superadmin?.name}</p>
        </div>
        <button onClick={() => { localStorage.removeItem("superadmin"); navigate("/super-admin/login") }}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          Logout
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", background: toastColor, color: "white", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", zIndex: 999, fontSize: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px" }}>

        {/* Info banner */}
        <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px", padding: "18px 22px", marginBottom: "28px" }}>
          <h3 style={{ margin: "0 0 6px", fontSize: "15px", color: "#a5b4fc" }}>How Teacher Accounts Work</h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "13px", lineHeight: 1.7 }}>
            1. You create a teacher account here with their name, email, and password.<br />
            2. You share the email and password with the teacher (via WhatsApp or email).<br />
            3. Teacher goes to <strong style={{ color: "#94a3b8" }}>/admin/login</strong> and signs in.<br />
            4. Teacher can then add DPP questions for their chapters and classes.
          </p>
        </div>

        {/* Stats + Add button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px" }}>Teacher Accounts</h2>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>{teachers.length} teacher{teachers.length !== 1 ? "s" : ""} registered</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
            {showForm ? "Cancel" : "+ Add Teacher"}
          </button>
        </div>

        {/* Add Teacher Form */}
        {showForm && (
          <div style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", color: "#a5b4fc" }}>Create Teacher Account</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={lbl}>Full Name *</label>
                <input placeholder="Teacher's full name" value={form.name} onChange={upd("name")} style={inp} />
              </div>
              <div>
                <label style={lbl}>Email Address *</label>
                <input type="email" placeholder="teacher@school.com" value={form.email} onChange={upd("email")} style={inp} />
              </div>
              <div>
                <label style={lbl}>Password * <span style={{ color: "#475569", fontWeight: "400" }}>(min 6 characters)</span></label>
                <input type="password" placeholder="Set a password for the teacher" value={form.password} onChange={upd("password")} style={inp} />
              </div>
              <div>
                <label style={lbl}>School Name *</label>
                <input placeholder="School name" value={form.schoolName} onChange={upd("schoolName")} style={inp} />
              </div>
            </div>
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px" }}>
              <p style={{ margin: 0, color: "#fbbf24", fontSize: "13px" }}>
                ⚠️ Note the password carefully — share it with the teacher via WhatsApp or email. You cannot view it later.
              </p>
            </div>
            <button onClick={handleCreate} disabled={saving}
              style={{ padding: "12px 28px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "15px", cursor: "pointer" }}>
              {saving ? "Creating..." : "Create Teacher Account"}
            </button>
          </div>
        )}

        {/* Teachers List */}
        {loading ? (
          <p style={{ color: "#64748b" }}>Loading teachers...</p>
        ) : teachers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "#111827", borderRadius: "16px", border: "1px solid #1f2937" }}>
            <h3 style={{ color: "white" }}>No teachers yet</h3>
            <p style={{ color: "#64748b" }}>Click "+ Add Teacher" to create the first teacher account.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {teachers.map((t) => (
              <div key={t._id} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px", flexShrink: 0 }}>
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: "0 0 3px", fontWeight: "700", fontSize: "15px", color: "white" }}>{t.name}</p>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>{t.email} &nbsp;·&nbsp; {t.schoolName}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                    Teacher
                  </span>
                  <button onClick={() => handleDelete(t._id, t.name)}
                    style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const lbl = { display: "block", marginBottom: "6px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inp = { width: "100%", padding: "11px 13px", marginBottom: "0", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }

export default SuperAdminPanel