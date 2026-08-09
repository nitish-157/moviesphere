import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Wrap admin-only routes (e.g. /admin) with this instead of ProtectedRoute.
// Non-admins are sent back to the home page rather than the login page,
// since they may already be logged in - just not authorized for this area.
function AdminRoute() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
