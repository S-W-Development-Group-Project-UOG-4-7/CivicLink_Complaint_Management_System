import React, { useState } from 'react';
import UserDetailForm from './pages/UserDetailForm';
import OtpVerification from './pages/OtpVerification';

function App() {
  const [step, setStep] = useState(1); // Step 1: User Details, Step 2: OTP
  const [userData, setUserData] = useState({}); // Store verified user details

  const handleUserSubmit = (data) => {
    // Save user details and move to OTP verification
    setUserData(data);
    setStep(2);
  };

  const handleOtpSubmit = (otp) => {
    console.log('OTP verified:', otp, 'for user:', userData);
    // Here you can move to next step or show success message
  };

  return (
    <div>
      {step === 1 && <UserDetailForm onSubmit={handleUserSubmit} />}
      {step === 2 && <OtpVerification mobile={userData.phone} onSubmit={handleOtpSubmit} />}
    </div>
  );
}

export default App;
