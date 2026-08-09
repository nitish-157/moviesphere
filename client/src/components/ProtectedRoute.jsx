import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Wrap any <Route> that requires a logged-in user with this.
// Unauthenticated visitors get bounced to /login, and we remember
// where they were headed so we can send them back after they sign in.
function ProtectedRoute() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
