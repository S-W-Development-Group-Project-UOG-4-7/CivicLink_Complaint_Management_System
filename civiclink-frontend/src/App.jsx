import React, { useState } from 'react';
import UserDetailForm from './pages/UserDetailForm';
import OtpVerification from './pages/OtpVerification';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintSuccess from './pages/ComplaintSuccess';
import MainLayout from './layouts/MainLayout';

function App() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [referenceId, setReferenceId] = useState('');

  const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

  const handleUserSubmit = (data) => {
    setUserData(data);
    setStep(2);
  };

  const handleOtpSubmit = (otp) => {
    setStep(3);
  };

  const handleComplaintSuccess = (ref) => {
    setReferenceId(ref);
    setStep(4);
  };

  const handleSubmitAnother = () => {
    setReferenceId('');
    setUserData({});
    setStep(1);
  };

  const handleBackHome = () => {
    setStep(1);
  };

  return (
    <MainLayout>
      {step === 1 && <UserDetailForm onSubmit={handleUserSubmit} />}
      {step === 2 && <OtpVerification mobile={userData.phone} onSubmit={handleOtpSubmit} />}
      {step === 3 && (
        <ComplaintForm
          userData={userData}
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          onSuccess={handleComplaintSuccess}
        />
      )}
      {step === 4 && (
        <ComplaintSuccess
          referenceId={referenceId || 'CL-000000'}
          onSubmitAnother={handleSubmitAnother}
          onBackHome={handleBackHome}
        />
      )}
    </MainLayout>
  );
}

export default App;
