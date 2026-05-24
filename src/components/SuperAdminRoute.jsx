import { Navigate } from "react-router-dom"

function SuperAdminRoute({ children }) {
  const superadmin = (() => {
    try { return JSON.parse(localStorage.getItem("superadmin")) }
    catch { return null }
  })()

  if (!superadmin || superadmin.role !== "superadmin") {
    return <Navigate to="/super-admin/login" replace />
  }

  return children
}

export default SuperAdminRoute