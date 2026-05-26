import { Link, useParams, useNavigate } from "react-router-dom"

function Chapters() {
  const { bookName } = useParams()
  const navigate = useNavigate()
  const decodedBook = decodeURIComponent(bookName)

  const chaptersByBook = {
    // ── CLASS 10 ──
    "Mathematics (Class 10)": [
      "Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables",
      "Quadratic Equations", "Arithmetic Progressions", "Triangles",
      "Coordinate Geometry", "Introduction to Trigonometry",
      "Some Applications of Trigonometry", "Circles",
      "Areas Related to Circles", "Surface Areas and Volumes",
      "Statistics", "Probability",
    ],
    "Science (Class 10)": [
      "Chemical Reactions and Equations", "Acids, Bases and Salts",
      "Metals and Non-metals", "Carbon and its Compounds",
      "Life Processes", "Control and Coordination",
      "How do Organisms Reproduce?", "Heredity and Evolution",
      "Light - Reflection and Refraction", "Human Eye and Colourful World",
      "Electricity", "Magnetic Effects of Electric Current",
      "Sources of Energy",
    ],
    "English (Class 10)": [
      "Reading Comprehension", "Grammar", "Writing Skills", "Literature",
    ],

    // ── CLASS 9 ──
    "Mathematics (Class 9)": [
      "Number Systems", "Polynomials", "Coordinate Geometry",
      "Linear Equations in Two Variables", "Introduction to Euclid's Geometry",
      "Lines and Angles", "Triangles", "Quadrilaterals",
      "Circles", "Heron's Formula", "Surface Areas and Volumes", "Statistics",
    ],
    "Science (Class 9)": [
      "Matter in Our Surroundings", "Is Matter Around Us Pure",
      "Atoms and Molecules", "Structure of the Atom",
      "The Fundamental Unit of Life", "Tissues",
      "Motion", "Force and Laws of Motion",
      "Gravitation", "Work and Energy", "Sound",
      "Improvement in Food Resources",
    ],
    "English (Class 9)": [
      "Reading Comprehension", "Grammar", "Writing Skills", "Literature",
    ],

    // ── CLASS 8 ──
    "Mathematics (Class 8)": [
      "Rational Numbers", "Linear Equations in One Variable",
      "Understanding Quadrilaterals", "Practical Geometry",
      "Data Handling", "Squares and Square Roots",
      "Cubes and Cube Roots", "Comparing Quantities",
      "Algebraic Expressions and Identities", "Mensuration",
      "Exponents and Powers", "Direct and Inverse Proportions",
      "Factorisation", "Introduction to Graphs",
    ],
    "Science (Class 8)": [
      "Crop Production and Management", "Microorganisms",
      "Coal and Petroleum", "Combustion and Flame",
      "Conservation of Plants and Animals", "Cell Structure and Functions",
      "Reproduction in Animals", "Reaching the Age of Adolescence",
      "Force and Pressure", "Friction", "Sound",
      "Chemical Effects of Electric Current", "Some Natural Phenomena", "Light",
    ],
    "English (Class 8)": [
      "Reading Comprehension", "Grammar", "Writing Skills", "Literature",
    ],

    // ── CLASS 7 ──
    "Mathematics (Class 7)": [
      "Integers", "Fractions and Decimals", "Data Handling",
      "Simple Equations", "Lines and Angles",
      "The Triangle and its Properties", "Comparing Quantities",
      "Rational Numbers", "Perimeter and Area",
      "Algebraic Expressions", "Exponents and Powers", "Symmetry",
    ],
    "Science (Class 7)": [
      "Nutrition in Plants", "Nutrition in Animals",
      "Fibre to Fabric", "Heat", "Acids, Bases and Salts",
      "Physical and Chemical Changes", "Weather, Climate and Adaptations",
      "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms",
      "Transportation in Animals and Plants", "Reproduction in Plants",
      "Motion and Time", "Electric Current and its Effects", "Light",
    ],
    "English (Class 7)": [
      "Reading Comprehension", "Grammar", "Writing Skills", "Literature",
    ],

    // ── CLASS 6 ──
    "Mathematics (Class 6)": [
      "Knowing Our Numbers", "Whole Numbers", "Playing with Numbers",
      "Basic Geometrical Ideas", "Understanding Elementary Shapes",
      "Integers", "Fractions", "Decimals",
      "Data Handling", "Mensuration", "Algebra", "Ratio and Proportion",
    ],
    "Science (Class 6)": [
      "Food: Where Does it Come From?", "Components of Food",
      "Fibre to Fabric", "Sorting Materials into Groups",
      "Separation of Substances", "Changes Around Us",
      "Getting to Know Plants", "Body Movements",
      "The Living Organisms and their Surroundings",
      "Motion and Measurement of Distances",
      "Light, Shadows and Reflections", "Electricity and Circuits",
      "Fun with Magnets", "Water", "Air Around Us",
    ],
    "English (Class 6)": [
      "Reading Comprehension", "Grammar", "Writing Skills", "Literature",
    ],
  }

  const chapters = chaptersByBook[decodedBook] || []

  // Extract subject label for display
  const subjectLabel = decodedBook.replace(/ \(Class \d+\)/, "")

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", padding: "40px" }}>
      <button onClick={() => navigate("/books")}
        style={{ background: "none", border: "1px solid #1f2937", color: "#64748b", padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", marginBottom: "20px" }}>
        ← Back to Books
      </button>

      <h1 style={{ marginBottom: "6px" }}>{subjectLabel}</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "14px" }}>
        {decodedBook} — Select a chapter to practice
      </p>

      {chapters.length === 0 ? (
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
          <h2>No chapters found</h2>
          <p style={{ color: "#64748b" }}>Chapters for this subject are coming soon.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>
          {chapters.map((chapter, i) => (
            <div key={chapter} style={{ background: "#111827", border: "1px solid #1f2937", padding: "22px", borderRadius: "18px", transition: "border-color 0.2s" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Chapter {i + 1}
              </span>
              <h2 style={{ margin: "6px 0 6px", fontSize: "17px", color: "white" }}>{chapter}</h2>
              <p style={{ margin: "0 0 14px", color: "#64748b", fontSize: "13px" }}>
                Practice questions from this chapter.
              </p>

              <div style={{ borderTop: "1px solid #1f2937", paddingTop: "14px", display: "flex", gap: "10px" }}>
                <Link
                  to={`/quiz?book=${encodeURIComponent(decodedBook)}&chapter=${encodeURIComponent(chapter)}`}
                  style={{ flex: 1, textDecoration: "none" }}
                >
                  <button style={pyqBtn}>
                    <span style={{ fontSize: "16px" }}>📝</span>
                    <span>PYQ</span>
                    <span style={{ fontSize: "11px", color: "#a5b4fc", fontWeight: "400" }}>Practice</span>
                  </button>
                </Link>

                <Link
                  to={`/dpp?subject=${encodeURIComponent(decodedBook)}&chapter=${encodeURIComponent(chapter)}`}
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

const pyqBtn = {
  width: "100%", padding: "12px 8px", borderRadius: "10px",
  border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.1)",
  color: "white", fontWeight: "700", cursor: "pointer", fontSize: "14px",
  display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
}
const dppBtn = {
  width: "100%", padding: "12px 8px", borderRadius: "10px",
  border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)",
  color: "white", fontWeight: "700", cursor: "pointer", fontSize: "14px",
  display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
}

export default Chapters