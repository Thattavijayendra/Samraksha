// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FileText, QrCode, Search, Plus, Activity } from 'lucide-react';
// import Layout from '../components/Layout';
// import { useAuth } from '../hooks/useAuth';

// const Dashboard: React.FC = () => {
//   const { doctor } = useAuth();

//   return (
//     <Layout title="Doctor Dashboard">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Create Prescription Card */}
//         <Link
//           to="/prescription/new"
//           className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors">
//               <Plus className="w-6 h-6 text-teal-600" />
//             </div>
//             <FileText className="w-6 h-6 text-gray-400 group-hover:text-teal-500 transition-colors" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Prescription</h3>
//           <p className="text-gray-600 text-sm">
//             Generate a new secure prescription with QR code for your patient
//           </p>
//         </Link>

//         {/* Verify QR Card */}
//         <Link
//           to="/verify"
//           className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
//               <Search className="w-6 h-6 text-blue-600" />
//             </div>
//             <QrCode className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify QR Code</h3>
//           <p className="text-gray-600 text-sm">
//             Scan or upload QR codes to verify prescription authenticity
//           </p>
//         </Link>

//         {/* Doctor Profile Card */}
//         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
//               <Activity className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="flex items-center space-x-1">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span className="text-xs text-green-600 font-medium">Verified</span>
//             </div>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Profile</h3>
//           <div className="space-y-2">
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Name:</span> {doctor?.name}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">License:</span> {doctor?.license}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Email:</span> {doctor?.email}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-teal-600">0</div>
//             <div className="text-sm text-gray-600">Prescriptions Today</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-600">0</div>
//             <div className="text-sm text-gray-600">Total Prescriptions</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-green-600">100%</div>
//             <div className="text-sm text-gray-600">Verification Rate</div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;





// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FileText, Plus, Activity } from 'lucide-react'; // Removed Search, QrCode
// import Layout from '../components/Layout';
// import { useAuth } from '../hooks/useAuth';

// const Dashboard: React.FC = () => {
//   const { doctor } = useAuth();

//   return (
//     <Layout title="Doctor Dashboard">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Create Prescription Card */}
//         <Link
//           to="/prescription/new"
//           className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors">
//               <Plus className="w-6 h-6 text-teal-600" />
//             </div>
//             <FileText className="w-6 h-6 text-gray-400 group-hover:text-teal-500 transition-colors" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Prescription</h3>
//           <p className="text-gray-600 text-sm">
//             Generate a new secure prescription with QR code for your patient
//           </p>
//         </Link>

//         {/* Doctor Profile Card */}
//         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
//               <Activity className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="flex items-center space-x-1">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span className="text-xs text-green-600 font-medium">Verified</span>
//             </div>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Profile</h3>
//           <div className="space-y-2">
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Name:</span> {doctor?.name}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">License:</span> {doctor?.license}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Email:</span> {doctor?.email}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-teal-600">0</div>
//             <div className="text-sm text-gray-600">Prescriptions Today</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-600">0</div>
//             <div className="text-sm text-gray-600">Total Prescriptions</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-green-600">100%</div>
//             <div className="text-sm text-gray-600">Verification Rate</div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;


import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Activity } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { doctor } = useAuth();

  return (
    <Layout title="Doctor Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Create Prescription */}
        <Link
          to="/prescription/new"
          className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors">
              <Plus className="w-6 h-6 text-teal-600" />
            </div>
            <FileText className="w-6 h-6 text-gray-400 group-hover:text-teal-500 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Prescription</h3>
          <p className="text-gray-600 text-sm">
            Generate a new secure prescription with QR code for your patient
          </p>
        </Link>

        {/* 2. My Patients */}
        <Link
          to="/mypatients"
          className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex items-center justify-center w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors">
              👨‍⚕️
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Patients</h3>
          <p className="text-gray-600 text-sm">
            View all patients you've prescribed to recently
          </p>
        </Link>

        {/* 3. Doctor Profile */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600 font-medium">Verified</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Profile</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Name:</span> {doctor?.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">License:</span> {doctor?.license}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {doctor?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">0</div>
            <div className="text-sm text-gray-600">Prescriptions Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Total Prescriptions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-sm text-gray-600">Verification Rate</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
