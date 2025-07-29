import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to login
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  //Logged in but has no workspace URL
  if (!currentUser.workspaceURL && location.pathname !== "/attendance-tracker/workspace/create") {
    return <Navigate to="/attendance-tracker/workspace/create" replace />;
  }

  // Logged in and has workspace URL but not currently on the workspace route
  const workspacePath = `/${currentUser.workspaceURL}`;
  if (
    currentUser.workspaceURL &&
    !location.pathname.startsWith(workspacePath) &&
    location.pathname !== "/attendance-tracker/workspace/create" &&
    location.pathname !== "/attendance-tracker/any/events/all"
  ) {
    return <Navigate to={workspacePath} replace />;
  }

  // Either already at the correct route, or no redirect needed
  return children;
}
