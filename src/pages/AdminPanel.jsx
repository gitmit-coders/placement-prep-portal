import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"
const CLASSES = ["6", "7", "8", "9", "10"]

const emptyForm = { book: "", chapter: "", class: "", question: "", option1: "", option2: "", option3: "", option4: "", answer: "" }

function AdminPanel() {
  const navigate = useNavigate()
  const admin = (() => { try { return JSON.parse(localStorage.getItem("admin")) } catch { return null } })()

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [tab, setTab] = useState("list") // "list" | "add" | "import"
  const [importResult, setImportResult] = useState(null)
  const [filterBook, setFilterBook] = useState("")
  const [filterChapter, setFilterChapter] = useState("")
  const fileRef = useRef()

  // Redirect if not logged in
  useEffect(() => {
    if (!admin) navigate("/admin/login")
  }, [])

  // Fetch questions
  const fetchQuestions = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterBook) params.append("book", filterBook)
    if (filterChapter) params.append("chapter", filterChapter)

    fetch(`${BACKEND_URL}/api/questions?${params}`)
      .then((r) => r.json())
      .then((data) => { setQuestions(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchQuestions() }, [filterBook, filterChapter])

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  // Save (add or edit)
  const handleSave = async () => {
    const opts = [form.option1, form.option2, form.option3, form.option4]
    if (!form.book || !form.chapter || !form.class || !form.question || opts.some((o) => !o) || !form.answer) {
      showMessage("Please fill in all fields."); return
    }
    if (!opts.includes(form.answer)) {
      showMessage("Answer must match one of the 4 options exactly."); return
    }

    setSaving(true)
    const payload = {
      addedBy: admin._id, schoolName: admin.schoolName,
      book: form.book, chapter: form.chapter, class: form.class,
      question: form.question, options: opts, answer: form.answer,
    }

    const url = editId
      ? `${BACKEND_URL}/api/questions/edit/${editId}`
      : `${BACKEND_URL}/api/questions/add`
    const method = editId ? "PUT" : "POST"

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    const data = await res.json()

    if (res.ok) {
      showMessage(editId ? "Question updated!" : "Question added!")
      setForm(emptyForm)
      setEditId(null)
      setTab("list")
      fetchQuestions()
    } else {
      showMessage(data.message || "Failed to save.")
    }
    setSaving(false)
  }

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return
    const res = await fetch(`${BACKEND_URL}/api/questions/delete/${id}`, { method: "DELETE" })
    if (res.ok) { showMessage("Question deleted."); fetchQuestions() }
  }

  // Start edit
  const startEdit = (q) => {
    setForm({
      book: q.book, chapter: q.chapter, class: q.class,
      question: q.question,
      option1: q.options[0], option2: q.options[1],
      option3: q.options[2], option4: q.options[3],
      answer: q.answer,
    })
    setEditId(q._id)
    setTab("add")
  }

  // Excel import
  const handleExcel = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws)

      const res = await fetch(`${BACKEND_URL}/api/questions/bulk-add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: rows, addedBy: admin._id, schoolName: admin.schoolName }),
      })
      const data = await res.json()
      setImportResult(data)
      fetchQuestions()
    }
    reader.readAsBinaryString(file)
    e.target.value = ""
  }

  const handleLogout = () => {
    localStorage.removeItem("admin")
    navigate("/admin/login")
  }

  // Download Excel template
  const downloadTemplate = () => {
    const sample = [{
      book: "Mathematics", chapter: "Algebra", class: "9",
      question: "What is 2 + 2?",
      option1: "3", option2: "4", option3: "5", option4: "6",
      answer: "4"
    }]
    const ws = XLSX.utils.json_to_sheet(sample)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Questions")
    XLSX.writeFile(wb, "questions_template.xlsx")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", color: "white" }}>🏫 Admin Panel</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>{admin?.schoolName} — {admin?.name}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          Logout
        </button>
      </div>

      {/* Message Toast */}
      {message && (
        <div style={{ position: "fixed", top: "20px", right: "20px", background: "#22c55e", color: "white", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", zIndex: 999, fontSize: "14px" }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "14px", marginBottom: "28px" }}>
          <div style={statCard}><p style={statLabel}>Total Questions</p><h2 style={{ margin: 0, color: "#6366f1" }}>{questions.length}</h2></div>
          <div style={statCard}><p style={statLabel}>School</p><h2 style={{ margin: 0, fontSize: "16px", color: "white" }}>{admin?.schoolName}</h2></div>
          <div style={statCard}><p style={statLabel}>Your Role</p><h2 style={{ margin: 0, fontSize: "16px", color: "#22c55e", textTransform: "capitalize" }}>{admin?.role}</h2></div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          {[["list", "📋 Question List"], ["add", editId ? "✏️ Edit Question" : "➕ Add Question"], ["import", "📥 Import Excel"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); if (key !== "add") { setForm(emptyForm); setEditId(null) } }}
              style={{ padding: "9px 18px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px", background: tab === key ? "#6366f1" : "#111827", color: tab === key ? "white" : "#64748b", outline: tab === key ? "none" : "1px solid #1f2937" }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── QUESTION LIST ── */}
        {tab === "list" && (
          <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
              <input placeholder="Filter by book..." value={filterBook} onChange={(e) => setFilterBook(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: "160px", marginBottom: 0 }} />
              <input placeholder="Filter by chapter..." value={filterChapter} onChange={(e) => setFilterChapter(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: "160px", marginBottom: 0 }} />
            </div>

            {loading ? <p style={{ color: "#64748b" }}>Loading questions...</p>
              : questions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "#111827", borderRadius: "16px", border: "1px solid #1f2937" }}>
                  <h3>No questions yet</h3>
                  <p style={{ color: "#64748b" }}>Add questions manually or import from Excel.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {questions.map((q, i) => (
                    <div key={q._id} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#6366f1", fontWeight: "600" }}>
                            {q.book} — {q.chapter} — Class {q.class}
                          </p>
                          <p style={{ margin: "0 0 10px", fontSize: "15px", fontWeight: "600", color: "white" }}>
                            {i + 1}. {q.question}
                          </p>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {q.options.map((opt) => (
                              <span key={opt} style={{
                                padding: "4px 12px", borderRadius: "6px", fontSize: "13px",
                                background: opt === q.answer ? "rgba(34,197,94,0.15)" : "#1e293b",
                                color: opt === q.answer ? "#22c55e" : "#94a3b8",
                                border: opt === q.answer ? "1px solid rgba(34,197,94,0.3)" : "1px solid #1f2937",
                                fontWeight: opt === q.answer ? "700" : "400",
                              }}>
                                {opt === q.answer ? "✓ " : ""}{opt}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                          <button onClick={() => startEdit(q)} style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid #1f2937", background: "#1e293b", color: "#94a3b8", cursor: "pointer", fontSize: "13px" }}>Edit</button>
                          <button onClick={() => handleDelete(q._id)} style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontSize: "13px" }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ── ADD / EDIT FORM ── */}
        {tab === "add" && (
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "28px" }}>
            <h3 style={{ margin: "0 0 24px", fontSize: "18px" }}>{editId ? "Edit Question" : "Add New Question"}</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={labelStyle}>Book Name *</label>
                <input placeholder="e.g. Mathematics" value={form.book} onChange={update("book")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Chapter *</label>
                <input placeholder="e.g. Algebra" value={form.chapter} onChange={update("chapter")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Class *</label>
                <select value={form.class} onChange={update("class")} style={inputStyle}>
                  <option value="">Select class</option>
                  {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
            </div>

            <label style={labelStyle}>Question *</label>
            <textarea placeholder="Type the question here..." value={form.question} onChange={update("question")}
              style={{ ...inputStyle, height: "80px", resize: "vertical" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {["option1", "option2", "option3", "option4"].map((opt, i) => (
                <div key={opt}>
                  <label style={labelStyle}>Option {i + 1} *</label>
                  <input placeholder={`Option ${i + 1}`} value={form[opt]} onChange={update(opt)} style={inputStyle} />
                </div>
              ))}
            </div>

            <label style={labelStyle}>Correct Answer * <span style={{ color: "#64748b", fontWeight: "400" }}>(must exactly match one of the options above)</span></label>
            <select value={form.answer} onChange={update("answer")} style={inputStyle}>
              <option value="">Select correct answer</option>
              {[form.option1, form.option2, form.option3, form.option4].filter(Boolean).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={handleSave} disabled={saving} style={{ ...actionBtn, background: "#6366f1" }}>
                {saving ? "Saving..." : editId ? "Update Question" : "Add Question"}
              </button>
              <button onClick={() => { setForm(emptyForm); setEditId(null); setTab("list") }} style={{ ...actionBtn, background: "#1e293b", outline: "1px solid #1f2937" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── EXCEL IMPORT ── */}
        {tab === "import" && (
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "28px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Import Questions from Excel</h3>
            <p style={{ color: "#64748b", marginBottom: "24px", fontSize: "14px" }}>
              Upload an Excel file (.xlsx) with the correct column format.
            </p>

            {/* Template download */}
            <div style={{ background: "#0b0b12", border: "1px solid #1f2937", borderRadius: "14px", padding: "20px", marginBottom: "24px" }}>
              <h4 style={{ margin: "0 0 12px", fontSize: "15px" }}>Required Excel Column Format:</h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {["book", "chapter", "class", "question", "option1", "option2", "option3", "option4", "answer"].map((col) => (
                  <span key={col} style={{ padding: "4px 10px", background: "#1e293b", border: "1px solid #1f2937", borderRadius: "6px", fontSize: "12px", color: "#94a3b8", fontFamily: "monospace" }}>{col}</span>
                ))}
              </div>
              <p style={{ margin: "0 0 14px", color: "#64748b", fontSize: "13px" }}>
                The <code style={{ color: "#818cf8" }}>answer</code> column value must exactly match one of option1–option4.
              </p>
              <button onClick={downloadTemplate} style={{ padding: "9px 18px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                ⬇ Download Template
              </button>
            </div>

            {/* File upload */}
            <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleExcel} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ ...actionBtn, background: "#6366f1", marginBottom: "20px" }}>
              📂 Choose Excel File
            </button>

            {/* Import result */}
            {importResult && (
              <div style={{ background: "#0b0b12", border: "1px solid #1f2937", borderRadius: "14px", padding: "20px" }}>
                <p style={{ margin: "0 0 8px", color: "#22c55e", fontWeight: "700" }}>
                  ✅ {importResult.message}
                </p>
                {importResult.errors?.length > 0 && (
                  <div>
                    <p style={{ margin: "8px 0 6px", color: "#f87171", fontWeight: "600" }}>Errors:</p>
                    {importResult.errors.map((err, i) => (
                      <p key={i} style={{ margin: "0 0 4px", color: "#f87171", fontSize: "13px" }}>• {err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const statCard = { background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "18px 20px" }
const statLabel = { margin: "0 0 6px", color: "#64748b", fontSize: "13px" }
const labelStyle = { display: "block", marginBottom: "6px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inputStyle = { width: "100%", padding: "11px 13px", marginBottom: "14px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }
const actionBtn = { padding: "12px 24px", borderRadius: "10px", border: "none", color: "white", fontWeight: "700", fontSize: "15px", cursor: "pointer" }

export default AdminPanel