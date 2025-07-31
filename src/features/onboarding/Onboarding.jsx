import React from 'react';
import { Outlet } from 'react-router-dom';

function Onboarding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* This is where step components will render */}
      <Outlet />
    </div>
  );
}

export default Onboarding;
