import { Link, useParams } from "react-router-dom"

function Chapters() {
  const { bookName } = useParams()

  const chaptersByBook = {
    Mathematics: [
  "Real Numbers",
  "Polynomials",
  "Pair of Linear Equations in Two Variables",
  "Quadratic Equations",
  "Arithmetic Progressions",
  "Triangles",
  "Coordinate Geometry",
  "Introduction to Trigonometry",
  "Some Applications of Trigonometry",
  "Circles",
  "Areas Related to Circles",
  "Surface Areas and Volumes",
  "Statistics",
  "Probability",
],

    Science: [
      "Matter",
      "Atoms and Molecules",
      "Life Processes",
      "Electricity",
      "Light",
    ],

    English: [
      "Reading Comprehension",
      "Grammar",
      "Writing Skills",
      "Literature",
    ],

    Physics: [
      "Motion",
      "Laws of Motion",
      "Work Energy Power",
      "Electric Charges",
      "Optics",
    ],

    Chemistry: [
      "Basic Concepts",
      "Atomic Structure",
      "Chemical Bonding",
      "Thermodynamics",
    ],
  }

  const chapters = chaptersByBook[bookName] || []

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b12",
        color: "white",
        padding: "40px",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>
        {bookName} Chapters 📘
      </h1>

      <p style={{ color: "#9ca3af", marginBottom: "30px" }}>
        Select a chapter to start your assessment.
      </p>

      {chapters.length === 0 ? (
        <h2>No chapters found.</h2>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          {chapters.map((chapter) => (
            <div
              key={chapter}
              style={{
                background: "#111827",
                padding: "25px",
                borderRadius: "18px",
              }}
            >
              <h2>{chapter}</h2>

              <p style={{ color: "#9ca3af" }}>
                Practice questions from this chapter.
              </p>

              <Link to={`/quiz?book=${bookName}&chapter=${chapter}`}>
                <button
                  style={{
                    marginTop: "15px",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#6366f1",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Start Test
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Chapters