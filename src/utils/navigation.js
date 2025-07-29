// src/utils/navigation.js
let navigateFn = null;
let setLoadingFn = null;
let authContext = null;
let workspaceContext = null;

export function initNavigation({ navigate, setLoading, auth, workspace }) {
  navigateFn = navigate;
  setLoadingFn = setLoading;
  authContext = auth;
  workspaceContext = workspace;
}

export async function navigatePage(url) {
  if (!navigateFn || !setLoadingFn) {
    console.error("Navigation not initialized");
    return;
  }

  setLoadingFn(true);
  try {
    navigateFn(url);
  } catch (error) {
    console.error("Failed to navigate:", error);
  } finally {
    setTimeout(() => {
      setLoadingFn(false);
    }, 1000);
  }
}

export async function changeWorkspace(workspaceURL) {
  if (!navigateFn || !setLoadingFn || !authContext || !workspaceContext) {
    console.error("Navigation not properly initialized");
    return;
  }

  const { updateUserWorkspaceURL, currentUser } = authContext;
  const { fetchWorkspaces } = workspaceContext;

  setLoadingFn(true);
  try {
    await updateUserWorkspaceURL(workspaceURL);
    currentUser.workspaceURL = workspaceURL;
    await fetchWorkspaces();
    navigateFn(`/${workspaceURL}`);
  } catch (error) {
    console.error("Failed to switch workspace:", error);
  } finally {
    setTimeout(() => {
      setLoadingFn(false);
    }, 1000);
  }
}
