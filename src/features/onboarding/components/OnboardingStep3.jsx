import React from 'react'
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../contexts/OnboardingContext";
import onboardingWelcomeAboard from '../../../assets/images/onboarding-welcome-aboard.png';

function OnboardingStep3() {

    const navigate = useNavigate();
    const { goToNextStep } = useOnboarding();

    const handleNext = async () => {
        const success = await goToNextStep();
        if (success) navigate("/attendance-tracker");
    };

    return (
        <div className="flex flex-col items-center text-center lg:p-6 max-w-lg mx-auto">
        <img
            src={onboardingWelcomeAboard}
            alt="Welcome Aboard"
            className="w-full max-w-lg mb-2"
        />
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Aboard!</h2>
        <p className="text-gray-600 mb-6">
            We're excited to have you on the platform. Let's get started!
        </p>
            <button
                onClick={handleNext}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full sm:w-auto"
            >
                Let's Go!
            </button>
        </div>
    )
}

export default OnboardingStep3