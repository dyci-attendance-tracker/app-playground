import React from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../contexts/OnboardingContext";
import onboardingWelcome from "../../../assets/images/onboarding-welcome-message.png";

function OnboardingStep1() {
  const { goToNextStep } = useOnboarding();
  const navigate = useNavigate();

  const handleNext = async () => {
    const success = await goToNextStep();
    if (success) navigate("/onboarding/step/2");
  };

  return (
    <div className="flex flex-col items-center text-center lg:px-4 lg:py-8 md:py-12">
        <img
            src={onboardingWelcome}
            alt="Welcome"
            className="w-full sm:max-w-lg md:max-w-lg lg:max-w-lg mb-6 transition-all duration-300"
        />
        <h2 className="text-color text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            Welcome to the Attendance Tracker!
        </h2>
        <p className="text-color-secondary text-sm sm:text-base mb-8 max-w-md">
            We're excited to have you here. Let’s get you set up in just a few steps.
        </p>
        <button
            onClick={handleNext}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-xl hover:bg-blue-700 transition"
        >
            Get Started
        </button>
    </div>
  );
}

export default OnboardingStep1;
