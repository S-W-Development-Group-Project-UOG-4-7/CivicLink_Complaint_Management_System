// App.js
import React, { useState } from 'react';
import UserDetailForm from './pages/UserDetailForm';
import OtpVerification from './pages/OtpVerification';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintSuccess from './pages/ComplaintSuccess'; // or './civi/ComplaintSuccess' if it lives in civi

function App() {
  // 1: User Details, 2: OTP, 3: Complaint, 4: Success
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [referenceId, setReferenceId] = useState('');

  const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // replace with your key

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

  // Step 3: Complaint success handler
  const handleComplaintSuccess = (ref) => {
    setReferenceId(ref);
    setStep(4); // Go to success screen
  };

  const handleSubmitAnother = () => {
    setReferenceId('');
    setUserData({});
    setStep(1); // restart flow
  };

  const handleBackHome = () => {
    setStep(1);
  };

  return (
    <div className="App">
      {step === 1 && <UserDetailForm onSubmit={handleUserSubmit} />}
      {step === 2 && <OtpVerification mobile={userData.phone} onSubmit={handleOtpSubmit} />}
      {step === 3 && (
        <ComplaintForm
          userData={userData}
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          onSuccess={handleComplaintSuccess}
          // If you prefer direct URL redirect instead of step 4, you could pass:
          // successRedirectPath="/complaint/success"
        />
      )}
      {step === 4 && (
        <ComplaintSuccess
          referenceId={referenceId || 'CL-000000'}
          onSubmitAnother={handleSubmitAnother}
          onBackHome={handleBackHome}
        />
      )}
    </div>
  );
}

export default App;