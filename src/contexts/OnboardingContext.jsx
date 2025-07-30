import { createContext, useContext, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const OnboardingContext = createContext();
export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }) => {
    const { currentUser, setCurrentUser } = useAuth(); // <-- You need to expose this in AuthContext
    const [step, setStep] = useState(currentUser?.onboardingStep || 1);
    const [formData, setFormData] = useState({
        name: "",
        organization: "",
    });

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateStep = () => {
        if (step === 1) return true; // Step 1 needs no validation
        if (step === 2 && !formData.name) return false;
        if (step === 3 ) return true;
        return true;
    };

    const goToNextStep = async () => {
        if (!validateStep()) return false;

        const nextStep = step + 1;
        setStep(nextStep);

        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
            onboardingStep: nextStep,
            ...formData,
        });

        if (setCurrentUser) {
            await new Promise((resolve) => {
            setCurrentUser((prev) => {
                resolve();
                return {
                ...prev,
                onboardingStep: nextStep,
                ...formData,
                };
            });
            });
        }

        return true;
    };


    const value = {
        step,
        formData,
        updateField,
        validateStep,
        goToNextStep,
    };

    return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};
