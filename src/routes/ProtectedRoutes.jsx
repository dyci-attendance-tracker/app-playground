import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // 1️⃣ Not logged in → redirect to login
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const onboardingMatch = location.pathname.match(/^\/onboarding\/step\/(\d+)$/);
  const stepInURL = onboardingMatch ? parseInt(onboardingMatch[1]) : null;

  // 2️⃣ If trying to access a previous onboarding step, redirect to current step
  if (
    stepInURL !== null &&
    currentUser.onboardingStep !== undefined &&
    stepInURL < currentUser.onboardingStep
  ) {
    return <Navigate to={`/onboarding/step/${currentUser.onboardingStep}`} replace />;
  }

  // 4️⃣ Block onboarding routes if already completed
  if (
    location.pathname.startsWith("/onboarding") &&
    currentUser.onboardingStep >= 4
  ) {
    const workspacePath = currentUser.workspaceURL
      ? `/${currentUser.workspaceURL}`
      : "/attendance-tracker/workspace/create";
    return <Navigate to={workspacePath} replace />;
  }

  // 5️⃣ Force user to go through onboarding if not yet done
  if (
    currentUser.onboardingStep !== undefined &&
    currentUser.onboardingStep < 3 &&
    !location.pathname.startsWith("/onboarding")
  ) {
    return <Navigate to={`/onboarding/step/${currentUser.onboardingStep}`} replace />;
  }


  // 6️⃣ After onboarding: no workspace URL yet → go to workspace creation
  if (
    !currentUser.workspaceURL &&
    currentUser.onboardingStep >= 3 &&
    location.pathname !== "/attendance-tracker/workspace/create"
  ) {
    return <Navigate to="/attendance-tracker/workspace/create" replace />;
  }

  // 7️⃣ User has workspaceURL but is not in it
  const workspacePath = `/${currentUser.workspaceURL}/events`;
  if (
  currentUser.workspaceURL &&
  !location.pathname.startsWith(workspacePath) &&
  location.pathname !== "/attendance-tracker/workspace/create" &&
  !location.pathname.startsWith("/attendance-tracker/any/events/") &&
  location.pathname !== "/attendance-tracker/any/events/all"
) {
  return <Navigate to={`${workspacePath}/all`} replace />;
}

  // ✅ All good
  return children;
}
