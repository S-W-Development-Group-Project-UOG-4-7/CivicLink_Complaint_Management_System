// App.js
import React, { useState } from 'react';
import UserDetailForm from './pages/UserDetailForm';
import OtpVerification from './pages/OtpVerification';
import ComplaintForm from './pages/ComplaintForm';

function App() {
  const [step, setStep] = useState(1); // Step 1: User Details, Step 2: OTP, Step 3: Complaint
  const [userData, setUserData] = useState({}); // Store verified user details

  // Step 1: Handle user detail submission
  const handleUserSubmit = (data) => {
    setUserData(data);
    setStep(2);
  };

  // Step 2: Handle OTP verification
  const handleOtpSubmit = (otp) => {
    console.log('OTP verified:', otp, 'for user:', userData);
    setStep(3); // Move to complaint form
  };

  return (
    <div className="App">
      {step === 1 && <UserDetailForm onSubmit={handleUserSubmit} />}
      {step === 2 && <OtpVerification mobile={userData.phone} onSubmit={handleOtpSubmit} />}
      {step === 3 && <ComplaintForm userData={userData} />}
    </div>
  );
}

export default App;
