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
    const workspacePath = currentUser.workspaceID
      ? `/${currentUser.workspaceID}`
      : "/workspace/create";
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
    !currentUser.workspaceID &&
    currentUser.onboardingStep > 3 &&
    location.pathname !== "/workspace/create"
  ) {
    return <Navigate to="/workspace/create" replace />;
  }

  // 7️⃣ User has workspaceID but is not in it
  const workspacePath = `/${currentUser.workspaceID}/events`;
  if (
  currentUser.workspaceID &&
  !location.pathname.includes(`/${currentUser.workspaceID}/`) &&
  location.pathname !== "/workspace/create" &&
  !location.pathname.startsWith("/any/events/") &&
  location.pathname !== "/any/events/all" &&
  !location.pathname.startsWith(`/${currentUser.workspaceID}/profiles`)
) {
  return <Navigate to={`${workspacePath}/all`} replace />;
}

  // ✅ All good
  return children;
}
