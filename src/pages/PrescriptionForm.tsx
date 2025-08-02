import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { encryptData } from '../utils/encryption';
import { User, CreditCard, Phone, Pill, FileText, Calendar, Save } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/Layout';
import { Prescription } from '../types';

const PrescriptionForm: React.FC = () => {
  const navigate = useNavigate();
  const { doctor } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    patientName: '',
    aadhaar: '',
    phone: '',
    medicine: '',
    dosage: '',
    instructions: '',
    validityDays: 7
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;

    setLoading(true);
    setError('');

    try {
      const now = new Date();
      const expiry = new Date(now.getTime() + formData.validityDays * 24 * 60 * 60 * 1000);

      // Create prescription data for encryption
      const prescriptionData = {
        doctorEmail: doctor.email,
        doctorName: doctor.name,
        doctorLicense: doctor.license,
        patientName: formData.patientName,
        aadhaar: formData.aadhaar,
        phone: formData.phone,
        medicine: formData.medicine,
        dosage: formData.dosage,
        instructions: formData.instructions,
        expiry: expiry.toISOString(),
        timestamp: now.toISOString()
      };

      // Encrypt the data
      const encryptedData = encryptData(prescriptionData);

      // Prepare prescription document
      const prescription: Omit<Prescription, 'id'> = {
        doctorEmail: doctor.email,
        doctorName: doctor.name,
        patientName: formData.patientName,
        aadhaar: formData.aadhaar,
        phone: formData.phone,
        medicine: formData.medicine,
        dosage: formData.dosage,
        instructions: formData.instructions,
        validityDays: formData.validityDays,
        expiry: expiry.toISOString(),
        qrEncrypted: encryptedData,
        timestamp: now.toISOString()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'prescriptions'), prescription);
      
      // Navigate to QR preview with prescription ID
      navigate(`/prescription/${docRef.id}`);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout title="Create New Prescription">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-teal-600" />
                <span>Patient Information</span>
              </h3>
            </div>

            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                Patient Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="patientName"
                  name="patientName"
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Enter patient's full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Number *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="aadhaar"
                  name="aadhaar"
                  type="text"
                  required
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="1234-5678-9012"
                  maxLength={14}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label htmlFor="validityDays" className="block text-sm font-medium text-gray-700 mb-2">
                Validity (Days) *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  id="validityDays"
                  name="validityDays"
                  required
                  value={formData.validityDays}
                  onChange={handleInputChange}
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                  <option value={1}>1 Day</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days</option>
                  <option value={15}>15 Days</option>
                  <option value={30}>30 Days</option>
                </select>
              </div>
            </div>

            {/* Prescription Details */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <span>Prescription Details</span>
              </h3>
            </div>

            <div>
              <label htmlFor="medicine" className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name *
              </label>
              <div className="relative">
                <Pill className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="medicine"
                  name="medicine"
                  type="text"
                  required
                  value={formData.medicine}
                  onChange={handleInputChange}
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="e.g., Amoxicillin 500mg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                id="dosage"
                name="dosage"
                type="text"
                required
                value={formData.dosage}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="e.g., 1 tablet twice daily"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                Instructions *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="instructions"
                  name="instructions"
                  required
                  rows={3}
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  placeholder="e.g., Take after meals. Complete the course even if you feel better."
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all disabled:opacity-50 font-medium"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Generate Prescription</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PrescriptionForm;