import { Link } from "react-router-dom"
import "./Home.css"

function Home() {
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")) } catch { return null } })()
  const admin = (() => { try { return JSON.parse(localStorage.getItem("admin")) } catch { return null } })()

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80"
            alt="Students studying"
            className="hero-img"
          />
          <div className="hero-overlay" />
        </div>

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
            A professional exam platform for schools. Students practice
            chapter-wise MCQ tests and Daily Practice Problems. Teachers
            manage content from their own panel.
          </p>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { num: "5", label: "Classes" },
              { num: "PYQ", label: "Practice Bank" },
              { num: "DPP", label: "Daily Problems" },
              { num: "Live", label: "Leaderboard" },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO PORTALS ── */}
      <section className="portals-section">
        <div className="portals-header">
          <p className="section-tag">Choose Your Portal</p>
          <h2 className="section-title">Who are you?</h2>
          <p className="section-sub">
            This platform has two separate areas — one for students and one for teachers.
            Select the right one below.
          </p>
        </div>

        <div className="portals-grid">

          {/* ── STUDENT PORTAL ── */}
          <div className="portal-card portal-student">
            <div className="portal-icon">🎓</div>
            <h2 className="portal-title">Student Portal</h2>
            <p className="portal-desc">
              Attempt chapter-wise PYQ tests, solve your teacher's Daily Practice
              Problems, track your scores on the dashboard, and compete on the
              class leaderboard.
            </p>
            <ul className="portal-features">
              <li>📝 PYQ Practice — chapter-wise MCQ bank</li>
              <li>📅 DPP — daily problems set by your teacher</li>
              <li>📊 Performance dashboard with charts</li>
              <li>🏆 Class leaderboard with live rankings</li>
            </ul>
            <div className="portal-actions">
              {user ? (
                <Link to="/books" className="portal-btn-primary">Go to Dashboard →</Link>
              ) : (
                <>
                  <Link to="/register" className="portal-btn-primary">Register as Student →</Link>
                  <Link to="/login" className="portal-btn-ghost">Already registered? Sign In</Link>
                </>
              )}
            </div>
          </div>

          {/* ── TEACHER PORTAL ── */}
          <div className="portal-card portal-teacher">
            <div className="portal-icon">🏫</div>
            <h2 className="portal-title">Teacher Portal</h2>
            <p className="portal-desc">
              Add and manage Daily Practice Problems for your classes. Organise
              DPP by subject, chapter, and day number. Import questions in bulk
              from Excel.
            </p>
            <ul className="portal-features">
              <li>➕ Add DPP questions for any chapter</li>
              <li>✏️ Edit or delete existing questions</li>
              <li>📥 Bulk import via Excel file</li>
              <li>🔒 Separate login — students cannot access</li>
            </ul>
            <div className="portal-actions">
              {admin ? (
                <Link to="/admin/panel" className="portal-btn-teacher">Go to Teacher Panel →</Link>
              ) : (
                <Link to="/admin/login" className="portal-btn-teacher">Teacher Login →</Link>
              )}
              <p className="portal-note">
                Teachers need an account created by the school administrator.
              </p>
            </div>
          </div>

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
            { n: "01", title: "Teacher Adds DPP", desc: "Teacher logs in and adds daily practice questions for each chapter and class." },
            { n: "02", title: "Student Registers", desc: "Student creates an account and selects their class." },
            { n: "03", title: "Attempt Tests", desc: "Student solves PYQ or DPP for each chapter after class." },
            { n: "04", title: "Track Progress", desc: "Scores appear on dashboard and class leaderboard instantly." },
          ].map((s) => (
            <div key={s.n} className="step-card">
              <span className="step-num">{s.n}</span>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home