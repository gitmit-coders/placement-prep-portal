import { Link } from "react-router-dom"
import "./Home.css"

function Home() {
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">Class 6 – 10 Exam Platform</div>
        <h1 className="hero-title">
          Get Yourself <span className="hero-accent">Exam Ready</span>
        </h1>
        <p className="hero-subtitle">
          Smart MCQ tests, live rankings, aur detailed analytics —
          sab kuch ek jagah. Schools ke liye designed, students ke liye built.
        </p>
        <div className="hero-buttons">
          {user ? (
            <Link to="/books" className="btn-hero-primary">Start Quiz →</Link>
          ) : (
            <>
              <Link to="/register" className="btn-hero-primary">Get Started →</Link>
              <Link to="/login" className="btn-hero-outline">Login</Link>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">5</span>
            <span className="stat-label">Classes</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">MCQ</span>
            <span className="stat-label">Based Tests</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">Live</span>
            <span className="stat-label">Leaderboard</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">Free</span>
            <span className="stat-label">For Schools</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="section-title">What We Offer</h2>
        <p className="section-sub">Sab kuch jo ek school exam portal mein hona chahiye</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(99,102,241,0.15)" }}>📝</div>
            <h3>Online MCQ Tests</h3>
            <p>Book aur chapter ke hisaab se tests. Timer ke saath practice karo, real exam feel lo.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(34,197,94,0.15)" }}>📊</div>
            <h3>Smart Dashboard</h3>
            <p>Score, accuracy aur time ka detailed analysis. Apni progress track karo attempt by attempt.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(234,179,8,0.15)" }}>🏆</div>
            <h3>Class Leaderboard</h3>
            <p>Class-wise ranking jo students ko daily improve karne ke liye motivate karta hai.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(139,92,246,0.15)" }}>🏫</div>
            <h3>School Ready</h3>
            <p>Schools apne students ke liye exams schedule kar sakte hain. Easy management, better results.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2 className="section-title">Kaise Kaam Karta Hai?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h4>Register Karo</h4>
            <p>Student apna account banata hai apni class select karke</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">2</div>
            <h4>Chapter Chuno</h4>
            <p>Book aur chapter select karo jiska test dena hai</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">3</div>
            <h4>Quiz Do</h4>
            <p>Timer ke saath MCQ questions solve karo</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">4</div>
            <h4>Result Dekho</h4>
            <p>Dashboard pe score aur leaderboard pe rank dekho</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta">
          <h2>Ready to start? 🚀</h2>
          <p>Abhi register karo aur apna pehla quiz do</p>
          <Link to="/register" className="btn-hero-primary">Register Now →</Link>
        </section>
      )}

    </div>
  )
}

export default Home