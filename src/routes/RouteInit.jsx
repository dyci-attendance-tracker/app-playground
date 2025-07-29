// src/components/RouteInit.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../contexts/LoaderContext";
import { initNavigation } from "../utils/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspace } from "../contexts/WorkspaceContext";

function RouteInit() {
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const auth = useAuth();
  const workspace = useWorkspace();

  useEffect(() => {
    initNavigation({ navigate, setLoading, auth, workspace });
  }, [navigate, setLoading, auth, workspace]);

  return null;
}

export default RouteInit;
