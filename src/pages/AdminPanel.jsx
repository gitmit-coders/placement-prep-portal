import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"
const CLASSES = ["6", "7", "8", "9", "10"]

// ── SUBJECT + CHAPTER MASTER DATA ──
const SUBJECTS_BY_CLASS = {
  "6":  ["Mathematics", "Science", "English"],
  "7":  ["Mathematics", "Science", "English"],
  "8":  ["Mathematics", "Science", "English"],
  "9":  ["Mathematics", "Science", "English"],
  "10": ["Mathematics", "Science", "English"],
}

const CHAPTERS_BY_CLASS_SUBJECT = {
  "6": {
    "Mathematics": ["Knowing Our Numbers","Whole Numbers","Playing with Numbers","Basic Geometrical Ideas","Understanding Elementary Shapes","Integers","Fractions","Decimals","Data Handling","Mensuration","Algebra","Ratio and Proportion"],
    "Science": ["Food: Where Does It Come From?","Components Of Food","Fibre To Fabric","Sorting Materials Into Groups","Separation Of Substances","Changes Around Us","Getting To Know Plants","Body Movements","The Living Organisms — Characteristics And Habitats","Motion And Measurement Of Distances","Light, Shadows And Reflections","Electricity And Circuits","Fun With Magnets","Water"],
    "English": ["Reading Comprehension","Grammar","Writing Skills","Literature"],
  },
  "7": {
    "Mathematics": ["Integers","Fractions and Decimals","Data Handling","Simple Equations","Lines and Angles","The Triangle and its Properties","Comparing Quantities","Rational Numbers","Perimeter and Area","Algebraic Expressions","Exponents and Powers","Symmetry"],
    "Science": ["Nutrition in Plants","Nutrition in Animals","Fibre to Fabric","Heat","Acids, Bases and Salts","Physical and Chemical Changes","Weather, Climate and Adaptations","Winds, Storms and Cyclones","Soil","Respiration in Organisms","Transportation in Animals and Plants","Reproduction in Plants","Motion and Time","Electric Current and its Effects","Light"],
    "English": ["Reading Comprehension","Grammar","Writing Skills","Literature"],
  },
  "8": {
    "Mathematics": ["Rational Numbers","Linear Equations in One Variable","Understanding Quadrilaterals","Practical Geometry","Data Handling","Squares and Square Roots","Cubes and Cube Roots","Comparing Quantities","Algebraic Expressions and Identities","Mensuration","Exponents and Powers","Direct and Inverse Proportions","Factorisation","Introduction to Graphs"],
    "Science": ["Crop Production and Management","Microorganisms","Coal and Petroleum","Combustion and Flame","Conservation of Plants and Animals","Cell Structure and Functions","Reproduction in Animals","Reaching the Age of Adolescence","Force and Pressure","Friction","Sound","Chemical Effects of Electric Current","Some Natural Phenomena","Light"],
    "English": ["Reading Comprehension","Grammar","Writing Skills","Literature"],
  },
  "9": {
    "Mathematics": ["Number Systems","Polynomials","Coordinate Geometry","Linear Equations in Two Variables","Introduction to Euclid's Geometry","Lines and Angles","Triangles","Quadrilaterals","Circles","Heron's Formula","Surface Areas and Volumes","Statistics"],
    "Science": ["Matter in Our Surroundings","Is Matter Around Us Pure","Atoms and Molecules","Structure of the Atom","The Fundamental Unit of Life","Tissues","Motion","Force and Laws of Motion","Gravitation","Work and Energy","Sound","Improvement in Food Resources"],
    "English": ["Reading Comprehension","Grammar","Writing Skills","Literature"],
  },
  "10": {
    "Mathematics": ["Real Numbers","Polynomials","Pair of Linear Equations in Two Variables","Quadratic Equations","Arithmetic Progressions","Triangles","Coordinate Geometry","Introduction to Trigonometry","Some Applications of Trigonometry","Circles","Areas Related to Circles","Surface Areas and Volumes","Statistics","Probability"],
    "Science": ["Chemical Reactions and Equations","Acids, Bases and Salts","Metals and Non-metals","Carbon and Its Compounds","Life Processes","Control and Coordination","How do Organisms Reproduce","Heredity and Evolution","Light – Reflection and Refraction","Human Eye and the Colourful World","Electricity","Magnetic Effects of Electric Current","Sources of Energy"],
    "English": ["Reading Comprehension","Grammar","Writing Skills","Literature"],
  },
}

const emptyForm = { subject: "", chapter: "", studentClass: "", dayNumber: "", title: "", question: "", option1: "", option2: "", option3: "", option4: "", answer: "" }

function AdminPanel() {
  const navigate = useNavigate()
  const admin = (() => { try { return JSON.parse(localStorage.getItem("admin")) } catch { return null } })()

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")
  const [tab, setTab] = useState("list")
  const [importResult, setImportResult] = useState(null)
  const [filters, setFilters] = useState({ subject: "", chapter: "", studentClass: "" })
  const fileRef = useRef()

  useEffect(() => { if (!admin) navigate("/admin/login") }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000) }

  const fetchQuestions = () => {
    setLoading(true)
    const p = new URLSearchParams({ schoolName: admin?.schoolName || "", ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) })
    fetch(`${BACKEND_URL}/api/questions/admin-list?${p}`)
      .then((r) => r.json())
      .then((d) => { setQuestions(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { if (admin) fetchQuestions() }, [filters])

  // ── Smart field update — reset dependent fields ──
  const updClass = (e) => setForm({ ...form, studentClass: e.target.value, subject: "", chapter: "" })
  const updSubject = (e) => setForm({ ...form, subject: e.target.value, chapter: "" })
  const upd = (f) => (e) => setForm({ ...form, [f]: e.target.value })
  const updFilter = (f) => (e) => setFilters({ ...filters, [f]: e.target.value })

  // ── Derived dropdown options ──
  const subjectOptions = form.studentClass ? (SUBJECTS_BY_CLASS[form.studentClass] || []) : []
  const chapterOptions = form.studentClass && form.subject ? (CHAPTERS_BY_CLASS_SUBJECT[form.studentClass]?.[form.subject] || []) : []

  const handleSave = async () => {
    const opts = [form.option1, form.option2, form.option3, form.option4]
    if (!form.subject || !form.chapter || !form.studentClass || !form.dayNumber || !form.question || opts.some((o) => !o) || !form.answer) {
      showToast("Please fill in all fields."); return
    }
    if (!opts.includes(form.answer)) { showToast("Answer must match one of the 4 options exactly."); return }

    setSaving(true)
    const payload = {
      addedBy: admin._id, schoolName: admin.schoolName,
      subject: form.subject, chapter: form.chapter,
      studentClass: form.studentClass, dayNumber: Number(form.dayNumber),
      title: form.title || `DPP Day ${form.dayNumber}`,
      question: form.question, options: opts, answer: form.answer,
    }

    const res = await fetch(
      editId ? `${BACKEND_URL}/api/questions/edit/${editId}` : `${BACKEND_URL}/api/questions/add`,
      { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    )
    const data = await res.json()
    if (res.ok) {
      showToast(editId ? "Question updated!" : "DPP question added!")
      setForm(emptyForm); setEditId(null); setTab("list"); fetchQuestions()
    } else { showToast(data.message || "Failed to save.") }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return
    const res = await fetch(`${BACKEND_URL}/api/questions/delete/${id}`, { method: "DELETE" })
    if (res.ok) { showToast("Deleted."); fetchQuestions() }
  }

  const startEdit = (q) => {
    setForm({ subject: q.subject, chapter: q.chapter, studentClass: q.studentClass, dayNumber: q.dayNumber, title: q.title, question: q.question, option1: q.options[0], option2: q.options[1], option3: q.options[2], option4: q.options[3], answer: q.answer })
    setEditId(q._id); setTab("add")
  }

  const handleExcel = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" })
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      const res = await fetch(`${BACKEND_URL}/api/questions/bulk-add`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: rows, addedBy: admin._id, schoolName: admin.schoolName }),
      })
      const data = await res.json()
      setImportResult(data); fetchQuestions()
    }
    reader.readAsBinaryString(file); e.target.value = ""
  }

  const downloadTemplate = () => {
    const sample = [{ subject: "Mathematics", chapter: "Real Numbers", studentClass: "10", dayNumber: 1, title: "DPP Day 1 - Basic Concepts", question: "What is HCF of 12 and 18?", option1: "2", option2: "6", option3: "12", option4: "3", answer: "6" }]
    const ws = XLSX.utils.json_to_sheet(sample)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "DPP Questions")
    XLSX.writeFile(wb, "dpp_template.xlsx")
  }

  const grouped = {}
  for (const q of questions) {
    const key = `Class ${q.studentClass} — ${q.subject} — ${q.chapter}`
    if (!grouped[key]) grouped[key] = {}
    const day = `Day ${q.dayNumber}: ${q.title || `DPP Day ${q.dayNumber}`}`
    if (!grouped[key][day]) grouped[key][day] = []
    grouped[key][day].push(q)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", fontFamily: "system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px" }}>🏫 Teacher Panel — {admin?.schoolName}</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Logged in as {admin?.name} ({admin?.role})</p>
        </div>
        <button onClick={() => { localStorage.removeItem("admin"); navigate("/admin/login") }}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          Logout
        </button>
      </div>

      {toast && <div style={{ position: "fixed", top: "20px", right: "20px", background: "#22c55e", color: "white", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", zIndex: 999, fontSize: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>{toast}</div>}

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px" }}>

        {/* Banner */}
        <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px", padding: "18px 22px", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "15px", color: "#a5b4fc" }}>How DPP Works</h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "13px", lineHeight: 1.7 }}>
            1. Select Class → Subject → Chapter from dropdowns — no manual typing needed!<br />
            2. Assign Day number and add your question with 4 options.<br />
            3. Students of that class will see DPP after completing the chapter.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px", marginBottom: "24px" }}>
          <div style={sCard}><p style={sLabel}>Total DPP Questions</p><h2 style={{ margin: 0, color: "#6366f1" }}>{questions.length}</h2></div>
          <div style={sCard}><p style={sLabel}>Chapters Covered</p><h2 style={{ margin: 0, color: "#22c55e" }}>{new Set(questions.map((q) => q.chapter)).size}</h2></div>
          <div style={sCard}><p style={sLabel}>Classes Assigned</p><h2 style={{ margin: 0, color: "#f59e0b" }}>{new Set(questions.map((q) => q.studentClass)).size}</h2></div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "22px", flexWrap: "wrap" }}>
          {[["list", "📋 View DPP"], ["add", editId ? "✏️ Edit" : "➕ Add DPP Question"], ["import", "📥 Import Excel"]].map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); if (k !== "add") { setForm(emptyForm); setEditId(null) } }}
              style={{ padding: "9px 18px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px", background: tab === k ? "#6366f1" : "#111827", color: tab === k ? "white" : "#64748b", outline: tab === k ? "none" : "1px solid #1f2937" }}>
              {l}
            </button>
          ))}
        </div>

        {/* ── LIST ── */}
        {tab === "list" && (
          <div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
              <input placeholder="Filter by subject..." value={filters.subject} onChange={updFilter("subject")} style={{ ...inp, flex: 1, minWidth: "140px", marginBottom: 0 }} />
              <input placeholder="Filter by chapter..." value={filters.chapter} onChange={updFilter("chapter")} style={{ ...inp, flex: 1, minWidth: "140px", marginBottom: 0 }} />
              <select value={filters.studentClass} onChange={updFilter("studentClass")} style={{ ...inp, minWidth: "130px", marginBottom: 0 }}>
                <option value="">All Classes</option>
                {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>

            {loading ? <p style={{ color: "#64748b" }}>Loading...</p>
              : questions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "#111827", borderRadius: "16px", border: "1px solid #1f2937" }}>
                  <h3>No DPP questions yet</h3>
                  <p style={{ color: "#64748b" }}>Add questions manually or import from Excel.</p>
                  <button onClick={() => setTab("add")} style={{ ...actBtn, background: "#6366f1", marginTop: "12px" }}>Add First Question</button>
                </div>
              ) : (
                Object.entries(grouped).map(([groupKey, days]) => (
                  <div key={groupKey} style={{ marginBottom: "24px" }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#6366f1", fontWeight: "700" }}>{groupKey}</h3>
                    {Object.entries(days).map(([dayKey, qs]) => (
                      <div key={dayKey} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "14px", padding: "18px 20px", marginBottom: "10px" }}>
                        <p style={{ margin: "0 0 12px", fontWeight: "700", fontSize: "14px", color: "#a5b4fc" }}>{dayKey}</p>
                        {qs.map((q, i) => (
                          <div key={q._id} style={{ borderTop: i > 0 ? "1px solid #1f2937" : "none", paddingTop: i > 0 ? "12px" : 0, marginTop: i > 0 ? "12px" : 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: "0 0 8px", fontSize: "14px", color: "white", fontWeight: "500" }}>{i + 1}. {q.question}</p>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  {q.options.map((opt) => (
                                    <span key={opt} style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "12px", background: opt === q.answer ? "rgba(34,197,94,0.15)" : "#1e293b", color: opt === q.answer ? "#22c55e" : "#64748b", border: opt === q.answer ? "1px solid rgba(34,197,94,0.3)" : "1px solid #1f2937", fontWeight: opt === q.answer ? "700" : "400" }}>
                                      {opt === q.answer ? "✓ " : ""}{opt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                                <button onClick={() => startEdit(q)} style={{ padding: "6px 12px", borderRadius: "7px", border: "1px solid #1f2937", background: "#1e293b", color: "#94a3b8", cursor: "pointer", fontSize: "12px" }}>Edit</button>
                                <button onClick={() => handleDelete(q._id)} style={{ padding: "6px 12px", borderRadius: "7px", border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.1)", color: "#f87171", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))
              )}
          </div>
        )}

        {/* ── ADD/EDIT ── */}
        {tab === "add" && (
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "28px" }}>
            <h3 style={{ margin: "0 0 20px" }}>{editId ? "Edit DPP Question" : "Add DPP Question"}</h3>

            {/* Step 1 — Class, Subject, Chapter, Day */}
            <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
              <p style={{ margin: "0 0 14px", color: "#a5b4fc", fontSize: "13px", fontWeight: "600" }}>📌 Step 1 — Select Class, Subject & Chapter</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr 1fr", gap: "12px" }}>

                {/* Class */}
                <div>
                  <label style={lbl}>Class *</label>
                  <select value={form.studentClass} onChange={updClass} style={inp}>
                    <option value="">Select Class</option>
                    {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>

                {/* Subject — depends on class */}
                <div>
                  <label style={lbl}>Subject *</label>
                  <select value={form.subject} onChange={updSubject} disabled={!form.studentClass} style={{ ...inp, opacity: form.studentClass ? 1 : 0.4 }}>
                    <option value="">{form.studentClass ? "Select Subject" : "Select class first"}</option>
                    {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Chapter — depends on class + subject */}
                <div>
                  <label style={lbl}>Chapter *</label>
                  <select value={form.chapter} onChange={upd("chapter")} disabled={!form.subject} style={{ ...inp, opacity: form.subject ? 1 : 0.4 }}>
                    <option value="">{form.subject ? "Select Chapter" : "Select subject first"}</option>
                    {chapterOptions.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
                  </select>
                </div>

                {/* Day Number */}
                <div>
                  <label style={lbl}>DPP Day *</label>
                  <input type="number" min="1" placeholder="e.g. 1" value={form.dayNumber} onChange={upd("dayNumber")} style={inp} />
                </div>
              </div>

              {/* Title */}
              <label style={lbl}>DPP Title (optional)</label>
              <input placeholder="e.g. DPP Day 1 - Basic Concepts" value={form.title} onChange={upd("title")} style={{ ...inp, marginBottom: 0 }} />
            </div>

            {/* Step 2 — Question */}
            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
              <p style={{ margin: "0 0 14px", color: "#86efac", fontSize: "13px", fontWeight: "600" }}>✏️ Step 2 — Write Question & Options</p>
              <label style={lbl}>Question *</label>
              <textarea placeholder="Type the question here..." value={form.question} onChange={upd("question")} style={{ ...inp, height: "80px", resize: "vertical" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {["option1", "option2", "option3", "option4"].map((o, i) => (
                  <div key={o}><label style={lbl}>Option {i + 1} *</label><input placeholder={`Option ${i + 1}`} value={form[o]} onChange={upd(o)} style={inp} /></div>
                ))}
              </div>

              <label style={lbl}>Correct Answer * <span style={{ color: "#475569", fontWeight: "400" }}>(select from options above)</span></label>
              <select value={form.answer} onChange={upd("answer")} style={{ ...inp, marginBottom: 0 }}>
                <option value="">Select correct answer</option>
                {[form.option1, form.option2, form.option3, form.option4].filter(Boolean).map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <button onClick={handleSave} disabled={saving} style={{ ...actBtn, background: "#6366f1" }}>{saving ? "Saving..." : editId ? "Update Question" : "Add Question"}</button>
              <button onClick={() => { setForm(emptyForm); setEditId(null); setTab("list") }} style={{ ...actBtn, background: "#1e293b", outline: "1px solid #1f2937" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── IMPORT ── */}
        {tab === "import" && (
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "28px" }}>
            <h3 style={{ margin: "0 0 8px" }}>Import DPP Questions from Excel</h3>
            <p style={{ color: "#64748b", marginBottom: "22px", fontSize: "14px" }}>Upload an Excel file with the required columns.</p>
            <div style={{ background: "#0b0b12", border: "1px solid #1f2937", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px", fontSize: "14px" }}>Required Excel Columns:</h4>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                {["subject", "chapter", "studentClass", "dayNumber", "title", "question", "option1", "option2", "option3", "option4", "answer"].map((c) => (
                  <span key={c} style={{ padding: "3px 10px", background: "#1e293b", border: "1px solid #1f2937", borderRadius: "5px", fontSize: "12px", color: "#94a3b8", fontFamily: "monospace" }}>{c}</span>
                ))}
              </div>
              <button onClick={downloadTemplate} style={{ ...actBtn, background: "#1e293b", outline: "1px solid #1f2937", fontSize: "13px", padding: "9px 16px" }}>⬇ Download Template</button>
            </div>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleExcel} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ ...actBtn, background: "#6366f1", marginBottom: "18px" }}>📂 Choose Excel File</button>
            {importResult && (
              <div style={{ background: "#0b0b12", border: "1px solid #1f2937", borderRadius: "12px", padding: "18px" }}>
                <p style={{ margin: "0 0 6px", color: "#22c55e", fontWeight: "700" }}>✅ {importResult.message}</p>
                {importResult.errors?.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <p style={{ margin: "0 0 6px", color: "#f87171", fontWeight: "600", fontSize: "13px" }}>Errors found:</p>
                    {importResult.errors.map((e, i) => <p key={i} style={{ margin: "0 0 3px", color: "#f87171", fontSize: "12px" }}>• {e}</p>)}
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

const sCard = { background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px 18px" }
const sLabel = { margin: "0 0 6px", color: "#64748b", fontSize: "12px" }
const lbl = { display: "block", marginBottom: "5px", color: "#94a3b8", fontSize: "13px", fontWeight: "500" }
const inp = { width: "100%", padding: "10px 12px", marginBottom: "14px", borderRadius: "9px", border: "1px solid #1f2937", background: "#1e293b", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }
const actBtn = { padding: "11px 22px", borderRadius: "10px", border: "none", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }

export default AdminPanel