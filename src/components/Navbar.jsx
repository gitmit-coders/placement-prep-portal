import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">📚</span>
        <div className="logo-text">
          <span className="logo-main">EduExam</span>
          <span className="logo-sub">Class 6–10 Portal</span>
        </div>
      </Link>

      {/* Hamburger for mobile */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`ham-line ${menuOpen ? "open" : ""}`}></span>
        <span className={`ham-line ${menuOpen ? "open" : ""}`}></span>
        <span className={`ham-line ${menuOpen ? "open" : ""}`}></span>
      </button>

      {/* Nav Links */}
      <div className={`navbar-links ${menuOpen ? "mobile-open" : ""}`}>
        <Link
          to="/"
          className={`nav-link ${isActive("/") ? "active" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

        {user && (
          <>
            <Link
              to="/books"
              className={`nav-link ${isActive("/books") ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              📝 Quiz
            </Link>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/leaderboard"
              className={`nav-link ${isActive("/leaderboard") ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              🏆 Leaderboard
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              👤 Profile
            </Link>
          </>
        )}

        {/* Auth section */}
        <div className="navbar-auth">
          {!user ? (
            <>
              <Link
                to="/login"
                className="btn-outline"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="user-badge">
                <span className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="user-name">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;