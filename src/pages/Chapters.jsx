import { Link, useParams } from "react-router-dom"

function Chapters() {
  const { bookName } = useParams()

  const chaptersByBook = {
    Mathematics: [
      "Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables",
      "Quadratic Equations", "Arithmetic Progressions", "Triangles",
      "Coordinate Geometry", "Introduction to Trigonometry",
      "Some Applications of Trigonometry", "Circles", "Areas Related to Circles",
      "Surface Areas and Volumes", "Statistics", "Probability",
    ],
    Science: [
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-metals",
      "Carbon and Its Compounds",
      "Life Processes",
      "Control and Coordination",
      "How do Organisms Reproduce",
      "Heredity and Evolution",
      "Light – Reflection and Refraction",
      "Human Eye and the Colourful World",
      "Electricity",
      "Magnetic Effects of Electric Current",
      "Sources of Energy",
    ],
    English: ["Reading Comprehension", "Grammar", "Writing Skills", "Literature"],
    Physics: ["Motion", "Laws of Motion", "Work Energy Power", "Electric Charges", "Optics"],
    Chemistry: ["Basic Concepts", "Atomic Structure", "Chemical Bonding", "Thermodynamics"],
  }

  const chapters = chaptersByBook[bookName] || []

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", padding: "40px" }}>
      <Link to="/books" style={{ color: "#64748b", fontSize: "14px", textDecoration: "none" }}>
        ← Back to Books
      </Link>

      <h1 style={{ marginBottom: "6px", marginTop: "16px" }}>{bookName}</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "14px" }}>
        Select a chapter — then choose PYQ Practice or Daily Practice Problems (DPP).
      </p>

      {chapters.length === 0 ? (
        <h2>No chapters found.</h2>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>
          {chapters.map((chapter, i) => (
            <div key={chapter} style={chapterCard}>
              <div style={{ marginBottom: "14px" }}>
                <span style={chapNum}>Chapter {i + 1}</span>
                <h2 style={{ margin: "6px 0 6px", fontSize: "17px", color: "white" }}>{chapter}</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                  Practice questions from this chapter.
                </p>
              </div>

              <div style={{ borderTop: "1px solid #1f2937", paddingTop: "14px", display: "flex", gap: "10px" }}>
                <Link
                  to={`/quiz?book=${encodeURIComponent(bookName)}&chapter=${encodeURIComponent(chapter)}`}
                  style={{ flex: 1, textDecoration: "none" }}
                >
                  <button style={pyqBtn}>
                    <span style={{ fontSize: "16px" }}>📝</span>
                    <span>PYQ</span>
                    <span style={{ fontSize: "11px", color: "#a5b4fc", fontWeight: "400" }}>Practice</span>
                  </button>
                </Link>

                <Link
                  to={`/dpp?subject=${encodeURIComponent(bookName)}&chapter=${encodeURIComponent(chapter)}`}
                  style={{ flex: 1, textDecoration: "none" }}
                >
                  <button style={dppBtn}>
                    <span style={{ fontSize: "16px" }}>📅</span>
                    <span>DPP</span>
                    <span style={{ fontSize: "11px", color: "#86efac", fontWeight: "400" }}>Daily</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const chapterCard = {
  background: "#111827",
  border: "1px solid #1f2937",
  padding: "22px",
  borderRadius: "18px",
  transition: "border-color 0.2s",
}
const chapNum = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6366f1",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
}
const pyqBtn = {
  width: "100%",
  padding: "12px 8px",
  borderRadius: "10px",
  border: "1px solid rgba(99,102,241,0.3)",
  background: "rgba(99,102,241,0.1)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2px",
}
const dppBtn = {
  width: "100%",
  padding: "12px 8px",
  borderRadius: "10px",
  border: "1px solid rgba(34,197,94,0.3)",
  background: "rgba(34,197,94,0.08)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2px",
}

export default Chapters