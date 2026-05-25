import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function SchoolPanel() {
  const navigate = useNavigate()
  const school = (() => { try { return JSON.parse(localStorage.getItem("schoolAdmin")) } catch { return null } })()

  const [tab, setTab] = useState("students")
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [studentFilter, setStudentFilter] = useState("pending")
  const [loadingTeachers, setLoadingTeachers] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState({ msg: "", color: "#22c55e" })
  const [codeCopied, setCodeCopied] = useState(false)
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, name: "" })
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    if (!school) { navigate("/school/login"); return }
    fetchTeachers()
    fetchStudents()
  }, [])

  useEffect(() => { fetchStudents() }, [studentFilter])

  const showMsg = (msg, color = "#22c55e") => {
    setToast({ msg, color }); setTimeout(() => setToast({ msg: "", color }), 3000)
  }

  const fetchTeachers = () => {
    setLoadingTeachers(true)
    fetch(`${BACKEND_URL}/api/school/teachers/${school?.schoolCode}`)
      .then((r) => r.json())
      .then((d) => { setTeachers(Array.isArray(d) ? d : []); setLoadingTeachers(false) })
      .catch(() => setLoadingTeachers(false))
  }

  const fetchStudents = () => {
    setLoadingStudents(true)
    fetch(`${BACKEND_URL}/api/school/students/${school?.schoolCode}?status=${studentFilter}`)
      .then((r) => r.json())
      .then((d) => { setStudents(Array.isArray(d) ? d : []); setLoadingStudents(false) })
      .catch(() => setLoadingStudents(false))
  }

  const handleApprove = async (id, name) => {
    const res = await fetch(`${BACKEND_URL}/api/school/student/approve/${id}`, { method: "PUT" })
    if (res.ok) { showMsg(`${name} approved! ✅`); fetchStudents() }
    else showMsg("Failed.", "#ef4444")
  }

  const handleReject = async () => {
    const res = await fetch(`${BACKEND_URL}/api/school/student/reject/${rejectModal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: rejectReason }),
    })
    if (res.ok) { showMsg("Student rejected."); fetchStudents() }
    setRejectModal({ open: false, id: null, name: "" })
    setRejectReason("")
  }

  const upd = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const handleAddTeacher = async () => {
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
      if (res.ok) { showMsg("Teacher added!"); setForm({ name: "", email: "", password: "" }); setShowForm(false); fetchTeachers() }
      else showMsg(data.message || "Failed.", "#ef4444")
    } catch { showMsg("Cannot connect.", "#ef4444") }
    setSaving(false)
  }

  const handleDeleteTeacher = async (id, name) => {
    if (!window.confirm(`Delete ${name}'s account?`)) return
    const res = await fetch(`${BACKEND_URL}/api/school/teacher/${id}`, { method: "DELETE" })
    if (res.ok) { showMsg("Teacher deleted."); fetchTeachers() }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(school?.joinCode || "")
    setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000)
  }

  const pendingCount = tab === "students" ? students.filter(s => s.status === "pending").length : 0

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", fontFamily: "system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px" }}>🏫 {school?.schoolName}</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>
            Code: <strong style={{ color: "#6366f1" }}>{school?.schoolCode}</strong> &nbsp;·&nbsp; {school?.city}, {school?.state}
          </p>
        </div>
        <button onClick={() => { localStorage.removeItem("schoolAdmin"); navigate("/school/login") }}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          Logout
        </button>
      </div>

      {toast.msg && <div style={{ position: "fixed", top: "20px", right: "20px", background: toast.color, color: "white", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", zIndex: 999, fontSize: "14px" }}>{toast.msg}</div>}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "400px" }}>
            <h3 style={{ margin: "0 0 8px" }}>Reject — {rejectModal.name}</h3>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "14px" }}>Reason (optional):</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Not a student of this school..."
              style={{ width: "100%", padding: "10px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "13px", boxSizing: "border-box", height: "70px", resize: "none", marginBottom: "14px", outline: "none" }} />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleReject} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "none", background: "#dc2626", color: "white", fontWeight: "700", cursor: "pointer" }}>Reject</button>
              <button onClick={() => setRejectModal({ open: false, id: null, name: "" })} style={{ flex: 1, padding: "10px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "28px" }}>

        {/* Join Code */}
        <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "16px", padding: "20px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "15px", color: "#a5b4fc" }}>🔑 Student Join Code</h3>
            <p style={{ margin: "0 0 12px", color: "#64748b", fontSize: "13px" }}>Share this with your students — required during registration.</p>
            <div style={{ background: "#0b0b12", border: "2px solid rgba(99,102,241,0.4)", borderRadius: "10px", padding: "10px 20px", display: "inline-block" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "6px", color: "white", fontFamily: "monospace" }}>
                {school?.joinCode || "------"}
              </span>
            </div>
          </div>
          <button onClick={copyCode} style={{ padding: "11px 20px", borderRadius: "10px", border: "none", background: codeCopied ? "rgba(34,197,94,0.2)" : "#6366f1", color: codeCopied ? "#22c55e" : "white", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
            {codeCopied ? "Copied! ✓" : "Copy Code"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "22px" }}>
          {[["students", "👨‍🎓 Students"], ["teachers", "👩‍🏫 Teachers"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px", background: tab === key ? "#6366f1" : "#111827", color: tab === key ? "white" : "#64748b", outline: tab === key ? "none" : "1px solid #1f2937" }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── STUDENTS TAB ── */}
        {tab === "students" && (
          <div>
            {/* Filter */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
              {[["pending", "⏳ Pending"], ["approved", "✅ Approved"], ["rejected", "❌ Rejected"], ["all", "All"]].map(([val, label]) => (
                <button key={val} onClick={() => setStudentFilter(val)}
                  style={{ padding: "8px 16px", borderRadius: "9px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px", background: studentFilter === val ? "#6366f1" : "#111827", color: studentFilter === val ? "white" : "#64748b", outline: studentFilter === val ? "none" : "1px solid #1f2937" }}>
                  {label}
                </button>
              ))}
            </div>

            {loadingStudents ? <p style={{ color: "#64748b" }}>Loading...</p>
              : students.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px", background: "#111827", borderRadius: "16px", border: "1px solid #1f2937" }}>
                  <h3>{studentFilter === "pending" ? "No pending approvals" : "No students found"}</h3>
                  <p style={{ color: "#64748b", fontSize: "13px" }}>
                    {studentFilter === "pending" ? "All caught up! ✅" : "Students will appear here once they register."}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {students.map((s) => (
                    <div key={s._id} style={{ background: "#111827", border: s.status === "pending" ? "1px solid rgba(245,158,11,0.3)" : "1px solid #1f2937", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "15px", flexShrink: 0 }}>
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: "0 0 2px", fontWeight: "700", fontSize: "15px", color: "white" }}>{s.name}</p>
                          <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                            {s.email} &nbsp;·&nbsp; Class {s.studentClass}
                            {s.status === "rejected" && s.rejectedReason && (
                              <span style={{ color: "#f87171" }}> &nbsp;·&nbsp; {s.rejectedReason}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                        {s.status === "pending" && (
                          <>
                            <button onClick={() => handleApprove(s._id, s.name)}
                              style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.1)", color: "#22c55e", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                              ✓ Approve
                            </button>
                            <button onClick={() => setRejectModal({ open: true, id: s._id, name: s.name })}
                              style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#f87171", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                              ✗ Reject
                            </button>
                          </>
                        )}
                        {s.status === "approved" && (
                          <span style={{ padding: "5px 12px", borderRadius: "7px", fontSize: "12px", fontWeight: "700", color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>Approved</span>
                        )}
                        {s.status === "rejected" && (
                          <span style={{ padding: "5px 12px", borderRadius: "7px", fontSize: "12px", fontWeight: "700", color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>Rejected</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ── TEACHERS TAB ── */}
        {tab === "teachers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "18px" }}>Teachers ({teachers.length})</h2>
              <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                {showForm ? "Cancel" : "+ Add Teacher"}
              </button>
            </div>

            {showForm && (
              <div style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "16px", padding: "22px", marginBottom: "18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div><label style={lbl}>Full Name *</label><input placeholder="Teacher name" value={form.name} onChange={upd("name")} style={inp} /></div>
                  <div><label style={lbl}>Email *</label><input type="email" placeholder="teacher@school.com" value={form.email} onChange={upd("email")} style={inp} /></div>
                  <div><label style={lbl}>Password *</label><input type="password" placeholder="Min 6 characters" value={form.password} onChange={upd("password")} style={inp} /></div>
                </div>
                <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "9px", padding: "10px 14px", marginBottom: "14px" }}>
                  <p style={{ margin: 0, color: "#fbbf24", fontSize: "13px" }}>⚠️ Note the password — share with teacher. Cannot be viewed later.</p>
                </div>
                <button onClick={handleAddTeacher} disabled={saving} style={{ padding: "11px 24px", borderRadius: "10px", border: "none", background: "#6366f1", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                  {saving ? "Adding..." : "Add Teacher"}
                </button>
              </div>
            )}

            {loadingTeachers ? <p style={{ color: "#64748b" }}>Loading...</p>
              : teachers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", background: "#111827", borderRadius: "16px", border: "1px solid #1f2937" }}>
                  <p style={{ color: "#64748b" }}>No teachers yet.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {teachers.map((t) => (
                    <div key={t._id} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "15px" }}>
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: "0 0 2px", fontWeight: "700", fontSize: "15px", color: "white" }}>{t.name}</p>
                          <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>{t.email}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteTeacher(t._id, t.name)}
                        style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}

const lbl = { display: "block", marginBottom: "5px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inp = { width: "100%", padding: "10px 12px", marginBottom: "0", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }

export default SchoolPanel