import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../contexts/OnboardingContext";
import onboardingYourName from "../../../assets/images/onboarding-your-name.png";
import { useAuth } from "../../../contexts/AuthContext";
import { useLoader } from "../../../contexts/LoaderContext";

function OnboardingStep2() {

    const { currentUser } = useAuth();
    const { formData, updateField, goToNextStep } = useOnboarding();
    const { setLoading } = useLoader();
    const [touched, setTouched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser?.name && !formData.name) {
            updateField("name", currentUser.name);
        }
    }, [currentUser, formData.name, updateField]);


    const handleNext = async () => {
        setLoading(true);
        setTouched(true);
        if (!formData.name.trim()) return;

        const success = await goToNextStep();
        if (!success) {
            setTimeout(() => {
                setLoading(false);
                if (success) navigate("/onboarding/step/3");
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col items-center text-center lg:p-6 max-w-lg mx-auto">
        <img
            src={onboardingYourName}
            alt="Who are you"
            className="w-full max-w-lg mb-2"
        />
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Let’s get to know you!</h2>
        <p className="text-gray-600 mb-6">
            What should we call you?
        </p>

        <input
            type="text"
            value={currentUser?.name || formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Your name"
            className={`w-full px-4 py-3 rounded-xl border ${
            touched && !formData.name.trim() ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2`}
        />
        {touched && !formData.name.trim() && (
            <p className="text-red-500 text-sm mb-4">Name is required.</p>
        )}

        <button
            onClick={handleNext}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full sm:w-auto"
        >
            Next
        </button>
        </div>
    );
}

export default OnboardingStep2;
