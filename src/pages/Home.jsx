import { Link } from "react-router-dom"
import "./Home.css"

function Home() {
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        {/* Background photo with dark overlay */}
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80"
            alt="Students studying"
            className="hero-img"
          />
          <div className="hero-overlay" />
        </div>

        {/* If you have your OWN photo, put it in public/ folder
            and replace the src above with: src="/your-photo.jpg" */}

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Class 6 – 10 &nbsp;|&nbsp; MCQ Exam Platform
          </div>

          <h1 className="hero-title">
            Prepare Smarter.<br />
            <span className="hero-accent">Perform Better.</span>
          </h1>

          <p className="hero-subtitle">
            A professional exam platform built for schools. Students practice
            chapter-wise MCQ tests, track their progress, and compete on
            live class leaderboards.
          </p>

          <div className="hero-buttons">
            {user ? (
              <Link to="/books" className="btn-primary">Start a Quiz →</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">Get Started Free →</Link>
                <Link to="/login" className="btn-ghost">Sign In</Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { num: "5", label: "Classes Covered" },
              { num: "MCQ", label: "Based Testing" },
              { num: "Live", label: "Leaderboards" },
              { num: "100%", label: "Free for Schools" },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section features-section">
        <div className="section-header">
          <p className="section-tag">Platform Features</p>
          <h2 className="section-title">Everything a School Needs</h2>
          <p className="section-sub">
            Designed to help students improve and give schools full visibility
            into performance.
          </p>
        </div>

        <div className="features-grid">
          {[
            {
              icon: "📝",
              color: "#6366f1",
              title: "Chapter-Wise MCQ Tests",
              desc: "Students select their book and chapter, then attempt timed MCQ tests — just like a real exam.",
            },
            {
              icon: "📊",
              color: "#22c55e",
              title: "Performance Dashboard",
              desc: "Detailed analytics on score, accuracy, and time spent — visualised as charts across every attempt.",
            },
            {
              icon: "🏆",
              color: "#f59e0b",
              title: "Class Leaderboard",
              desc: "Live rankings filtered by class. Students see where they stand and are motivated to improve.",
            },
            {
              icon: "🏫",
              color: "#8b5cf6",
              title: "School Management Ready",
              desc: "Schools can conduct exams on schedule. Easy to set up, easy to present to management.",
            },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ "--accent": f.color }}>
              <div className="feature-icon-wrap" style={{ background: `${f.color}18` }}>
                <span className="feature-icon">{f.icon}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section steps-section">
        <div className="section-header">
          <p className="section-tag">Simple Process</p>
          <h2 className="section-title">How It Works</h2>
        </div>

        <div className="steps-grid">
          {[
            { n: "01", title: "Register", desc: "Student creates an account and selects their class." },
            { n: "02", title: "Choose Chapter", desc: "Browse subjects, pick a book and chapter to test." },
            { n: "03", title: "Attempt Quiz", desc: "Answer MCQ questions within the time limit." },
            { n: "04", title: "View Results", desc: "Instant score, accuracy, and updated leaderboard rank." },
          ].map((s, i) => (
            <div key={i} className="step-card">
              <span className="step-num">{s.n}</span>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOR SCHOOLS CTA ── */}
      <section className="school-cta">
        <div className="school-cta-inner">
          <div className="school-cta-text">
            <p className="section-tag" style={{ color: "#818cf8" }}>For School Administrators</p>
            <h2 style={{ margin: "8px 0 12px", fontSize: "28px" }}>
              Bring This Platform to Your School
            </h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
              Improve student engagement, track class performance, and conduct
              digital exams — all through one organised platform. Suitable for
              classes 6 through 10.
            </p>
          </div>
          <div className="school-cta-action">
            {!user && (
              <Link to="/register" className="btn-primary" style={{ display: "inline-block" }}>
                Register Your School →
              </Link>
            )}
            <Link to="/leaderboard" className="btn-ghost" style={{ display: "inline-block", marginTop: "12px" }}>
              View Live Leaderboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home