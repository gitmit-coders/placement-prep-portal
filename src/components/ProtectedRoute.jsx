import { Navigate, useLocation } from "react-router-dom";

// ✅ Saves the page user was trying to visit, redirects back after login
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!user) {
    // Pass the original destination so Login can redirect back
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ✅ Basic validation: make sure stored user is valid JSON
  try {
    JSON.parse(localStorage.getItem("user"));
  } catch {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;