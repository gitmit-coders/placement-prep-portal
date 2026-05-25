import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function MasterPanel() {
  const navigate = useNavigate()
  const master = (() => { try { return JSON.parse(localStorage.getItem("master")) } catch { return null } })()

  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [toast, setToast] = useState({ msg: "", color: "#22c55e" })
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, name: "" })
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    if (!master) { navigate("/master/login"); return }
    fetchSchools()
  }, [])

  const showMsg = (msg, color = "#22c55e") => {
    setToast({ msg, color }); setTimeout(() => setToast({ msg: "", color: "#22c55e" }), 3000)
  }

  const fetchSchools = () => {
    setLoading(true)
    fetch(`${BACKEND_URL}/api/master/schools`)
      .then((r) => r.json())
      .then((d) => { setSchools(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const handleApprove = async (id, name) => {
    const res = await fetch(`${BACKEND_URL}/api/master/approve/${id}`, { method: "PUT" })
    if (res.ok) { showMsg(`${name} approved! ✅`); fetchSchools() }
    else showMsg("Failed to approve.", "#ef4444")
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" permanently? This cannot be undone.`)) return
    const res = await fetch(`${BACKEND_URL}/api/master/school/${id}`, { method: "DELETE" })
    if (res.ok) { showMsg(`${name} deleted.`); fetchSchools() }
    else showMsg("Failed to delete.", "#ef4444")
  }

  const handleReject = async () => {
    const res = await fetch(`${BACKEND_URL}/api/master/reject/${rejectModal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: rejectReason }),
    })
    if (res.ok) { showMsg("School rejected."); fetchSchools() }
    setRejectModal({ open: false, id: null, name: "" })
    setRejectReason("")
  }

  const filtered = schools.filter((s) => filter === "all" || s.status === filter)
  const counts = { all: schools.length, pending: schools.filter((s) => s.status === "pending").length, approved: schools.filter((s) => s.status === "approved").length, rejected: schools.filter((s) => s.status === "rejected").length }

  const statusStyle = (s) => {
    if (s === "approved") return { color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }
    if (s === "pending") return { color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }
    return { color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", fontFamily: "system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px" }}>🔑 Master Panel</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Welcome, {master?.name} — Platform Administrator</p>
        </div>
        <button onClick={() => { localStorage.removeItem("master"); navigate("/master/login") }}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          Logout
        </button>
      </div>

      {toast.msg && <div style={{ position: "fixed", top: "20px", right: "20px", background: toast.color, color: "white", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", zIndex: 999, fontSize: "14px" }}>{toast.msg}</div>}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "420px" }}>
            <h3 style={{ margin: "0 0 8px", color: "white" }}>Reject — {rejectModal.name}</h3>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "14px" }}>Provide a reason (optional). The school will see this message.</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete information, invalid phone number..."
              style={{ width: "100%", padding: "11px 13px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none", height: "80px", resize: "none", marginBottom: "16px" }} />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleReject} style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "none", background: "#dc2626", color: "white", fontWeight: "700", cursor: "pointer" }}>Confirm Reject</button>
              <button onClick={() => setRejectModal({ open: false, id: null, name: "" })} style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "28px" }}>
          {[["Total", counts.all, "#6366f1"], ["Pending", counts.pending, "#f59e0b"], ["Approved", counts.approved, "#22c55e"], ["Rejected", counts.rejected, "#ef4444"]].map(([label, val, color]) => (
            <div key={label} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px 18px" }}>
              <p style={{ margin: "0 0 6px", color: "#64748b", fontSize: "12px" }}>{label} Schools</p>
              <h2 style={{ margin: 0, color, fontSize: "28px" }}>{val}</h2>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 16px", borderRadius: "9px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px", background: filter === f ? "#6366f1" : "#111827", color: filter === f ? "white" : "#64748b", outline: filter === f ? "none" : "1px solid #1f2937", textTransform: "capitalize" }}>
              {f} {f !== "all" && `(${counts[f]})`}
            </button>
          ))}
        </div>

        {/* Schools List */}
        {loading ? <p style={{ color: "#64748b" }}>Loading schools...</p>
          : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", background: "#111827", borderRadius: "16px", border: "1px solid #1f2937" }}>
              <h3>{filter === "pending" ? "No pending approvals" : "No schools found"}</h3>
              <p style={{ color: "#64748b" }}>{filter === "pending" ? "All caught up! ✅" : "Schools will appear here once they register."}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filtered.map((s) => (
                <div key={s._id} style={{ background: "#111827", border: s.status === "pending" ? "1px solid rgba(245,158,11,0.3)" : "1px solid #1f2937", borderRadius: "16px", padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <h3 style={{ margin: 0, fontSize: "17px", color: "white" }}>{s.schoolName}</h3>
                        <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", textTransform: "capitalize", ...statusStyle(s.status) }}>{s.status}</span>
                        {s.schoolCode && <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "12px", color: "#6366f1", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>{s.schoolCode}</span>}
                      </div>
                      <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: "13px" }}>
                        📍 {s.city}, {s.state} &nbsp;·&nbsp; {s.board}
                      </p>
                      <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: "13px" }}>
                        👤 {s.adminName} &nbsp;·&nbsp; ✉️ {s.adminEmail} &nbsp;·&nbsp; 📞 {s.adminPhone}
                      </p>
                      <p style={{ margin: 0, color: "#475569", fontSize: "12px" }}>
                        Registered: {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {s.status === "rejected" && s.rejectedReason && <span style={{ color: "#f87171" }}> &nbsp;·&nbsp; Reason: {s.rejectedReason}</span>}
                      </p>
                    </div>

                    {/* Actions */}
                    {s.status === "pending" && (
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <button onClick={() => handleApprove(s._id, s.schoolName)}
                          style={{ padding: "9px 18px", borderRadius: "9px", border: "none", background: "rgba(34,197,94,0.15)", color: "#22c55e", fontWeight: "700", cursor: "pointer", fontSize: "14px", border: "1px solid rgba(34,197,94,0.3)" }}>
                          ✓ Approve
                        </button>
                        <button onClick={() => setRejectModal({ open: true, id: s._id, name: s.schoolName })}
                          style={{ padding: "9px 18px", borderRadius: "9px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#f87171", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
                          ✗ Reject
                        </button>
                      </div>
                    )}
                    {s.status === "approved" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ padding: "5px 12px", borderRadius: "7px", fontSize: "12px", fontWeight: "700", color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center" }}>Active ✅</span>
                        <button onClick={() => handleDelete(s._id, s.schoolName)} style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

export default MasterPanel