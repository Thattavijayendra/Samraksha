
// import React from 'react';
// import Layout from '../components/Layout';

// const MyPatients: React.FC = () => {
//   return (
//     <Layout title="My Patients">
//       <div className="text-center py-10">
//         <h2 className="text-2xl font-semibold text-gray-800">My Patients</h2>
//         <p className="mt-2 text-gray-600">This page will display a list of patients for the doctor.</p>
//       </div>
//     </Layout>
//   );
// };

// export default MyPatients;



// import React, { useEffect, useState } from 'react';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useAuth } from '../hooks/useAuth';

// interface Prescription {
//   id: string;
//   patientName: string;
//   age: string;
//   diagnosis: string;
//   createdAt?: any;
// }

// const MyPatients: React.FC = () => {
//   const { doctor } = useAuth();
//   const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPrescriptions = async () => {
//       if (!doctor?.uid) return;

//       const q = query(
//         collection(db, 'prescriptions'),
//         where('doctorId', '==', doctor.uid)
//       );

//       const querySnapshot = await getDocs(q);
//       const data = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Prescription[];

//       setPrescriptions(data);
//       setLoading(false);
//     };

//     fetchPrescriptions();
//   }, [doctor]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-teal-700 mb-4">My Patients</h1>

//       {loading ? (
//         <p>Loading prescriptions...</p>
//       ) : prescriptions.length === 0 ? (
//         <p className="text-gray-600">You have not created any prescriptions yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {prescriptions.map(prescription => (
//             <div
//               key={prescription.id}
//               className="p-4 bg-white rounded-xl shadow border border-gray-200"
//             >
//               <p><span className="font-semibold">Patient:</span> {prescription.patientName}</p>
//               <p><span className="font-semibold">Age:</span> {prescription.age}</p>
//               <p><span className="font-semibold">Diagnosis:</span> {prescription.diagnosis}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyPatients;





import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

interface Prescription {
  id: string;
  patientName: string;
  age: string;
  diagnosis: string;
  createdAt?: any;
}

const MyPatients: React.FC = () => {
  const { doctor } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!doctor?.email) return;

      const q = query(
        collection(db, 'prescriptions'),
        where('doctorEmail', '==', doctor.email)
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Prescription[];

      setPrescriptions(data);
      setLoading(false);
    };

    fetchPrescriptions();
  }, [doctor]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-teal-700 mb-4">My Patients</h1>

      {loading ? (
        <p>Loading prescriptions...</p>
      ) : prescriptions.length === 0 ? (
        <p className="text-gray-600">You have not created any prescriptions yet.</p>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(prescription => (
            <div
              key={prescription.id}
              className="p-4 bg-white rounded-xl shadow border border-gray-200"
            >
              <p><span className="font-semibold">Patient:</span> {prescription.patientName}</p>
              {/* <p><span className="font-semibold">Age:</span> {prescription.age}</p>
              <p><span className="font-semibold">Diagnosis:</span> {prescription.diagnosis}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPatients;
