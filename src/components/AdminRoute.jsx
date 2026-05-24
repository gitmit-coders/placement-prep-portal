import { Navigate } from "react-router-dom"

// Protects admin routes — students cannot access teacher panel
function AdminRoute({ children }) {
  const admin = (() => {
    try { return JSON.parse(localStorage.getItem("admin")) }
    catch { return null }
  })()

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminRoute