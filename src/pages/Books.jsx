import { Link } from "react-router-dom"

function Books() {
  const user = JSON.parse(localStorage.getItem("user"))

  const booksByClass = {
    "6": [
      { name: "Mathematics (Class 6)", label: "Mathematics" },
      { name: "Science (Class 6)", label: "Science" },
      { name: "English (Class 6)", label: "English" },
    ],
    "7": [
      { name: "Mathematics (Class 7)", label: "Mathematics" },
      { name: "Science (Class 7)", label: "Science" },
      { name: "English (Class 7)", label: "English" },
    ],
    "8": [
      { name: "Mathematics (Class 8)", label: "Mathematics" },
      { name: "Science (Class 8)", label: "Science" },
      { name: "English (Class 8)", label: "English" },
    ],
    "9": [
      { name: "Mathematics (Class 9)", label: "Mathematics" },
      { name: "Science (Class 9)", label: "Science" },
      { name: "English (Class 9)", label: "English" },
    ],
    "10": [
      { name: "Mathematics (Class 10)", label: "Mathematics" },
      { name: "Science (Class 10)", label: "Science" },
      { name: "English (Class 10)", label: "English" },
    ],
  }

  const books = booksByClass[user?.studentClass] || []

  const bookIcons = {
    "Mathematics": "📐",
    "Science": "🔬",
    "English": "📖",
    "Physics": "⚡",
    "Chemistry": "🧪",
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b12", color: "white", padding: "40px" }}>
      <h1 style={{ marginBottom: "6px" }}>Select Your Subject 📚</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>
        Class {user?.studentClass} — Choose a subject to view chapters
      </p>

      {books.length === 0 ? (
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
          <h2>No books found for Class {user?.studentClass}</h2>
          <p style={{ color: "#64748b" }}>Contact your school administrator.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
          {books.map((book) => (
            <Link key={book.name} to={`/chapters/${encodeURIComponent(book.name)}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#111827", padding: "30px", borderRadius: "18px",
                color: "white", cursor: "pointer", border: "1px solid #1f2937",
                transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "translateY(-3px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1f2937"; e.currentTarget.style.transform = "translateY(0)" }}
              >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                  {bookIcons[book.label] || "📚"}
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: "20px" }}>{book.label}</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                  View chapters and start test
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Books