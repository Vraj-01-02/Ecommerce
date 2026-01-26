import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const { role, permissions = [] } = decoded;

    // 👑 Super Admin → full access
    if (role === "SuperAdmin") {
      return children;
    }

    // 🔐 Permission check
    if (requiredPermission && !permissions.includes(requiredPermission)) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
