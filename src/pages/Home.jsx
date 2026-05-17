import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  return (
    <main>
      <h2>Welcome Student 👋</h2>
      <p>Start your placement preparation here.</p>

      <button onClick={() => navigate("/quiz")}>
        Start Quiz
      </button>
    </main>
  )
}

export default Home