import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Quiz from "./pages/Quiz"
import Dashboard from "./pages/Dashboard"
import Leaderboard from "./pages/Leaderboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Books from "./pages/Books"
import Chapters from "./pages/Chapters"
import DPP from "./pages/DPP"
import AdminLogin from "./pages/AdminLogin"
import AdminPanel from "./pages/AdminPanel"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

const BACKEND_URL = "https://placement-prep-backend-n0rx.onrender.com"

function App() {
  useEffect(() => {
    fetch(`${BACKEND_URL}/`).catch(() => {})
    const keepAlive = setInterval(() => fetch(`${BACKEND_URL}/`).catch(() => {}), 10 * 60 * 1000)
    return () => clearInterval(keepAlive)
  }, [])

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin — protected by AdminRoute, students cannot enter */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/panel" element={
          <AdminRoute><AdminPanel /></AdminRoute>
        } />

        {/* Student — protected by ProtectedRoute */}
        <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
        <Route path="/chapters/:bookName" element={<ProtectedRoute><Chapters /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/dpp" element={<ProtectedRoute><DPP /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App