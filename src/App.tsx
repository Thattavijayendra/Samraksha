// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './hooks/useAuth';
// import LoadingSpinner from './components/LoadingSpinner';

// // Pages
// import Login from './pages/Login';
// import LicenseVerification from './pages/LicenseVerification';
// import Dashboard from './pages/Dashboard';
// import PrescriptionForm from './pages/PrescriptionForm';
// import QRPreview from './pages/QRPreview';
// import VerifyPage from './pages/VerifyPage';

// const App: React.FC = () => {
//   const { user, doctor, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
//         <LoadingSpinner size="lg" text="Loading Samraksha..." />
//       </div>
//     );
//   }

//   // If user is not logged in, show login
//   if (!user) {
//     return (
//       <Router>
//         <Routes>
//           <Route path="/verify" element={<VerifyPage />} />
//           <Route path="*" element={<Login />} />
//         </Routes>
//       </Router>
//     );
//   }

//   // If user is logged in but not verified, show license verification
//   if (!doctor?.verified) {
//     return (
//       <Router>
//         <Routes>
//           <Route path="/verify" element={<VerifyPage />} />
//           <Route path="*" element={<LicenseVerification />} />
//         </Routes>
//       </Router>
//     );
//   }

//   // If user is logged in and verified, show full app
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/prescription/new" element={<PrescriptionForm />} />
//         <Route path="/prescription/:id" element={<QRPreview />} />
//         <Route path="/verify" element={<VerifyPage />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;





import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Login from './pages/Login';
import LicenseVerification from './pages/LicenseVerification';
import Dashboard from './pages/Dashboard';
import PrescriptionForm from './pages/PrescriptionForm';
import QRPreview from './pages/QRPreview';
import VerifyPage from './pages/VerifyPage';
import MyPatient from './pages/MyPatient'; // ✅ Added import

const App: React.FC = () => {
  const { user, doctor, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Samraksha..." />
      </div>
    );
  }

  // 🔒 Not logged in → only allow login or verify page
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  // 🛡️ Logged in but not verified doctor
  if (!doctor?.verified) {
    return (
      <Router>
        <Routes>
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="*" element={<LicenseVerification />} />
        </Routes>
      </Router>
    );
  }

  // ✅ Verified doctor → show full app
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prescription/new" element={<PrescriptionForm />} />
        <Route path="/prescription/:id" element={<QRPreview />} />
        <Route path="/mypatients" element={<MyPatient/>} /> {/* ✅ New Route */}
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
