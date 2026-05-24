import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function SchoolPanel() {
  const navigate = useNavigate()
  const school = (() => { try { return JSON.parse(localStorage.getItem("schoolAdmin")) } catch { return null } })()

  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState({ msg: "", color: "#22c55e" })

  useEffect(() => {
    if (!school) { navigate("/school/login"); return }
    fetchTeachers()
  }, [])

  const showMsg = (msg, color = "#22c55e") => {
    setToast({ msg, color }); setTimeout(() => setToast({ msg: "", color: "#22c55e" }), 3000)
  }

  const fetchTeachers = () => {
    setLoading(true)
    fetch(`${BACKEND_URL}/api/school/teachers/${school?.schoolCode}`)
      .then((r) => r.json())
      .then((d) => { setTeachers(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const upd = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) { showMsg("All fields required.", "#ef4444"); return }
    if (form.password.length < 6) { showMsg("Password min 6 characters.", "#ef4444"); return }
    setSaving(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/school/add-teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, schoolCode: school.schoolCode, schoolName: school.schoolName }),
      })
      const data = await res.json()
      if (res.ok) {
        showMsg("Teacher added successfully!")
        setForm({ name: "", email: "", password: "" })
        setShowForm(false)
        fetchTeachers()
      } else { showMsg(data.message || "Failed.", "#ef4444") }
    } catch { showMsg("Cannot connect to server.", "#ef4444") }
    setSaving(false)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}'s account?`)) return
    const res = await fetch(`${BACKEND_URL}/api/school/teacher/${id}`, { method: "DELETE" })
    if (res.ok) { showMsg("Teacher deleted."); fetchTeachers() }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", fontFamily: "system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px" }}>🏫 {school?.schoolName}</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>School Code: <strong style={{ color: "#6366f1" }}>{school?.schoolCode}</strong> &nbsp;·&nbsp; {school?.city}, {school?.state}</p>
        </div>
        <button onClick={() => { localStorage.removeItem("schoolAdmin"); navigate("/school/login") }}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          Logout
        </button>
      </div>

      {toast.msg && <div style={{ position: "fixed", top: "20px", right: "20px", background: toast.color, color: "white", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", zIndex: 999, fontSize: "14px" }}>{toast.msg}</div>}

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px" }}>

        {/* Info */}
        <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px", padding: "18px 22px", marginBottom: "28px" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "15px", color: "#a5b4fc" }}>How to Add Teachers</h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "13px", lineHeight: 1.7 }}>
            1. Click "+ Add Teacher" and fill in their name, email, and password.<br />
            2. Share the email and password with the teacher (via WhatsApp or email).<br />
            3. Teacher goes to <strong style={{ color: "#94a3b8" }}>your-site/admin/login</strong> and signs in with those credentials.<br />
            4. Teacher can then add DPP questions for their chapters and classes.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px", marginBottom: "24px" }}>
          <div style={sCard}><p style={sLbl}>Total Teachers</p><h2 style={{ margin: 0, color: "#6366f1" }}>{teachers.length}</h2></div>
          <div style={sCard}><p style={sLbl}>School Code</p><h2 style={{ margin: 0, fontSize: "18px", color: "#22c55e" }}>{school?.schoolCode}</h2></div>
          <div style={sCard}><p style={sLbl}>Board</p><h2 style={{ margin: 0, fontSize: "18px", color: "#f59e0b" }}>{school?.board}</h2></div>
        </div>

        {/* Header + Add button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "18px" }}>Teachers</h2>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
            {showForm ? "Cancel" : "+ Add Teacher"}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "16px", padding: "22px", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: "15px", color: "#a5b4fc" }}>New Teacher Account</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div><label style={lbl}>Full Name *</label><input placeholder="Teacher name" value={form.name} onChange={upd("name")} style={inp} /></div>
              <div><label style={lbl}>Email *</label><input type="email" placeholder="teacher@school.com" value={form.email} onChange={upd("email")} style={inp} /></div>
              <div><label style={lbl}>Password *</label><input type="password" placeholder="Min 6 characters" value={form.password} onChange={upd("password")} style={inp} /></div>
            </div>
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "9px", padding: "10px 14px", marginBottom: "16px" }}>
              <p style={{ margin: 0, color: "#fbbf24", fontSize: "13px" }}>⚠️ Note the password — share it with the teacher. You cannot view it later.</p>
            </div>
            <button onClick={handleAdd} disabled={saving} style={{ padding: "11px 24px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {saving ? "Adding..." : "Add Teacher"}
            </button>
          </div>
        )}

        {/* Teachers List */}
        {loading ? <p style={{ color: "#64748b" }}>Loading...</p>
          : teachers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", background: "#111827", borderRadius: "16px", border: "1px solid #1f2937" }}>
              <h3>No teachers yet</h3>
              <p style={{ color: "#64748b" }}>Add your first teacher to get started.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {teachers.map((t) => (
                <div key={t._id} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "15px", flexShrink: 0 }}>
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: "0 0 2px", fontWeight: "700", fontSize: "15px", color: "white" }}>{t.name}</p>
                      <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>{t.email}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(t._id, t.name)}
                    style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

const sCard = { background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px 18px" }
const sLbl = { margin: "0 0 6px", color: "#64748b", fontSize: "12px" }
const lbl = { display: "block", marginBottom: "5px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inp = { width: "100%", padding: "10px 12px", marginBottom: "0", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }

export default SchoolPanel