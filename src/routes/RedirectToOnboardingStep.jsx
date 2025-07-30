import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function RedirectToOnboardingStep() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const lastStep = currentUser?.onboardingStep || 1;
        if (lastStep > 3) {
            navigate(`/${currentUser?.workspaceURL}`, { replace: true });
        }else{
            navigate(`/onboarding/step/${lastStep}`, { replace: true });
        }
    }, [currentUser, navigate]);

    return null;
}

export default RedirectToOnboardingStep;
