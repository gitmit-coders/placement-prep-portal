import { Link } from "react-router-dom"

function Books() {
  const user = JSON.parse(localStorage.getItem("user"))

  const booksByClass = {
    "9": ["Mathematics", "Science", "English"],
    "10": ["Mathematics", "Science", "English"],
    "11": ["Mathematics", "Physics", "Chemistry"],
    "12": ["Mathematics", "Physics", "Chemistry"],
  }

  const books = booksByClass[user?.studentClass] || []

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
        Select Your Book 📚
      </h1>

      <p style={{ color: "#9ca3af", marginBottom: "30px" }}>
        Class {user?.studentClass}
      </p>

      {books.length === 0 ? (
        <h2>No books found for your class.</h2>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {books.map((book) => (
            <Link
              key={book}
              to={`/chapters/${book}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#111827",
                  padding: "30px",
                  borderRadius: "18px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <h2>{book}</h2>
                <p style={{ color: "#9ca3af" }}>
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