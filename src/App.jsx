import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Books from "./pages/Books";
import Chapters from "./pages/Chapters";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Put your backend URL in one place — easy to change later
const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com";

function App() {
  useEffect(() => {
    // ✅ FIX: Broken URL was the main crash reason — now corrected
    fetch(`${BACKEND_URL}/`)
      .then((res) => res.text())
      .then((data) => console.log("Backend says:", data))
      .catch((err) => console.log("Backend wakeup ping failed:", err));

    // ✅ Keep-alive: Render free tier sleeps after 15 mins inactivity
    // This pings the backend every 10 minutes to keep it awake
    const keepAlive = setInterval(() => {
      fetch(`${BACKEND_URL}/`)
        .catch(() => {}); // silently ignore errors
    }, 10 * 60 * 1000); // every 10 minutes

    return () => clearInterval(keepAlive);
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chapters/:bookName"
          element={
            <ProtectedRoute>
              <Chapters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;